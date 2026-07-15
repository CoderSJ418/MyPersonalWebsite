<template>
  <main
    class="page-container"
    style="background: linear-gradient(180deg, var(--us-bg-start), var(--us-bg-end))"
  >
    <SEOHead
      title="项目作品"
      description="真实商业项目中的跨端开发、状态建模、性能优化与组件化实践，明确区分个人贡献和团队成果。"
    />
    <PageHero title="项目作品" subtitle="从真实业务挑战出发，记录我的职责、工程取舍和可验证成果" />

    <!-- 筛选器区域 -->
    <section class="page-section">
      <div class="page-section__inner">
        <div class="filter-header">
          <h2 class="page-section__title">筛选项目</h2>
          <p class="page-section__desc">按技术栈或类型筛选项目</p>
        </div>
        <TechStackFilter />
      </div>
    </section>

    <!-- 项目列表区域 -->
    <section class="page-section page-section--last">
      <div class="page-section__inner">
        <ProjectList />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useProjectStore } from '@/stores/useProjectStore'
import SEOHead from '@/components/common/SEOHead.vue'
import PageHero from '@/components/templates/PageHero.vue'
import TechStackFilter from '@/components/projects/TechStackFilter.vue'
import ProjectList from '@/components/projects/ProjectList.vue'

const projectStore = useProjectStore()

onMounted(() => {
  projectStore.loadProjects()
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  /* fallback for older browsers */
  min-height: 100dvh;
  /* dynamic viewport height for mobile */
  padding-top: 72px;
  color: var(--us-text-primary);
}

.page-section {
  padding: var(--us-space-8) 0;
}

.page-section--last {
  padding-bottom: var(--us-space-20);
}

.page-section__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 768px) {
  .page-section__inner {
    padding: 0 1.5rem;
  }
}

.filter-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.page-section__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--us-text-primary);
  letter-spacing: -0.01em;
}

.page-section__desc {
  font-size: 0.875rem;
  color: var(--us-text-tertiary);
  margin-top: 0.25rem;
}
</style>
