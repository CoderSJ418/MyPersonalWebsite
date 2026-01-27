import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Contact from '@/views/Contact.vue'

describe('Contact.vue', () => {
  describe('渲染测试', () => {
    it('应该渲染联系页面', () => {
      const wrapper = mount(Contact, {
        global: {
          stubs: {
            ContactForm: true,
            ContactInfoDisplay: true,
            SocialLinks: true
          }
        }
      })
      expect(wrapper.find('.contact-page').exists()).toBe(true)
    })

    it('应该渲染英雄区域', () => {
      const wrapper = mount(Contact, {
        global: {
          stubs: {
            ContactForm: true,
            ContactInfoDisplay: true,
            SocialLinks: true
          }
        }
      })
      expect(wrapper.find('.contact-page__hero').exists()).toBe(true)
      expect(wrapper.find('.contact-page__title').exists()).toBe(true)
      expect(wrapper.find('.contact-page__subtitle').exists()).toBe(true)
    })

    it('应该渲染正确的标题', () => {
      const wrapper = mount(Contact, {
        global: {
          stubs: {
            ContactForm: true,
            ContactInfoDisplay: true,
            SocialLinks: true
          }
        }
      })
      expect(wrapper.find('.contact-page__title').text()).toBe('联系我')
    })

    it('应该渲染内容区域', () => {
      const wrapper = mount(Contact, {
        global: {
          stubs: {
            ContactForm: true,
            ContactInfoDisplay: true,
            SocialLinks: true
          }
        }
      })
      expect(wrapper.find('.contact-page__content').exists()).toBe(true)
    })

    it('应该渲染表单区域', () => {
      const wrapper = mount(Contact, {
        global: {
          stubs: {
            ContactForm: true,
            ContactInfoDisplay: true,
            SocialLinks: true
          }
        }
      })
      expect(wrapper.find('.contact-page__form-section').exists()).toBe(true)
    })

    it('应该渲染信息区域', () => {
      const wrapper = mount(Contact, {
        global: {
          stubs: {
            ContactForm: true,
            ContactInfoDisplay: true,
            SocialLinks: true
          }
        }
      })
      expect(wrapper.find('.contact-page__info-section').exists()).toBe(true)
    })
  })

  describe('组件集成', () => {
    it('应该渲染 ContactForm 组件', () => {
      const wrapper = mount(Contact, {
        global: {
          stubs: {
            ContactForm: true,
            ContactInfoDisplay: true,
            SocialLinks: true
          }
        }
      })
      expect(wrapper.findComponent({ name: 'ContactForm' }).exists()).toBe(true)
    })

    it('应该渲染 ContactInfoDisplay 组件', () => {
      const wrapper = mount(Contact, {
        global: {
          stubs: {
            ContactForm: true,
            ContactInfoDisplay: true,
            SocialLinks: true
          }
        }
      })
      expect(wrapper.findComponent({ name: 'ContactInfoDisplay' }).exists()).toBe(true)
    })

    it('应该渲染 SocialLinks 组件', () => {
      const wrapper = mount(Contact, {
        global: {
          stubs: {
            ContactForm: true,
            ContactInfoDisplay: true,
            SocialLinks: true
          }
        }
      })
      expect(wrapper.findComponent({ name: 'SocialLinks' }).exists()).toBe(true)
    })

    it('应该渲染所有部分标题', () => {
      const wrapper = mount(Contact, {
        global: {
          stubs: {
            ContactForm: true,
            ContactInfoDisplay: true,
            SocialLinks: true
          }
        }
      })
      const titles = wrapper.findAll('.contact-page__section-title')
      expect(titles.length).toBe(2)
      expect(titles[0].text()).toBe('发送消息')
      expect(titles[1].text()).toBe('社交媒体')
    })
  })

  describe('生命周期', () => {
    it('应该在挂载时滚动到顶部', () => {
      const scrollToSpy = vi.spyOn(window, 'scrollTo')
      mount(Contact, {
        global: {
          stubs: {
            ContactForm: true,
            ContactInfoDisplay: true,
            SocialLinks: true
          }
        }
      })
      expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    })

    it('应该设置页面标题', () => {
      mount(Contact, {
        global: {
          stubs: {
            ContactForm: true,
            ContactInfoDisplay: true,
            SocialLinks: true
          }
        }
      })
      expect(document.title).toBe('联系方式 - 佘杰')
    })
  })

  describe('响应式设计', () => {
    it('应该有正确的响应式类', () => {
      const wrapper = mount(Contact, {
        global: {
          stubs: {
            ContactForm: true,
            ContactInfoDisplay: true,
            SocialLinks: true
          }
        }
      })
      expect(wrapper.find('.contact-page').exists()).toBe(true)
    })
  })
})