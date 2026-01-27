import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Projects from '@/views/Projects.vue'

describe('Projects', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('渲染', () => {
    it('should render projects page', () => {
      const wrapper = mount(Projects)

      expect(wrapper.find('.min-h-screen').exists()).toBe(true)
    })

    it('should render hero section', () => {
      const wrapper = mount(Projects)

      expect(wrapper.findAll('section').length).toBeGreaterThanOrEqual(1)
    })

    it('should render page title', () => {
      const wrapper = mount(Projects)

      const title = wrapper.find('h1')
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe('项目展示')
    })

    it('should render page description', () => {
      const wrapper = mount(Projects)

      const description = wrapper.find('p')
      expect(description.exists()).toBe(true)
      expect(description.text()).toContain('从企业官网到 SaaS 平台')
    })

    it('should render filter section', () => {
      const wrapper = mount(Projects)

      expect(wrapper.findAll('section').length).toBeGreaterThanOrEqual(2)
    })

    it('should render projects section', () => {
      const wrapper = mount(Projects)

      expect(wrapper.findAll('section').length).toBeGreaterThanOrEqual(3)
    })

    it('should render TechStackFilter component', () => {
      const wrapper = mount(Projects)

      expect(wrapper.findComponent({ name: 'TechStackFilter' }).exists()).toBe(true)
    })

    it('should render ProjectList component', () => {
      const wrapper = mount(Projects)

      expect(wrapper.findComponent({ name: 'ProjectList' }).exists()).toBe(true)
    })
  })

  describe('响应式布局', () => {
    it('should have correct layout structure', () => {
      const wrapper = mount(Projects)

      const sections = wrapper.findAll('section')

      expect(sections.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('生命周期', () => {
    it('should load projects on mount', async () => {
      const { useProjectStore } = await import('@/stores/useProjectStore')
      const projectStore = useProjectStore()

      const wrapper = mount(Projects)

      // 等待 onMounted 完成
      await new Promise(resolve => setTimeout(resolve, 100))

      // 验证 projects 被加载
      expect(projectStore.projects.length).toBeGreaterThan(0)
    })
  })

  describe('边界情况', () => {
    it('should handle empty project list', async () => {
      const wrapper = mount(Projects)

      // 等待 onMounted 完成
      await new Promise(resolve => setTimeout(resolve, 100))

      // 验证页面仍然渲染
      expect(wrapper.find('.min-h-screen').exists()).toBe(true)
    })
  })
})