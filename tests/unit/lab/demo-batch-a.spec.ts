import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import AuroraDemo from '@/views/Lab/demos/AuroraDemo.vue'
import DotPatternDemo from '@/views/Lab/demos/DotPatternDemo.vue'
import GridPatternDemo from '@/views/Lab/demos/GridPatternDemo.vue'
import NoiseTextureDemo from '@/views/Lab/demos/NoiseTextureDemo.vue'
import auroraSource from '@/views/Lab/demos/AuroraDemo.vue?raw'

describe('Lab Demo batch A', () => {
  it('mounts all four demos in a minimal Vue host', () => {
    const wrappers = [
      mount(AuroraDemo, { props: { speed: 2, colorTheme: 'blue' } }),
      mount(GridPatternDemo, { props: { opacity: 0.5, gridSize: 40 } }),
      mount(DotPatternDemo, { props: { dotSize: 2, spacing: 20 } }),
      mount(NoiseTextureDemo, { props: { opacity: 0.1 } }),
    ]
    expect(wrappers.every(wrapper => wrapper.html().length > 0)).toBe(true)
  })

  it('updates visual parameters through typed props', async () => {
    const wrapper = mount(AuroraDemo, { props: { speed: 2, colorTheme: 'blue' } })
    await wrapper.setProps({ speed: 4, colorTheme: 'purple' })
    expect(wrapper.attributes('style')).toContain('--duration: 3s')
    expect(wrapper.classes()).toContain('aurora--purple')
  })

  it('supports a decorative embedded variant for real-page reuse', () => {
    const wrapper = mount(AuroraDemo, {
      props: { embedded: true, decorative: true },
      slots: { default: '<span>Hero content</span>' }
    })
    expect(wrapper.classes()).toContain('aurora--embedded')
    expect(wrapper.attributes('aria-hidden')).toBe('true')
    expect(wrapper.text()).toContain('Hero content')
  })

  it('declares a reduced-motion fallback for animated effects', () => {
    expect(auroraSource).toContain('prefers-reduced-motion: reduce')
  })
})
