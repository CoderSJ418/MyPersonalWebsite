import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Skill, SkillCategory, SkillRadarData } from '@/types/skill'
import skillsData from '@/assets/data/skills.json'

export const useSkillStore = defineStore('skill', () => {
  const skills = ref<Skill[]>(skillsData)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const skillCategories = computed<SkillCategory[]>(() => {
    const categories = new Map<string, Skill[]>()

    skills.value.forEach(skill => {
      if (!categories.has(skill.category)) {
        categories.set(skill.category, [])
      }
      categories.get(skill.category)!.push(skill)
    })

    return Array.from(categories.entries()).map(([name, skills]) => ({
      name,
      skills
    }))
  })

  const skillRadarData = computed<SkillRadarData[]>(() => {
    return skillCategories.value.map(category => ({
      name: category.name,
      value: Math.round(
        category.skills.reduce((sum, skill) => sum + skill.level, 0) / category.skills.length
      )
    }))
  })

  const allCategories = computed(() => {
    return [...new Set(skills.value.map(skill => skill.category))]
  })

  const loadSkills = async () => {
    try {
      loading.value = true
      error.value = null
      await new Promise(resolve => setTimeout(resolve, 300))
      skills.value = skillsData
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load skills'
      console.error('Error loading skills:', err)
    } finally {
      loading.value = false
    }
  }

  const getSkillsByCategory = (category: string) => {
    return skills.value.filter(skill => skill.category === category)
  }

  const getSkillById = (id: string) => {
    return skills.value.find(skill => skill.id === id)
  }

  return {
    skills,
    loading,
    error,
    skillCategories,
    skillRadarData,
    allCategories,
    loadSkills,
    getSkillsByCategory,
    getSkillById
  }
})