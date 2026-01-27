/**
 * 性能测试
 * @description 测试性能指标是否达标
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { checkPerformanceMetrics, generatePerformanceReport, getPerformanceTargets } from '@/config/performance'

describe('性能测试', () => {
  describe('性能目标', () => {
    it('应该返回 MVP 阶段的性能目标', () => {
      const targets = getPerformanceTargets()
      
      expect(targets.firstContentfulPaint).toBe(1500)
      expect(targets.largestContentfulPaint).toBe(2500)
      expect(targets.firstInputDelay).toBe(300)
      expect(targets.cumulativeLayoutShift).toBe(0.15)
    })
  })

  describe('性能指标检查', () => {
    it('应该通过所有性能指标', () => {
      const metrics = {
        fcp: 1200, // 小于 1500
        lcp: 2000, // 小于 2500
        cls: 0.08, // 小于 0.15
        fid: 200, // 小于 300
        ttfb: 600, // 小于 800
        tbt: 200, // 小于 300
        tti: 3000 // 小于 3500
      }
      
      const { passed, details } = checkPerformanceMetrics(metrics)
      
      expect(passed).toBe(true)
      expect(details.fcp.passed).toBe(true)
      expect(details.lcp.passed).toBe(true)
      expect(details.cls.passed).toBe(true)
      expect(details.fid.passed).toBe(true)
    })

    it('应该检测到性能指标未达标', () => {
      const metrics = {
        fcp: 2000, // 大于 1500
        lcp: 3000, // 大于 2500
        cls: 0.2, // 大于 0.15
        fid: 400, // 大于 300
        ttfb: 1000, // 大于 800
        tbt: 400, // 大于 300
        tti: 4000 // 大于 3500
      }
      
      const { passed, details } = checkPerformanceMetrics(metrics)
      
      expect(passed).toBe(false)
      expect(details.fcp.passed).toBe(false)
      expect(details.lcp.passed).toBe(false)
      expect(details.cls.passed).toBe(false)
      expect(details.fid.passed).toBe(false)
    })

    it('应该处理部分指标未达标的情况', () => {
      const metrics = {
        fcp: 1200, // 达标
        lcp: 3000, // 未达标
        cls: 0.08, // 达标
        fid: 400, // 未达标
        ttfb: 600, // 达标
        tbt: 200, // 达标
        tti: 3000 // 达标
      }
      
      const { passed, details } = checkPerformanceMetrics(metrics)
      
      expect(passed).toBe(false)
      expect(details.fcp.passed).toBe(true)
      expect(details.lcp.passed).toBe(false)
      expect(details.cls.passed).toBe(true)
      expect(details.fid.passed).toBe(false)
    })
  })

  describe('性能报告生成', () => {
    it('应该生成通过的性能报告', () => {
      const metrics = {
        fcp: 1200,
        lcp: 2000,
        cls: 0.08,
        fid: 200,
        ttfb: 600,
        tbt: 200,
        tti: 3000
      }
      
      const report = generatePerformanceReport(metrics)
      
      expect(report).toContain('✅ 通过')
      expect(report).toContain('FCP: 1200ms')
      expect(report).toContain('LCP: 2000ms')
      expect(report).toContain('CLS: 0.08ms')
      expect(report).toContain('FID: 200ms')
    })

    it('应该生成未通过的性能报告', () => {
      const metrics = {
        fcp: 2000,
        lcp: 3000,
        cls: 0.2,
        fid: 400,
        ttfb: 1000,
        tbt: 400,
        tti: 4000
      }
      
      const report = generatePerformanceReport(metrics)
      
      expect(report).toContain('❌ 未通过')
      expect(report).toContain('FCP: 2000ms')
      expect(report).toContain('LCP: 3000ms')
      expect(report).toContain('CLS: 0.2ms')
      expect(report).toContain('FID: 400ms')
    })
  })

  describe('性能目标配置', () => {
    it('应该包含所有必需的性能指标', () => {
      const targets = getPerformanceTargets()
      
      expect(targets).toHaveProperty('firstContentfulPaint')
      expect(targets).toHaveProperty('largestContentfulPaint')
      expect(targets).toHaveProperty('firstInputDelay')
      expect(targets).toHaveProperty('cumulativeLayoutShift')
      expect(targets).toHaveProperty('timeToInteractive')
      expect(targets).toHaveProperty('totalBlockingTime')
    })

    it('应该包含资源加载配置', () => {
      const targets = getPerformanceTargets()
      
      expect(targets).toHaveProperty('maxBundleSize')
      expect(targets).toHaveProperty('maxChunkSize')
      expect(targets).toHaveProperty('imageOptimization')
    })

    it('应该包含缓存策略配置', () => {
      const targets = getPerformanceTargets()
      
      expect(targets).toHaveProperty('cacheStrategy')
      expect(targets.cacheStrategy).toHaveProperty('staticAssets')
      expect(targets.cacheStrategy).toHaveProperty('html')
      expect(targets.cacheStrategy).toHaveProperty('api')
    })

    it('应该包含图片优化配置', () => {
      const targets = getPerformanceTargets()
      
      expect(targets.imageOptimization).toHaveProperty('maxWidth')
      expect(targets.imageOptimization).toHaveProperty('maxHeight')
      expect(targets.imageOptimization).toHaveProperty('quality')
      expect(targets.imageOptimization).toHaveProperty('formats')
    })
  })
})

describe('性能优化配置', () => {
  it('应该包含代码分割策略', async () => {
    const { CODE_SPLITTING_STRATEGY } = await import('@/config/performance')

    expect(CODE_SPLITTING_STRATEGY).toHaveProperty('routes')
    expect(CODE_SPLITTING_STRATEGY).toHaveProperty('components')
    expect(CODE_SPLITTING_STRATEGY).toHaveProperty('vendors')
  })

  it('应该包含懒加载配置', async () => {
    const { LAZY_LOADING_CONFIG } = await import('@/config/performance')

    expect(LAZY_LOADING_CONFIG).toHaveProperty('images')
    expect(LAZY_LOADING_CONFIG).toHaveProperty('routes')
    expect(LAZY_LOADING_CONFIG).toHaveProperty('components')
  })

  it('应该包含缓存策略', async () => {
    const { CACHE_STRATEGY } = await import('@/config/performance')

    expect(CACHE_STRATEGY).toHaveProperty('static')
    expect(CACHE_STRATEGY).toHaveProperty('images')
    expect(CACHE_STRATEGY).toHaveProperty('html')
    expect(CACHE_STRATEGY).toHaveProperty('api')
  })

  it('应该包含图片优化配置', async () => {
    const { IMAGE_OPTIMIZATION } = await import('@/config/performance')

    expect(IMAGE_OPTIMIZATION).toHaveProperty('breakpoints')
    expect(IMAGE_OPTIMIZATION).toHaveProperty('lazyLoad')
    expect(IMAGE_OPTIMIZATION).toHaveProperty('placeholder')
    expect(IMAGE_OPTIMIZATION).toHaveProperty('formatPriority')
  })

  it('应该包含性能监控配置', async () => {
    const { PERFORMANCE_MONITORING } = await import('@/config/performance')

    expect(PERFORMANCE_MONITORING).toHaveProperty('enabled')
    expect(PERFORMANCE_MONITORING).toHaveProperty('webVitals')
    expect(PERFORMANCE_MONITORING).toHaveProperty('resourceTiming')
    expect(PERFORMANCE_MONITORING).toHaveProperty('errorTracking')
  })
})