/**
 * 页面转场 Composable
 */

import { ref, Ref } from 'vue'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '@/utils/accessibility'

/**
 * 页面转场配置
 */
export interface PageTransitionConfig {
  duration?: number
  ease?: string
  direction?: 'horizontal' | 'vertical' | 'fade'
  scale?: number
}

/**
 * 页面转场状态
 */
export interface PageTransitionState {
  isTransitioning: boolean
  direction: 'forward' | 'backward' | 'none'
}

/**
 * 使用页面转场
 */
export function usePageTransition(config: PageTransitionConfig = {}) {
  const {
    duration = 0.5,
    ease = 'power3.inOut',
    direction = 'horizontal',
    scale = 0.95
  } = config

  const isTransitioning = ref(false)
  const transitionDirection = ref<'forward' | 'backward' | 'none'>('none')
  const enterElement = ref<HTMLElement | null>(null)
  const leaveElement = ref<HTMLElement | null>(null)

  /**
   * 执行页面转场
   */
  const transition = (
    fromElement: HTMLElement,
    toElement: HTMLElement,
    direction: 'forward' | 'backward' = 'forward'
  ) => {
    if (prefersReducedMotion()) {
      // 简单的淡入淡出
      gsap.fromTo(
        toElement,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
      return Promise.resolve()
    }

    isTransitioning.value = true
    transitionDirection.value = direction

    return new Promise<void>((resolve) => {
      const timeline = gsap.timeline({
        onComplete: () => {
          isTransitioning.value = false
          transitionDirection.value = 'none'
          resolve()
        }
      })

      // 离开动画
      if (direction === 'horizontal') {
        const x = direction === 'forward' ? '-100%' : '100%'
        timeline.fromTo(
          fromElement,
          { x: 0, opacity: 1 },
          { x: x, opacity: 0, duration, ease }
        )
      } else if (direction === 'vertical') {
        const y = direction === 'forward' ? '-100%' : '100%'
        timeline.fromTo(
          fromElement,
          { y: 0, opacity: 1 },
          { y: y, opacity: 0, duration, ease }
        )
      } else {
        timeline.fromTo(
          fromElement,
          { opacity: 1, scale: 1 },
          { opacity: 0, scale: scale, duration, ease }
        )
      }

      // 进入动画
      if (direction === 'horizontal') {
        const x = direction === 'forward' ? '100%' : '-100%'
        timeline.fromTo(
          toElement,
          { x: x, opacity: 0 },
          { x: 0, opacity: 1, duration, ease },
          '-=0.4'
        )
      } else if (direction === 'vertical') {
        const y = direction === 'forward' ? '100%' : '-100%'
        timeline.fromTo(
          toElement,
          { y: y, opacity: 0 },
          { y: 0, opacity: 1, duration, ease },
          '-=0.4'
        )
      } else {
        timeline.fromTo(
          toElement,
          { opacity: 0, scale: scale },
          { opacity: 1, scale: 1, duration, ease },
          '-=0.4'
        )
      }
    })
  }

  /**
   * 快速转场（无动画）
   */
  const instantTransition = (
    fromElement: HTMLElement,
    toElement: HTMLElement
  ) => {
    gsap.set(fromElement, { opacity: 0, display: 'none' })
    gsap.set(toElement, { opacity: 1, display: 'block' })
    return Promise.resolve()
  }

  /**
   * 设置进入元素
   */
  const setEnterElement = (element: HTMLElement | null) => {
    enterElement.value = element
  }

  /**
   * 设置离开元素
   */
  const setLeaveElement = (element: HTMLElement | null) => {
    leaveElement.value = element
  }

  /**
   * 取消转场
   */
  const cancelTransition = () => {
    gsap.killTweensOf([enterElement.value, leaveElement.value])
    isTransitioning.value = false
    transitionDirection.value = 'none'
  }

  return {
    isTransitioning,
    transitionDirection,
    enterElement,
    leaveElement,
    transition,
    instantTransition,
    setEnterElement,
    setLeaveElement,
    cancelTransition
  }
}