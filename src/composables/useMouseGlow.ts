/**
 * useMouseGlow — Stripe-style mouse-tracking glow effect for cards
 *
 * Creates a vivid radial gradient highlight that follows the cursor,
 * matching Stripe's card hover effect where light visibly follows the mouse.
 *
 * Key: The glow must be OBVIOUS — not subtle. Stripe cards have a clear,
 * visible light spot that moves with the cursor.
 */
import { ref, onMounted, onUnmounted, type Ref } from 'vue'

interface MouseGlowOptions {
  /** Glow size in px (default: 400) */
  glowSize?: number
  /** Glow color for light mode (default: rgba(99, 102, 241, 0.15)) */
  lightColor?: string
  /** Glow color for dark mode (default: rgba(129, 140, 248, 0.25)) */
  darkColor?: string
  /** Whether glow is active (default: true) */
  enabled?: boolean
}

export function useMouseGlow(
  elementRef: Ref<HTMLElement | null>,
  options: MouseGlowOptions = {}
) {
  const {
    glowSize = 400,
    lightColor = 'rgba(99, 102, 241, 0.15)',
    darkColor = 'rgba(129, 140, 248, 0.25)',
    enabled = true,
  } = options

  const isHovering = ref(false)

  let rafId: number | null = null
  let targetX = 0
  let targetY = 0
  let currentX = 0
  let currentY = 0

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const interpolate = () => {
    const ease = 0.12
    currentX += (targetX - currentX) * ease
    currentY += (targetY - currentY) * ease

    if (elementRef.value) {
      elementRef.value.style.setProperty('--glow-x', `${currentX}px`)
      elementRef.value.style.setProperty('--glow-y', `${currentY}px`)
    }

    if (Math.abs(targetX - currentX) > 0.5 || Math.abs(targetY - currentY) > 0.5) {
      rafId = requestAnimationFrame(interpolate)
    } else {
      rafId = null
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!enabled || !elementRef.value || prefersReducedMotion()) return

    const rect = elementRef.value.getBoundingClientRect()
    targetX = e.clientX - rect.left
    targetY = e.clientY - rect.top

    if (!rafId) {
      rafId = requestAnimationFrame(interpolate)
    }
  }

  const handleMouseEnter = () => {
    if (!enabled || prefersReducedMotion()) return
    isHovering.value = true
    if (elementRef.value) {
      const isDark = document.documentElement.classList.contains('dark')
      const color = isDark ? darkColor : lightColor
      elementRef.value.style.setProperty('--glow-size', `${glowSize}px`)
      elementRef.value.style.setProperty('--glow-color', color)
      elementRef.value.classList.add('has-mouse-glow')
    }
  }

  const handleMouseLeave = () => {
    isHovering.value = false
    if (elementRef.value) {
      elementRef.value.classList.remove('has-mouse-glow')
    }
  }

  // Watch for dark mode changes while hovering
  let darkModeObserver: MutationObserver | null = null

  onMounted(() => {
    if (elementRef.value) {
      elementRef.value.addEventListener('mousemove', handleMouseMove, { passive: true })
      elementRef.value.addEventListener('mouseenter', handleMouseEnter, { passive: true })
      elementRef.value.addEventListener('mouseleave', handleMouseLeave, { passive: true })
    }

    darkModeObserver = new MutationObserver(() => {
      if (isHovering.value && elementRef.value) {
        const isDark = document.documentElement.classList.contains('dark')
        const color = isDark ? darkColor : lightColor
        elementRef.value.style.setProperty('--glow-color', color)
      }
    })
    darkModeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
  })

  onUnmounted(() => {
    if (elementRef.value) {
      elementRef.value.removeEventListener('mousemove', handleMouseMove)
      elementRef.value.removeEventListener('mouseenter', handleMouseEnter)
      elementRef.value.removeEventListener('mouseleave', handleMouseLeave)
    }
    if (darkModeObserver) {
      darkModeObserver.disconnect()
    }
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
    }
  })

  return {
    isHovering,
  }
}