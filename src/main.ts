import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useServiceWorker } from './composables/useServiceWorker'
import { logger } from './utils/logger'
import { loadAllFonts, preloadCriticalFonts, addFontLoadingStyles } from './utils/fontLoader'
import { applyAccessibilityOptimizations } from './utils/accessibility'
import './assets/styles/main.css'
import './assets/styles/design-system.css'
import './assets/styles/design-tokens.css'
import './assets/animations.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 预加载关键字体
preloadCriticalFonts()

// 添加字体加载样式
addFontLoadingStyles()

// 应用可访问性优化
applyAccessibilityOptimizations()

// 加载所有字体
loadAllFonts().then(() => {
  // 标记字体加载完成
  document.documentElement.classList.add('fonts-loaded')
  logger.info('All fonts loaded successfully')
}).catch(error => {
  console.error('Failed to load fonts:', error)
  // 即使字体加载失败，也要继续应用
  document.documentElement.classList.add('fonts-loaded')
})

// 初始化性能监控
if (import.meta.env.PROD) {
  initWebVitalsMonitoring((metric) => {
    logger.info(`[Web Vitals] ${metric.name}: ${metric.value}`)
    
    // 检查指标是否达标
    const thresholds = {
      LCP: 2.5,
      FID: 100,
      CLS: 0.1,
      TTFB: 0.8
    }
    
    if (metric.value > thresholds[metric.name as keyof typeof thresholds]) {
      logger.warn(`[Web Vitals] ${metric.name} 不达标: ${metric.value}`)
    }
  })
  
  // 记录性能指标
  logWebVitals()
  
  // 输出性能优化建议
  const recommendations = getPerformanceRecommendations()
  if (recommendations.length > 0) {
    logger.info('[性能优化建议]')
    recommendations.forEach(rec => logger.info(`  - ${rec}`))
  }
}

app.mount('#app')

// 注册 Service Worker（仅在生产环境）
if (import.meta.env.PROD) {
  // 使用 requestIdleCallback 延迟注册，避免阻塞主线程
  const registerSW = () => {
    const { register } = useServiceWorker()

    register('/sw.js')
      .then((registration) => {
        if (registration) {
          logger.info('[Service Worker] Registered successfully')

          // 监听更新
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  logger.info('[Service Worker] New content is available; please refresh.')
                }
              })
            }
          })
        }
      })
      .catch((error) => {
        logger.error('[Service Worker] Registration failed:', error)
      })
  }

  // 优先使用 requestIdleCallback，降级到 setTimeout
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(registerSW, { timeout: 2000 })
  } else {
    setTimeout(registerSW, 1000)
  }
}

// 监控系统初始化（生产环境和开发环境都启用）
initMonitoring()

/**
 * 初始化监控系统
 */
function initMonitoring() {
  // 性能监控
  initPerformanceMonitoring()

  // 错误监控
  initErrorTracking()

  // 用户行为分析
  initAnalytics()

  // 可用性监控
  initUptimeMonitoring()

  logger.info('[Monitoring] All monitoring systems initialized')
}

/**
 * 初始化性能监控
 */
function initPerformanceMonitoring() {
  // 使用 web-vitals API
  import('./utils/performance')
    .then(({ PerformanceMonitor, PerformanceTips, monitor }) => {
      // 全局暴露监控实例
      window.__PERFORMANCE_MONITOR__ = monitor
      
      // 页面加载完成后记录性能指标
      const handleLoad = () => {
        // 使用 requestIdleCallback 延迟记录，避免阻塞主线程
        const reportMetrics = () => {
          const metrics = monitor.getMetrics()
          const score = monitor.calculatePerformanceScore()
          
          console.log(`[Performance] Final Performance Score: ${score}/100`)
          console.log('[Performance] Metrics:', metrics)
          
          // 显示优化建议
          const suggestions = PerformanceTips.shouldOptimize(metrics)
          if (suggestions.length > 0) {
            console.warn('[Performance] Optimization suggestions:', suggestions)
          }

          // 上报性能指标到分析服务
          import('./utils/monitoring')
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

        // 清理事件监听器
        window.removeEventListener('load', handleLoad)
      }

      window.addEventListener('load', handleLoad)
      
      // 开发环境显示性能仪表板
      if (import.meta.env.DEV) {
        import('./components/PerformanceDashboard.vue')
          .then(() => {
            console.log('[Performance] Performance dashboard loaded')
          })
          .catch((error) => {
            logger.error('[Performance] Failed to load dashboard:', error)
          })
      }
      
      logger.info('[Monitoring] Performance monitoring initialized')
    })
    .catch((error) => {
      logger.error('[Monitoring] Failed to initialize performance monitoring:', error)
    })
}

/**
 * 初始化错误追踪
 */
function initErrorTracking() {
  import('./utils/errorTracking')
    .then(({ getErrorTracker }) => {
      const errorTracker = getErrorTracker()
      logger.info('[Monitoring] Error tracking initialized')

      // 监听 Vue 错误
      app.config.errorHandler = (err, instance, info) => {
        errorTracker.captureException(err as Error, {
          component: instance?.$options?.name || 'Unknown',
          info
        })
      }
    })
    .catch((error) => {
      logger.error('[Monitoring] Failed to initialize error tracking:', error)
    })
}

/**
 * 初始化用户行为分析
 */
function initAnalytics() {
  import('./utils/analytics')
    .then(({ getAnalyticsTracker }) => {
      const analytics = getAnalyticsTracker()
      logger.info('[Monitoring] Analytics initialized')

      // 追踪应用启动
      analytics.trackEvent('App', 'init', 'startup')
    })
    .catch((error) => {
      logger.error('[Monitoring] Failed to initialize analytics:', error)
    })

  // 初始化 Google Analytics
  import('./composables/useAnalytics')
    .then(({ useAnalytics }) => {
      const analytics = useAnalytics()
      
      // 初始化 Google Analytics
      analytics.init()
      
      // 设置自动追踪
      analytics.setupAutoTracking({
        pageTracking: true,
        scrollDepthTracking: true,
        linkTracking: true,
        scrollDepths: [25, 50, 75, 90, 100]
      })
      
      logger.info('[Monitoring] Google Analytics initialized')
    })
    .catch((error) => {
      logger.error('[Monitoring] Failed to initialize Google Analytics:', error)
    })
}

/**
 * 初始化可用性监控
 */
function initUptimeMonitoring() {
  import('./utils/uptime')
    .then(({ getUptimeMonitor }) => {
      getUptimeMonitor()
      logger.info('[Monitoring] Uptime monitoring initialized')
    })
    .catch((error) => {
      logger.error('[Monitoring] Failed to initialize uptime monitoring:', error)
    })
}

// 开发环境额外功能
if (import.meta.env.DEV) {
  // 集成性能监控仪表板
  import('./components/PerformanceDashboard.vue')
    .then(() => {
      logger.info('[Performance] Performance dashboard component loaded')
    })
    .catch((error) => {
      logger.error('[Performance] Failed to load dashboard:', error)
    })

  // 使用性能监控 composable
  import('./composables/usePerformance')
    .then(({ usePerformance }) => {
      const { logMetrics } = usePerformance()

      // 页面加载完成后记录性能指标
      const handleLoad = () => {
        setTimeout(() => {
          logMetrics()
        }, 1000)

        // 清理事件监听器
        window.removeEventListener('load', handleLoad)
      }

      window.addEventListener('load', handleLoad)
    })
    .catch((error) => {
      logger.error('[Performance] Failed to load performance composable:', error)
    })

  // 暴露监控工具到全局（用于调试）
  window.__MONITORING__ = {
    getPerformanceMonitor: () =>
      import('./utils/performance').then((m) => m.createPerformanceMonitor()),
    getErrorTracker: () => import('./utils/errorTracking').then((m) => m.getErrorTracker()),
    getAnalyticsTracker: () => import('./utils/analytics').then((m) => m.getAnalyticsTracker()),
    getUptimeMonitor: () => import('./utils/uptime').then((m) => m.getUptimeMonitor())
  }

  logger.info('[Monitoring] Debug tools exposed to window.__MONITORING__')
}

// 添加类型声明
declare global {
  interface Window {
    __MONITORING__?: {
      getPerformanceMonitor: () => Promise<any>
      getErrorTracker: () => Promise<any>
      getAnalyticsTracker: () => Promise<any>
      getUptimeMonitor: () => Promise<any>
    }
  }
}
