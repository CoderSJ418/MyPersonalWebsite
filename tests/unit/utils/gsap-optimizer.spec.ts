import { beforeEach, describe, expect, it, vi } from 'vitest'

interface TestVars {
  x?: number
  y?: number
  transformX?: number | string
  transformY?: number | string
  willChange?: string
  transform?: string
  scrollTrigger?: { onUpdate?: (self: { progress: number }) => void }
}

const mocks = vi.hoisted(() => {
  const tweens: Array<{
    kill: ReturnType<typeof vi.fn>
    eventCallback: ReturnType<typeof vi.fn>
    scrollTrigger?: { isActive: boolean; progress: number; scrub: number; update?: () => void }
  }> = []
  const to = vi.fn((_target: unknown, _vars: TestVars) => {
    const tween = { kill: vi.fn(), eventCallback: vi.fn() }
    tweens.push(tween)
    return tween
  })
  return { registerPlugin: vi.fn(), to, tweens }
})

vi.mock('gsap', () => ({ default: { registerPlugin: mocks.registerPlugin, to: mocks.to } }))
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }))
vi.mock('gsap/ScrollToPlugin', () => ({ ScrollToPlugin: {} }))
vi.mock('gsap/Draggable', () => ({ Draggable: {} }))

import { gsapOptimizer } from '@/utils/gsapOptimizer'

describe('GSAP optimizer', () => {
  beforeEach(() => {
    gsapOptimizer.killAllAnimations()
    mocks.to.mockClear()
    mocks.tweens.length = 0
  })

  it('normalizes transform properties and completes animations', () => {
    const tween = gsapOptimizer.createOptimizedAnimation({}, { x: 10, y: 20, left: 5 })
    const vars = mocks.to.mock.calls[0]?.[1]
    expect(vars?.transformX).toBe(10)
    expect(vars?.transformY).toBe(20)
    expect(vars?.willChange).toContain('transform')
    expect(vars?.transform).toBe('translateZ(0)')
    expect(gsapOptimizer.getActiveAnimationCount()).toBe(1)
    const completion = tween.eventCallback.mock.calls[0]?.[1]
    completion?.()
    expect(gsapOptimizer.getActiveAnimationCount()).toBe(0)
  })

  it('creates scroll, virtual and staggered animation groups', () => {
    gsapOptimizer.createScrollAnimation({}, { opacity: 1 }, { scrub: 3 })
    const scrollVars = mocks.to.mock.calls[0]?.[1]
    const progress = { progress: 0.456 }
    scrollVars?.scrollTrigger?.onUpdate?.(progress)
    expect(progress.progress).toBe(0.46)

    const virtual = gsapOptimizer.createVirtualScrollAnimation(
      [document.body, document.head],
      (item) => gsapOptimizer.createOptimizedAnimation(item, { opacity: 1 })
    )
    expect(virtual).toHaveLength(2)
    const batch = gsapOptimizer.createBatchAnimations([{}, {}, {}], { xPercent: 25 }, {
      delay: 0.2,
      stagger: 0.1
    })
    expect(batch).toHaveLength(3)
    gsapOptimizer.killAllAnimations()
    expect(gsapOptimizer.getActiveAnimationCount()).toBe(0)
  })

  it('optimizes attached scroll triggers and prunes old animations', () => {
    const tween = gsapOptimizer.createOptimizedAnimation({}, { opacity: 1 })
    const scrollTrigger: {
      isActive: boolean
      progress: number
      scrub: number
      update?: () => void
    } = { isActive: true, progress: 0.456, scrub: 4 }
    Object.defineProperty(tween, 'scrollTrigger', { configurable: true, value: scrollTrigger })
    gsapOptimizer.optimizeScrollTrigger(tween)
    scrollTrigger.update?.()
    expect(scrollTrigger.progress).toBe(0.46)
    expect(scrollTrigger.scrub).toBe(2)

    for (let index = 0; index < 35; index += 1) {
      gsapOptimizer.createOptimizedAnimation({}, { opacity: index / 35 })
    }
    expect(mocks.tweens.some((item) => item.kill.mock.calls.length > 0)).toBe(true)
  })
})
