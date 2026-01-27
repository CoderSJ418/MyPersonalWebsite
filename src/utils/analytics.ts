/**
 * 用户行为分析工具
 * 集成 Google Analytics 和自定义事件追踪
 */

import { monitoringConfig } from './monitoring'

export interface EventInfo {
  category: string
  action: string
  label?: string
  value?: number
  nonInteraction?: boolean
  timestamp: number
  url: string
  userId?: string
  sessionId: string
}

export interface PageInfo {
  title: string
  path: string
  referrer?: string
  timestamp: number
  duration?: number
}

/**
 * 生成会话 ID
 */
function generateSessionId(): string {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

/**
 * 用户行为分析类
 */
export class AnalyticsTracker {
  private sessionId: string
  private userId: string | null = null
  private currentPage: string | null = null
  private pageStartTime: number = 0
  private eventBuffer: EventInfo[] = []
  private pageBuffer: PageInfo[] = []
  private maxBufferSize = 100

  constructor() {
    this.sessionId = generateSessionId()
    this.initAnalytics()
  }

  /**
   * 初始化分析
   */
  private initAnalytics() {
    if (typeof window === 'undefined') return

    // 初始化 Google Analytics（如果配置了）
    if (monitoringConfig.analytics.googleAnalyticsId) {
      this.initGoogleAnalytics()
    }

    // 追踪页面浏览
    this.trackPageView()

    // 监听路由变化
    this.initRouteTracking()
  }

  /**
   * 初始化 Google Analytics
   */
  private initGoogleAnalytics() {
    // 这里使用占位符，实际使用时需要安装 gtag
    // const script = document.createElement('script')
    // script.src = `https://www.googletagmanager.com/gtag/js?id=${monitoringConfig.analytics.googleAnalyticsId}`
    // script.async = true
    // document.head.appendChild(script)
    //
    // window.dataLayer = window.dataLayer || []
    // function gtag() { window.dataLayer.push(arguments) }
    // gtag('js', new Date())
    // gtag('config', monitoringConfig.analytics.googleAnalyticsId)

    console.warn(
      '[Analytics] Google Analytics would be initialized with ID:',
      monitoringConfig.analytics.googleAnalyticsId
    )
  }

  /**
   * 初始化路由追踪
   */
  private initRouteTracking() {
    // 监听 popstate 事件（浏览器前进/后退）
    window.addEventListener('popstate', () => {
      this.trackPageView()
    })

    // 监听 pushState 和 replaceState
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    history.pushState = function (...args) {
      originalPushState.apply(this, args)
      setTimeout(() => {
        // 等待路由更新
        if (window.location.href !== window.location.href) {
          // 触发自定义事件
          window.dispatchEvent(new Event('routechange'))
        }
      }, 0)
    }

    history.replaceState = function (...args) {
      originalReplaceState.apply(this, args)
      setTimeout(() => {
        window.dispatchEvent(new Event('routechange'))
      }, 0)
    }

    window.addEventListener('routechange', () => {
      this.trackPageView()
    })
  }

  /**
   * 追踪页面浏览
   */
  public trackPageView() {
    if (!monitoringConfig.analytics.enabled) return

    // 采样
    if (Math.random() > monitoringConfig.analytics.sampleRate) return

    // 记录上一个页面的停留时间
    if (this.currentPage && this.pageStartTime) {
      const duration = Date.now() - this.pageStartTime
      const pageInfo = this.pageBuffer.find((p) => p.path === this.currentPage)
      if (pageInfo) {
        pageInfo.duration = duration
      }
    }

    // 记录新页面
    const pageInfo: PageInfo = {
      title: document.title,
      path: window.location.pathname,
      referrer: document.referrer || undefined,
      timestamp: Date.now()
    }

    this.pageBuffer.push(pageInfo)
    this.currentPage = pageInfo.path
    this.pageStartTime = Date.now()

    // 限制缓冲区大小
    if (this.pageBuffer.length > this.maxBufferSize) {
      this.pageBuffer.shift()
    }

    // 发送到 Google Analytics
    if (monitoringConfig.analytics.googleAnalyticsId) {
      this.sendToGoogleAnalytics('page_view', pageInfo)
    }

    console.info('[Analytics] Page view:', pageInfo)
  }

  /**
   * 追踪事件
   */
  public trackEvent(category: string, action: string, label?: string, value?: number) {
    if (!monitoringConfig.analytics.enabled) return

    // 采样
    if (Math.random() > monitoringConfig.analytics.sampleRate) return

    const eventInfo: EventInfo = {
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
      url: window.location.href,
      userId: this.userId || undefined,
      sessionId: this.sessionId
    }

    this.eventBuffer.push(eventInfo)

    // 限制缓冲区大小
    if (this.eventBuffer.length > this.maxBufferSize) {
      this.eventBuffer.shift()
    }

    // 发送到 Google Analytics
    if (monitoringConfig.analytics.googleAnalyticsId) {
      this.sendToGoogleAnalytics('event', eventInfo)
    }

    console.info('[Analytics] Event:', eventInfo)
  }

  /**
   * 追踪用户交互
   */
  public trackInteraction(element: string, action: 'click' | 'hover' | 'scroll' | 'focus') {
    this.trackEvent('Interaction', action, element)
  }

  /**
   * 追踪表单提交
   */
  public trackFormSubmit(formName: string, success: boolean) {
    this.trackEvent('Form', 'submit', formName, success ? 1 : 0)
  }

  /**
   * 追踪下载
   */
  public trackDownload(resource: string, type: string) {
    this.trackEvent('Download', type, resource)
  }

  /**
   * 追踪外部链接
   */
  public trackExternalLink(url: string) {
    this.trackEvent('Outbound', 'click', url)
  }

  /**
   * 追踪搜索
   */
  public trackSearch(query: string, resultsCount?: number) {
    this.trackEvent('Search', 'query', query, resultsCount)
  }

  /**
   * 追踪自定义事件
   */
  public trackCustomEvent(category: string, action: string, params?: Record<string, any>) {
    this.trackEvent(category, action, params?.label, params?.value)
  }

  /**
   * 发送到 Google Analytics
   */
  private sendToGoogleAnalytics(type: string, data: any) {
    // 这里使用占位符，实际使用时需要安装 gtag
    // if (window.gtag) {
    //   if (type === 'page_view') {
    //     window.gtag('event', 'page_view', {
    //       page_title: data.title,
    //       page_path: data.path,
    //       page_location: window.location.href
    //     })
    //   } else if (type === 'event') {
    //     window.gtag('event', data.action, {
    //       event_category: data.category,
    //       event_label: data.label,
    //       value: data.value
    //     })
    //   }
    // }

    console.warn('[Google Analytics] Would send:', type, data)
  }

  /**
   * 设置用户 ID
   */
  public setUserId(userId: string) {
    this.userId = userId

    // 发送到 Google Analytics
    if (monitoringConfig.analytics.googleAnalyticsId) {
      // if (window.gtag) {
      //   window.gtag('config', monitoringConfig.analytics.googleAnalyticsId, {
      //     user_id: userId
      //   })
      // }
    }
  }

  /**
   * 获取事件缓冲区
   */
  public getEventBuffer(): EventInfo[] {
    return [...this.eventBuffer]
  }

  /**
   * 获取页面缓冲区
   */
  public getPageBuffer(): PageInfo[] {
    return [...this.pageBuffer]
  }

  /**
   * 获取统计信息
   */
  public getStats() {
    const eventStats = {
      total: this.eventBuffer.length,
      byCategory: {} as Record<string, number>,
      byAction: {} as Record<string, number>
    }

    this.eventBuffer.forEach((event) => {
      // 按类别统计
      eventStats.byCategory[event.category] = (eventStats.byCategory[event.category] || 0) + 1

      // 按动作统计
      eventStats.byAction[event.action] = (eventStats.byAction[event.action] || 0) + 1
    })

    const pageStats = {
      total: this.pageBuffer.length,
      uniquePages: new Set(this.pageBuffer.map((p) => p.path)).size,
      avgDuration: 0,
      totalPages: this.pageBuffer.length
    }

    // 计算平均停留时间
    const pagesWithDuration = this.pageBuffer.filter((p) => p.duration !== undefined)
    if (pagesWithDuration.length > 0) {
      pageStats.avgDuration =
        pagesWithDuration.reduce((sum, p) => sum + (p.duration || 0), 0) / pagesWithDuration.length
    }

    return {
      events: eventStats,
      pages: pageStats
    }
  }
}

/**
 * 创建分析追踪实例
 */
let analyticsTrackerInstance: AnalyticsTracker | null = null

export function getAnalyticsTracker(): AnalyticsTracker {
  if (!analyticsTrackerInstance) {
    analyticsTrackerInstance = new AnalyticsTracker()
  }
  return analyticsTrackerInstance
}

/**
 * 全局事件追踪助手
 */
export function trackEvent(category: string, action: string, label?: string, value?: number) {
  const tracker = getAnalyticsTracker()
  tracker.trackEvent(category, action, label, value)
}

/**
 * 全局页面浏览追踪助手
 */
export function trackPageView() {
  const tracker = getAnalyticsTracker()
  tracker.trackPageView()
}
