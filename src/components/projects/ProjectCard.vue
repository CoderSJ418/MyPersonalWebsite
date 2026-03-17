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
      <div v-if="project.featured" class="project-card__featured">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        精选
      </div>
    </div>

    <div class="project-card__content">
      <div class="project-card__header">
        <h3 class="project-card__title">{{ project.title }}</h3>
        <span class="project-card__year">{{ project.year || '2024' }}</span>
      </div>

      <p class="project-card__description">{{ project.description }}</p>

      <div class="project-card__footer">
        <div class="project-card__tech-stack">
          <span v-for="tech in techStackNames.slice(0, 4)" :key="tech" class="tag">
            {{ tech }}
          </span>
          <span v-if="techStackNames.length > 4" class="tag tag--more">
            +{{ techStackNames.length - 4 }}
          </span>
        </div>

        <a
          v-if="project.demoUrl"
          :href="project.demoUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="project-card__link"
          @click.stop
        >
          查看详情
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 紧凑型项目卡片 */
.project-card {
  position: relative;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 200ms ease;
}

.project-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
}

.project-card:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.project-card__image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 56.25%;  /* 16:9 行业标准比例 */
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
  transition: transform 300ms ease;
}

.project-card:hover .project-card__image {
  transform: scale(1.02);
}

.project-card__featured {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background-color: #dc2626;  /* red-600 - 行业推荐 Featured 颜色 */
  color: white;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 4px;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.4);
}

.dark .project-card__featured {
  background-color: #f87171;  /* red-400 - 深色模式更亮 */
  box-shadow: 0 2px 8px rgba(248, 113, 113, 0.5);
}

.project-card__content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  min-height: 140px;
}

.project-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
}

.project-card__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
  flex: 1;
}

.project-card__year {
  flex-shrink: 0;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-tertiary);
  padding: 2px 8px;
  background-color: var(--bg-secondary);
  border-radius: 4px;
}

.project-card__description {
  margin: 0 0 12px 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-card__footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: auto;
}

.project-card__tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
  background-color: var(--bg-secondary);
  border-radius: 9999px;  /* 胶囊形 - 行业推荐 */
  transition: all 0.2s ease;
}

.tag--more {
  color: var(--text-tertiary);
}

.project-card__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 10px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-primary);
  background-color: rgba(99, 102, 241, 0.08);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  margin-top: 4px;
}

.project-card__link:hover {
  background-color: var(--color-primary);
  color: white;
}

.dark .project-card__link {
  background-color: rgba(129, 140, 248, 0.1);
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .project-card {
    transition-duration: 0.01ms !important;
  }
  
  .project-card__image {
    transition-duration: 0.01ms !important;
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .project-card__content {
    padding: 12px;
  }

  .project-card__title {
    font-size: 1rem;
  }

  .project-card__description {
    font-size: 0.8125rem;
  }
}
</style>