import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BlogList from '@/components/blog/BlogList.vue'
import type { BlogPost } from '@/types/blog'

// Mock theme store
vi.mock('@/stores/useThemeStore', () => ({
  useThemeStore: () => ({
    colorScheme: 'professional-minimal',
    uiStyle: 'glass-morphism',
    darkMode: false
  })
}))

// Mock child components
vi.mock('@/components/blog/BlogCard.vue', () => ({
  default: {
    name: 'BlogCard',
    props: ['post'],
    template: '<div class="blog-card">{{ post.title }}</div>'
  }
}))

vi.mock('@/components/common/Pagination.vue', () => ({
  default: {
    name: 'Pagination',
    props: ['currentPage', 'totalPages'],
    template: '<div class="pagination">Page {{ currentPage }} / {{ totalPages }}</div>'
  }
}))

vi.mock('@/components/common/SkeletonLoader.vue', () => ({
  default: {
    name: 'SkeletonLoader',
    props: ['type', 'count'],
    template: '<div class="skeleton">Loading...</div>'
  }
}))

describe('BlogList', () => {
  const mockPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Vue 3 Composition API 最佳实践',
      excerpt: '深入探讨 Vue 3 Composition API 的使用技巧和最佳实践',
      content: 'Vue 3 的 Composition API 是一个强大的特性',
      author: '佘杰',
      publishedAt: '2024-01-15',
      updatedAt: '2024-01-15',
      tags: ['Vue 3', 'Composition API'],
      readTime: 15,
      coverImage: '/images/blog/blog1.jpg'
    },
    {
      id: '2',
      title: 'TypeScript 高级类型技巧',
      excerpt: '掌握 TypeScript 高级类型，提升代码质量',
      content: 'TypeScript 提供了强大的类型系统',
      author: '佘杰',
      publishedAt: '2024-01-10',
      updatedAt: '2024-01-10',
      tags: ['TypeScript', '类型系统'],
      readTime: 12,
      coverImage: '/images/blog/blog2.jpg'
    },
    {
      id: '3',
      title: '前端性能优化实战',
      excerpt: '从加载到渲染，全方位优化前端性能',
      content: '前端性能优化是提升用户体验的关键',
      author: '佘杰',
      publishedAt: '2024-01-05',
      updatedAt: '2024-01-05',
      tags: ['性能优化', '前端'],
      readTime: 18,
      coverImage: '/images/blog/blog3.jpg'
    }
  ]

  describe('渲染文章列表', () => {
    it('should render posts list when posts are provided', () => {
      const wrapper = mount(BlogList, {
        props: {
          posts: mockPosts,
          currentPage: 1,
          totalPages: 1
        }
      })

      const cards = wrapper.findAll('.blog-card')
      expect(cards.length).toBe(mockPosts.length)
      expect(cards[0].text()).toBe(mockPosts[0].title)
      expect(cards[1].text()).toBe(mockPosts[1].title)
      expect(cards[2].text()).toBe(mockPosts[2].title)
    })

    it('should render grid layout with correct classes', () => {
      const wrapper = mount(BlogList, {
        props: {
          posts: mockPosts,
          currentPage: 1,
          totalPages: 1
        }
      })

      const grid = wrapper.find('.grid')
      expect(grid.exists()).toBe(true)
      expect(grid.classes()).toContain('grid-cols-1')
      expect(grid.classes()).toContain('md:grid-cols-2')
      expect(grid.classes()).toContain('lg:grid-cols-3')
    })

    it('should render correct ARIA attributes', () => {
      const wrapper = mount(BlogList, {
        props: {
          posts: mockPosts,
          currentPage: 1,
          totalPages: 1
        }
      })

      const grid = wrapper.find('.grid')
      expect(grid.attributes('role')).toBe('list')
      expect(grid.attributes('aria-label')).toBe('文章列表')
    })
  })

  describe('分页状态显示', () => {
    it('should render pagination when totalPages > 1', () => {
      const wrapper = mount(BlogList, {
        props: {
          posts: mockPosts,
          currentPage: 1,
          totalPages: 3
        }
      })

      const pagination = wrapper.find('.pagination')
      expect(pagination.exists()).toBe(true)
      expect(pagination.text()).toContain('Page 1 / 3')
    })

    it('should not render pagination when totalPages <= 1', () => {
      const wrapper = mount(BlogList, {
        props: {
          posts: mockPosts,
          currentPage: 1,
          totalPages: 1
        }
      })

      const pagination = wrapper.find('.pagination')
      expect(pagination.exists()).toBe(false)
    })

    it('should pass correct props to Pagination component', () => {
      const wrapper = mount(BlogList, {
        props: {
          posts: mockPosts,
          currentPage: 2,
          totalPages: 5
        }
      })

      const pagination = wrapper.findComponent({ name: 'Pagination' })
      expect(pagination.props('currentPage')).toBe(2)
      expect(pagination.props('totalPages')).toBe(5)
    })
  })

  describe('加载状态显示', () => {
    it('should render loading state when loading is true', () => {
      const wrapper = mount(BlogList, {
        props: {
          posts: [],
          currentPage: 1,
          totalPages: 1,
          loading: true
        }
      })

      const skeleton = wrapper.find('.skeleton')
      expect(skeleton.exists()).toBe(true)
    })

    it('should not render posts when loading is true', () => {
      const wrapper = mount(BlogList, {
        props: {
          posts: mockPosts,
          currentPage: 1,
          totalPages: 1,
          loading: true
        }
      })

      const cards = wrapper.findAll('.blog-card')
      expect(cards.length).toBe(0)
    })

    it('should pass correct count to SkeletonLoader', () => {
      const wrapper = mount(BlogList, {
        props: {
          posts: [],
          currentPage: 1,
          totalPages: 1,
          loading: true,
          itemsPerPage: 10
        }
      })

      const skeleton = wrapper.findComponent({ name: 'SkeletonLoader' })
      expect(skeleton.props('count')).toBe(10)
    })
  })

  describe('错误状态显示', () => {
    it('should render error state when error is provided', () => {
      const wrapper = mount(BlogList, {
        props: {
          posts: [],
          currentPage: 1,
          totalPages: 1,
          error: '加载失败，请重试'
        }
      })

      expect(wrapper.text()).toContain('加载失败')
      expect(wrapper.text()).toContain('加载失败，请重试')
    })

    it('should render retry button in error state', () => {
      const wrapper = mount(BlogList, {
        props: {
          posts: [],
          currentPage: 1,
          totalPages: 1,
          error: '加载失败'
        }
      })

      const retryButton = wrapper.find('button')
      expect(retryButton.exists()).toBe(true)
      expect(retryButton.text()).toBe('重试')
    })

    it('should not render posts when error is provided', () => {
      const wrapper = mount(BlogList, {
        props: {
          posts: mockPosts,
          currentPage: 1,
          totalPages: 1,
          error: '加载失败'
        }
      })

      const cards = wrapper.findAll('.blog-card')
      expect(cards.length).toBe(0)
    })
  })

  describe('空状态显示', () => {
    it('should render empty state when posts array is empty', () => {
      const wrapper = mount(BlogList, {
        props: {
          posts: [],
          currentPage: 1,
          totalPages: 1
        }
      })

      expect(wrapper.text()).toContain('暂无文章')
      expect(wrapper.text()).toContain('还没有发布任何文章')
    })

    it('should not render pagination in empty state', () => {
      const wrapper = mount(BlogList, {
        props: {
          posts: [],
          currentPage: 1,
          totalPages: 1
        }
      })

      const pagination = wrapper.find('.pagination')
      expect(pagination.exists()).toBe(false)
    })
  })

  describe('事件触发', () => {
    it('should emit post-click event when post is clicked', async () => {
      const wrapper = mount(BlogList, {
        props: {
          posts: mockPosts,
          currentPage: 1,
          totalPages: 1
        }
      })

      const cards = wrapper.findAllComponents({ name: 'BlogCard' })
      await cards[0].vm.$emit('click', mockPosts[0])

      expect(wrapper.emitted('post-click')).toBeTruthy()
      expect(wrapper.emitted('post-click')![0]).toEqual([mockPosts[0]])
    })

    it('should emit tag-click event when tag is clicked', async () => {
      const wrapper = mount(BlogList, {
        props: {
          posts: mockPosts,
          currentPage: 1,
          totalPages: 1
        }
      })

      const cards = wrapper.findAllComponents({ name: 'BlogCard' })
      await cards[0].vm.$emit('tag-click', 'Vue 3')

      expect(wrapper.emitted('tag-click')).toBeTruthy()
      expect(wrapper.emitted('tag-click')![0]).toEqual(['Vue 3'])
    })

    it('should emit page-change event when page is changed', async () => {
      const wrapper = mount(BlogList, {
        props: {
          posts: mockPosts,
          currentPage: 1,
          totalPages: 3
        }
      })

      const pagination = wrapper.findComponent({ name: 'Pagination' })
      await pagination.vm.$emit('page-change', 2)

      expect(wrapper.emitted('page-change')).toBeTruthy()
      expect(wrapper.emitted('page-change')![0]).toEqual([2])
    })

    it('should emit retry event when retry button is clicked', async () => {
      const wrapper = mount(BlogList, {
        props: {
          posts: [],
          currentPage: 1,
          totalPages: 1,
          error: '加载失败'
        }
      })

      const retryButton = wrapper.find('button')
      await retryButton.trigger('click')

      expect(wrapper.emitted('retry')).toBeTruthy()
    })
  })

  describe('响应式布局', () => {
    it('should have responsive grid classes', () => {
      const wrapper = mount(BlogList, {
        props: {
          posts: mockPosts,
          currentPage: 1,
          totalPages: 1
        }
      })

      const grid = wrapper.find('.grid')
      expect(grid.classes()).toContain('grid-cols-1')
      expect(grid.classes()).toContain('md:grid-cols-2')
      expect(grid.classes()).toContain('lg:grid-cols-3')
    })

    it('should have responsive gap classes', () => {
      const wrapper = mount(BlogList, {
        props: {
          posts: mockPosts,
          currentPage: 1,
          totalPages: 1
        }
      })

      const grid = wrapper.find('.grid')
      expect(grid.classes()).toContain('gap-4')
      expect(grid.classes()).toContain('md:gap-6')
    })
  })

  describe('Props 默认值', () => {
    it('should use default values for optional props', () => {
      const wrapper = mount(BlogList, {
        props: {
          posts: mockPosts,
          currentPage: 1,
          totalPages: 1
        }
      })

      expect(wrapper.props('loading')).toBe(false)
      expect(wrapper.props('error')).toBe(null)
      expect(wrapper.props('itemsPerPage')).toBe(10)
    })
  })
})