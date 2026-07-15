<template>
  <RouterLink
    :to="`/lab/${effect.id}`"
    class="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-blue-600 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
  >
    <SafeImage
      :src="effect.preview.src"
      :alt="effect.preview.alt"
      class="h-40 w-full bg-slate-100"
      image-class="h-40 w-full object-cover"
      width="100%"
      :height="160"
      :intrinsic-width="640"
      :intrinsic-height="360"
      :native-loading="effect.id === 'aurora' ? 'eager' : 'lazy'"
      :fetch-priority="effect.id === 'aurora' ? 'high' : 'auto'"
    />
    <div class="space-y-3 p-5">
      <div class="flex items-start justify-between gap-3">
        <h2 class="font-semibold text-slate-900 group-hover:text-blue-600">{{ effect.name }}</h2>
        <span class="rounded bg-blue-50 px-2 py-1 text-xs text-blue-700">
          {{ categoryLabels[effect.category] }}
        </span>
      </div>
      <p class="text-sm leading-6 text-slate-600">{{ effect.description }}</p>
      <ul class="flex flex-wrap gap-2" aria-label="技术标签">
        <li
          v-for="tag in effect.tags.slice(0, 3)"
          :key="tag"
          class="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600"
        >
          {{ tag }}
        </li>
      </ul>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import SafeImage from '@/components/common/SafeImage.vue'
import type { LabCategory, LabEffect } from '@/types/lab'

interface Props {
  effect: LabEffect
}

defineProps<Props>()

const categoryLabels: Record<LabCategory, string> = {
  background: '背景',
  card: '卡片',
  button: '按钮',
  data: '数据',
  layout: '布局'
}
</script>
