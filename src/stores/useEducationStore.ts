import { defineStore } from 'pinia'
import { ref } from 'vue'
import educationData from '@/assets/data/education.json'

export const useEducationStore = defineStore('education', () => {
  const educations = ref(educationData)

  const loadEducations = () => {
    // 数据已经在导入时加载
    console.log('教育背景数据已加载:', educations.value.length)
  }

  return {
    educations,
    loadEducations
  }
})
