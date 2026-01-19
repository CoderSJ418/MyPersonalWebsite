<template>
  <section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 relative overflow-hidden">
    <ParticleBackground />
    <div class="container mx-auto px-4 py-16 md:py-20 text-center relative z-10">
      <div class="max-w-3xl mx-auto">
        <h1
          ref="titleRef"
          class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6"
        >
          你好，我是
          <span class="text-primary-600 dark:text-primary-400">佘杰</span>
        </h1>
        <p
          ref="subtitleRef"
          class="text-xl md:text-2xl lg:text-3xl text-gray-700 dark:text-gray-300 mb-4 md:mb-8"
        >
          {{ currentText }}<span class="animate-pulse">|</span>
        </p>
        <p
          ref="descriptionRef"
          class="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8 md:mb-12 max-w-2xl mx-auto"
        >
          7年前端开发经验，Vue专家，专注于前端技术栈和工程化。
          热爱技术，追求卓越，致力于构建高性能、可维护的前端应用。
        </p>
        <div
          ref="ctaRef"
          class="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center"
        >
          <RouterLink
            to="/projects"
            class="hero-cta px-6 md:px-8 py-3 md:py-4 min-h-[44px] bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold active:scale-95"
          >
            查看项目
          </RouterLink>
          <RouterLink
            to="/contact"
            class="hero-cta px-6 md:px-8 py-3 md:py-4 min-h-[44px] border-2 border-primary-600 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold active:scale-95"
          >
            联系我
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ParticleBackground from '@/components/common/ParticleBackground.vue'
import { useGSAPAnimations } from '@/composables/useGSAPAnimations'

const texts = ['前端开发工程师', 'Vue专家', 'TypeScript爱好者', '全栈开发者']
const currentText = ref('')
const currentIndex = ref(0)
const isDeleting = ref(false)
let timeoutId: ReturnType<typeof setTimeout> | null = null

// 引用元素
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const descriptionRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)

// 使用 GSAP 动画
const { fadeIn, fadeInUp, scaleIn, staggerIn } = useGSAPAnimations()

const typeText = () => {
  const text = texts[currentIndex.value]

  if (isDeleting.value) {
    currentText.value = text.substring(0, currentText.value.length - 1)
  } else {
    currentText.value = text.substring(0, currentText.value.length + 1)
  }

  let typeSpeed = isDeleting.value ? 50 : 100

  if (!isDeleting.value && currentText.value === text) {
    typeSpeed = 2000
    isDeleting.value = true
  } else if (isDeleting.value && currentText.value === '') {
    isDeleting.value = false
    currentIndex.value = (currentIndex.value + 1) % texts.length
    typeSpeed = 500
  }

  timeoutId = setTimeout(typeText, typeSpeed)
}

onMounted(() => {
  // 页面加载动画
  if (titleRef.value) {
    fadeIn(titleRef.value, { duration: 0.8, delay: 0.2 })
  }

  if (subtitleRef.value) {
    fadeInUp(subtitleRef.value, { duration: 0.8, delay: 0.4 })
  }

  if (descriptionRef.value) {
    fadeInUp(descriptionRef.value, { duration: 0.8, delay: 0.6 })
  }

  if (ctaRef.value) {
    const ctaButtons = ctaRef.value.querySelectorAll('.hero-cta')
    staggerIn(ctaButtons, { duration: 0.6, delay: 0.8 })
  }

  // 启动打字机效果
  typeText()
})

onUnmounted(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})
</script>