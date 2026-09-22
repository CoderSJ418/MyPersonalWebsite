<template>
  <div
    ref="visualRef"
    class="absolute inset-y-8 right-4 hidden w-[58%] overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-[0_32px_90px_rgba(37,99,235,0.16)] lg:block xl:right-8"
    aria-hidden="true"
  >
    <ShaderRibbonDemo decorative />

    <div
      class="absolute left-[12%] top-[18%] w-[68%] overflow-hidden rounded-2xl border border-white/70 bg-white/80 shadow-2xl backdrop-blur-xl"
    >
      <div class="flex h-10 items-center gap-2 border-b border-slate-200/80 px-4">
        <span class="h-2 w-2 rounded-full bg-blue-200"></span>
        <span class="h-2 w-2 rounded-full bg-blue-400"></span>
        <span class="h-2 w-2 rounded-full bg-blue-600"></span>
        <span class="ml-2 text-[10px] font-semibold tracking-wide text-slate-400">
          AI-NATIVE / RUNTIME
        </span>
      </div>

      <div class="grid grid-cols-[7rem_1fr]">
        <div class="border-r border-slate-200/70 bg-slate-50/80 p-4">
          <span class="text-[9px] font-bold uppercase tracking-[0.14em] text-blue-600">
            Pipeline
          </span>
          <div class="mt-4 space-y-3">
            <div class="h-1.5 w-full rounded-full bg-blue-500"></div>
            <div class="h-1.5 w-4/5 rounded-full bg-slate-200"></div>
            <div class="h-1.5 w-3/5 rounded-full bg-slate-200"></div>
            <div class="h-1.5 w-2/3 rounded-full bg-slate-200"></div>
          </div>
        </div>

        <div class="p-5">
          <p class="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Requirement → Product
          </p>
          <div class="mt-4 grid grid-cols-3 gap-2">
            <div class="rounded-xl border border-blue-100 bg-blue-50/80 p-3">
              <span class="text-[9px] font-semibold text-blue-600">01 Inspect</span>
              <strong class="mt-2 block text-xs text-slate-900">Facts</strong>
            </div>
            <div class="rounded-xl border border-blue-100 bg-white/90 p-3">
              <span class="text-[9px] font-semibold text-blue-600">02 Build</span>
              <strong class="mt-2 block text-xs text-slate-900">Interface</strong>
            </div>
            <div class="rounded-xl border border-emerald-100 bg-emerald-50/80 p-3">
              <span class="text-[9px] font-semibold text-emerald-600">03 Verify</span>
              <strong class="mt-2 block text-xs text-slate-900">Evidence ✓</strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="absolute bottom-[10%] right-[8%] rounded-xl border border-blue-100 bg-white/90 px-4 py-3 shadow-xl backdrop-blur"
    >
      <span class="block text-[9px] font-bold uppercase tracking-[0.14em] text-blue-600">
        Live system
      </span>
      <strong class="mt-1 block text-sm text-slate-950">Vue · TypeScript · WebGL</strong>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useStripeScrollAnimation } from '@/composables/useStripeScrollAnimation'
import ShaderRibbonDemo from '@/views/Lab/demos/ShaderRibbonDemo.vue'

const visualRef = ref<HTMLElement | null>(null)
const { entrance, parallax } = useStripeScrollAnimation()

onMounted(() => {
  entrance(visualRef.value, { duration: 0.9, yOffset: 24, start: 'top 95%' })
  parallax(visualRef.value, { speed: 0.18, start: 'top top', end: 'bottom top' })
})
</script>
