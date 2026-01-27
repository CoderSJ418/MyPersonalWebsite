import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import ProjectDetail from '@/components/projects/ProjectDetail.vue'
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

  it('should render loading state', () => {
    const projectStore = useProjectStore()
    projectStore.loading = true
    projectStore.error = null
    projectStore.currentProjectDetail = null

    const wrapper = mount(ProjectDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    expect(wrapper.find('.project-detail__loading').exists()).toBe(true)
    expect(wrapper.find('.project-detail__skeleton-header').exists()).toBe(true)
  })

  it('should render error state', () => {
    const projectStore = useProjectStore()
    projectStore.loading = false
    projectStore.error = 'Failed to load project'
    projectStore.currentProjectDetail = null

    const wrapper = mount(ProjectDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    expect(wrapper.find('.project-detail__error').exists()).toBe(true)
    expect(wrapper.find('.project-detail__error').text()).toContain('Failed to load project')
  })

  it('should render not found state', () => {
    const projectStore = useProjectStore()
    projectStore.loading = false
    projectStore.error = null
    projectStore.currentProjectDetail = null

    const wrapper = mount(ProjectDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    expect(wrapper.find('.project-detail__not-found').exists()).toBe(true)
    expect(wrapper.find('.project-detail__not-found').text()).toContain('项目不存在')
  })

  it('should render project detail when data is loaded', async () => {
    const projectStore = useProjectStore()
    await projectStore.loadProjectDetail('1')

    const wrapper = mount(ProjectDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 500))

    expect(wrapper.find('.project-detail__content').exists()).toBe(true)
    expect(wrapper.find('.project-detail__title').text()).toBe('澳斯康生物官网重构项目')
  })

  it('should render project cover image', async () => {
    const projectStore = useProjectStore()
    await projectStore.loadProjectDetail('1')

    const wrapper = mount(ProjectDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 500))

    const coverImage = wrapper.find('.project-detail__cover-image')
    expect(coverImage.exists()).toBe(true)
    expect(coverImage.attributes('src')).toBe('/images/projects/auskang.svg')
  })

  it('should render featured badge for featured project', async () => {
    const projectStore = useProjectStore()
    await projectStore.loadProjectDetail('1')

    const wrapper = mount(ProjectDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 500))

    expect(wrapper.find('.project-detail__featured').exists()).toBe(true)
    expect(wrapper.find('.project-detail__featured').text()).toBe('精选项目')
  })

  it('should render tech stack tags', async () => {
    const projectStore = useProjectStore()
    await projectStore.loadProjectDetail('1')

    const wrapper = mount(ProjectDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 500))

    const techTags = wrapper.findAll('.project-detail__tech-tag')
    expect(techTags.length).toBeGreaterThan(0)
    expect(techTags[0].text()).toContain('Vue')
  })

  it('should render project links', async () => {
    const projectStore = useProjectStore()
    await projectStore.loadProjectDetail('1')

    const wrapper = mount(ProjectDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 500))

    const demoLink = wrapper.find('.project-detail__link--demo')
    expect(demoLink.exists()).toBe(true)
    expect(demoLink.attributes('href')).toBe('https://example.com')

    const githubLink = wrapper.find('.project-detail__link--github')
    expect(githubLink.exists()).toBe(true)
    expect(githubLink.attributes('href')).toBe('https://github.com/example')
  })

  it('should render project background section', async () => {
    const projectStore = useProjectStore()
    await projectStore.loadProjectDetail('1')

    const wrapper = mount(ProjectDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 500))

    expect(wrapper.find('.project-detail__section-title').text()).toContain('项目背景')
  })

  it('should render project goals section', async () => {
    const projectStore = useProjectStore()
    await projectStore.loadProjectDetail('1')

    const wrapper = mount(ProjectDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 500))

    const sectionTitles = wrapper.findAll('.project-detail__section-title')
    const goalsTitle = sectionTitles.find(title => title.text() === '项目目标')
    expect(goalsTitle).toBeDefined()
  })

  it('should render project features section', async () => {
    const projectStore = useProjectStore()
    await projectStore.loadProjectDetail('1')

    const wrapper = mount(ProjectDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 500))

    const sectionTitles = wrapper.findAll('.project-detail__section-title')
    const featuresTitle = sectionTitles.find(title => title.text() === '实现功能')
    expect(featuresTitle).toBeDefined()
  })

  it('should render tech highlights section', async () => {
    const projectStore = useProjectStore()
    await projectStore.loadProjectDetail('1')

    const wrapper = mount(ProjectDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 500))

    const sectionTitles = wrapper.findAll('.project-detail__section-title')
    const techHighlightsTitle = sectionTitles.find(title => title.text() === '核心技术亮点')
    expect(techHighlightsTitle).toBeDefined()
  })

  it('should render project results section', async () => {
    const projectStore = useProjectStore()
    await projectStore.loadProjectDetail('1')

    const wrapper = mount(ProjectDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 500))

    const sectionTitles = wrapper.findAll('.project-detail__section-title')
    const resultsTitle = sectionTitles.find(title => title.text() === '项目成果')
    expect(resultsTitle).toBeDefined()
  })

  it('should render project screenshots', async () => {
    const projectStore = useProjectStore()
    await projectStore.loadProjectDetail('1')

    const wrapper = mount(ProjectDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 500))

    const screenshots = wrapper.findAll('.project-detail__screenshot')
    expect(screenshots.length).toBeGreaterThan(0)
  })

  it('should render related projects', async () => {
    const projectStore = useProjectStore()
    await projectStore.loadProjectDetail('1')

    const wrapper = mount(ProjectDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 500))

    const sectionTitles = wrapper.findAll('.project-detail__section-title')
    const relatedTitle = sectionTitles.find(title => title.text() === '相关项目')
    expect(relatedTitle).toBeDefined()
  })

  it('should navigate back when back button is clicked', async () => {
    const projectStore = useProjectStore()
    await projectStore.loadProjectDetail('1')

    const wrapper = mount(ProjectDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 500))

    const backBtn = wrapper.find('.project-detail__back-btn')
    await backBtn.trigger('click')
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(router.currentRoute.value.path).toBe('/projects')
  })

  it('should filter by tech stack when tech tag is clicked', async () => {
    const projectStore = useProjectStore()
    await projectStore.loadProjectDetail('1')

    const wrapper = mount(ProjectDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 500))

    const techTag = wrapper.find('.project-detail__tech-tag')
    await techTag.trigger('click')
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(projectStore.selectedTechStacks).toContain('Vue')
    expect(router.currentRoute.value.path).toBe('/projects')
  })

  it('should handle empty tech stack', async () => {
    const projectStore = useProjectStore()
    const testProject = {
      id: '999',
      title: 'Test Project',
      description: 'Test description',
      coverImage: '/test.png',
      techStack: [],
      category: 'Test',
      featured: false,
      demoUrl: '',
      githubUrl: '',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      background: 'Test background',
      goals: [],
      features: [],
      techHighlights: {},
      results: {},
      screenshots: []
    }
    projectStore.projects = [testProject]
    projectStore.currentProjectDetail = testProject as any
    projectStore.loading = false
    projectStore.error = null

    await router.push('/projects/999')

    const wrapper = mount(ProjectDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 500))

    const techTags = wrapper.findAll('.project-detail__tech-tag')
    expect(techTags.length).toBe(0)
  })

  it('should handle project without demo URL', async () => {
    const projectStore = useProjectStore()
    const testProject = {
      id: '998',
      title: 'Test Project',
      description: 'Test description',
      coverImage: '/test.png',
      techStack: [{ name: 'Vue', version: '3.0' }],
      category: 'Test',
      featured: false,
      demoUrl: '',
      githubUrl: 'https://github.com/test',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      background: 'Test background',
      goals: [],
      features: [],
      techHighlights: {},
      results: {},
      screenshots: []
    }
    projectStore.projects = [testProject]
    projectStore.currentProjectDetail = testProject as any
    projectStore.loading = false
    projectStore.error = null

    await router.push('/projects/998')

    const wrapper = mount(ProjectDetail, {
      global: {
        plugins: [router, pinia]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 500))

    const demoLink = wrapper.find('.project-detail__link--demo')
    expect(demoLink.exists()).toBe(false)

    const githubLink = wrapper.find('.project-detail__link--github')
    expect(githubLink.exists()).toBe(true)
  })
})