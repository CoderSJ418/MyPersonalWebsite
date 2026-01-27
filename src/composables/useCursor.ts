/**
 * 自定义光标 Composable
 */

import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { isMobile, isTouch } from '@/utils/deviceDetection'

/**
 * 光标位置
 */
export interface CursorPosition {
  x: number
  y: number
}

/**
 * 光标配置
 */
export interface CursorConfig {
  size?: number
  hoverSize?: number
  color?: string
  hoverColor?: string
  enableRipple?: boolean
  style?: 'dot' | 'arrow' | 'cross'
}

/**
 * 使用自定义光标
 */
export function useCursor(config: CursorConfig = {}) {
  const {
    size = 20,
    hoverSize = 40,
    color = '#3b82f6',
    hoverColor = '#8b5cf6',
    enableRipple = true
  } = config

  const position = ref<CursorPosition>({ x: 0, y: 0 })
  const isHovering = ref(false)
  const hoverElement = ref<Element | null>(null)
  const cursorEnabled = ref(!isMobile() && !isTouch())

  const cursorSize = ref(size)
  const cursorColor = ref(color)
  const ripples = ref<HTMLElement[]>([])

  /**
   * 更新光标位置
   */
  const updatePosition = (x: number, y: number) => {
    if (!cursorEnabled.value) return

    gsap.to(position.value, {
      x,
      y,
      duration: 0.15,
      ease: 'power2.out'
    })
  }

  /**
   * 设置悬停状态
   */
  const setHover = (element: Element | null) => {
    if (!cursorEnabled.value) return

    isHovering.value = !!element
    hoverElement.value = element

    if (element) {
      gsap.to(cursorSize, {
        value: hoverSize,
        duration: 0.3,
        ease: 'power2.out'
      })
      gsap.to(cursorColor, {
        value: hoverColor,
        duration: 0.3,
        ease: 'power2.out'
      })
    } else {
      gsap.to(cursorSize, {
        value: size,
        duration: 0.3,
        ease: 'power2.out'
      })
      gsap.to(cursorColor, {
        value: color,
        duration: 0.3,
        ease: 'power2.out'
      })
    }
  }

  /**
   * 创建涟漪效果
   */
  const createRipple = (x: number, y: number) => {
    if (!cursorEnabled.value || !enableRipple) return

    const ripple = document.createElement('div')
    ripple.className = 'cursor-ripple'
    ripple.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: ${hoverColor};
      pointer-events: none;
      transform: translate(-50%, -50%);
      z-index: 9999;
      opacity: 0.5;
    `
    document.body.appendChild(ripple)
    ripples.value.push(ripple)

    gsap.fromTo(
      ripple,
      {
        width: 0,
        height: 0,
        opacity: 0.8
      },
      {
        width: 100,
        height: 100,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          ripple.remove()
          const index = ripples.value.indexOf(ripple)
          if (index > -1) {
            ripples.value.splice(index, 1)
          }
        }
      }
    )
  }

  /**
   * 清除所有涟漪
   */
  const clearRipples = () => {
    ripples.value.forEach((ripple) => ripple.remove())
    ripples.value = []
  }

  /**
   * 隐藏光标
   */
  const hideCursor = () => {
    gsap.to(position.value, {
      x: -100,
      y: -100,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  /**
   * 显示光标
   */
  const showCursor = () => {
    // 光标会自动跟随鼠标，无需额外操作
  }

  /**
   * 初始化鼠标事件监听
   */
  const initMouseListeners = () => {
    if (!cursorEnabled.value) return

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY)
    }

    const handleMouseDown = (e: MouseEvent) => {
      createRipple(e.clientX, e.clientY)
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a, button, [data-interactive]')) {
        setHover(target)
      }
    }

    const handleMouseLeave = (_e: MouseEvent) => {
      setHover(null)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseover', handleMouseEnter)
    window.addEventListener('mouseout', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseover', handleMouseEnter)
      window.removeEventListener('mouseout', handleMouseLeave)
    }
  }

  /**
   * 组件挂载
   */
  onMounted(() => {
    const cleanup = initMouseListeners()
    onUnmounted(() => {
      cleanup?.()
      clearRipples()
    })
  })

  return {
    position,
    isHovering,
    hoverElement,
    cursorSize,
    cursorColor,
    cursorEnabled,
    updatePosition,
    setHover,
    createRipple,
    clearRipples,
    hideCursor,
    showCursor
  }
}