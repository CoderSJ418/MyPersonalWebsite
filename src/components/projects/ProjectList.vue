<script setup lang="ts">
import { computed } from 'vue'
import { useProjectStore } from '@/stores/useProjectStore'
import ProjectCard from './ProjectCard.vue'
import type { Project } from '@/types/project'

const projectStore = useProjectStore()

const filteredProjects = computed(() => projectStore.filteredProjects)
const loading = computed(() => projectStore.loading)
const error = computed(() => projectStore.error)

const handleProjectClick = (project: Project) => {
  // TODO: 导航到项目详情页
  console.log('Project clicked:', project.id)
}
</script>

<template>
  <div class="project-list">
    <!-- 加载状态 -->
    <div v-if="loading" class="project-list__loading">
      <div v-for="i in 6" :key="i" class="project-list__skeleton">
        <div class="project-list__skeleton-image"></div>
        <div class="project-list__skeleton-content">
          <div class="project-list__skeleton-title"></div>
          <div class="project-list__skeleton-description"></div>
          <div class="project-list__skeleton-tags"></div>
        </div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="project-list__error">
      <p>{{ error }}</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="filteredProjects.length === 0" class="project-list__empty">
      <p>暂无项目</p>
    </div>

    <!-- 项目列表 -->
    <div v-else class="project-list__grid">
      <ProjectCard
        v-for="project in filteredProjects"
        :key="project.id"
        :project="project"
        @click="handleProjectClick"
      />
    </div>
  </div>
</template>

<style scoped>
.project-list {
  width: 100%;
}

.project-list__loading {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.project-list__skeleton {
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  overflow: hidden;
}

.project-list__skeleton-image {
  width: 100%;
  padding-top: 56.25%;
  background-color: var(--color-bg-secondary);
  animation: pulse 1.5s ease-in-out infinite;
}

.project-list__skeleton-content {
  padding: 1.5rem;
}

.project-list__skeleton-title {
  width: 70%;
  height: 1.5rem;
  background-color: var(--color-bg-secondary);
  border-radius: 0.25rem;
  margin-bottom: 0.75rem;
  animation: pulse 1.5s ease-in-out infinite;
}

.project-list__skeleton-description {
  width: 100%;
  height: 1rem;
  background-color: var(--color-bg-secondary);
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
  animation: pulse 1.5s ease-in-out infinite;
}

.project-list__skeleton-tags {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.project-list__skeleton-tags::before,
.project-list__skeleton-tags::after {
  content: '';
  width: 4rem;
  height: 1.5rem;
  background-color: var(--color-bg-secondary);
  border-radius: 0.25rem;
  animation: pulse 1.5s ease-in-out infinite;
}

.project-list__error,
.project-list__empty {
  padding: 3rem;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 1rem;
}

.project-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .project-list__grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .project-list__loading {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .project-list__error,
  .project-list__empty {
    padding: 2rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .project-list__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .project-list__loading {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
