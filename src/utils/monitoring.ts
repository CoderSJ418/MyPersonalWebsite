/**
 * 监控配置
 * 定义所有监控相关的配置项
 */

export interface MonitoringConfig {
  // 性能监控
  performance: {
    enabled: boolean
    reportEndpoint?: string
    sampleRate: number // 采样率 0-1
  }

  // 错误监控
  error: {
    enabled: boolean
    sentryDsn?: string
    sampleRate: number
  }

  // 用户行为监控
  analytics: {
    enabled: boolean
    googleAnalyticsId?: string
    sampleRate: number
  }

  // 可用性监控
  uptime: {
    enabled: boolean
    healthCheckEndpoint?: string
    checkInterval: number // 毫秒
  }

  // 日志监控
  logging: {
    enabled: boolean
    logLevel: 'debug' | 'info' | 'warn' | 'error'
    logEndpoint?: string
  }
}

/**
 * 默认监控配置
 */
export const defaultMonitoringConfig: MonitoringConfig = {
  performance: {
    enabled: true,
    sampleRate: 1.0 // 100% 采样
  },
  error: {
    enabled: true,
    sampleRate: 1.0
  },
  analytics: {
    enabled: true,
    sampleRate: 1.0
  },
  uptime: {
    enabled: true,
    checkInterval: 60000 // 1分钟
  },
  logging: {
    enabled: true,
    logLevel: 'info'
  }
}

/**
 * 从环境变量加载监控配置
 */
export function loadMonitoringConfig(): MonitoringConfig {
  const config = { ...defaultMonitoringConfig }

  // 从环境变量加载配置
  if (import.meta.env.VITE_SENTRY_DSN) {
    config.error.sentryDsn = import.meta.env.VITE_SENTRY_DSN
  }

  if (import.meta.env.VITE_GA_ID) {
    config.analytics.googleAnalyticsId = import.meta.env.VITE_GA_ID
  }

  if (import.meta.env.VITE_PERFORMANCE_ENDPOINT) {
    config.performance.reportEndpoint = import.meta.env.VITE_PERFORMANCE_ENDPOINT
  }

  if (import.meta.env.VITE_LOG_ENDPOINT) {
    config.logging.logEndpoint = import.meta.env.VITE_LOG_ENDPOINT
  }

  // 开发环境降低采样率
  if (import.meta.env.DEV) {
    config.performance.sampleRate = 0.1
    config.error.sampleRate = 0.1
    config.analytics.sampleRate = 0.1
  }

  return config
}

/**
 * 获取当前监控配置
 */
export const monitoringConfig = loadMonitoringConfig()
