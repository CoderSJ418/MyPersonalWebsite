import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BlogPost } from '@/types/blog'

export interface SearchResultItem {
  id: string
  title: string
  description?: string
  url: string
  type: 'blog'
  date?: string
}

export interface SearchResults {
  items: SearchResultItem[]
  total: number
}

export const useSearchStore = defineStore('search', () => {
  const isOpen = ref(false)
  const query = ref('')
  const loading = ref(false)
  const history = ref<string[]>([])
  const results = ref<SearchResults>({
    items: [],
    total: 0
  })
  const selectedIndex = ref(0)

  const selectedResult = computed(() => {
    return results.value.items[selectedIndex.value] || null
  })

  const openSearch = () => {
    isOpen.value = true
    document.body.style.overflow = 'hidden'
  }

  const closeSearch = () => {
    isOpen.value = false
    query.value = ''
    results.value = { items: [], total: 0 }
    selectedIndex.value = 0
    document.body.style.overflow = ''
  }

  const clearHistory = () => {
    history.value = []
    saveHistory()
  }

  const selectPrevious = () => {
    const total = results.value.total
    if (total === 0) return
    selectedIndex.value = selectedIndex.value > 0
      ? selectedIndex.value - 1
      : total - 1
  }

  const selectNext = () => {
    const total = results.value.total
    if (total === 0) return
    selectedIndex.value = selectedIndex.value < total - 1
      ? selectedIndex.value + 1
      : 0
  }

  const performSearch = (searchQuery: string, blogs: BlogPost[]) => {
    if (!searchQuery.trim()) {
      results.value = { items: [], total: 0 }
      return
    }

    loading.value = true
    const queryLower = searchQuery.toLowerCase()

    const blogResults: SearchResultItem[] = blogs
      .filter(blog =>
        blog.title.toLowerCase().includes(queryLower) ||
        blog.excerpt.toLowerCase().includes(queryLower) ||
        blog.tags.some((tag: string) => tag.toLowerCase().includes(queryLower))
      )
      .map(blog => ({
        id: `blog-${blog.id}`,
        title: blog.title,
        description: blog.excerpt,
        url: `/blog/${blog.id}`,
        type: 'blog' as const,
        date: blog.publishedAt
      }))

    results.value = {
      items: blogResults,
      total: blogResults.length
    }

    selectedIndex.value = 0
    loading.value = false

    if (searchQuery.trim() && !history.value.includes(searchQuery.trim())) {
      history.value.unshift(searchQuery.trim())
      if (history.value.length > 10) {
        history.value.pop()
      }
      saveHistory()
    }
  }

  const saveHistory = () => {
    try {
      localStorage.setItem('search-history', JSON.stringify(history.value))
    } catch {
      console.warn('Failed to save search history')
    }
  }

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem('search-history')
      if (saved) {
        history.value = JSON.parse(saved)
      }
    } catch {
      console.warn('Failed to load search history')
    }
  }

  loadHistory()

  return {
    isOpen,
    query,
    loading,
    history,
    results,
    selectedIndex,
    selectedResult,
    openSearch,
    closeSearch,
    clearHistory,
    selectPrevious,
    selectNext,
    performSearch
  }
})
