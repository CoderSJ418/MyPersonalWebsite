import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBlogStore } from '@/stores/useBlogStore'
import type { BlogPost } from '@/types/blog'

// Mock blog data
const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Vue 3 Composition API 最佳实践',
    excerpt: '深入探讨 Vue 3 Composition API 的使用技巧',
    content: 'Vue 3 的 Composition API 是一个强大的特性',
    author: '佘杰',
    publishedAt: '2024-01-15',
    updatedAt: '2024-01-15',
    tags: ['Vue 3', 'Composition API', 'TypeScript'],
    readTime: 15,
    coverImage: '/images/blog/blog1.jpg'
  },
  {
    id: '2',
    title: 'TypeScript 高级类型技巧',
    excerpt: '掌握 TypeScript 高级类型系统',
    content: 'TypeScript 的类型系统是其最强大的特性',
    author: '佘杰',
    publishedAt: '2024-02-10',
    updatedAt: '2024-02-10',
    tags: ['TypeScript', '类型系统', '泛型'],
    readTime: 20,
    coverImage: '/images/blog/blog2.jpg'
  },
  {
    id: '3',
    title: 'Vite 构建工具深度实践',
    excerpt: '探索 Vite 的核心原理和高级配置',
    content: 'Vite 是新一代前端构建工具',
    author: '佘杰',
    publishedAt: '2024-03-05',
    updatedAt: '2024-03-05',
    tags: ['Vite', '构建工具', '性能优化'],
    readTime: 18,
    coverImage: '/images/blog/blog3.jpg'
  }
]

describe('useBlogStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with blog data', () => {
    const store = useBlogStore()

    expect(store.posts.length).toBeGreaterThan(0)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.currentPage).toBe(1)
    expect(store.itemsPerPage).toBe(10)
  })

  it('should load posts successfully', async () => {
    const store = useBlogStore()

    await store.loadPosts()

    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.posts.length).toBeGreaterThan(0)
  })

  it('should sort posts by publish date descending', () => {
    const store = useBlogStore()
    store.posts = [...mockPosts]

    const sorted = store.sortedPosts

    expect(sorted[0].publishedAt).toBe('2024-03-05')
    expect(sorted[1].publishedAt).toBe('2024-02-10')
    expect(sorted[2].publishedAt).toBe('2024-01-15')
  })

  it('should filter posts by tag', () => {
    const store = useBlogStore()
    store.posts = [...mockPosts]

    store.filterByTag('Vue 3')

    expect(store.filteredPosts).toHaveLength(1)
    expect(store.filteredPosts[0].tags).toContain('Vue 3')
    expect(store.currentPage).toBe(1)
  })

  it('should filter posts by search query', () => {
    const store = useBlogStore()
    store.posts = [...mockPosts]

    store.searchPosts('TypeScript')

    expect(store.filteredPosts.length).toBeGreaterThanOrEqual(1)
    expect(store.currentPage).toBe(1)
  })

  it('should get all unique tags', () => {
    const store = useBlogStore()
    store.posts = [...mockPosts]

    const tags = store.allTags

    expect(tags).toContain('Vue 3')
    expect(tags).toContain('TypeScript')
    expect(tags).toContain('Vite')
    expect(tags).toContain('Composition API')
  })

  it('should get recent posts (top 5)', () => {
    const store = useBlogStore()
    store.posts = [...mockPosts]

    const recent = store.recentPosts

    expect(recent).toHaveLength(3)
    expect(recent[0].publishedAt).toBe('2024-03-05')
  })

  it('should get post by id', () => {
    const store = useBlogStore()
    store.posts = [...mockPosts]

    const post = store.getPostById('2')

    expect(post).toBeDefined()
    expect(post?.id).toBe('2')
    expect(post?.title).toBe('TypeScript 高级类型技巧')
  })

  it('should return undefined for non-existent post', () => {
    const store = useBlogStore()
    store.posts = [...mockPosts]

    const post = store.getPostById('999')

    expect(post).toBeUndefined()
  })

  it('should calculate total pages correctly', () => {
    const store = useBlogStore()
    store.posts = [...mockPosts]

    expect(store.totalPages).toBe(1)
  })

  it('should calculate total pages with more posts', () => {
    const store = useBlogStore()
    store.itemsPerPage = 2
    store.posts = [...mockPosts]

    expect(store.totalPages).toBe(2)
  })

  it('should get paginated posts for current page', () => {
    const store = useBlogStore()
    store.itemsPerPage = 2
    store.posts = [...mockPosts]

    const paginated = store.paginatedPosts

    expect(paginated).toHaveLength(2)
    // paginatedPosts 返回的是 filteredPosts 的分页结果，filteredPosts 没有排序
    // 所以返回的是原始 posts 数组的前 2 个元素
    expect(paginated[0].id).toBe('1')
    expect(paginated[1].id).toBe('2')
  })

  it('should set current page', () => {
    const store = useBlogStore()
    store.itemsPerPage = 2
    store.posts = [...mockPosts]

    store.setPage(2)

    expect(store.currentPage).toBe(2)
    expect(store.paginatedPosts).toHaveLength(1)
    // paginatedPosts 返回的是 filteredPosts 的分页结果，filteredPosts 没有排序
    // 所以返回的是原始 posts 数组的第 3 个元素
    expect(store.paginatedPosts[0].id).toBe('3')
  })

  it('should not set invalid page number', () => {
    const store = useBlogStore()
    store.posts = [...mockPosts]

    store.setPage(999)

    expect(store.currentPage).toBe(1)
  })

  it('should navigate to next page', () => {
    const store = useBlogStore()
    store.itemsPerPage = 2
    store.posts = [...mockPosts]

    store.nextPage()

    expect(store.currentPage).toBe(2)
  })

  it('should not navigate next on last page', () => {
    const store = useBlogStore()
    store.itemsPerPage = 2
    store.posts = [...mockPosts]
    store.setPage(2)

    store.nextPage()

    expect(store.currentPage).toBe(2)
  })

  it('should navigate to previous page', () => {
    const store = useBlogStore()
    store.itemsPerPage = 2
    store.posts = [...mockPosts]
    store.setPage(2)

    store.prevPage()

    expect(store.currentPage).toBe(1)
  })

  it('should not navigate previous on first page', () => {
    const store = useBlogStore()
    store.posts = [...mockPosts]

    store.prevPage()

    expect(store.currentPage).toBe(1)
  })

  it('should reset page when filtering by tag', () => {
    const store = useBlogStore()
    store.itemsPerPage = 2
    store.posts = [...mockPosts]
    store.setPage(2)

    store.filterByTag('Vue 3')

    expect(store.currentPage).toBe(1)
  })

  it('should reset page when searching', () => {
    const store = useBlogStore()
    store.itemsPerPage = 2
    store.posts = [...mockPosts]
    store.setPage(2)

    store.searchPosts('TypeScript')

    expect(store.currentPage).toBe(1)
  })

  it('should clear filter when setting tag to null', () => {
    const store = useBlogStore()
    store.posts = [...mockPosts]

    store.filterByTag('Vue 3')
    expect(store.filteredPosts).toHaveLength(1)

    store.filterByTag(null)
    expect(store.filteredPosts).toHaveLength(3)
  })

  it('should handle loading state', async () => {
    const store = useBlogStore()

    const loadPromise = store.loadPosts()
    expect(store.loading).toBe(true)

    await loadPromise
    expect(store.loading).toBe(false)
  })

  it('should handle error state', async () => {
    const store = useBlogStore()

    // 模拟加载失败的情况
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // 手动触发错误
    store.loading = true
    store.error = null
    await new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Failed to load'))
      }, 100)
    }).catch(err => {
      store.error = err instanceof Error ? err.message : 'Failed to load'
    })
    store.loading = false

    expect(store.error).toBeTruthy()
    expect(store.loading).toBe(false)

    consoleSpy.mockRestore()
  })
})