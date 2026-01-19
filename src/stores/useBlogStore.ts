import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BlogPost, BlogFilter } from '@/types/blog'
import blogIndex from '@/assets/data/blog-index.json'

export const useBlogStore = defineStore('blog', () => {
  const posts = ref<BlogPost[]>(blogIndex)
  const selectedTag = ref<string | null>(null)
  const searchQuery = ref('')
  const loading = ref(false)
  const error = ref<string | null>(null)

  const filteredPosts = computed(() => {
    let filtered = posts.value

    if (selectedTag.value) {
      filtered = filtered.filter(post =>
        post.tags.includes(selectedTag.value!)
      )
    }

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
    posts,
    selectedTag,
    searchQuery,
    loading,
    error,
    filteredPosts,
    allTags,
    recentPosts,
    loadPosts,
    filterByTag,
    searchPosts,
    getPostById
  }
})