<template>
  <section 
    ref="sectionRef"
    class="py-20 bg-primary-600 dark:bg-primary-800 transition-colors duration-300"
  >
    <div class="container mx-auto px-4 text-center">
      <h2 
        ref="titleRef"
        class="text-4xl font-bold text-white mb-6"
      >
        准备好开始合作了吗？
      </h2>
      <p 
        ref="descriptionRef"
        class="text-xl text-primary-100 mb-12 max-w-2xl mx-auto"
      >
        如果您对我的技能感兴趣，或者有任何项目需要合作，欢迎随时联系我。
      </p>
      <div 
        ref="ctaRef"
        class="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <RouterLink
          to="/contact"
          class="cta-button px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold"
        >
          联系我
        </RouterLink>
        <a
          href="/resume.pdf"
          download
          class="cta-button px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-primary-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold"
        >
          下载简历
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGSAPAnimations } from '@/composables/useGSAPAnimations'

const sectionRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const descriptionRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)

const { fadeInUp, staggerIn } = useGSAPAnimations()

onMounted(() => {
  // 标题动画
  if (titleRef.value) {
    fadeInUp(titleRef.value, { duration: 0.8 })
  }
  
  // 描述动画
  if (descriptionRef.value) {
    fadeInUp(descriptionRef.value, { duration: 0.8, delay: 0.2 })
  }
  
  // CTA 按钮动画
  if (ctaRef.value) {
    const buttons = ctaRef.value.querySelectorAll('.cta-button')
    staggerIn(buttons, { duration: 0.6, delay: 0.4 })
  }
})
</script>