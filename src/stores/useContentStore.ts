import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BlogPost } from '@/types/blog'
import type { Project, WorkExperience, Education, Skill } from '@/types/project'
import type { SiteConfig, PaginationParams } from '@/types/common'
import { cmsApi } from '@/api/cms'

/**
 * Content Store
 * 管理内容数据，如博客、项目、工作经历等
 */
export const useContentStore = defineStore('content', () => {
  // ==================== 状态 ====================

  /**
   * 博客文章列表
   */
  const blogPosts = ref<BlogPost[]>([])

  /**
   * 当前博客文章
   */
  const currentBlogPost = ref<BlogPost | null>(null)

  /**
   * 博客文章加载状态
   */
  const blogPostsLoading = ref<boolean>(false)

  /**
   * 博客文章错误信息
   */
  const blogPostsError = ref<string | null>(null)

  /**
   * 项目列表
   */
  const projects = ref<Project[]>([])

  /**
   * 当前项目
   */
  const currentProject = ref<Project | null>(null)

  /**
   * 精选项目列表
   */
  const featuredProjects = ref<Project[]>([])

  /**
   * 项目加载状态
   */
  const projectsLoading = ref<boolean>(false)

  /**
   * 项目错误信息
   */
  const projectsError = ref<string | null>(null)

  /**
   * 工作经历列表
   */
  const workExperience = ref<WorkExperience[]>([])

  /**
   * 教育背景列表
   */
  const education = ref<Education[]>([])

  /**
   * 技能列表
   */
  const skills = ref<Skill[]>([])

  /**
   * 网站配置
   */
  const siteConfig = ref<SiteConfig | null>(null)

  /**
   * 内容最后更新时间
   */
  const lastUpdated = ref<Date | null>(null)

  /**
   * 是否从缓存加载
   */
  const isFromCache = ref<boolean>(false)

  // ==================== 计算属性 ====================

  /**
   * 博客文章总数
   */
  const blogPostsCount = computed(() => blogPosts.value.length)

  /**
   * 项目总数
   */
  const projectsCount = computed(() => projects.value.length)

  /**
   * 精选项目数量
   */
  const featuredProjectsCount = computed(() => featuredProjects.value.length)

  /**
   * 最新博客文章（前 3 篇）
   */
  const latestBlogPosts = computed(() =>
    blogPosts.value.slice(0, 3)
  )

  /**
   * 是否有内容数据
   */
  const hasContent = computed(
    () =>
      blogPosts.value.length > 0 ||
      projects.value.length > 0 ||
      workExperience.value.length > 0 ||
      education.value.length > 0 ||
      skills.value.length > 0
  )

  /**
   * 博客分类列表
   */
  const blogCategories = computed(() => {
    const categories = new Set<string>()
    blogPosts.value.forEach((post) => {
      if (post.category) categories.add(post.category)
    })
    return Array.from(categories)
  })

  /**
   * 项目技术标签列表
   */
  const projectTechnologies = computed(() => {
    const technologies = new Set<string>()
    projects.value.forEach((project) => {
      project.technologies.forEach((tech) => technologies.add(tech))
    })
    return Array.from(technologies)
  })

  // ==================== 方法 ====================

  // ==================== 博客 ====================

  /**
   * 加载博客文章列表
   */
  async function loadBlogPosts(params?: PaginationParams & {
    category?: string
    tags?: string[]
    search?: string
  }) {
    blogPostsLoading.value = true
    blogPostsError.value = null

    try {
      const response = await cmsApi.getBlogPosts(params)
      blogPosts.value = response.data.items
      lastUpdated.value = new Date()
    } catch (error) {
      console.error('Failed to load blog posts:', error)
      blogPostsError.value = '加载博客文章失败'
    } finally {
      blogPostsLoading.value = false
    }
  }

  /**
   * 根据 slug 加载博客文章
   */
  async function loadBlogPostBySlug(slug: string) {
    blogPostsLoading.value = true
    blogPostsError.value = null

    try {
      const response = await cmsApi.getBlogPostBySlug(slug)
      currentBlogPost.value = response.data
      return response.data
    } catch (error) {
      console.error('Failed to load blog post:', error)
      blogPostsError.value = '加载博客文章失败'
      currentBlogPost.value = null
      return null
    } finally {
      blogPostsLoading.value = false
    }
  }

  /**
   * 根据 ID 加载博客文章
   */
  async function loadBlogPostById(id: string) {
    blogPostsLoading.value = true
    blogPostsError.value = null

    try {
      const response = await cmsApi.getBlogPostById(id)
      currentBlogPost.value = response.data
      return response.data
    } catch (error) {
      console.error('Failed to load blog post:', error)
      blogPostsError.value = '加载博客文章失败'
      currentBlogPost.value = null
      return null
    } finally {
      blogPostsLoading.value = false
    }
  }

  /**
   * 获取相关博客文章
   */
  async function loadRelatedBlogPosts(postId: string, limit: number = 3) {
    try {
      const response = await cmsApi.getRelatedBlogPosts(postId, limit)
      return response.data
    } catch (error) {
      console.error('Failed to load related blog posts:', error)
      return []
    }
  }

  /**
   * 设置博客文章列表（用于缓存或初始化）
   */
  function setBlogPosts(posts: BlogPost[]) {
    blogPosts.value = posts
    lastUpdated.value = new Date()
  }

  /**
   * 添加博客文章
   */
  function addBlogPost(post: BlogPost) {
    blogPosts.value.unshift(post)
    lastUpdated.value = new Date()
  }

  /**
   * 更新博客文章
   */
  function updateBlogPost(id: string, updates: Partial<BlogPost>) {
    const index = blogPosts.value.findIndex((p) => p.id === id)
    if (index !== -1) {
      blogPosts.value[index] = { ...blogPosts.value[index], ...updates }
      lastUpdated.value = new Date()
    }
  }

  /**
   * 删除博客文章
   */
  function removeBlogPost(id: string) {
    const index = blogPosts.value.findIndex((p) => p.id === id)
    if (index !== -1) {
      blogPosts.value.splice(index, 1)
      lastUpdated.value = new Date()
    }
  }

  // ==================== 项目 ====================

  /**
   * 加载项目列表
   */
  async function loadProjects(params?: PaginationParams & {
    featured?: boolean
    technology?: string
    search?: string
  }) {
    projectsLoading.value = true
    projectsError.value = null

    try {
      const response = await cmsApi.getProjects(params)
      projects.value = response.data.items
      lastUpdated.value = new Date()
    } catch (error) {
      console.error('Failed to load projects:', error)
      projectsError.value = '加载项目失败'
    } finally {
      projectsLoading.value = false
    }
  }

  /**
   * 加载精选项目
   */
  async function loadFeaturedProjects(limit: number = 6) {
    projectsLoading.value = true
    projectsError.value = null

    try {
      const response = await cmsApi.getFeaturedProjects(limit)
      featuredProjects.value = response.data
      lastUpdated.value = new Date()
    } catch (error) {
      console.error('Failed to load featured projects:', error)
      projectsError.value = '加载精选项目失败'
    } finally {
      projectsLoading.value = false
    }
  }

  /**
   * 根据 slug 加载项目
   */
  async function loadProjectBySlug(slug: string) {
    projectsLoading.value = true
    projectsError.value = null

    try {
      const response = await cmsApi.getProjectBySlug(slug)
      currentProject.value = response.data
      return response.data
    } catch (error) {
      console.error('Failed to load project:', error)
      projectsError.value = '加载项目失败'
      currentProject.value = null
      return null
    } finally {
      projectsLoading.value = false
    }
  }

  /**
   * 根据 ID 加载项目
   */
  async function loadProjectById(id: string) {
    projectsLoading.value = true
    projectsError.value = null

    try {
      const response = await cmsApi.getProjectById(id)
      currentProject.value = response.data
      return response.data
    } catch (error) {
      console.error('Failed to load project:', error)
      projectsError.value = '加载项目失败'
      currentProject.value = null
      return null
    } finally {
      projectsLoading.value = false
    }
  }

  /**
   * 设置项目列表（用于缓存或初始化）
   */
  function setProjects(projectsList: Project[]) {
    projects.value = projectsList
    lastUpdated.value = new Date()
  }

  /**
   * 添加项目
   */
  function addProject(project: Project) {
    projects.value.unshift(project)
    lastUpdated.value = new Date()
  }

  /**
   * 更新项目
   */
  function updateProject(id: string, updates: Partial<Project>) {
    const index = projects.value.findIndex((p) => p.id === id)
    if (index !== -1) {
      projects.value[index] = { ...projects.value[index], ...updates }
      lastUpdated.value = new Date()
    }
  }

  /**
   * 删除项目
   */
  function removeProject(id: string) {
    const index = projects.value.findIndex((p) => p.id === id)
    if (index !== -1) {
      projects.value.splice(index, 1)
      lastUpdated.value = new Date()
    }
  }

  // ==================== 其他内容 ====================

  /**
   * 加载工作经历
   */
  async function loadWorkExperience() {
    try {
      const response = await cmsApi.getWorkExperience()
      workExperience.value = response.data
      lastUpdated.value = new Date()
    } catch (error) {
      console.error('Failed to load work experience:', error)
    }
  }

  /**
   * 加载教育背景
   */
  async function loadEducation() {
    try {
      const response = await cmsApi.getEducation()
      education.value = response.data
      lastUpdated.value = new Date()
    } catch (error) {
      console.error('Failed to load education:', error)
    }
  }

  /**
   * 加载技能列表
   */
  async function loadSkills() {
    try {
      const response = await cmsApi.getSkills()
      skills.value = response.data
      lastUpdated.value = new Date()
    } catch (error) {
      console.error('Failed to load skills:', error)
    }
  }

  /**
   * 加载网站配置
   */
  async function loadSiteConfig() {
    try {
      const response = await cmsApi.getSiteConfig()
      siteConfig.value = response.data
      lastUpdated.value = new Date()
    } catch (error) {
      console.error('Failed to load site config:', error)
    }
  }

  /**
   * 加载所有内容
   */
  async function loadAllContent() {
    await Promise.all([
      loadBlogPosts(),
      loadProjects(),
      loadFeaturedProjects(),
      loadWorkExperience(),
      loadEducation(),
      loadSkills(),
      loadSiteConfig(),
    ])
  }

  /**
   * 刷新内容
   */
  async function refreshContent() {
    isFromCache.value = false
    await loadAllContent()
  }

  /**
   * 从缓存加载内容
   */
  function loadFromCache() {
    try {
      const data = localStorage.getItem('content_cache')
      if (data) {
        const parsed = JSON.parse(data)
        if (parsed.blogPosts) blogPosts.value = parsed.blogPosts
        if (parsed.projects) projects.value = parsed.projects
        if (parsed.featuredProjects) featuredProjects.value = parsed.featuredProjects
        if (parsed.workExperience) workExperience.value = parsed.workExperience
        if (parsed.education) education.value = parsed.education
        if (parsed.skills) skills.value = parsed.skills
        if (parsed.siteConfig) siteConfig.value = parsed.siteConfig
        if (parsed.lastUpdated) lastUpdated.value = new Date(parsed.lastUpdated)
        isFromCache.value = true
      }
    } catch (error) {
      console.error('Failed to load content from cache:', error)
    }
  }

  /**
   * 保存到缓存
   */
  function saveToCache() {
    try {
      const data = {
        blogPosts: blogPosts.value,
        projects: projects.value,
        featuredProjects: featuredProjects.value,
        workExperience: workExperience.value,
        education: education.value,
        skills: skills.value,
        siteConfig: siteConfig.value,
        lastUpdated: lastUpdated.value?.toISOString(),
      }
      localStorage.setItem('content_cache', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save content to cache:', error)
    }
  }

  /**
   * 清除缓存
   */
  function clearCache() {
    localStorage.removeItem('content_cache')
    isFromCache.value = false
  }

  /**
   * 重置所有内容
   */
  function resetContent() {
    blogPosts.value = []
    currentBlogPost.value = null
    projects.value = []
    currentProject.value = null
    featuredProjects.value = []
    workExperience.value = []
    education.value = []
    skills.value = []
    siteConfig.value = null
    lastUpdated.value = null
    isFromCache.value = false
    clearCache()
  }

  // ==================== 初始化 ====================

  // 尝试从缓存加载内容
  loadFromCache()

  // 返回接口
  return {
    // 状态
    blogPosts,
    currentBlogPost,
    blogPostsLoading,
    blogPostsError,
    projects,
    currentProject,
    featuredProjects,
    projectsLoading,
    projectsError,
    workExperience,
    education,
    skills,
    siteConfig,
    lastUpdated,
    isFromCache,

    // 计算属性
    blogPostsCount,
    projectsCount,
    featuredProjectsCount,
    latestBlogPosts,
    hasContent,
    blogCategories,
    projectTechnologies,

    // 方法 - 博客
    loadBlogPosts,
    loadBlogPostBySlug,
    loadBlogPostById,
    loadRelatedBlogPosts,
    setBlogPosts,
    addBlogPost,
    updateBlogPost,
    removeBlogPost,

    // 方法 - 项目
    loadProjects,
    loadFeaturedProjects,
    loadProjectBySlug,
    loadProjectById,
    setProjects,
    addProject,
    updateProject,
    removeProject,

    // 方法 - 其他内容
    loadWorkExperience,
    loadEducation,
    loadSkills,
    loadSiteConfig,
    loadAllContent,
    refreshContent,

    // 方法 - 缓存
    loadFromCache,
    saveToCache,
    clearCache,

    // 方法 - 重置
    resetContent,
  }
})