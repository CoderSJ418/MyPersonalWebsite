/**
 * 磁性按钮 Composable
 */

import { ref } from 'vue'
import { gsap } from 'gsap'
import { isMobile, isTouch } from '@/utils/deviceDetection'

/**
 * 磁性按钮配置
 */
export interface MagneticButtonConfig {
  strength?: number
  elasticity?: number
  scale?: number
}

/**
 * 使用磁性按钮
 */
export function useMagneticButton(config: MagneticButtonConfig = {}) {
  const {
    strength = 0.5,
    elasticity = 0.3,
    scale = 1.05
  } = config

  const buttonPosition = ref({ x: 0, y: 0 })
  const isHovering = ref(false)
  const isEnabled = ref(!isMobile() && !isTouch())

  let buttonElement: HTMLElement | null = null
  let targetX = 0
  let targetY = 0

  /**
   * 处理鼠标移动
   */
  const handleMouseMove = (event: MouseEvent) => {
    if (!isEnabled.value || !buttonElement) return

    const rect = buttonElement.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseX = event.clientX - centerX
    const mouseY = event.clientY - centerY

    // 计算磁性效果
    const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY)
    const maxDistance = Math.max(rect.width, rect.height) * strength

    if (distance < maxDistance) {
      const force = (maxDistance - distance) / maxDistance
      targetX = mouseX * force * elasticity
      targetY = mouseY * force * elasticity
    } else {
      targetX = 0
      targetY = 0
    }

    // 使用 GSAP 平滑移动
    gsap.to(buttonPosition.value, {
      x: targetX,
      y: targetY,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  /**
   * 处理鼠标进入
   */
  const handleMouseEnter = (event: MouseEvent) => {
    if (!isEnabled.value) return

    buttonElement = event.currentTarget as HTMLElement
    isHovering.value = true

    // 缩放效果
    gsap.to(buttonElement, {
      scale: scale,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  /**
   * 处理鼠标离开
   */
  const handleMouseLeave = () => {
    if (!isEnabled.value || !buttonElement) return

    isHovering.value = false

    // 恢复位置
    gsap.to(buttonPosition.value, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)'
    })

    // 恢复大小
    gsap.to(buttonElement, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  /**
   * 处理点击
   */
  const handleClick = () => {
    if (!isEnabled.value || !buttonElement) return

    // 点击动画
    gsap.to(buttonElement, {
      scale: 0.95,
      duration: 0.1,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1
    })
  }

  /**
   * 重置
   */
  const reset = () => {
    buttonPosition.value = { x: 0, y: 0 }
    isHovering.value = false
    buttonElement = null
  }

  return {
    buttonPosition,
    isHovering,
    isEnabled,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
    reset
  }
}