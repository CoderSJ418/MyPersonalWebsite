import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CodeBlock from '@/components/blog/CodeBlock.vue'

// Mock clipboard API
const mockClipboard = {
  writeText: vi.fn()
}

Object.defineProperty(navigator, 'clipboard', {
  value: mockClipboard,
  writable: true,
  configurable: true
})

describe('CodeBlock', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  describe('渲染代码块', () => {
    it('should render code content', () => {
      const code = 'const hello = "world";'
      const wrapper = mount(CodeBlock, {
        props: { code }
      })

      const codeElement = wrapper.find('code')
      expect(codeElement.exists()).toBe(true)
      expect(codeElement.html()).toContain(code)
    })

    it('should render language label', () => {
      const wrapper = mount(CodeBlock, {
        props: {
          code: 'const hello = "world";',
          language: 'javascript'
        }
      })

      const languageLabel = wrapper.find('.code-block__language')
      expect(languageLabel.text()).toBe('javascript')
    })

    it('should render version label when version is provided', () => {
      const wrapper = mount(CodeBlock, {
        props: {
          code: 'const hello = "world";',
          version: 'Vue 3.4.15'
        }
      })

      const versionLabel = wrapper.find('.code-block__version-text')
      expect(versionLabel.text()).toBe('Vue 3.4.15')
    })

    it('should not render version label when version is not provided', () => {
      const wrapper = mount(CodeBlock, {
        props: {
          code: 'const hello = "world";'
        }
      })

      const versionLabel = wrapper.find('.code-block__version')
      expect(versionLabel.exists()).toBe(false)
    })

    it('should render copy button by default', () => {
      const wrapper = mount(CodeBlock, {
        props: {
          code: 'const hello = "world";'
        }
      })

      const copyButton = wrapper.find('.code-block__copy')
      expect(copyButton.exists()).toBe(true)
    })

    it('should not render copy button when showCopy is false', () => {
      const wrapper = mount(CodeBlock, {
        props: {
          code: 'const hello = "world";',
          showCopy: false
        }
      })

      const copyButton = wrapper.find('.code-block__copy')
      expect(copyButton.exists()).toBe(false)
    })
  })

  describe('复制功能', () => {
    it('should copy code to clipboard when copy button is clicked', async () => {
      const code = 'const hello = "world";'
      const wrapper = mount(CodeBlock, {
        props: { code }
      })

      const copyButton = wrapper.find('.code-block__copy')
      await copyButton.trigger('click')

      expect(mockClipboard.writeText).toHaveBeenCalledWith(code)
    })

    it('should show copied state after successful copy', async () => {
      const code = 'const hello = "world";'
      mockClipboard.writeText.mockResolvedValue(undefined)

      const wrapper = mount(CodeBlock, {
        props: { code }
      })

      const copyButton = wrapper.find('.code-block__copy')
      await copyButton.trigger('click')

      expect(wrapper.text()).toContain('已复制')
      expect(wrapper.find('.code-block__copy-icon-success').exists()).toBe(true)
    })

    it('should show copied state after successful copy', async () => {
      const code = 'const hello = "world";'
      const wrapper = mount(CodeBlock, {
        props: { code }
      })

      // 点击复制按钮
      const copyButton = wrapper.find('.code-block__copy')
      await copyButton.trigger('click')

      // 等待异步操作完成
      await new Promise(resolve => setTimeout(resolve, 100))

      // 检查复制状态
      expect(wrapper.vm.copied).toBe(true)
      expect(copyButton.attributes('aria-label')).toBe('已复制')
    })

    it('should reset copied state after 2 seconds', async () => {
      const code = 'const hello = "world";'
      const wrapper = mount(CodeBlock, {
        props: { code }
      })

      // 点击复制按钮
      const copyButton = wrapper.find('.code-block__copy')
      await copyButton.trigger('click')

      // 等待2秒
      vi.advanceTimersByTime(2000)
      await new Promise(resolve => setTimeout(resolve, 2100))

      // 检查复制状态是否重置
      expect(wrapper.vm.copied).toBe(false)
      expect(copyButton.attributes('disabled')).toBeUndefined()
    })

    it('should disable copy button while copied', async () => {
      const code = 'const hello = "world";'
      const wrapper = mount(CodeBlock, {
        props: { code }
      })

      // 点击复制按钮
      const copyButton = wrapper.find('.code-block__copy')
      await copyButton.trigger('click')

      // 等待异步操作完成
      await new Promise(resolve => setTimeout(resolve, 100))

      // 检查组件状态
      expect(wrapper.vm.copied).toBe(true)
      expect(copyButton.attributes('disabled')).toBe('disabled')

      // 等待2秒，复制状态应该重置
      vi.advanceTimersByTime(2000)
      await new Promise(resolve => setTimeout(resolve, 2100))

      // 检查按钮是否恢复启用
      expect(wrapper.vm.copied).toBe(false)
      expect(copyButton.attributes('disabled')).toBeUndefined()
    })

    it('should update aria-label after successful copy', async () => {
      const code = 'const hello = "world";'
      const wrapper = mount(CodeBlock, {
        props: { code }
      })

      // 点击复制按钮
      const copyButton = wrapper.find('.code-block__copy')
      await copyButton.trigger('click')

      // 等待异步操作完成
      await new Promise(resolve => setTimeout(resolve, 100))

      // 检查组件状态
      expect(wrapper.vm.copied).toBe(true)
      expect(copyButton.attributes('aria-label')).toBe('已复制')
    })

    it('should handle copy error gracefully', async () => {
      const code = 'const hello = "world";'
      const error = new Error('Copy failed')
      mockClipboard.writeText.mockRejectedValue(error)

      // Mock console.error 以避免在测试输出中显示错误
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const wrapper = mount(CodeBlock, {
        props: { code }
      })

      const copyButton = wrapper.find('.code-block__copy')
      await copyButton.trigger('click')

      // 等待 Promise 被拒绝和错误处理完成
      // 使用 flushPromises 来等待所有待处理的 Promise
      await wrapper.vm.$nextTick()

      // 验证错误被正确捕获和处理
      expect(consoleSpy).toHaveBeenCalledWith('Failed to copy code:', error)
      expect(wrapper.vm.copyError).toBe(true)
      expect(wrapper.text()).toContain('复制')

      // 清理：重置错误状态
      vi.advanceTimersByTime(2000)
      await vi.runAllTimersAsync()
      await wrapper.vm.$nextTick()

      consoleSpy.mockRestore()
    })

    it('should reset error state after 2 seconds', async () => {
      const code = 'const hello = "world";'
      const error = new Error('Copy failed')
      mockClipboard.writeText.mockRejectedValue(error)

      // Mock console.error 以避免在测试输出中显示错误
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const wrapper = mount(CodeBlock, {
        props: { code }
      })

      const copyButton = wrapper.find('.code-block__copy')
      await copyButton.trigger('click')

      // 等待 Promise 被拒绝
      await wrapper.vm.$nextTick()

      // 验证错误状态已设置
      expect(wrapper.vm.copyError).toBe(true)

      // 推进时间以触发 setTimeout
      vi.advanceTimersByTime(2000)

      // 等待所有待处理的微任务和计时器回调完成
      await vi.runAllTimersAsync()
      await wrapper.vm.$nextTick()

      // 验证错误状态已重置
      expect(wrapper.vm.copyError).toBe(false)

      consoleSpy.mockRestore()
    })

    it('should disable copy button while copied', async () => {
      const code = 'const hello = "world";'
      const wrapper = mount(CodeBlock, {
        props: { code }
      })

      // 点击复制按钮
      const copyButton = wrapper.find('.code-block__copy')
      await copyButton.trigger('click')

      // 等待异步操作完成
      await new Promise(resolve => setTimeout(resolve, 100))

      // 检查组件状态
      expect(wrapper.vm.copied).toBe(true)
      expect(copyButton.attributes('disabled')).toBe('disabled')

      // 等待2秒，复制状态应该重置
      vi.advanceTimersByTime(2000)
      await new Promise(resolve => setTimeout(resolve, 2100))

      // 检查按钮是否恢复启用
      expect(wrapper.vm.copied).toBe(false)
      expect(copyButton.attributes('disabled')).toBeUndefined()
    })

    it('should update aria-label after successful copy', async () => {
      const code = 'const hello = "world";'
      const wrapper = mount(CodeBlock, {
        props: { code }
      })

      // 点击复制按钮
      const copyButton = wrapper.find('.code-block__copy')
      await copyButton.trigger('click')

      // 等待异步操作完成
      await new Promise(resolve => setTimeout(resolve, 100))

      // 检查组件状态
      expect(wrapper.vm.copied).toBe(true)
      expect(copyButton.attributes('aria-label')).toBe('已复制')
    })
  })

  describe('可访问性', () => {
    it('should have correct aria-label on copy button', () => {
      const wrapper = mount(CodeBlock, {
        props: {
          code: 'const hello = "world";'
        }
      })

      const copyButton = wrapper.find('.code-block__copy')
      expect(copyButton.attributes('aria-label')).toBe('复制代码')
    })

    it('should update aria-label after successful copy', async () => {
      const code = 'const hello = "world";'
      mockClipboard.writeText.mockResolvedValue(undefined)

      const wrapper = mount(CodeBlock, {
        props: { code }
      })

      const copyButton = wrapper.find('.code-block__copy')
      await copyButton.trigger('click')

      expect(copyButton.attributes('aria-label')).toBe('已复制')
    })

    it('should have semantic HTML structure', () => {
      const wrapper = mount(CodeBlock, {
        props: {
          code: 'const hello = "world";'
        }
      })

      expect(wrapper.find('pre').exists()).toBe(true)
      expect(wrapper.find('code').exists()).toBe(true)
    })

    it('should have correct language class on code element', () => {
      const wrapper = mount(CodeBlock, {
        props: {
          code: 'const hello = "world";',
          language: 'javascript'
        }
      })

      const codeElement = wrapper.find('code')
      expect(codeElement.classes()).toContain('language-javascript')
    })
  })

  describe('样式和布局', () => {
    it('should have correct CSS classes', () => {
      const wrapper = mount(CodeBlock, {
        props: {
          code: 'const hello = "world";'
        }
      })

      expect(wrapper.find('.code-block').exists()).toBe(true)
      expect(wrapper.find('.code-block__header').exists()).toBe(true)
      expect(wrapper.find('.code-block__content').exists()).toBe(true)
    })

    it('should apply version label styles', () => {
      const wrapper = mount(CodeBlock, {
        props: {
          code: 'const hello = "world";',
          version: 'Vue 3.4.15'
        }
      })

      const versionLabel = wrapper.find('.code-block__version')
      expect(versionLabel.classes()).toContain('code-block__version')
    })
  })

  describe('边界情况', () => {
    it('should handle empty code', () => {
      const wrapper = mount(CodeBlock, {
        props: {
          code: ''
        }
      })

      const codeElement = wrapper.find('code')
      expect(codeElement.exists()).toBe(true)
    })

    it('should handle very long code', () => {
      const longCode = 'const hello = "world";'.repeat(1000)

      const wrapper = mount(CodeBlock, {
        props: {
          code: longCode
        }
      })

      const codeElement = wrapper.find('code')
      expect(codeElement.html()).toContain(longCode)
    })

    it('should handle special characters in code', () => {
      const specialCode = '<div class="test">Hello & "World"</div>'

      const wrapper = mount(CodeBlock, {
        props: {
          code: specialCode
        }
      })

      // 代码内容通过 v-html 渲染，特殊字符会保持原样
      expect(wrapper.html()).toContain('Hello')
      expect(wrapper.html()).toContain('World')
    })

    it('should handle undefined language', () => {
      const wrapper = mount(CodeBlock, {
        props: {
          code: 'const hello = "world";',
          language: undefined
        }
      })

      const languageLabel = wrapper.find('.code-block__language')
      expect(languageLabel.text()).toBe('plaintext')
    })
  })

  describe('Props 默认值', () => {
    it('should use default language when not provided', () => {
      const wrapper = mount(CodeBlock, {
        props: {
          code: 'const hello = "world";'
        }
      })

      const languageLabel = wrapper.find('.code-block__language')
      expect(languageLabel.text()).toBe('plaintext')
    })

    it('should use default showCopy when not provided', () => {
      const wrapper = mount(CodeBlock, {
        props: {
          code: 'const hello = "world";'
        }
      })

      const copyButton = wrapper.find('.code-block__copy')
      expect(copyButton.exists()).toBe(true)
    })
  })
})