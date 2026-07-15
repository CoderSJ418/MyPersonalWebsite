<script setup lang="ts">
/**
 * ProjectDetailRelated — 相关项目推荐
 *
 * 重构：使用 ContentCard variant="project" 替代自定义卡片
 * - 新CSS变量体系 + 深色模式
 */

import type { Project } from '@/types/project'
import ContentCard from '@/components/common/ContentCard.vue'
import DetailSection from '@/components/common/DetailSection.vue'

interface Props {
  projects: Project[]
}

defineProps<Props>()

const emit = defineEmits<{
  navigate: [projectId: string]
}>()

const handleCardClick = (project: Project) => {
  emit('navigate', project.id)
}
</script>

<template>
  <DetailSection title="相关项目" :divided="false">
    <div class="pdr__grid">
      <ContentCard
v-for="project in projects" :key="project.id" variant="project" :cover-image="project.coverImage"
        :cover-alt="project.title" :title="project.title" :description="project.description"
        :tags="project.techStack.map(t => t.name)" :max-tags="3" :featured="project.featured"
        :link-url="`/projects/${project.id}`" link-label="查看详情" :href="`/projects/${project.id}`"
        @click="handleCardClick(project)" />
    </div>
  </DetailSection>
</template>

<style scoped>
.pdr__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--us-space-6);
}

@media (min-width: 768px) {
  .pdr__grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
}
</style>