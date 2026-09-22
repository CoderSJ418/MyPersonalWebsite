<template>
  <section class="mt-12" aria-labelledby="motion-scenes-title">
    <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div class="max-w-3xl">
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">Featured Motion Scenes</p>
        <h2 id="motion-scenes-title" class="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          不是换参数，是换渲染方式。
        </h2>
        <p class="mt-4 leading-7 text-slate-600">
          12 个重点场景分别由 Three.js、Canvas、GLSL Shader 与 DOM Motion 驱动。先看视觉差异，再进入工作台拆参数和实现。
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

const rendererSummary = ['Three.js × 3', 'Canvas × 3', 'Shader × 3', 'DOM × 3']

const cardClass = (index: number) => {
  if (index === 0 || index === 6) return 'md:col-span-2 xl:col-span-4 min-h-[25rem]'
  if (index === 1 || index === 7) return 'xl:col-span-2 min-h-[25rem]'
  return 'xl:col-span-2'
}
</script>
