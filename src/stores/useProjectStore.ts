import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Project, ProjectDetail } from '@/types/project'
import projectsData from '@/assets/data/projects.json'

export const useProjectStore = defineStore('project', () => {
  const projects = ref<Project[]>(projectsData)
  const selectedCategory = ref<string | null>(null)
  const selectedTechStacks = ref<string[]>([])
  const searchQuery = ref('')
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentProjectDetail = ref<ProjectDetail | null>(null)

  const filteredProjects = computed(() => {
    let filtered = projects.value

    if (selectedCategory.value) {
      filtered = filtered.filter((project) => project.category === selectedCategory.value)
    }

    if (selectedTechStacks.value.length > 0) {
      filtered = filtered.filter((project) =>
        project.techStack.some((tech) => selectedTechStacks.value.includes(tech.name))
      )
    }

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.techStack.some((tech) => tech.name.toLowerCase().includes(query))
      )
    }

    return filtered
  })

  const featuredProjects = computed(() => {
    return projects.value.filter((project) => project.featured).slice(0, 3)
  })

  const categories = computed(() => {
    const allCategories = projects.value.map((project) => project.category)
    return [...new Set(allCategories)]
  })

  const allTechStacks = computed(() => {
    const allTechs = projects.value.flatMap((project) => project.techStack)
    return [...new Set(allTechs.map((tech) => tech.name))]
  })

  const loadProjects = async () => {
    try {
      loading.value = true
      error.value = null
      await new Promise((resolve) => setTimeout(resolve, 300))
      projects.value = projectsData
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load projects'
      console.error('Error loading projects:', err)
    } finally {
      loading.value = false
    }
  }

  const loadProjectDetail = async (id: string) => {
    try {
      loading.value = true
      error.value = null
      await new Promise((resolve) => setTimeout(resolve, 300))
      const project = projects.value.find((p) => p.id === id)
      if (project) {
        currentProjectDetail.value = project as ProjectDetail
      } else {
        error.value = 'Project not found'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load project detail'
      console.error('Error loading project detail:', err)
    } finally {
      loading.value = false
    }
  }

  const filterByCategory = (category: string | null) => {
    selectedCategory.value = category
  }

  const filterByTechStack = (techStacks: string[]) => {
    selectedTechStacks.value = techStacks
  }

  const searchProjects = (query: string) => {
    searchQuery.value = query
  }

  const getProjectById = (id: string) => {
    return projects.value.find((p) => p.id === id)
  }

  const getProjectDetail = (_id: string) => {
    return currentProjectDetail.value
  }

  const getRelatedProjects = (id: string) => {
    const currentProject = projects.value.find((p) => p.id === id)
    if (!currentProject) return []

    const relatedByCategory = projects.value.filter(
      (p) => p.id !== id && p.category === currentProject.category
    )
    const relatedByTechStack = projects.value.filter(
      (p) =>
        p.id !== id &&
        p.techStack.some((tech) =>
          currentProject.techStack.some((currentTech) => currentTech.name === tech.name)
        )
    )

    const relatedProjectsMap = new Map<string, Project>()
    relatedByCategory.forEach((p) => relatedProjectsMap.set(p.id, p))
    relatedByTechStack.forEach((p) => relatedProjectsMap.set(p.id, p))

    return Array.from(relatedProjectsMap.values()).slice(0, 5)
  }

  return {
    projects,
    selectedCategory,
    selectedTechStacks,
    searchQuery,
    loading,
    error,
    filteredProjects,
    featuredProjects,
    categories,
    allTechStacks,
    currentProjectDetail,
    loadProjects,
    loadProjectDetail,
    getProjectById,
    getProjectDetail,
    getRelatedProjects,
    filterByCategory,
    filterByTechStack,
    searchProjects
  }
})
