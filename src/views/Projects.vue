<template>
  <div class="pt-20 md:pt-24 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="container mx-auto px-4 py-8 md:py-12">
      <h1
        ref="titleRef"
        class="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8 md:mb-12"
      >
        项目展示
      </h1>

      <div
        ref="gridRef"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        <div
          v-for="(project, index) in projectStore.projects"
          :key="project.id"
          class="project-card bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer active:scale-95"
          :data-index="index"
          @click="$router.push(`/projects/${project.id}`)"
        >
          <div class="h-40 md:h-48 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <span class="text-4xl md:text-6xl">🚀</span>
          </div>
          <div class="p-4 md:p-6">
            <h3 class="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2">
              {{ project.title }}
            </h3>
            <p class="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
              {{ project.description }}
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in project.tags"
                :key="tag"
                class="px-2 md:px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full text-xs md:text-sm"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProjectStore } from '@/stores/useProjectStore'
import { useGSAPAnimations } from '@/composables/useGSAPAnimations'

const projectStore = useProjectStore()
const titleRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)

const { fadeInUp, staggerIn } = useGSAPAnimations()

onMounted(() => {
  projectStore.loadProjects()

  // 标题动画
  if (titleRef.value) {
    fadeInUp(titleRef.value, { duration: 0.8 })
  }

  // 项目卡片逐个出现动画
  if (gridRef.value) {
    const cards = gridRef.value.querySelectorAll('.project-card')
    staggerIn(cards, { duration: 0.6, delay: 0.2 })
  }
})
</script>