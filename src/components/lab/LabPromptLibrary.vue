<template>
  <section class="mt-24 border-t border-slate-200 pt-16" aria-labelledby="prompt-library-title">
    <div class="max-w-3xl">
      <p class="text-sm font-semibold uppercase tracking-widest text-blue-600">Prompt Library</p>
      <h2
        id="prompt-library-title"
        class="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
      >
        Motion Design Prompt Recipes
      </h2>
      <p class="mt-4 leading-7 text-slate-600">
        {{ promptData.length }} 条可直接复制的网页动效 Prompt Recipe。它们提炼自 MotionSites
        公开案例的设计方法与分类，但全部按本项目技术栈重新编写，不保存付费 Prompt 原文。
      </p>
    </div>

    <div class="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
      <label class="block">
        <span class="sr-only">搜索 Prompt Recipe</span>
        <input
          v-model.trim="query"
          type="search"
          placeholder="搜索 Hero、Shader、Scroll、Dashboard 或效果名称"
          class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
      </label>

      <div class="mt-4 flex flex-wrap gap-2" aria-label="Prompt 分类">
        <button
          v-for="category in categories"
          :key="category"
          type="button"
          class="rounded-full border px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          :class="
            selectedCategory === category
              ? 'border-blue-600 bg-blue-600 text-white'
              : 'border-slate-300 bg-white text-slate-700 hover:border-blue-600 hover:text-blue-600'
          "
          :aria-pressed="selectedCategory === category"
          @click="selectCategory(category)"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <div class="mt-8 flex items-center justify-between gap-4 text-sm text-slate-500">
      <p>匹配 {{ filteredPrompts.length }} 条 · 当前显示 {{ visiblePrompts.length }} 条</p>
      <button
        v-if="query || selectedCategory !== allCategory"
        type="button"
        class="font-medium text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        @click="clearFilters"
      >
        清空筛选
      </button>
    </div>

    <div class="mt-5 grid gap-5 lg:grid-cols-2">
      <article
        v-for="prompt in visiblePrompts"
        :key="prompt.id"
        class="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-blue-600">
              {{ prompt.category }}
            </p>
            <h3 class="mt-2 text-lg font-semibold tracking-tight text-slate-950">
              {{ prompt.title }}
            </h3>
          </div>
          <span class="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
            {{ prompt.id.replace('ms-recipe-', '#') }}
          </span>
        </div>

        <p class="mt-3 text-sm leading-6 text-slate-600">{{ prompt.summary }}</p>

        <div class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="tag in prompt.tags"
            :key="tag"
            class="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
          >
            {{ tag }}
          </span>
        </div>

        <details class="mt-5 rounded-xl border border-slate-200 bg-slate-50">
          <summary
            class="cursor-pointer select-none px-4 py-3 text-sm font-semibold text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            查看完整 Prompt
          </summary>
          <div class="border-t border-slate-200 p-4">
            <pre class="whitespace-pre-wrap text-xs leading-6 text-slate-700">{{ prompt.prompt }}</pre>
          </div>
        </details>

        <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
          <a
            :href="prompt.sourceUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs text-slate-500 hover:text-blue-600"
          >
            灵感索引：{{ prompt.sourcePattern }} ↗
          </a>
          <button
            type="button"
            class="rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            @click="copyPrompt(prompt.id, prompt.prompt)"
          >
            {{ copiedId === prompt.id ? '已复制 ✓' : '复制 Prompt' }}
          </button>
        </div>
      </article>
    </div>

    <div v-if="hasMore" class="mt-8 text-center">
      <button
        type="button"
        class="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        @click="visibleCount += pageSize"
      >
        再显示 {{ Math.min(pageSize, filteredPrompts.length - visibleCount) }} 条
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import promptData from '@/assets/data/lab-prompts.json'

const allCategory = '全部'
const pageSize = 16
const query = ref('')
const selectedCategory = ref(allCategory)
const visibleCount = ref(pageSize)
const copiedId = ref('')
const categories = [
  allCategory,
  ...new Set(promptData.map((prompt) => prompt.category))
]

const filteredPrompts = computed(() => {
  const term = query.value.toLocaleLowerCase('zh-CN')
  return promptData.filter((prompt) => {
    const matchesCategory =
      selectedCategory.value === allCategory || prompt.category === selectedCategory.value
    const searchable = [
      prompt.title,
      prompt.summary,
      prompt.category,
      prompt.sourcePattern,
      ...prompt.tags
    ]
      .join(' ')
      .toLocaleLowerCase('zh-CN')
    return matchesCategory && searchable.includes(term)
  })
})
const visiblePrompts = computed(() => filteredPrompts.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < filteredPrompts.value.length)

watch([query, selectedCategory], () => {
  visibleCount.value = pageSize
})

const selectCategory = (category: string) => {
  selectedCategory.value = category
}
const clearFilters = () => {
  query.value = ''
  selectedCategory.value = allCategory
}
const copyPrompt = async (id: string, prompt: string) => {
  if (!navigator.clipboard) return
  await navigator.clipboard.writeText(prompt)
  copiedId.value = id
  window.setTimeout(() => {
    if (copiedId.value === id) copiedId.value = ''
  }, 1800)
}
</script>
