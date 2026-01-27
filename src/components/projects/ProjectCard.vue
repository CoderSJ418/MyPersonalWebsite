<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '@/types/project'
import SafeImage from '@/components/common/SafeImage.vue'

interface Props {
  project: Project
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [project: Project]
}>()

const handleClick = () => {
  emit('click', props.project)
}

const techStackNames = computed(() => {
  return props.project.techStack.map((tech) => tech.name)
})
</script>

<template>
  <div
    class="project-card"
    role="button"
    tabindex="0"
    :aria-label="`查看项目：${project.title}`"
    @click="handleClick"
  >
    <div class="project-card__image-wrapper">
      <SafeImage
        :src="project.coverImage"
        :alt="project.title"
        image-class="project-card__image"
        width="600"
        height="400"
      />
      <div v-if="project.featured" class="project-card__featured">精选</div>
    </div>

    <div class="project-card__content">
      <div class="project-card__meta">
        <span class="project-card__category">Web Development</span>
        <span class="project-card__year">2024</span>
      </div>

      <h3 class="project-card__title">{{ project.title }}</h3>
      <p class="project-card__description">{{ project.description }}</p>

      <div class="project-card__divider"></div>

      <div class="project-card__tech-stack">
        <span v-for="tech in techStackNames" :key="tech" class="tag">
          {{ tech }}
        </span>
      </div>

      <div class="project-card__links">
        <a
          v-if="project.demoUrl"
          :href="project.demoUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-primary"
          style="padding: 8px 16px; font-size: 14px;"
          @click.stop
        >
          演示
        </a>
        <a
          v-if="project.githubUrl"
          :href="project.githubUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-secondary"
          style="padding: 8px 16px; font-size: 14px;"
          @click.stop
        >
          源码
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 极简现代风格项目卡片 */
.project-card {
  position: relative;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.project-card:focus {
  outline: 2px solid var(--accent-color);
  outline-offset: 4px;
}

.project-card__image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  overflow: hidden;
  background-color: var(--bg-secondary);
}

.project-card__image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

.project-card:hover .project-card__image {
  transform: scale(1.05);
}

.project-card__featured {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--accent-color);
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.project-card__content {
  padding: 2rem;
}

.project-card__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.project-card__category {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--accent-color);
}

.project-card__year {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.project-card__title {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
}

.project-card__description {
  margin: 0 0 1.5rem 0;
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-card__divider {
  width: 100%;
  height: 1px;
  background: var(--border-color);
  margin-bottom: 1.5rem;
}

.project-card__tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.project-card__links {
  display: flex;
  gap: 1rem;
}

/* 极简现代动画变量 */
:root {
  --transition-fast: 150ms;
  --transition-normal: 300ms;
  --transition-slow: 500ms;
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .project-card__content {
    padding: 1.5rem;
  }

  .project-card__title {
    font-size: 1.25rem;
  }

  .project-card__description {
    font-size: 0.9375rem;
    -webkit-line-clamp: 4;
  }
}
</style>