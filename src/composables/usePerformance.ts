/**
 * 性能监控 Composable
 * 用于监控 Core Web Vitals 和其他性能指标
 */

import { onMounted, onUnmounted, ref } from 'vue'

export interface PerformanceMetrics {
  // Core Web Vitals
  LCP: number | null // Largest Contentful Paint (最大内容绘制)
  FID: number | null // First Input Delay (首次输入延迟)
  CLS: number | null // Cumulative Layout Shift (累积布局偏移)

  // 其他性能指标
  FCP: number | null // First Contentful Paint (首次内容绘制)
  TTI: number | null // Time to Interactive (可交互时间)
  TBT: number | null // Total Blocking Time (总阻塞时间)
  FMP: number | null // First Meaningful Paint (首次有意义绘制)

  // 资源加载
  domContentLoaded: number | null
  loadComplete: number | null
}

export function usePerformance() {
  const metrics = ref<PerformanceMetrics>({
    LCP: null,
    FID: null,
    CLS: null,
    FCP: null,
    TTI: null,
    TBT: null,
    FMP: null,
    domContentLoaded: null,
    loadComplete: null
  })

  let observer: PerformanceObserver | null = null
  let lcpEntry: PerformanceEntry | null = null
  let clsValue = 0
  let fidValue = 0

  /**
   * 测量 LCP (Largest Contentful Paint)
   */
  const measureLCP = () => {
    try {
      observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as PerformanceEntry
        lcpEntry = lastEntry
        metrics.value.LCP = Math.round(lastEntry.startTime)
      })
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (e) {
      console.warn('LCP measurement not supported:', e)
    }
  }

  /**
   * 测量 CLS (Cumulative Layout Shift)
   */
  const measureCLS = () => {
    try {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        }
        metrics.value.CLS = parseFloat(clsValue.toFixed(3))
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    } catch (e) {
      console.warn('CLS measurement not supported:', e)
    }
  }

  /**
   * 测量 FID (First Input Delay)
   */
  const measureFID = () => {
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          fidValue = (entry as any).processingStart - entry.startTime
          metrics.value.FID = Math.round(fidValue)
        }
      })
      fidObserver.observe({ entryTypes: ['first-input'] })
    } catch (e) {
      console.warn('FID measurement not supported:', e)
    }
  }

  /**
   * 测量 FCP (First Contentful Paint)
   */
  const measureFCP = () => {
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            metrics.value.FCP = Math.round(entry.startTime)
          }
        }
      })
      fcpObserver.observe({ entryTypes: ['paint'] })
    } catch (e) {
      console.warn('FCP measurement not supported:', e)
    }
  }

  /**
   * 测量 TBT (Total Blocking Time)
   */
  const measureTBT = () => {
    try {
      let tbt = 0
      const tbtObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            tbt += entry.duration - 50
          }
        }
        metrics.value.TBT = Math.round(tbt)
      })
      tbtObserver.observe({ entryTypes: ['longtask'] })
    } catch (e) {
      console.warn('TBT measurement not supported:', e)
    }
  }

  /**
   * 测量页面加载时间
   */
  const measurePageLoad = () => {
    if (typeof window !== 'undefined' && window.performance) {
      const perfData = window.performance.timing
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
      const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart

      metrics.value.domContentLoaded = Math.round(domReadyTime)
      metrics.value.loadComplete = Math.round(pageLoadTime)
    }
  }

  /**
   * 估算 TTI (Time to Interactive)
   */
  const estimateTTI = () => {
    if (typeof window !== 'undefined' && window.performance) {
      const perfData = window.performance.timing
      const tti = perfData.domInteractive - perfData.navigationStart
      metrics.value.TTI = Math.round(tti)
    }
  }

  /**
   * 获取性能评分
   */
  const getPerformanceScore = () => {
    const { LCP, FID, CLS } = metrics.value

    let score = 0
    const issues: string[] = []

    // LCP 评分
    if (LCP !== null) {
      if (LCP <= 2.5) score += 33
      else if (LCP <= 4) {
        score += 20
        issues.push('LCP 需要优化 (当前: ' + LCP + 'ms)')
      } else {
        score += 10
        issues.push('LCP 较差 (当前: ' + LCP + 'ms)')
      }
    }

    // FID 评分
    if (FID !== null) {
      if (FID <= 100) score += 33
      else if (FID <= 300) {
        score += 20
        issues.push('FID 需要优化 (当前: ' + FID + 'ms)')
      } else {
        score += 10
        issues.push('FID 较差 (当前: ' + FID + 'ms)')
      }
    }

    // CLS 评分
    if (CLS !== null) {
      if (CLS <= 0.1) score += 34
      else if (CLS <= 0.25) {
        score += 20
        issues.push('CLS 需要优化 (当前: ' + CLS + ')')
      } else {
        score += 10
        issues.push('CLS 较差 (当前: ' + CLS + ')')
      }
    }

    return {
      score,
      grade: score >= 90 ? 'A' : score >= 70 ? 'B' : score >= 50 ? 'C' : 'D',
      issues
    }
  }

  /**
   * 记录性能指标到控制台
   */
  const logMetrics = () => {
    console.group('📊 Performance Metrics')
    console.table(metrics.value)
    const { score, grade, issues } = getPerformanceScore()
    console.log(`Performance Score: ${score}/100 (${grade})`)
    if (issues.length > 0) {
      console.warn('Issues:', issues)
    }
    console.groupEnd()
  }

  /**
   * 上报性能指标（可用于发送到分析服务）
   */
  const reportMetrics = (endpoint?: string) => {
    const data = {
      metrics: metrics.value,
      score: getPerformanceScore(),
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    }

    if (endpoint) {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch((err) => console.warn('Failed to report metrics:', err))
    }

    return data
  }

  /**
   * 初始化性能监控
   */
  const init = () => {
    if (typeof window === 'undefined') return

    // 等待页面加载完成
    if (document.readyState === 'complete') {
      measurePageLoad()
      estimateTTI()
    } else {
      window.addEventListener('load', () => {
        measurePageLoad()
        estimateTTI()
      })
    }

    // 测量 Core Web Vitals
    measureLCP()
    measureCLS()
    measureFID()
    measureFCP()
    measureTBT()

    // 页面卸载时记录最终指标
    window.addEventListener('beforeunload', () => {
      if (lcpEntry) {
        metrics.value.LCP = Math.round(lcpEntry.startTime)
      }
      logMetrics()
    })
  }

  onMounted(() => {
    init()
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    metrics,
    getPerformanceScore,
    logMetrics,
    reportMetrics
  }
}