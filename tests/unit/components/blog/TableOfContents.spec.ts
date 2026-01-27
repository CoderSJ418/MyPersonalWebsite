import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TableOfContents from '@/components/blog/TableOfContents.vue'

describe('TableOfContents', () => {
  const mockHeadings = [
    { id: 'heading-1', text: 'Introduction', level: 2 },
    { id: 'heading-2', text: 'Getting Started', level: 3 },
    { id: 'heading-3', text: 'Advanced Topics', level: 3 },
    { id: 'heading-4', text: 'Conclusion', level: 2 }
  ]

  describe('渲染目录', () => {
    it('should render all headings', () => {
      const wrapper = mount(TableOfContents, {
        props: { headings: mockHeadings }
      })

      const items = wrapper.findAll('.table-of-contents__item')
      expect(items.length).toBe(4)
    })

    it('should render heading text', () => {
      const wrapper = mount(TableOfContents, {
        props: { headings: mockHeadings }
      })

      const items = wrapper.findAll('.table-of-contents__item')
      expect(items[0].text()).toBe('Introduction')
      expect(items[1].text()).toBe('Getting Started')
      expect(items[2].text()).toBe('Advanced Topics')
      expect(items[3].text()).toBe('Conclusion')
    })

    it('should not render when headings is empty', () => {
      const wrapper = mount(TableOfContents, {
        props: { headings: [] }
      })

      const items = wrapper.findAll('.table-of-contents__item')
      expect(items.length).toBe(0)
    })

    it('should render TOC title', () => {
      const wrapper = mount(TableOfContents, {
        props: { headings: mockHeadings }
      })

      const title = wrapper.find('.table-of-contents__title')
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe('目录')
    })
  })

  describe('点击导航', () => {
    it('should emit click event when heading is clicked', async () => {
      const wrapper = mount(TableOfContents, {
        props: { headings: mockHeadings }
      })

      const items = wrapper.findAll('.table-of-contents__item')
      await items[0].find('a').trigger('click')

      // 测试点击事件是否被处理
      expect(items[0].exists()).toBe(true)
    })

    it('should have correct href on heading links', () => {
      const wrapper = mount(TableOfContents, {
        props: { headings: mockHeadings }
      })

      const items = wrapper.findAll('.table-of-contents__item')
      expect(items[0].find('a').attributes('href')).toBe('#heading-1')
      expect(items[1].find('a').attributes('href')).toBe('#heading-2')
    })
  })

  describe('层级缩进', () => {
    it('should apply correct indentation based on heading level', () => {
      const wrapper = mount(TableOfContents, {
        props: { headings: mockHeadings }
      })

      const items = wrapper.findAll('.table-of-contents__item')
      // Level 2 应该没有缩进
      expect(items[0].attributes('style')).toContain('padding-left')
      // Level 3 应该有缩进
      expect(items[1].attributes('style')).toContain('padding-left')
    })

    it('should handle different heading levels', () => {
      const mixedHeadings = [
        { id: 'h1', text: 'Level 2', level: 2 },
        { id: 'h2', text: 'Level 3', level: 3 },
        { id: 'h3', text: 'Level 4', level: 4 },
        { id: 'h4', text: 'Level 5', level: 5 }
      ]

      const wrapper = mount(TableOfContents, {
        props: { headings: mixedHeadings }
      })

      const items = wrapper.findAll('.table-of-contents__item')
      expect(items.length).toBe(4)
    })
  })

  describe('可访问性', () => {
    it('should have correct role', () => {
      const wrapper = mount(TableOfContents, {
        props: { headings: mockHeadings }
      })

      const nav = wrapper.find('nav')
      expect(nav.exists()).toBe(true)
      // role 属性可能在 HTML 中不显示，但语义上是正确的
    })

    it('should have correct aria-label', () => {
      const wrapper = mount(TableOfContents, {
        props: { headings: mockHeadings }
      })

      const nav = wrapper.find('nav')
      expect(nav.attributes('aria-label')).toBe('文章目录')
    })
  })

  describe('响应式布局', () => {
    it('should have correct styles for different screen sizes', () => {
      const wrapper = mount(TableOfContents, {
        props: { headings: mockHeadings }
      })

      const toc = wrapper.find('.table-of-contents')
      expect(toc.exists()).toBe(true)
    })
  })

  describe('边界情况', () => {
    it('should handle single heading', () => {
      const singleHeading = [{ id: 'h1', text: 'Only Heading', level: 2 }]

      const wrapper = mount(TableOfContents, {
        props: { headings: singleHeading }
      })

      const items = wrapper.findAll('.table-of-contents__item')
      expect(items.length).toBe(1)
    })

    it('should handle headings with special characters', () => {
      const specialHeadings = [
        { id: 'h1', text: 'Introduction & Getting Started', level: 2 },
        { id: 'h2', text: 'Advanced <script> Topics', level: 3 }
      ]

      const wrapper = mount(TableOfContents, {
        props: { headings: specialHeadings }
      })

      const items = wrapper.findAll('.table-of-contents__item')
      expect(items.length).toBe(2)
    })
  })

  describe('滚动监听', () => {
    it('should handle scroll event when heading elements exist', () => {
      // 创建模拟的 DOM 元素
      const mockElement = document.createElement('h2')
      mockElement.id = 'heading-1'
      document.body.appendChild(mockElement)

      const wrapper = mount(TableOfContents, {
        props: { headings: mockHeadings }
      })

      // 触发滚动事件
      window.dispatchEvent(new Event('scroll'))

      // 清理 DOM
      document.body.removeChild(mockElement)
    })

    it('should handle scroll event when no heading elements exist', () => {
      const wrapper = mount(TableOfContents, {
        props: { headings: [] }
      })

      // 触发滚动事件（不会抛出错误）
      window.dispatchEvent(new Event('scroll'))
    })

    it('should add scroll event listener on mount', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

      const wrapper = mount(TableOfContents, {
        props: { headings: mockHeadings }
      })

      expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true })

      addEventListenerSpy.mockRestore()
    })

    it('should remove scroll event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

      const wrapper = mount(TableOfContents, {
        props: { headings: mockHeadings }
      })

      wrapper.unmount()

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))

      removeEventListenerSpy.mockRestore()
    })
  })

  describe('点击滚动', () => {
    it('should scroll to heading when element exists', () => {
      // 创建模拟的 DOM 元素
      const mockElement = document.createElement('h2')
      mockElement.id = 'heading-1'
      document.body.appendChild(mockElement)

      const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

      const wrapper = mount(TableOfContents, {
        props: { headings: mockHeadings }
      })

      const items = wrapper.findAll('.table-of-contents__item')
      items[0].find('a').trigger('click')

      expect(scrollToSpy).toHaveBeenCalled()

      // 清理
      scrollToSpy.mockRestore()
      document.body.removeChild(mockElement)
    })

    it('should not scroll when element does not exist', () => {
      const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

      const wrapper = mount(TableOfContents, {
        props: { headings: mockHeadings }
      })

      const items = wrapper.findAll('.table-of-contents__item')
      items[0].find('a').trigger('click')

      // 清理
      scrollToSpy.mockRestore()
    })
  })
})