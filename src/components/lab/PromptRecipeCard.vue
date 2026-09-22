<template>
  <article
    class="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"
  >
    <LabLivePreview v-if="effect" :effect="effect" :params="previewParams" />

    <div class="p-5">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-xs font-semibold tracking-wider text-blue-600">{{ recipe.category }}</p>
          <h3 class="mt-2 text-lg font-semibold tracking-tight text-slate-950">
            {{ recipe.title }}
          </h3>
        </div>
        <span class="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
          {{ recipe.id.replace('ms-recipe-', '#') }}
        </span>
      </div>

      <p class="mt-3 text-sm leading-6 text-slate-600">{{ recipe.summary }}</p>

      <div class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="tag in recipe.tags"
          :key="tag"
          class="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
        >
          {{ tag }}
        </span>
      </div>

      <div class="mt-5 flex items-center justify-between gap-3">
        <span class="text-xs text-slate-500">
          预览引擎：{{ effect?.name ?? '不可用' }}
        </span>
        <RouterLink
          :to="`/lab/prompts/${recipe.id}`"
          class="rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          打开效果工作台 →
        </RouterLink>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import LabLivePreview from '@/components/lab/LabLivePreview.vue'
import {
  createPromptRecipeParams,
  resolvePromptRecipeEffect
} from '@/config/promptRecipeRegistry'
import type { PromptRecipe } from '@/types/promptRecipe'

interface Props {
  recipe: PromptRecipe
}

const props = defineProps<Props>()
const effect = computed(() => resolvePromptRecipeEffect(props.recipe))
const previewParams = computed(() => {
  const current = effect.value
  return current ? createPromptRecipeParams(props.recipe, current) : {}
})
</script>
