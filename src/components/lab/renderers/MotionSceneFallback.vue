<template>
  <div
    class="relative h-full min-h-64 overflow-hidden bg-slate-100 bg-cover bg-center"
    :style="{ backgroundImage: `url(\'/images/lab/motionsites/${scene.id}.webp\')` }"
  >
    <SafeImage
      :src="`/images/lab/motionsites/${scene.id}.webp`"
      :alt="`${scene.title} 静态预览`"
      width="100%"
      height="100%"
      object-fit="cover"
      native-loading="eager"
      fetch-priority="low"
      image-class="h-full w-full object-cover"
      class="absolute inset-0 h-full w-full"
    />

    <div class="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 pt-14">
      <div>
        <p class="text-[9px] font-bold uppercase tracking-[0.16em] text-white/70">
          MotionSites · {{ scene.referenceName }}
        </p>
        <p class="mt-1 text-sm font-semibold text-white">{{ scene.title }}</p>
      </div>
      <span class="rounded-full border border-white/25 bg-black/30 px-2.5 py-1 text-[9px] font-bold text-white/80 backdrop-blur">
        STATIC
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import SafeImage from '@/components/common/SafeImage.vue'
import type { MotionSceneRuntime } from '@/types/motionScene'

defineProps<{ scene: MotionSceneRuntime }>()
</script>
