<template>
  <div class="pt-16 min-h-screen bg-white dark:bg-slate-900">
    <SEOHead
      title="关于我"
      description="我的个人信息、工作经历、教育背景和技能"
      type="profile"
      :structured-data="personStructuredData()"
    />
    <div class="about-page__container">
      <PersonalInfo />
      <WorkExperience />
      <Education />
      <Skills />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import SEOHead from '@/components/common/SEOHead.vue'
import { personStructuredData } from '@/utils/structuredData'

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<style scoped>
.about-page__container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

@media (max-width: 768px) {
  .about-page__container {
    gap: 3rem;
  }
}

@media (max-width: 640px) {
  .about-page__container {
    gap: 2.5rem;
  }
}
</style>
