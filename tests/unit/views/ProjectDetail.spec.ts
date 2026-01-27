import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import ProjectDetail from '@/views/ProjectDetail.vue'
import { useProjectStore } from '@/stores/useProjectStore'

describe('ProjectDetail.vue', () => {
  let router: any
  let pinia: any

  beforeEach(async () => {
    pinia = createPinia()
    setActivePinia(pinia)
    
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/projects', component: { template: '<div>Projects</div>' } },
        { path: '/projects/:id', component: ProjectDetail }
      ]
    })
    
    await router.push('/projects/1')
  })

  it('should render the component', async () => {
    const projectStore = useProjectStore()
    await projectStore.loadProjectDetail('1')

    const wrapper = mount(ProjectDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 500))

    expect(wrapper.find('.project-detail-page').exists()).toBe(true)
  })

  it('should scroll to top on mount', async () => {
    window.scrollTo = vi.fn()

    const projectStore = useProjectStore()
    await projectStore.loadProjectDetail('1')

    mount(ProjectDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 500))

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('should load project detail on mount', async () => {
    const projectStore = useProjectStore()
    const loadProjectDetailSpy = vi.spyOn(projectStore, 'loadProjectDetail')

    mount(ProjectDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 500))

    expect(loadProjectDetailSpy).toHaveBeenCalledWith('1')
  })

  it('should render ProjectDetail component', async () => {
    const projectStore = useProjectStore()
    await projectStore.loadProjectDetail('1')

    const wrapper = mount(ProjectDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 500))

    expect(wrapper.findComponent({ name: 'ProjectDetail' }).exists()).toBe(true)
  })
})