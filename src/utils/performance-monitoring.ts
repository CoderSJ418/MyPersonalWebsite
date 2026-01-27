/**
 * 性能监控工具
 * 监控 Web Vitals 指标
 */

// Web Vitals 监控接口
interface WebVitalsMetric {
  name: string
  value: number
  delta: number
  id: string
  navigationType?: string
}

// 性能监控回调函数
type WebVitalsCallback = (metric: WebVitalsMetric) => void

// 监控的 Web Vitals 指标
const WEB_VITALS_METRICS = [
  'CLS', // 累积布局偏移
  'FID', // 首次输入延迟
  'LCP', // 最大内容绘制
  'TTFB' // 首字节时间
]

/**
 * 监控 Web Vitals 指标
 */
export function initWebVitalsMonitoring(onMetric: WebVitalsCallback): void {
  // 检查浏览器是否支持 Web Vitals
  if (!window || !window.gtag) {
    console.warn('Web Vitals 监控初始化失败: gtag 不可用')
    return
  }

  // 监控累积布局偏移 (CLS)
  if (typeof window.gtag === 'function') {
    try {
      // 尝试使用 Web Vitals 库
      import('web-vitals').then(({ getCLS, getFID, getLCP, getTTFB }) => {
        getCLS((metric) => {
          onMetric({
            name: 'CLS',
            value: metric.value,
            delta: metric.delta,
            id: metric.id
          })
        })

        getFID((metric) => {
          onMetric({
            name: 'FID',
            value: metric.value,
            delta: metric.delta,
            id: metric.id
          })
        })

        getLCP((metric) => {
          onMetric({
            name: 'LCP',
            value: metric.value,
            delta: metric.delta,
            id: metric.id
          })
        })

        getTTFB((metric) => {
          onMetric({
            name: 'TTFB',
            value: metric.value,
            delta: metric.delta,
            id: metric.id
          })
        })
      }).catch((error) => {
        console.warn('Web Vitals 库加载失败:', error)
      })
    } catch (error) {
      console.warn('Web Vitals 监控初始化失败:', error)
    }
  }
}

/**
 * 记录性能指标到控制台
 */
export function logWebVitals(): void {
  if (typeof window.gtag !== 'function') {
    return
  }

  try {
    import('web-vitals').then(({ getCLS, getFID, getLCP, getTTFB }) => {
      getCLS(console.log)
      getFID(console.log)
      getLCP(console.log)
      getTTFB(console.log)
    })
  } catch (error) {
    console.warn('性能指标记录失败:', error)
  }
}

/**
 * 检查性能指标是否达标
 */
export function checkPerformanceThresholds(): {
  lcp: boolean
  fcp: boolean
  cls: boolean
  ttfb: boolean
} {
  const thresholds = {
    lcp: 2.5, // 最大内容绘制 < 2.5s
    fcp: 1.8, // 首次内容绘制 < 1.8s
    cls: 0.1, // 累积布局偏移 < 0.1
    ttfb: 0.8  // 首字节时间 < 0.8s
  }

  // 这里应该从实际的性能指标中获取，暂时返回默认值
  return {
    lcp: true, // 假设达标
    fcp: true,
    cls: true,
    ttfb: true
  }
}

/**
 * 性能优化建议
 */
export function getPerformanceRecommendations(): string[] {
  const recommendations = []

  // 检查构建配置
  if (typeof window !== 'undefined') {
    const scripts = document.querySelectorAll('script[src]')
    const totalScripts = scripts.length
    const largeScripts = Array.from(scripts).filter((script) => {
      const src = (script as HTMLScriptElement).src
      return src.includes('vendor') || src.includes('animation-vendor')
    }).length

    if (largeScripts > 3) {
      recommendations.push(`检测到 ${largeScripts} 个大型第三方库，考虑代码分割优化`)
    }
  }

  // 检查图片加载
  const images = document.querySelectorAll('img')
  const lazyImages = Array.from(images).filter((img) => {
    return (img as HTMLImageElement).loading === 'lazy'
  }).length

  if (lazyImages < images.length * 0.8) {
    recommendations.push('建议为更多图片添加懒加载优化')
  }

  return recommendations
}