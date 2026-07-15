import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import MarqueeDemo from '@/views/Lab/demos/MarqueeDemo.vue'
import NumberTickerDemo from '@/views/Lab/demos/NumberTickerDemo.vue'
import ShimmerButtonDemo from '@/views/Lab/demos/ShimmerButtonDemo.vue'
import ShineBorderDemo from '@/views/Lab/demos/ShineBorderDemo.vue'
import marqueeSource from '@/views/Lab/demos/MarqueeDemo.vue?raw'
import numberSource from '@/views/Lab/demos/NumberTickerDemo.vue?raw'
import shimmerSource from '@/views/Lab/demos/ShimmerButtonDemo.vue?raw'
import shineSource from '@/views/Lab/demos/ShineBorderDemo.vue?raw'

describe('Lab Demo batch C', () => {
  afterEach(() => vi.restoreAllMocks())

  it('mounts all four demos in a minimal Vue host', () => {
    const wrappers = [
      mount(ShineBorderDemo, { props: { borderWidth: 1, speed: 3 } }),
      mount(ShimmerButtonDemo, { props: { duration: 2 } }),
      mount(NumberTickerDemo, { props: { targetValue: 100, duration: 500 } }),
      mount(MarqueeDemo, { props: { speed: 30, direction: 'left' } })
    ]
    expect(wrappers.every((wrapper) => wrapper.html().length > 0)).toBe(true)
    wrappers.forEach((wrapper) => wrapper.unmount())
  })

  it('reflects direction and speed parameters', async () => {
    const wrapper = mount(MarqueeDemo, { props: { speed: 20, direction: 'left' } })
    await wrapper.setProps({ speed: 40, direction: 'right' })
    expect(wrapper.find('.marquee').attributes('style')).toContain('--duration: 4s')
    expect(wrapper.find('.marquee').attributes('style')).toContain('--direction: reverse')
  })

  it('renders the shimmer effect as a reusable link', () => {
    const wrapper = mount(ShimmerButtonDemo, {
      props: { embedded: true, href: 'mailto:test@example.com', label: '联系我' },
      slots: { default: '开始沟通' }
    })
    const link = wrapper.get('a')
    expect(link.attributes('href')).toBe('mailto:test@example.com')
    expect(link.attributes('aria-label')).toBe('联系我')
    expect(link.text()).toBe('开始沟通')
  })

  it('renders compact number-ticker content for project metrics', () => {
    const wrapper = mount(NumberTickerDemo, {
      props: {
        targetValue: 96,
        duration: 500,
        label: 'Performance',
        suffix: '分',
        supportingText: '',
        compact: true
      }
    })
    expect(wrapper.classes()).toContain('ticker-card--compact')
    expect(wrapper.text()).toContain('Performance')
    expect(wrapper.find('strong').text()).toMatch(/\d+分/)
    wrapper.unmount()
  })

  it('retargets the number ticker from its current value with balanced timing', async () => {
    const frames: FrameRequestCallback[] = []
    vi.spyOn(performance, 'now').mockReturnValue(0)
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      frames.push(callback)
      return frames.length
    })
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined)

    const wrapper = mount(NumberTickerDemo, { props: { targetValue: 100, duration: 1000 } })
    frames.shift()?.(1000)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('strong').text()).toBe('100')

    await wrapper.setProps({ targetValue: 200 })
    frames.shift()?.(0)
    frames.shift()?.(500)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('strong').text()).toBe('150')

    frames.shift()?.(1000)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('strong').text()).toBe('200')

    wrapper.unmount()
  })

  it('declares cleanup or reduced-motion behavior', () => {
    for (const source of [shineSource, shimmerSource, numberSource, marqueeSource]) {
      expect(source).toMatch(/prefers-reduced-motion|onCleanup/)
    }
  })
})
