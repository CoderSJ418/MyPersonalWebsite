import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AnalyticsEvent, PageViewEvent, RequestStats } from '@/api/types'
import { analyticsApi } from '@/api/analytics'

/**
 * 分析 Store
 * 管理分析数据和追踪逻辑
 */
export const useAnalyticsStore = defineStore('analytics', () => {
  // ==================== 状态 ====================

  /**
   * 页面浏览统计
   * 记录每个页面的浏览次数
   */
  const pageViews = ref<Record<string, number>>({})

  /**
   * 事件列表
   * 记录所有追踪的事件
   */
  const events = ref<AnalyticsEvent[]>([])

  /**
   * 请求统计
   * 记录所有 API 请求
   */
  const requestStats = ref<RequestStats[]>([])

  /**
   * 当前页面
   * 记录当前访问的页面
   */
  const currentPage = ref<string>('')

  /**
   * 会话 ID
   * 每次会话的唯一标识
   */
  const sessionId = ref<string>(generateSessionId())

  /**
   * 是否启用追踪
   */
  const isEnabled = ref<boolean>(true)

  // ==================== 计算属性 ====================

  /**
   * 总页面浏览量
   */
  const totalPageViews = computed(() =>
    Object.values(pageViews.value).reduce((sum, count) => sum + count, 0)
  )

  /**
   * 总事件数
   */
  const totalEvents = computed(() => events.value.length)

  /**
   * 总请求数
   */
  const totalRequests = computed(() => requestStats.value.length)

  /**
   * 成功请求数
   */
  const successfulRequests = computed(() =>
    requestStats.value.filter((r) => r.status >= 200 && r.status < 300).length
  )

  /**
   * 失败请求数
   */
  const failedRequests = computed(() =>
    requestStats.value.filter((r) => r.status >= 400).length
  )

  /**
   * 平均请求时长
   */
  const averageRequestDuration = computed(() => {
    if (requestStats.value.length === 0) return 0
    const total = requestStats.value.reduce((sum, r) => sum + r.duration, 0)
    return total / requestStats.value.length
  })

  /**
   * 最热门页面（Top 10）
   */
  const topPages = computed(() => {
    const sorted = Object.entries(pageViews.value).sort(
      (a, b) => b[1] - a[1]
    )
    return sorted.slice(0, 10).map(([page, count]) => ({ page, count }))
  })

  /**
   * 最常见的事件类型
   */
  const topEvents = computed(() => {
    const eventCounts = new Map<string, number>()
    events.value.forEach((event) => {
      eventCounts.set(
        event.name,
        (eventCounts.get(event.name) || 0) + 1
      )
    })
    const sorted = Array.from(eventCounts.entries()).sort(
      (a, b) => b[1] - a[1]
    )
    return sorted.slice(0, 10).map(([name, count]) => ({ name, count }))
  })

  // ==================== 方法 ====================

  /**
   * 追踪页面浏览
   */
  function trackPageView(page: string, title?: string) {
    if (!isEnabled.value) return

    // 更新本地统计
    pageViews.value[page] = (pageViews.value[page] || 0) + 1
    currentPage.value = page

    // 发送到分析服务
    const event: PageViewEvent = {
      page,
      title,
      referrer: document.referrer,
      timestamp: Date.now(),
    }

    analyticsApi.trackPageView(event).catch((error) => {
      console.error('Failed to track page view:', error)
    })

    // 保存到本地存储
    saveToLocalStorage()
  }

  /**
   * 追踪事件
   */
  function trackEvent(event: AnalyticsEvent) {
    if (!isEnabled.value) return

    // 添加到事件列表
    events.value.push({
      ...event,
      timestamp: event.timestamp || Date.now(),
    })

    // 发送到分析服务
    analyticsApi.trackEvent(event).catch((error) => {
      console.error('Failed to track event:', error)
    })

    // 保存到本地存储
    saveToLocalStorage()
  }

  /**
   * 追踪请求
   */
  function trackRequest(url: string, method: string, duration: number, status: number) {
    if (!isEnabled.value) return

    requestStats.value.push({
      url,
      method,
      duration,
      status,
      timestamp: Date.now(),
    })

    // 限制记录数量（最多 1000 条）
    if (requestStats.value.length > 1000) {
      requestStats.value = requestStats.value.slice(-1000)
    }

    // 保存到本地存储
    saveToLocalStorage()
  }

  /**
   * 批量追踪事件
   */
  function trackEvents(events: AnalyticsEvent[]) {
    if (!isEnabled.value) return

    // 添加到事件列表
    events.value.push(
      ...events.map((e) => ({
        ...e,
        timestamp: e.timestamp || Date.now(),
      }))
    )

    // 发送到分析服务
    analyticsApi.trackEvents(events).catch((error) => {
      console.error('Failed to track events:', error)
    })

    // 保存到本地存储
    saveToLocalStorage()
  }

  /**
   * 清除所有数据
   */
  function clear() {
    pageViews.value = {}
    events.value = []
    requestStats.value = []
    sessionId.value = generateSessionId()
    saveToLocalStorage()
  }

  /**
   * 重置页面浏览统计
   */
  function resetPageViews() {
    pageViews.value = {}
    saveToLocalStorage()
  }

  /**
   * 重置事件列表
   */
  function resetEvents() {
    events.value = []
    saveToLocalStorage()
  }

  /**
   * 重置请求统计
   */
  function resetRequestStats() {
    requestStats.value = []
    saveToLocalStorage()
  }

  /**
   * 启用追踪
   */
  function enable() {
    isEnabled.value = true
    saveToLocalStorage()
  }

  /**
   * 禁用追踪
   */
  function disable() {
    isEnabled.value = false
    saveToLocalStorage()
  }

  /**
   * 导出数据
   */
  function exportData() {
    return {
      pageViews: pageViews.value,
      events: events.value,
      requestStats: requestStats.value,
      sessionId: sessionId.value,
      isEnabled: isEnabled.value,
      exportDate: new Date().toISOString(),
    }
  }

  /**
   * 导入数据
   */
  function importData(data: any) {
    if (data.pageViews) pageViews.value = data.pageViews
    if (data.events) events.value = data.events
    if (data.requestStats) requestStats.value = data.requestStats
    if (data.sessionId) sessionId.value = data.sessionId
    if (typeof data.isEnabled === 'boolean') isEnabled.value = data.isEnabled
    saveToLocalStorage()
  }

  // ==================== 私有方法 ====================

  /**
   * 保存到本地存储
   */
  function saveToLocalStorage() {
    try {
      const data = {
        pageViews: pageViews.value,
        events: events.value.slice(-100), // 只保存最近 100 个事件
        requestStats: requestStats.value.slice(-100), // 只保存最近 100 个请求
        sessionId: sessionId.value,
        isEnabled: isEnabled.value,
      }
      localStorage.setItem('analytics_data', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save analytics data:', error)
    }
  }

  /**
   * 从本地存储加载
   */
  function loadFromLocalStorage() {
    try {
      const data = localStorage.getItem('analytics_data')
      if (data) {
        const parsed = JSON.parse(data)
        if (parsed.pageViews) pageViews.value = parsed.pageViews
        if (parsed.events) events.value = parsed.events
        if (parsed.requestStats) requestStats.value = parsed.requestStats
        if (parsed.sessionId) sessionId.value = parsed.sessionId
        if (typeof parsed.isEnabled === 'boolean') isEnabled.value = parsed.isEnabled
      }
    } catch (error) {
      console.error('Failed to load analytics data:', error)
    }
  }

  /**
   * 生成会话 ID
   */
  function generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // ==================== 初始化 ====================

  // 从本地存储加载数据
  loadFromLocalStorage()

  // 返回接口
  return {
    // 状态
    pageViews,
    events,
    requestStats,
    currentPage,
    sessionId,
    isEnabled,

    // 计算属性
    totalPageViews,
    totalEvents,
    totalRequests,
    successfulRequests,
    failedRequests,
    averageRequestDuration,
    topPages,
    topEvents,

    // 方法
    trackPageView,
    trackEvent,
    trackRequest,
    trackEvents,
    clear,
    resetPageViews,
    resetEvents,
    resetRequestStats,
    enable,
    disable,
    exportData,
    importData,
  }
})