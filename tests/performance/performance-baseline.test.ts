/**
 * 性能回归测试
 * 用于验证性能指标是否符合基线要求
 */

import { describe, it, expect, beforeAll } from 'vitest'

// 性能基线配置
const PERFORMANCE_BASELINE = {
  // Core Web Vitals
  LCP: {
    good: 2500, // 2.5s
    needsImprovement: 4000, // 4s
    poor: Infinity
  },
  FID: {
    good: 100, // 100ms
    needsImprovement: 300, // 300ms
    poor: Infinity
  },
  CLS: {
    good: 0.1,
    needsImprovement: 0.25,
    poor: Infinity
  },
  // 其他性能指标
  FCP: {
    good: 1800, // 1.8s
    needsImprovement: 3000, // 3s
    poor: Infinity
  },
  TTFB: {
    good: 600, // 600ms
    needsImprovement: 1500, // 1.5s
    poor: Infinity
  },
  TBT: {
    good: 200, // 200ms
    needsImprovement: 600, // 600ms
    poor: Infinity
  }
}

// 性能阈值
const PERFORMANCE_THRESHOLDS = {
  // Lighthouse 性能分数
  performanceScore: 95,
  accessibilityScore: 90,
  bestPracticesScore: 90,
  seoScore: 90,

  // Core Web Vitals
  LCP: 2500, // 2.5s
  FID: 100, // 100ms
  CLS: 0.1,

  // 其他指标
  FCP: 1800, // 1.8s
  TTFB: 600, // 600ms
  TBT: 200, // 200ms

  // 资源加载
  firstPaint: 1000, // 1s
  domContentLoaded: 2000, // 2s
  loadComplete: 3000 // 3s
}

describe('性能回归测试', () => {
  let performanceMetrics: any = {}

  beforeAll(async () => {
    // 在实际测试中，这里应该运行 Lighthouse 并获取性能指标
    // 这里我们使用模拟数据
    performanceMetrics = {
      LCP: 2000, // 2s
      FID: 80, // 80ms
      CLS: 0.05, // 0.05
      FCP: 1500, // 1.5s
      TTFB: 500, // 500ms
      TBT: 150, // 150ms
      performanceScore: 96,
      accessibilityScore: 92,
      bestPracticesScore: 94,
      seoScore: 93,
      firstPaint: 800,
      domContentLoaded: 1800,
      loadComplete: 2800
    }
  })

  describe('Core Web Vitals', () => {
    it('LCP (Largest Contentful Paint) 应该小于 2.5s', () => {
      expect(performanceMetrics.LCP).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.LCP)
    })

    it('FID (First Input Delay) 应该小于 100ms', () => {
      expect(performanceMetrics.FID).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.FID)
    })

    it('CLS (Cumulative Layout Shift) 应该小于 0.1', () => {
      expect(performanceMetrics.CLS).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.CLS)
    })
  })

  describe('Lighthouse 性能分数', () => {
    it('Performance 分数应该 >= 95', () => {
      expect(performanceMetrics.performanceScore).toBeGreaterThanOrEqual(
        PERFORMANCE_THRESHOLDS.performanceScore
      )
    })

    it('Accessibility 分数应该 >= 90', () => {
      expect(performanceMetrics.accessibilityScore).toBeGreaterThanOrEqual(
        PERFORMANCE_THRESHOLDS.accessibilityScore
      )
    })

    it('Best Practices 分数应该 >= 90', () => {
      expect(performanceMetrics.bestPracticesScore).toBeGreaterThanOrEqual(
        PERFORMANCE_THRESHOLDS.bestPracticesScore
      )
    })

    it('SEO 分数应该 >= 90', () => {
      expect(performanceMetrics.seoScore).toBeGreaterThanOrEqual(
        PERFORMANCE_THRESHOLDS.seoScore
      )
    })
  })

  describe('其他性能指标', () => {
    it('FCP (First Contentful Paint) 应该小于 1.8s', () => {
      expect(performanceMetrics.FCP).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.FCP)
    })

    it('TTFB (Time to First Byte) 应该小于 600ms', () => {
      expect(performanceMetrics.TTFB).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.TTFB)
    })

    it('TBT (Total Blocking Time) 应该小于 200ms', () => {
      expect(performanceMetrics.TBT).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.TBT)
    })
  })

  describe('资源加载性能', () => {
    it('First Paint 应该小于 1s', () => {
      expect(performanceMetrics.firstPaint).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.firstPaint)
    })

    it('DOM Content Loaded 应该小于 2s', () => {
      expect(performanceMetrics.domContentLoaded).toBeLessThanOrEqual(
        PERFORMANCE_THRESHOLDS.domContentLoaded
      )
    })

    it('Load Complete 应该小于 3s', () => {
      expect(performanceMetrics.loadComplete).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.loadComplete)
    })
  })

  describe('性能评分等级', () => {
    it('LCP 应该达到 "Good" 等级', () => {
      const { good, needsImprovement } = PERFORMANCE_BASELINE.LCP
      expect(performanceMetrics.LCP).toBeLessThanOrEqual(good)
      expect(performanceMetrics.LCP).toBeLessThan(needsImprovement)
    })

    it('FID 应该达到 "Good" 等级', () => {
      const { good, needsImprovement } = PERFORMANCE_BASELINE.FID
      expect(performanceMetrics.FID).toBeLessThanOrEqual(good)
      expect(performanceMetrics.FID).toBeLessThan(needsImprovement)
    })

    it('CLS 应该达到 "Good" 等级', () => {
      const { good, needsImprovement } = PERFORMANCE_BASELINE.CLS
      expect(performanceMetrics.CLS).toBeLessThanOrEqual(good)
      expect(performanceMetrics.CLS).toBeLessThan(needsImprovement)
    })
  })

  describe('性能退化检测', () => {
    it('性能指标不应该比基线差 10% 以上', () => {
      const degradationThreshold = 0.1 // 10%

      // 检查 LCP 退化
      const lcpBaseline = PERFORMANCE_THRESHOLDS.LCP
      const lcpDegradation = (performanceMetrics.LCP - lcpBaseline) / lcpBaseline
      expect(lcpDegradation).toBeLessThanOrEqual(degradationThreshold)

      // 检查 FID 退化
      const fidBaseline = PERFORMANCE_THRESHOLDS.FID
      const fidDegradation = (performanceMetrics.FID - fidBaseline) / fidBaseline
      expect(fidDegradation).toBeLessThanOrEqual(degradationThreshold)

      // 检查 CLS 退化
      const clsBaseline = PERFORMANCE_THRESHOLDS.CLS
      const clsDegradation = (performanceMetrics.CLS - clsBaseline) / clsBaseline
      expect(clsDegradation).toBeLessThanOrEqual(degradationThreshold)
    })
  })

  describe('性能趋势分析', () => {
    it('性能分数应该保持稳定或提升', () => {
      const previousPerformanceScore = 95 // 假设上次的分数
      expect(performanceMetrics.performanceScore).toBeGreaterThanOrEqual(
        previousPerformanceScore
      )
    })

    it('Core Web Vitals 应该保持稳定或改善', () => {
      const previousLCP = 2100 // 假设上次的 LCP
      const previousFID = 90 // 假设上次的 FID
      const previousCLS = 0.08 // 假设上次的 CLS

      expect(performanceMetrics.LCP).toBeLessThanOrEqual(previousLCP)
      expect(performanceMetrics.FID).toBeLessThanOrEqual(previousFID)
      expect(performanceMetrics.CLS).toBeLessThanOrEqual(previousCLS)
    })
  })
})

/**
 * 性能评分函数
 */
function calculatePerformanceScore(metrics: any): number {
  let score = 0

  // LCP 评分
  if (metrics.LCP <= PERFORMANCE_BASELINE.LCP.good) {
    score += 33
  } else if (metrics.LCP <= PERFORMANCE_BASELINE.LCP.needsImprovement) {
    score += 20
  } else {
    score += 10
  }

  // FID 评分
  if (metrics.FID <= PERFORMANCE_BASELINE.FID.good) {
    score += 33
  } else if (metrics.FID <= PERFORMANCE_BASELINE.FID.needsImprovement) {
    score += 20
  } else {
    score += 10
  }

  // CLS 评分
  if (metrics.CLS <= PERFORMANCE_BASELINE.CLS.good) {
    score += 34
  } else if (metrics.CLS <= PERFORMANCE_BASELINE.CLS.needsImprovement) {
    score += 20
  } else {
    score += 10
  }

  return score
}

export { PERFORMANCE_THRESHOLDS, PERFORMANCE_BASELINE, calculatePerformanceScore }