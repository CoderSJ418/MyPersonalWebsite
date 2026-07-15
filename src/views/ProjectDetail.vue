<template>
  <main class="project-detail-page pt-20">
    <SEOHead
      :title="project?.title || '项目详情'"
      :description="project?.description || '项目详细信息'"
      :structured-data="project ? projectStructuredData(project) : undefined"
    />
    <ProjectDetail />
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/useProjectStore'
import { projectStructuredData } from '@/utils/structuredData'
import ProjectDetail from '@/components/projects/ProjectDetail.vue'
import SEOHead from '@/components/common/SEOHead.vue'

const route = useRoute()
const projectStore = useProjectStore()
const project = projectStore.projects.find((p) => p.id === route.params.id)

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<style scoped>
.project-detail-page {
  min-height: 100vh; /* fallback for older browsers */
  min-height: 100dvh; /* dynamic viewport height for mobile */
  background: linear-gradient(180deg, var(--us-bg-start), var(--us-bg-end));
  color: var(--us-text-primary);
}
</style>
