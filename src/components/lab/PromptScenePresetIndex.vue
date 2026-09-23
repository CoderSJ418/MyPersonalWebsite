<template>
  <section id="prompt-library" class="mt-24 border-t border-slate-200 pt-16" aria-labelledby="preset-index-title">
    <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div class="max-w-3xl">
        <p class="text-sm font-semibold tracking-widest text-blue-600">PROMPT PRESETS · ACCESSORY</p>
        <h2 id="preset-index-title" class="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          先看效果，再选配方。
        </h2>
        <p class="mt-4 leading-7 text-slate-600">
          64 条 Prompt 不再伪装成 64 个不同作品。这里按 {{ groups.length }} 个真实 Scene 聚合，
          每个视觉入口先展示完整场景，Prompt 只作为该场景的可选创作预设。
        </p>
      </div>
      <p class="max-w-sm text-sm leading-6 text-slate-500">
        点击任意卡片先进入效果工作台；相关 Prompt、参数、设计目标和源码都在场景内部按需查看。
      </p>
    </div>

    <div class="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
      <input
        v-model.trim="query"
        type="search"
        aria-label="搜索场景配方"
        placeholder="搜索场景、风格、交互方式或 Prompt 名称"
        class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
    </div>

    <div class="mt-7 grid gap-5 lg:grid-cols-2">
      <RouterLink
        v-for="group in filteredGroups"
        :key="group.scene.id"
        :to="`/lab/scenes/${group.scene.id}`"
        class="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
      >
        <div class="relative h-72 overflow-hidden bg-slate-950 sm:h-80">
          <MotionSceneFallback :scene="group.scene" class="absolute inset-0" />
          <div class="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
            <span class="rounded-full border border-white/25 bg-black/35 px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-white backdrop-blur">
              {{ group.presentation.styleGroup }}
            </span>
            <span class="rounded-full border border-white/25 bg-black/35 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur">
              {{ group.scene.renderer }}
            </span>
          </div>
          <div class="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between gap-3">
            <span class="rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur">
              {{ group.presentation.interactionHint }}
            </span>
            <span class="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-slate-900 shadow">
              {{ group.recipes.length }} 个 Prompt
            </span>
          </div>
        </div>

        <div class="p-5">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-[10px] font-bold tracking-[0.16em] text-blue-600">MotionSites · {{ group.scene.referenceName }}</p>
              <h3 class="mt-2 text-xl font-semibold tracking-tight text-slate-950">{{ group.scene.title }}</h3>
            </div>
            <span class="text-sm font-semibold text-blue-600 transition group-hover:translate-x-1">进入体验 →</span>
          </div>
          <p class="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{{ group.scene.subtitle }}</p>
          <div class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="recipe in group.recipes.slice(0, 3)"
              :key="recipe.id"
              class="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
            >
              {{ recipe.title }}
            </span>
            <span v-if="group.recipes.length > 3" class="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              +{{ group.recipes.length - 3 }}
            </span>
          </div>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

import MotionSceneFallback from '@/components/lab/renderers/MotionSceneFallback.vue'
import { getScenePresentation } from '@/config/motionSceneExperience'
import { motionSceneRegistry } from '@/config/motionSceneRegistry'
import { promptRecipeRegistry } from '@/config/promptRecipeRegistry'

const query = ref('')
const groups = motionSceneRegistry.map((scene) => ({
  scene,
  presentation: getScenePresentation(scene.id),
  recipes: promptRecipeRegistry.filter((recipe) => scene.recipeIds.includes(recipe.id))
}))

const filteredGroups = computed(() => {
  const term = query.value.toLocaleLowerCase('zh-CN')
  return groups.filter((group) => {
    const searchable = [
      group.scene.title,
      group.scene.subtitle,
      group.scene.referenceCategory,
      group.presentation.styleGroup,
      group.presentation.interactionHint,
      ...group.recipes.flatMap((recipe) => [recipe.title, recipe.category, ...recipe.tags])
    ].join(' ').toLocaleLowerCase('zh-CN')
    return searchable.includes(term)
  })
})
</script>
