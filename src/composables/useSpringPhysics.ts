/**
 * useSpringPhysics — 弹簧物理动效系统
 *
 * 核心原理：
 * - 弹簧函数 spring(current, target, stiffness, damping) 实现物理过冲
 * - 每帧通过RAF计算弹簧值，驱动transform
 * - stiffness: 0.15 (弹性系数)，damping: 0.8 (阻尼系数)
 * - 轻微过冲后快速稳定，模拟真实物理反馈
 *
 * 使用方式：
 * ```ts
 * const { springValue, setTarget, stop } = useSpringPhysics(initialValue)
 * // 设置目标值，弹簧自动过渡
 * setTarget(10)
 * // 在模板中绑定 springValue
 * ```
 *
 * 设计约束：
 * - reduced-motion: 禁用弹簧，直接设置目标值
 * - 单个弹簧实例管理一个数值维度
 * - 支持多维弹簧（如translateY + translateZ）
 */

import { ref, onMounted, onUnmounted, type Ref } from 'vue'

/** 弹簧默认参数 */
const DEFAULT_STIFFNESS = 0.15
const DEFAULT_DAMPING = 0.8
const VELOCITY_THRESHOLD = 0.001
const DISPLACEMENT_THRESHOLD = 0.001

export interface SpringConfig {
  /** 弹性系数 — 值越大回弹越快 */
  stiffness?: number
  /** 阻尼系数 — 值越大过冲越小，0.8=轻微过冲快速稳定 */
  damping?: number
  /** 初始值 */
  initial?: number
  /** 精度阈值 — 低于此值停止计算 */
  precision?: number
}

/**
 * 纯弹簧计算函数
 *
 * @param current 当前值
 * @param target 目标值
 * @param velocity 当前速度
 * @param stiffness 弹性系数
 * @param damping 阻尼系数
 * @returns [新值, 新速度]
 */
export function springStep(
  current: number,
  target: number,
  velocity: number,
  stiffness: number = DEFAULT_STIFFNESS,
  damping: number = DEFAULT_DAMPING
): [number, number] {
  const displacement = target - current
  const springForce = displacement * stiffness
  const simpleVelocity = (velocity + springForce) * (1 - damping)
  const newValue = current + simpleVelocity
  return [newValue, simpleVelocity]
}

/**
 * useSpringPhysics — 单值弹簧composable
 *
 * 管理一个数值的弹簧动画，返回响应式ref
 */
export function useSpringPhysics(config: SpringConfig = {}) {
  const {
    stiffness = DEFAULT_STIFFNESS,
    damping = DEFAULT_DAMPING,
    initial = 0,
    precision = DISPLACEMENT_THRESHOLD,
  } = config

  const springValue = ref(initial)
  let targetValue = initial
  let velocity = 0
  let rafId: number | null = null
  let prefersReducedMotion = false
  let isRunning = false

  /** RAF循环 — 每帧计算弹簧值 */
  const tick = () => {
    if (prefersReducedMotion) {
      // reduced-motion: 直接设置目标值
      springValue.value = targetValue
      velocity = 0
      isRunning = false
      return
    }

    const displacement = targetValue - springValue.value
    const springForce = displacement * stiffness
    velocity = (velocity + springForce) * (1 - damping)
    springValue.value = springValue.value + velocity

    // 检查是否稳定
    if (
      Math.abs(velocity) < VELOCITY_THRESHOLD &&
      Math.abs(displacement) < precision
    ) {
      springValue.value = targetValue
      velocity = 0
      isRunning = false
      return
    }

    rafId = requestAnimationFrame(tick)
  }

  /** 启动RAF循环（如果未运行） */
  const startLoop = () => {
    if (!isRunning) {
      isRunning = true
      rafId = requestAnimationFrame(tick)
    }
  }

  /** 设置弹簧目标值 */
  const setTarget = (value: number) => {
    targetValue = value
    startLoop()
  }

  /** 立即设置值（无弹簧动画） */
  const setValue = (value: number) => {
    targetValue = value
    springValue.value = value
    velocity = 0
  }

  /** 停止弹簧动画 */
  const stop = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    isRunning = false
    velocity = 0
  }

  onMounted(() => {
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  onUnmounted(() => {
    stop()
  })

  return {
    /** 弹簧当前值（响应式ref） */
    springValue,
    /** 设置弹簧目标值 */
    setTarget,
    /** 立即设置值（无弹簧） */
    setValue,
    /** 停止弹簧动画 */
    stop,
  }
}

/**
 * useMultiSpring — 多维弹簧composable
 *
 * 管理多个数值的弹簧动画（如translateY + translateZ）
 * 共享一个RAF循环以提高性能
 */
export function useMultiSpring(keys: string[], config: SpringConfig = {}) {
  const {
    stiffness = DEFAULT_STIFFNESS,
    damping = DEFAULT_DAMPING,
    precision = DISPLACEMENT_THRESHOLD,
  } = config

  // 每个key的状态
  const state: Record<string, {
    value: Ref<number>
    target: number
    velocity: number
  }> = {}

  const result: Record<string, Ref<number>> = {}

  keys.forEach(key => {
    const initial = config.initial ?? 0
    const refVal = ref(initial)
    state[key] = { value: refVal, target: initial, velocity: 0 }
    result[key] = refVal
  })

  let rafId: number | null = null
  let prefersReducedMotion = false
  let isRunning = false

  /** RAF循环 */
  const tick = () => {
    if (prefersReducedMotion) {
      keys.forEach(key => {
        const s = state[key]
        s.value.value = s.target
        s.velocity = 0
      })
      isRunning = false
      return
    }

    let allSettled = true

    keys.forEach(key => {
      const s = state[key]
      const displacement = s.target - s.value.value
      const springForce = displacement * stiffness
      s.velocity = (s.velocity + springForce) * (1 - damping)
      s.value.value = s.value.value + s.velocity

      if (
        Math.abs(s.velocity) >= VELOCITY_THRESHOLD ||
        Math.abs(displacement) >= precision
      ) {
        allSettled = false
      } else {
        s.value.value = s.target
        s.velocity = 0
      }
    })

    if (allSettled) {
      isRunning = false
      return
    }

    rafId = requestAnimationFrame(tick)
  }

  const startLoop = () => {
    if (!isRunning) {
      isRunning = true
      rafId = requestAnimationFrame(tick)
    }
  }

  /** 设置某个维度的目标值 */
  const setTarget = (key: string, value: number) => {
    if (state[key]) {
      state[key].target = value
      startLoop()
    }
  }

  /** 设置多个维度的目标值 */
  const setTargets = (values: Record<string, number>) => {
    Object.entries(values).forEach(([key, value]) => {
      if (state[key]) {
        state[key].target = value
      }
    })
    startLoop()
  }

  /** 停止所有弹簧 */
  const stop = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    isRunning = false
    keys.forEach(key => {
      state[key].velocity = 0
    })
  }

  onMounted(() => {
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  onUnmounted(() => {
    stop()
  })

  return {
    /** 各维度的响应式ref */
    values: result,
    /** 设置某个维度目标值 */
    setTarget,
    /** 设置多个维度目标值 */
    setTargets,
    /** 停止所有弹簧 */
    stop,
  }
}