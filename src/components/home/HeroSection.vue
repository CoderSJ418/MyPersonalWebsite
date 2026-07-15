<template>
  <section
    class="relative isolate overflow-hidden bg-white px-4 pb-20 pt-32 sm:px-6 sm:pb-28 sm:pt-40"
    data-effect-consumer="aurora"
  >
    <AuroraDemo :speed="1.25" color-theme="indigo" embedded decorative />
    <div
      class="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-white/75 to-transparent"
      aria-hidden="true"
    ></div>

    <div class="relative z-10 mx-auto max-w-7xl">
      <div class="max-w-3xl">
        <p class="mb-6 inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
          AI Native Developer Portfolio
        </p>

        <h1 class="text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
          佘杰
        </h1>

        <p class="mt-6 text-xl font-semibold text-blue-600 sm:text-2xl">
          Vue Expert · Frontend Architect
        </p>

        <p class="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          专注高性能前端架构，从 0 到 1 构建可规模化工程体系，并以可验证的产品结果展示技术深度。
        </p>

        <div class="mt-10 flex flex-wrap gap-4">
          <CTA
            href="/projects"
            variant="primary"
            size="large"
            label="查看作品集"
            @click="trackHeroCta('projects')"
          >
            查看作品集
          </CTA>
          <CTA
            href="/lab?source=home_cta"
            variant="outline"
            size="large"
            label="探索交互实验室"
            @click="trackHeroCta('lab')"
          >
            探索交互实验室
          </CTA>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import CTA from '@/components/ui/CTA.vue'
import { trackLabAnalytics } from '@/services/privacyAnalytics'
import AuroraDemo from '@/views/Lab/demos/AuroraDemo.vue'

const trackHeroCta = (target: 'projects' | 'lab') => {
  trackLabAnalytics({
    event: target === 'projects' ? 'projects_cta_click' : 'lab_cta_click',
    placement: 'home_hero'
  })
}
</script>
