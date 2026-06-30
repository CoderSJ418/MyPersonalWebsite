<template>
  <main class="min-h-screen bg-white dark:bg-slate-900">
    <SEOHead
      title="项目作品"
      description="从企业官网到 SaaS 平台，从微信小程序到数据可视化，每个项目都承载着独特的技术挑战和创新思路"
    />
    <PageHero title="项目作品" subtitle="从企业官网到 SaaS 平台，从微信小程序到数据可视化，每个项目都承载着独特的技术挑战和创新思路" />

    <!-- 筛选器区域 -->
    <section class="py-8 bg-white dark:bg-slate-900">
      <div class="container mx-auto px-4 sm:px-6">
        <div class="text-center mb-6">
          <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100">筛选项目</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">按技术栈或类型筛选项目</p>
        </div>
        <TechStackFilter />
      </div>
    </section>

    <!-- 项目列表区域 -->
    <section class="py-8 pb-16 bg-white dark:bg-slate-900">
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
