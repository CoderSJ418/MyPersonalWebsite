import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  batch,
  cleanupEventListeners,
  createLazyObserver,
  debounce,
  getPassiveOptions,
  memoize,
  once,
  parallel,
  rafThrottle,
  safeExecute,
  safeExecuteAsync,
  throttle,
  whenIdle
} from '@/utils/jsOptimizations'

describe('javascript optimization utilities', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('debounces, throttles and animation-throttles calls', () => {
    const callback = vi.fn()
    const delayed = debounce(callback, 20)
    delayed('one')
    delayed('two')
    vi.advanceTimersByTime(20)
    const immediate = debounce(callback, 20, true)
    immediate('now')
    immediate('ignored')
    const throttled = throttle(callback, 20)
    throttled('first')
    throttled('queued')
    vi.advanceTimersByTime(21)
    vi.stubGlobal('requestAnimationFrame', (handler: FrameRequestCallback) => {
      handler(0)
      return 1
    })
    const animated = rafThrottle(callback)
    animated('frame')
    expect(callback.mock.calls.flat()).toContain('frame')
  })

  it('batches and limits parallel asynchronous work', async () => {
    const processed: number[] = []
    const pending = batch([1, 2, 3, 4], (item) => processed.push(item), 2)
    await vi.runAllTimersAsync()
    await pending
    expect(processed).toEqual([1, 2, 3, 4])

    const results = await parallel([1, 2, 3], async (item) => item * 2, 2)
    expect(results.sort()).toEqual([2, 4, 6])
  })

  it('memoizes values and contains sync and async failures', async () => {
    const compute = vi.fn((value: unknown) => ({ value }))
    const cached = memoize(compute)
    expect(cached('same')).toBe(cached('same'))
    expect(compute).toHaveBeenCalledOnce()
    expect(safeExecute(() => 42)).toBe(42)
    expect(
      safeExecute(() => {
        throw new Error('failed')
      }, 7)
    ).toBe(7)
    await expect(safeExecuteAsync(async () => 42)).resolves.toBe(42)
    await expect(
      safeExecuteAsync(async () => {
        throw new Error('failed')
      }, 7)
    ).resolves.toBe(7)
  })

  it('creates observers and manages idle and one-time events', () => {
    const disconnect = vi.fn()
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        disconnect = disconnect
        observe = vi.fn()
        takeRecords = vi.fn(() => [])
        unobserve = vi.fn()
        root = null
        rootMargin = '0px'
        thresholds = [0]
      }
    )
    expect(createLazyObserver(vi.fn())).toBeDefined()

    const idle = vi.fn()
    whenIdle(idle, 10)
    vi.runAllTimers()
    expect(idle).toHaveBeenCalledOnce()
    expect(typeof getPassiveOptions()).toMatch(/boolean|object/)

    const target = new EventTarget()
    const callback = vi.fn()
    once(target, 'ready', callback)
    target.dispatchEvent(new Event('ready'))
    target.dispatchEvent(new Event('ready'))
    expect(callback).toHaveBeenCalledOnce()
    const listeners = new Map<string, EventListenerOrEventListenerObject>([
      ['ready', callback]
    ])
    cleanupEventListeners(target, listeners)
    expect(listeners.size).toBe(0)
  })
})
