/**
 * 滚动进度 Composable
 */

import { ref, onMounted, onUnmounted, Ref } from 'vue'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '@/utils/accessibility'

/**
 * 滚动进度配置
 */
export interface ScrollProgressConfig {
  height?: number
  color?: string
  position?: 'top' | 'bottom'
  showPercentage?: boolean
  smooth?: boolean
}

/**
 * 使用滚动进度
 */
export function useScrollProgress(config: ScrollProgressConfig = {}) {
  const {
    height = 3,
    color = '#3b82f6',
    position = 'top',
    showPercentage = false,
    smooth = true
  } = config

  const progress = ref(0)
  const percentage = ref(0)
  const isScrolling = ref(false)
  const scrollTimeout = ref<NodeJS.Timeout | null>(null)

  /**
   * 更新滚动进度
   */
  const updateProgress = () => {
    if (prefersReducedMotion()) {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      progress.value = scrollTop / docHeight
      percentage.value = Math.round(progress.value * 100)
      return
    }

    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const newProgress = scrollTop / docHeight

    if (smooth) {
      gsap.to(progress.value, {
        value: newProgress,
        duration: 0.3,
        ease: 'power2.out'
      })
    } else {
      progress.value = newProgress
    }

    percentage.value = Math.round(newProgress * 100)
  }

  /**
   * 滚动到指定进度
   */
  const scrollTo = (targetProgress: number) => {
    const scrollTop = targetProgress * (document.documentElement.scrollHeight - window.innerHeight)

    gsap.to(window, {
      scrollTo: scrollTop,
      duration: 1,
      ease: 'power3.inOut'
    })
  }

  /**
   * 滚动到顶部
   */
  const scrollToTop = () => {
    scrollTo(0)
  }

  /**
   * 滚动到底部
   */
  const scrollToBottom = () => {
    scrollTo(1)
  }

  /**
   * 滚动到指定元素
   */
  const scrollToElement = (element: Element | string, offset: number = 0) => {
    const target = typeof element === 'string' ? document.querySelector(element) : element

    if (!target) return

    const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset

    gsap.to(window, {
      scrollTo: targetPosition,
      duration: 1,
      ease: 'power3.inOut'
    })
  }

  /**
   * 检测滚动状态
   */
  const handleScroll = () => {
    isScrolling.value = true

    if (scrollTimeout.value) {
      clearTimeout(scrollTimeout.value)
    }

    scrollTimeout.value = setTimeout(() => {
      isScrolling.value = false
    }, 150)

    updateProgress()
  }

  /**
   * 初始化
   */
  const init = () => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    updateProgress()
  }

  /**
   * 销毁
   */
  const destroy = () => {
    window.removeEventListener('scroll', handleScroll)
    if (scrollTimeout.value) {
      clearTimeout(scrollTimeout.value)
    }
  }

  /**
   * 组件挂载
   */
  onMounted(() => {
    init()
  })

  /**
   * 组件卸载
   */
  onUnmounted(() => {
    destroy()
  })

  return {
    progress,
    percentage,
    isScrolling,
    height,
    color,
    position,
    showPercentage,
    smooth,
    updateProgress,
    scrollTo,
    scrollToTop,
    scrollToBottom,
    scrollToElement,
    init,
    destroy
  }
}