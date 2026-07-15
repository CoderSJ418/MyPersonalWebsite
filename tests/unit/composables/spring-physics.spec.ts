import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  springStep,
  useMultiSpring,
  useSpringPhysics
} from '@/composables/useSpringPhysics'

describe('spring physics', () => {
  const frames: FrameRequestCallback[] = []

  beforeEach(() => {
    frames.length = 0
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      frames.push(callback)
      return frames.length
    })
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
  })

  afterEach(() => vi.unstubAllGlobals())

  const drainFrames = (): void => {
    let count = 0
    while (frames.length > 0 && count < 500) {
      frames.shift()?.(count)
      count += 1
    }
  }

  it('calculates a deterministic spring step', () => {
    const [value, velocity] = springStep(0, 10, 0, 0.2, 0.5)
    expect(value).toBe(1)
    expect(velocity).toBe(1)
  })

  it('animates, sets and stops a single value', () => {
    const spring = useSpringPhysics({ initial: 1, precision: 0.01 })
    spring.setTarget(5)
    spring.setTarget(6)
    drainFrames()
    expect(spring.springValue.value).toBeCloseTo(6)
    spring.setValue(3)
    expect(spring.springValue.value).toBe(3)
    spring.stop()
  })

  it('animates multiple dimensions and ignores unknown keys', () => {
    const spring = useMultiSpring(['x', 'y'], { initial: 0, precision: 0.01 })
    spring.setTarget('x', 10)
    spring.setTarget('missing', 20)
    spring.setTargets({ x: 5, y: -5, missing: 4 })
    drainFrames()
    expect(spring.values.x?.value).toBeCloseTo(5)
    expect(spring.values.y?.value).toBeCloseTo(-5)
    spring.stop()
  })
})
