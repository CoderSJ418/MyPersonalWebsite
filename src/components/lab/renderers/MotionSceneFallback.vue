<template>
  <div class="relative h-full min-h-64 overflow-hidden bg-slate-50">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.12),transparent_34%),radial-gradient(circle_at_80%_70%,rgba(14,165,233,0.10),transparent_36%)]"></div>
    <div class="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(148,163,184,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.14)_1px,transparent_1px)] [background-size:32px_32px]"></div>

    <div v-if="scene.renderer === 'three'" class="absolute inset-0 grid place-items-center">
      <div class="relative h-40 w-56 [perspective:900px]">
        <div class="absolute left-2 top-10 h-28 w-40 -rotate-6 rounded-2xl border border-blue-100 bg-white/80 shadow-xl"></div>
        <div class="absolute right-0 top-4 h-32 w-44 rotate-6 rounded-2xl border border-blue-200 bg-white shadow-2xl">
          <div class="m-3 h-2 w-16 rounded-full bg-blue-600"></div>
          <div class="mx-3 mt-4 h-16 rounded-xl bg-blue-50"></div>
        </div>
      </div>
    </div>

    <div v-else-if="scene.renderer === 'shader'" class="absolute inset-0">
      <div class="absolute left-[-10%] top-[25%] h-24 w-[120%] -rotate-6 rounded-[50%] bg-gradient-to-r from-blue-200 via-blue-600/75 to-cyan-200 blur-xl"></div>
      <div class="absolute left-[-8%] top-[48%] h-16 w-[116%] rotate-6 rounded-[50%] bg-gradient-to-r from-cyan-100 via-blue-400/70 to-indigo-100 blur-lg"></div>
    </div>

    <div v-else-if="scene.renderer === 'canvas'" class="absolute inset-0">
      <span
        v-for="index in 16"
        :key="index"
        class="absolute h-1.5 w-1.5 rounded-full bg-blue-600/70 shadow-[0_0_18px_rgba(37,99,235,0.6)]"
        :style="pointStyle(index)"
      ></span>
    </div>

    <div v-else class="absolute inset-0 grid grid-cols-3 gap-3 p-8">
      <div class="col-span-2 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-lg">
        <div class="text-4xl font-black tracking-[-0.08em] text-slate-950">{{ scene.labels[0] }}</div>
        <div class="mt-8 h-2 w-2/3 rounded-full bg-blue-600"></div>
      </div>
      <div class="space-y-3">
        <div class="h-24 rounded-2xl border border-blue-100 bg-blue-50"></div>
        <div class="h-20 rounded-2xl border border-slate-200 bg-white"></div>
      </div>
    </div>

    <div class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-white via-white/90 to-transparent p-5 pt-16">
      <div>
        <p class="text-[10px] font-bold tracking-[0.18em] text-blue-600">{{ scene.eyebrow }}</p>
        <p class="mt-1 text-sm font-semibold text-slate-950">{{ scene.title }}</p>
      </div>
      <span class="rounded-full border border-slate-200 bg-white/80 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
        STATIC
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'

import type { MotionSceneRuntime } from '@/types/motionScene'

interface Props {
  scene: MotionSceneRuntime
}

defineProps<Props>()

const pointStyle = (index: number): CSSProperties => ({
  left: `${8 + ((index * 23) % 82)}%`,
  top: `${12 + ((index * 37) % 70)}%`,
  transform: `scale(${0.7 + (index % 4) * 0.22})`
})
</script>
