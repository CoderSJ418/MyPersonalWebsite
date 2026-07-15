import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  checkWebPSupport,
  generatePlaceholder,
  generateProgressiveURL,
  generateSizes,
  generateSrcSet,
  getAspectRatio,
  getImageDimensions,
  getOptimalImageFormat,
  isImageInViewport,
  preloadImage,
  preloadImages
} from '@/utils/image'

let imageFailure = false
let webpHeight = 2

class ControlledImage {
  onload: ((event: Event) => unknown) | null = null
  onerror: ((event: Event) => unknown) | null = null
  height = webpHeight
  naturalWidth = 800
  naturalHeight = 400

  set src(_value: string) {
    queueMicrotask(() => {
      if (imageFailure) this.onerror?.(new Event('error'))
      else this.onload?.(new Event('load'))
    })
  }
}

describe('image utilities', () => {
  beforeEach(() => {
    imageFailure = false
    webpHeight = 2
    vi.stubGlobal('Image', ControlledImage)
  })

  afterEach(() => vi.unstubAllGlobals())

  it('generates responsive attributes and placeholders', () => {
    expect(generateSrcSet('/photo.jpg', [320, 640])).toContain('/photo-640w.jpg 640w')
    expect(generateSizes([{ width: 600, size: '100vw' }])).toBe('(max-width: 600px) 100vw')
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/jpeg;base64,test')
    expect(generatePlaceholder(20, 10)).toContain('data:image/jpeg')
    expect(generateProgressiveURL('/photo.jpg', 20)).toBe('/photo.jpg')
  })

  it('detects formats and preloads image metadata', async () => {
    await expect(checkWebPSupport()).resolves.toBe(true)
    await expect(getOptimalImageFormat('JPG')).resolves.toBe('webp')
    await expect(getOptimalImageFormat('svg')).resolves.toBe('svg')
    await expect(preloadImage('/one.jpg')).resolves.toBeDefined()
    await expect(preloadImages(['/one.jpg', '/two.jpg'])).resolves.toHaveLength(2)
    await expect(getImageDimensions('/one.jpg')).resolves.toEqual({ width: 800, height: 400 })
    await expect(getAspectRatio('/one.jpg')).resolves.toBe(2)
    webpHeight = 1
    await expect(checkWebPSupport()).resolves.toBe(false)
  })

  it('propagates image loading failures and checks the viewport', async () => {
    imageFailure = true
    await expect(preloadImage('/missing.jpg')).rejects.toBeDefined()
    await expect(getImageDimensions('/missing.jpg')).rejects.toBeDefined()
    const image = document.createElement('img')
    vi.spyOn(image, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 100, 100))
    expect(isImageInViewport(image)).toBe(true)
    vi.spyOn(image, 'getBoundingClientRect').mockReturnValue(new DOMRect(-10, -10, 100, 100))
    expect(isImageInViewport(image)).toBe(false)
  })
})
