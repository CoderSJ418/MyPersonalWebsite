import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import About from '@/views/About.vue'

describe('About.vue', () => {
  let router: any
  let pinia: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/about', component: About }
      ]
    })
  })

  it('should render the component', () => {
    const wrapper = mount(About, {
      global: {
        plugins: [router, pinia]
      }
    })

    expect(wrapper.find('.about-page').exists()).toBe(true)
  })

  it('should render PersonalInfo component', () => {
    const wrapper = mount(About, {
      global: {
        plugins: [router, pinia]
      }
    })

    expect(wrapper.findComponent({ name: 'PersonalInfo' }).exists()).toBe(true)
  })

  it('should render WorkExperience component', () => {
    const wrapper = mount(About, {
      global: {
        plugins: [router, pinia]
      }
    })

    expect(wrapper.findComponent({ name: 'WorkExperience' }).exists()).toBe(true)
  })

  it('should render Education component', () => {
    const wrapper = mount(About, {
      global: {
        plugins: [router, pinia]
      }
    })

    expect(wrapper.findComponent({ name: 'Education' }).exists()).toBe(true)
  })

  it('should render Skills component', () => {
    const wrapper = mount(About, {
      global: {
        plugins: [router, pinia]
      }
    })

    expect(wrapper.findComponent({ name: 'Skills' }).exists()).toBe(true)
  })

  it('should scroll to top on mount', () => {
    window.scrollTo = vi.fn()

    mount(About, {
      global: {
        plugins: [router, pinia]
      }
    })

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })
})