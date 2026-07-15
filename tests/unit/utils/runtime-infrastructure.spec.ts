import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { createMemoryHistory, createRouter } from 'vue-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  checkPerformanceThresholds,
  getPerformanceRecommendations,
  initWebVitalsMonitoring,
  logWebVitals
} from '@/utils/performance-monitoring'
import { clearPrefetchCache, installRoutePrefetch } from '@/utils/routePrefetch'

const { getCLS, getFID, getLCP, getTTFB } = vi.hoisted(() => {
  const createVital = (name: string) =>
    vi.fn((callback: (metric: { value: number; delta: number; id: string }) => void) => {
      callback({ value: 1, delta: 0.1, id: name })
    })
  return {
    getCLS: createVital('cls'),
    getFID: createVital('fid'),
    getLCP: createVital('lcp'),
    getTTFB: createVital('ttfb')
  }
})

vi.mock('web-vitals', () => ({ getCLS, getFID, getLCP, getTTFB }))

describe('deployment routing', () => {
  it('rewrites direct SPA routes to the application shell on Vercel', () => {
    const configPath = resolve(process.cwd(), 'vercel.json')
    expect(existsSync(configPath)).toBe(true)

    const config = JSON.parse(readFileSync(configPath, 'utf8')) as {
      rewrites?: Array<{ source: string; destination: string }>
    }
    expect(config.rewrites).toContainEqual({
      source: '/(.*)',
      destination: '/index.html'
    })
  })
})

describe('route prefetching', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    clearPrefetchCache()
  })

  it('prefetches internal lazy routes once from pointer and focus', async () => {
    const lazyLoader = vi.fn(async () => ({ template: '<div>Lazy</div>' }))
    const failedLoader = vi.fn(async () => {
      throw new Error('chunk unavailable')
    })
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/lazy', component: lazyLoader },
        { path: '/failed', component: failedLoader },
        { path: '/eager', component: { template: '<div>Eager</div>' } }
      ]
    })
    installRoutePrefetch(router)
    const dispatch = (element: Element, type: 'mouseover' | 'focusin') => {
      document.body.appendChild(element)
      element.dispatchEvent(new Event(type, { bubbles: true }))
      element.remove()
    }

    dispatch(document.createElement('div'), 'mouseover')
    dispatch(document.createElement('a'), 'mouseover')
    const external = document.createElement('a')
    external.href = 'https://example.com'
    dispatch(external, 'mouseover')
    const missing = document.createElement('a')
    missing.href = '/missing'
    dispatch(missing, 'mouseover')

    const lazy = document.createElement('a')
    lazy.href = '/lazy'
    const child = document.createElement('span')
    lazy.appendChild(child)
    dispatch(lazy, 'mouseover')
    const duplicate = document.createElement('a')
    duplicate.href = '/lazy'
    dispatch(duplicate, 'focusin')
    expect(lazyLoader).toHaveBeenCalledOnce()

    const eager = document.createElement('a')
    eager.href = '/eager'
    dispatch(eager, 'focusin')
    const failed = document.createElement('a')
    failed.href = '/failed'
    dispatch(failed, 'mouseover')
    await Promise.resolve()
    expect(failedLoader).toHaveBeenCalledOnce()

    vi.spyOn(router, 'resolve').mockImplementationOnce(() => {
      throw new Error('invalid route')
    })
    const invalid = document.createElement('a')
    invalid.href = '/invalid'
    dispatch(invalid, 'focusin')
  })
})

describe('performance monitoring fallbacks', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    document.body.innerHTML = ''
    window.gtag = undefined
  })

  it('returns thresholds and recommends only detected problems', () => {
    expect(checkPerformanceThresholds()).toEqual({
      lcp: true,
      fcp: true,
      cls: true,
      ttfb: true
    })
    expect(getPerformanceRecommendations()).toEqual([])

    for (let index = 0; index < 4; index += 1) {
      const script = document.createElement('script')
      script.type = 'application/json'
      script.src = `/assets/vendor-${index}.js`
      document.head.appendChild(script)
    }
    const lazy = document.createElement('img')
    lazy.loading = 'lazy'
    const eager = document.createElement('img')
    document.body.append(lazy, eager)
    expect(getPerformanceRecommendations()).toHaveLength(2)
  })

  it('handles unavailable analytics and reports all web vitals', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const metric = vi.fn()
    initWebVitalsMonitoring(metric)
    logWebVitals()
    expect(warn).toHaveBeenCalled()

    window.gtag = vi.fn()
    initWebVitalsMonitoring(metric)
    await vi.waitFor(() => expect(metric).toHaveBeenCalledTimes(4))
    expect(metric).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'CLS', id: 'cls' })
    )
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined)
    logWebVitals()
    await vi.waitFor(() => expect(log).toHaveBeenCalledTimes(4))
  })
})
