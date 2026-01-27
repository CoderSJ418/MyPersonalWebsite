import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Education from '@/components/about/Education.vue'

describe('Education.vue', () => {
  it('should render the component', () => {
    const wrapper = mount(Education)
    expect(wrapper.find('.education').exists()).toBe(true)
  })

  it('should render title', () => {
    const wrapper = mount(Education)
    expect(wrapper.find('.education__title').text()).toBe('教育背景')
  })

  it('should render education items', () => {
    const wrapper = mount(Education)
    const items = wrapper.findAll('.education__item')
    expect(items.length).toBe(2)
  })

  it('should render school name', () => {
    const wrapper = mount(Education)
    const firstItem = wrapper.find('.education__item')
    expect(firstItem.find('.education__school-name').text()).toBe('某大学')
  })

  it('should render degree', () => {
    const wrapper = mount(Education)
    const firstItem = wrapper.find('.education__item')
    expect(firstItem.find('.education__degree-text').text()).toBe('本科')
  })

  it('should render major', () => {
    const wrapper = mount(Education)
    const firstItem = wrapper.find('.education__item')
    expect(firstItem.find('.education__major').text()).toBe('计算机科学与技术')
  })

  it('should render date', () => {
    const wrapper = mount(Education)
    const firstItem = wrapper.find('.education__item')
    const date = firstItem.find('.education__date')
    expect(date.text()).toContain('2013年9月')
    expect(date.text()).toContain('2017年6月')
  })

  it('should render description', () => {
    const wrapper = mount(Education)
    const firstItem = wrapper.find('.education__item')
    expect(firstItem.find('.education__description').text()).toContain('系统学习计算机基础知识')
  })

  it('should render gpa', () => {
    const wrapper = mount(Education)
    const firstItem = wrapper.find('.education__item')
    const gpa = firstItem.find('.education__gpa')
    expect(gpa.exists()).toBe(true)
    expect(gpa.text()).toContain('3.8/4.0')
  })

  it('should not render gpa when null', () => {
    const wrapper = mount(Education)
    const items = wrapper.findAll('.education__item')
    const lastItem = items[items.length - 1]
    expect(lastItem.find('.education__gpa').exists()).toBe(false)
  })

  it('should render achievements', () => {
    const wrapper = mount(Education)
    const firstItem = wrapper.find('.education__item')
    expect(firstItem.find('.education__achievements').exists()).toBe(true)
    expect(firstItem.find('.education__section-title').text()).toBe('主要成就')
  })

  it('should render achievements list', () => {
    const wrapper = mount(Education)
    const firstItem = wrapper.find('.education__item')
    const achievements = firstItem.findAll('.education__list-items li')
    expect(achievements.length).toBeGreaterThan(0)
    expect(achievements[0].text()).toContain('获得校级奖学金')
  })

  it('should format date correctly', () => {
    const wrapper = mount(Education)
    const firstItem = wrapper.find('.education__item')
    const date = firstItem.find('.education__date')
    expect(date.text()).toBe('2013年9月 - 2017年6月')
  })
})