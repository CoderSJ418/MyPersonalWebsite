<template>
  <section class="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
    <div class="container mx-auto px-4">
      <h2 
        ref="titleRef"
        class="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12"
      >
        技术栈
      </h2>
      <div 
        ref="gridRef"
        class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8"
      >
        <div
          v-for="(tech, index) in techStack"
          :key="tech.name"
          class="tech-card flex flex-col items-center p-6 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
          :data-index="index"
        >
          <div class="text-5xl mb-4">{{ tech.icon }}</div>
          <span class="text-gray-700 dark:text-gray-300 font-medium">{{ tech.name }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGSAPAnimations } from '@/composables/useGSAPAnimations'

const techStack = [
  { name: 'Vue 3', icon: '🟢' },
  { name: 'React', icon: '⚛️' },
  { name: 'TypeScript', icon: '📘' },
  { name: 'Vite', icon: '⚡' },
  { name: 'Pinia', icon: '🍍' },
  { name: 'Tailwind', icon: '🎨' }
]

const titleRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)

const { fadeInUp, staggerIn } = useGSAPAnimations()

onMounted(() => {
  // 标题动画
  if (titleRef.value) {
    fadeInUp(titleRef.value, { duration: 0.8 })
  }
  
  // 技术卡片逐个出现动画
  if (gridRef.value) {
    const cards = gridRef.value.querySelectorAll('.tech-card')
    staggerIn(cards, { duration: 0.6, delay: 0.2 })
  }
})
</script>