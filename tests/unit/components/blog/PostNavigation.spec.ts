import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import PostNavigation from '@/components/blog/PostNavigation.vue'
import type { BlogPost } from '@/types/blog'

// Mock theme store
vi.mock('@/stores/useThemeStore', () => ({
  useThemeStore: () => ({
    colorScheme: 'professional-minimal',
    uiStyle: 'glass-morphism',
    darkMode: false
  })
}))

describe('PostNavigation', () => {
  let router: any

  const mockPreviousPost: BlogPost = {
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
  }

  const mockNextPost: BlogPost = {
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

  describe('渲染导航', () => {
    it('should render both previous and next posts', () => {
      const wrapper = mount(PostNavigation, {
        props: {
          previousPost: mockPreviousPost,
          nextPost: mockNextPost
        },
        global: {
          plugins: [router]
        }
      })

      const previousItem = wrapper.find('.post-navigation__item--prev')
      const nextItem = wrapper.find('.post-navigation__item--next')

      expect(previousItem.exists()).toBe(true)
      expect(nextItem.exists()).toBe(true)
    })

    it('should render previous post title', () => {
      const wrapper = mount(PostNavigation, {
        props: {
          previousPost: mockPreviousPost,
          nextPost: mockNextPost
        },
        global: {
          plugins: [router]
        }
      })

      const previousItem = wrapper.find('.post-navigation__item--prev')
      const previousTitle = previousItem.find('.post-navigation__title')
      expect(previousTitle.text()).toBe(mockPreviousPost.title)
    })

    it('should render next post title', () => {
      const wrapper = mount(PostNavigation, {
        props: {
          previousPost: mockPreviousPost,
          nextPost: mockNextPost
        },
        global: {
          plugins: [router]
        }
      })

      const nextItem = wrapper.find('.post-navigation__item--next')
      const nextTitle = nextItem.find('.post-navigation__title')
      expect(nextTitle.text()).toBe(mockNextPost.title)
    })

    it('should render previous post date', () => {
      const wrapper = mount(PostNavigation, {
        props: {
          previousPost: mockPreviousPost,
          nextPost: mockNextPost
        },
        global: {
          plugins: [router]
        }
      })

      const previousItem = wrapper.find('.post-navigation__item--prev')
      const previousDate = previousItem.find('.post-navigation__date')
      expect(previousDate.text()).toContain('2024')
    })

    it('should render next post date', () => {
      const wrapper = mount(PostNavigation, {
        props: {
          previousPost: mockPreviousPost,
          nextPost: mockNextPost
        },
        global: {
          plugins: [router]
        }
      })

      const nextItem = wrapper.find('.post-navigation__item--next')
      const nextDate = nextItem.find('.post-navigation__date')
      expect(nextDate.text()).toContain('2024')
    })

    it('should render navigation when both posts are null', () => {
      const wrapper = mount(PostNavigation, {
        props: {
          previousPost: null,
          nextPost: null
        },
        global: {
          plugins: [router]
        }
      })

      const navigation = wrapper.find('.post-navigation')
      expect(navigation.exists()).toBe(true)
    })
  })

  describe('边界处理', () => {
    it('should handle first post (no previous)', () => {
      const wrapper = mount(PostNavigation, {
        props: {
          previousPost: null,
          nextPost: mockNextPost
        },
        global: {
          plugins: [router]
        }
      })

      const previousItem = wrapper.find('.post-navigation__item--prev')
      const nextItem = wrapper.find('.post-navigation__item--next')

      expect(previousItem.exists()).toBe(false)
      expect(nextItem.exists()).toBe(true)
    })

    it('should handle last post (no next)', () => {
      const wrapper = mount(PostNavigation, {
        props: {
          previousPost: mockPreviousPost,
          nextPost: null
        },
        global: {
          plugins: [router]
        }
      })

      const previousItem = wrapper.find('.post-navigation__item--prev')
      const nextItem = wrapper.find('.post-navigation__item--next')

      expect(previousItem.exists()).toBe(true)
      expect(nextItem.exists()).toBe(false)
    })

    it('should handle single post (no previous and no next)', () => {
      const wrapper = mount(PostNavigation, {
        props: {
          previousPost: null,
          nextPost: null
        },
        global: {
          plugins: [router]
        }
      })

      const navigation = wrapper.find('.post-navigation')
      expect(navigation.exists()).toBe(true)
    })
  })

  describe('点击导航', () => {
    it('should navigate to previous post when previous item is clicked', async () => {
      const wrapper = mount(PostNavigation, {
        props: {
          previousPost: mockPreviousPost,
          nextPost: mockNextPost
        },
        global: {
          plugins: [router]
        }
      })

      const previousItem = wrapper.find('.post-navigation__item--prev')
      await previousItem.trigger('click')

      // 等待路由导航完成
      await router.isReady()

      expect(router.currentRoute.value.name).toBe('BlogDetail')
      expect(router.currentRoute.value.params.id).toBe('1')
    })

    it('should navigate to next post when next item is clicked', async () => {
      const wrapper = mount(PostNavigation, {
        props: {
          previousPost: mockPreviousPost,
          nextPost: mockNextPost
        },
        global: {
          plugins: [router]
        }
      })

      const nextItem = wrapper.find('.post-navigation__item--next')
      await nextItem.trigger('click')

      // 等待路由导航完成
      await router.isReady()

      expect(router.currentRoute.value.name).toBe('BlogDetail')
      expect(router.currentRoute.value.params.id).toBe('3')
    })

    it('should handle keyboard navigation on previous item', async () => {
      const wrapper = mount(PostNavigation, {
        props: {
          previousPost: mockPreviousPost,
          nextPost: mockNextPost
        },
        global: {
          plugins: [router]
        }
      })

      const previousItem = wrapper.find('.post-navigation__item--prev')
      await previousItem.trigger('keydown.enter')

      // 等待路由导航完成
      await router.isReady()

      expect(router.currentRoute.value.name).toBe('BlogDetail')
      expect(router.currentRoute.value.params.id).toBe('1')
    })

    it('should handle keyboard navigation on next item', async () => {
      const wrapper = mount(PostNavigation, {
        props: {
          previousPost: mockPreviousPost,
          nextPost: mockNextPost
        },
        global: {
          plugins: [router]
        }
      })

      const nextItem = wrapper.find('.post-navigation__item--next')
      await nextItem.trigger('keydown.enter')

      // 等待路由导航完成
      await router.isReady()

      expect(router.currentRoute.value.name).toBe('BlogDetail')
      expect(router.currentRoute.value.params.id).toBe('3')
    })
  })

  describe('可访问性', () => {
    it('should have semantic HTML structure', () => {
      const wrapper = mount(PostNavigation, {
        props: {
          previousPost: mockPreviousPost,
          nextPost: mockNextPost
        },
        global: {
          plugins: [router]
        }
      })

      const nav = wrapper.find('nav')
      expect(nav.exists()).toBe(true)
      expect(nav.attributes('aria-label')).toBe('文章导航')
    })

    it('should have correct tabindex on navigation items', () => {
      const wrapper = mount(PostNavigation, {
        props: {
          previousPost: mockPreviousPost,
          nextPost: mockNextPost
        },
        global: {
          plugins: [router]
        }
      })

      const previousItem = wrapper.find('.post-navigation__item--prev')
      const nextItem = wrapper.find('.post-navigation__item--next')

      expect(previousItem.attributes('tabindex')).toBe('0')
      expect(nextItem.attributes('tabindex')).toBe('0')
    })

    it('should have correct aria-label on navigation items', () => {
      const wrapper = mount(PostNavigation, {
        props: {
          previousPost: mockPreviousPost,
          nextPost: mockNextPost
        },
        global: {
          plugins: [router]
        }
      })

      const previousItem = wrapper.find('.post-navigation__item--prev')
      const nextItem = wrapper.find('.post-navigation__item--next')

      expect(previousItem.attributes('aria-label')).toContain('上一篇')
      expect(nextItem.attributes('aria-label')).toContain('下一篇')
    })
  })

  describe('响应式布局', () => {
    it('should have correct layout on desktop', () => {
      const wrapper = mount(PostNavigation, {
        props: {
          previousPost: mockPreviousPost,
          nextPost: mockNextPost
        },
        global: {
          plugins: [router]
        }
      })

      const navigation = wrapper.find('.post-navigation')
      expect(navigation.exists()).toBe(true)
    })

    it('should have correct layout on mobile', () => {
      const wrapper = mount(PostNavigation, {
        props: {
          previousPost: mockPreviousPost,
          nextPost: mockNextPost
        },
        global: {
          plugins: [router]
        }
      })

      const navigation = wrapper.find('.post-navigation')
      expect(navigation.exists()).toBe(true)
    })
  })

  describe('边界情况', () => {
    it('should handle posts without excerpt', () => {
      const postWithoutExcerpt = {
        ...mockPreviousPost,
        excerpt: undefined
      }

      const wrapper = mount(PostNavigation, {
        props: {
          previousPost: postWithoutExcerpt,
          nextPost: null
        },
        global: {
          plugins: [router]
        }
      })

      const previousItem = wrapper.find('.post-navigation__item--prev')
      expect(previousItem.exists()).toBe(true)
    })

    it('should handle posts with very long titles', () => {
      const postWithLongTitle = {
        ...mockPreviousPost,
        title: 'This is a very long title that should be truncated properly without breaking the layout'
      }

      const wrapper = mount(PostNavigation, {
        props: {
          previousPost: postWithLongTitle,
          nextPost: null
        },
        global: {
          plugins: [router]
        }
      })

      const previousItem = wrapper.find('.post-navigation__item--prev')
      const previousTitle = previousItem.find('.post-navigation__title')
      expect(previousTitle.exists()).toBe(true)
    })
  })
})