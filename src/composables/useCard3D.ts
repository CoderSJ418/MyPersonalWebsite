/**
 * 3D 卡片 Composable
 */

import { ref } from 'vue'
import { gsap } from 'gsap'
import { isMobile, isTouch } from '@/utils/deviceDetection'

/**
 * 3D 卡片配置
 */
export interface Card3DConfig {
  maxTilt?: number
  perspective?: number
  scale?: number
  glare?: boolean
  resetOnLeave?: boolean
}

/**
 * 使用 3D 卡片
 */
export function useCard3D(config: Card3DConfig = {}) {
  const {
    maxTilt = 15,
    perspective = 1000,
    scale = 1.05,
    glare = true,
    resetOnLeave = true
  } = config

  const transform = ref('')
  const glareStyle = ref<Record<string, string>>({})
  const isHovering = ref(false)
  const isEnabled = ref(!isMobile() && !isTouch())

  /**
   * 处理鼠标移动
   */
  const handleMouseMove = (event: MouseEvent) => {
    if (!isEnabled.value) return

    const card = event.currentTarget as HTMLElement
    if (!card) return

    const rect = card.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseX = event.clientX - centerX
    const mouseY = event.clientY - centerY

    const rotateX = (mouseY / (rect.height / 2)) * -maxTilt
    const rotateY = (mouseX / (rect.width / 2)) * maxTilt

    transform.value = `
      perspective(${perspective}px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(${scale})
    `

    if (glare) {
      const glareX = (mouseX / rect.width) * 100
      const glareY = (mouseY / rect.height) * 100

      glareStyle.value = {
        background: `linear-gradient(${glareX}deg, rgba(255,255,255,0.3) 0%, transparent 100%)`,
        transform: `translate(${glareX}%, ${glareY}%)`
      }
    }
  }

  /**
   * 处理鼠标离开
   */
  const handleMouseLeave = () => {
    if (!isEnabled.value || !resetOnLeave) return

    gsap.to(transform, {
      value: '',
      duration: 0.5,
      ease: 'power2.out'
    })

    gsap.to(glareStyle, {
      value: {},
      duration: 0.5,
      ease: 'power2.out'
    })
  }

  /**
   * 处理鼠标进入
   */
  const handleMouseEnter = () => {
    if (!isEnabled.value) return
    isHovering.value = true
  }

  /**
   * 重置卡片
   */
  const reset = () => {
    transform.value = ''
    glareStyle.value = {}
    isHovering.value = false
  }

  return {
    transform,
    glareStyle,
    isHovering,
    isEnabled,
    handleMouseMove,
    handleMouseLeave,
    handleMouseEnter,
    reset
  }
}