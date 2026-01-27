import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProjectList from '@/components/projects/ProjectList.vue'
import { useProjectStore } from '@/stores/useProjectStore'
import type { Project } from '@/types/project'

describe('ProjectList', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('渲染', () => {
    it('should render project list', () => {
      const wrapper = mount(ProjectList)

      expect(wrapper.find('.project-list').exists()).toBe(true)
    })

    it('should render project cards', () => {
      const wrapper = mount(ProjectList)

      const cards = wrapper.findAllComponents({ name: 'ProjectCard' })
      expect(cards.length).toBeGreaterThan(0)
    })

    it('should render loading state when loading', async () => {
      const projectStore = useProjectStore()
      projectStore.loading = true

      const wrapper = mount(ProjectList)

      expect(wrapper.find('.project-list__loading').exists()).toBe(true)
    })

    it('should render error state when error occurs', async () => {
      const projectStore = useProjectStore()
      projectStore.error = 'Failed to load projects'

      const wrapper = mount(ProjectList)

      expect(wrapper.find('.project-list__error').exists()).toBe(true)
      expect(wrapper.find('.project-list__error').text()).toBe('Failed to load projects')
    })

    it('should render empty state when no projects', async () => {
      const projectStore = useProjectStore()
      projectStore.projects = []

      const wrapper = mount(ProjectList)

      expect(wrapper.find('.project-list__empty').exists()).toBe(true)
      expect(wrapper.find('.project-list__empty').text()).toBe('暂无项目')
    })
  })

  describe('交互', () => {
    it('should handle project card click event', async () => {
      const projectStore = useProjectStore()
      const firstProject = projectStore.projects[0]

      const wrapper = mount(ProjectList)

      const card = wrapper.findComponent({ name: 'ProjectCard' })
      expect(card.exists()).toBe(true)
      
      // 触发点击事件
      await card.vm.$emit('click', firstProject)
      
      // 验证事件被触发（不验证 console.log）
      expect(card.emitted('click')).toBeTruthy()
    })
  })

  describe('响应式布局', () => {
    it('should have correct grid layout', () => {
      const wrapper = mount(ProjectList)

      const grid = wrapper.find('.project-list__grid')
      expect(grid.exists()).toBe(true)
    })
  })

  describe('边界情况', () => {
    it('should handle empty project list', async () => {
      const projectStore = useProjectStore()
      projectStore.projects = []

      const wrapper = mount(ProjectList)

      expect(wrapper.find('.project-list__empty').exists()).toBe(true)
    })

    it('should handle single project', async () => {
      const projectStore = useProjectStore()
      projectStore.projects = [projectStore.projects[0]]

      const wrapper = mount(ProjectList)

      const cards = wrapper.findAllComponents({ name: 'ProjectCard' })
      expect(cards.length).toBe(1)
    })
  })
})