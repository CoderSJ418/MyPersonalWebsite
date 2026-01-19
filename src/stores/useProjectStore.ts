import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Project, ProjectFilter } from '@/types/project'
import projectsData from '@/assets/data/projects.json'

export const useProjectStore = defineStore('project', () => {
  const projects = ref<Project[]>(projectsData)
  const selectedCategory = ref<string | null>(null)
  const searchQuery = ref('')
  const loading = ref(false)
  const error = ref<string | null>(null)

  const filteredProjects = computed(() => {
    let filtered = projects.value

    if (selectedCategory.value) {
      filtered = filtered.filter(project =>
        project.tags.includes(selectedCategory.value!)
      )
    }

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return filtered
  })

  const featuredProjects = computed(() => {
    return projects.value.filter(project => project.featured).slice(0, 3)
  })

  const categories = computed(() => {
    const allTags = projects.value.flatMap(project => project.tags)
    return [...new Set(allTags)]
  })

  const loadProjects = async () => {
    try {
      loading.value = true
      error.value = null
      await new Promise(resolve => setTimeout(resolve, 300))
      projects.value = projectsData
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load projects'
      console.error('Error loading projects:', err)
    } finally {
      loading.value = false
    }
  }

  const filterByCategory = (category: string | null) => {
    selectedCategory.value = category
  }

  const searchProjects = (query: string) => {
    searchQuery.value = query
  }

  const getProjectById = (id: string) => {
    return projects.value.find(p => p.id === id)
  }

  return {
    projects,
    selectedCategory,
    searchQuery,
    loading,
    error,
    filteredProjects,
    featuredProjects,
    categories,
    loadProjects,
    filterByCategory,
    searchProjects,
    getProjectById
  }
})