import { defineComponent, h, ref, withDirectives } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useCard3D } from '@/composables/useCard3D'
import { useCardSpotlight, vSpotlight } from '@/composables/useCardSpotlight'
import { useCursor } from '@/composables/useCursor'
import { useGSAPAnimations } from '@/composables/useGSAPAnimations'
import { useGradientMesh } from '@/composables/useGradientMesh'
import { useMagneticButton } from '@/composables/useMagneticButton'
import { useMobilePerformance } from '@/composables/useMobilePerformance'
import { useScrollProgress } from '@/composables/useScrollProgress'

const { deviceState, gsapDelayedCall, gsapFromTo, gsapRegisterPlugin, gsapTo, motionState, tween } =
  vi.hoisted(() => {
    const animation = { kill: vi.fn() }
    return {
      deviceState: { mobile: false, touch: false },
      gsapDelayedCall: vi.fn((_delay: number, callback: () => void) => {
        callback()
        return animation
      }),
      gsapFromTo: vi.fn(
        (_target: Element, _start: object, end: { onComplete?: () => void }) => {
          end.onComplete?.()
          return animation
        }
      ),
      gsapRegisterPlugin: vi.fn(),
      gsapTo: vi.fn((target: object | number | null, values: object) =>
        typeof target === 'object' && target !== null ? Object.assign(target, values) : values
      ),
      motionState: { reduced: false },
      tween: animation
    }
  })

vi.mock('gsap', () => ({
  gsap: {
    delayedCall: gsapDelayedCall,
    fromTo: gsapFromTo,
    registerPlugin: gsapRegisterPlugin,
    to: gsapTo
  }
}))
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }))
vi.mock('@/utils/deviceDetection', () => ({
  isMobile: () => deviceState.mobile,
  isTouch: () => deviceState.touch
}))
vi.mock('@/utils/accessibility', () => ({
  prefersReducedMotion: () => motionState.reduced
}))

const pointerEvent = (element: HTMLElement, x = 50, y = 50): MouseEvent => {
  const event = new MouseEvent('mousemove', { clientX: x, clientY: y })
  Object.defineProperty(event, 'currentTarget', { configurable: true, value: element })
  return event
}

const mediaQueryController = (initialMatches: boolean) => {
  const target = new EventTarget()
  const query: MediaQueryList = {
    matches: initialMatches,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(target.addEventListener.bind(target)),
    removeEventListener: vi.fn(target.removeEventListener.bind(target)),
    dispatchEvent: target.dispatchEvent.bind(target)
  }
  return {
    query,
    dispatch(matches: boolean) {
      const event = new Event('change')
      Object.defineProperty(event, 'matches', { value: matches })
      target.dispatchEvent(event)
    }
  }
}

describe('pointer interaction composables', () => {
  let element: HTMLButtonElement

  beforeEach(() => {
    deviceState.mobile = false
    deviceState.touch = false
    gsapFromTo.mockClear()
    gsapTo.mockClear()
    element = document.createElement('button')
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 100, 100))
  })

  it('calculates, animates and resets a 3D card', () => {
    const card = useCard3D({ maxTilt: 10, glare: true })
    card.handleMouseEnter()
    card.handleMouseMove(pointerEvent(element, 75, 25))
    expect(card.transform.value).toContain('rotateX')
    expect(card.glareStyle.value.background).toContain('linear-gradient')
    card.handleMouseLeave()
    card.reset()
    expect(card.isHovering.value).toBe(false)
    card.isEnabled.value = false
    card.handleMouseMove(pointerEvent(element))
  })

  it('covers disabled and no-glare card variants', () => {
    const card = useCard3D({ glare: false, resetOnLeave: false })
    card.handleMouseMove(pointerEvent(element, 20, 80))
    expect(card.glareStyle.value).toEqual({})
    card.handleMouseLeave()
    card.isEnabled.value = false
    card.handleMouseEnter()
    card.reset()
  })

  it('moves, clicks and resets a magnetic button', () => {
    const magnetic = useMagneticButton({ strength: 2, elasticity: 0.5 })
    magnetic.handleMouseEnter(pointerEvent(element))
    magnetic.handleMouseMove(pointerEvent(element, 60, 50))
    expect(gsapTo).toHaveBeenCalled()
    magnetic.handleClick()
    magnetic.handleMouseLeave()
    magnetic.reset()
    expect(magnetic.buttonPosition.value).toEqual({ x: 0, y: 0 })
  })

  it('ignores magnetic actions while disabled or outside range', () => {
    const magnetic = useMagneticButton({ strength: 0.1 })
    magnetic.handleMouseEnter(pointerEvent(element))
    magnetic.handleMouseMove(pointerEvent(element, 500, 500))
    magnetic.isEnabled.value = false
    magnetic.handleMouseMove(pointerEvent(element))
    magnetic.handleMouseEnter(pointerEvent(element))
    magnetic.handleMouseLeave()
    magnetic.handleClick()
  })
})

describe('card spotlight', () => {
  it('tracks the pointer and removes composable styles on unmount', async () => {
    const target = document.createElement('div')
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(new DOMRect(10, 20, 100, 80))
    const wrapper = mount(
      defineComponent({
        setup() {
          useCardSpotlight(target, { color: '1,2,3', radius: 420 })
          return () => h('div')
        }
      })
    )

    target.dispatchEvent(new MouseEvent('mouseenter'))
    target.dispatchEvent(new MouseEvent('mousemove', { clientX: 35, clientY: 55 }))
    expect(target.style.getPropertyValue('--mouse-x')).toBe('25px')
    expect(target.style.getPropertyValue('--mouse-y')).toBe('35px')
    expect(target.style.getPropertyValue('--spotlight-opacity')).toBe('1')

    target.dispatchEvent(new MouseEvent('mouseleave'))
    expect(target.style.getPropertyValue('--spotlight-opacity')).toBe('0')
    wrapper.unmount()
    expect(target.classList.contains('spotlight-enabled')).toBe(false)
    expect(target.style.getPropertyValue('--spotlight-color')).toBe('')
  })

  it.each([true, '4,5,6'])('supports the %s directive value', (value) => {
    const wrapper = mount(
      defineComponent({
        setup() {
          return () => withDirectives(h('div'), [[vSpotlight, value]])
        }
      })
    )

    expect(wrapper.element.classList.contains('spotlight-enabled')).toBe(true)
    expect(wrapper.element.style.getPropertyValue('--spotlight-radius')).toBe('600px')
    wrapper.unmount()
    expect(wrapper.element.classList.contains('spotlight-enabled')).toBe(false)
  })

  it('updates object directive options and tolerates a missing element', async () => {
    const wrapper = mount(
      defineComponent({
        props: {
          color: { type: String, required: true },
          radius: { type: Number, required: true }
        },
        setup(props) {
          useCardSpotlight(null)
          return () =>
            withDirectives(h('div'), [
              [vSpotlight, { color: props.color, radius: props.radius }]
            ])
        }
      }),
      { props: { color: '10,20,30', radius: 300 } }
    )

    expect(wrapper.element.style.getPropertyValue('--spotlight-color')).toBe('10,20,30')
    await wrapper.setProps({ color: '30,20,10', radius: 700 })
    expect(wrapper.element.style.getPropertyValue('--spotlight-color')).toBe('30,20,10')
    expect(wrapper.element.style.getPropertyValue('--spotlight-radius')).toBe('700px')
    wrapper.unmount()
  })
})

describe('custom cursor', () => {
  beforeEach(() => {
    deviceState.mobile = false
    deviceState.touch = false
    gsapFromTo.mockClear()
    gsapTo.mockClear()
  })

  it('handles pointer movement, hover, ripples and lifecycle cleanup', () => {
    let cursor: ReturnType<typeof useCursor> | undefined
    const wrapper = mount(
      defineComponent({
        setup() {
          cursor = useCursor({ size: 12, hoverSize: 32, enableRipple: true })
          return () => h('div')
        }
      })
    )

    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 40, clientY: 60 }))
    window.dispatchEvent(new MouseEvent('mousedown', { clientX: 20, clientY: 30 }))
    expect(gsapTo).toHaveBeenCalled()
    expect(gsapFromTo).toHaveBeenCalled()

    const link = document.createElement('a')
    document.body.appendChild(link)
    link.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
    link.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }))
    cursor?.setHover(link)
    expect(cursor?.isHovering.value).toBe(true)
    cursor?.setHover(null)
    cursor?.hideCursor()
    cursor?.showCursor()
    expect(cursor?.isHovering.value).toBe(false)

    gsapFromTo.mockImplementationOnce(() => tween)
    cursor?.createRipple(10, 15)
    expect(document.querySelector('.cursor-ripple')).not.toBeNull()
    cursor?.clearRipples()
    expect(document.querySelector('.cursor-ripple')).toBeNull()
    link.remove()
    wrapper.unmount()
  })

  it.each([
    [true, false],
    [false, true]
  ])('stays disabled for mobile=%s touch=%s', (mobile, touch) => {
    deviceState.mobile = mobile
    deviceState.touch = touch
    let cursor: ReturnType<typeof useCursor> | undefined
    const wrapper = mount(
      defineComponent({
        setup() {
          cursor = useCursor()
          return () => h('div')
        }
      })
    )

    cursor?.updatePosition(1, 2)
    cursor?.setHover(document.body)
    cursor?.createRipple(1, 2)
    expect(cursor?.cursorEnabled.value).toBe(false)
    expect(gsapTo).not.toHaveBeenCalled()
    expect(gsapFromTo).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('supports disabling ripple feedback', () => {
    let cursor: ReturnType<typeof useCursor> | undefined
    const wrapper = mount(
      defineComponent({
        setup() {
          cursor = useCursor({ enableRipple: false })
          return () => h('div')
        }
      })
    )
    cursor?.createRipple(5, 5)
    expect(gsapFromTo).not.toHaveBeenCalled()
    wrapper.unmount()
  })
})

describe('mobile performance preferences', () => {
  it('detects mobile low-end devices and reacts to motion changes', () => {
    const media = mediaQueryController(false)
    vi.spyOn(window, 'matchMedia').mockReturnValue(media.query)
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla iPhone')
    vi.spyOn(navigator, 'hardwareConcurrency', 'get').mockReturnValue(2)
    let performance: ReturnType<typeof useMobilePerformance> | undefined
    const wrapper = mount(
      defineComponent({
        setup() {
          performance = useMobilePerformance()
          return () => h('div')
        }
      })
    )

    expect(performance?.isMobile.value).toBe(true)
    expect(performance?.isLowEndDevice.value).toBe(true)
    expect(performance?.prefersReducedMotion.value).toBe(false)
    media.dispatch(true)
    expect(performance?.prefersReducedMotion.value).toBe(true)
    wrapper.unmount()
    expect(media.query.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('keeps capable desktop devices in the full experience', () => {
    const media = mediaQueryController(true)
    vi.spyOn(window, 'matchMedia').mockReturnValue(media.query)
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Desktop Browser')
    vi.spyOn(navigator, 'hardwareConcurrency', 'get').mockReturnValue(8)
    Reflect.deleteProperty(window, 'isMobile')
    let performance: ReturnType<typeof useMobilePerformance> | undefined
    const wrapper = mount(
      defineComponent({
        setup() {
          performance = useMobilePerformance()
          return () => h('div')
        }
      })
    )

    expect(performance?.isMobile.value).toBe(false)
    expect(performance?.isLowEndDevice.value).toBe(false)
    expect(performance?.prefersReducedMotion.value).toBe(true)
    wrapper.unmount()
  })
})

describe('scroll progress', () => {
  beforeEach(() => {
    motionState.reduced = false
    gsapTo.mockClear()
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 2000
    })
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000 })
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 500 })
  })

  it('updates direct progress, scroll state and navigation targets', () => {
    vi.useFakeTimers()
    let api: ReturnType<typeof useScrollProgress> | undefined
    const wrapper = mount(
      defineComponent({
        setup() {
          api = useScrollProgress({ smooth: false, position: 'bottom', showPercentage: true })
          return () => h('div')
        }
      })
    )
    expect(api?.progress.value).toBe(0.5)
    expect(api?.percentage.value).toBe(50)

    window.dispatchEvent(new Event('scroll'))
    expect(api?.isScrolling.value).toBe(true)
    window.dispatchEvent(new Event('scroll'))
    vi.advanceTimersByTime(151)
    expect(api?.isScrolling.value).toBe(false)

    const target = document.createElement('section')
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 50, 10, 10))
    api?.scrollToElement('#missing')
    api?.scrollToElement(target, 20)
    api?.scrollToTop()
    api?.scrollToBottom()
    expect(gsapTo).toHaveBeenCalledTimes(3)
    wrapper.unmount()
    vi.useRealTimers()
  })

  it('uses reduced-motion and smooth animation paths', () => {
    motionState.reduced = true
    let reducedApi: ReturnType<typeof useScrollProgress> | undefined
    const reducedWrapper = mount(
      defineComponent({
        setup() {
          reducedApi = useScrollProgress()
          return () => h('div')
        }
      })
    )
    expect(reducedApi?.progress.value).toBe(0.5)
    expect(gsapTo).not.toHaveBeenCalled()
    reducedWrapper.unmount()

    motionState.reduced = false
    const smoothWrapper = mount(
      defineComponent({
        setup() {
          useScrollProgress({ smooth: true })
          return () => h('div')
        }
      })
    )
    expect(gsapTo).toHaveBeenCalledWith(
      0,
      expect.objectContaining({ value: 0.5, duration: 0.3 })
    )
    smoothWrapper.unmount()
  })
})

describe('GSAP animation helpers', () => {
  beforeEach(() => {
    gsapDelayedCall.mockClear()
    gsapFromTo.mockClear()
    gsapTo.mockClear()
    tween.kill.mockClear()
    vi.spyOn(window, 'matchMedia').mockReturnValue(mediaQueryController(false).query)
  })

  it('animates valid elements and clears tracked tweens', () => {
    const target = document.createElement('div')
    target.id = 'gsap-target'
    document.body.appendChild(target)
    let api: ReturnType<typeof useGSAPAnimations> | undefined
    const wrapper = mount(
      defineComponent({
        setup() {
          api = useGSAPAnimations()
          return () => h('div')
        }
      })
    )

    expect(api?.fadeIn(null)).toBeNull()
    expect(api?.fadeIn('#missing')).toBeNull()
    expect(api?.fadeIn('#gsap-target', { duration: 1, opacity: 0.8 })).toBe(tween)
    expect(api?.fadeInUp(target, { y: 12 })).toBe(tween)
    expect(api?.fadeInLeft(target, { x: 10 })).toBe(tween)
    expect(api?.fadeInRight(target)).toBe(tween)
    expect(api?.scaleIn(target, { scale: 1.2 })).toBe(tween)
    expect(api?.rotateIn(target, { rotation: 90 })).toBe(tween)
    expect(api?.staggerIn([])).toBeNull()
    expect(api?.staggerIn([target], { delay: 0.2 })).toBe(tween)
    expect(gsapFromTo).toHaveBeenCalledTimes(7)

    api?.clearAnimations()
    expect(tween.kill).toHaveBeenCalledTimes(7)
    target.remove()
    wrapper.unmount()
  })

  it('runs cursor and plain typewriter completion paths', () => {
    let api: ReturnType<typeof useGSAPAnimations> | undefined
    const wrapper = mount(
      defineComponent({
        setup() {
          api = useGSAPAnimations()
          return () => h('div')
        }
      })
    )
    const withCursor = document.createElement('div')
    const plain = document.createElement('div')
    const completed = vi.fn()

    api?.typewriter(withCursor, { text: 'AI', cursorChar: '_', onComplete: completed })
    api?.typewriter(plain, { text: 'OK', cursor: false, speed: 0.1 })

    expect(withCursor.textContent).toBe('AI_')
    expect(plain.textContent).toBe('OK')
    expect(completed).toHaveBeenCalledOnce()
    expect(gsapDelayedCall).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('returns static content when reduced motion is requested', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue(mediaQueryController(true).query)
    let api: ReturnType<typeof useGSAPAnimations> | undefined
    const wrapper = mount(
      defineComponent({
        setup() {
          api = useGSAPAnimations()
          return () => h('div')
        }
      })
    )
    const target = document.createElement('div')

    expect(api?.prefersReducedMotion()).toBe(true)
    expect(api?.fadeIn(target)).toBeNull()
    expect(api?.fadeInUp(target)).toBeNull()
    expect(api?.fadeInLeft(target)).toBeNull()
    expect(api?.fadeInRight(target)).toBeNull()
    expect(api?.scaleIn(target)).toBeNull()
    expect(api?.rotateIn(target)).toBeNull()
    expect(api?.staggerIn([target])).toBeNull()
    expect(api?.typewriter(target, { text: 'Static' })).toBeNull()
    expect(target.textContent).toBe('Static')
    expect(gsapFromTo).not.toHaveBeenCalled()
    wrapper.unmount()
  })
})

describe('gradient mesh', () => {
  beforeEach(() => {
    vi.spyOn(window, 'matchMedia').mockReturnValue(mediaQueryController(false).query)
  })

  it('does not schedule canvas work for reduced motion', () => {
    vi.spyOn(window, 'matchMedia').mockReturnValue(mediaQueryController(true).query)
    const requestFrame = vi.spyOn(window, 'requestAnimationFrame')
    const wrapper = mount(
      defineComponent({
        setup() {
          useGradientMesh(ref(null), ref(null))
          return () => h('div')
        }
      })
    )

    expect(requestFrame).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('sizes, draws and cleans up an interactive mesh', () => {
    vi.useFakeTimers()
    const gradient = { addColorStop: vi.fn() }
    const context = {
      clearRect: vi.fn(),
      createRadialGradient: vi.fn(() => gradient),
      fillRect: vi.fn(),
      fillStyle: '',
      globalCompositeOperation: '',
      scale: vi.fn()
    }
    const container = document.createElement('div')
    const canvas = document.createElement('canvas')
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 200, 100))
    Object.defineProperty(canvas, 'getContext', { value: vi.fn(() => context) })
    Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: 3 })
    let frame: FrameRequestCallback | undefined
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      frame = callback
      return 7
    })
    const cancelFrame = vi.spyOn(window, 'cancelAnimationFrame')
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    const wrapper = mount(
      defineComponent({
        setup() {
          useGradientMesh(ref(container), ref(canvas), {
            blobCount: 2,
            colors: ['rgba(1, 2, 3, 0.5)']
          })
          return () => h('div')
        }
      })
    )
    expect(canvas.width).toBe(400)
    expect(canvas.height).toBe(200)
    frame?.(16)
    expect(context.fillRect).toHaveBeenCalledTimes(2)
    expect(gradient.addColorStop).toHaveBeenCalledTimes(6)
    container.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 25 }))
    container.dispatchEvent(new MouseEvent('mouseleave'))
    window.dispatchEvent(new Event('resize'))
    window.dispatchEvent(new Event('resize'))
    vi.advanceTimersByTime(101)
    expect(context.scale).toHaveBeenCalled()

    wrapper.unmount()
    expect(cancelFrame).toHaveBeenCalledWith(7)
    vi.useRealTimers()
  })
})
