/**
 * useCursorInteraction — Visual Structure Deformation System
 *
 * 驱动:
 * 1. GLOBAL LIGHT SOURCE — 全站唯一光源变量 --global-light-x/y (viewport %)
 * 2. LIGHT BENDING — 光源弯曲变量 --light-bend-x/y (normalized -1 to 1)
 *    实现"光不是移动，而是弯曲"的gradient field distortion
 * 3. SURFACE DEFORMATION — 鼠标靠近card时自动计算tilt/shadow/highlight
 *    --surface-tilt-x/y, --surface-shadow-x/y, --surface-highlight-x/y
 * 4. VISUAL FOCUS — hover时dim其他元素，形成注意力收缩
 *    --focus-active, --focus-target-id
 * 5. Hover Magnetic Effect — button/card 吸附鼠标
 * 6. Cursor Distortion — hero background gradient shifts
 *
 * 原理:
 * - 全局 mousemove 监听 (RAF 节流)
 * - 设置 CSS 变量 on <html>:
 *   --cursor-x / --cursor-y (px) — cursor glow 元素定位
 *   --global-light-x / --global-light-y (%) — 全站光源坐标
 *   --global-light-active (0|1) — 光源是否活跃
 *   --light-bend-x / --light-bend-y — 光源弯曲向量 (normalized)
 * - [data-surface] 元素: 自动计算surface deformation (tilt/shadow/highlight)
 * - [data-magnetic] 元素: 鼠标靠近时轻微位移
 * - [data-cursor-distort] 元素: 根据鼠标位置偏移
 * - [data-focus-group] 容器: hover时dim同组其他元素
 * - 仅 desktop 启用 (hover: hover + pointer: fine)
 * - prefers-reduced-motion: 禁用所有效果
 *
 * 使用:
 * ```vue
 * const { init, destroy } = useCursorInteraction()
 * onMounted(() => init())
 * onUnmounted(() => destroy())
 * ```
 *
 * 标记:
 * ```html
 * <div data-magnetic>Magnetic Button</div>
 * <div data-cursor-distort>Hero Background</div>
 * <article data-surface>Card with surface deformation</article>
 * <div data-focus-group>Container with visual focus</div>
 * ```
 */

import { onMounted, onUnmounted } from 'vue'

/** Magnetic strength — 0.3 = 30% of distance toward cursor */
const MAGNETIC_STRENGTH = 0.3
/** Magnetic activation radius (px) — element center distance threshold */
const MAGNETIC_RADIUS = 150
/** Cursor distortion strength — normalized -1 to 1 */
const DISTORT_NORMALIZE = 0.5
/** Idle timeout — hide glow after mouse stops (ms) */
const IDLE_TIMEOUT = 3000
/** Surface deformation radius (px) — card starts tilting when cursor is within this distance */
const SURFACE_RADIUS = 400
/** Surface tilt max degrees */
const SURFACE_MAX_TILT = 6
/** Surface highlight intensity (0-1) */
const SURFACE_HIGHLIGHT_MAX = 0.15

interface CursorInteractionOptions {
  /** 是否启用 cursor glow (默认 true) */
  enableGlow?: boolean
  /** 是否启用 magnetic effect (默认 true) */
  enableMagnetic?: boolean
  /** 是否启用 cursor distortion (默认 true) */
  enableDistortion?: boolean
  /** 是否启用 surface deformation (默认 true) */
  enableSurface?: boolean
  /** 是否启用 visual focus system (默认 true) */
  enableFocus?: boolean
  /** RAF 节流间隔 (默认 16ms ≈ 60fps) */
  throttleMs?: number
}

export function useCursorInteraction(options: CursorInteractionOptions = {}) {
  const {
    _enableGlow = true,
    enableMagnetic = true,
    enableDistortion = true,
    enableSurface = true,
    enableFocus = true,
    _throttleMs = 16,
  } = options

  let rafId: number | null = null
  let idleTimerId: number | null = null
  const magneticElements: Map<HTMLElement, DOMRect> = new Map()
  let distortElements: HTMLElement[] = []
  let surfaceElements: HTMLElement[] = []
  let focusGroups: HTMLElement[] = []
  let isDesktop = false
  let prefersReducedMotion = false
  let lastMouseX = 0
  let lastMouseY = 0

  /** 检测环境: desktop + reduced-motion */
  const detectEnvironment = () => {
    const hoverQuery = window.matchMedia('(hover: hover)')
    const pointerQuery = window.matchMedia('(pointer: fine)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    isDesktop = hoverQuery.matches && pointerQuery.matches
    prefersReducedMotion = motionQuery.matches

    // Listen for changes
    hoverQuery.addEventListener('change', (e) => {
      isDesktop = e.matches && pointerQuery.matches
      if (!isDesktop) destroy()
    })
    pointerQuery.addEventListener('change', (e) => {
      isDesktop = hoverQuery.matches && e.matches
      if (!isDesktop) destroy()
    })
    motionQuery.addEventListener('change', (e) => {
      prefersReducedMotion = e.matches
      if (prefersReducedMotion) destroy()
    })
  }

  /** 收集 [data-magnetic] 元素 */
  const collectMagneticElements = () => {
    magneticElements.clear()
    if (!enableMagnetic || !isDesktop) return

    const elements = document.querySelectorAll<HTMLElement>('[data-magnetic]')
    elements.forEach((el) => {
      magneticElements.set(el, el.getBoundingClientRect())
    })
  }

  /** 收集 [data-cursor-distort] 元素 */
  const collectDistortElements = () => {
    distortElements = []
    if (!enableDistortion || !isDesktop) return

    distortElements = Array.from(document.querySelectorAll<HTMLElement>('[data-cursor-distort]'))
  }

  /** 收集 [data-surface] 元素 — surface deformation targets */
  const collectSurfaceElements = () => {
    surfaceElements = []
    if (!enableSurface || !isDesktop) return

    surfaceElements = Array.from(document.querySelectorAll<HTMLElement>('[data-surface]'))
  }

  /** 收集 [data-focus-group] 容器 — visual focus targets */
  const collectFocusGroups = () => {
    focusGroups = []
    if (!enableFocus || !isDesktop) return

    focusGroups = Array.from(document.querySelectorAll<HTMLElement>('[data-focus-group]'))
  }

  /** 更新全局光源 + cursor 位置 + 光源弯曲 CSS 变量
   *  --cursor-x/y (px): cursor glow 元素定位
   *  --mouse-x/y (px): Stripe Hero light field定位 (px值，非%)
   *  --global-light-x/y (%): 全站光源坐标 (viewport 百分比)
   *  --global-light-active (0|1): 光源是否活跃
   *  --light-bend-x/y: 光源弯曲向量 (normalized -1 to 1)
   *    实现gradient field distortion — "光不是移动，而是弯曲"
   */
  const updateCursorVars = (x: number, y: number) => {
    const root = document.documentElement
    const vw = window.innerWidth
    const vh = window.innerHeight

    // Pixel values for cursor glow element positioning
    root.style.setProperty('--cursor-x', `${x}px`)
    root.style.setProperty('--cursor-y', `${y}px`)

    // Pixel values for radial-gradient positioning (legacy — used by Blog/CodeBlock pages)
    // Home page now uses useGlobalLight composable with --light-x/y instead
    root.style.setProperty('--mouse-x', `${x}px`)
    root.style.setProperty('--mouse-y', `${y}px`)

    // Global Light Source — viewport percentage for all components
    root.style.setProperty('--global-light-x', `${((x / vw) * 100).toFixed(1)}%`)
    root.style.setProperty('--global-light-y', `${((y / vh) * 100).toFixed(1)}%`)
    root.style.setProperty('--global-light-active', '1')

    // Light Bending — normalized vector from center
    // Creates "light bends, not moves" effect via gradient field distortion
    const bendX = ((x / vw) - 0.5) * 2  // -1 to 1
    const bendY = ((y / vh) - 0.5) * 2  // -1 to 1
    root.style.setProperty('--light-bend-x', bendX.toFixed(3))
    root.style.setProperty('--light-bend-y', bendY.toFixed(3))
  }

  /** 更新 magnetic elements — 鼠标靠近时轻微位移 */
  const updateMagnetic = (mouseX: number, mouseY: number) => {
    magneticElements.forEach((rect, el) => {
      // Re-calculate rect on each frame for accuracy
      const currentRect = el.getBoundingClientRect()
      const centerX = currentRect.left + currentRect.width / 2
      const centerY = currentRect.top + currentRect.height / 2
      const distanceX = mouseX - centerX
      const distanceY = mouseY - centerY
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

      if (distance < MAGNETIC_RADIUS) {
        // Within activation radius — pull toward cursor
        const pull = 1 - (distance / MAGNETIC_RADIUS)
        const moveX = distanceX * MAGNETIC_STRENGTH * pull
        const moveY = distanceY * MAGNETIC_STRENGTH * pull
        el.style.setProperty('--magnetic-x', `${moveX}px`)
        el.style.setProperty('--magnetic-y', `${moveY}px`)
      } else {
        // Outside radius — reset
        el.style.setProperty('--magnetic-x', '0px')
        el.style.setProperty('--magnetic-y', '0px')
      }
    })
  }

  /** 更新 cursor distortion — hero background shifts */
  const updateDistortion = (mouseX: number, mouseY: number) => {
    const vw = window.innerWidth
    const vh = window.innerHeight

    // Normalize to -1...1
    const normX = (mouseX / vw - DISTORT_NORMALIZE) * 2
    const normY = (mouseY / vh - DISTORT_NORMALIZE) * 2

    distortElements.forEach((el) => {
      el.style.setProperty('--us-cursor-distort-x', `${normX}`)
      el.style.setProperty('--us-cursor-distort-y', `${normY}`)
    })
  }

  /** 更新 Surface Deformation — card tilt/shadow/highlight follow cursor
   *  鼠标靠近 [data-surface] 元素时:
   *  - perspective rotateX/rotateY (3D tilt)
   *  - shadow direction follows cursor
   *  - highlight gradient shifts across surface
   *
   *  这是"视觉结构变形"而非"光效装饰"：
   *  鼠标在改变card的物理结构权重
   */
  const updateSurfaceDeformation = (mouseX: number, mouseY: number) => {
    surfaceElements.forEach((el) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distanceX = mouseX - centerX
      const distanceY = mouseY - centerY
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)

      if (distance < SURFACE_RADIUS) {
        // Within deformation radius — calculate tilt, shadow, highlight
        const proximity = 1 - (distance / SURFACE_RADIUS)  // 0 to 1
        const smoothProximity = proximity * proximity  // ease-in curve

        // Tilt: rotateY based on horizontal offset, rotateX based on vertical
        const tiltY = (distanceX / (rect.width / 2)) * SURFACE_MAX_TILT * smoothProximity
        const tiltX = -((distanceY / (rect.height / 2)) * SURFACE_MAX_TILT * smoothProximity)

        // Clamp tilt values
        const clampedTiltX = Math.max(-SURFACE_MAX_TILT, Math.min(SURFACE_MAX_TILT, tiltX))
        const clampedTiltY = Math.max(-SURFACE_MAX_TILT, Math.min(SURFACE_MAX_TILT, tiltY))

        // Shadow direction: opposite to cursor (light comes from cursor)
        const shadowX = -distanceX * 0.02 * smoothProximity
        const shadowY = -distanceY * 0.02 * smoothProximity

        // Highlight position: where cursor is relative to card (0-100%)
        const highlightX = ((mouseX - rect.left) / rect.width) * 100
        const highlightY = ((mouseY - rect.top) / rect.height) * 100

        // Highlight intensity based on proximity
        const highlightIntensity = SURFACE_HIGHLIGHT_MAX * smoothProximity

        el.style.setProperty('--surface-tilt-x', `${clampedTiltX.toFixed(2)}deg`)
        el.style.setProperty('--surface-tilt-y', `${clampedTiltY.toFixed(2)}deg`)
        el.style.setProperty('--surface-shadow-x', `${shadowX.toFixed(1)}px`)
        el.style.setProperty('--surface-shadow-y', `${shadowY.toFixed(1)}px`)
        el.style.setProperty('--surface-highlight-x', `${highlightX.toFixed(1)}%`)
        el.style.setProperty('--surface-highlight-y', `${highlightY.toFixed(1)}%`)
        el.style.setProperty('--surface-highlight-intensity', highlightIntensity.toFixed(3))
        el.style.setProperty('--surface-proximity', smoothProximity.toFixed(3))
      } else {
        // Outside radius — smooth reset
        el.style.setProperty('--surface-tilt-x', '0deg')
        el.style.setProperty('--surface-tilt-y', '0deg')
        el.style.setProperty('--surface-shadow-x', '0px')
        el.style.setProperty('--surface-shadow-y', '0px')
        el.style.setProperty('--surface-highlight-intensity', '0')
        el.style.setProperty('--surface-proximity', '0')
      }
    })
  }

  /** 更新 Visual Focus — hover时dim同组其他元素
   *  [data-focus-group] 容器内的 [data-surface] 元素:
   *  当某个被hover时，其他元素添加 --focus-dimmed 状态
   *  形成"视觉注意力收缩"
   */
  const setupVisualFocus = () => {
    focusGroups.forEach((group) => {
      const items = group.querySelectorAll<HTMLElement>('[data-surface]')

      items.forEach((item) => {
        item.addEventListener('mouseenter', () => {
          // This item is focused — dim siblings
          items.forEach((sibling) => {
            if (sibling !== item) {
              sibling.style.setProperty('--focus-dim', '0.7')
            }
          })
          group.style.setProperty('--focus-active', '1')
        })

        item.addEventListener('mouseleave', () => {
          // Reset all
          items.forEach((sibling) => {
            sibling.style.setProperty('--focus-dim', '1')
          })
          group.style.setProperty('--focus-active', '0')
        })
      })
    })
  }

  /** RAF 节流的 mousemove handler */
  const onMouseMove = (e: MouseEvent) => {
    if (!isDesktop || prefersReducedMotion) return
    if (rafId !== null) return

    lastMouseX = e.clientX
    lastMouseY = e.clientY

    // Reset idle timer
    if (idleTimerId !== null) {
      clearTimeout(idleTimerId)
    }
    idleTimerId = window.setTimeout(() => {
      const root = document.documentElement
      root.style.setProperty('--global-light-active', '0')
    }, IDLE_TIMEOUT)

    rafId = requestAnimationFrame(() => {
      updateCursorVars(lastMouseX, lastMouseY)
      if (enableMagnetic) updateMagnetic(lastMouseX, lastMouseY)
      if (enableDistortion) updateDistortion(lastMouseX, lastMouseY)
      if (enableSurface) updateSurfaceDeformation(lastMouseX, lastMouseY)
      rafId = null
    })
  }

  /** 鼠标离开窗口 — 重置 magnetic + 熄灭光源 */
  const onMouseLeave = () => {
    const root = document.documentElement
    root.style.setProperty('--global-light-active', '0')
    // Reset all magnetic elements
    magneticElements.forEach((_, el) => {
      el.style.setProperty('--magnetic-x', '0px')
      el.style.setProperty('--magnetic-y', '0px')
    })
  }

  /** 初始化 */
  const init = () => {
    detectEnvironment()
    if (!isDesktop || prefersReducedMotion) return

    const root = document.documentElement
    // Set initial cursor position off-screen
    root.style.setProperty('--cursor-x', '-9999px')
    root.style.setProperty('--cursor-y', '-9999px')
    // Initialize global light source — centered, inactive until mouse moves
    root.style.setProperty('--global-light-x', '50%')
    root.style.setProperty('--global-light-y', '50%')
    root.style.setProperty('--global-light-active', '0')

    collectMagneticElements()
    collectDistortElements()
    collectSurfaceElements()
    collectFocusGroups()

    // Setup visual focus event listeners
    if (enableFocus) setupVisualFocus()

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
  }

  /** 销毁 */
  const destroy = () => {
    window.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseleave', onMouseLeave)

    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    if (idleTimerId !== null) {
      clearTimeout(idleTimerId)
      idleTimerId = null
    }

    // Reset magnetic elements
    magneticElements.forEach((_, el) => {
      el.style.removeProperty('--magnetic-x')
      el.style.removeProperty('--magnetic-y')
    })

    // Reset distort elements
    distortElements.forEach((el) => {
      el.style.removeProperty('--us-cursor-distort-x')
      el.style.removeProperty('--us-cursor-distort-y')
    })

    // Reset surface deformation elements
    surfaceElements.forEach((el) => {
      el.style.removeProperty('--surface-tilt-x')
      el.style.removeProperty('--surface-tilt-y')
      el.style.removeProperty('--surface-shadow-x')
      el.style.removeProperty('--surface-shadow-y')
      el.style.removeProperty('--surface-highlight-x')
      el.style.removeProperty('--surface-highlight-y')
      el.style.removeProperty('--surface-highlight-intensity')
      el.style.removeProperty('--surface-proximity')
      el.style.removeProperty('--focus-dim')
    })

    // Reset focus groups
    focusGroups.forEach((group) => {
      group.style.removeProperty('--focus-active')
    })

    // Reset cursor vars + global light vars + light bending vars
    const root = document.documentElement
    root.style.removeProperty('--cursor-x')
    root.style.removeProperty('--cursor-y')
    root.style.removeProperty('--global-light-x')
    root.style.removeProperty('--global-light-y')
    root.style.removeProperty('--global-light-active')
    root.style.removeProperty('--light-bend-x')
    root.style.removeProperty('--light-bend-y')

    magneticElements.clear()
    distortElements = []
    surfaceElements = []
    focusGroups = []
  }

  /** 重新收集元素 (动态内容变化后调用) */
  const refresh = () => {
    collectMagneticElements()
    collectDistortElements()
    collectSurfaceElements()
    collectFocusGroups()
    if (enableFocus) setupVisualFocus()
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