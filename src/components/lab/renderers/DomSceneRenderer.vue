<template>
  <div class="relative h-full min-h-64 overflow-hidden bg-slate-50 p-5">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(37,99,235,0.12),transparent_34%)]"></div>

    <div v-if="scene.variant === 'editorial'" class="relative flex h-full min-h-56 flex-col justify-between">
      <div class="flex items-center justify-between">
        <p class="text-[10px] font-bold tracking-[0.18em] text-blue-600">{{ scene.eyebrow }}</p>
        <span class="text-[10px] font-semibold text-slate-400">DOM / TYPE</span>
      </div>
      <div class="relative">
        <p
          class="origin-left text-[clamp(3.2rem,9vw,7.4rem)] font-black leading-[0.8] tracking-[-0.09em] text-slate-950 transition-transform duration-500"
          :style="{ transform: editorialTransform }"
        >
          {{ scene.labels[0] }}
        </p>
        <div class="mt-5 flex items-center gap-3">
          <span class="h-1.5 flex-1 rounded-full bg-blue-600"></span>
          <span class="text-xs font-semibold text-slate-500">{{ scene.labels[1] }}</span>
          <span class="text-xs font-semibold text-blue-600">{{ scene.labels[2] }}</span>
        </div>
      </div>
    </div>

    <div v-else-if="scene.variant === 'control-room'" class="relative grid h-full min-h-56 grid-cols-[0.7fr_1.4fr_0.9fr] gap-3">
      <div class="rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm">
        <p class="text-[9px] font-bold tracking-widest text-slate-400">{{ scene.labels[0] }}</p>
        <div class="mt-4 space-y-2">
          <div v-for="index in 4" :key="index" class="rounded-lg bg-slate-100 p-2">
            <span class="block h-1.5 rounded-full bg-slate-300" :class="index === activeStep ? 'w-4/5 bg-blue-600' : 'w-2/3'"></span>
          </div>
        </div>
      </div>
      <div class="relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-4 shadow-lg">
        <p class="text-[9px] font-bold tracking-widest text-blue-600">{{ scene.labels[1] }}</p>
        <div class="absolute inset-x-5 top-1/2 h-px bg-blue-100"></div>
        <div class="relative mt-10 grid grid-cols-4 gap-2">
          <div
            v-for="index in 4"
            :key="index"
            class="grid aspect-square place-items-center rounded-full border text-[10px] font-bold transition duration-300"
            :class="index <= activeStep ? 'border-blue-600 bg-blue-600 text-white shadow-lg' : 'border-slate-200 bg-white text-slate-400'"
          >
            0{{ index }}
          </div>
        </div>
      </div>
      <div class="rounded-2xl border border-emerald-100 bg-white/90 p-3 shadow-sm">
        <p class="text-[9px] font-bold tracking-widest text-emerald-600">{{ scene.labels[2] }}</p>
        <div class="mt-5 rounded-xl bg-emerald-50 p-3">
          <span class="block h-2 w-2 rounded-full bg-emerald-500"></span>
          <span class="mt-4 block h-2 w-3/4 rounded-full bg-emerald-200"></span>
          <span class="mt-2 block h-2 w-1/2 rounded-full bg-emerald-100"></span>
        </div>
      </div>
    </div>

    <div v-else class="relative grid h-full min-h-56 grid-cols-3 grid-rows-2 gap-3">
      <div class="col-span-2 row-span-2 flex flex-col justify-between rounded-2xl border border-blue-100 bg-white p-5 shadow-lg">
        <p class="text-[10px] font-bold tracking-[0.18em] text-blue-600">{{ scene.eyebrow }}</p>
        <div>
          <p class="text-3xl font-black tracking-[-0.06em] text-slate-950">{{ scene.labels[0] }}</p>
          <div class="mt-3 h-2 w-3/4 rounded-full bg-blue-600"></div>
          <div class="mt-2 h-2 w-1/2 rounded-full bg-blue-100"></div>
        </div>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-4">
        <p class="text-[9px] font-bold text-slate-400">{{ scene.labels[1] }}</p>
        <p class="mt-4 text-3xl font-black text-slate-950">98</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-white">
        <p class="text-[9px] font-bold text-slate-400">{{ scene.labels[2] }}</p>
        <div class="mt-5 flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
          <span class="text-xs font-semibold">VERIFIED</span>
        </div>
      </div>
    </div>

    <span class="pointer-events-none absolute bottom-4 right-4 rounded-full border border-slate-200 bg-white/80 px-2.5 py-1 text-[10px] font-bold text-slate-500 backdrop-blur">
      DOM SCENE
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

import type { LabParams } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'

interface Props {
  scene: MotionSceneRuntime
  params: LabParams
}

const props = defineProps<Props>()
const activeStep = ref(1)
const reducedMotion = ref(false)
let timer = 0

const numberParam = (key: string, fallback: number) => {
  const value = props.params[key]
  return typeof value === 'number' ? value : fallback
}

const editorialTransform = computed(() => {
  const depth = numberParam('depth', 0.5)
  const intensity = numberParam('intensity', 0.7)
  return `translate3d(${depth * 10}px, ${-intensity * 6}px, 0) skewX(${-intensity * 2.5}deg)`
})

const restart = () => {
  window.clearInterval(timer)
  if (reducedMotion.value || props.scene.variant !== 'control-room') return
  const speed = Math.max(0.1, numberParam('speed', 0.6))
  timer = window.setInterval(() => {
    activeStep.value = activeStep.value >= 4 ? 1 : activeStep.value + 1
  }, 1050 / speed)
}

watch(() => props.params.speed, restart)

onMounted(() => {
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  restart()
})

onUnmounted(() => window.clearInterval(timer))
</script>
