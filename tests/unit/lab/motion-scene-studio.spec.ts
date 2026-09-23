import { nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import MotionSceneStudio from '@/components/lab/MotionSceneStudio.vue'
import { findMotionScene } from '@/config/motionSceneRegistry'

const scene = findMotionScene('frozen-cave')
if (!scene) throw new Error('Frozen Cave scene is required for studio tests')

const mountStudio = () =>
  mount(MotionSceneStudio, {
    props: { scene },
    global: {
      stubs: {
        RouterLink: { template: '<a><slot /></a>' },
        MotionScenePreview: { template: '<div data-preview="true" />' },
        LabParamPanel: { template: '<div data-params="true" />' },
        LabCodePanel: { template: '<div data-code="true" />' }
      }
    }
  })

describe('Motion Scene Studio preview stage', () => {
  afterEach(() => {
    document.body.style.overflow = ''
    Reflect.deleteProperty(document, 'fullscreenEnabled')
  })

  it('uses the enlarged preview-first stage and keeps tuning secondary', () => {
    const wrapper = mountStudio()
    const stage = wrapper.get('[tabindex="-1"]')

    expect(stage.classes()).toContain('h-[clamp(22rem,52vh,30rem)]')
    expect(stage.classes()).toContain('xl:h-[clamp(37.5rem,68vh,46rem)]')
    expect(wrapper.get('aside').classes()).toContain('xl:sticky')
    expect(wrapper.text()).toContain('实时效果预览')
    expect(wrapper.text()).toContain('查看 MotionSites 公开参考')

    wrapper.unmount()
  })

  it('falls back to an in-page immersive viewport and restores page scrolling', async () => {
    Object.defineProperty(document, 'fullscreenEnabled', { configurable: true, value: false })
    const wrapper = mountStudio()

    await wrapper.get('button').trigger('click')
    await nextTick()

    const stage = wrapper.get('[tabindex="-1"]')
    expect(stage.classes()).toContain('h-[100dvh]')
    expect(document.body.style.overflow).toBe('hidden')
    expect(wrapper.text()).toContain('退出沉浸')

    const exitButton = wrapper.findAll('button').find((button) => button.text() === '退出沉浸')
    if (!exitButton) throw new Error('Missing immersive exit button')
    await exitButton.trigger('click')
    await nextTick()

    expect(document.body.style.overflow).toBe('')
    expect(wrapper.text()).not.toContain('退出沉浸')

    wrapper.unmount()
  })
})
