<template>
  <article class="group relative min-h-[20rem] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-2xl">
    <MotionScenePreview :scene="scene" class="absolute inset-0" />

    <div class="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent px-5 pb-5 pt-24">
      <div class="flex items-end justify-between gap-4">
        <div class="max-w-md">
          <p class="text-[10px] font-bold tracking-[0.18em] text-blue-600">{{ scene.eyebrow }}</p>
          <h3 class="mt-2 text-xl font-semibold tracking-tight text-slate-950">{{ scene.title }}</h3>
          <p class="mt-2 text-sm leading-6 text-slate-600">{{ scene.subtitle }}</p>
        </div>
        <span class="rounded-full border border-slate-200 bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {{ scene.renderer }}
        </span>
      </div>
    </div>

    <RouterLink
      v-if="primaryRecipeId"
      :to="`/lab/prompts/${primaryRecipeId}`"
      class="absolute inset-0 rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
      :aria-label="`打开 ${scene.title} 场景工作台`"
    >
      <span class="sr-only">打开场景工作台</span>
    </RouterLink>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import MotionScenePreview from '@/components/lab/MotionScenePreview.vue'
import type { MotionSceneRuntime } from '@/types/motionScene'

interface Props {
  scene: MotionSceneRuntime
}

const props = defineProps<Props>()
const primaryRecipeId = computed(() => props.scene.recipeIds[0])
</script>
