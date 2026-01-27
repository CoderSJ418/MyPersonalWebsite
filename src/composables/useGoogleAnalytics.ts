/**
 * Google Analytics 集成
 * 使用 Google Analytics 4 (GA4) 进行数据追踪
 */

declare global {
  interface Window {
    gtag: any
  }
}

/**
 * 初始化 Google Analytics
 * @param measurementId GA4 测量 ID（格式：G-XXXXXXXXXX）
 */
export function initGoogleAnalytics(measurementId?: string): void {
  const id = measurementId || import.meta.env.VITE_GA_MEASUREMENT_ID

  if (!id) {
    console.warn('Google Analytics measurement ID not provided')
    return
  }

  // 添加 gtag.js 到页面
  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
  script.async = true

  document.head.appendChild(script)

  // 初始化 gtag
  window.dataLayer = window.dataLayer || []
  window.gtag = function (...args: any[]) {
    window.dataLayer.push(args)
  }

  // 配置 GA4
  window.gtag('js', new Date())
  window.gtag('config', id)
}

/**
 * 追踪页面浏览
 * @param pageTitle 页面标题
 * @param pageLocation 页面路径
 * @param userId 用户 ID（可选）
 */
export function trackPageView(
  pageTitle: string,
  pageLocation: string,
  userId?: string
): void {
  if (!window.gtag) {
    console.warn('Google Analytics not initialized')
    return
  }

  const eventData: Record<string, string | number> = {
    page_title: pageTitle,
    page_location: pageLocation,
  }

  if (userId) {
    eventData.user_id = userId
  }

  window.gtag('event', 'page_view', eventData)
}

/**
 * 追踪事件
 * @param eventName 事件名称
 * @param eventParameters 事件参数
 */
export function trackEvent(
  eventName: string,
  eventParameters?: Record<string, string | number | boolean>
): void {
  if (!window.gtag) {
    console.warn('Google Analytics not initialized')
    return
  }

  window.gtag('event', eventName, eventParameters)
}

/**
 * 追踪自定义事件
 * @param eventName 事件名称
 * @param category 事件类别
 * @param label 事件标签（可选）
 * @param value 事件值（可选）
 */
export function trackCustomEvent(
  eventName: string,
  category: string,
  label?: string,
  value?: number
): void {
  if (!window.gtag) {
    console.warn('Google Analytics not initialized')
    return
  }

  const parameters: Record<string, string | number> = {
    event_category: category,
  }

  if (label) {
    parameters.event_label = label
  }

  if (value !== undefined) {
    parameters.value = value
  }

  window.gtag('event', eventName, parameters)
}

/**
 * 设置用户属性
 * @param userId 用户 ID
 * @param userProperties 用户属性
 */
export function setUserProperties(
  userId: string,
  userProperties: Record<string, string | number | boolean>
): void {
  if (!window.gtag) {
    console.warn('Google Analytics not initialized')
    return
  }

  window.gtag('set', 'user_properties', userProperties)
  userId && window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
    user_id: userId,
  })
}

/**
 * 追踪异常
 * @param description 异常描述
 * @param fatal 是否是致命错误
 */
export function trackException(description: string, fatal: boolean = false): void {
  if (!window.gtag) {
    console.warn('Google Analytics not initialized')
    return
  }

  window.gtag('event', 'exception', {
    description,
    fatal: fatal ? 1 : 0,
  })
}

/**
 * 追踪点击事件
 * @param element 点击的元素
 * @param category 事件类别
 * @param label 事件标签
 */
export function trackClick(
  element: string,
  category: string,
  label?: string
): void {
  trackCustomEvent('click', category, label, undefined)
}

/**
 * 追踪表单提交
 * @param formId 表单 ID
 * @param success 是否成功
 */
export function trackFormSubmit(formId: string, success: boolean): void {
  trackCustomEvent('form_submit', 'form', formId, success ? 1 : 0)
}

/**
 * 追踪下载
 * @param fileName 文件名
 * @param fileExtension 文件扩展名
 */
export function trackDownload(fileName: string, fileExtension: string): void {
  trackCustomEvent('file_download', 'download', fileName, undefined)
}

/**
 * 追踪视频播放
 * @param videoTitle 视频标题
 * @param videoDuration 视频时长（秒）
 * @param videoProgress 视频进度（0-100）
 * @param videoProvider 视频提供商
 */
export function trackVideoPlay(
  videoTitle: string,
  videoDuration: number,
  videoProgress?: number,
  videoProvider?: string
): void {
  const parameters: Record<string, string | number> = {
    video_title: videoTitle,
    video_duration: videoDuration,
  }

  if (videoProgress !== undefined) {
    parameters.video_percent = videoProgress
  }

  if (videoProvider) {
    parameters.video_provider = videoProvider
  }

  window.gtag('event', 'video_play', parameters)
}

/**
 * 追踪滚动深度
 * @param scrollDepth 滚动深度（0-100）
 * @param pagePath 页面路径
 */
export function trackScrollDepth(scrollDepth: number, pagePath: string): void {
  trackCustomEvent('scroll', 'engagement', pagePath, scrollDepth)
}

/**
 * 追踪链接点击
 * @param linkUrl 链接 URL
 * @   linkText 链接文本
 * @param outbound 是否是外部链接
 */
export function trackLinkClick(
  linkUrl: string,
  linkText?: string,
  outbound?: boolean
): void {
  const parameters: Record<string, string | number> = {
    link_url: linkUrl,
    outbound: outbound ? 1 : 0,
  }

  if (linkText) {
    parameters.link_text = linkText
  }

  window.gtag('event', 'click', parameters)
}

/**
 * 追踪搜索
 * @param searchTerm 搜索词
 * @param resultsCount 结果数量
 * @   searchCategory 搜索类别
 */
export function trackSearch(
  searchTerm: string,
  resultsCount: number,
  searchCategory?: string
): void {
  const parameters: Record<string, string | number> = {
    search_term: searchTerm,
    results_count: resultsCount,
  }

  if (searchCategory) {
    parameters.search_category = searchCategory
  }

  window.gtag('event', 'search', parameters)
}