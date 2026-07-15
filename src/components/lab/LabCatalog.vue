<template>
  <section
    class="mx-auto max-w-7xl px-6 pb-12 pt-[calc(var(--us-header-height)+3rem)] lg:px-8"
    aria-labelledby="lab-title"
  >
    <header class="mb-8 max-w-3xl">
      <p class="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
        Interaction Lab
      </p>
      <h1 id="lab-title" class="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
        交互实验室
      </h1>
      <p class="mt-4 leading-7 text-slate-600">
        面向招聘经理与 Vue 开发者：通过实时调参、可运行源码和真实页面应用，展示交互设计、性能与工程质量。
      </p>
      <ul class="mt-4 flex flex-wrap gap-2 text-sm font-medium text-slate-700" aria-label="能力证据">
        <li class="rounded-full bg-blue-50 px-3 py-1.5">实时参数联动</li>
        <li class="rounded-full bg-blue-50 px-3 py-1.5">完整 Vue SFC</li>
        <li class="rounded-full bg-blue-50 px-3 py-1.5">场景与性能边界</li>
      </ul>
    </header>
    <div class="mb-8 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <label class="block max-w-xl">
        <span class="sr-only">搜索交互效果</span>
        <input
          v-model.trim="query"
          type="search"
          placeholder="搜索名称、说明或技术标签"
          class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
      </label>
      <div class="flex flex-wrap gap-2" aria-label="效果分类">
        <button
          v-for="category in categories"
          :key="category.value"
          type="button"
          :aria-pressed="selectedCategory === category.value"
          class="rounded-full border px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          :class="
            selectedCategory === category.value
              ? 'border-blue-600 bg-blue-600 text-white'
              : 'border-slate-300 bg-white text-slate-700 hover:border-blue-600 hover:text-blue-600'
          "
          @click="selectedCategory = category.value"
        >
          {{ category.label }}
        </button>
      </div>
      <label class="flex max-w-sm items-center gap-3 text-sm font-medium text-slate-700">
        <span class="shrink-0">技术标签</span>
        <select
          v-model="selectedTag"
          class="min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        >
          <option value="all">全部标签</option>
          <option v-for="tag in tags" :key="tag" :value="tag">{{ tag }}</option>
        </select>
      </label>
    </div>
    <p class="sr-only" aria-live="polite">找到 {{ filteredEffects.length }} 个效果</p>
    <div v-if="filteredEffects.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <LabEffectCard v-for="effect in filteredEffects" :key="effect.id" :effect="effect" />
    </div>
    <div v-else class="rounded-xl border border-dashed border-slate-300 py-16 text-center">
      <p class="font-medium text-slate-700">没有找到匹配的效果</p>
      <button
        type="button"
        class="mt-3 text-sm font-medium text-blue-600 hover:underline"
        @click="clearFilters"
      >
        清空搜索与筛选
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import LabEffectCard from '@/components/lab/LabEffectCard.vue'
import { labRegistry } from '@/config/labRegistry'
import { analyticsConsent, trackLabAnalytics } from '@/services/privacyAnalytics'
import type { LabCategory } from '@/types/lab'

interface CategoryOption {
  label: string
  value: LabCategory | 'all'
}

const categories: CategoryOption[] = [
  { label: '全部', value: 'all' },
  { label: '背景', value: 'background' },
  { label: '卡片', value: 'card' },
  { label: '按钮', value: 'button' },
  { label: '数据', value: 'data' },
  { label: '布局', value: 'layout' }
]
const query = ref('')
const selectedCategory = ref<LabCategory | 'all'>('all')
const selectedTag = ref('all')
const tags = [...new Set(labRegistry.flatMap((effect) => effect.tags))].sort((left, right) =>
  left.localeCompare(right, 'en', { sensitivity: 'base' })
)
const route = useRoute()
const trackedView = ref(false)
const analyticsSources = ['home_cta', 'nav', 'direct', 'internal_link'] as const
const analyticsSource = () => {
  const source = route.query.source
  return typeof source === 'string' && analyticsSources.some((item) => item === source)
    ? source
    : 'direct'
}
watch(
  analyticsConsent,
  (decision) => {
    if (decision !== 'granted' || trackedView.value) return
    trackLabAnalytics({ event: 'lab_view', source: analyticsSource() })
    trackedView.value = true
  },
  { immediate: true }
)
const filteredEffects = computed(() => {
  const term = query.value.toLocaleLowerCase('zh-CN')
  return labRegistry.filter((effect) => {
    const matchesCategory =
      selectedCategory.value === 'all' || effect.category === selectedCategory.value
    const matchesTag = selectedTag.value === 'all' || effect.tags.includes(selectedTag.value)
    const searchable = [
      effect.name,
      effect.description,
      ...effect.tags,
      ...effect.useCases,
      ...effect.stack,
      ...effect.implementationNotes
    ]
      .join(' ')
      .toLocaleLowerCase('zh-CN')
    return matchesCategory && matchesTag && searchable.includes(term)
  })
})
const clearFilters = () => {
  query.value = ''
  selectedCategory.value = 'all'
  selectedTag.value = 'all'
}
</script>
