/**
 * useScrollParallax — 5层Z空间深度视差系统 + Scroll Velocity Tracking
 *
 * 核心原理：
 * - 监听scroll事件（passive + RAF节流）
 * - 根据scrollY计算各层parallax offset
 * - 输出CSS custom properties到document.documentElement
 * - 支持reduced-motion（禁用parallax）
 *
 * 5层深度架构：
 *   Layer A: background field     — rate: -0.3 (最远最慢，反向慢移)
 *   Layer B: ambient glow blobs   — rate: -0.15 (中远)
 *   Layer C: content surface      — rate: 0 (正常scroll)
 *   Layer D: interactive cards    — rate: 0 (正常，hover elevation)
 *   Layer E: foreground highlight — rate: 0.05 (最近最快，微微快移)
 *
 * Scroll Velocity Tracking (v2.0):
 * - 跟踪滚动速度，输出CSS变量 --scroll-velocity (0-1范围)
 * - 快速滚动时：环境光斑opacity增加、视差偏移放大
 * - 慢速/停止时：恢复正常状态
 * - velocity衰减使用exponential decay (factor 0.95)
 *
 * CSS变量输出：
 *   --parallax-a: Layer A偏移量(px)
 *   --parallax-b: Layer B偏移量(px)
 *   --parallax-c: 始终为0
 *   --parallax-d: 始终为0
 *   --parallax-e: Layer E偏移量(px)
 *   --scroll-velocity: 滚动速度(0-1范围，快速滚动时接近1)
 *
 * 设计约束：
 * - 单例模式：全局只初始化一次
 * - reduced-motion: 所有parallax offset归零，velocity=0
 * - 性能：RAF节流 + will-change + passive scroll
 */

import { onMounted, onUnmounted } from 'vue'

/** 各层parallax速率 — 负值=反向慢移(远)，正值=快移(近)，0=正常 */
const PARALLAX_RATES = {
  a: -0.3,   // 最远：反向慢移，创造深度
  b: -0.15,  // 中远：轻微反向
  c: 0,      // 正常：内容层
  d: 0,      // 正常：交互卡片层
  e: 0.05,   // 最近：微微快移，前景感
} as const

/** Scroll Velocity 配置 */
const VELOCITY_DECAY = 0.95       // exponential decay factor
const VELOCITY_MAX = 3000         // 最大滚动速度(px/s)，用于归一化
const _VELOCITY_SMOOTHING = 0.3    // velocity平滑因子

/** 单例状态 */
let instanceCount = 0
let rafId: number | null = null
let velocityRafId: number | null = null
let prefersReducedMotion = false
let currentScrollY = 0
let lastScrollY = 0
let lastScrollTime = 0
let rawVelocity = 0               // 原始滚动速度(px/s)
let smoothVelocity = 0            // 平滑后的速度(0-1)
let reducedMotionMedia: MediaQueryList | null = null

/** 计算各层parallax offset并写入CSS变量 */
const updateParallax = () => {
  const root = document.documentElement
  if (!root) return

  if (prefersReducedMotion) {
    // reduced-motion: 所有偏移归零
    root.style.setProperty('--parallax-a', '0')
    root.style.setProperty('--parallax-b', '0')
    root.style.setProperty('--parallax-c', '0')
    root.style.setProperty('--parallax-d', '0')
    root.style.setProperty('--parallax-e', '0')
    root.style.setProperty('--scroll-velocity', '0')
    return
  }

  const scrollY = currentScrollY

  // 视差偏移 = scrollY * rate，velocity影响放大系数
  const velocityMultiplier = 1 + smoothVelocity * 0.3 // 快速滚动时视差放大30%

  // 各层偏移 = scrollY * rate * velocityMultiplier
  root.style.setProperty('--parallax-a', `${scrollY * PARALLAX_RATES.a * velocityMultiplier}`)
  root.style.setProperty('--parallax-b', `${scrollY * PARALLAX_RATES.b * velocityMultiplier}`)
  root.style.setProperty('--parallax-c', '0')
  root.style.setProperty('--parallax-d', '0')
  root.style.setProperty('--parallax-e', `${scrollY * PARALLAX_RATES.e * velocityMultiplier}`)

  // 输出scroll velocity (0-1)
  root.style.setProperty('--scroll-velocity', `${smoothVelocity}`)
}

/** RAF循环 — velocity exponential decay */
const updateVelocity = () => {
  // exponential decay: velocity逐渐衰减到0
  rawVelocity *= VELOCITY_DECAY
  smoothVelocity = Math.min(Math.abs(rawVelocity) / VELOCITY_MAX, 1)

  // 当velocity很小时归零
  if (Math.abs(rawVelocity) < 0.1) {
    rawVelocity = 0
    smoothVelocity = 0
  }

  updateParallax()

  // 继续衰减直到接近0
  if (smoothVelocity > 0.001) {
    velocityRafId = requestAnimationFrame(updateVelocity)
  } else {
    smoothVelocity = 0
    rawVelocity = 0
    updateParallax()
    velocityRafId = null
  }
}

/** RAF节流的scroll handler */
const onScroll = () => {
  if (rafId !== null) return
  rafId = requestAnimationFrame(() => {
    const now = performance.now()
    const deltaY = window.scrollY - lastScrollY
    const deltaTime = now - lastScrollTime

    // 计算滚动速度(px/s)
    if (deltaTime > 0) {
      rawVelocity = (deltaY / deltaTime) * 1000 // px/s
    }

    lastScrollY = window.scrollY
    lastScrollTime = now
    currentScrollY = window.scrollY

    updateParallax()

    // 启动velocity衰减循环
    if (velocityRafId === null && Math.abs(rawVelocity) > 0.1) {
      velocityRafId = requestAnimationFrame(updateVelocity)
    }

    rafId = null
  })
}

/** reduced-motion偏好变化处理 */
const handleReducedMotionChange = (e: MediaQueryListEvent) => {
  prefersReducedMotion = e.matches
  updateParallax()
}

/**
 * useScrollParallax — 5层Z空间视差 + Scroll Velocity composable
 *
 * 使用方式：在Home.vue中调用一次
 * 各层通过CSS变量 --parallax-a/b/c/d/e 自动响应scroll
 * --scroll-velocity 输出滚动速度(0-1)，可用于环境光斑等效果
 */
export function useScrollParallax() {
  onMounted(() => {
    instanceCount++

    // 只在第一个实例时注册事件
    if (instanceCount === 1) {
      // 检测reduced-motion偏好
      reducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
      prefersReducedMotion = reducedMotionMedia.matches

      // 初始化CSS变量
      const root = document.documentElement
      root.style.setProperty('--parallax-a', '0')
      root.style.setProperty('--parallax-b', '0')
      root.style.setProperty('--parallax-c', '0')
      root.style.setProperty('--parallax-d', '0')
      root.style.setProperty('--parallax-e', '0')
      root.style.setProperty('--scroll-velocity', '0')

      // 初始化scroll tracking
      lastScrollY = window.scrollY
      lastScrollTime = performance.now()
      currentScrollY = window.scrollY

      // 注册scroll事件（passive）
      window.addEventListener('scroll', onScroll, { passive: true })

      // 监听reduced-motion偏好变化
      reducedMotionMedia.addEventListener('change', handleReducedMotionChange)

      // 初始计算
      updateParallax()
    }
  })

  onUnmounted(() => {
    instanceCount--

    // 最后一个实例卸载时清理
    if (instanceCount <= 0) {
      instanceCount = 0

      if (rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }

      if (velocityRafId !== null) {
        cancelAnimationFrame(velocityRafId)
        velocityRafId = null
      }

      window.removeEventListener('scroll', onScroll)

      if (reducedMotionMedia) {
        reducedMotionMedia.removeEventListener('change', handleReducedMotionChange)
        reducedMotionMedia = null
      }

      // 清理CSS变量
      const root = document.documentElement
      root.style.removeProperty('--parallax-a')
      root.style.removeProperty('--parallax-b')
      root.style.removeProperty('--parallax-c')
      root.style.removeProperty('--parallax-d')
      root.style.removeProperty('--parallax-e')
      root.style.removeProperty('--scroll-velocity')
    }
  })
}