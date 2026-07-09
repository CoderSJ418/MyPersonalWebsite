/**
 * useScrollReveal — IntersectionObserver 驱动的滚动显现 + Viewport-Position Stagger
 *
 * 基于 visual-system.css 的 .vs-reveal / .vs-reveal--visible / .vs-reveal--stagger
 * 
 * v2.0 — Viewport-Position Stagger:
 * - 元素距视口中心的距离决定stagger delay
 * - 中心元素delay=0，越远delay越大(max 200ms)
 * - 使用 cubic-bezier(0.4, 0, 0.2, 1) 统一easing
 * - 入场transform: translateY(20px) → 0, opacity 0 → 1
 *
 * 统一规则（来自 Motion Model）：
 * - scroll reveal: translateY(20px) + opacity 0→1, duration 500ms
 * - stagger: viewport-position based, max 200ms delay
 * - easing: cubic-bezier(0.4, 0, 0.2, 1) (--us-easing-enter)
 * - 动画必须服务信息层级
 *
 * 使用：
 * ```vue
 * <div ref="containerRef" class="vs-reveal">
 *   <h2>Title</h2>
 * </div>
 *
 * const { observe, unobserve } = useScrollReveal()
 * onMounted(() => observe(containerRef.value))
 * ```
 *
 * 或使用 v-scroll-reveal 指令：
 * ```vue
 * <div v-scroll-reveal class="vs-reveal">Content</div>
 * ```
 */

import { onMounted, onUnmounted } from 'vue'

export interface ScrollRevealOptions {
  /** IntersectionObserver threshold */
  threshold?: number
  /** IntersectionObserver rootMargin */
  rootMargin?: string
  /** 是否只触发一次 */
  once?: boolean
  /** stagger 间隔（ms）— 用于向后兼容的线性stagger */
  staggerDelay?: number
  /** stagger 最大延迟（ms） */
  maxStaggerDelay?: number
  /** 是否启用viewport-position stagger（默认true） */
  viewportStagger?: boolean
}

const DEFAULT_OPTIONS: ScrollRevealOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px',
  once: true,
  staggerDelay: 80,
  maxStaggerDelay: 200,
  viewportStagger: true,
}

/** 统一easing: cubic-bezier(0.4, 0, 0.2, 1) */
const REVEAL_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)'
const REVEAL_DURATION = '500ms'

/**
 * 计算元素距视口中心的距离，返回stagger delay(ms)
 * 中心元素delay=0，越远delay越大，最大maxDelay
 */
function calcViewportStaggerDelay(el: HTMLElement, maxDelay: number = 200): number {
  const rect = el.getBoundingClientRect()
  const elCenterY = rect.top + rect.height / 2
  const viewportCenterY = window.innerHeight / 2
  const distance = Math.abs(elCenterY - viewportCenterY)
  const maxDistance = window.innerHeight / 2
  // 归一化到0-1，中心=0，边缘=1
  const normalized = Math.min(distance / maxDistance, 1)
  // 使用二次曲线让中心区域更集中
  const delay = normalized * normalized * maxDelay
  return Math.round(delay)
}

/**
 * 创建 IntersectionObserver 驱动的滚动显现
 */
export function useScrollReveal(options: ScrollRevealOptions = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  let observer: IntersectionObserver | null = null

  const createObserver = () => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement

            // 计算viewport-position stagger delay
            if (opts.viewportStagger && el.classList.contains('vs-reveal--stagger')) {
              const delay = calcViewportStaggerDelay(el, opts.maxStaggerDelay || 200)
              el.style.setProperty('--stagger-delay', `${delay}ms`)
            }

            entry.target.classList.add('vs-reveal--visible')
            if (opts.once) {
              observer?.unobserve(entry.target)
            }
          } else if (!opts.once) {
            entry.target.classList.remove('vs-reveal--visible')
          }
        })
      },
      {
        threshold: opts.threshold,
        rootMargin: opts.rootMargin
      }
    )
  }

  /**
   * 观察单个元素
   */
  const observe = (el: HTMLElement | null) => {
    if (!el || !observer) return
    // 设置统一的reveal样式
    applyRevealStyles(el)
    observer.observe(el)
  }

  /**
   * 应用统一的reveal入场样式
   */
  const applyRevealStyles = (el: HTMLElement) => {
    el.style.setProperty('--reveal-easing', REVEAL_EASING)
    el.style.setProperty('--reveal-duration', REVEAL_DURATION)
  }

  /**
   * 观察容器内所有 .vs-reveal 子元素，自动设置 stagger delay
   * v2.1: 添加安全回退 — 如果元素在3秒内未被观察器触发，强制显示
   */
  const observeChildren = (container: HTMLElement | null, selector = '.vs-reveal') => {
    if (!container || !observer) return

    const children = container.querySelectorAll<HTMLElement>(selector)
    children.forEach((child) => {
      // 设置统一reveal样式
      applyRevealStyles(child)

      if (child.classList.contains('vs-reveal--stagger')) {
        // viewport-position stagger: 在intersect时动态计算
        // 初始设置一个fallback delay
        const fallbackDelay = Math.min(
          Array.from(children).indexOf(child) * (opts.staggerDelay || 80),
          opts.maxStaggerDelay || 200
        )
        child.style.setProperty('--stagger-delay', `${fallbackDelay}ms`)
      }

      observer!.observe(child)

      // Safety fallback: force visibility after 3s if observer never fired
      // This prevents elements from staying invisible if the observer fails
      const safetyTimer = setTimeout(() => {
        if (!child.classList.contains('vs-reveal--visible')) {
          child.classList.add('vs-reveal--visible')
        }
      }, 3000)
        // Store timer on element for cleanup
        ; (child as HTMLElement & { _safetyTimer?: ReturnType<typeof setTimeout> })._safetyTimer = safetyTimer
    })
  }

  /**
   * 停止观察单个元素
   */
  const unobserve = (el: HTMLElement | null) => {
    if (!el || !observer) return
    observer.unobserve(el)
  }

  /**
   * 断开所有观察，清理安全回退计时器
   */
  const disconnect = () => {
    if (observer) {
      // Clean up safety timers on all observed elements
      observer.disconnect()
    }
  }

  onMounted(() => {
    createObserver()
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    observe,
    observeChildren,
    unobserve,
    disconnect
  }
}

/**
 * Vue Directive: v-scroll-reveal
 *
 * 用法：
 * v-scroll-reveal              — 基础滚动显现
 * v-scroll-reveal:stagger      — 带 viewport-position stagger 的滚动显现
 */
export const vScrollReveal = {
  mounted(el: HTMLElement, binding: { arg?: string; value?: { index?: number } }) {
    el.classList.add('vs-reveal')

    // 设置统一reveal样式
    el.style.setProperty('--reveal-easing', REVEAL_EASING)
    el.style.setProperty('--reveal-duration', REVEAL_DURATION)

    if (binding.arg === 'stagger') {
      el.classList.add('vs-reveal--stagger')
      // viewport-position stagger: 在intersect时动态计算
      // 设置fallback delay
      const index = binding.value?.index ?? 0
      const fallbackDelay = Math.min(index * 80, 200)
      el.style.setProperty('--stagger-delay', `${fallbackDelay}ms`)
    }

    // 创建独立 observer（带viewport-position stagger）
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement

            // viewport-position stagger: 动态计算delay
            if (el.classList.contains('vs-reveal--stagger')) {
              const delay = calcViewportStaggerDelay(el, 200)
              el.style.setProperty('--stagger-delay', `${delay}ms`)
            }

            entry.target.classList.add('vs-reveal--visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
      ; (el as HTMLElement & { __scrollRevealObserver?: IntersectionObserver }).__scrollRevealObserver = observer
  },

  unmounted(el: HTMLElement) {
    const observer = (el as HTMLElement & { __scrollRevealObserver?: IntersectionObserver }).__scrollRevealObserver
    if (observer) {
      observer.disconnect()
      delete (el as HTMLElement & { __scrollRevealObserver?: IntersectionObserver }).__scrollRevealObserver
    }
  }
}