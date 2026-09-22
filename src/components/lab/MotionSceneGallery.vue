<template>
  <section class="mt-12" aria-labelledby="motion-scenes-title">
    <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div class="max-w-3xl">
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Featured Motion Scenes</p>
        <h2 id="motion-scenes-title" class="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          把 MotionSites 的成品效果真正跑进实验室。
        </h2>
        <p class="mt-4 leading-7 text-slate-600">
          24 个重点实验直接对应 MotionSites 公开可见的 Digital Epoch、Future 3D Portfolio、Codeveil、Orbit Stickers、Space planet、Frozen Cave 等成品视觉。每个都有独立实现，不再用一套 Renderer 换参数冒充不同效果；点击后可进入工作台调参和查看源码。
        </p>
      </div>
      <div class="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
        <span v-for="item in rendererSummary" :key="item" class="rounded-full border border-slate-200 bg-white px-3 py-2">{{ item }}</span>
      </div>
    </div>

    <div class="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-6">
      <MotionSceneCard
        v-for="(scene, index) in featuredMotionScenes"
        :key="scene.id"
        :scene="scene"
        :class="cardClass(index)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import MotionSceneCard from '@/components/lab/MotionSceneCard.vue'
import { featuredMotionScenes } from '@/config/motionSceneRegistry'

const rendererSummary = ['Three.js × 8', 'Canvas × 4', 'Shader × 5', 'DOM Motion × 7']

const cardClass = (index: number) => {
  if ([0, 5, 12, 17].includes(index)) return 'md:col-span-2 xl:col-span-4 min-h-[25rem]'
  if ([1, 6, 13, 18].includes(index)) return 'xl:col-span-2 min-h-[25rem]'
  return 'xl:col-span-2'
}
</script>
