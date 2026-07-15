import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'

import {
  pageTitleUtils,
  resetPageTitleConfig,
  restoreOriginalTitle,
  setPageTitle,
  setPageTitleConfig,
  usePageTitle
} from '@/composables/usePageTitle'

describe('page title composable', () => {
  it('formats, truncates, resets and restores titles', () => {
    document.title = 'Original'
    setPageTitleConfig({ suffix: 'Site', separator: ' - ', maxTitleLength: 10 })
    setPageTitle('A very long title')
    expect(document.title).toContain('... - Site')
    setPageTitleConfig({ truncateWithEllipsis: false, suffix: '' })
    setPageTitle('Another long title')
    expect(document.title).toHaveLength(10)
    pageTitleUtils.resetToDefault()
    expect(pageTitleUtils.getCurrentTitle()).toBeTruthy()
    resetPageTitleConfig()
    restoreOriginalTitle()
  })

  it('tracks route metadata and custom content titles', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', name: 'Home', component: { render: () => h('div') } },
        { path: '/about', name: 'About', component: { render: () => h('div') }, meta: { title: 'About us' } }
      ]
    })
    let controls: ReturnType<typeof usePageTitle> | undefined
    const Host = defineComponent({
      setup() {
        controls = usePageTitle({ suffix: 'Portfolio' })
        return () => h('div')
      }
    })
    await router.push('/about')
    const wrapper = mount(Host, { global: { plugins: [router] } })
    controls?.setTitle('Custom')
    controls?.generateTitleFromContent({ name: 'Generated' })
    expect(document.title).toContain('Generated')
    await router.push('/')
    controls?.updateTitleFromRoute()
    wrapper.unmount()
  })
})
