/**
 * 性能优化工具
 * 提供页面性能监控和优化建议
 */

/**
 * 性能监控器
 */
export class PerformanceMonitor {
  private metrics: Record<string, number> = {}
  private observers: MutationObserver[] = []
  private resizeObserver: ResizeObserver | null = null

  /**
   * 记录性能指标
   */
  recordMetric(name: string, value: number): void {
    this.metrics[name] = value
  }

  /**
   * 获取所有性能指标
   */
  getMetrics(): Record<string, number> {
    return { ...this.metrics }
  }

  /**
   * 计算性能评分
   */
  calculatePerformanceScore(): number {
    const weights = {
      LCP: 0.3,
      FID: 0.2,
      CLS: 0.2,
      TTFB: 0.15,
      TTI: 0.15
    }

    let score = 0
    let totalWeight = 0

    Object.entries(weights).forEach(([metric, weight]) => {
      if (this.metrics[metric] !== undefined) {
        const normalizedScore = this.normalizeScore(metric, this.metrics[metric])
        score += normalizedScore * weight
        totalWeight += weight
      }
    })

    return Math.round((score / totalWeight) * 100)
  }

  /**
   * 规范化分数
   */
  private normalizeScore(metric: string, value: number): number {
    const thresholds = {
      LCP: { good: 2.5, poor: 4 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      TTFB: { good: 0.8, poor: 1.8 },
      TTI: { good: 3.8, poor: 7.3 }
    }

    const threshold = thresholds[metric as keyof typeof thresholds]
    if (!threshold) return 50

    if (value <= threshold.good) return 100
    if (value >= threshold.poor) return 0

    return Math.round(
      ((threshold.poor - value) / (threshold.poor - threshold.good)) * 100
    )
  }

  /**
   * 监控内存使用
   */
  monitorMemory(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      const usedMemory = memory.usedJSHeapSize / 1048576
      const totalMemory = memory.totalJSHeapSize / 1048576
      const memoryUsage = (usedMemory / totalMemory) * 100

      this.recordMetric('memory-usage', memoryUsage)
    }
  }

  /**
   * 监控网络性能
   */
  monitorNetwork(): void {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming
              this.recordMetric('TTFB', navEntry.responseStart - navEntry.fetchStart)
              this.recordMetric('TTI', navEntry.domContentLoadedEventEnd - navEntry.fetchStart)
            }
          }
        })

        observer.observe({ entryTypes: ['navigation'] })
        this.observers.push(observer)
      } catch (error) {
        console.warn('Failed to monitor network performance:', error)
      }
    }
  }

  /**
   * 监控重排和重绘
   */
  monitorReflows(): void {
    let lastTime = performance.now()
    let frameCount = 0
    let fps = 60

    const measureFrame = () => {
      frameCount++
      const currentTime = performance.now()
      
      if (currentTime >= lastTime + 1000) {
        fps = frameCount
        frameCount = 0
        lastTime = currentTime
        
        // 记录FPS
        this.recordMetric('fps', fps)
        
        // 如果FPS低于30，发出警告
        if (fps < 30) {
          console.warn(`低帧率检测: ${fps} FPS`)
        }
      }
      
      requestAnimationFrame(measureFrame)
    }

    requestAnimationFrame(measureFrame)
  }

  /**
   * 监控图片加载性能
   */
  monitorImages(): void {
    const images = document.querySelectorAll('img')
    
    images.forEach((img) => {
      const startTime = performance.now()
      
      const handleLoad = () => {
        const loadTime = performance.now() - startTime
        this.recordMetric(`image-load-${img.src}`, loadTime)
        
        img.removeEventListener('load', handleLoad)
        img.removeEventListener('error', handleError)
      }
      
      const handleError = () => {
        console.warn(`图片加载失败: ${img.src}`)
        img.removeEventListener('load', handleLoad)
        img.removeEventListener('error', handleError)
      }
      
      img.addEventListener('load', handleLoad)
      img.addEventListener('error', handleError)
    })
  }

  /**
   * 监控脚本加载
   */
  monitorScripts(): void {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'resource' && entry.name.includes('.js')) {
              this.recordMetric(`script-load-${entry.name}`, entry.duration)
            }
          }
        })

        observer.observe({ entryTypes: ['resource'] })
        this.observers.push(observer)
      } catch (error) {
        console.warn('Failed to monitor script performance:', error)
      }
    }
  }

  /**
   * 监控字体加载
   */
  monitorFonts(): void {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'font') {
              this.recordMetric(`font-load-${entry.name}`, entry.duration)
            }
          }
        })

        observer.observe({ entryTypes: ['font'] })
        this.observers.push(observer)
      } catch (error) {
        console.warn('Failed to monitor font performance:', error)
      }
    }
  }

  /**
   * 监控Resize事件
   */
  monitorResize(): void {
    let resizeTimer: ReturnType<typeof setTimeout>
    
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        const width = window.innerWidth
        const height = window.innerHeight
        this.recordMetric('window-width', width)
        this.recordMetric('window-height', height)
      }, 250)
    }

    window.addEventListener('resize', handleResize)
    this.resizeObserver = new ResizeObserver(() => {
      handleResize()
    })
    this.resizeObserver.observe(document.documentElement)
  }

  /**
   * 发送性能指标到服务器
   */
  async sendMetrics(endpoint: string): Promise<void> {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metrics: this.getMetrics(),
          score: this.calculatePerformanceScore(),
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      })

      if (!response.ok) {
        console.warn('Failed to send performance metrics:', response.status)
      }
    } catch (error) {
      console.warn('Error sending performance metrics:', error)
    }
  }

  /**
   * 清理资源
   */
  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
    
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }
  }
}

/**
 * 性能优化建议
 */
export class PerformanceTips {
  static shouldOptimize(metrics: Record<string, number>): string[] {
    const suggestions: string[] = []

    // LCP 优化
    if (metrics['LCP'] > 2.5) {
      suggestions.push('LCP过长，建议优化首屏加载性能')
    }

    // FID 优化
    if (metrics['FID'] > 100) {
      suggestions.push('FID过长，建议优化主线程性能')
    }

    // CLS 优化
    if (metrics['CLS'] > 0.1) {
      suggestions.push('CLS过大，建议优化布局稳定性')
    }

    // 内存使用优化
    if (metrics['memory-usage'] > 80) {
      suggestions.push('内存使用过高，建议优化内存管理')
    }

    // FPS 优化
    if (metrics['fps'] < 30) {
      suggestions.push('FPS过低，建议优化动画性能')
    }

    return suggestions
  }

  /**
   * 获取优化建议详情
   */
  static getDetailedSuggestions(metrics: Record<string, number>): Record<string, string> {
    const suggestions: Record<string, string> = {}

    if (metrics['LCP'] > 2.5) {
      suggestions['LCP'] = `
        首屏加载时间过长。建议：
        1. 启用图片懒加载
        2. 优化关键资源加载
        3. 减少不必要的JavaScript
        4. 使用CDN加速静态资源
      `.trim()
    }

    if (metrics['FID'] > 100) {
      suggestions['FID'] = `
        首次输入延迟过长。建议：
        1. 减少主线程阻塞操作
        2. 使用Web Workers处理复杂计算
        3. 优化JavaScript包大小
        4. 实现代码分割
      `.trim()
    }

    if (metrics['CLS'] > 0.1) {
      suggestions['CLS'] = `
        累积布局偏移过大。建议：
        1. 为图片和视频设置固定尺寸
        2. 避免动态插入内容
        3. 使用transform替代改变布局的属性
        4. 预留空间给动态内容
      `.trim()
    }

    return suggestions
  }
}

/**
 * 初始化性能监控
 */
export function initPerformanceMonitoring(): void {
  const monitor = new PerformanceMonitor()
  window.__PERFORMANCE_MONITOR__ = monitor

  // 记录页面加载开始时间
  const pageStartTime = performance.now()
  monitor.recordMetric('page-start-time', pageStartTime)

  // 监控页面加载完成
  window.addEventListener('load', () => {
    const loadTime = performance.now() - pageStartTime
    monitor.recordMetric('page-load-time', loadTime)
    
    // 计算性能评分
    const score = monitor.calculatePerformanceScore()
    console.log(`[Performance] 页面加载完成，性能评分: ${score}/100`)
    
    // 显示优化建议
    const suggestions = PerformanceTips.shouldOptimize(monitor.getMetrics())
    if (suggestions.length > 0) {
      console.warn('[Performance] 优化建议:', suggestions)
    }
  })

  // 监控各种性能指标
  monitor.monitorMemory()
  monitor.monitorNetwork()
  monitor.monitorReflows()
  monitor.monitorImages()
  monitor.monitorScripts()
  monitor.monitorFonts()
  monitor.monitorResize()

  // 页面卸载时清理
  window.addEventListener('beforeunload', () => {
    monitor.cleanup()
  })
}

/**
 * 获取当前性能状态
 */
export function getPerformanceStatus(): {
  score: number
  metrics: Record<string, number>
  recommendations: string[]
} {
  const monitor = window.__PERFORMANCE_MONITOR__
  if (!monitor) {
    return {
      score: 0,
      metrics: {},
      recommendations: ['性能监控未初始化']
    }
  }

  const metrics = monitor.getMetrics()
  const score = monitor.calculatePerformanceScore()
  const recommendations = PerformanceTips.shouldOptimize(metrics)

  return {
    score,
    metrics,
    recommendations
  }
}

/**
 * 生成性能报告
 */
export function generatePerformanceReport(): string {
  const status = getPerformanceStatus()
  
  let report = `# 性能报告\n\n`
  report += `**性能评分**: ${status.score}/100\n\n`
  
  report += `## 性能指标\n\n`
  Object.entries(status.metrics).forEach(([metric, value]) => {
    report += `- ${metric}: ${value.toFixed(2)}\n`
  })
  
  if (status.recommendations.length > 0) {
    report += `\n## 优化建议\n\n`
    status.recommendations.forEach((rec, index) => {
      report += `${index + 1}. ${rec}\n`
    })
  }
  
  return report
}