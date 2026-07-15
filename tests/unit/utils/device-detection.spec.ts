import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  getDeviceType,
  getPerformanceLevel,
  isLowEnd,
  isMobile,
  isTouch
} from '@/utils/deviceDetection'

describe('device detection', () => {
  afterEach(() => vi.restoreAllMocks())

  it('classifies mobile and low-end devices', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla Android')
    vi.spyOn(navigator, 'hardwareConcurrency', 'get').mockReturnValue(2)
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 375 })
    Object.defineProperty(window, 'ontouchstart', { configurable: true, value: null })
    expect(isMobile()).toBe(true)
    expect(isTouch()).toBe(true)
    expect(isLowEnd()).toBe(true)
    expect(getDeviceType()).toBe('mobile')
    expect(getPerformanceLevel()).toBe('low')
  })

  it('classifies tablet and desktop layouts', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Desktop')
    vi.spyOn(navigator, 'hardwareConcurrency', 'get').mockReturnValue(8)
    Object.defineProperty(navigator, 'deviceMemory', { configurable: true, value: 8 })
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 800 })
    expect(getDeviceType()).toBe('tablet')
    expect(getPerformanceLevel()).toBe('medium')
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1400 })
    expect(getDeviceType()).toBe('desktop')
    expect(getPerformanceLevel()).toBe('high')
  })
})
