<template>
  <article class="group relative flex min-h-[22rem] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-2xl">
    <div class="relative min-h-64 flex-1 overflow-hidden bg-slate-950">
      <MotionScenePreview :scene="scene" class="absolute inset-0" />
      <div class="pointer-events-none absolute left-4 top-4 flex gap-2">
        <span class="rounded-full border border-white/30 bg-black/35 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">{{ scene.referenceCategory }}</span>
        <span class="rounded-full border border-white/30 bg-black/35 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">{{ scene.renderer }}</span>
      </div>
    </div>

    <div class="relative z-10 border-t border-slate-100 bg-white p-5">
      <p class="text-[10px] font-bold tracking-[0.18em] text-blue-600">MotionSites · {{ scene.referenceName }}</p>
      <h3 class="mt-2 text-xl font-semibold tracking-tight text-slate-950">{{ scene.title }}</h3>
      <p class="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{{ scene.subtitle }}</p>
      <p class="mt-3 text-sm font-semibold text-blue-600">打开效果工作台 →</p>
    </div>

    <RouterLink
      :to="`/lab/scenes/${scene.id}`"
      class="absolute inset-0 z-20 rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
      :aria-label="`打开 ${scene.title} 效果工作台`"
    >
      <span class="sr-only">打开效果工作台</span>
    </RouterLink>
  </article>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import MotionScenePreview from '@/components/lab/MotionScenePreview.vue'
import type { MotionSceneRuntime } from '@/types/motionScene'

defineProps<{ scene: MotionSceneRuntime }>()
</script>
