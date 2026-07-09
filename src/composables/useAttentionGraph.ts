/**
 * useAttentionGraph — Visual Scene Graph Attention System
 *
 * 核心范式：页面是连续注意力场，不是场景序列
 * ─────────────────────────────────────────────────────────
 * 从 "scene switching" → "attention redistribution"
 * 从 "active/context/inactive" → "weighted visibility graph"
 * 从 "scroll = scene change" → "scroll = attention redistribution"
 *
 * Scene Graph 结构：
 * - ROOT:     Hero — 唯一光源 + attention origin，永远存在
 * - CLUSTER:  Projects — 包含多个 nodes（cards）
 * - NARRATIVE: Blog — sequential nodes (flow-based)
 * - ANCHOR:   About — static low-motion reference
 *
 * Attention Distribution Model:
 * - hero:     1.0 (永远存在，anchor light field)
 * - projects: 0.6 (attention sink)
 * - blog:     0.4 (narrative flow)
 * - about:    0.3 (static reference)
 *
 * 关键规则：
 * ❌ 不允许 scene-level hiding
 * ❌ 不允许 full inactive state
 * ❌ 不允许 scroll-based switching
 * ❌ hover ≠ scene takeover
 *
 * ✔ Hero 永远存在（anchor light field）
 * ✔ Projects/Blog/About 是 attention sinks
 * ✔ attention 是连续分布，而不是切换
 * ✔ hover = local attention spike only
 *
 * UI渲染规则：
 * - PRIMARY NODE:   opacity:1, translateY(0), z-index:max
 * - SECONDARY NODE: opacity:0.5~0.7, translateY(8px), interaction enabled
 * - BACKGROUND NODE: opacity:0.25~0.45, translateY(16px), interaction enabled
 *
 * CSS变量输出：
 * - --attention-weight: 0~1 连续值（每个节点独立）
 * - --vag-cluster-opacity: cluster层级opacity（覆盖:root默认值）
 * - --vag-background-opacity: background层级opacity（覆盖:root默认值）
 * - --attention-translateY: 映射后偏移
 * - data-attention-level: "primary" | "cluster" | "background"
 *
 * 设计约束：
 * - 单例模式：全局只初始化一次
 * - 连续插值：scroll改变attention权重，不是切换状态
 * - reduced-motion下禁用transform，保留opacity连续变化
 */

import { ref, readonly, onMounted, onUnmounted } from 'vue'

// ═══════════════════════════════════════════════════════════
//  Types
// ═══════════════════════════════════════════════════════════

export type AttentionLevel = 'primary' | 'cluster' | 'background'

export type SceneNodeId = 'hero' | 'projects' | 'blog' | 'about'

export type SceneNodeType = 'root' | 'cluster' | 'narrative' | 'anchor'

/** Scene Graph Node */
export interface SceneNode {
  id: SceneNodeId
  type: SceneNodeType
  /** 父节点ID（root无父节点） */
  parentId?: string
  /** 子节点ID列表 */
  children?: string[]
  /** 基础注意力权重 0~1 */
  baseWeight: number
  /** 空间深度 z-layer */
  spatialDepth: number
  /** 视觉优先级 rendering order */
  visualPriority: number
}

/** 节点运行时状态 */
interface NodeRuntime {
  element: HTMLElement
  /** 当前注意力权重 0~1（连续值，由scroll+viewport计算） */
  currentWeight: number
  /** 目标注意力权重（scroll驱动） */
  targetWeight: number
  /** hover临时权重增量 */
  hoverBoost: number
  /** 当前attention level */
  level: AttentionLevel
}

// ═══════════════════════════════════════════════════════════
//  Scene Graph Definition
// ═══════════════════════════════════════════════════════════

const SCENE_GRAPH: Record<SceneNodeId, SceneNode> = {
  hero: {
    id: 'hero',
    type: 'root',
    baseWeight: 1.0,
    spatialDepth: 0,
    visualPriority: 100,
  },
  projects: {
    id: 'projects',
    type: 'cluster',
    baseWeight: 0.6,
    spatialDepth: 1,
    visualPriority: 80,
  },
  blog: {
    id: 'blog',
    type: 'narrative',
    baseWeight: 0.4,
    spatialDepth: 2,
    visualPriority: 60,
  },
  about: {
    id: 'about',
    type: 'anchor',
    baseWeight: 0.3,
    spatialDepth: 3,
    visualPriority: 40,
  },
}

// ═══════════════════════════════════════════════════════════
//  Attention → Level Mapping
// ═══════════════════════════════════════════════════════════

/**
 * 连续权重 → 离散Level
 * - weight >= 0.7 → primary
 * - weight >= 0.3 → cluster
 * - weight < 0.3  → background
 */
const weightToLevel = (weight: number): AttentionLevel => {
  if (weight >= 0.7) return 'primary'
  if (weight >= 0.3) return 'cluster'
  return 'background'
}

/**
 * 连续权重 → CSS opacity
 * PRIMARY: 1.0, SECONDARY: 0.5~0.7, BACKGROUND: 0.25~0.45
 */
const weightToOpacity = (weight: number): number => {
  if (weight >= 0.7) return 1.0
  if (weight >= 0.3) return 0.5 + (weight - 0.3) * 0.5
  return 0.25 + weight * 0.67
}

/**
 * 连续权重 → CSS translateY
 * PRIMARY: 0px, SECONDARY: 8px, BACKGROUND: 16px
 */
const weightToTranslateY = (weight: number): number => {
  if (weight >= 0.7) return 0
  if (weight >= 0.3) return 8
  return 16
}

// ═══════════════════════════════════════════════════════════
//  Singleton State
// ═══════════════════════════════════════════════════════════

let instanceCount = 0

/** 当前primary节点ID */
const primaryNodeId = ref<SceneNodeId>('hero')

/** 节点运行时状态 */
const nodeRuntimes = new Map<SceneNodeId, NodeRuntime>()

/** IntersectionObserver实例 */
let observer: IntersectionObserver | null = null

/** 插值RAF */
let interpolationRafId: number | null = null

/** reduced-motion偏好 */
let prefersReducedMotion = false

/** 插值速率 */
const LERP_RATE = 0.08

// ═══════════════════════════════════════════════════════════
//  Attention Calculation
// ═══════════════════════════════════════════════════════════

/**
 * 计算节点目标注意力权重
 * 基于：viewport可见比例 + viewport中心距离 + 基础权重
 *
 * 核心逻辑：
 * - Hero(root) 永远有基础权重1.0，但随scroll离开viewport会衰减
 * - 其他节点权重 = baseWeight × viewportFactor
 * - viewportFactor = visibility × (1 - centerDistance × 0.4)
 */
const computeTargetWeight = (id: SceneNodeId, visibility: number, centerDistance: number): number => {
  const node = SCENE_GRAPH[id]
  if (!node) return 0

  // viewportFactor: 可见性 × 中心距离衰减
  const viewportFactor = visibility * (1 - centerDistance * 0.4)

  if (node.type === 'root') {
    // Hero永远存在：最低0.3，最高1.0
    // 即使完全离开viewport，仍有0.3的anchor weight
    return Math.max(0.3, node.baseWeight * viewportFactor)
  }

  // 其他节点：基础权重 × viewportFactor
  // 完全不可见时为0
  return node.baseWeight * viewportFactor
}

/**
 * 计算viewport中心距离
 * 0 = 正中心, 1 = 完全在viewport外
 */
const computeCenterDistance = (element: HTMLElement): number => {
  const rect = element.getBoundingClientRect()
  const elementCenterY = rect.top + rect.height / 2
  const viewportCenterY = window.innerHeight / 2
  const maxDistance = window.innerHeight / 2
  const distance = Math.abs(elementCenterY - viewportCenterY)
  return Math.min(distance / maxDistance, 1)
}

// ═══════════════════════════════════════════════════════════
//  Continuous Interpolation
// ═══════════════════════════════════════════════════════════

/**
 * 平滑插值 — 每帧将currentWeight向targetWeight靠近
 * 创造连续的注意力场流动感
 */
const interpolateWeights = () => {
  let primaryWeight = 0
  let primaryId: SceneNodeId = 'hero'

  nodeRuntimes.forEach((runtime, id) => {
    // 加上hover boost
    const target = runtime.targetWeight + runtime.hoverBoost
    const clampedTarget = Math.min(target, 1.0)

    // lerp插值
    runtime.currentWeight += (clampedTarget - runtime.currentWeight) * LERP_RATE

    // 计算level
    runtime.level = weightToLevel(runtime.currentWeight)

    // 应用CSS变量到元素
    applyAttentionToElement(runtime)

    // 追踪primary
    if (runtime.currentWeight > primaryWeight) {
      primaryWeight = runtime.currentWeight
      primaryId = id
    }
  })

  // 更新primary节点
  if (primaryId !== primaryNodeId.value) {
    primaryNodeId.value = primaryId
  }

  // 继续插值循环
  let needsUpdate = false
  nodeRuntimes.forEach(runtime => {
    if (Math.abs(runtime.currentWeight - runtime.targetWeight - runtime.hoverBoost) > 0.001) {
      needsUpdate = true
    }
  })

  if (needsUpdate) {
    interpolationRafId = requestAnimationFrame(interpolateWeights)
  } else {
    interpolationRafId = null
  }
}

/**
 * 将注意力权重应用到元素CSS变量
 */
const applyAttentionToElement = (runtime: NodeRuntime) => {
  const el = runtime.element
  const weight = runtime.currentWeight
  const level = runtime.level

  // data-attention-level 属性（CSS硬约束用）
  el.setAttribute('data-attention-level', level)

  // 连续CSS变量（组件可消费）
  el.style.setProperty('--attention-weight', weight.toFixed(3))
  // 设置VAG层级变量，覆盖:root默认值实现连续插值
  const opacity = weightToOpacity(weight)
  if (level === 'cluster') {
    el.style.setProperty('--vag-cluster-opacity', opacity.toFixed(3))
  } else if (level === 'background') {
    el.style.setProperty('--vag-background-opacity', opacity.toFixed(3))
  }
  el.style.setProperty('--attention-translateY', `${weightToTranslateY(weight).toFixed(1)}px`)
}

/**
 * 调度插值循环
 */
const scheduleInterpolation = () => {
  if (interpolationRafId !== null) return
  interpolationRafId = requestAnimationFrame(interpolateWeights)
}

// ═══════════════════════════════════════════════════════════
//  IntersectionObserver
// ═══════════════════════════════════════════════════════════

const setupObserver = () => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('data-attention-id') as SceneNodeId
        if (id && nodeRuntimes.has(id)) {
          const runtime = nodeRuntimes.get(id)!
          const centerDistance = computeCenterDistance(runtime.element)
          // 计算新的目标权重
          runtime.targetWeight = computeTargetWeight(id, entry.intersectionRatio, centerDistance)
          scheduleInterpolation()
        }
      })
    },
    {
      threshold: [0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      rootMargin: '-5% 0px -5% 0px',
    }
  )
}

// ═══════════════════════════════════════════════════════════
//  Scroll Handler — viewport-center recalculation
// ═══════════════════════════════════════════════════════════

let scrollHandler: (() => void) | null = null

const setupScrollHandler = () => {
  let scrollRafId: number | null = null

  scrollHandler = () => {
    if (scrollRafId !== null) return
    scrollRafId = requestAnimationFrame(() => {
      // 重新计算所有节点的centerDistance和targetWeight
      nodeRuntimes.forEach((runtime, id) => {
        const rect = runtime.element.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        // 计算可见比例（粗略）
        const visibleTop = Math.max(rect.top, 0)
        const visibleBottom = Math.min(rect.bottom, viewportHeight)
        const visibleHeight = Math.max(visibleBottom - visibleTop, 0)
        const visibility = Math.min(visibleHeight / rect.height, 1)
        const centerDistance = computeCenterDistance(runtime.element)
        runtime.targetWeight = computeTargetWeight(id, visibility, centerDistance)
      })
      scheduleInterpolation()
      scrollRafId = null
    })
  }

  window.addEventListener('scroll', scrollHandler, { passive: true })
}

// ═══════════════════════════════════════════════════════════
//  Public API
// ═══════════════════════════════════════════════════════════

/** 注册一个场景节点 */
const registerNode = (element: HTMLElement, id: SceneNodeId) => {
  if (nodeRuntimes.has(id)) return

  const node = SCENE_GRAPH[id]
  if (!node) return

  // 初始权重：hero=1.0，其他=0（将随scroll渐入）
  const initialWeight = node.type === 'root' ? node.baseWeight : 0

  nodeRuntimes.set(id, {
    element,
    currentWeight: initialWeight,
    targetWeight: initialWeight,
    hoverBoost: 0,
    level: weightToLevel(initialWeight),
  })

  // 设置data-attention-id属性（IO用）
  element.setAttribute('data-attention-id', id)

  // 初始应用
  const runtime = nodeRuntimes.get(id)!
  applyAttentionToElement(runtime)

  // 开始观察
  observer?.observe(element)
}

/** 注销一个场景节点 */
const unregisterNode = (id: SceneNodeId) => {
  const runtime = nodeRuntimes.get(id)
  if (runtime) {
    observer?.unobserve(runtime.element)
    runtime.element.removeAttribute('data-attention-id')
    runtime.element.removeAttribute('data-attention-level')
    runtime.element.style.removeProperty('--attention-weight')
    runtime.element.style.removeProperty('--vag-cluster-opacity')
    runtime.element.style.removeProperty('--vag-background-opacity')
    runtime.element.style.removeProperty('--attention-translateY')
    nodeRuntimes.delete(id)
  }
}

/**
 * 请求局部注意力提升 — hover = local attention spike only
 * 不改变全局场景状态，不触发active/context切换
 */
const requestAttentionSpike = (id: SceneNodeId, boost: number = 0.2) => {
  const runtime = nodeRuntimes.get(id)
  if (runtime) {
    runtime.hoverBoost = boost
    scheduleInterpolation()
  }
}

/** 释放局部注意力提升 */
const releaseAttentionSpike = (id: SceneNodeId) => {
  const runtime = nodeRuntimes.get(id)
  if (runtime) {
    runtime.hoverBoost = 0
    scheduleInterpolation()
  }
}

/** 获取指定节点的当前注意力权重 */
const getAttentionWeight = (id: SceneNodeId): number => {
  return nodeRuntimes.get(id)?.currentWeight ?? 0
}

/** 获取指定节点的当前level */
const getAttentionLevel = (id: SceneNodeId): AttentionLevel => {
  return nodeRuntimes.get(id)?.level ?? 'background'
}

// ═══════════════════════════════════════════════════════════
//  Composable Export (Singleton)
// ═══════════════════════════════════════════════════════════

export function useAttentionGraph() {
  onMounted(() => {
    instanceCount++
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // 监听reduced-motion变化
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleMotionChange = () => {
      prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
    motionQuery.addEventListener('change', handleMotionChange)

    // 初始化Observer
    if (!observer) {
      setupObserver()
    }

    // 初始化Scroll Handler
    setupScrollHandler()
  })

  onUnmounted(() => {
    instanceCount--
    if (instanceCount <= 0) {
      instanceCount = 0
      // 清理单例
      if (observer) {
        observer.disconnect()
        observer = null
      }
      if (scrollHandler) {
        window.removeEventListener('scroll', scrollHandler)
        scrollHandler = null
      }
      nodeRuntimes.clear()
      if (interpolationRafId !== null) {
        cancelAnimationFrame(interpolationRafId)
        interpolationRafId = null
      }
    }
  })

  return {
    primaryNodeId: readonly(primaryNodeId),
    registerNode,
    unregisterNode,
    requestAttentionSpike,
    releaseAttentionSpike,
    getAttentionWeight,
    getAttentionLevel,
    SCENE_GRAPH,
  }
}