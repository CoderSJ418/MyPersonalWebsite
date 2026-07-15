import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useBlogStore } from '@/stores/useBlogStore'
import { loadBlogPost, loadBlogPosts, loadPostContent } from '@/utils/blogLoader'
import { createBlogPost } from '../fixtures'

vi.mock('@/utils/blogLoader', () => ({
  loadBlogPosts: vi.fn(),
  loadBlogPost: vi.fn(),
  loadPostContent: vi.fn()
}))

const posts = [
  createBlogPost('one', 'Vue One', '2026-01-01', ['vue', 'shared']),
  createBlogPost('two', 'TypeScript Two', '2026-02-01', ['ts', 'shared']),
  createBlogPost('three', 'Vue Three', '2026-03-01', ['vue'], 'backend')
]

describe('useBlogStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    vi.mocked(loadBlogPosts).mockReturnValue(posts)
  })

  it('loads, sorts, filters and paginates metadata', () => {
    const store = useBlogStore()
    store.loadPosts()
    expect(store.sortedPosts[0]?.id).toBe('three')
    expect(store.recentPosts).toHaveLength(3)
    expect(store.allTags).toEqual(['shared', 'vue'])
    expect(store.allCategories).toContain('frontend')
    store.filterByCategory('frontend')
    store.filterByTag('shared')
    store.searchPosts('typescript')
    expect(store.filteredPosts.map((post) => post.id)).toEqual(['two'])
    expect(store.paginatedPosts).toHaveLength(1)
    store.searchPosts('')
    store.filterByTag(null)
    store.filterByCategory(null)
    store.itemsPerPage = 1
    store.setPage(2)
    expect(store.currentPage).toBe(2)
    store.nextPage()
    store.prevPage()
  })

  it('resolves navigation and related articles', () => {
    const store = useBlogStore()
    store.posts = posts
    expect(store.getPostById('one')?.title).toBe('Vue One')
    expect(store.getPreviousPost('three')?.id).toBe('two')
    expect(store.getPreviousPost('missing')).toBeNull()
    expect(store.getNextPost('one')).toBeNull()
    expect(store.getNextPost('two')?.id).toBe('one')
    expect(store.getNextPost('missing')).toBeNull()
    expect(store.getRelatedPosts('one', 'frontend', 1)).toHaveLength(1)
    expect(store.getRelatedPosts('missing', undefined)).toEqual([])
  })

  it('loads full content and caches it in metadata', async () => {
    vi.mocked(loadPostContent).mockResolvedValue('# article')
    const store = useBlogStore()
    store.posts = posts
    await expect(store.loadPostContent('one')).resolves.toBe('# article')
    expect(store.posts[0]?.content).toBe('# article')
    await expect(store.loadPostContent('one')).resolves.toBe('# article')
    expect(loadPostContent).toHaveBeenCalledTimes(1)
  })

  it('loads, inserts and reuses complete posts', async () => {
    const complete = { ...posts[0], content: '# complete' }
    vi.mocked(loadBlogPost).mockResolvedValue(complete)
    const store = useBlogStore()
    await expect(store.loadSinglePost('one')).resolves.toEqual(complete)
    expect(store.posts[0]?.id).toBe('one')
    await expect(store.loadSinglePost('one')).resolves.toEqual(complete)
    expect(loadBlogPost).toHaveBeenCalledTimes(1)
    vi.mocked(loadBlogPost).mockRejectedValue(new Error('failed'))
    await expect(store.loadSinglePost('two')).resolves.toBeNull()
  })
})
