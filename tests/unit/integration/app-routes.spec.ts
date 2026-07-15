import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

import App from '@/App.vue'
import router from '@/router'

const settleRoute = async (): Promise<void> => {
  await flushPromises()
  await new Promise((resolve) => setTimeout(resolve, 220))
  await flushPromises()
}

describe('application route integration', () => {
  const pinia = createPinia()
  let wrapper: ReturnType<typeof mount>

  beforeAll(async () => {
    const fallbackDescription = document.createElement('meta')
    fallbackDescription.id = 'app-default-description'
    fallbackDescription.name = 'description'
    fallbackDescription.content = 'Static application fallback'
    document.head.appendChild(fallbackDescription)
    localStorage.setItem(
      'analytics-consent-v1',
      JSON.stringify({ decision: 'denied', savedAt: Date.now() })
    )
    setActivePinia(pinia)
    await router.push('/lab')
    await router.isReady()
    wrapper = mount(App, { attachTo: document.body, global: { plugins: [pinia, router] } })
    await settleRoute()
  })

  afterAll(() => wrapper.unmount())

  it('publishes one canonical URL and one route description', async () => {
    await router.push('/lab')
    await settleRoute()

    const canonicalLinks = document.head.querySelectorAll('link[rel="canonical"]')
    const descriptions = document.head.querySelectorAll('meta[name="description"]')
    expect(canonicalLinks).toHaveLength(1)
    expect(canonicalLinks[0]?.getAttribute('href')).toBe('http://localhost:3000/lab')
    expect(descriptions).toHaveLength(1)
    expect(descriptions[0]?.getAttribute('content')).toContain('Vue')
  })

  it.each([
    ['/lab', '交互实验室'],
    ['/', '佘杰'],
    ['/projects', '项目'],
    ['/blog', '博客'],
    ['/projects/1', '澳斯康'],
    ['/lab/aurora', 'Aurora'],
    ['/missing-page', '404']
  ])('renders %s through the real application shell', async (path, text) => {
    await router.push(path)
    await settleRoute()
    expect(wrapper.text()).toContain(text)
  })

  it('filters the Lab catalog through its public search control', async () => {
    await router.push('/lab')
    await settleRoute()
    const search = wrapper.get('input[type="search"]')
    await search.setValue('数字')
    expect(wrapper.text()).toContain('数字滚动')
  })
})
