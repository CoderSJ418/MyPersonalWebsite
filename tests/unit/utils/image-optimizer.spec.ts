import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { imageOptimizer, useImageOptimization } from '@/utils/imageOptimizer'

let imageFailure = false

class ControlledImage {
  onload: (() => void) | null = null
  onerror: (() => void) | null = null

  set src(_value: string) {
    queueMicrotask(() => {
      if (imageFailure) this.onerror?.()
      else this.onload?.()
    })
  }
}

describe('image optimizer', () => {
  beforeEach(() => {
    imageFailure = false
    vi.stubGlobal('Image', ControlledImage)
  })

  afterEach(() => vi.unstubAllGlobals())

  it('generates optimized URLs and placeholder variants', () => {
    const direct = imageOptimizer.generateImageUrl('/photo.jpg', {
      quality: 70,
      lazyLoad: false,
      aspectRatio: '16:9'
    })
    const responsive = imageOptimizer.generateImageUrl('/photo.jpg', {
      sizes: ['320w', '640w']
    })
    expect(direct).toContain('quality=70')
    expect(direct).toContain('aspectRatio=16:9')
    expect(responsive).toContain('320w')
    expect(['avif', 'webp', 'jpeg']).toContain(imageOptimizer.getOptimalFormat())
    expect(imageOptimizer.generatePlaceholder(10, 10, 'none')).toBe('')
    expect(imageOptimizer.generatePlaceholder(10, 10, 'color')).toContain('<svg'.replace('<', '%3C'))
    expect(imageOptimizer.generatePlaceholder(10, 10)).toContain('blur')
  })

  it('preloads success and failure paths with progress reset', async () => {
    const progress = vi.fn()
    const reset = imageOptimizer.createPreloader(['/one.jpg', '/two.jpg'], progress)
    await vi.waitFor(() => expect(progress).toHaveBeenCalledWith(100))
    reset()
    expect(progress).toHaveBeenLastCalledWith(0)
    imageFailure = true
    imageOptimizer.createPreloader(['/missing.jpg'], progress)
    await vi.waitFor(() => expect(progress).toHaveBeenLastCalledWith(0))
  })

  it('renders and cleans a virtual scrolling window', () => {
    const urls = Array.from({ length: 20 }, (_, index) => `/image-${index}.jpg`)
    const render = vi.fn((url: string) => {
      const image = document.createElement('img')
      image.src = url
      return image
    })
    const virtual = imageOptimizer.createVirtualScrollImages(urls, render)
    expect(virtual.container.children.length).toBe(11)
    Object.defineProperty(virtual.container, 'clientHeight', { configurable: true, value: 400 })
    virtual.container.scrollTop = 1000
    virtual.container.dispatchEvent(new Event('scroll'))
    expect(render.mock.calls.length).toBeGreaterThan(11)
    virtual.cleanup()
    expect(virtual.container.children).toHaveLength(0)
  })

  it('exposes reactive optimized image loading state', async () => {
    const image = useImageOptimization()
    await image.loadOptimizedImage('/photo.jpg', { lazyLoad: false })
    expect(image.optimizedUrl.value).toContain('/photo.jpg')
    expect(image.isLoaded.value).toBe(true)
    expect(image.isLoading.value).toBe(false)
  })
})
