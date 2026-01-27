import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContactInfoDisplay from '@/components/contact/ContactInfoDisplay.vue'

describe('ContactInfoDisplay.vue', () => {
  const mockContactInfo = {
    name: '佘杰',
    email: '912999051@qq.com',
    phone: '+86 134-6942-2826',
    location: '中国，上海',
    social: {
      github: 'https://github.com/shejie',
      linkedin: 'https://linkedin.com/in/shejie',
      twitter: 'https://twitter.com/shejie',
      email: 'mailto:912999051@qq.com'
    },
    availability: '可接受新项目',
    responseTime: '通常在 24 小时内回复'
  }

  describe('渲染测试', () => {
    it('应该渲染联系信息组件', () => {
      const wrapper = mount(ContactInfoDisplay, {
        props: {
          contactInfo: mockContactInfo
        }
      })
      expect(wrapper.find('.contact-info-display').exists()).toBe(true)
    })

    it('应该渲染标题', () => {
      const wrapper = mount(ContactInfoDisplay, {
        props: {
          contactInfo: mockContactInfo
        }
      })
      expect(wrapper.find('.contact-info-display__title').text()).toBe('联系信息')
    })

    it('应该渲染所有联系信息项', () => {
      const wrapper = mount(ContactInfoDisplay, {
        props: {
          contactInfo: mockContactInfo
        }
      })
      const items = wrapper.findAll('.contact-info-display__item')
      expect(items.length).toBe(5)
    })
  })

  describe('邮箱信息', () => {
    it('应该渲染邮箱信息', () => {
      const wrapper = mount(ContactInfoDisplay, {
        props: {
          contactInfo: mockContactInfo
        }
      })
      expect(wrapper.text()).toContain('邮箱')
      expect(wrapper.text()).toContain(mockContactInfo.email)
    })

    it('应该渲染邮箱链接', () => {
      const wrapper = mount(ContactInfoDisplay, {
        props: {
          contactInfo: mockContactInfo
        }
      })
      const emailLink = wrapper.findAll('.contact-info-display__value--link')[0]
      expect(emailLink.attributes('href')).toBe(`mailto:${mockContactInfo.email}`)
    })
  })

  describe('电话信息', () => {
    it('应该渲染电话信息', () => {
      const wrapper = mount(ContactInfoDisplay, {
        props: {
          contactInfo: mockContactInfo
        }
      })
      expect(wrapper.text()).toContain('电话')
      expect(wrapper.text()).toContain(mockContactInfo.phone)
    })

    it('应该渲染电话链接', () => {
      const wrapper = mount(ContactInfoDisplay, {
        props: {
          contactInfo: mockContactInfo
        }
      })
      const phoneLink = wrapper.findAll('.contact-info-display__value--link')[1]
      expect(phoneLink.attributes('href')).toContain('tel:')
    })
  })

  describe('位置信息', () => {
    it('应该渲染位置信息', () => {
      const wrapper = mount(ContactInfoDisplay, {
        props: {
          contactInfo: mockContactInfo
        }
      })
      expect(wrapper.text()).toContain('位置')
      expect(wrapper.text()).toContain(mockContactInfo.location)
    })
  })

  describe('状态信息', () => {
    it('应该渲染可用性状态', () => {
      const wrapper = mount(ContactInfoDisplay, {
        props: {
          contactInfo: mockContactInfo
        }
      })
      expect(wrapper.text()).toContain('状态')
      expect(wrapper.text()).toContain(mockContactInfo.availability)
    })

    it('应该渲染回复时间', () => {
      const wrapper = mount(ContactInfoDisplay, {
        props: {
          contactInfo: mockContactInfo
        }
      })
      expect(wrapper.text()).toContain('回复时间')
      expect(wrapper.text()).toContain(mockContactInfo.responseTime)
    })
  })

  describe('图标', () => {
    it('应该渲染所有图标', () => {
      const wrapper = mount(ContactInfoDisplay, {
        props: {
          contactInfo: mockContactInfo
        }
      })
      const icons = wrapper.findAll('.contact-info-display__icon')
      expect(icons.length).toBe(5)
    })
  })

  describe('边界情况', () => {
    it('应该处理部分联系信息', () => {
      const partialContactInfo = {
        name: '佘杰',
        email: '912999051@qq.com',
        location: '中国，上海',
        social: {},
        availability: '可接受新项目',
        responseTime: '通常在 24 小时内回复'
      }
      const wrapper = mount(ContactInfoDisplay, {
        props: {
          contactInfo: partialContactInfo
        }
      })
      const items = wrapper.findAll('.contact-info-display__item')
      expect(items.length).toBe(4)
    })

    it('应该处理空字符串', () => {
      const emptyContactInfo = {
        name: '佘杰',
        email: '',
        phone: '',
        location: '',
        social: {},
        availability: '',
        responseTime: ''
      }
      const wrapper = mount(ContactInfoDisplay, {
        props: {
          contactInfo: emptyContactInfo
        }
      })
      const items = wrapper.findAll('.contact-info-display__item')
      expect(items.length).toBe(0)
    })
  })
})