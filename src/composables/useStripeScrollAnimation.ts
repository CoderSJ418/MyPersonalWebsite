/**
 * useStripeScrollAnimation — Stripe-level GSAP ScrollTrigger animation system
 *
 * Upgrades the CSS-only vs-reveal system to GSAP-driven choreographed
 * entrance animations matching Stripe's motion design language.
 *
 * Key Stripe patterns implemented:
 * 1. Section entrance choreography: title → subtitle → cards in sequence
 * 2. Scroll-driven opacity/transform with precise easing
 * 3. Subtle parallax on section backgrounds
 * 4. Staggered card entrance with viewport-position awareness
 * 5. Micro-interaction timing curves matching Stripe's feel
 *
 * Easing reference (Stripe uses these curves):
 * - Entrance: power3.out (decelerate smoothly)
 * - Parallax: power1.inOut (linear-ish, smooth)
 * - Hover micro: power2.out (quick settle)
 * - Stagger: 0.08-0.15s between elements
 *
 * Reduced motion: Falls back to instant visibility (opacity 1, no transform)
 */

import { onUnmounted, type Ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── Stripe-standard easing curves ──
const STRIPE_EASE = {
  entrance: 'power3.out',      // Smooth deceleration for entrance
  entranceHeavy: 'power4.out', // Strong deceleration for hero elements
  parallax: 'power1.inOut',    // Near-linear for scroll-driven
  micro: 'power2.out',         // Quick settle for micro-interactions
  spring: 'back.out(1.2)',     // Subtle overshoot for emphasis
} as const

// ── Stripe-standard timing ──
const STRIPE_TIMING = {
  entranceDuration: 0.8,       // Main entrance animation duration (s)
  heroDuration: 1.0,           // Hero section entrance (slightly longer)
  staggerInterval: 0.1,        // Time between staggered elements (s)
  cardStagger: 0.12,           // Card-specific stagger (s)
  parallaxDuration: 1,         // Parallax scroll duration (scrub)
  startTrigger: 'top 85%',     // Default ScrollTrigger start position
  endTrigger: 'bottom 20%',    // Default ScrollTrigger end position
} as const

// ── Animation configuration ──
export interface StripeEntranceConfig {
  /** GSAP ScrollTrigger start position (default: 'top 85%') */
  start?: string
  /** Animation duration in seconds (default: 0.8) */
  duration?: number
  /** Easing curve (default: 'power3.out') */
  ease?: string
  /** Stagger delay between elements in seconds (default: 0.1) */
  stagger?: number
  /** Y-offset for entrance animation in px (default: 40) */
  yOffset?: number
  /** Whether to use scrub mode (scroll-driven) instead of toggle */
  scrub?: boolean | number
  /** Toggle actions for non-scrub mode (default: 'play none none none') */
  toggleActions?: string
  /** Whether to mark elements as visible immediately on reduced motion */
  once?: boolean
}

export interface StripeParallaxConfig {
  /** Parallax speed: 0 = static, 1 = full scroll distance (default: 0.3) */
  speed?: number
  /** GSAP ScrollTrigger start (default: 'top bottom') */
  start?: string
  /** GSAP ScrollTrigger end (default: 'bottom top') */
  end?: string
}

export interface StripeSectionChoreographyConfig {
  /** Section container ref */
  sectionRef: Ref<HTMLElement | null>
  /** Selector for the section title/heading */
  titleSelector?: string
  /** Selector for the section subtitle/label */
  subtitleSelector?: string
  /** Selector for card/content elements to stagger */
  cardSelector?: string
  /** Selector for CTA/button elements */
  ctaSelector?: string
  /** Custom entrance config */
  entrance?: StripeEntranceConfig
}

/**
 * useStripeScrollAnimation — Stripe-level scroll-driven animation composable
 *
 * Provides three core animation primitives:
 * 1. entrance() — Single element scroll-triggered entrance
 * 2. sectionChoreography() — Orchestrated section entrance (title → cards → CTA)
 * 3. parallax() — Scroll-driven parallax offset
 */
export function useStripeScrollAnimation() {
  const scrollTriggers: ScrollTrigger[] = []
  const tweens: gsap.core.Tween[] = []

  const prefersReducedMotion = (): boolean => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  /**
   * Single element scroll-triggered entrance animation
   *
   * Matches Stripe's entrance pattern:
   * - opacity 0 → 1
   * - translateY offset → 0
   * - Optional: scale, rotation, blur
   *
   * @param element - Target element or selector
   * @param config - Animation configuration
   */
  const entrance = (
    element: Element | string | null,
    config: StripeEntranceConfig = {}
  ): gsap.core.Tween | null => {
    if (prefersReducedMotion() || !element) return null

    const target = typeof element === 'string'
      ? document.querySelector(element)
      : element
    if (!target) return null

    const {
      start = STRIPE_TIMING.startTrigger,
      duration = STRIPE_TIMING.entranceDuration,
      ease = STRIPE_EASE.entrance,
      yOffset = 40,
      scrub = false,
      toggleActions = 'play none none none',
      once = true,
    } = config

    // Set initial state
    gsap.set(target, { opacity: 0, y: yOffset })

    const tween = gsap.to(target, {
      opacity: 1,
      y: 0,
      duration,
      ease,
      scrollTrigger: {
        trigger: target,
        start,
        toggleActions: scrub ? undefined : toggleActions,
        scrub: scrub || undefined,
        once: once && !scrub,
      },
    })

    const trigger = tween.scrollTrigger
    if (trigger) scrollTriggers.push(trigger)
    tweens.push(tween)
    return tween
  }

  /**
   * Orchestrated section entrance choreography
   *
   * Matches Stripe's section entrance pattern:
   * 1. Section label/subtitle fades in first (fast)
   * 2. Section title fades in (slightly delayed)
   * 3. Cards stagger in from bottom (with viewport-position awareness)
   * 4. CTA fades in last
   *
   * @param config - Choreography configuration
   */
  const sectionChoreography = (
    config: StripeSectionChoreographyConfig
  ): void => {
    if (prefersReducedMotion()) {
      // On reduced motion, make everything visible immediately
      const section = config.sectionRef.value
      if (!section) return
      const allElements = section.querySelectorAll(
        `${config.titleSelector || ''}, ${config.subtitleSelector || ''}, ${config.cardSelector || ''}, ${config.ctaSelector || ''}`
      )
      allElements.forEach((el) => {
        ; (el as HTMLElement).style.opacity = '1'
          ; (el as HTMLElement).style.transform = 'none'
          ; (el as HTMLElement).style.filter = 'none'
      })
      return
    }

    const section = config.sectionRef.value
    if (!section) return

    const {
      titleSelector = '.section-title, h2, .fp__title',
      subtitleSelector = '.section-label, .section-subtitle, .fp__label',
      cardSelector = '.section-card, .fp__card, .card',
      ctaSelector = '.section-cta, .fp__cta, .fp__cta-link',
      entrance: entranceConfig = {},
    } = config

    const {
      start = STRIPE_TIMING.startTrigger,
      duration = STRIPE_TIMING.entranceDuration,
      ease = STRIPE_EASE.entrance,
      stagger = STRIPE_TIMING.cardStagger,
      yOffset = 40,
    } = entranceConfig

    // ── 1. Subtitle/Label entrance (first, fastest) ──
    const subtitles = section.querySelectorAll(subtitleSelector)
    if (subtitles.length > 0) {
      gsap.set(subtitles, { opacity: 0, y: yOffset * 0.6 })
      const subtitleTween = gsap.to(subtitles, {
        opacity: 1,
        y: 0,
        duration: duration * 0.7,
        ease,
        stagger: 0.06,
        scrollTrigger: {
          trigger: section,
          start,
          toggleActions: 'play none none none',
          once: true,
        },
      })
      tweens.push(subtitleTween)
      if (subtitleTween.scrollTrigger) {
        scrollTriggers.push(subtitleTween.scrollTrigger)
      }
    }

    // ── 2. Title entrance (slightly delayed after subtitle) ──
    const titles = section.querySelectorAll(titleSelector)
    if (titles.length > 0) {
      gsap.set(titles, { opacity: 0, y: yOffset * 0.8 })
      const titleTween = gsap.to(titles, {
        opacity: 1,
        y: 0,
        duration: duration * 0.85,
        ease,
        delay: 0.1,
        scrollTrigger: {
          trigger: section,
          start,
          toggleActions: 'play none none none',
          once: true,
        },
      })
      tweens.push(titleTween)
      if (titleTween.scrollTrigger) {
        scrollTriggers.push(titleTween.scrollTrigger)
      }
    }

    // ── 3. Cards stagger entrance (with viewport-position awareness) ──
    const cards = section.querySelectorAll(cardSelector)
    if (cards.length > 0) {
      gsap.set(cards, { opacity: 0, y: yOffset })
      const cardTween = gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration,
        ease,
        stagger: {
          each: stagger,
          from: 'start',
        },
        delay: 0.2,
        scrollTrigger: {
          trigger: section,
          start,
          toggleActions: 'play none none none',
          once: true,
        },
      })
      tweens.push(cardTween)
      if (cardTween.scrollTrigger) {
        scrollTriggers.push(cardTween.scrollTrigger)
      }
    }

    // ── 4. CTA entrance (last, after cards) ──
    const ctas = section.querySelectorAll(ctaSelector)
    if (ctas.length > 0) {
      gsap.set(ctas, { opacity: 0, y: yOffset * 0.5 })
      const ctaTween = gsap.to(ctas, {
        opacity: 1,
        y: 0,
        duration: duration * 0.6,
        ease,
        delay: 0.3 + cards.length * stagger,
        scrollTrigger: {
          trigger: section,
          start,
          toggleActions: 'play none none none',
          once: true,
        },
      })
      tweens.push(ctaTween)
      if (ctaTween.scrollTrigger) {
        scrollTriggers.push(ctaTween.scrollTrigger)
      }
    }
  }

  /**
   * Scroll-driven parallax effect
   *
   * Matches Stripe's subtle parallax: elements move at different
   * speeds as the user scrolls, creating depth.
   *
   * @param element - Target element
   * @param config - Parallax configuration
   */
  const parallax = (
    element: Element | string | null,
    config: StripeParallaxConfig = {}
  ): gsap.core.Tween | null => {
    if (prefersReducedMotion() || !element) return null

    const target = typeof element === 'string'
      ? document.querySelector(element)
      : element
    if (!target) return null

    const {
      speed = 0.3,
      start = 'top bottom',
      end = 'bottom top',
    } = config

    const tween = gsap.to(target, {
      y: () => window.innerHeight * speed * 0.1,
      ease: STRIPE_EASE.parallax,
      scrollTrigger: {
        trigger: target,
        start,
        end,
        scrub: STRIPE_TIMING.parallaxDuration,
      },
    })

    const trigger = tween.scrollTrigger
    if (trigger) scrollTriggers.push(trigger)
    tweens.push(tween)
    return tween
  }

  /**
   * Stagger entrance for a group of elements
   *
   * Like sectionChoreography but for arbitrary element groups
   * without the title/subtitle/CTA structure.
   *
   * @param elements - Array or selector of elements
   * @param config - Animation configuration
   */
  const staggerEntrance = (
    elements: Element[] | NodeListOf<Element> | string,
    config: StripeEntranceConfig = {}
  ): gsap.core.Tween | null => {
    if (prefersReducedMotion()) return null

    const targets = typeof elements === 'string'
      ? Array.from(document.querySelectorAll(elements))
      : Array.from(elements)

    if (targets.length === 0) return null

    const {
      start = STRIPE_TIMING.startTrigger,
      duration = STRIPE_TIMING.entranceDuration,
      ease = STRIPE_EASE.entrance,
      stagger = STRIPE_TIMING.staggerInterval,
      yOffset = 40,
      once = true,
    } = config

    gsap.set(targets, { opacity: 0, y: yOffset })

    const trigger = targets[0] // Use first element as trigger
    const tween = gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration,
      ease,
      stagger: {
        each: stagger,
        from: 'start',
      },
      scrollTrigger: {
        trigger,
        start,
        toggleActions: 'play none none none',
        once,
      },
    })

    if (tween.scrollTrigger) scrollTriggers.push(tween.scrollTrigger)
    tweens.push(tween)
    return tween
  }

  /**
   * Hero entrance animation — special choreography for the hero section
   *
   * Stripe's hero pattern:
   * 1. Background gradient mesh fades in (1.5s)
   * 2. Name/title fades up with heavy easing (1.0s)
   * 3. Metrics stagger in (0.8s each, 0.12s stagger)
   * 4. Role/positioning fades up (0.6s)
   * 5. Actions fade up (0.6s)
   * 6. Social links fade in (0.4s)
   *
   * @param heroRef - Hero section ref
   * @param selectors - CSS selectors for each hero element group
   */
  const heroEntrance = (
    heroRef: Ref<HTMLElement | null>,
    selectors: {
      name?: string
      metrics?: string
      role?: string
      positioning?: string
      actions?: string
      social?: string
    } = {}
  ): void => {
    if (prefersReducedMotion()) return

    const hero = heroRef.value
    if (!hero) return

    const {
      name = '.hero__name',
      metrics = '.metric',
      role = '.hero__role',
      positioning = '.hero__positioning',
      actions = '.hero__actions',
      social = '.hero__social',
    } = selectors

    // Create a master timeline for the hero
    const tl = gsap.timeline({
      defaults: {
        ease: STRIPE_EASE.entrance,
      },
    })

    // Name — heavy entrance
    const nameEl = hero.querySelector(name)
    if (nameEl) {
      tl.fromTo(nameEl,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: STRIPE_EASE.entranceHeavy },
        0.3
      )
    }

    // Metrics — stagger entrance
    const metricEls = hero.querySelectorAll(metrics)
    if (metricEls.length > 0) {
      tl.fromTo(metricEls,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.12, ease: STRIPE_EASE.spring },
        0.6
      )
    }

    // Role — fade up
    const roleEl = hero.querySelector(role)
    if (roleEl) {
      tl.fromTo(roleEl,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.9
      )
    }

    // Positioning — fade up
    const posEl = hero.querySelector(positioning)
    if (posEl) {
      tl.fromTo(posEl,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        1.1
      )
    }

    // Actions — fade up
    const actionEls = hero.querySelector(actions)
    if (actionEls) {
      tl.fromTo(actionEls,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        1.3
      )
    }

    // Social — fade in
    const socialEl = hero.querySelector(social)
    if (socialEl) {
      tl.fromTo(socialEl,
        { opacity: 0 },
        { opacity: 0.6, duration: 0.4 },
        1.5
      )
    }
  }

  /**
   * Clean up all animations and ScrollTriggers
   */
  const cleanup = () => {
    scrollTriggers.forEach((trigger) => trigger.kill())
    tweens.forEach((tween) => tween.kill())
    scrollTriggers.length = 0
    tweens.length = 0
  }

  onUnmounted(() => {
    cleanup()
  })

  return {
    entrance,
    sectionChoreography,
    parallax,
    staggerEntrance,
    heroEntrance,
    cleanup,
    // Expose easing and timing for direct use
    STRIPE_EASE,
    STRIPE_TIMING,
  }
}