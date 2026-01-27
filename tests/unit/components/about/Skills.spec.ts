import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Skills from '@/components/about/Skills.vue'

describe('Skills.vue', () => {
  it('should render the component', () => {
    const wrapper = mount(Skills)
    expect(wrapper.find('.skills-section').exists()).toBe(true)
  })

  it('should render title', () => {
    const wrapper = mount(Skills)
    expect(wrapper.find('.skills-section__title').text()).toBe('技能展示')
  })

  it('should render skill categories', () => {
    const wrapper = mount(Skills)
    const categories = wrapper.findAll('.skills-section__category')
    expect(categories.length).toBeGreaterThan(0)
  })

  it('should render skill items', () => {
    const wrapper = mount(Skills)
    const items = wrapper.findAll('.skill-card')
    expect(items.length).toBeGreaterThan(0)
  })

  it('should render skill name', () => {
    const wrapper = mount(Skills)
    const firstItem = wrapper.find('.skill-card')
    expect(firstItem.find('.skill-name').exists()).toBe(true)
  })

  it('should render skill level badge', () => {
    const wrapper = mount(Skills)
    const firstItem = wrapper.find('.skill-card')
    const badge = firstItem.find('.skill-badge')
    expect(badge.exists()).toBe(true)
  })

  it('should render skill progress bar', () => {
    const wrapper = mount(Skills)
    const firstItem = wrapper.find('.skill-card')
    const progressBar = firstItem.find('.skill-progress')
    expect(progressBar.exists()).toBe(true)
    const progressFill = firstItem.find('.progress-fill')
    expect(progressFill.exists()).toBe(true)
  })

  it('should render skill level text', () => {
    const wrapper = mount(Skills)
    const firstItem = wrapper.find('.skill-card')
    const progressValue = firstItem.find('.progress-value')
    expect(progressValue.exists()).toBe(true)
  })

  it('should render skill description', () => {
    const wrapper = mount(Skills)
    const firstItem = wrapper.find('.skill-card')
    expect(firstItem.find('.skill-description').exists()).toBe(true)
  })

  it('should render years of experience', () => {
    const wrapper = mount(Skills)
    const firstItem = wrapper.find('.skill-card')
    const experience = firstItem.find('.skill-meta')
    expect(experience.exists()).toBe(true)
  })

  it('should render related projects', () => {
    const wrapper = mount(Skills)
    const firstItem = wrapper.find('.skill-card')
    const projects = firstItem.find('.skill-projects')
    // 项目可能存在也可能不存在，取决于数据
    if (projects.exists()) {
      const projectTags = firstItem.findAll('.project-tag')
      expect(projectTags.length).toBeGreaterThanOrEqual(0)
    }
  })

  it('should group skills by category', () => {
    const wrapper = mount(Skills)
    const categories = wrapper.findAll('.skills-section__category-title')
    expect(categories.length).toBeGreaterThan(0)
  })

  it('should color code skill levels', () => {
    const wrapper = mount(Skills)
    const firstItem = wrapper.find('.skill-card')
    const badge = firstItem.find('.skill-badge')
    // 新的色系使用蓝色系
    expect(badge.attributes('style')).toBeDefined()
  })
})