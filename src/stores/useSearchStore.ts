import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 搜索结果项
 */
export interface SearchResultItem {
  id: string
  title: string
  description?: string
  url: string
  type: 'project' | 'skill' | 'blog'
  icon?: string
  date?: string
}

/**
 * 搜索结果
 */
export interface SearchResults {
  projects: SearchResultItem[]
  skills: SearchResultItem[]
  blogs: SearchResultItem[]
  total: number
}

/**
 * 搜索状态管理
 */
export const useSearchStore = defineStore('search', () => {
  // 状态
  const isOpen = ref(false)
  const query = ref('')
  const loading = ref(false)
  const history = ref<string[]>([])
  const results = ref<SearchResults>({
    projects: [],
    skills: [],
    blogs: [],
    total: 0
  })
  const selectedIndex = ref(0)

  // 计算属性：当前选中的结果
  const selectedResult = computed(() => {
    const allResults = [
      ...results.value.projects,
      ...results.value.skills,
      ...results.value.blogs
    ]
    return allResults[selectedIndex.value] || null
  })

  /**
   * 打开搜索框
   */
  const openSearch = () => {
    isOpen.value = true
    // 阻止页面滚动
    document.body.style.overflow = 'hidden'
  }

  /**
   * 关闭搜索框
   */
  const closeSearch = () => {
    isOpen.value = false
    query.value = ''
    results.value = {
      projects: [],
      skills: [],
      blogs: [],
      total: 0
    }
    selectedIndex.value = 0
    // 恢复页面滚动
    document.body.style.overflow = ''
  }

  /**
   * 清空搜索历史
   */
  const clearHistory = () => {
    history.value = []
    saveHistory()
  }

  /**
   * 选择上一个结果
   */
  const selectPrevious = () => {
    const total = results.value.total
    if (total === 0) return
    selectedIndex.value = selectedIndex.value > 0 
      ? selectedIndex.value - 1 
      : total - 1
  }

  /**
   * 选择下一个结果
   */
  const selectNext = () => {
    const total = results.value.total
    if (total === 0) return
    selectedIndex.value = selectedIndex.value < total - 1 
      ? selectedIndex.value + 1 
      : 0
  }

  /**
   * 执行搜索
   */
  const performSearch = (
    searchQuery: string,
    projects: any[],
    skills: any[],
    blogs: any[]
  ) => {
    if (!searchQuery.trim()) {
      results.value = {
        projects: [],
        skills: [],
        blogs: [],
        total: 0
      }
      return
    }

    loading.value = true
    const queryLower = searchQuery.toLowerCase()

    // 搜索项目
    const projectResults: SearchResultItem[] = projects
      .filter(project => 
        project.title?.toLowerCase().includes(queryLower) ||
        project.description?.toLowerCase().includes(queryLower) ||
        project.tags?.some((tag: string) => tag.toLowerCase().includes(queryLower))
      )
      .map(project => ({
        id: `project-${project.id}`,
        title: project.title,
        description: project.description,
        url: `/projects/${project.id}`,
        type: 'project' as const,
        date: project.date
      }))

    // 搜索技能
    const skillResults: SearchResultItem[] = skills
      .filter(skill =>
        skill.name?.toLowerCase().includes(queryLower) ||
        skill.category?.toLowerCase().includes(queryLower)
      )
      .map(skill => ({
        id: `skill-${skill.id || skill.name}`,
        title: skill.name,
        description: skill.category,
        url: `/skills#${skill.name}`,
        type: 'skill' as const
      }))

    // 搜索博客
    const blogResults: SearchResultItem[] = blogs
      .filter(blog =>
        blog.title?.toLowerCase().includes(queryLower) ||
        blog.excerpt?.toLowerCase().includes(queryLower) ||
        blog.tags?.some((tag: string) => tag.toLowerCase().includes(queryLower))
      )
      .map(blog => ({
        id: `blog-${blog.id}`,
        title: blog.title,
        description: blog.excerpt,
        url: `/blog/${blog.id}`,
        type: 'blog' as const,
        date: blog.date
      }))

    results.value = {
      projects: projectResults,
      skills: skillResults,
      blogs: blogResults,
      total: projectResults.length + skillResults.length + blogResults.length
    }

    selectedIndex.value = 0
    loading.value = false

    // 添加到搜索历史
    if (searchQuery.trim() && !history.value.includes(searchQuery.trim())) {
      history.value.unshift(searchQuery.trim())
      if (history.value.length > 10) {
        history.value.pop()
      }
      saveHistory()
    }
  }

  /**
   * 保存搜索历史到本地存储
   */
  const saveHistory = () => {
    try {
      localStorage.setItem('search-history', JSON.stringify(history.value))
    } catch (e) {
      console.warn('Failed to save search history:', e)
    }
  }

  /**
   * 从本地存储加载搜索历史
   */
  const loadHistory = () => {
    try {
      const saved = localStorage.getItem('search-history')
      if (saved) {
        history.value = JSON.parse(saved)
      }
    } catch (e) {
      console.warn('Failed to load search history:', e)
    }
  }

  // 初始化加载历史
  loadHistory()

  return {
    // 状态
    isOpen,
    query,
    loading,
    history,
    results,
    selectedIndex,
    selectedResult,

    // 方法
    openSearch,
    closeSearch,
    clearHistory,
    selectPrevious,
    selectNext,
    performSearch
  }
})
