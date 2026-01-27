import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WorkExperience from '@/components/about/WorkExperience.vue'

describe('WorkExperience.vue', () => {
  it('should render the component', () => {
    const wrapper = mount(WorkExperience)
    expect(wrapper.find('.work-experience').exists()).toBe(true)
  })

  it('should render title', () => {
    const wrapper = mount(WorkExperience)
    expect(wrapper.find('.work-experience__title').text()).toBe('工作经历')
  })

  it('should render work experience items', () => {
    const wrapper = mount(WorkExperience)
    const items = wrapper.findAll('.work-experience__item')
    expect(items.length).toBe(3)
  })

  it('should render company name', () => {
    const wrapper = mount(WorkExperience)
    const firstItem = wrapper.find('.work-experience__item')
    expect(firstItem.find('.work-experience__company-name').text()).toBe('某科技公司')
  })

  it('should render current badge for current job', () => {
    const wrapper = mount(WorkExperience)
    const firstItem = wrapper.find('.work-experience__item')
    expect(firstItem.find('.work-experience__current').exists()).toBe(true)
    expect(firstItem.find('.work-experience__current').text()).toBe('当前')
  })

  it('should not render current badge for past job', () => {
    const wrapper = mount(WorkExperience)
    const items = wrapper.findAll('.work-experience__item')
    const lastItem = items[items.length - 1]
    expect(lastItem.find('.work-experience__current').exists()).toBe(false)
  })

  it('should render position', () => {
    const wrapper = mount(WorkExperience)
    const firstItem = wrapper.find('.work-experience__item')
    expect(firstItem.find('.work-experience__position').text()).toBe('高级前端工程师')
  })

  it('should render location', () => {
    const wrapper = mount(WorkExperience)
    const firstItem = wrapper.find('.work-experience__item')
    expect(firstItem.find('.work-experience__location').text()).toBe('上海')
  })

  it('should render duration', () => {
    const wrapper = mount(WorkExperience)
    const firstItem = wrapper.find('.work-experience__item')
    const duration = firstItem.find('.work-experience__duration')
    expect(duration.text()).toContain('2021年3月')
    expect(duration.text()).toContain('至今')
  })

  it('should render description', () => {
    const wrapper = mount(WorkExperience)
    const firstItem = wrapper.find('.work-experience__item')
    expect(firstItem.find('.work-experience__description').text()).toContain('负责公司核心产品')
  })

  it('should render achievements', () => {
    const wrapper = mount(WorkExperience)
    const firstItem = wrapper.find('.work-experience__item')
    expect(firstItem.find('.work-experience__achievements').exists()).toBe(true)
    expect(firstItem.find('.work-experience__section-title').text()).toBe('主要成就')
  })

  it('should render achievements list', () => {
    const wrapper = mount(WorkExperience)
    const firstItem = wrapper.find('.work-experience__item')
    const achievements = firstItem.findAll('.work-experience__list-items li')
    expect(achievements.length).toBeGreaterThan(0)
    expect(achievements[0].text()).toContain('主导重构公司官网')
  })

  it('should render technologies', () => {
    const wrapper = mount(WorkExperience)
    const firstItem = wrapper.find('.work-experience__item')
    expect(firstItem.find('.work-experience__technologies').exists()).toBe(true)
    const techTags = firstItem.findAll('.work-experience__tag')
    expect(techTags.length).toBeGreaterThan(0)
    expect(techTags[0].text()).toBe('Vue 3')
  })

  it('should format date correctly', () => {
    const wrapper = mount(WorkExperience)
    const firstItem = wrapper.find('.work-experience__item')
    const duration = firstItem.find('.work-experience__duration')
    expect(duration.text()).toContain('2021年3月')
  })
})