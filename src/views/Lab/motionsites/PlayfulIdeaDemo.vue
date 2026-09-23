<template>
  <div class="relative h-full min-h-64 overflow-hidden bg-[#fef3c7]">
    <div class="absolute inset-0">
      <div class="absolute inset-0 bg-[#f9a8d4] p-5"><p class="text-[9px] font-black tracking-[.18em] text-fuchsia-950">PLAYFUL IDEA / BEFORE</p><p class="mt-8 text-[clamp(2.5rem,8vw,6.8rem)] font-black leading-[.78] tracking-[-.08em] text-fuchsia-950">LOUD<br>IDEA</p><div class="absolute bottom-5 left-5 h-16 w-28 rotate-[-7deg] rounded-2xl border-2 border-black bg-lime-300 shadow-[5px_5px_0_#111]"></div></div>
      <div class="absolute inset-y-0 right-0 overflow-hidden bg-[#d9f99d]" :style="{width:`${100-position}%`}">
        <div class="absolute right-0 top-0 h-full" :style="{width:containerWidth}">
          <div class="p-5 text-right"><p class="text-[9px] font-black tracking-[.18em] text-lime-950">AFTER / REFINED</p><p class="mt-8 text-[clamp(2.5rem,8vw,6.8rem)] font-black leading-[.78] tracking-[-.08em] text-lime-950">SMART<br>PLAY</p><div class="absolute bottom-5 right-5 h-20 w-20 rotate-6 rounded-full border-2 border-black bg-blue-400 shadow-[5px_5px_0_#111]"></div></div>
        </div>
      </div>
      <div class="pointer-events-none absolute inset-y-0 w-1 bg-black" :style="{left:`calc(${position}% - 2px)`}"><span class="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-black bg-white text-xs font-black">↔</span></div>
    </div>
    <input v-model.number="position" type="range" min="12" max="88" step="1" aria-label="拖拽比较设计版本" class="absolute inset-0 h-full w-full cursor-ew-resize opacity-0">
    <p class="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black px-3 py-1.5 text-[8px] font-bold tracking-[.12em] text-white">DRAG TO COMPARE</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { LabParams } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'

const props = defineProps<{ scene: MotionSceneRuntime; params: LabParams }>()
const resolvedPosition = () => typeof props.params.position === 'number' ? props.params.position : 52
const position = ref(resolvedPosition())
const containerWidth = computed(() => `${100 / (1 - position.value / 100)}%`)

watch(() => props.params.position, () => {
  position.value = resolvedPosition()
})
</script>
