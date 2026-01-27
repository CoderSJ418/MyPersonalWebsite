import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SocialLinks from '@/components/contact/SocialLinks.vue'

describe('SocialLinks.vue', () => {
  describe('渲染测试', () => {
    it('应该渲染社交媒体链接组件', () => {
      const wrapper = mount(SocialLinks, {
        props: {
          social: {
            github: 'https://github.com/test',
            linkedin: 'https://linkedin.com/in/test',
            twitter: 'https://twitter.com/test',
            email: 'mailto:test@example.com'
          }
        }
      })
      expect(wrapper.find('.social-links').exists()).toBe(true)
    })

    it('应该渲染所有提供的社交媒体链接', () => {
      const wrapper = mount(SocialLinks, {
        props: {
          social: {
            github: 'https://github.com/test',
            linkedin: 'https://linkedin.com/in/test',
            twitter: 'https://twitter.com/test',
            email: 'mailto:test@example.com'
          }
        }
      })
      const links = wrapper.findAll('.social-links__link')
      expect(links.length).toBe(4)
    })

    it('应该在没有社交媒体时不渲染任何链接', () => {
      const wrapper = mount(SocialLinks, {
        props: {
          social: {}
        }
      })
      const links = wrapper.findAll('.social-links__link')
      expect(links.length).toBe(0)
    })
  })

  describe('链接属性', () => {
    it('应该正确设置链接的 href', () => {
      const wrapper = mount(SocialLinks, {
        props: {
          social: {
            github: 'https://github.com/test'
          }
        }
      })
      const link = wrapper.find('.social-links__link')
      expect(link.attributes('href')).toBe('https://github.com/test')
    })

    it('应该设置 target="_blank"', () => {
      const wrapper = mount(SocialLinks, {
        props: {
          social: {
            github: 'https://github.com/test'
          }
        }
      })
      const link = wrapper.find('.social-links__link')
      expect(link.attributes('target')).toBe('_blank')
    })

    it('应该设置 rel="noopener noreferrer"', () => {
      const wrapper = mount(SocialLinks, {
        props: {
          social: {
            github: 'https://github.com/test'
          }
        }
      })
      const link = wrapper.find('.social-links__link')
      expect(link.attributes('rel')).toBe('noopener noreferrer')
    })

    it('应该设置正确的 aria-label', () => {
      const wrapper = mount(SocialLinks, {
        props: {
          social: {
            github: 'https://github.com/test'
          }
        }
      })
      const link = wrapper.find('.social-links__link')
      expect(link.attributes('aria-label')).toBe('GitHub')
    })
  })

  describe('图标和标签', () => {
    it('应该显示图标', () => {
      const wrapper = mount(SocialLinks, {
        props: {
          social: {
            github: 'https://github.com/test'
          }
        }
      })
      const link = wrapper.find('.social-links__link')
      expect(link.find('svg').exists()).toBe(true)
    })

    it('应该显示标签文本', () => {
      const wrapper = mount(SocialLinks, {
        props: {
          social: {
            github: 'https://github.com/test'
          }
        }
      })
      const link = wrapper.find('.social-links__link')
      expect(link.find('.social-links__label').text()).toBe('GitHub')
    })
  })

  describe('支持的社交媒体平台', () => {
    it('应该支持 GitHub', () => {
      const wrapper = mount(SocialLinks, {
        props: {
          social: {
            github: 'https://github.com/test'
          }
        }
      })
      const link = wrapper.find('.social-links__link')
      expect(link.attributes('href')).toBe('https://github.com/test')
      expect(link.find('.social-links__label').text()).toBe('GitHub')
    })

    it('应该支持 LinkedIn', () => {
      const wrapper = mount(SocialLinks, {
        props: {
          social: {
            linkedin: 'https://linkedin.com/in/test'
          }
        }
      })
      const link = wrapper.find('.social-links__link')
      expect(link.attributes('href')).toBe('https://linkedin.com/in/test')
      expect(link.find('.social-links__label').text()).toBe('LinkedIn')
    })

    it('应该支持 Twitter', () => {
      const wrapper = mount(SocialLinks, {
        props: {
          social: {
            twitter: 'https://twitter.com/test'
          }
        }
      })
      const link = wrapper.find('.social-links__link')
      expect(link.attributes('href')).toBe('https://twitter.com/test')
      expect(link.find('.social-links__label').text()).toBe('Twitter')
    })

    it('应该支持 Email', () => {
      const wrapper = mount(SocialLinks, {
        props: {
          social: {
            email: 'mailto:test@example.com'
          }
        }
      })
      const link = wrapper.find('.social-links__link')
      expect(link.attributes('href')).toBe('mailto:test@example.com')
      expect(link.find('.social-links__label').text()).toBe('Email')
    })

    it('应该支持 Website', () => {
      const wrapper = mount(SocialLinks, {
        props: {
          social: {
            website: 'https://example.com'
          }
        }
      })
      const link = wrapper.find('.social-links__link')
      expect(link.attributes('href')).toBe('https://example.com')
      expect(link.find('.social-links__label').text()).toBe('Website')
    })
  })

  describe('边界情况', () => {
    it('应该处理部分社交媒体链接', () => {
      const wrapper = mount(SocialLinks, {
        props: {
          social: {
            github: 'https://github.com/test',
            linkedin: 'https://linkedin.com/in/test'
          }
        }
      })
      const links = wrapper.findAll('.social-links__link')
      expect(links.length).toBe(2)
    })

    it('应该处理所有社交媒体链接', () => {
      const wrapper = mount(SocialLinks, {
        props: {
          social: {
            github: 'https://github.com/test',
            linkedin: 'https://linkedin.com/in/test',
            twitter: 'https://twitter.com/test',
            email: 'mailto:test@example.com',
            website: 'https://example.com',
            youtube: 'https://youtube.com/test',
            instagram: 'https://instagram.com/test',
            facebook: 'https://facebook.com/test'
          }
        }
      })
      const links = wrapper.findAll('.social-links__link')
      expect(links.length).toBe(8)
    })
  })
})