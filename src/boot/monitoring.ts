/**
 * 监控系统初始化模块
 */
import { logger } from '@/utils/logger'
import type { App } from 'vue'

/**
 * 初始化所有监控系统
 */
export async function initMonitoring(app: App): Promise<void> {
  // 性能监控
  await initPerformanceMonitoring(app)

  // 错误监控
  await initErrorTracking(app)

  // 用户行为分析
  await initAnalytics()

  // 可用性监控
  await initUptimeMonitoring()

  logger.info('[Monitoring] All monitoring systems initialized')
}

/**
 * 初始化性能监控
 */
async function initPerformanceMonitoring(_app: App): Promise<void> {
  if (!import.meta.env.PROD) {
    // 开发环境
    try {
      const { usePerformance } = await import('@/composables/usePerformance')
      const { logMetrics } = usePerformance()

      const handleLoad = () => {
        setTimeout(() => logMetrics(), 1000)
        window.removeEventListener('load', handleLoad)
      }

      window.addEventListener('load', handleLoad)
    } catch (error) {
      logger.error('[Monitoring] Failed to load performance composable:', error)
    }
    return
  }

  // 生产环境
  try {
    const { createPerformanceMonitor, PerformanceTips } = await import('@/utils/performance')
    const monitor = createPerformanceMonitor()
    
    // 全局暴露监控实例
    ;(window as unknown as { __PERFORMANCE_MONITOR__: unknown }).__PERFORMANCE_MONITOR__ = monitor

    const handleLoad = () => {
      const reportMetrics = () => {
        const metrics = monitor.getMetrics()
        const score = monitor.calculatePerformanceScore()
        
        console.log(`[Performance] Final Performance Score: ${score}/100`)
        console.log('[Performance] Metrics:', metrics)
        
        const suggestions = PerformanceTips.shouldOptimize(metrics)
        if (suggestions.length > 0) {
          console.warn('[Performance] Optimization suggestions:', suggestions)
        }

        import('@/utils/monitoring')
          .then(({ monitoringConfig }) => {
            if (monitoringConfig.performance.reportEndpoint) {
              monitor.sendMetrics(monitoringConfig.performance.reportEndpoint)
            }
          })
          .catch((error) => {
            logger.error('[Monitoring] Failed to import monitoring config:', error)
          })
      }

      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(reportMetrics, { timeout: 3000 })
      } else {
        setTimeout(reportMetrics, 3000)
      }

      window.removeEventListener('load', handleLoad)
    }

    window.addEventListener('load', handleLoad)
    logger.info('[Monitoring] Performance monitoring initialized')
  } catch (error) {
    logger.error('[Monitoring] Failed to initialize performance monitoring:', error)
  }
}

/**
 * 初始化错误追踪
 */
async function initErrorTracking(app: App): Promise<void> {
  try {
    const { getErrorTracker } = await import('@/utils/errorTracking')
    const errorTracker = getErrorTracker()
    
    // 监听 Vue 错误
    app.config.errorHandler = (err, instance, info) => {
      errorTracker.captureException(err as Error, {
        component: instance?.$options?.name || 'Unknown',
        info
      })
    }
    
    logger.info('[Monitoring] Error tracking initialized')
  } catch (error) {
    logger.error('[Monitoring] Failed to initialize error tracking:', error)
  }
}

/**
 * 初始化用户行为分析
 */
async function initAnalytics(): Promise<void> {
  try {
    const { getAnalyticsTracker } = await import('@/utils/analytics')
    const analytics = getAnalyticsTracker()
    analytics.trackEvent('App', 'init', 'startup')
    logger.info('[Monitoring] Analytics initialized')
  } catch (error) {
    logger.error('[Monitoring] Failed to initialize analytics:', error)
  }

  // Google Analytics
  try {
    const { useAnalytics } = await import('@/composables/useAnalytics')
    const analytics = useAnalytics()
    
    analytics.init()
    analytics.setupAutoTracking({
      pageTracking: true,
      scrollDepthTracking: true,
      linkTracking: true,
      scrollDepths: [25, 50, 75, 90, 100]
    })
    
    logger.info('[Monitoring] Google Analytics initialized')
  } catch (error) {
    logger.error('[Monitoring] Failed to initialize Google Analytics:', error)
  }
}

/**
 * 初始化可用性监控
 */
async function initUptimeMonitoring(): Promise<void> {
  try {
    await import('@/utils/uptime').then(({ getUptimeMonitor }) => getUptimeMonitor())
    logger.info('[Monitoring] Uptime monitoring initialized')
  } catch (error) {
    logger.error('[Monitoring] Failed to initialize uptime monitoring:', error)
  }
}
