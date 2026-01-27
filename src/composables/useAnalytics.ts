/**
 * Analytics Composable
 * 统一的分析追踪接口，同时支持 Google Analytics 和本地 analyticsStore
 */

import { onMounted, onUnmounted } from 'vue'
import { useAnalyticsStore } from '@/stores/useAnalyticsStore'
import {
  initGoogleAnalytics,
  trackPageView as trackGAPageView,
  trackEvent as trackGAEvent,
  trackCustomEvent as trackGACustomEvent,
  trackException as trackGAException,
  trackClick as trackGAClick,
  trackFormSubmit as trackGAFormSubmit,
  trackDownload as trackGADownload,
  trackVideoPlay as trackGAVideoPlay,
  trackScrollDepth as trackGAScrollDepth,
  trackLinkClick as trackGALinkClick,
  trackSearch as trackGASearch,
} from './useGoogleAnalytics'

/**
 * 使用分析追踪
 */
export function useAnalytics() {
  const analyticsStore = useAnalyticsStore()
  
  /**
   * 初始化分析系统
   */
  function init(measurementId?: string) {
    // 初始化 Google Analytics
    initGoogleAnalytics(measurementId)
    
    // 从本地存储恢复会话 ID
    const savedSessionId = localStorage.getItem('analytics_session_id')
    if (savedSessionId) {
      analyticsStore.$patch({
        sessionId: savedSessionId,
      })
    } else {
      // 保存新的会话 ID
      localStorage.setItem('analytics_session_id', analyticsStore.sessionId)
    }
  }

  /**
   * 追踪页面浏览
   */
  function trackPageView(
    page: string,
    title?: string,
    options?: {
      skipGA?: boolean
      skipStore?: boolean
    }
  ) {
    const pageTitle = title || document.title
    const pageLocation = page || window.location.pathname

    // 追踪到 analyticsStore
    if (!options?.skipStore) {
      analyticsStore.trackPageView(page, pageTitle)
    }

    // 追踪到 Google Analytics
    if (!options?.skipGA) {
      trackGAPageView(pageTitle, pageLocation, analyticsStore.sessionId)
    }
  }

  /**
   * 追踪事件
   */
  function trackEvent(
    name: string,
    properties?: Record<string, any>,
    options?: {
      category?: string
      label?: string
      value?: number
      skipGA?: boolean
      skipStore?: boolean
    }
  ) {
    // 追踪到 analyticsStore
    if (!options?.skipStore) {
      analyticsStore.trackEvent({
        name,
        properties,
        timestamp: Date.now(),
      })
    }

    // 追踪到 Google Analytics
    if (!options?.skipGA) {
      if (options?.category) {
        // 自定义事件
        trackGACustomEvent(name, options.category, options.label, options.value)
      } else {
        // 普通事件
        trackGAEvent(name, properties)
      }
    }
  }

  /**
   * 追踪点击
   */
  function trackClick(
    element: string,
    category: string = 'interaction',
    label?: string
  ) {
    analyticsStore.trackEvent({
      name: 'click',
      properties: {
        element,
        category,
        label,
      },
    })

    trackGAClick(element, category, label)
  }

  /**
   * 追踪表单提交
   */
  function trackFormSubmit(formId: string, success: boolean) {
    analyticsStore.trackEvent({
      name: 'form_submit',
      properties: {
        formId,
        success,
      },
    })

    trackGAFormSubmit(formId, success)
  }

  /**
   * 追踪下载
   */
  function trackDownload(fileName: string, fileExtension: string) {
    analyticsStore.trackEvent({
      name: 'download',
      properties: {
        fileName,
        fileExtension,
      },
    })

    trackGADownload(fileName, fileExtension)
  }

  /**
   * 追踪异常
   */
  function trackException(description: string, fatal: boolean = false) {
    analyticsStore.trackEvent({
      name: 'exception',
      properties: {
        description,
        fatal,
      },
    })

    trackGAException(description, fatal)
  }

  /**
   * 追踪滚动深度
   */
  function trackScrollDepth(scrollDepth: number) {
    analyticsStore.trackEvent({
      name: 'scroll',
      properties: {
        depth: scrollDepth,
        page: window.location.pathname,
      },
    })

    trackGAScrollDepth(scrollDepth, window.location.pathname)
  }

  /**
   * 追踪链接点击
   */
  function trackLinkClick(linkUrl: string, linkText?: string, outbound?: boolean) {
    analyticsStore.trackEvent({
      name: 'link_click',
      properties: {
        linkUrl,
        linkText,
        outbound,
      },
    })

    trackGALinkClick(linkUrl, linkText, outbound)
  }

  /**
   * 追踪搜索
   */
  function trackSearch(searchTerm: string, resultsCount: number, category?: string) {
    analyticsStore.trackEvent({
      name: 'search',
      properties: {
        searchTerm,
        resultsCount,
        category,
      },
    })

    trackGASearch(searchTerm, resultsCount, category)
  }

  /**
   * 追踪视频播放
   */
  function trackVideoPlay(
    videoTitle: string,
    videoDuration: number,
    videoProgress?: number,
    videoProvider?: string
  ) {
    analyticsStore.trackEvent({
      name: 'video_play',
      properties: {
        videoTitle,
        videoDuration,
        videoProgress,
        videoProvider,
      },
    })

    trackGAVideoPlay(videoTitle, videoDuration, videoProgress, videoProvider)
  }

  /**
   * 自动追踪页面浏览
   */
  function setupAutoPageTracking() {
    // 追踪初始页面浏览
    trackPageView(window.location.pathname, document.title)

    // 监听路由变化
    const observer = new MutationObserver(() => {
      const newTitle = document.title
      const newPath = window.location.pathname
      
      // 如果页面标题或路径发生变化
      if (newTitle !== analyticsStore.currentPage || newPath !== analyticsStore.currentPage) {
        trackPageView(newPath, newTitle)
      }
    })

    observer.observe(document.querySelector('title')!, {
      subtree: true,
      characterData: true,
    })

    // 监听 popstate 事件（浏览器前进/后退）
    window.addEventListener('popstate', () => {
      trackPageView(window.location.pathname, document.title)
    })

    // 返回清理函数
    return () => {
      observer.disconnect()
      window.removeEventListener('popstate', () => {
        trackPageView(window.location.pathname, document.title)
      })
    }
  }

  /**
   * 自动追踪滚动深度
   */
  function setupScrollDepthTracking(depths: number[] = [25, 50, 75, 90, 100]) {
    let maxDepthTracked = 0

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollDepth = Math.round((scrollTop / docHeight) * 100)

      // 检查是否达到新的深度里程碑
      for (const depth of depths) {
        if (scrollDepth >= depth && maxDepthTracked < depth) {
          trackScrollDepth(depth)
          maxDepthTracked = depth
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // 返回清理函数
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }

  /**
   * 自动追踪所有链接点击
   */
  function setupLinkTracking() {
    const handleLinkClick = (event: Event) => {
      const link = event.target as HTMLAnchorElement
      const href = link.href

      if (!href) return

      // 检查是否是外部链接
      const isOutbound = !href.startsWith(window.location.origin)

      // 追踪链接点击
      trackLinkClick(href, link.textContent || '', isOutbound)
    }

    // 使用事件委托
    document.addEventListener('click', handleLinkClick, { capture: true })

    // 返回清理函数
    return () => {
      document.removeEventListener('click', handleLinkClick, { capture: true })
    }
  }

  /**
   * 设置完整的自动追踪
   */
  function setupAutoTracking(options?: {
    pageTracking?: boolean
    scrollDepthTracking?: boolean
    linkTracking?: boolean
    scrollDepths?: number[]
  }) {
    const cleanupFunctions: Array<() => void> = []

    // 页面浏览追踪
    if (options?.pageTracking !== false) {
      cleanupFunctions.push(setupAutoPageTracking())
    }

    // 滚动深度追踪
    if (options?.scrollDepthTracking) {
      cleanupFunctions.push(setupScrollDepthTracking(options?.scrollDepths))
    }

    // 链接点击追踪
    if (options?.linkTracking) {
      cleanupFunctions.push(setupLinkTracking())
    }

    // 返回清理函数
    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup())
    }
  }

  // 在组件挂载时初始化
  onMounted(() => {
    // 检查是否已初始化
    if (!window.gtag) {
      init()
    }
  })

  return {
    // 初始化
    init,

    // 页面追踪
    trackPageView,
    setupAutoPageTracking,

    // 事件追踪
    trackEvent,
    trackClick,
    trackFormSubmit,
    trackDownload,
    trackException,
    trackScrollDepth,
    trackLinkClick,
    trackSearch,
    trackVideoPlay,

    // 自动追踪
    setupAutoTracking,
    setupScrollDepthTracking,
    setupLinkTracking,

    // 访问 Store
    analyticsStore,
  }
}