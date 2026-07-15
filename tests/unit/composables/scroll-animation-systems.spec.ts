import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  useScrollAnimations,
  type ScrollAnimationType
} from '@/composables/useScrollAnimations'
import { useScrollReveal, vScrollReveal } from '@/composables/useScrollReveal'
import { useStripeScrollAnimation } from '@/composables/useStripeScrollAnimation'

const { animationMocks } = vi.hoisted(() => {
  const triggers: Array<{ kill: ReturnType<typeof vi.fn> }> = []
  const tweens: Array<{
    kill: ReturnType<typeof vi.fn>
    scrollTrigger: { kill: ReturnType<typeof vi.fn> }
  }> = []
  const createTween = () => {
    const scrollTrigger = { kill: vi.fn() }
    const tween = { kill: vi.fn(), scrollTrigger }
    triggers.push(scrollTrigger)
    tweens.push(tween)
    return tween
  }
  const timeline = { fromTo: vi.fn() }
  timeline.fromTo.mockReturnValue(timeline)
  return {
    animationMocks: {
      createTween,
      fromTo: vi.fn(() => createTween()),
      registerPlugin: vi.fn(),
      set: vi.fn(),
      timeline: vi.fn(() => timeline),
      timelineInstance: timeline,
      to: vi.fn((_target: object, vars: { scrollTrigger?: { onUpdate?: (self: { progress: number }) => void } }) => {
        vars.scrollTrigger?.onUpdate?.({ progress: 0.75 })
        return createTween()
      }),
      triggers,
      tweens
    }
  }
})

vi.mock('gsap', () => ({ gsap: animationMocks }))
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }))

class TestIntersectionObserver {
  static instances: TestIntersectionObserver[] = []
  readonly root = null
  readonly rootMargin = '0px'
  readonly thresholds = [0.1]
  readonly observe = vi.fn((_target: Element) => undefined)
  readonly unobserve = vi.fn((_target: Element) => undefined)
  readonly disconnect = vi.fn()
  readonly takeRecords = vi.fn((): IntersectionObserverEntry[] => [])

  constructor(
    private readonly callback: IntersectionObserverCallback,
    readonly options?: IntersectionObserverInit
  ) {
    TestIntersectionObserver.instances.push(this)
  }

  emit(target: Element, isIntersecting: boolean) {
    const rect = target.getBoundingClientRect()
    const entry: IntersectionObserverEntry = {
      boundingClientRect: rect,
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: rect,
      isIntersecting,
      rootBounds: null,
      target,
      time: 0
    }
    this.callback([entry], this)
  }
}

const mediaQuery = (matches: boolean): MediaQueryList => ({
  matches,
  media: '(prefers-reduced-motion: reduce)',
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(() => true)
})

describe('scroll animation primitives', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div class="item"></div><div class="item"></div>'
    TestIntersectionObserver.instances = []
    Object.defineProperty(globalThis, 'IntersectionObserver', {
      configurable: true,
      value: TestIntersectionObserver
    })
    vi.spyOn(window, 'matchMedia').mockReturnValue(mediaQuery(false))
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 2000
    })
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000 })
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 500 })
    animationMocks.triggers.length = 0
    animationMocks.tweens.length = 0
    vi.clearAllMocks()
  })

  it('creates every scroll entrance and utility path', () => {
    let api: ReturnType<typeof useScrollAnimations> | undefined
    const wrapper = mount(
      defineComponent({
        setup() {
          api = useScrollAnimations()
          return () => h('div')
        }
      })
    )
    const target = document.querySelector('.item')
    const types: ScrollAnimationType[] = [
      'fade-in-up', 'fade-in-left', 'fade-in-right', 'fade-in',
      'scale-in', 'slide-in-left', 'slide-in-right'
    ]
    types.forEach((type) => api?.createScrollAnimation(target ?? '.item', type))
    expect(animationMocks.fromTo).toHaveBeenCalledTimes(7)
    api?.createScrollAnimation('.item', 'fade-in', {
      trigger: 'body', delay: 0.2, scrub: 0.5, once: false
    })
    expect(api?.createScrollAnimations('.item', 'fade-in-up', { delay: 0.1 })).toHaveLength(2)
    expect(api?.createParallax(target ?? '.item', { speed: 0.2, trigger: 'body' })).not.toBeNull()
    expect(api?.createScrollProgressIndicator('.item')).not.toBeNull()
    expect(api?.scrollProgress.value).toBe(0.75)

    const observed = vi.fn()
    const observer = api?.observeElements('.item', observed, { threshold: 0.5 })
    expect(observer?.observe).toHaveBeenCalledTimes(2)
    const animatedObserver = api?.animateOnScroll('.item', 'visible-now')
    const first = document.querySelector('.item')
    if (first) {
      TestIntersectionObserver.instances[1]?.emit(first, true)
      TestIntersectionObserver.instances[1]?.emit(first, false)
      expect(first.classList.contains('visible-now')).toBe(true)
    }

    api?.scrollToElement('#missing')
    api?.scrollToElement(target ?? '.item', 20, 0.5)
    api?.scrollToElement('.item')
    api?.scrollToTop(0.2)
    expect(animationMocks.to).toHaveBeenCalled()
    expect(animatedObserver).toBeDefined()
    wrapper.unmount()
    expect(animationMocks.triggers.some((trigger) => trigger.kill.mock.calls.length > 0)).toBe(true)
    expect(TestIntersectionObserver.instances[0]?.disconnect).toHaveBeenCalled()
  })

  it('skips motion-heavy scroll primitives for reduced motion', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue(mediaQuery(true))
    let api: ReturnType<typeof useScrollAnimations> | undefined
    const wrapper = mount(
      defineComponent({
        setup() {
          api = useScrollAnimations()
          return () => h('div')
        }
      })
    )
    expect(api?.prefersReducedMotion()).toBe(true)
    expect(api?.createScrollAnimation('.item', 'fade-in')).toBeNull()
    expect(api?.createScrollAnimations('.item', 'fade-in')).toBeNull()
    expect(api?.createParallax('.item')).toBeNull()
    expect(api?.createScrollProgressIndicator('.item')).toBeNull()
    wrapper.unmount()
  })
})

describe('scroll reveal observers', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    TestIntersectionObserver.instances = []
    Object.defineProperty(globalThis, 'IntersectionObserver', {
      configurable: true,
      value: TestIntersectionObserver
    })
  })

  it('observes children, staggers entries and applies the safety fallback', () => {
    vi.useFakeTimers()
    let api: ReturnType<typeof useScrollReveal> | undefined
    const wrapper = mount(
      defineComponent({
        setup() {
          api = useScrollReveal()
          return () => h('div')
        }
      })
    )
    const container = document.createElement('div')
    container.innerHTML = `
      <div class="vs-reveal vs-reveal--stagger"></div>
      <div class="vs-reveal"></div>
      <div class="vs-reveal"></div>
    `
    const children = container.querySelectorAll<HTMLElement>('.vs-reveal')
    vi.spyOn(children[0], 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 450, 10, 100))
    api?.observe(null)
    api?.observe(children[0])
    api?.observeChildren(container)
    expect(TestIntersectionObserver.instances[0]?.observe).toHaveBeenCalledTimes(4)
    TestIntersectionObserver.instances[0]?.emit(children[0], true)
    expect(children[0].classList.contains('vs-reveal--visible')).toBe(true)
    expect(children[0].style.getPropertyValue('--stagger-delay')).toBe('0ms')
    vi.advanceTimersByTime(3001)
    expect(children[2].classList.contains('vs-reveal--visible')).toBe(true)
    api?.unobserve(null)
    api?.unobserve(children[1])
    api?.disconnect()
    wrapper.unmount()
    vi.useRealTimers()
  })

  it('removes visibility for repeat observations', () => {
    let api: ReturnType<typeof useScrollReveal> | undefined
    const wrapper = mount(
      defineComponent({
        setup() {
          api = useScrollReveal({ once: false, viewportStagger: false })
          return () => h('div')
        }
      })
    )
    const target = document.createElement('div')
    target.className = 'vs-reveal vs-reveal--stagger'
    api?.observe(target)
    TestIntersectionObserver.instances[0]?.emit(target, true)
    expect(target.classList.contains('vs-reveal--visible')).toBe(true)
    TestIntersectionObserver.instances[0]?.emit(target, false)
    expect(target.classList.contains('vs-reveal--visible')).toBe(false)
    wrapper.unmount()
  })

  it('runs staggered and plain directive lifecycle paths', () => {
    const staggered = document.createElement('div')
    vi.spyOn(staggered, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 10, 10))
    vScrollReveal.mounted(staggered, { arg: 'stagger', value: { index: 4 } })
    expect(staggered.style.getPropertyValue('--stagger-delay')).toBe('200ms')
    TestIntersectionObserver.instances[0]?.emit(staggered, true)
    expect(staggered.classList.contains('vs-reveal--visible')).toBe(true)
    vScrollReveal.unmounted(staggered)
    expect(TestIntersectionObserver.instances[0]?.disconnect).toHaveBeenCalled()

    const plain = document.createElement('div')
    vScrollReveal.mounted(plain, {})
    expect(plain.classList.contains('vs-reveal--stagger')).toBe(false)
    vScrollReveal.unmounted(plain)
  })
})

describe('Stripe scroll choreography', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.spyOn(window, 'matchMedia').mockReturnValue(mediaQuery(false))
    animationMocks.triggers.length = 0
    animationMocks.tweens.length = 0
    vi.clearAllMocks()
  })

  it('runs entrance, parallax and stagger variants', () => {
    let api: ReturnType<typeof useStripeScrollAnimation> | undefined
    const wrapper = mount(
      defineComponent({
        setup() {
          api = useStripeScrollAnimation()
          return () => h('div')
        }
      })
    )
    const target = document.createElement('div')
    target.className = 'stripe-target'
    document.body.appendChild(target)
    expect(api?.entrance(null)).toBeNull()
    expect(api?.entrance('.missing')).toBeNull()
    expect(api?.entrance('.stripe-target')).not.toBeNull()
    expect(api?.entrance(target, { scrub: 0.5, once: false, yOffset: 10 })).not.toBeNull()
    expect(api?.parallax(null)).toBeNull()
    expect(api?.parallax('.missing')).toBeNull()
    expect(api?.parallax(target, { speed: 0.4, start: 'top top' })).not.toBeNull()
    expect(api?.staggerEntrance('.missing')).toBeNull()
    expect(api?.staggerEntrance([target], { stagger: 0.2, once: false })).not.toBeNull()
    expect(api?.staggerEntrance(document.querySelectorAll('.stripe-target'))).not.toBeNull()
    expect(api?.staggerEntrance('.stripe-target')).not.toBeNull()
    expect(animationMocks.set).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('choreographs complete, empty and missing sections', () => {
    const api = useStripeScrollAnimation()
    const section = document.createElement('section')
    section.innerHTML = `
      <span class="section-label"></span>
      <h2 class="section-title"></h2>
      <article class="section-card"></article>
      <article class="section-card"></article>
      <a class="section-cta"></a>
    `
    api.sectionChoreography({
      sectionRef: ref(section),
      entrance: { duration: 1, ease: 'linear', stagger: 0.2, yOffset: 20 }
    })
    expect(animationMocks.to).toHaveBeenCalledTimes(4)
    expect(animationMocks.set).toHaveBeenCalledTimes(4)

    api.sectionChoreography({ sectionRef: ref(document.createElement('section')) })
    api.sectionChoreography({ sectionRef: ref<HTMLElement | null>(null) })
    expect(animationMocks.to).toHaveBeenCalledTimes(4)
  })

  it('builds full and sparse hero timelines', () => {
    const api = useStripeScrollAnimation()
    const hero = document.createElement('section')
    hero.innerHTML = `
      <h1 class="hero__name"></h1><div class="metric"></div>
      <p class="hero__role"></p><p class="hero__positioning"></p>
      <div class="hero__actions"></div><div class="hero__social"></div>
    `
    api.heroEntrance(ref(hero))
    expect(animationMocks.timelineInstance.fromTo).toHaveBeenCalledTimes(6)
    api.heroEntrance(ref(document.createElement('section')))
    api.heroEntrance(ref<HTMLElement | null>(null))
  })

  it('makes section content static for reduced motion', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue(mediaQuery(true))
    const api = useStripeScrollAnimation()
    const section = document.createElement('section')
    section.innerHTML = '<h2 class="a"></h2><p class="b"></p><div class="c"></div><a class="d"></a>'
    const target = section.querySelector('.a')
    api.sectionChoreography({
      sectionRef: ref(section),
      titleSelector: '.a',
      subtitleSelector: '.b',
      cardSelector: '.c',
      ctaSelector: '.d'
    })
    expect(target?.getAttribute('style')).toContain('opacity: 1')
    api.sectionChoreography({
      sectionRef: ref<HTMLElement | null>(null),
      titleSelector: '.a',
      subtitleSelector: '.b',
      cardSelector: '.c',
      ctaSelector: '.d'
    })
    expect(api.entrance(target)).toBeNull()
    expect(api.parallax(target)).toBeNull()
    expect(api.staggerEntrance([target].filter((item): item is Element => item !== null))).toBeNull()
    api.heroEntrance(ref(section))
    api.cleanup()
    expect(animationMocks.to).not.toHaveBeenCalled()
  })
})
