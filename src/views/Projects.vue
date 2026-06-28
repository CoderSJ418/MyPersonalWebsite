<template>
  <main class="projects-page">
    <PageHero
title="项目作品" subtitle="从企业官网到 SaaS 平台，从微信小程序到数据可视化，每个项目都承载着独特的技术挑战和创新思路"
      :stats="[
        { number: '50+', label: '完成项目' },
        { number: '15+', label: '技术栈' },
        { number: '100%', label: '客户满意' }
      ]"
    />

    <!-- 筛选器区域 -->
    <section class="projects-filter">
      <div class="container mx-auto px-4 sm:px-6">
        <div class="filter-header">
          <h2 class="filter-title">筛选项目</h2>
          <p class="filter-description">按技术栈或类型筛选项目</p>
        </div>
        <TechStackFilter />
      </div>
    </section>

    <!-- 项目列表区域 -->
    <section class="projects-list">
      <div class="container mx-auto px-4 sm:px-6">
        <ProjectList />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useProjectStore } from '@/stores/useProjectStore'
import TechStackFilter from '@/components/projects/TechStackFilter.vue'
import ProjectList from '@/components/projects/ProjectList.vue'

const projectStore = useProjectStore()

onMounted(() => {
  projectStore.loadProjects()
  document.title = '项目展示 - 佘杰'
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<style scoped>
/* 项目页面 */
.projects-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

/* 英雄区域 */
.projects-hero {
  position: relative;
  padding: 6rem 0 3rem;
  background: var(--bg-secondary);
}

@media (max-width: 768px) {
  .projects-hero {
    padding: 4rem 0 2rem;
  }
}

.projects-hero__content {
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

.projects-hero__title {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.projects-hero__subtitle {
  font-size: 1rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;
}

.projects-hero__stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-tertiary);
}

/* 筛选器区域 */
.projects-filter {
  padding: 2rem 0;
  background: var(--bg-primary);
}

.filter-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.filter-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.filter-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

/* 项目列表区域 */
.projects-list {
  padding: 1rem 0 4rem;
  background: var(--bg-primary);
}

/* 响应式 */
@media (max-width: 768px) {
  .projects-hero {
    padding: 3rem 0 2rem;
  }
  
  .projects-hero__stats {
    gap: 2rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .projects-filter {
    padding: 1.5rem 0;
  }
  
  .filter-title {
    font-size: 1.125rem;
  }
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .projects-hero__badge {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
</style>