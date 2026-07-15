import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import CodeBlock from '@/components/blog/CodeBlock.vue'
import TableOfContents from '@/components/blog/TableOfContents.vue'
import SafeImage from '@/components/common/SafeImage.vue'
import SocialLinks from '@/components/contact/SocialLinks.vue'
import CTASection from '@/components/home/CTASection.vue'
import TechStack from '@/components/home/TechStack.vue'

vi.mock('@/composables/useGSAPAnimations', () => ({
  useGSAPAnimations: () => ({ fadeInUp: vi.fn(), staggerIn: vi.fn() })
}))

describe('content component contracts', () => {
  afterEach(() => vi.restoreAllMocks())

  it('copies code and reports clipboard failures', async () => {
    vi.useFakeTimers()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
    const wrapper = mount(CodeBlock, {
      props: { code: 'const one = 1\nconst two = 2', language: 'ts', version: '5.3' }
    })
    expect(wrapper.findAll('.code-block__line-num')).toHaveLength(2)
    await wrapper.get('button').trigger('click')
    expect(writeText).toHaveBeenCalled()
    await Promise.resolve()
    vi.runAllTimers()
    await wrapper.vm.$nextTick()
    writeText.mockRejectedValueOnce(new Error('blocked'))
    await wrapper.get('button').trigger('click')
    await Promise.resolve()
    await wrapper.vm.$nextTick()
    expect(wrapper.get('button').classes()).toContain('code-block__copy--error')
    vi.useRealTimers()
  })

  it('moves a safe image through load, error and retry states', async () => {
    const wrapper = mount(SafeImage, {
      props: { src: '/image.webp', alt: 'Preview', width: 320, height: 180 }
    })
    expect(wrapper.find('.image-skeleton').exists()).toBe(true)
    await wrapper.get('img').trigger('load')
    expect(wrapper.find('.image-skeleton').exists()).toBe(false)
    await wrapper.get('img').trigger('error')
    expect(wrapper.text()).toContain('Preview')
    await wrapper.get('button').trigger('click')
    expect(wrapper.find('.image-skeleton').exists()).toBe(true)
  })

  it('renders every configured social destination', () => {
    const wrapper = mount(SocialLinks, {
      props: {
        social: {
          github: 'https://github.com/test',
          linkedin: 'https://linkedin.com/in/test',
          twitter: 'https://x.com/test',
          email: 'mailto:test@example.com',
          website: 'https://example.com',
          youtube: 'https://youtube.com/test',
          instagram: 'https://instagram.com/test',
          facebook: 'https://facebook.com/test'
        }
      }
    })
    expect(wrapper.findAll('a')).toHaveLength(8)
    expect(mount(SocialLinks).findAll('a')).toHaveLength(0)
  })

  it('tracks and navigates a table of contents', async () => {
    const first = document.createElement('h2')
    first.id = 'first'
    const second = document.createElement('h3')
    second.id = 'second'
    vi.spyOn(first, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 20, 10, 10))
    vi.spyOn(second, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 200, 10, 10))
    document.body.append(first, second)
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    const wrapper = mount(TableOfContents, {
      props: {
        headings: [
          { level: 2, text: 'First', id: 'first' },
          { level: 3, text: 'Second', id: 'second' }
        ]
      }
    })
    window.dispatchEvent(new Event('scroll'))
    await wrapper.get('.table-of-contents__mobile-toggle').trigger('click')
    await wrapper.findAll('a')[1]?.trigger('click')
    expect(scrollTo).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('mounts animated home sections with their real content', async () => {
    const global = { directives: { spotlight: () => undefined } }
    const tech = mount(TechStack, { global })
    const cta = mount(CTASection, { global })
    await Promise.resolve()
    expect(tech.findAll('.ts__card')).toHaveLength(6)
    expect(cta.findAll('a').length).toBeGreaterThanOrEqual(4)
  })
})
