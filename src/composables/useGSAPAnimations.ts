import { ref, onMounted, onUnmounted, Ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// 注册 GSAP 插件
gsap.registerPlugin(ScrollTrigger)

/**
 * GSAP 动画配置接口
 */
export interface GSAPAnimationConfig {
  duration?: number
  delay?: number
  ease?: string
  opacity?: number
  y?: number
  x?: number
  scale?: number
  rotation?: number
}

/**
 * 打字机效果配置
 */
export interface TypewriterConfig {
  text: string
  speed?: number
  cursor?: boolean
  cursorChar?: string
  onComplete?: () => void
}

/**
 * GSAP 动画 Composable
 */
export function useGSAPAnimations() {
  const animations: Ref<gsap.core.Tween[]> = ref([])
  const scrollTriggers: Ref<ScrollTrigger[]> = ref([])

  /**
   * 检查是否启用了减少动画
   */
  const prefersReducedMotion = () => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  /**
   * 淡入动画
   */
  const fadeIn = (
    element: Element | string | null,
    config: GSAPAnimationConfig = {}
  ) => {
    if (prefersReducedMotion()) return null

    const {
      duration = 0.6,
      delay = 0,
      ease = 'power2.out',
      opacity = 1,
    } = config

    const tween = gsap.fromTo(
      element,
      { opacity: 0 },
      { opacity, duration, delay, ease }
    )

    animations.value.push(tween)
    return tween
  }

  /**
   * 淡入上移动画
   */
  const fadeInUp = (
    element: Element | string | null,
    config: GSAPAnimationConfig = {}
  ) => {
    if (prefersReducedMotion()) return null

    const {
      duration = 0.8,
      delay = 0,
      ease = 'power3.out',
      opacity = 1,
      y = 0,
    } = config

    const tween = gsap.fromTo(
      element,
      { opacity: 0, y: 50 },
      { opacity, y, duration, delay, ease }
    )

    animations.value.push(tween)
    return tween
  }

  /**
   * 淡入左移动画
   */
  const fadeInLeft = (
    element: Element | string | null,
    config: GSAPAnimationConfig = {}
  ) => {
    if (prefersReducedMotion()) return null

    const {
      duration = 0.8,
      delay = 0,
      ease = 'power3.out',
      opacity = 1,
      x = 0,
    } = config

    const tween = gsap.fromTo(
      element,
      { opacity: 0, x: -50 },
      { opacity, x, duration, delay, ease }
    )

    animations.value.push(tween)
    return tween
  }

  /**
   * 淡入右移动画
   */
  const fadeInRight = (
    element: Element | string | null,
    config: GSAPAnimationConfig = {}
  ) => {
    if (prefersReducedMotion()) return null

    const {
      duration = 0.8,
      delay = 0,
      ease = 'power3.out',
      opacity = 1,
      x = 0,
    } = config

    const tween = gsap.fromTo(
      element,
      { opacity: 0, x: 50 },
      { opacity, x, duration, delay, ease }
    )

    animations.value.push(tween)
    return tween
  }

  /**
   * 缩放弹出动画
   */
  const scaleIn = (
    element: Element | string | null,
    config: GSAPAnimationConfig = {}
  ) => {
    if (prefersReducedMotion()) return null

    const {
      duration = 0.5,
      delay = 0,
      ease = 'back.out(1.7)',
      opacity = 1,
      scale = 1,
    } = config

    const tween = gsap.fromTo(
      element,
      { opacity: 0, scale: 0.5 },
      { opacity, scale, duration, delay, ease }
    )

    animations.value.push(tween)
    return tween
  }

  /**
   * 旋转进入动画
   */
  const rotateIn = (
    element: Element | string | null,
    config: GSAPAnimationConfig = {}
  ) => {
    if (prefersReducedMotion()) return null

    const {
      duration = 0.6,
      delay = 0,
      ease = 'power2.out',
      opacity = 1,
      rotation = 0,
    } = config

    const tween = gsap.fromTo(
      element,
      { opacity: 0, scale: 0, rotation: -180 },
      { opacity, scale: 1, rotation, duration, delay, ease }
    )

    animations.value.push(tween)
    return tween
  }

  /**
   * 打字机效果
   */
  const typewriter = (
    element: Element,
    config: TypewriterConfig
  ) => {
    if (prefersReducedMotion()) {
      element.textContent = config.text
      return null
    }

    const { text, speed = 0.05, cursor = true, cursorChar = '|', onComplete } = config
    let currentText = ''
    let index = 0

    // 添加光标
    if (cursor) {
      element.innerHTML = `<span class="cursor">${cursorChar}</span>`
      const cursorElement = element.querySelector('.cursor')
      
      // 光标闪烁动画
      gsap.to(cursorElement, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'none',
      })
    }

    const typeNext = () => {
      if (index < text.length) {
        currentText += text[index]
        index++
        
        if (cursor) {
          element.innerHTML = `${currentText}<span class="cursor">${cursorChar}</span>`
        } else {
          element.textContent = currentText
        }
        
        gsap.delayedCall(speed, typeNext)
      } else {
        if (onComplete) onComplete()
      }
    }

    gsap.delayedCall(0.3, typeNext)
  }

  /**
   * 序列动画（逐个显示）
   */
  const staggerIn = (
    elements: NodeListOf<Element> | Element[],
    config: GSAPAnimationConfig = {}
  ) => {
    if (prefersReducedMotion()) return null

    const {
      duration = 0.6,
      delay = 0,
      ease = 'power2.out',
      opacity = 1,
      y = 0,
    } = config

    const tween = gsap.fromTo(
      elements,
      { opacity: 0, y: 30 },
      {
        opacity,
        y,
        duration,
        delay,
        ease,
        stagger: 0.1,
      }
    )

    animations.value.push(tween)
    return tween
  }

  /**
   * 清除所有动画
   */
  const clearAnimations = () => {
    animations.value.forEach((tween) => tween.kill())
    scrollTriggers.value.forEach((trigger) => trigger.kill())
    animations.value = []
    scrollTriggers.value = []
  }

  /**
   * 组件卸载时清理
   */
  onUnmounted(() => {
    clearAnimations()
  })

  return {
    fadeIn,
    fadeInUp,
    fadeInLeft,
    fadeInRight,
    scaleIn,
    rotateIn,
    typewriter,
    staggerIn,
    clearAnimations,
    prefersReducedMotion,
    gsap,
    ScrollTrigger,
  }
}