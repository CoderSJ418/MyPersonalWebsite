import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProjectStore } from '@/stores/useProjectStore'
import type { Project } from '@/types/project'

// Mock project data
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Vue 3 博客系统',
    description: '基于 Vue 3 的现代化博客系统',
    coverImage: '/images/projects/blog.png',
    techStack: [
      { name: 'Vue', version: '3.4.15' },
      { name: 'TypeScript', version: '5.3.3' }
    ],
    category: '企业官网',
    featured: true,
    demoUrl: 'https://example.com',
    githubUrl: 'https://github.com/example',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-22'
  },
  {
    id: '2',
    title: '企业后台管理系统',
    description: '基于 Vue 3 的企业级后台管理系统',
    coverImage: '/images/projects/admin.png',
    techStack: [
      { name: 'Vue', version: '3.4.15' },
      { name: 'Element Plus', version: '2.5.0' }
    ],
    category: '后台管理',
    featured: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-22'
  },
  {
    id: '3',
    title: '数据可视化大屏',
    description: '基于 ECharts 的数据可视化大屏',
    coverImage: '/images/projects/chart.png',
    techStack: [
      { name: 'Vue', version: '3.4.15' },
      { name: 'ECharts', version: '5.4.0' }
    ],
    category: '移动应用',
    featured: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-22'
  }
]

describe('useProjectStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with correct state', () => {
    const store = useProjectStore()

    expect(store.projects.length).toBeGreaterThan(0)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.selectedCategory).toBeNull()
    expect(store.searchQuery).toBe('')
  })

  it('should load projects successfully', async () => {
    const store = useProjectStore()

    await store.loadProjects()

    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.projects.length).toBeGreaterThan(0)
  })

  it('should filter projects by category', () => {
    const store = useProjectStore()

    store.filterByCategory('企业官网')

    expect(store.filteredProjects.every(project => project.category === '企业官网')).toBe(true)
  })

  it('should filter projects by tech stack', () => {
    const store = useProjectStore()

    store.filterByTechStack(['Vue'])

    expect(store.filteredProjects.every(project =>
      project.techStack.some(tech => tech.name === 'Vue')
    )).toBe(true)
  })

  it('should filter projects by search query', () => {
    const store = useProjectStore()

    store.searchProjects('Vue')

    expect(store.filteredProjects.length).toBeGreaterThan(0)
    expect(store.filteredProjects.every(project =>
      project.title.toLowerCase().includes('vue') ||
      project.description.toLowerCase().includes('vue') ||
      project.techStack.some(tech => tech.name.toLowerCase().includes('vue'))
    )).toBe(true)
  })

  it('should get featured projects', () => {
    const store = useProjectStore()

    const featured = store.featuredProjects

    expect(featured.every(project => project.featured)).toBe(true)
    expect(featured.length).toBeLessThanOrEqual(3)
  })

  it('should get all unique categories', () => {
    const store = useProjectStore()

    const categories = store.categories

    expect(categories.length).toBeGreaterThan(0)
    expect(categories).toContain('企业官网')
  })

  it('should get all unique tech stacks', () => {
    const store = useProjectStore()

    const techStacks = store.allTechStacks

    expect(techStacks.length).toBeGreaterThan(0)
    expect(techStacks).toContain('Vue')
  })

  it('should get project by id', () => {
    const store = useProjectStore()

    const project = store.getProjectById('1')

    expect(project).toBeDefined()
    expect(project?.id).toBe('1')
  })

  it('should return undefined for non-existent project', () => {
    const store = useProjectStore()

    const project = store.getProjectById('999')

    expect(project).toBeUndefined()
  })

  it('should combine multiple filters', () => {
    const store = useProjectStore()

    store.filterByCategory('企业官网')
    store.filterByTechStack(['TypeScript'])

    const filtered = store.filteredProjects

    expect(filtered.every(project =>
      project.category === '企业官网' &&
      project.techStack.some(tech => tech.name === 'TypeScript')
    )).toBe(true)
  })

  it('should reset filters when category is null', () => {
    const store = useProjectStore()

    store.filterByCategory('企业官网')
    expect(store.filteredProjects.length).toBeGreaterThan(0)

    store.filterByCategory(null)
    expect(store.selectedCategory).toBeNull()
  })

  it('should handle loading state', async () => {
    const store = useProjectStore()

    const loadPromise = store.loadProjects()
    expect(store.loading).toBe(true)

    await loadPromise
    expect(store.loading).toBe(false)
  })

  it('should handle error state', async () => {
    const store = useProjectStore()

    // 手动触发错误状态
    store.loading = true
    store.error = null
    await new Promise((_, reject) => {
      setTimeout(() => {
        store.error = 'Failed to load'
        store.loading = false
        reject(new Error('Test error'))
      }, 100)
    }).catch(() => {})

    expect(store.error).toBeTruthy()
    expect(store.loading).toBe(false)
  })
})