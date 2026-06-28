import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BlogPost } from '@/types/blog'
import { loadBlogPosts } from '@/utils/blogLoader'

export const useBlogStore = defineStore('blog', () => {
  const posts = ref<BlogPost[]>([])
  const selectedTag = ref<string | null>(null)
  const searchQuery = ref('')
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const itemsPerPage = ref(10)

  const filteredPosts = computed(() => {
    let filtered = posts.value

    if (selectedTag.value) {
      filtered = filtered.filter((post) => post.tags.includes(selectedTag.value))
    }

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    return filtered
  })

  const allTags = computed(() => {
    const allTags = posts.value.flatMap((post) => post.tags)
    return [...new Set(allTags)]
  })

  const recentPosts = computed(() => {
    return [...posts.value]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 5)
  })

  const sortedPosts = computed(() => {
    return [...posts.value].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
  })

  const totalPages = computed(() => {
    return Math.ceil(filteredPosts.value.length / itemsPerPage.value)
  })

  const paginatedPosts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredPosts.value.slice(start, end)
  })

  const loadPosts = async () => {
    try {
      loading.value = true
      error.value = null
      posts.value = await loadBlogPosts()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load posts'
      console.error('Error loading posts:', err)
    } finally {
      loading.value = false
    }
  }

  const filterByTag = (tag: string | null) => {
    selectedTag.value = tag
    currentPage.value = 1
  }

  const searchPosts = (query: string) => {
    searchQuery.value = query
    currentPage.value = 1
  }

  const getPostById = (id: string) => {
    return posts.value.find((p) => p.id === id)
  }

  const getPreviousPost = (id: string) => {
    const sorted = [...posts.value].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    const currentIndex = sorted.findIndex((p) => p.id === id)
    if (currentIndex === -1 || currentIndex === sorted.length - 1) {
      return null
    }
    return sorted[currentIndex + 1]
  }

  const getNextPost = (id: string) => {
    const sorted = [...posts.value].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    const currentIndex = sorted.findIndex((p) => p.id === id)
    if (currentIndex <= 0) {
      return null
    }
    return sorted[currentIndex - 1]
  }

  const getRelatedPosts = (id: string, category: string | undefined, limit = 5) => {
    if (!category) {
      return []
    }

    return posts.value
      .filter((post) => post.id !== id && post.category === category)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit)
  }

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      setPage(currentPage.value + 1)
    }
  }

  const prevPage = () => {
    if (currentPage.value > 1) {
      setPage(currentPage.value - 1)
    }
  }

  return {
    posts,
    selectedTag,
    searchQuery,
    loading,
    error,
    filteredPosts,
    allTags,
    recentPosts,
    sortedPosts,
    paginatedPosts,
    currentPage,
    totalPages,
    itemsPerPage,
    loadPosts,
    filterByTag,
    searchPosts,
    getPostById,
    getPreviousPost,
    getNextPost,
    getRelatedPosts,
    setPage,
    nextPage,
    prevPage,
  }
})
