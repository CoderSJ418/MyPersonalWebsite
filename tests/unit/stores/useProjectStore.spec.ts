import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useProjectStore } from '@/stores/useProjectStore'

describe('useProjectStore', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('filters and resolves project relationships', async () => {
    const store = useProjectStore()
    const first = store.projects[0]
    expect(first).toBeDefined()
    if (!first) return

    store.filterByCategory(first.category)
    expect(store.filteredProjects.every((item) => item.category === first.category)).toBe(true)
    store.filterByCategory(null)
    store.filterByTechStack([first.techStack[0]?.name ?? ''])
    expect(store.filteredProjects.length).toBeGreaterThan(0)
    store.filterByTechStack([])
    store.searchProjects(first.title)
    expect(store.filteredProjects[0]?.id).toBe(first.id)
    expect(store.featuredProjects.length).toBeLessThanOrEqual(3)
    expect(store.featuredProjects.map((project) => project.id).slice(0, 2)).toEqual(['4', '5'])
    expect(store.categories.length).toBeGreaterThan(0)
    expect(store.allTechStacks.length).toBeGreaterThan(0)
    expect(store.getProjectById(first.id)?.id).toBe(first.id)
    expect(store.getRelatedProjects('missing')).toEqual([])
    await store.loadProjectDetail(first.id)
    expect(store.getProjectDetail(first.id)?.id).toBe(first.id)
    await store.loadProjectDetail('missing')
    expect(store.error).toBe('Project not found')
    await store.loadProjects()
    expect(store.loading).toBe(false)
  })
})
