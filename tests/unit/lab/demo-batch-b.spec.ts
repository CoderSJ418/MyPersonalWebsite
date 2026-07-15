import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import MagicCardDemo from '@/views/Lab/demos/MagicCardDemo.vue'
import MeteorsDemo from '@/views/Lab/demos/MeteorsDemo.vue'
import SpotlightDemo from '@/views/Lab/demos/SpotlightDemo.vue'
import TiltCardDemo from '@/views/Lab/demos/TiltCardDemo.vue'
import magicSource from '@/views/Lab/demos/MagicCardDemo.vue?raw'
import meteorsSource from '@/views/Lab/demos/MeteorsDemo.vue?raw'
import spotlightSource from '@/views/Lab/demos/SpotlightDemo.vue?raw'
import tiltSource from '@/views/Lab/demos/TiltCardDemo.vue?raw'

describe('Lab Demo batch B', () => {
  it('mounts all four demos in a minimal Vue host', () => {
    const wrappers = [
      mount(MeteorsDemo, { props: { count: 15, speed: 2 } }),
      mount(SpotlightDemo, { props: { radius: 250 } }),
      mount(TiltCardDemo, { props: { maxTilt: 10, perspective: 500 } }),
      mount(MagicCardDemo, { props: { borderWidth: 1 } })
    ]
    expect(wrappers.every((wrapper) => wrapper.html().length > 0)).toBe(true)
  })

  it('reflects numeric parameters in rendered output', async () => {
    const wrapper = mount(MeteorsDemo, { props: { count: 5, speed: 2 } })
    expect(wrapper.findAll('.meteor')).toHaveLength(5)
    await wrapper.setProps({ count: 8, speed: 4 })
    expect(wrapper.findAll('.meteor')).toHaveLength(8)
    expect(wrapper.attributes('style')).toContain('--duration: 1s')
  })

  it('renders consumer content in the embedded magic-card surface', () => {
    const wrapper = mount(MagicCardDemo, {
      props: { embedded: true, borderWidth: 2 },
      slots: { default: '<h3>Project outcome</h3>' }
    })
    expect(wrapper.classes()).toContain('magic-card--embedded')
    expect(wrapper.attributes('style')).toContain('--border: 2px')
    expect(wrapper.text()).toContain('Project outcome')
  })

  it('declares touch or reduced-motion fallbacks', () => {
    for (const source of [meteorsSource, spotlightSource, tiltSource, magicSource]) {
      expect(source).toMatch(/prefers-reduced-motion|hover: none/)
    }
  })
})
