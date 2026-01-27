/**
 * CMS API
 * 用于从 CMS 获取内容数据
 */

import { get, post, put, del } from './index'
import type {
  ApiResponse,
  PaginatedResponse,
  BlogPost,
  Project,
  ContactFormData,
  ContactFormResponse,
  PaginationParams,
} from './types'

/**
 * CMS 服务类
 */
export class CmsApi {
  private static instance: CmsApi

  private constructor() {}

  static getInstance(): CmsApi {
    if (!CmsApi.instance) {
      CmsApi.instance = new CmsApi()
    }
    return CmsApi.instance
  }

  // ==================== 博客文章 ====================

  /**
   * 获取博客文章列表
   */
  async getBlogPosts(params?: PaginationParams & {
    category?: string
    tags?: string[]
    search?: string
  }): Promise<ApiResponse<PaginatedResponse<BlogPost>>> {
    return await get<ApiResponse<PaginatedResponse<BlogPost>>>(
      '/api/cms/blog/posts',
      { params }
    )
  }

  /**
   * 根据 slug 获取博客文章
   */
  async getBlogPostBySlug(slug: string): Promise<ApiResponse<BlogPost>> {
    return await get<ApiResponse<BlogPost>>(`/api/cms/blog/posts/${slug}`)
  }

  /**
   * 根据 ID 获取博客文章
   */
  async getBlogPostById(id: string): Promise<ApiResponse<BlogPost>> {
    return await get<ApiResponse<BlogPost>>(`/api/cms/blog/posts/id/${id}`)
  }

  /**
   * 获取相关博客文章
   */
  async getRelatedBlogPosts(
    postId: string,
    limit: number = 3
  ): Promise<ApiResponse<BlogPost[]>> {
    return await get<ApiResponse<BlogPost[]>>(
      `/api/cms/blog/posts/${postId}/related`,
      { params: { limit } }
    )
  }

  // ==================== 项目 ====================

  /**
   * 获取项目列表
   */
  async getProjects(params?: PaginationParams & {
    featured?: boolean
    technology?: string
    search?: string
  }): Promise<ApiResponse<PaginatedResponse<Project>>> {
    return await get<ApiResponse<PaginatedResponse<Project>>>(
      '/api/cms/projects',
      { params }
    )
  }

  /**
   * 根据 slug 获取项目
   */
  async getProjectBySlug(slug: string): Promise<ApiResponse<Project>> {
    return await get<ApiResponse<Project>>(`/api/cms/projects/${slug}`)
  }

  /**
   * 根据 ID 获取项目
   */
  async getProjectById(id: string): Promise<ApiResponse<Project>> {
    return await get<ApiResponse<Project>>(`/api/cms/projects/id/${id}`)
  }

  /**
   * 获取精选项目
   */
  async getFeaturedProjects(limit: number = 6): Promise<ApiResponse<Project[]>> {
    return await get<ApiResponse<Project[]>>(
      '/api/cms/projects/featured',
      { params: { limit } }
    )
  }

  // ==================== 联系表单 ====================

  /**
   * 提交联系表单
   */
  async submitContactForm(data: ContactFormData): Promise<ApiResponse<ContactFormResponse>> {
    return await post<ApiResponse<ContactFormResponse>>('/api/cms/contact', data)
  }

  // ==================== 其他内容 ====================

  /**
   * 获取网站配置
   */
  async getSiteConfig(): Promise<ApiResponse<any>> {
    return await get<ApiResponse<any>>('/api/cms/config')
  }

  /**
   * 获取技能列表
   */
  async getSkills(): Promise<ApiResponse<any[]>> {
    return await get<ApiResponse<any[]>>('/api/cms/skills')
  }

  /**
   * 获取工作经历
   */
  async getWorkExperience(): Promise<ApiResponse<any[]>> {
    return await get<ApiResponse<any[]>>('/api/cms/experience')
  }

  /**
   * 获取教育背景
   */
  async getEducation(): Promise<ApiResponse<any[]>> {
    return await get<ApiResponse<any[]>>('/api/cms/education')
  }
}

/**
 * 导出单例实例
 */
export const cmsApi = CmsApi.getInstance()

/**
 * 导出便捷方法 - 博客
 */
export const getBlogPosts = (params?: any) => cmsApi.getBlogPosts(params)
export const getBlogPostBySlug = (slug: string) => cmsApi.getBlogPostBySlug(slug)
export const getBlogPostById = (id: string) => cmsApi.getBlogPostById(id)
export const getRelatedBlogPosts = (postId: string, limit?: number) =>
  cmsApi.getRelatedBlogPosts(postId, limit)

/**
 * 导出便捷方法 - 项目
 */
export const getProjects = (params?: any) => cmsApi.getProjects(params)
export const getProjectBySlug = (slug: string) => cmsApi.getProjectBySlug(slug)
export const getProjectById = (id: string) => cmsApi.getProjectById(id)
export const getFeaturedProjects = (limit?: number) => cmsApi.getFeaturedProjects(limit)

/**
 * 导出便捷方法 - 联系
 */
export const submitContactForm = (data: ContactFormData) => cmsApi.submitContactForm(data)

/**
 * 导出便捷方法 - 其他
 */
export const getSiteConfig = () => cmsApi.getSiteConfig()
export const getSkills = () => cmsApi.getSkills()
export const getWorkExperience = () => cmsApi.getWorkExperience()
export const getEducation = () => cmsApi.getEducation()