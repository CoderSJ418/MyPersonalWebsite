<template>
  <section id="prompt-library" class="mt-24 border-t border-slate-200 pt-16" aria-labelledby="recipe-index-title">
    <div class="max-w-3xl">
      <p class="text-sm font-semibold tracking-widest text-blue-600">64 条中文配方</p>
      <h2 id="recipe-index-title" class="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
        提示词配方索引
      </h2>
      <p class="mt-4 leading-7 text-slate-600">
        不再把 64 条配方铺成重复预览墙。这里作为可搜索索引保留全部内容；每条仍可进入对应 Renderer Studio。
      </p>
    </div>

    <div class="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
      <input
        v-model.trim="query"
        type="search"
        aria-label="搜索动效配方"
        placeholder="搜索首屏、3D、Shader、滚动叙事或数据面板"
        class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
      <div class="mt-4 flex flex-wrap gap-2">
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

    <div class="mt-7 grid gap-3 md:grid-cols-2">
      <RouterLink
        v-for="recipe in visibleRecipes"
        :key="recipe.id"
        :to="`/lab/prompts/${recipe.id}`"
        class="group flex min-h-24 items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
      >
        <div>
          <p class="text-[10px] font-bold tracking-widest text-blue-600">{{ recipe.category }}</p>
          <h3 class="mt-1 font-semibold text-slate-950">{{ recipe.title }}</h3>
          <p class="mt-1 line-clamp-1 text-xs text-slate-500">{{ sceneTitle(recipe.id) }}</p>
        </div>
        <span class="shrink-0 text-sm font-semibold text-blue-600 group-hover:translate-x-0.5">→</span>
      </RouterLink>
    </div>

    <div v-if="hasMore" class="mt-8 text-center">
      <button type="button" class="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600" @click="visibleCount += pageSize">
        再显示 {{ Math.min(pageSize, filteredRecipes.length - visibleCount) }} 条
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

import { findSceneForRecipe } from '@/config/motionSceneRegistry'
import { promptRecipeCategories, promptRecipeRegistry } from '@/config/promptRecipeRegistry'

const allCategory = '全部'
const pageSize = 16
const query = ref('')
const selectedCategory = ref(allCategory)
const visibleCount = ref(pageSize)

const filteredRecipes = computed(() => {
  const term = query.value.toLocaleLowerCase('zh-CN')
  return promptRecipeRegistry.filter((recipe) => {
    const categoryMatch = selectedCategory.value === allCategory || recipe.category === selectedCategory.value
    const searchable = [recipe.title, recipe.summary, recipe.category, ...recipe.tags].join(' ').toLocaleLowerCase('zh-CN')
    return categoryMatch && searchable.includes(term)
  })
})
const visibleRecipes = computed(() => filteredRecipes.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < filteredRecipes.value.length)
const sceneTitle = (recipeId: string) => findSceneForRecipe(recipeId)?.title ?? 'Motion Scene'

watch([query, selectedCategory], () => {
  visibleCount.value = pageSize
})
</script>
