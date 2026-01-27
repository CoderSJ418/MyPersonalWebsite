import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BlogCard from '@/components/blog/BlogCard.vue'
import type { BlogPost } from '@/types/blog'

// Mock theme store
vi.mock('@/stores/useThemeStore', () => ({
  useThemeStore: () => ({
    colorScheme: 'professional-minimal',
    uiStyle: 'glass-morphism',
    darkMode: false
  })
}))

describe('BlogCard', () => {
  const mockPost: BlogPost = {
    id: '1',
    title: 'Vue 3 Composition API 最佳实践',
    excerpt: '深入探讨 Vue 3 Composition API 的使用技巧和最佳实践',
    content: 'Vue 3 的 Composition API 是一个强大的特性',
    author: '佘杰',
    publishedAt: '2024-01-15',
    updatedAt: '2024-01-15',
    tags: ['Vue 3', 'Composition API', 'TypeScript'],
    readTime: 15,
    coverImage: '/images/blog/blog1.jpg',
    category: 'Vue'
  }

  it('should render post title', () => {
    const wrapper = mount(BlogCard, {
      props: { post: mockPost }
    })

    expect(wrapper.find('h2').text()).toBe(mockPost.title)
  })

  it('should render post excerpt', () => {
    const wrapper = mount(BlogCard, {
      props: { post: mockPost }
    })

    expect(wrapper.find('p').text()).toBe(mockPost.excerpt)
  })

  it('should render post tags', () => {
    const wrapper = mount(BlogCard, {
      props: { post: mockPost }
    })

    // 组件中有 1 个分类按钮 + 3 个标签按钮 = 4 个按钮
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBe(4)

    // 第一个按钮是分类按钮
    expect(buttons[0].text()).toBe(mockPost.category)

    // 后三个按钮是标签按钮
    expect(buttons[1].text()).toBe('Vue 3')
    expect(buttons[2].text()).toBe('Composition API')
    expect(buttons[3].text()).toBe('TypeScript')
  })

  it('should emit click event when card is clicked', async () => {
    const wrapper = mount(BlogCard, {
      props: { post: mockPost }
    })

    await wrapper.find('article').trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')![0]).toEqual([mockPost])
  })

  it('should emit tag-click event when tag is clicked', async () => {
    const wrapper = mount(BlogCard, {
      props: { post: mockPost }
    })

    const buttons = wrapper.findAll('button')
    // buttons[0] 是分类按钮，buttons[1] 是第一个标签按钮
    await buttons[1].trigger('click')

    expect(wrapper.emitted('tag-click')).toBeTruthy()
    expect(wrapper.emitted('tag-click')![0]).toEqual(['Vue 3'])
  })

  it('should emit category-click event when category is clicked', async () => {
    const wrapper = mount(BlogCard, {
      props: { post: mockPost }
    })

    const buttons = wrapper.findAll('button')
    // buttons[0] 是分类按钮
    await buttons[0].trigger('click')

    expect(wrapper.emitted('category-click')).toBeTruthy()
    expect(wrapper.emitted('category-click')![0]).toEqual(['Vue'])
  })

  it('should format date correctly', () => {
    const wrapper = mount(BlogCard, {
      props: { post: mockPost }
    })

    const dateText = wrapper.text()
    expect(dateText).toContain('2024年')
    expect(dateText).toContain('1月')
    expect(dateText).toContain('15日')
  })

  it('should display reading time', () => {
    const wrapper = mount(BlogCard, {
      props: { post: mockPost }
    })

    expect(wrapper.text()).toContain('15 分钟')
  })

  it('should not show tags when showTags is false', () => {
    const wrapper = mount(BlogCard, {
      props: { post: mockPost, showTags: false }
    })

    // 当 showTags=false 时，标签区域不显示，但分类按钮仍然显示
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBe(1)
    // 唯一的按钮是分类按钮
    expect(buttons[0].text()).toBe(mockPost.category)
  })

  it('should show cover image when present', () => {
    const wrapper = mount(BlogCard, {
      props: { post: mockPost }
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe(mockPost.coverImage)
    expect(img.attributes('alt')).toBe(mockPost.title)
  })

  it('should not show cover image when not present', () => {
    const postWithoutImage = { ...mockPost, coverImage: undefined }
    const wrapper = mount(BlogCard, {
      props: { post: postWithoutImage }
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(false)
  })

  it('should have correct ARIA attributes', () => {
    const wrapper = mount(BlogCard, {
      props: { post: mockPost }
    })

    const article = wrapper.find('article')
    expect(article.attributes('tabindex')).toBe('0')
  })

  it('should handle keyboard navigation', async () => {
    const wrapper = mount(BlogCard, {
      props: { post: mockPost }
    })

    const article = wrapper.find('article')
    await article.trigger('keydown.enter')

    expect(wrapper.emitted('click')).toBeTruthy()
  })
})