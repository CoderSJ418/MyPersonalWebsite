<script setup lang="ts">
import { onMounted } from 'vue'
import PersonalInfo from '@/components/about/PersonalInfo.vue'
import WorkExperience from '@/components/about/WorkExperience.vue'
import Education from '@/components/about/Education.vue'
import Skills from '@/components/about/Skills.vue'

onMounted(() => {
  document.title = '关于我 - 佘杰'
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<template>
  <main class="about-page">
    <div class="about-page__container">
      <PersonalInfo />
      <WorkExperience />
      <Education />
      <Skills />
    </div>
  </main>
</template>

<style scoped>
/* 关于页面 */
.about-page {
  min-height: 100vh;
  background: var(--bg-primary);
  padding: 6rem 1rem 4rem;
}

.about-page__container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

/* 响应式 */
@media (max-width: 768px) {
  .about-page {
    padding: 5rem 1rem 3rem;
  }
  
  .about-page__container {
    gap: 3rem;
  }
}

@media (max-width: 640px) {
  .about-page {
    padding: 4rem 1rem 2.5rem;
  }
  
  .about-page__container {
    gap: 2.5rem;
  }
}
</style>