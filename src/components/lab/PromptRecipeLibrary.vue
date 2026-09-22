<template>
  <section id="prompt-library" class="mt-24 border-t border-slate-200 pt-16" aria-labelledby="prompt-library-title">
    <div class="max-w-3xl">
      <p class="text-sm font-semibold tracking-widest text-blue-600">提示词库</p>
      <h2 id="prompt-library-title" class="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
        动效设计提示词配方
      </h2>
      <p class="mt-4 leading-7 text-slate-600">
        {{ promptRecipeRegistry.length }} 条中文动效配方。每条都有可运行预览，并可进入工作台调参数、同步生成 Prompt、查看真实实现源码。
      </p>
    </div>

    <div class="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
      <input
        v-model.trim="query"
        type="search"
        aria-label="搜索动效配方"
        placeholder="搜索首屏、Shader、滚动叙事、数据面板或效果名称"
        class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
      <div class="mt-4 flex flex-wrap gap-2" aria-label="Prompt 分类">
        <button
          v-for="category in promptRecipeCategories"
          :key="category"
          type="button"
          class="rounded-full border px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          :class="selectedCategory === category ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-blue-600 hover:text-blue-600'"
          :aria-pressed="selectedCategory === category"
          @click="selectedCategory = category"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <p class="mt-8 text-sm text-slate-500">
      匹配 {{ filteredRecipes.length }} 条 · 当前显示 {{ visibleRecipes.length }} 条
    </p>

    <div class="mt-5 grid gap-5 lg:grid-cols-2">
      <PromptRecipeCard
        v-for="recipe in visibleRecipes"
        :key="recipe.id"
        :recipe="recipe"
      />
    </div>

    <div v-if="hasMore" class="mt-8 text-center">
      <button
        type="button"
        class="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-600 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        @click="visibleCount += pageSize"
      >
        再显示 {{ Math.min(pageSize, filteredRecipes.length - visibleCount) }} 条
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import PromptRecipeCard from '@/components/lab/PromptRecipeCard.vue'
import {
  promptRecipeCategories,
  promptRecipeRegistry
} from '@/config/promptRecipeRegistry'

const allCategory = '全部'
const pageSize = 12
const query = ref('')
const selectedCategory = ref(allCategory)
const visibleCount = ref(pageSize)

const filteredRecipes = computed(() => {
  const term = query.value.toLocaleLowerCase('zh-CN')
  return promptRecipeRegistry.filter((recipe) => {
    const matchesCategory =
      selectedCategory.value === allCategory || recipe.category === selectedCategory.value
    const searchable = [recipe.title, recipe.summary, recipe.category, ...recipe.tags]
      .join(' ')
      .toLocaleLowerCase('zh-CN')
    return matchesCategory && searchable.includes(term)
  })
})
const visibleRecipes = computed(() => filteredRecipes.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < filteredRecipes.value.length)

watch([query, selectedCategory], () => {
  visibleCount.value = pageSize
})
</script>
