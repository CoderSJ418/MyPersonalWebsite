import { defineStore } from 'pinia'
import { ref } from 'vue'
import experienceData from '@/assets/data/experience.json'

export const useExperienceStore = defineStore('experience', () => {
  const experiences = ref(experienceData)

  const loadExperiences = () => {
    // 数据已经在导入时加载
    console.log('工作经历数据已加载:', experiences.value.length)
  }

  return {
    experiences,
    loadExperiences
  }
})
