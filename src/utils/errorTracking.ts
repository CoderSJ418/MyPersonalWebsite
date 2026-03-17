/**
 * 错误追踪工具
 * 集成 Sentry 和自定义错误监控
 */

import { monitoringConfig } from './monitoring'

export interface ErrorInfo {
  message: string
  stack?: string
  filename?: string
  lineno?: number
  colno?: number
  timestamp: number
  url: string
  userAgent: string
  userId?: string
  sessionId: string
  tags?: Record<string, string>
  extra?: Record<string, unknown>
}

/**
 * 生成会话 ID
 */
function generateSessionId(): string {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

/**
 * 错误追踪类
 */
export class ErrorTracker {
  private sessionId: string
  private userId: string | null = null
  private errorBuffer: ErrorInfo[] = []
  private maxBufferSize = 50

  constructor() {
    this.sessionId = generateSessionId()
    this.initErrorTracking()
  }

  /**
   * 初始化错误追踪
   */
  private initErrorTracking() {
    if (typeof window === 'undefined') return

    // 捕获全局错误
    window.addEventListener('error', this.handleError.bind(this))

    // 捕获未处理的 Promise 拒绝
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this))

    // 捕获资源加载错误
    window.addEventListener('error', this.handleResourceError.bind(this), true)
  }

  /**
   * 处理全局错误
   */
  private handleError(event: ErrorEvent) {
    if (!monitoringConfig.error.enabled) return

    // 采样
    if (Math.random() > monitoringConfig.error.sampleRate) return

    const errorInfo: ErrorInfo = {
      message: event.message,
      stack: event.error?.stack,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
      userId: this.userId || undefined,
      tags: {
        type: 'javascript',
        environment: import.meta.env.MODE
      }
    }

    this.trackError(errorInfo)
  }

  /**
   * 处理未处理的 Promise 拒绝
   */
  private handleUnhandledRejection(event: PromiseRejectionEvent) {
    if (!monitoringConfig.error.enabled) return

    // 采样
    if (Math.random() > monitoringConfig.error.sampleRate) return

    const error = event.reason
    const errorInfo: ErrorInfo = {
      message: error?.message || 'Unhandled Promise Rejection',
      stack: error?.stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
      userId: this.userId || undefined,
      tags: {
        type: 'promise',
        environment: import.meta.env.MODE
      },
      extra: {
        promiseReason: error
      }
    }

    this.trackError(errorInfo)
  }

  /**
   * 处理资源加载错误
   */
  private handleResourceError(event: Event) {
    if (!monitoringConfig.error.enabled) return

    const target = event.target as HTMLElement

    // 只处理资源加载错误
    if (
      !target ||
      target.tagName === 'SCRIPT' ||
      target.tagName === 'LINK' ||
      target.tagName === 'IMG'
    ) {
      const element = target as HTMLScriptElement | HTMLLinkElement | HTMLImageElement
      const errorInfo: ErrorInfo = {
        message: `Failed to load resource: ${element.src || element.href}`,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        sessionId: this.sessionId,
        userId: this.userId || undefined,
        tags: {
          type: 'resource',
          resourceType: element.tagName.toLowerCase(),
          environment: import.meta.env.MODE
        },
        extra: {
          resourceUrl: element.src || element.href
        }
      }

      this.trackError(errorInfo)
    }
  }

  /**
   * 追踪错误
   */
  private trackError(errorInfo: ErrorInfo) {
    // 添加到缓冲区
    this.errorBuffer.push(errorInfo)

    // 限制缓冲区大小
    if (this.errorBuffer.length > this.maxBufferSize) {
      this.errorBuffer.shift()
    }

    // 记录到控制台
    console.error('[Error Tracking]', errorInfo)

    // 发送到 Sentry（如果配置了）
    if (monitoringConfig.error.sentryDsn) {
      this.sendToSentry(errorInfo)
    }

    // 发送到自定义端点
    if (monitoringConfig.error.enabled) {
      this.sendToEndpoint(errorInfo)
    }
  }

  /**
   * 发送到 Sentry
   */
  private sendToSentry(errorInfo: ErrorInfo) {
    // 这里使用占位符，实际使用时需要安装 @sentry/browser
    // import * as Sentry from '@sentry/browser'
    // Sentry.captureException(new Error(errorInfo.message), {
    //   tags: errorInfo.tags,
    //   extra: errorInfo.extra
    // })

    console.warn('[Sentry] Would send error to Sentry:', errorInfo.message)
  }

  /**
   * 发送到自定义端点
   */
  private sendToEndpoint(errorInfo: ErrorInfo) {
    if (!monitoringConfig.logging.logEndpoint) return

    // 使用 sendBeacon API 确保数据发送
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(errorInfo)], { type: 'application/json' })
      navigator.sendBeacon(monitoringConfig.logging.logEndpoint, blob)
    }
  }

  /**
   * 手动捕获错误
   */
  public captureException(
    error: Error,
    tags?: Record<string, string>,
    extra?: Record<string, unknown>
  ) {
    if (!monitoringConfig.error.enabled) return

    const errorInfo: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
      userId: this.userId || undefined,
      tags: {
        ...tags,
        type: 'manual',
        environment: import.meta.env.MODE
      },
      extra
    }

    this.trackError(errorInfo)
  }

  /**
   * 设置用户 ID
   */
  public setUserId(userId: string) {
    this.userId = userId
  }

  /**
   * 获取错误缓冲区
   */
  public getErrorBuffer(): ErrorInfo[] {
    return [...this.errorBuffer]
  }

  /**
   * 清空错误缓冲区
   */
  public clearErrorBuffer() {
    this.errorBuffer = []
  }

  /**
   * 获取错误统计
   */
  public getErrorStats() {
    const stats = {
      total: this.errorBuffer.length,
      byType: {} as Record<string, number>,
      byUrl: {} as Record<string, number>
    }

    this.errorBuffer.forEach((error) => {
      // 按类型统计
      const type = error.tags?.type || 'unknown'
      stats.byType[type] = (stats.byType[type] || 0) + 1

      // 按URL统计
      const url = error.url
      stats.byUrl[url] = (stats.byUrl[url] || 0) + 1
    })

    return stats
  }
}

/**
 * 创建错误追踪实例
 */
let errorTrackerInstance: ErrorTracker | null = null

export function getErrorTracker(): ErrorTracker {
  if (!errorTrackerInstance) {
    errorTrackerInstance = new ErrorTracker()
  }
  return errorTrackerInstance
}

/**
 * 全局错误捕获助手
 */
export function captureError(error: Error, context?: Record<string, unknown>) {
  const tracker = getErrorTracker()
  tracker.captureException(error, undefined, context)
}
