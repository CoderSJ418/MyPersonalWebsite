/**
 * 可用性监控工具
 * 监控网站健康状态和可用性
 */

import { monitoringConfig } from './monitoring'

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: number
  checks: {
    api: boolean
    resources: boolean
    performance: boolean
    connectivity: boolean
  }
  metrics: {
    responseTime: number
    memoryUsage?: number
    errors: number
  }
}

export interface UptimeReport {
  startTime: number
  endTime: number
  totalChecks: number
  healthyChecks: number
  degradedChecks: number
  unhealthyChecks: number
  uptime: number // 百分比
  avgResponseTime: number
  errors: number
}

/**
 * 可用性监控类
 */
export class UptimeMonitor {
  private checkInterval: number | null = null
  private healthHistory: HealthCheckResult[] = []
  private maxHistorySize = 1440 // 24小时（每分钟一次）
  private startTime: number = Date.now()
  private errorCount: number = 0

  constructor() {
    this.initUptimeMonitoring()
  }

  /**
   * 初始化可用性监控
   */
  private initUptimeMonitoring() {
    if (typeof window === 'undefined') return

    if (!monitoringConfig.uptime.enabled) return

    // 立即执行一次健康检查
    this.performHealthCheck()

    // 定期执行健康检查
    this.checkInterval = window.setInterval(() => {
      this.performHealthCheck()
    }, monitoringConfig.uptime.checkInterval)

    // 监听页面可见性变化
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        // 页面变为可见时立即执行健康检查
        this.performHealthCheck()
      }
    })

    // 监听网络状态变化
    window.addEventListener('online', () => {
      this.performHealthCheck()
    })

    window.addEventListener('offline', () => {
      this.recordOfflineEvent()
    })
  }

  /**
   * 执行健康检查
   */
  private async performHealthCheck(): Promise<HealthCheckResult> {
    const result: HealthCheckResult = {
      status: 'healthy',
      timestamp: Date.now(),
      checks: {
        api: false,
        resources: false,
        performance: false,
        connectivity: false
      },
      metrics: {
        responseTime: 0,
        memoryUsage: undefined,
        errors: this.errorCount
      }
    }

    const startTime = performance.now()

    try {
      // 检查网络连接
      result.checks.connectivity = await this.checkConnectivity()

      // 检查 API 可用性
      if (monitoringConfig.uptime.healthCheckEndpoint) {
        result.checks.api = await this.checkAPI()
      } else {
        result.checks.api = true // 没有配置端点时默认通过
      }

      // 检查资源加载
      result.checks.resources = await this.checkResources()

      // 检查性能
      result.checks.performance = await this.checkPerformance()

      // 获取内存使用情况
      if ((performance as any).memory) {
        result.metrics.memoryUsage = (performance as any).memory.usedJSHeapSize
      }

      // 计算响应时间
      result.metrics.responseTime = Math.round(performance.now() - startTime)

      // 确定整体状态
      const failedChecks = Object.values(result.checks).filter((check) => !check).length

      if (failedChecks === 0) {
        result.status = 'healthy'
      } else if (failedChecks <= 1) {
        result.status = 'degraded'
      } else {
        result.status = 'unhealthy'
        this.errorCount++
      }

      // 记录到历史
      this.recordHealthCheck(result)

      console.info('[Uptime] Health check:', result)

      return result
    } catch (error) {
      console.error('[Uptime] Health check failed:', error)
      result.status = 'unhealthy'
      result.metrics.responseTime = Math.round(performance.now() - startTime)
      this.errorCount++
      this.recordHealthCheck(result)
      return result
    }
  }

  /**
   * 检查网络连接
   */
  private async checkConnectivity(): Promise<boolean> {
    return navigator.onLine
  }

  /**
   * 检查 API 可用性
   */
  private async checkAPI(): Promise<boolean> {
    if (!monitoringConfig.uptime.healthCheckEndpoint) return true

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5秒超时

      const response = await fetch(monitoringConfig.uptime.healthCheckEndpoint!, {
        method: 'GET',
        cache: 'no-cache',
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      return response.ok
    } catch (error) {
      console.warn('[Uptime] API check failed:', error)
      return false
    }
  }

  /**
   * 检查资源加载
   */
  private async checkResources(): Promise<boolean> {
    return new Promise((resolve) => {
      // 检查是否有资源加载错误
      const resources = performance.getEntriesByType('resource')

      // 检查最近的资源加载是否有错误
      const recentResources = resources.filter(
        (r) => Date.now() - r.startTime < 60000 // 最近1分钟
      )

      // 简单检查：如果有资源加载时间过长，认为资源加载有问题
      const slowResources = recentResources.filter((r) => r.duration > 10000) // 超过10秒

      resolve(slowResources.length === 0)
    })
  }

  /**
   * 检查性能
   */
  private async checkPerformance(): Promise<boolean> {
    return new Promise((resolve) => {
      // 检查页面性能
      if (window.performance && window.performance.timing) {
        const timing = window.performance.timing
        const loadTime = timing.loadEventEnd - timing.navigationStart

        // 如果页面加载时间超过 10 秒，认为性能有问题
        resolve(loadTime < 10000)
      } else {
        resolve(true)
      }
    })
  }

  /**
   * 记录健康检查结果
   */
  private recordHealthCheck(result: HealthCheckResult) {
    this.healthHistory.push(result)

    // 限制历史记录大小
    if (this.healthHistory.length > this.maxHistorySize) {
      this.healthHistory.shift()
    }
  }

  /**
   * 记录离线事件
   */
  private recordOfflineEvent() {
    const result: HealthCheckResult = {
      status: 'unhealthy',
      timestamp: Date.now(),
      checks: {
        api: false,
        resources: false,
        performance: false,
        connectivity: false
      },
      metrics: {
        responseTime: 0,
        errors: this.errorCount
      }
    }

    this.recordHealthCheck(result)
    console.warn('[Uptime] Offline event recorded')
  }

  /**
   * 获取当前健康状态
   */
  public getCurrentHealth(): HealthCheckResult | null {
    return this.healthHistory.length > 0 ? this.healthHistory[this.healthHistory.length - 1] : null
  }

  /**
   * 获取可用性报告
   */
  public getUptimeReport(): UptimeReport {
    const endTime = Date.now()
    const totalChecks = this.healthHistory.length

    const healthyChecks = this.healthHistory.filter((h) => h.status === 'healthy').length
    const degradedChecks = this.healthHistory.filter((h) => h.status === 'degraded').length
    const unhealthyChecks = this.healthHistory.filter((h) => h.status === 'unhealthy').length

    const uptime = totalChecks > 0 ? (healthyChecks / totalChecks) * 100 : 100

    const avgResponseTime =
      totalChecks > 0
        ? this.healthHistory.reduce((sum, h) => sum + h.metrics.responseTime, 0) / totalChecks
        : 0

    return {
      startTime: this.startTime,
      endTime,
      totalChecks,
      healthyChecks,
      degradedChecks,
      unhealthyChecks,
      uptime: Math.round(uptime * 100) / 100,
      avgResponseTime: Math.round(avgResponseTime),
      errors: this.errorCount
    }
  }

  /**
   * 手动触发健康检查
   */
  public async triggerHealthCheck(): Promise<HealthCheckResult> {
    return this.performHealthCheck()
  }

  /**
   * 停止监控
   */
  public stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
  }

  /**
   * 重启监控
   */
  public restartMonitoring() {
    this.stopMonitoring()
    this.initUptimeMonitoring()
  }
}

/**
 * 创建可用性监控实例
 */
let uptimeMonitorInstance: UptimeMonitor | null = null

export function getUptimeMonitor(): UptimeMonitor {
  if (!uptimeMonitorInstance) {
    uptimeMonitorInstance = new UptimeMonitor()
  }
  return uptimeMonitorInstance
}
