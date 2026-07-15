import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { FontOptimizer } from '@/utils/fontOptimizer'

let fontFailure = false

class ControlledFontFace {
  constructor(
    public family: string,
    public source: string,
    public descriptors?: FontFaceDescriptors
  ) {}

  load(): Promise<ControlledFontFace> {
    return fontFailure ? Promise.reject(new Error('font failed')) : Promise.resolve(this)
  }
}

describe('font optimizer', () => {
  const optimizer = FontOptimizer.getInstance()

  beforeEach(() => {
    optimizer.cleanup()
    fontFailure = false
    vi.stubGlobal('FontFace', ControlledFontFace)
    Object.defineProperty(document, 'fonts', {
      configurable: true,
      value: { add: vi.fn() }
    })
  })

  afterEach(() => vi.unstubAllGlobals())

  it('loads fonts, updates elements and emits completion', async () => {
    const target = document.createElement('span')
    target.dataset.fontFamily = 'Inter'
    document.body.appendChild(target)
    const loaded = vi.fn()
    const unsubscribe = optimizer.onFontLoaded(loaded)
    optimizer.addFont({ family: 'Inter', src: 'url(inter.woff2)', weight: 400 })
    expect(optimizer.getFontStatus('Inter')).toBe('not-started')
    optimizer.optimizeFontLoading()
    expect(optimizer.getFontStatus('Inter')).toBe('loading')
    await Promise.resolve()
    await Promise.resolve()
    expect(optimizer.getFontStatus('Inter')).toBe('loaded')
    expect(target.style.fontFamily).toBe('Inter')
    expect(loaded).toHaveBeenCalledWith('Inter')
    unsubscribe()
  })

  it('reports failures and generates deployment assets', async () => {
    const failed = vi.fn()
    const unsubscribe = optimizer.onFontFailed(failed)
    optimizer.addFonts([
      { family: 'Roboto', src: 'url(roboto.woff2)', style: 'italic' },
      { family: 'Decorative', src: 'url(decorative.woff2)' }
    ])
    expect(optimizer.generatePreloadTags()).toContain('roboto.woff2')
    expect(optimizer.generatePreloadTags()).not.toContain('decorative.woff2')
    expect(optimizer.generateFallbackStyles()).toContain('font-family')
    fontFailure = true
    optimizer.optimizeFontLoading()
    await Promise.resolve()
    await Promise.resolve()
    expect(failed).toHaveBeenCalled()
    expect(optimizer.getFontStatus('Missing')).toBe('not-started')
    unsubscribe()
  })

  it('preloads critical fonts and generates CSS after load', async () => {
    optimizer.addFonts([
      { family: 'Source Sans Pro', src: '/source.woff2', fontDisplay: 'optional' },
      { family: 'Display', src: '/display.woff2' }
    ])
    optimizer.preloadCriticalFonts()
    const preload = document.querySelector<HTMLLinkElement>('link[href="/source.woff2"]')
    expect(preload).not.toBeNull()
    preload?.onload?.(new Event('load'))
    expect(optimizer.generateFontCSS()).toContain('Source Sans Pro')
    expect(optimizer.getAllFontStatus().Display).toBe('not-started')
  })
})
