<template>
  <div class="pt-20 md:pt-24 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="container mx-auto px-4 py-8 md:py-12">
      <h1
        ref="titleRef"
        class="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8 md:mb-12"
      >
        技能展示
      </h1>

      <div
        ref="containerRef"
        class="max-w-4xl mx-auto space-y-6 md:space-y-8"
      >
        <div
          v-for="(category, categoryIndex) in skillStore.skillCategories"
          :key="category.name"
          class="skill-category bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-6"
          :data-category-index="categoryIndex"
        >
          <h2 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
            {{ category.name }}
          </h2>
          <div class="space-y-3 md:space-y-4">
            <div
              v-for="(skill, skillIndex) in category.skills"
              :id="skill.id"
              :key="skill.id"
              class="skill-item"
              :data-skill-index="skillIndex"
            >
              <div class="flex justify-between mb-2">
                <span class="text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">{{ skill.name }}</span>
                <span class="text-sm md:text-base text-primary-600 dark:text-primary-400 font-medium">{{ skill.level }}%</span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 md:h-2.5 overflow-hidden">
                <div
                  class="skill-bar bg-primary-600 h-2 md:h-2.5 rounded-full transition-all duration-500"
                  :style="{ width: '0%' }"
                  :data-width="skill.level"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSkillStore } from '@/stores/useSkillStore'
import { useGSAPAnimations } from '@/composables/useGSAPAnimations'
import { gsap } from 'gsap'

const skillStore = useSkillStore()
const titleRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

const { fadeInUp, staggerIn } = useGSAPAnimations()

onMounted(() => {
  skillStore.loadSkills()

  // 标题动画
  if (titleRef.value) {
    fadeInUp(titleRef.value, { duration: 0.8 })
  }

  // 技能分类逐个出现动画
  if (containerRef.value) {
    const categories = containerRef.value.querySelectorAll('.skill-category')
    staggerIn(categories, { duration: 0.6, delay: 0.2 })

    // 技能条动画
    categories.forEach((category) => {
      const skillItems = category.querySelectorAll('.skill-item')
      skillItems.forEach((item) => {
        const skillBar = item.querySelector('.skill-bar')
        if (skillBar) {
          const targetWidth = skillBar.getAttribute('data-width')
          gsap.to(skillBar, {
            width: `${targetWidth}%`,
            duration: 1,
            delay: 0.5,
            ease: 'power2.out',
          })
        }
      })
    })
  }
})
</script>