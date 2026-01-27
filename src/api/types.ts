/**
 * API 类型定义
 * 定义所有 API 相关的 TypeScript 类型
 */

/**
 * 通用 API 响应结构
 */
export interface ApiResponse<T = any> {
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
 * 分析事件
 */
export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp?: number
}

/**
 * 页面浏览事件
 */
export interface PageViewEvent {
  page: string
  title?: string
  referrer?: string
  timestamp?: number
}

/**
 * 用户信息
 */
export interface UserInfo {
  id: string
  name: string
  email: string
  avatar?: string
  role?: string
}

/**
 * 博客文章
 */
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  updatedAt: string
  tags: string[]
  category: string
  coverImage?: string
  readTime?: number
}

/**
 * 项目信息
 */
export interface Project {
  id: string
  title: string
  slug: string
  description: string
  longDescription?: string
  technologies: string[]
  images: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
  order: number
  createdAt: string
  updatedAt: string
}

/**
 * 联系表单数据
 */
export interface ContactFormData {
  name: string
  email: string
  subject?: string
  message: string
}

/**
 * 联系表单响应
 */
export interface ContactFormResponse {
  success: boolean
  message: string
}

/**
 * 工作经历
 */
export interface WorkExperience {
  id: string
  company: string
  position: string
  startDate: string
  endDate?: string
  current?: boolean
  description: string[]
  technologies: string[]
}

/**
 * 教育背景
 */
export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate?: string
  current?: boolean
  gpa?: string
  description?: string
}

/**
 * 技能信息
 */
export interface Skill {
  id: string
  name: string
  category: string
  level: number
  yearsOfExperience?: number
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
  details?: any
  timestamp: number
}

/**
 * 请求配置选项
 */
export interface RequestOptions {
  timeout?: number
  headers?: Record<string, string>
  params?: any
  data?: any
}

/**
 * 缓存配置
 */
export interface CacheConfig {
  enabled: boolean
  ttl: number // Time to live in milliseconds
  maxSize: number
}

/**
 * 重试配置
 */
export interface RetryConfig {
  enabled: boolean
  maxRetries: number
  retryDelay: number
  retryCondition?: (error: any) => boolean
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

/**
 * 请求统计
 */
export interface RequestStats {
  url: string
  method: string
  duration: number
  status: number
  timestamp: number
}

/**
 * 请求队列
 */
export interface RequestQueue {
  pending: RequestStats[]
  completed: RequestStats[]
  failed: RequestStats[]
}

/**
 * API 模块
 */
export interface ApiModule {
  get: <T>(url: string, config?: RequestOptions) => Promise<T>
  post: <T>(url: string, data?: any, config?: RequestOptions) => Promise<T>
  put: <T>(url: string, data?: any, config?: RequestOptions) => Promise<T>
  delete: <T>(url: string, config?: RequestOptions) => Promise<T>
  patch: <T>(url: string, data?: any, config?: RequestOptions) => Promise<T>
}