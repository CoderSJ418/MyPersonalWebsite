/**
 * 通用类型定义
 * 用于 API 响应、分页等通用场景
 */

/**
 * 通用 API 响应结构
 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
  timestamp: number
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page: number
  pageSize: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * 网站配置
 */
export interface SiteConfig {
  siteName: string
  siteUrl: string
  description: string
  keywords: string[]
  author: string
  socialLinks: {
    github?: string
    twitter?: string
    linkedin?: string
    email?: string
  }
  theme: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
  }
}

/**
 * 用户偏好
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: string
  newsletter: boolean
}

/**
 * API 错误
 */
export interface ApiError {
  code: number
  message: string
  details?: unknown
  timestamp: number
}

/**
 * 请求配置选项
 */
export interface RequestOptions {
  timeout?: number
  headers?: Record<string, string>
  params?: unknown
  data?: unknown
}

/**
 * 缓存配置
 */
export interface CacheConfig {
  enabled: boolean
  ttl: number
  maxSize: number
}

/**
 * 重试配置
 */
export interface RetryConfig {
  enabled: boolean
  maxRetries: number
  retryDelay: number
  retryCondition?: (error: unknown) => boolean
}

/**
 * API 客户端配置
 */
export interface ApiClientConfig {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
  cache?: CacheConfig
  retry?: RetryConfig
}
