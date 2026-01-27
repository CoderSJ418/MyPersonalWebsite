import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import RelatedPosts from '@/components/blog/RelatedPosts.vue'
import type { BlogPost } from '@/types/blog'

// Mock theme store
vi.mock('@/stores/useThemeStore', () => ({
  useThemeStore: () => ({
    colorScheme: 'professional-minimal',
    uiStyle: 'glass-morphism',
    darkMode: false
  })
}))

describe('RelatedPosts', () => {
  let router: any

  const mockPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Vue 3 Composition API 最佳实践',
      excerpt: '深入探讨 Vue 3 Composition API 的使用技巧',
      content: 'Vue 3 的 Composition API 是一个强大的特性',
      author: '佘杰',
      publishedAt: '2024-01-15',
      updatedAt: '2024-01-15',
      tags: ['Vue 3', 'Composition API'],
      category: 'Vue3',
      readTime: 15
    },
    {
      id: '2',
      title: 'TypeScript 高级类型',
      excerpt: '掌握 TypeScript 的高级类型系统',
      content: 'TypeScript 提供了强大的类型系统',
      author: '佘杰',
      publishedAt: '2024-01-16',
      updatedAt: '2024-01-16',
      tags: ['TypeScript', '类型系统'],
      category: 'Vue3',
      readTime: 12
    },
    {
      id: '3',
      title: 'Vite 性能优化',
      excerpt: '优化 Vite 项目的构建性能',
      content: 'Vite 是一个快速的构建工具',
      author: '佘杰',
      publishedAt: '2024-01-17',
      updatedAt: '2024-01-17',
      tags: ['Vite', '性能优化'],
      category: 'Vue3',
      readTime: 10
    }
  ]

  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', name: 'Home', component: { template: '<div>Home</div>' } },
        { path: '/blog', name: 'Blog', component: { template: '<div>Blog</div>' } },
        { path: '/blog/:id', name: 'BlogDetail', component: { template: '<div>Detail</div>' } }
      ]
    })
  })

  describe('渲染相关文章', () => {
    it('should render all related posts', () => {
      const wrapper = mount(RelatedPosts, {
        props: { posts: mockPosts },
        global: {
          plugins: [router]
        }
      })

      const items = wrapper.findAll('.related-posts__item')
      expect(items.length).toBe(3)
    })

    it('should render post title', () => {
      const wrapper = mount(RelatedPosts, {
        props: { posts: mockPosts },
        global: {
          plugins: [router]
        }
      })

      const titles = wrapper.findAll('.related-posts__item-title')
      expect(titles[0].text()).toBe(mockPosts[0].title)
      expect(titles[1].text()).toBe(mockPosts[1].title)
      expect(titles[2].text()).toBe(mockPosts[2].title)
    })

    it('should render post excerpt', () => {
      const wrapper = mount(RelatedPosts, {
        props: { posts: mockPosts },
        global: {
          plugins: [router]
        }
      })

      const excerpts = wrapper.findAll('.related-posts__item-excerpt')
      expect(excerpts[0].text()).toBe(mockPosts[0].excerpt)
    })

    it('should render post date', () => {
      const wrapper = mount(RelatedPosts, {
        props: { posts: mockPosts },
        global: {
          plugins: [router]
        }
      })

      const dates = wrapper.findAll('.related-posts__item-date')
      expect(dates[0].text()).toContain('2024')
      expect(dates[0].text()).toContain('01')
      expect(dates[0].text()).toContain('15')
    })

    it('should render section title', () => {
      const wrapper = mount(RelatedPosts, {
        props: { posts: mockPosts },
        global: {
          plugins: [router]
        }
      })

      const title = wrapper.find('.related-posts__title')
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe('相关文章')
    })

    it('should not render when posts is empty', () => {
      const wrapper = mount(RelatedPosts, {
        props: { posts: [] },
        global: {
          plugins: [router]
        }
      })

      const section = wrapper.find('.related-posts')
      expect(section.exists()).toBe(true)
    })
  })

  describe('点击导航', () => {
    it('should navigate to blog detail when post item is clicked', async () => {
      const wrapper = mount(RelatedPosts, {
        props: { posts: mockPosts },
        global: {
          plugins: [router]
        }
      })

      const items = wrapper.findAll('.related-posts__item')
      await items[0].trigger('click')

      // 等待路由导航完成
      await router.isReady()

      expect(router.currentRoute.value.name).toBe('BlogDetail')
      expect(router.currentRoute.value.params.id).toBe('1')
    })

    it('should handle keyboard navigation', async () => {
      const wrapper = mount(RelatedPosts, {
        props: { posts: mockPosts },
        global: {
          plugins: [router]
        }
      })

      const items = wrapper.findAll('.related-posts__item')
      await items[0].trigger('keydown.enter')

      // 等待路由导航完成
      await router.isReady()

      expect(router.currentRoute.value.name).toBe('BlogDetail')
      expect(router.currentRoute.value.params.id).toBe('1')
    })
  })

  describe('可访问性', () => {
    it('should have semantic HTML structure', () => {
      const wrapper = mount(RelatedPosts, {
        props: { posts: mockPosts },
        global: {
          plugins: [router]
        }
      })

      const section = wrapper.find('.related-posts')
      expect(section.exists()).toBe(true)
    })

    it('should have correct tabindex on post items', () => {
      const wrapper = mount(RelatedPosts, {
        props: { posts: mockPosts },
        global: {
          plugins: [router]
        }
      })

      const items = wrapper.findAll('.related-posts__item')
      items.forEach(item => {
        expect(item.attributes('tabindex')).toBe('0')
      })
    })

    it('should have correct aria-label on post items', () => {
      const wrapper = mount(RelatedPosts, {
        props: { posts: mockPosts },
        global: {
          plugins: [router]
        }
      })

      const items = wrapper.findAll('.related-posts__item')
      items.forEach((item, index) => {
        expect(item.attributes('aria-label')).toContain(`阅读文章：${mockPosts[index].title}`)
      })
    })
  })

  describe('响应式布局', () => {
    it('should have correct grid layout', () => {
      const wrapper = mount(RelatedPosts, {
        props: { posts: mockPosts },
        global: {
          plugins: [router]
        }
      })

      const list = wrapper.find('.related-posts__list')
      expect(list.exists()).toBe(true)
    })
  })

  describe('边界情况', () => {
    it('should handle single post', () => {
      const singlePost = [mockPosts[0]]

      const wrapper = mount(RelatedPosts, {
        props: { posts: singlePost },
        global: {
          plugins: [router]
        }
      })

      const items = wrapper.findAll('.related-posts__item')
      expect(items.length).toBe(1)
    })

    it('should handle empty posts array', () => {
      const wrapper = mount(RelatedPosts, {
        props: { posts: [] },
        global: {
          plugins: [router]
        }
      })

      const section = wrapper.find('.related-posts')
      expect(section.exists()).toBe(true)
    })

    it('should handle posts without excerpt', () => {
      const postsWithoutExcerpt = mockPosts.map(post => ({
        ...post,
        excerpt: undefined
      }))

      const wrapper = mount(RelatedPosts, {
        props: { posts: postsWithoutExcerpt },
        global: {
          plugins: [router]
        }
      })

      const items = wrapper.findAll('.related-posts__item')
      expect(items.length).toBe(3)
    })
  })
})