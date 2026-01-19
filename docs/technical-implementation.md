# 个人网站项目技术实现细节

**项目名称**：个人网站（前端技能展示平台）
**JavaScript专家**：JavaScript Pro
**实现日期**：2026年1月19日
**项目版本**：v1.0
**状态**：待实现

---

## 📋 执行摘要

本文档提供个人网站项目的完整技术实现细节，包括核心组件、状态管理、路由配置、工具函数和性能优化的JavaScript/TypeScript实现。所有代码遵循现代JavaScript最佳实践，使用ES6+特性、TypeScript类型系统和异步编程模式。

**技术实现重点**：
- Vue 3 Composition API + TypeScript
- Pinia状态管理
- Vue Router 4路由配置
- 性能优化（代码分割、懒加载、虚拟滚动）
- 错误处理和边界情况处理

---

## 1. 类型定义

### 1.1 项目类型定义

```typescript
// src/types/project.ts
export interface Project {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  link?: string
  github?: string
  featured?: boolean
  createdAt: string
  updatedAt: string
}

export interface ProjectFilter {
  category?: string
  searchQuery?: string
}

export interface ProjectDetail extends Project {
  content: string
  techStack: string[]
  challenges: string[]
  solutions: string[]
  results: string[]
  screenshots: string[]
}
```

### 1.2 技能类型定义

```typescript
// src/types/skill.ts
export interface Skill {
  id: string
  name: string
  level: number // 0-100
  category: string
  description?: string
  years?: number
}

export interface SkillCategory {
  name: string
  skills: Skill[]
}

export interface SkillRadarData {
  name: string
  value: number
}
```

### 1.3 博客类型定义

```typescript
// src/types/blog.ts
export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  updatedAt: string
  tags: string[]
  readTime: number // 分钟
  coverImage?: string
}

export interface BlogFilter {
  tag?: string
  searchQuery?: string
}
```

### 1.4 应用类型定义

```typescript
// src/types/app.ts
export type Theme = 'light' | 'dark'
export type Language = 'zh' | 'en'

export interface AppState {
  theme: Theme
  language: Language
  loading: boolean
  menuOpen: boolean
  scrollToTop: boolean
}
```

---

## 2. 状态管理（Pinia）

### 2.1 应用状态管理

```typescript
// src/stores/useAppStore.ts
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Theme, Language, AppState } from '@/types/app'

export const useAppStore = defineStore('app', () => {
  // State
  const theme = ref<Theme>('light')
  const language = ref<Language>('zh')
  const loading = ref(false)
  const menuOpen = ref(false)
  const scrollToTop = ref(false)

  // Initialize from localStorage
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) {
      theme.value = savedTheme
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme.value = 'dark'
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }

  const initLanguage = () => {
    const savedLanguage = localStorage.getItem('language') as Language | null
    if (savedLanguage) {
      language.value = savedLanguage
    }
  }

  // Actions
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme.value === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  const setLanguage = (newLanguage: Language) => {
    language.value = newLanguage
    localStorage.setItem('language', newLanguage)
  }

  const setLoading = (isLoading: boolean) => {
    loading.value = isLoading
  }

  const toggleMenu = () => {
    menuOpen.value = !menuOpen.value
  }

  const closeMenu = () => {
    menuOpen.value = false
  }

  // Watch scroll position
  const handleScroll = () => {
    scrollToTop.value = window.scrollY > 500
  }

  // Initialize
  initTheme()
  initLanguage()
  window.addEventListener('scroll', handleScroll)

  return {
    // State
    theme,
    language,
    loading,
    menuOpen,
    scrollToTop,
    // Actions
    setTheme,
    toggleTheme,
    setLanguage,
    setLoading,
    toggleMenu,
    closeMenu,
    handleScroll
  }
})
```

### 2.2 项目状态管理

```typescript
// src/stores/useProjectStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Project, ProjectFilter, ProjectDetail } from '@/types/project'
import projectsData from '@/assets/data/projects.json'

export const useProjectStore = defineStore('project', () => {
  // State
  const projects = ref<Project[]>(projectsData)
  const selectedCategory = ref<string | null>(null)
  const searchQuery = ref('')
  const currentProject = ref<ProjectDetail | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const filteredProjects = computed(() => {
    let filtered = projects.value

    // Filter by category
    if (selectedCategory.value) {
      filtered = filtered.filter(project =>
        project.tags.includes(selectedCategory.value!)
      )
    }

    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return filtered
  })

  const featuredProjects = computed(() => {
    return projects.value.filter(project => project.featured).slice(0, 3)
  })

  const categories = computed(() => {
    const allTags = projects.value.flatMap(project => project.tags)
    return [...new Set(allTags)]
  })

  // Actions
  const loadProjects = async () => {
    try {
      loading.value = true
      error.value = null
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      projects.value = projectsData
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load projects'
      console.error('Error loading projects:', err)
    } finally {
      loading.value = false
    }
  }

  const loadProjectById = async (id: string) => {
    try {
      loading.value = true
      error.value = null
      await new Promise(resolve => setTimeout(resolve, 300))

      const project = projects.value.find(p => p.id === id)
      if (!project) {
        throw new Error('Project not found')
      }

      // Load project details (simulated)
      const projectDetail: ProjectDetail = {
        ...project,
        content: 'Project content here...',
        techStack: project.tags,
        challenges: ['Challenge 1', 'Challenge 2'],
        solutions: ['Solution 1', 'Solution 2'],
        results: ['Result 1', 'Result 2'],
        screenshots: [project.image]
      }

      currentProject.value = projectDetail
      return projectDetail
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load project'
      console.error('Error loading project:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const filterByCategory = (category: string | null) => {
    selectedCategory.value = category
  }

  const searchProjects = (query: string) => {
    searchQuery.value = query
  }

  const getProjectById = (id: string) => {
    return projects.value.find(p => p.id === id)
  }

  return {
    // State
    projects,
    selectedCategory,
    searchQuery,
    currentProject,
    loading,
    error,
    // Computed
    filteredProjects,
    featuredProjects,
    categories,
    // Actions
    loadProjects,
    loadProjectById,
    filterByCategory,
    searchProjects,
    getProjectById
  }
})
```

### 2.3 技能状态管理

```typescript
// src/stores/useSkillStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Skill, SkillCategory, SkillRadarData } from '@/types/skill'
import skillsData from '@/assets/data/skills.json'

export const useSkillStore = defineStore('skill', () => {
  // State
  const skills = ref<Skill[]>(skillsData)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const skillCategories = computed<SkillCategory[]>(() => {
    const categories = new Map<string, Skill[]>()

    skills.value.forEach(skill => {
      if (!categories.has(skill.category)) {
        categories.set(skill.category, [])
      }
      categories.get(skill.category)!.push(skill)
    })

    return Array.from(categories.entries()).map(([name, skills]) => ({
      name,
      skills
    }))
  })

  const skillRadarData = computed<SkillRadarData[]>(() => {
    return skillCategories.value.map(category => ({
      name: category.name,
      value: Math.round(
        category.skills.reduce((sum, skill) => sum + skill.level, 0) / category.skills.length
      )
    }))
  })

  const allCategories = computed(() => {
    return [...new Set(skills.value.map(skill => skill.category))]
  })

  // Actions
  const loadSkills = async () => {
    try {
      loading.value = true
      error.value = null
      await new Promise(resolve => setTimeout(resolve, 300))
      skills.value = skillsData
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load skills'
      console.error('Error loading skills:', err)
    } finally {
      loading.value = false
    }
  }

  const getSkillsByCategory = (category: string) => {
    return skills.value.filter(skill => skill.category === category)
  }

  const getSkillById = (id: string) => {
    return skills.value.find(skill => skill.id === id)
  }

  return {
    // State
    skills,
    loading,
    error,
    // Computed
    skillCategories,
    skillRadarData,
    allCategories,
    // Actions
    loadSkills,
    getSkillsByCategory,
    getSkillById
  }
})
```

### 2.4 博客状态管理

```typescript
// src/stores/useBlogStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BlogPost, BlogFilter } from '@/types/blog'
import blogIndex from '@/assets/data/blog-index.json'

export const useBlogStore = defineStore('blog', () => {
  // State
  const posts = ref<BlogPost[]>(blogIndex)
  const selectedTag = ref<string | null>(null)
  const searchQuery = ref('')
  const currentPost = ref<BlogPost | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const filteredPosts = computed(() => {
    let filtered = posts.value

    // Filter by tag
    if (selectedTag.value) {
      filtered = filtered.filter(post =>
        post.tags.includes(selectedTag.value!)
      )
    }

    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return filtered
  })

  const allTags = computed(() => {
    const allTags = posts.value.flatMap(post => post.tags)
    return [...new Set(allTags)]
  })

  const recentPosts = computed(() => {
    return [...posts.value]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 5)
  })

  // Actions
  const loadPosts = async () => {
    try {
      loading.value = true
      error.value = null
      await new Promise(resolve => setTimeout(resolve, 300))
      posts.value = blogIndex
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load posts'
      console.error('Error loading posts:', err)
    } finally {
      loading.value = false
    }
  }

  const loadPostById = async (id: string) => {
    try {
      loading.value = true
      error.value = null
      await new Promise(resolve => setTimeout(resolve, 300))

      const post = posts.value.find(p => p.id === id)
      if (!post) {
        throw new Error('Post not found')
      }

      // Load post content (simulated)
      currentPost.value = post
      return post
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load post'
      console.error('Error loading post:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const filterByTag = (tag: string | null) => {
    selectedTag.value = tag
  }

  const searchPosts = (query: string) => {
    searchQuery.value = query
  }

  const getPostById = (id: string) => {
    return posts.value.find(p => p.id === id)
  }

  return {
    // State
    posts,
    selectedTag,
    searchQuery,
    currentPost,
    loading,
    error,
    // Computed
    filteredPosts,
    allTags,
    recentPosts,
    // Actions
    loadPosts,
    loadPostById,
    filterByTag,
    searchPosts,
    getPostById
  }
})
```

---

## 3. 路由配置

```typescript
// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAppStore } from '@/stores/useAppStore'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首页',
      description: '佘杰 - 前端开发工程师个人网站'
    }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('@/views/Projects.vue'),
    meta: {
      title: '项目展示',
      description: '我的项目作品集'
    }
  },
  {
    path: '/projects/:id',
    name: 'ProjectDetail',
    component: () => import('@/views/ProjectDetail.vue'),
    meta: {
      title: '项目详情',
      description: '项目详细信息'
    },
    props: true
  },
  {
    path: '/skills',
    name: 'Skills',
    component: () => import('@/views/Skills.vue'),
    meta: {
      title: '技能展示',
      description: '我的技术栈和技能'
    }
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('@/views/Blog.vue'),
    meta: {
      title: '技术博客',
      description: '我的技术文章'
    }
  },
  {
    path: '/blog/:id',
    name: 'BlogDetail',
    component: () => import('@/views/BlogDetail.vue'),
    meta: {
      title: '文章详情',
      description: '技术文章详情'
    },
    props: true
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/Contact.vue'),
    meta: {
      title: '联系方式',
      description: '联系我'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '404',
      description: '页面未找到'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// Global navigation guards
router.beforeEach((to, from, next) => {
  // Set page title
  const appStore = useAppStore()
  document.title = `${to.meta.title as string} - 佘杰`

  // Update meta tags
  updateMetaTags(to.meta as RouteMeta)

  // Close mobile menu
  appStore.closeMenu()

  next()
})

/**
 * Update meta tags for SEO
 */
function updateMetaTags(meta: RouteMeta) {
  // Set description
  const description = meta.description as string
  if (description) {
    const metaTag = document.querySelector('meta[name="description"]')
    if (metaTag) {
      metaTag.setAttribute('content', description)
    }
  }

  // Set Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle) {
    ogTitle.setAttribute('content', `${meta.title as string} - 佘杰`)
  }

  const ogDescription = document.querySelector('meta[property="og:description"]')
  if (ogDescription && description) {
    ogDescription.setAttribute('content', description)
  }
}

export default router
```

---

## 4. 组合式函数（Composables）

### 4.1 主题管理

```typescript
// src/composables/useTheme.ts
import { computed } from 'vue'
import { useAppStore } from '@/stores/useAppStore'

export function useTheme() {
  const appStore = useAppStore()

  const theme = computed(() => appStore.theme)
  const isDark = computed(() => appStore.theme === 'dark')

  const setTheme = (newTheme: 'light' | 'dark') => {
    appStore.setTheme(newTheme)
  }

  const toggleTheme = () => {
    appStore.toggleTheme()
  }

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme
  }
}
```

### 4.2 滚动管理

```typescript
// src/composables/useScroll.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useScroll() {
  const scrollY = ref(0)
  const isScrolled = ref(false)

  const handleScroll = () => {
    scrollY.value = window.scrollY
    isScrolled.value = window.scrollY > 50
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const scrollToElement = (selector: string, offset = 0) => {
    const element = document.querySelector(selector)
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({
        top,
        behavior: 'smooth'
      })
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    scrollY,
    isScrolled,
    scrollToTop,
    scrollToElement
  }
}
```

### 4.3 交叉观察器

```typescript
// src/composables/useIntersectionObserver.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useIntersectionObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
) {
  const target = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  const observe = (element: HTMLElement) => {
    target.value = element
    observer = new IntersectionObserver(callback, options)
    observer.observe(element)
  }

  const unobserve = () => {
    if (observer && target.value) {
      observer.unobserve(target.value)
      observer.disconnect()
      observer = null
    }
  }

  onUnmounted(() => {
    unobserve()
  })

  return {
    target,
    observe,
    unobserve
  }
}
```

### 4.4 防抖和节流

```typescript
// src/composables/useDebounce.ts
import { ref, watch } from 'vue'

export function useDebounce<T>(value: Ref<T>, delay: number = 300) {
  const debouncedValue = ref<T>(value.value)
  let timeout: ReturnType<typeof setTimeout> | null = null

  watch(
    value,
    (newValue) => {
      if (timeout) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(() => {
        debouncedValue.value = newValue
      }, delay)
    },
    { immediate: true }
  )

  return debouncedValue
}
```

```typescript
// src/composables/useThrottle.ts
import { ref, watch } from 'vue'

export function useThrottle<T>(value: Ref<T>, delay: number = 300) {
  const throttledValue = ref<T>(value.value)
  let lastTime = 0
  let timeout: ReturnType<typeof setTimeout> | null = null

  watch(
    value,
    (newValue) => {
      const now = Date.now()
      const remaining = delay - (now - lastTime)

      if (remaining <= 0) {
        if (timeout) {
          clearTimeout(timeout)
          timeout = null
        }
        lastTime = now
        throttledValue.value = newValue
      } else if (!timeout) {
        timeout = setTimeout(() => {
          lastTime = Date.now()
          timeout = null
          throttledValue.value = newValue
        }, remaining)
      }
    },
    { immediate: true }
  )

  return throttledValue
}
```

---

## 5. 工具函数

### 5.1 格式化函数

```typescript
// src/utils/format.ts
/**
 * Format date to readable string
 */
export function formatDate(date: string | Date, locale: string = 'zh-CN'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Format date to relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: string | Date, locale: string = 'zh-CN'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  const intervals = [
    { unit: 'year' as const, seconds: 31536000 },
    { unit: 'month' as const, seconds: 2592000 },
    { unit: 'day' as const, seconds: 86400 },
    { unit: 'hour' as const, seconds: 3600 },
    { unit: 'minute' as const, seconds: 60 }
  ]

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds)
    if (count >= 1) {
      return rtf.format(-count, interval.unit)
    }
  }

  return rtf.format(-diffInSeconds, 'second')
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString()
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}
```

### 5.2 验证函数

```typescript
// src/utils/validate.ts
/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate phone number (Chinese)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * Validate required field
 */
export function isRequired(value: string): boolean {
  return value.trim().length > 0
}

/**
 * Validate minimum length
 */
export function minLength(value: string, min: number): boolean {
  return value.length >= min
}

/**
 * Validate maximum length
 */
export function maxLength(value: string, max: number): boolean {
  return value.length <= max
}
```

### 5.3 SEO工具

```typescript
// src/utils/seo.ts
/**
 * Update page title
 */
export function setPageTitle(title: string) {
  document.title = `${title} - 佘杰`
}

/**
 * Update meta description
 */
export function setMetaDescription(description: string) {
  const metaTag = document.querySelector('meta[name="description"]')
  if (metaTag) {
    metaTag.setAttribute('content', description)
  }
}

/**
 * Update Open Graph tags
 */
export function setOpenGraphTags(title: string, description: string, image?: string) {
  const ogTitle = document.querySelector('meta[property="og:title"]')
  if (ogTitle) {
    ogTitle.setAttribute('content', title)
  }

  const ogDescription = document.querySelector('meta[property="og:description"]')
  if (ogDescription) {
    ogDescription.setAttribute('content', description)
  }

  const ogImage = document.querySelector('meta[property="og:image"]')
  if (ogImage && image) {
    ogImage.setAttribute('content', image)
  }
}

/**
 * Add structured data (JSON-LD)
 */
export function addStructuredData(data: Record<string, unknown>) {
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.text = JSON.stringify(data)
  document.head.appendChild(script)
}
```

### 5.4 本地存储工具

```typescript
// src/utils/storage.ts
/**
 * Get item from localStorage
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

/**
 * Set item to localStorage
 */
export function setLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

/**
 * Remove item from localStorage
 */
export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing from localStorage:', error)
  }
}

/**
 * Clear all localStorage
 */
export function clearLocalStorage(): void {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('Error clearing localStorage:', error)
  }
}
```

---

## 6. 性能优化

### 6.1 图片懒加载

```typescript
// src/utils/lazyLoad.ts
/**
 * Lazy load images
 */
export function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]')

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        const src = img.dataset.src

        if (src) {
          img.src = src
          img.removeAttribute('data-src')
          observer.unobserve(img)
        }
      }
    })
  })

  images.forEach(img => imageObserver.observe(img))
}
```

### 6.2 虚拟滚动

```typescript
// src/utils/virtualScroll.ts
/**
 * Virtual scroll for long lists
 */
export function createVirtualScroll(
  container: HTMLElement,
  itemHeight: number,
  renderItem: (index: number) => HTMLElement
) {
  const state = {
    scrollTop: 0,
    viewportHeight: container.clientHeight,
    totalItems: 0,
    visibleStart: 0,
    visibleEnd: 0
  }

  const updateVisibleRange = () => {
    state.visibleStart = Math.floor(state.scrollTop / itemHeight)
    state.visibleEnd = Math.ceil((state.scrollTop + state.viewportHeight) / itemHeight)
  }

  const render = () => {
    updateVisibleRange()

    // Clear container
    container.innerHTML = ''

    // Render visible items
    for (let i = state.visibleStart; i < state.visibleEnd; i++) {
      if (i < state.totalItems) {
        const item = renderItem(i)
        item.style.position = 'absolute'
        item.style.top = `${i * itemHeight}px`
        container.appendChild(item)
      }
    }

    // Set container height
    container.style.height = `${state.totalItems * itemHeight}px`
  }

  const setTotalItems = (count: number) => {
    state.totalItems = count
    render()
  }

  const handleScroll = () => {
    state.scrollTop = container.scrollTop
    render()
  }

  container.addEventListener('scroll', handleScroll)

  return {
    setTotalItems,
    render,
    destroy: () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }
}
```

### 6.3 代码分割

```typescript
// src/utils/codeSplit.ts
/**
 * Lazy load component
 */
export function lazyLoad<T>(
  importFn: () => Promise<{ default: T }>,
  fallback?: () => HTMLElement
) {
  return defineAsyncComponent({
    loader: importFn,
    loadingComponent: fallback ? { render: fallback } : undefined,
    delay: 200,
    timeout: 3000
  })
}
```

---

## 7. 错误处理

### 7.1 全局错误处理

```typescript
// src/utils/errorHandler.ts
/**
 * Global error handler
 */
export function setupErrorHandler() {
  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
    // Send error to logging service
  })

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    // Send error to logging service
  })
}

/**
 * Handle API errors
 */
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  } else if (typeof error === 'string') {
    return error
  } else {
    return 'An unknown error occurred'
  }
}
```

---

## 8. 示例数据

### 8.1 项目数据

```json
// src/assets/data/projects.json
[
  {
    "id": "1",
    "title": "Vue 3 企业级管理系统",
    "description": "基于Vue 3 + TypeScript + Vite的现代化企业级管理系统，包含用户管理、权限控制、数据可视化等功能。",
    "image": "/images/projects/project1.jpg",
    "tags": ["Vue 3", "TypeScript", "Vite", "Pinia", "Element Plus"],
    "link": "https://example.com/project1",
    "github": "https://github.com/username/project1",
    "featured": true,
    "createdAt": "2024-01-01",
    "updatedAt": "2024-01-15"
  },
  {
    "id": "2",
    "title": "React 18 电商后台",
    "description": "使用React 18 + Redux Toolkit + Ant Design构建的电商后台管理系统，支持多商家、多店铺管理。",
    "image": "/images/projects/project2.jpg",
    "tags": ["React 18", "Redux Toolkit", "Ant Design", "TypeScript"],
    "link": "https://example.com/project2",
    "github": "https://github.com/username/project2",
    "featured": true,
    "createdAt": "2024-02-01",
    "updatedAt": "2024-02-20"
  },
  {
    "id": "3",
    "title": "Next.js 14 博客平台",
    "description": "基于Next.js 14 App Router的现代化博客平台，支持Markdown渲染、代码高亮、SEO优化等功能。",
    "image": "/images/projects/project3.jpg",
    "tags": ["Next.js 14", "React 18", "TypeScript", "Tailwind CSS"],
    "link": "https://example.com/project3",
    "github": "https://github.com/username/project3",
    "featured": true,
    "createdAt": "2024-03-01",
    "updatedAt": "2024-03-10"
  }
]
```

### 8.2 技能数据

```json
// src/assets/data/skills.json
[
  {
    "id": "1",
    "name": "Vue 3",
    "level": 95,
    "category": "前端框架",
    "description": "熟练掌握Vue 3 Composition API、响应式原理、性能优化",
    "years": 5
  },
  {
    "id": "2",
    "name": "React 18",
    "level": 85,
    "category": "前端框架",
    "description": "熟悉React Hooks、Redux Toolkit、Next.js",
    "years": 3
  },
  {
    "id": "3",
    "name": "TypeScript",
    "level": 90,
    "category": "语言",
    "description": "熟练使用TypeScript进行类型安全开发",
    "years": 4
  },
  {
    "id": "4",
    "name": "Vite",
    "level": 90,
    "category": "工具链",
    "description": "熟练使用Vite进行项目构建和开发",
    "years": 3
  },
  {
    "id": "5",
    "name": "Pinia",
    "level": 90,
    "category": "状态管理",
    "description": "熟练使用Pinia进行状态管理",
    "years": 3
  },
  {
    "id": "6",
    "name": "Tailwind CSS",
    "level": 85,
    "category": "CSS",
    "description": "熟练使用Tailwind CSS进行快速开发",
    "years": 2
  }
]
```

### 8.3 博客索引

```json
// src/assets/data/blog-index.json
[
  {
    "id": "1",
    "title": "Vue 3 Composition API 深度解析",
    "excerpt": "深入理解Vue 3 Composition API的设计理念和使用方法，包括响应式原理、组合式函数、依赖注入等核心概念。",
    "content": "文章内容...",
    "author": "佘杰",
    "publishedAt": "2024-01-15",
    "updatedAt": "2024-01-15",
    "tags": ["Vue 3", "Composition API", "前端"],
    "readTime": 10,
    "coverImage": "/images/blog/blog1.jpg"
  },
  {
    "id": "2",
    "title": "TypeScript 高级类型实战",
    "excerpt": "探索TypeScript的高级类型系统，包括泛型、条件类型、映射类型等，提升代码的类型安全性。",
    "content": "文章内容...",
    "author": "佘杰",
    "publishedAt": "2024-02-10",
    "updatedAt": "2024-02-10",
    "tags": ["TypeScript", "类型系统", "前端"],
    "readTime": 15,
    "coverImage": "/images/blog/blog2.jpg"
  }
]
```

---

## 9. 最佳实践

### 9.1 代码规范

- 使用TypeScript严格模式
- 遵循ESLint和Prettier规则
- 使用有意义的变量和函数名
- 添加JSDoc注释
- 保持函数单一职责

### 9.2 性能优化

- 使用代码分割和懒加载
- 优化图片加载（WebP、懒加载）
- 使用虚拟滚动处理长列表
- 防抖和节流处理频繁事件
- 使用computed缓存计算结果

### 9.3 错误处理

- 使用try-catch捕获错误
- 提供友好的错误提示
- 记录错误日志
- 实现错误边界

### 9.4 可访问性

- 使用语义化HTML
- 添加ARIA标签
- 支持键盘导航
- 确保颜色对比度符合标准

---

## 10. 下一步行动

1. **创建项目基础结构**
2. **实现核心组件**
3. **配置工程化工具**
4. **实现性能优化**
5. **进行测试验证**

---

**技术实现结束**

**下一步**：等待前端设计专家实现视觉设计