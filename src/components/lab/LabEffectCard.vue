<template>
  <article

    class="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-blue-600 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
  >
    <LabLivePreview :effect="effect" />
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
      <RouterLink
        :to="`/lab/${effect.id}`"
        class="inline-flex items-center text-sm font-semibold text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
      >
        打开实验 →
      </RouterLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import LabLivePreview from '@/components/lab/LabLivePreview.vue'
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
