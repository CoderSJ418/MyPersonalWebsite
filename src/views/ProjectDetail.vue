<script setup lang="ts">
import ProjectDetail from '@/components/projects/ProjectDetail.vue'
import { onMounted } from 'vue'

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <main class="project-detail-page">
    <ProjectDetail />
  </main>
</template>

<style scoped>
.project-detail-page {
  min-height: 100vh;
  background-color: var(--color-bg-primary);
}
</style>
