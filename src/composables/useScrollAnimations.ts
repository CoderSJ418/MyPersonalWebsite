import { ref, onMounted, onUnmounted, Ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * 滚动动画类型
 */
export type ScrollAnimationType =
  | 'fade-in-up'
  | 'fade-in-left'
  | 'fade-in-right'
  | 'fade-in'
  | 'scale-in'
  | 'slide-in-left'
  | 'slide-in-right'

/**
 * 滚动动画配置
 */
export interface ScrollAnimationConfig {
  trigger?: string | Element
  start?: string
  end?: string
  scrub?: boolean | number
  toggleActions?: string
  duration?: number
  delay?: number
  ease?: string
  once?: boolean
}

/**
 * 视差滚动配置
 */
export interface ParallaxConfig {
  speed?: number
  trigger?: string | Element
  start?: string
  end?: string
}

/**
 * 滚动动画 Composable
 */
export function useScrollAnimations() {
  const scrollProgress: Ref<number> = ref(0)
  const scrollTriggers: Ref<ScrollTrigger[]> = ref([])
  const observers: Ref<IntersectionObserver[]> = ref([])

  /**
   * 检查是否启用了减少动画
   */
  const prefersReducedMotion = () => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  /**
   * 更新滚动进度
   */
  const updateScrollProgress = () => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    scrollProgress.value = scrollTop / docHeight
  }

  /**
   * 创建滚动触发动画
   */
  const createScrollAnimation = (
    element: Element | string,
    type: ScrollAnimationType,
    config: ScrollAnimationConfig = {}
  ) => {
    if (prefersReducedMotion()) return null

    const {
      start = 'top 80%',
      end = 'bottom 20%',
      scrub = false,
      toggleActions = 'play none none reverse',
      duration = 0.8,
      delay = 0,
      ease = 'power3.out',
      once = true,
    } = config

    let fromProps: gsap.TweenVars = {}
    let toProps: gsap.TweenVars = {}

    // 根据动画类型设置属性
    switch (type) {
      case 'fade-in-up':
        fromProps = { opacity: 0, y: 60 }
        toProps = { opacity: 1, y: 0 }
        break
      case 'fade-in-left':
        fromProps = { opacity: 0, x: -60 }
        toProps = { opacity: 1, x: 0 }
        break
      case 'fade-in-right':
        fromProps = { opacity: 0, x: 60 }
        toProps = { opacity: 1, x: 0 }
        break
      case 'fade-in':
        fromProps = { opacity: 0 }
        toProps = { opacity: 1 }
        break
      case 'scale-in':
        fromProps = { opacity: 0, scale: 0.8 }
        toProps = { opacity: 1, scale: 1 }
        break
      case 'slide-in-left':
        fromProps = { x: -100 }
        toProps = { x: 0 }
        break
      case 'slide-in-right':
        fromProps = { x: 100 }
        toProps = { x: 0 }
        break
    }

    const tween = gsap.fromTo(element, fromProps, {
      ...toProps,
      duration,
      delay,
      ease,
      scrollTrigger: {
        trigger: config.trigger || element,
        start,
        end,
        scrub,
        toggleActions,
        once,
      },
    })

    const trigger = tween.scrollTrigger
    if (trigger) {
      scrollTriggers.value.push(trigger)
    }

    return tween
  }

  /**
   * 批量创建滚动动画
   */
  const createScrollAnimations = (
    selector: string,
    type: ScrollAnimationType,
    config: ScrollAnimationConfig = {}
  ) => {
    if (prefersReducedMotion()) return null

    const elements = document.querySelectorAll(selector)
    const tweens: gsap.core.Tween[] = []

    elements.forEach((element, index) => {
      const tween = createScrollAnimation(element, type, {
        ...config,
        delay: (config.delay || 0) + index * 0.1,
      })
      if (tween) tweens.push(tween)
    })

    return tweens
  }

  /**
   * 视差滚动效果
   */
  const createParallax = (
    element: Element | string,
    config: ParallaxConfig = {}
  ) => {
    if (prefersReducedMotion()) return null

    const {
      speed = 0.5,
      start = 'top bottom',
      end = 'bottom top',
    } = config

    const tween = gsap.to(element, {
      y: () => window.innerHeight * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: config.trigger || element,
        start,
        end,
        scrub: true,
      },
    })

    const trigger = tween.scrollTrigger
    if (trigger) {
      scrollTriggers.value.push(trigger)
    }

    return tween
  }

  /**
   * 创建滚动进度指示器
   */
  const createScrollProgressIndicator = (
    element: Element | string
  ) => {
    if (prefersReducedMotion()) return null

    const tween = gsap.to(element, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
        onUpdate: (self) => {
          scrollProgress.value = self.progress
        },
      },
    })

    const trigger = tween.scrollTrigger
    if (trigger) {
      scrollTriggers.value.push(trigger)
    }

    return tween
  }

  /**
   * 使用 Intersection Observer API
   */
  const observeElements = (
    selector: string,
    callback: (entries: IntersectionObserverEntry[]) => void,
    options: IntersectionObserverInit = {}
  ) => {
    const defaultOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
      ...options,
    }

    const observer = new IntersectionObserver(callback, defaultOptions)
    const elements = document.querySelectorAll(selector)

    elements.forEach((element) => observer.observe(element))
    observers.value.push(observer)

    return observer
  }

  /**
   * 添加动画类名（使用 Intersection Observer）
   */
  const animateOnScroll = (
    selector: string,
    animationClass: string = 'animate-in'
  ) => {
    const observer = observeElements(
      selector,
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(animationClass)
          }
        })
      },
      { threshold: 0.1 }
    )

    return observer
  }

  /**
   * 平滑滚动到元素
   */
  const scrollToElement = (
    element: Element | string,
    offset: number = 0,
    duration: number = 1
  ) => {
    const target = typeof element === 'string' 
      ? document.querySelector(element) 
      : element

    if (!target) return

    const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset

    gsap.to(window, {
      scrollTo: targetPosition,
      duration,
      ease: 'power3.inOut',
    })
  }

  /**
   * 回到顶部
   */
  const scrollToTop = (duration: number = 1) => {
    gsap.to(window, {
      scrollTo: 0,
      duration,
      ease: 'power3.inOut',
    })
  }

  /**
   * 清除所有滚动触发器
   */
  const clearScrollTriggers = () => {
    scrollTriggers.value.forEach((trigger) => trigger.kill())
    observers.value.forEach((observer) => observer.disconnect())
    scrollTriggers.value = []
    observers.value = []
  }

  /**
   * 初始化滚动监听
   */
  const initScrollListener = () => {
    window.addEventListener('scroll', updateScrollProgress)
    updateScrollProgress()
  }

  /**
   * 清理滚动监听
   */
  const cleanupScrollListener = () => {
    window.removeEventListener('scroll', updateScrollProgress)
  }

  /**
   * 组件挂载时初始化
   */
  onMounted(() => {
    initScrollListener()
  })

  /**
   * 组件卸载时清理
   */
  onUnmounted(() => {
    clearScrollTriggers()
    cleanupScrollListener()
  })

  return {
    scrollProgress,
    createScrollAnimation,
    createScrollAnimations,
    createParallax,
    createScrollProgressIndicator,
    observeElements,
    animateOnScroll,
    scrollToElement,
    scrollToTop,
    clearScrollTriggers,
    prefersReducedMotion,
  }
}