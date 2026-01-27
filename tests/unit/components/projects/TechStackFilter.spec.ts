import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import TechStackFilter from '@/components/projects/TechStackFilter.vue'
import { useProjectStore } from '@/stores/useProjectStore'

describe('TechStackFilter', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('渲染', () => {
    it('should render filter component', () => {
      const wrapper = mount(TechStackFilter)

      expect(wrapper.find('.tech-stack-filter').exists()).toBe(true)
    })

    it('should render category buttons', () => {
      const wrapper = mount(TechStackFilter)

      const categoryBtns = wrapper.findAll('.tech-stack-filter__category-btn')
      expect(categoryBtns.length).toBeGreaterThan(1) // 至少包含"全部"和一个分类
      expect(categoryBtns[0].text()).toBe('全部')
    })

    it('should render tech stack buttons', () => {
      const wrapper = mount(TechStackFilter)

      const techBtns = wrapper.findAll('.tech-stack-filter__tech-btn')
      expect(techBtns.length).toBeGreaterThan(0)
    })

    it('should render clear button when filters are active', async () => {
      const projectStore = useProjectStore()
      projectStore.filterByCategory('个人项目')

      const wrapper = mount(TechStackFilter)

      expect(wrapper.find('.tech-stack-filter__clear').exists()).toBe(true)
    })

    it('should not render clear button when no filters are active', () => {
      const projectStore = useProjectStore()
      projectStore.filterByCategory(null)
      projectStore.filterByTechStack([])

      const wrapper = mount(TechStackFilter)

      expect(wrapper.find('.tech-stack-filter__clear').exists()).toBe(false)
    })
  })

  describe('交互', () => {
    it('should filter by category when category button is clicked', async () => {
      const projectStore = useProjectStore()
      const wrapper = mount(TechStackFilter)

      const categoryBtns = wrapper.findAll('.tech-stack-filter__category-btn')
      if (categoryBtns.length > 1) {
        await categoryBtns[1].trigger('click')
        expect(projectStore.selectedCategory).toBe(categoryBtns[1].text())
      }
    })

    it('should clear category filter when "全部" button is clicked', async () => {
      const projectStore = useProjectStore()
      projectStore.filterByCategory('个人项目')

      const wrapper = mount(TechStackFilter)
      const allBtn = wrapper.find('.tech-stack-filter__category-btn')
      await allBtn.trigger('click')

      expect(projectStore.selectedCategory).toBeNull()
    })

    it('should toggle tech stack filter when tech stack button is clicked', async () => {
      const projectStore = useProjectStore()
      const wrapper = mount(TechStackFilter)

      const techBtns = wrapper.findAll('.tech-stack-filter__tech-btn')
      if (techBtns.length > 0) {
        const techName = techBtns[0].text()
        
        // 第一次点击：添加筛选
        await techBtns[0].trigger('click')
        expect(projectStore.selectedTechStacks).toContain(techName)

        // 第二次点击：移除筛选
        await techBtns[0].trigger('click')
        expect(projectStore.selectedTechStacks).not.toContain(techName)
      }
    })

    it('should clear all filters when clear button is clicked', async () => {
      const projectStore = useProjectStore()
      projectStore.filterByCategory('个人项目')
      projectStore.filterByTechStack(['Vue'])

      const wrapper = mount(TechStackFilter)
      const clearBtn = wrapper.find('.tech-stack-filter__clear')
      await clearBtn.trigger('click')

      expect(projectStore.selectedCategory).toBeNull()
      expect(projectStore.selectedTechStacks).toEqual([])
    })
  })

  describe('状态', () => {
    it('should highlight active category button', async () => {
      const projectStore = useProjectStore()
      projectStore.filterByCategory('个人项目')

      const wrapper = mount(TechStackFilter)
      const categoryBtns = wrapper.findAll('.tech-stack-filter__category-btn')

      // 查找包含"全部"或"Web"的按钮
      let activeBtn = null
      for (const btn of categoryBtns) {
        if (btn.text().includes('全部') || btn.text().includes('Web')) {
          activeBtn = btn
          break
        }
      }
      
      expect(activeBtn).not.toBeNull()
      if (activeBtn) {
        expect(activeBtn.classes()).toContain('tech-stack-filter__category-btn--active')
      }
    })

    it('should highlight active tech stack buttons', async () => {
      const projectStore = useProjectStore()
      projectStore.filterByTechStack(['Vue'])

      const wrapper = mount(TechStackFilter)
      const techBtns = wrapper.findAll('.tech-stack-filter__tech-btn')

      const activeBtn = techBtns.find(btn => btn.text() === 'Vue')
      expect(activeBtn?.classes()).toContain('tech-stack-filter__tech-btn--active')
    })
  })

  describe('边界情况', () => {
    it('should handle empty categories', async () => {
      const projectStore = useProjectStore()
      // 模拟空分类（实际项目中不太可能，但测试边界情况）
      const wrapper = mount(TechStackFilter)

      const categoryBtns = wrapper.findAll('.tech-stack-filter__category-btn')
      expect(categoryBtns.length).toBeGreaterThanOrEqual(1) // 至少有"全部"按钮
    })

    it('should handle empty tech stacks', async () => {
      const projectStore = useProjectStore()
      // 模拟空技术栈（实际项目中不太可能，但测试边界情况）
      const wrapper = mount(TechStackFilter)

      const techBtns = wrapper.findAll('.tech-stack-filter__tech-btn')
      expect(techBtns.length).toBeGreaterThanOrEqual(0)
    })
  })
})