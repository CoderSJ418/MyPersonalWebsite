/**
 * useMouseLight — Mouse-Light Follow 交互
 *
 * 基于 CSS Custom Properties 驱动，零 JS 动画
 * 配合 visual-system.css 的 .vs-card--light 使用
 *
 * 原理：
 * - 监听 mousemove 事件，计算鼠标相对卡片的位置
 * - 将位置写入 --mouse-x / --mouse-y CSS 变量
 * - CSS ::before 伪元素读取变量渲染径向渐变
 * - mouseleave 时清除变量，渐变 opacity 过渡到 0
 *
 * 使用：
 * ```vue
 * <article ref="cardRef" class="vs-card vs-card--light"
 *   @mousemove="onMouseMove" @mouseleave="onMouseLeave">
 * ```
 */

import { ref, type Ref } from 'vue'

export interface MouseLightOptions {
  /** 是否启用（移动端默认禁用） */
  enabled?: boolean
  /** 自定义 CSS 变量名前缀 */
  varPrefix?: string
  /** 离开时是否清除变量 */
  clearOnLeave?: boolean
}

export function useMouseLight(
  targetRef: Ref<HTMLElement | null>,
  options: MouseLightOptions = {}
) {
  const {
    enabled = true,
    varPrefix = 'mouse',
    clearOnLeave = true
  } = options

  const isHovering = ref(false)

  const onMouseMove = (e: MouseEvent) => {
    if (!enabled || !targetRef.value) return

    const rect = targetRef.value.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    targetRef.value.style.setProperty(`--${varPrefix}-x`, `${x}px`)
    targetRef.value.style.setProperty(`--${varPrefix}-y`, `${y}px`)
    isHovering.value = true
  }

  const onMouseLeave = () => {
    if (!enabled || !targetRef.value) return

    if (clearOnLeave) {
      targetRef.value.style.removeProperty(`--${varPrefix}-x`)
      targetRef.value.style.removeProperty(`--${varPrefix}-y`)
    }
    isHovering.value = false
  }

  return {
    isHovering,
    onMouseMove,
    onMouseLeave
  }
}