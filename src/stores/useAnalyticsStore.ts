import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 分析事件接口
 */
export interface AnalyticsEvent {
  name: string
  properties?: Record<string, unknown>
  timestamp: number
}

/**
 * 页面访问记录接口
 */
export interface PageVisit {
  path: string
  title: string
  timestamp: number
  duration?: number
}

/**
 * 分析状态管理
 */
export const useAnalyticsStore = defineStore('analytics', () => {
  // 状态
  const sessionId = ref(generateSessionId())
  const currentPage = ref('')
  const events = ref<AnalyticsEvent[]>([])
  const pageVisits = ref<PageVisit[]>([])
  const requestCount = ref(0)
  const lastRequestTime = ref<number | null>(null)

  // 计算属性
  const totalEvents = computed(() => events.value.length)
  const totalPageVisits = computed(() => pageVisits.value.length)

  /**
   * 生成会话ID
   */
  function generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 追踪页面浏览
   */
  function trackPageView(page: string, title: string) {
    const now = Date.now()
    
    // 更新上一个页面的持续时间
    if (pageVisits.value.length > 0) {
      const lastVisit = pageVisits.value[pageVisits.value.length - 1]
      lastVisit.duration = now - lastVisit.timestamp
    }

    // 添加新的页面访问记录
    pageVisits.value.push({
      path: page,
      title,
      timestamp: now
    })

    currentPage.value = page

    // 保持最近100条记录
    if (pageVisits.value.length > 100) {
      pageVisits.value = pageVisits.value.slice(-100)
    }

    // 保存到本地存储
    saveToLocalStorage()
  }

  /**
   * 追踪事件
   */
  function trackEvent(event: AnalyticsEvent) {
    events.value.push(event)

    // 保持最近500条事件
    if (events.value.length > 500) {
      events.value = events.value.slice(-500)
    }

    // 保存到本地存储
    saveToLocalStorage()
  }

  /**
   * 追踪API请求
   */
  function trackRequest(url: string) {
    requestCount.value++
    lastRequestTime.value = Date.now()

    trackEvent({
      name: 'api_request',
      properties: { url },
      timestamp: Date.now()
    })
  }

  /**
   * 获取用户行为摘要
   */
  function getSummary() {
    return {
      sessionId: sessionId.value,
      totalEvents: totalEvents.value,
      totalPageVisits: totalPageVisits.value,
      requestCount: requestCount.value,
      currentPage: currentPage.value,
      sessionDuration: calculateSessionDuration()
    }
  }

  /**
   * 计算会话持续时间
   */
  function calculateSessionDuration(): number {
    if (pageVisits.value.length === 0) return 0
    const firstVisit = pageVisits.value[0].timestamp
    const lastVisit = pageVisits.value[pageVisits.value.length - 1].timestamp
    return lastVisit - firstVisit
  }

  /**
   * 清除所有数据
   */
  function clearAll() {
    events.value = []
    pageVisits.value = []
    requestCount.value = 0
    lastRequestTime.value = null
    sessionId.value = generateSessionId()
    localStorage.removeItem('analytics_data')
  }

  /**
   * 保存到本地存储
   */
  function saveToLocalStorage() {
    try {
      const data = {
        sessionId: sessionId.value,
        events: events.value.slice(-50), // 只保存最近50条
        pageVisits: pageVisits.value.slice(-20), // 只保存最近20条
        requestCount: requestCount.value
      }
      localStorage.setItem('analytics_data', JSON.stringify(data))
    } catch (e) {
      console.warn('Failed to save analytics data:', e)
    }
  }

  /**
   * 从本地存储加载
   */
  function loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('analytics_data')
      if (saved) {
        const data = JSON.parse(saved)
        // 只恢复会话ID和计数，不恢复事件历史
        if (data.sessionId) {
          sessionId.value = data.sessionId
        }
        requestCount.value = data.requestCount || 0
      }
    } catch (e) {
      console.warn('Failed to load analytics data:', e)
    }
  }

  // 初始化加载
  loadFromLocalStorage()

  return {
    // 状态
    sessionId,
    currentPage,
    events,
    pageVisits,
    requestCount,
    lastRequestTime,

    // 计算属性
    totalEvents,
    totalPageVisits,

    // 方法
    trackPageView,
    trackEvent,
    trackRequest,
    getSummary,
    clearAll
  }
})
