/**
 * API 类型定义
 * 仅包含 API 相关的通用类型
 * 业务实体类型请使用 @/types/
 */

// 重新导出通用类型，方便使用
export type {
  ApiResponse,
  PaginationParams,
  PaginatedResponse,
  SiteConfig,
  UserPreferences,
  ApiError,
  RequestOptions,
  CacheConfig,
  RetryConfig,
  ApiClientConfig,
} from '@/types/common'

// 重新导出业务实体类型，保持向后兼容
export type {
  Project,
  ProjectDetail,
  ProjectFilter,
  TechStack,
  ContactInfo,
  ContactFormData,
  SocialLink,
  PersonalInfo,
  WorkExperience,
  Education,
  Skill,
  SkillCategory,
  SkillRadarData,
} from '@/types/project'

export type { BlogPost, BlogFilter } from '@/types/blog'

/**
 * 分析事件
 */
export interface AnalyticsEvent {
  name: string
  properties?: Record<string, unknown>
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
 * 联系表单响应
 */
export interface ContactFormResponse {
  success: boolean
  message: string
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
 * API 模块接口
 */
export interface ApiModule {
  get: <T>(url: string, config?: RequestOptions) => Promise<T>
  post: <T>(url: string, data?: unknown, config?: RequestOptions) => Promise<T>
  put: <T>(url: string, data?: unknown, config?: RequestOptions) => Promise<T>
  delete: <T>(url: string, config?: RequestOptions) => Promise<T>
  patch: <T>(url: string, data?: unknown, config?: RequestOptions) => Promise<T>
}
