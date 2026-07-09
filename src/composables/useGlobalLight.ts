/**
 * useGlobalLight — Stripe/Framer/Raycast级全局单光源系统
 *
 * 核心原理：
 * - 全局只有一个光源，所有组件响应同一个光
 * - 鼠标驱动 + RAF lerp惯性（factor 0.06，约400ms延迟）
 * - 光源影响所有层：背景、卡片表面、文字
 * - 物理衰减曲线：1 / (1 + distance² * falloff)
 *
 * CSS变量输出（设置到 document.documentElement）：
 * - --light-x: 光源X位置（百分比）
 * - --light-y: 光源Y位置（百分比）
 * - --light-active: 1/0（鼠标是否活跃）
 *
 * 设计约束：
 * - 单例模式：全局只初始化一次
 * - reduced-motion: 即时跟随，无惯性
 * - touch设备: 光源固定在50% 30%
 */

import { ref, onMounted, onUnmounted } from 'vue'

/** 惯性lerp因子 — 0.06给出约400ms的物理延迟感 */
const LERP_FACTOR = 0.06

/** 鼠标离开时的光源静止位置 */
const REST_X = 50
const REST_Y = 30

/** 单例状态 — 确保全局只有一个RAF循环 */
let instanceCount = 0
let rafId: number | null = null
let lightTargetX = 50
let lightTargetY = 30
let lightCurrentX = 50
let lightCurrentY = 30
let isMouseActive = false
let prefersReducedMotion = false

/** 线性插值 */
const lerp = (current: number, target: number, factor: number): number => {
  return current + (target - current) * factor
}

/** RAF循环 — 每帧平滑插值光源位置 */
const updateLightPosition = () => {
  const root = document.documentElement
  if (!root) {
    rafId = requestAnimationFrame(updateLightPosition)
    return
  }

  if (prefersReducedMotion) {
    // reduced-motion: 即时跟随，无惯性
    lightCurrentX = lightTargetX
    lightCurrentY = lightTargetY
  } else {
    // 物理惯性lerp
    lightCurrentX = lerp(lightCurrentX, lightTargetX, LERP_FACTOR)
    lightCurrentY = lerp(lightCurrentY, lightTargetY, LERP_FACTOR)
  }

  // 写入CSS变量到根元素
  root.style.setProperty('--light-x', `${lightCurrentX}%`)
  root.style.setProperty('--light-y', `${lightCurrentY}%`)
  root.style.setProperty('--light-active', isMouseActive ? '1' : '0')

  rafId = requestAnimationFrame(updateLightPosition)
}

/** 全局鼠标移动处理 */
const handleMouseMove = (e: MouseEvent) => {
  // 将鼠标位置映射为页面百分比
  lightTargetX = (e.clientX / window.innerWidth) * 100
  lightTargetY = (e.clientY / window.innerHeight) * 100
  isMouseActive = true
}

/** 全局鼠标离开处理 */
const handleMouseLeave = () => {
  lightTargetX = REST_X
  lightTargetY = REST_Y
  isMouseActive = false
}

/**
 * useGlobalLight — 全局单光源composable
 *
 * 使用方式：在App.vue或Home.vue中调用一次即可
 * 所有子组件通过CSS变量 --light-x / --light-y 自动响应
 */
export function useGlobalLight() {
  onMounted(() => {
    instanceCount++

    // 检测reduced-motion偏好
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // 只在第一个实例时注册事件和启动RAF
    if (instanceCount === 1) {
      // 初始化CSS变量
      const root = document.documentElement
      root.style.setProperty('--light-x', `${lightCurrentX}%`)
      root.style.setProperty('--light-y', `${lightCurrentY}%`)
      root.style.setProperty('--light-active', '0')

      // 注册全局鼠标事件
      document.addEventListener('mousemove', handleMouseMove, { passive: true })
      document.addEventListener('mouseleave', handleMouseLeave, { passive: true })

      // 启动RAF循环
      rafId = requestAnimationFrame(updateLightPosition)
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

      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)

      // 清理CSS变量
      const root = document.documentElement
      root.style.removeProperty('--light-x')
      root.style.removeProperty('--light-y')
      root.style.removeProperty('--light-active')
    }
  })

  return {
    /** 当前光源X位置（0-100百分比） */
    lightX: ref(lightCurrentX),
    /** 当前光源Y位置（0-100百分比） */
    lightY: ref(lightCurrentY),
    /** 鼠标是否活跃 */
    active: ref(isMouseActive),
  }
}