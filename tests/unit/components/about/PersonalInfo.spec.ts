import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PersonalInfo from '@/components/about/PersonalInfo.vue'

describe('PersonalInfo.vue', () => {
  beforeEach(() => {
    document.title = ''
  })

  it('should render the component', () => {
    const wrapper = mount(PersonalInfo)
    expect(wrapper.find('.personal-info').exists()).toBe(true)
  })

  it('should render avatar', () => {
    const wrapper = mount(PersonalInfo)
    const avatar = wrapper.find('.personal-info__avatar img')
    expect(avatar.exists()).toBe(true)
    expect(avatar.attributes('src')).toBe('/images/avatar.svg')
    expect(avatar.attributes('alt')).toBe('佘杰')
  })

  it('should render name', () => {
    const wrapper = mount(PersonalInfo)
    expect(wrapper.find('.personal-info__name').text()).toBe('佘杰')
  })

  it('should render title', () => {
    const wrapper = mount(PersonalInfo)
    expect(wrapper.find('.personal-info__title').text()).toBe('前端开发工程师')
  })

  it('should render bio', () => {
    const wrapper = mount(PersonalInfo)
    expect(wrapper.find('.personal-info__bio').text()).toContain('7年前端开发经验')
  })

  it('should render location', () => {
    const wrapper = mount(PersonalInfo)
    const details = wrapper.findAll('.personal-info__detail')
    const locationDetail = details.find(detail => detail.text().includes('上海'))
    expect(locationDetail).toBeDefined()
  })

  it('should render email', () => {
    const wrapper = mount(PersonalInfo)
    const emailLink = wrapper.find('a[href="mailto:shejie@example.com"]')
    expect(emailLink.exists()).toBe(true)
    expect(emailLink.text()).toBe('shejie@example.com')
  })

  it('should render phone', () => {
    const wrapper = mount(PersonalInfo)
    const phoneLink = wrapper.find('a[href^="tel:"]')
    expect(phoneLink.exists()).toBe(true)
    expect(phoneLink.text()).toBe('+86 138 0000 0000')
  })

  it('should render years of experience', () => {
    const wrapper = mount(PersonalInfo)
    const details = wrapper.findAll('.personal-info__detail')
    const experienceDetail = details.find(detail => detail.text().includes('7 年'))
    expect(experienceDetail).toBeDefined()
  })

  it('should render social links', () => {
    const wrapper = mount(PersonalInfo)
    const socialLinks = wrapper.findAll('.personal-info__social-link')
    expect(socialLinks.length).toBe(4)
    expect(socialLinks[0].text()).toBe('🌐 个人网站')
    expect(socialLinks[1].text()).toBe('GitHub')
    expect(socialLinks[2].text()).toBe('LinkedIn')
    expect(socialLinks[3].text()).toBe('Twitter')
  })

  it('should render languages', () => {
    const wrapper = mount(PersonalInfo)
    expect(wrapper.find('.personal-info__languages').exists()).toBe(true)
    const languages = wrapper.findAll('.personal-info__languages .personal-info__tag')
    expect(languages.length).toBe(2)
    expect(languages[0].text()).toBe('中文（母语）')
    expect(languages[1].text()).toBe('英语（熟练）')
  })

  it('should render interests', () => {
    const wrapper = mount(PersonalInfo)
    expect(wrapper.find('.personal-info__interests').exists()).toBe(true)
    const interests = wrapper.findAll('.personal-info__interests .personal-info__tag')
    expect(interests.length).toBe(4)
    expect(interests[0].text()).toBe('开源项目')
  })

  it('should set document title on mount', () => {
    mount(PersonalInfo)
    expect(document.title).toBe('关于我 - 佘杰')
  })
})