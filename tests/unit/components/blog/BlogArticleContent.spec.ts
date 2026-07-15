// @vitest-environment jsdom

import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import BlogArticleContent from '@/components/blog/BlogArticleContent.vue'

describe('BlogArticleContent', () => {
  beforeEach(() => {
    vi.stubGlobal('scrollBy', vi.fn())
  })

  it('defers the long-form body until the reader expands it', async () => {
    const wrapper = mount(BlogArticleContent, {
      props: {
        content: '## 摘要\n\n先读结论。\n\n<!-- article-fold -->\n\n## 完整正文\n\n深入内容。',
        readTime: 35
      }
    })

    await vi.waitFor(() => expect(wrapper.text()).toContain('先读结论'))
    expect(wrapper.text()).not.toContain('深入内容')

    const toggle = wrapper.get('button[aria-expanded="false"]')
    expect(toggle.text()).toContain('展开完整文章')
    await toggle.trigger('click')
    await flushPromises()
    await vi.waitFor(() => expect(wrapper.text()).toContain('深入内容'))
    expect(wrapper.get('button').attributes('aria-expanded')).toBe('true')
  })

  it('renders a regular article without an expand control', async () => {
    const wrapper = mount(BlogArticleContent, {
      props: { content: '## 普通文章\n\n正文内容。' }
    })

    await vi.waitFor(() => expect(wrapper.text()).toContain('正文内容'))
    expect(wrapper.find('button').exists()).toBe(false)
  })
})
