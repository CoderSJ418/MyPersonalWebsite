/**
 * useScrollMotion — Scroll Motion System (Framer-style)
 *
 * 驱动:
 * 1. Parallax — 滚动视差 (Hero bg slow, cards fast, text stable)
 * 2. Section Fade — gradient fade overlap (no hard cuts)
 *
 * 原理:
 * - 监听 scroll 事件 (RAF 节流)
 * - 更新 CSS 变量 --parallax-offset on [data-parallax] elements
 * - Section fade 由 CSS ::before gradient 实现，无需 JS
 *
 * 使用:
 * ```vue
 * const { init, destroy } = useScrollMotion()
 * onMounted(() => init())
 * onUnmounted(() => destroy())
 * ```
 *
 * Parallax 标记:
 * ```html
 * <div data-parallax="slow">Hero background</div>
 * <div data-parallax="fast">Card grid</div>
 * <div>Stable text</div>
 * ```
 */

import { onMounted, onUnmounted } from 'vue'

/** Parallax rate mapping */
const PARALLAX_RATES: Record<string, number> = {
  slow: 0.3,   // Hero bg: 30% of scroll speed (slower)
  fast: 0.15,  // Cards: 15% extra scroll speed (slightly faster)
}

interface ScrollMotionOptions {
  /** 是否启用 parallax (默认 true, 移动端可禁用) */
  enableParallax?: boolean
  /** RAF 节流间隔 (默认 16ms ≈ 60fps) */
  throttleMs?: number
  /** parallax 作用范围 (默认 viewport 高度的倍数) */
  parallaxRange?: number
}

export function useScrollMotion(options: ScrollMotionOptions = {}) {
  const {
    enableParallax = true,
    throttleMs = 16,
  } = options

  let rafId: number | null = null
  let lastScrollY = 0
  const parallaxElements: Map<HTMLElement, string> = new Map()

  /** 收集所有 [data-parallax] 元素 */
  const collectParallaxElements = () => {
    parallaxElements.clear()
    if (!enableParallax) return

    const elements = document.querySelectorAll<HTMLElement>('[data-parallax]')
    elements.forEach((el) => {
      const rate = el.getAttribute('data-parallax') || 'normal'
      if (rate !== 'normal') {
        parallaxElements.set(el, rate)
      }
    })
  }

  /** 更新 parallax 偏移 */
  const updateParallax = () => {
    const scrollY = window.scrollY

    parallaxElements.forEach((rate, el) => {
      const parallaxRate = PARALLAX_RATES[rate]
      if (parallaxRate === undefined) return

      // 计算元素相对于视口的位置
      const rect = el.getBoundingClientRect()
      const elementCenter = rect.top + rect.height / 2
      const viewportCenter = window.innerHeight / 2

      // 偏移量 = (元素中心 - 视口中心) * rate
      // slow: 正值让元素滞后 (看起来更慢)
      // fast: 负值让元素超前 (看起来更快)
      const offset = (elementCenter - viewportCenter) * parallaxRate

      el.style.transform = `translateY(${offset}px)`
    })

    lastScrollY = scrollY
  }

  /** RAF 节流的 scroll handler */
  const onScroll = () => {
    if (rafId !== null) return
    rafId = requestAnimationFrame(() => {
      updateParallax()
      rafId = null
    })
  }

  /** 初始化 */
  const init = () => {
    collectParallaxElements()
    window.addEventListener('scroll', onScroll, { passive: true })
    // 初始位置
    updateParallax()
  }

  /** 销毁 */
  const destroy = () => {
    window.removeEventListener('scroll', onScroll)
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    // 清除 parallax transforms
    parallaxElements.forEach((_, el) => {
      el.style.transform = ''
    })
    parallaxElements.clear()
  }

  /** 重新收集元素 (动态内容变化后调用) */
  const refresh = () => {
    collectParallaxElements()
    updateParallax()
  }

  onMounted(() => {
    init()
  })

  onUnmounted(() => {
    destroy()
  })

  return {
    init,
    destroy,
    refresh,
  }
}