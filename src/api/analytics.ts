/**
 * 分析 API
 * 用于追踪用户行为和发送分析数据
 */

import { get, post } from './index'
import type {
  AnalyticsEvent,
  PageViewEvent,
  ApiResponse,
  PaginatedResponse,
  RequestStats,
} from './types'

/**
 * 分析服务类
 */
export class AnalyticsApi {
  private static instance: AnalyticsApi

  private constructor() {}

  static getInstance(): AnalyticsApi {
    if (!AnalyticsApi.instance) {
      AnalyticsApi.instance = new AnalyticsApi()
    }
    return AnalyticsApi.instance
  }

  /**
   * 追踪页面浏览
   */
  async trackPageView(event: PageViewEvent): Promise<void> {
    await post<void>('/api/analytics/pageview', event)
  }

  /**
   * 追踪事件
   */
  async trackEvent(event: AnalyticsEvent): Promise<void> {
    await post<void>('/api/analytics/event', event)
  }

  /**
   * 获取页面浏览统计
   */
  async getPageViews(params?: {
    startDate?: string
    endDate?: string
    page?: string
  }): Promise<ApiResponse<Record<string, number>>> {
    return await get<ApiResponse<Record<string, number>>>(
      '/api/analytics/pageviews',
      { params }
    )
  }

  /**
   * 获取事件统计
   */
  async getEvents(params?: {
    startDate?: string
    endDate?: string
    eventName?: string
  }): Promise<ApiResponse<AnalyticsEvent[]>> {
    return await get<ApiResponse<AnalyticsEvent[]>>('/api/analytics/events', {
      params,
    })
  }

  /**
   * 获取请求统计
   */
  async getRequestStats(params?: {
    startDate?: string
    endDate?: string
    page?: number
    pageSize?: number
  }): Promise<ApiResponse<PaginatedResponse<RequestStats>>> {
    return await get<ApiResponse<PaginatedResponse<RequestStats>>>(
      '/api/analytics/requests',
      { params }
    )
  }

  /**
   * 批量追踪事件
   */
  async trackEvents(events: AnalyticsEvent[]): Promise<void> {
    await post<void>('/api/analytics/events/batch', { events })
  }
}

/**
 * 导出单例实例
 */
export const analyticsApi = AnalyticsApi.getInstance()

/**
 * 导出便捷方法
 */
export const trackPageView = (event: PageViewEvent) =>
  analyticsApi.trackPageView(event)

export const trackEvent = (event: AnalyticsEvent) =>
  analyticsApi.trackEvent(event)

export const getPageViews = (params?: any) =>
  analyticsApi.getPageViews(params)

export const getEvents = (params?: any) => analyticsApi.getEvents(params)

export const getRequestStats = (params?: any) =>
  analyticsApi.getRequestStats(params)

export const trackEvents = (events: AnalyticsEvent[]) =>
  analyticsApi.trackEvents(events)