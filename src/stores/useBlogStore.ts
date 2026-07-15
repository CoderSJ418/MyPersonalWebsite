import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BlogPost } from '@/types/blog'
import {
  loadBlogPosts,
  loadBlogPost,
  loadPostContent as loadBlogPostContent
} from '@/utils/blogLoader'
import { logger } from '@/utils/logger'

export const useBlogStore = defineStore('blog', () => {
  const posts = ref<BlogPost[]>([])
  const selectedTag = ref<string | null>(null)
  const selectedCategory = ref<string | null>(null)
  const searchQuery = ref('')
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPage = ref(1)
  const itemsPerPage = ref(10)

  // Track which posts have their content loaded
  const loadedContentIds = ref<Set<string>>(new Set())

  const filteredPosts = computed(() => {
    let filtered = posts.value

    if (selectedCategory.value) {
      filtered = filtered.filter((post) => post.category === selectedCategory.value)
    }

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

    // Sort by date descending to ensure year grouping works correctly with pagination
    return [...filtered].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
  })

  const allTags = computed(() => {
    const tagCount = new Map<string, number>()
    for (const tag of posts.value.flatMap((post) => post.tags)) {
      tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1)
    }
    // 只显示出现2次及以上的标签，避免点击后无内容
    return [...tagCount.entries()]
      .filter(([, count]) => count >= 2)
      .map(([tag]) => tag)
      .sort()
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

  /**
   * Load all blog post metadata (SYNC — instant from static blog-meta.json)
   * No loading state needed — data is available immediately
   */
  const loadPosts = () => {
    posts.value = loadBlogPosts()
  }

  /**
   * Load full content for a specific post (ASYNC)
   * Used by detail page: metadata shown instantly, content loaded async
   */
  const loadPostContent = async (id: string): Promise<string | null> => {
    if (loadedContentIds.value.has(id)) {
      // Content already loaded, return from post
      const post = posts.value.find((p) => p.id === id)
      return post?.content ?? null
    }

    try {
      const content = await loadBlogPostContent(id)
      if (content !== null) {
        // Update the post in the store with the loaded content
        const postIndex = posts.value.findIndex((p) => p.id === id)
        if (postIndex !== -1) {
          posts.value[postIndex] = { ...posts.value[postIndex], content }
        }
        loadedContentIds.value.add(id)
      }
      return content
    } catch (err) {
      logger.error('Error loading post content:', err)
      return null
    }
  }

  /**
   * 加载单篇文章完整数据（仅加载目标文章的 chunk，不加载全部）
   * 用于博客详情页的性能优化路径
   */
  const loadSinglePost = async (id: string): Promise<BlogPost | null> => {
    // 先检查是否已有完整内容
    const cached = posts.value.find((p) => p.id === id)
    if (cached?.content) return cached

    try {
      const post = await loadBlogPost(id)
      if (post) {
        // 更新store中的文章数据
        const postIndex = posts.value.findIndex((p) => p.id === id)
        if (postIndex !== -1) {
          posts.value[postIndex] = post
        } else {
          posts.value.push(post)
        }
        if (post.content) {
          loadedContentIds.value.add(id)
        }
      }
      return post
    } catch (err) {
      logger.error('Error loading single post:', err)
      return null
    }
  }

  const allCategories = computed(() => {
    const categories = posts.value
      .map((post) => post.category)
      .filter((c): c is string => !!c)
    return [...new Set(categories)]
  })

  const filterByTag = (tag: string | null) => {
    selectedTag.value = tag
    currentPage.value = 1
  }

  const filterByCategory = (category: string | null) => {
    selectedCategory.value = category
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
      (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
    )
    const currentIndex = sorted.findIndex((p) => p.id === id)
    if (currentIndex <= 0) {
      return null
    }
    return sorted[currentIndex - 1]
  }

  const getRelatedPosts = (id: string, category: string | undefined, limit = 5) => {
    const currentPost = posts.value.find((p) => p.id === id)
    if (!currentPost) return []

    const scored = posts.value
      .filter((post) => post.id !== id)
      .map((post) => {
        let score = 0
        // 分类匹配权重最高
        if (category && post.category === category) score += 3
        // 标签重叠度
        const tagOverlap = post.tags.filter((tag) => currentPost.tags.includes(tag)).length
        score += tagOverlap
        return { post, score }
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.post)

    return scored
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
    selectedCategory,
    searchQuery,
    loading,
    error,
    filteredPosts,
    allTags,
    allCategories,
    recentPosts,
    sortedPosts,
    paginatedPosts,
    currentPage,
    totalPages,
    itemsPerPage,
    loadPosts,
    loadPostContent,
    loadSinglePost,
    filterByTag,
    filterByCategory,
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
