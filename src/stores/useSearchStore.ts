/**
 * 搜索状态管理
 * 管理搜索状态、搜索历史、搜索结果缓存
 */

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { SearchState, SearchResults, SearchHistoryItem, SearchResultItem } from '@/types/search'
import { globalSearch, getSearchResultsTotal, flattenSearchResults, debounce } from '@/utils/search'

export const useSearchStore = defineStore('search', () => {
  // 状态
  const isOpen = ref(false)
  const query = ref('')
  const results = ref<SearchResults>({
    projects: [],
    skills: [],
    blogs: [],
    total: 0
  })
  const history = ref<SearchHistoryItem[]>([])
  const selectedIndex = ref(0)
  const loading = ref(false)

  // 从 localStorage 加载搜索历史
  const loadHistory = () => {
    try {
      const saved = localStorage.getItem('search-history')
      if (saved) {
        history.value = JSON.parse(saved)
      }
    } catch (error) {
      console.error('Failed to load search history:', error)
    }
  }

  // 保存搜索历史到 localStorage
  const saveHistory = () => {
    try {
      localStorage.setItem('search-history', JSON.stringify(history.value))
    } catch (error) {
      console.error('Failed to save search history:', error)
    }
  }

  // 添加搜索历史
  const addToHistory = (searchQuery: string) => {
    if (!searchQuery.trim()) return

    // 移除已存在的相同查询
    history.value = history.value.filter(item => item.query !== searchQuery)

    // 添加到开头
    history.value.unshift({
      query: searchQuery,
      timestamp: Date.now()
    })

    // 只保留最近5条
    history.value = history.value.slice(0, 5)

    saveHistory()
  }

  // 清除搜索历史
  const clearHistory = () => {
    history.value = []
    saveHistory()
  }

  // 打开搜索框
  const openSearch = () => {
    isOpen.value = true
    selectedIndex.value = 0
  }

  // 关闭搜索框
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
  }

  // 执行搜索
  const performSearch = debounce((searchQuery: string, projects: any[], skills: any[], posts: any[]) => {
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

    // 模拟异步搜索（实际项目中可能是API调用）
    setTimeout(() => {
      results.value = globalSearch(projects, skills, posts, searchQuery)
      results.value.total = getSearchResultsTotal(results.value)

      // 添加到搜索历史
      if (results.value.total > 0) {
        addToHistory(searchQuery)
      }

      loading.value = false
    }, 100)
  }, 300)

  // 选择上一个结果
  const selectPrevious = () => {
    const flatResults = flattenSearchResults(results.value)
    if (flatResults.length === 0) return

    selectedIndex.value = selectedIndex.value <= 0 ? flatResults.length - 1 : selectedIndex.value - 1
  }

  // 选择下一个结果
  const selectNext = () => {
    const flatResults = flattenSearchResults(results.value)
    if (flatResults.length === 0) return

    selectedIndex.value = selectedIndex.value >= flatResults.length - 1 ? 0 : selectedIndex.value + 1
  }

  // 获取选中的结果
  const selectedResult = computed((): SearchResultItem | null => {
    const flatResults = flattenSearchResults(results.value)
    return flatResults[selectedIndex.value] || null
  })

  // 监听查询变化
  watch(query, (newQuery) => {
    // 这里需要从其他store获取数据，将在组件中处理
    // performSearch(newQuery, projects, skills, posts)
  })

  // 初始化时加载搜索历史
  loadHistory()

  return {
    // 状态
    isOpen,
    query,
    results,
    history,
    selectedIndex,
    loading,
    selectedResult,

    // 方法
    openSearch,
    closeSearch,
    performSearch,
    addToHistory,
    clearHistory,
    selectPrevious,
    selectNext
  }
})