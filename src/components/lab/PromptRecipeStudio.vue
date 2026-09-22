<template>
  <article class="mx-auto max-w-7xl px-6 pb-12 pt-[calc(var(--us-header-height)+2.5rem)] lg:px-8">
    <nav aria-label="面包屑" class="flex flex-wrap items-center gap-2 text-sm text-slate-500">
      <RouterLink
        to="/lab"
        class="inline-flex min-h-11 items-center hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
      >
        交互实验室
      </RouterLink>
      <span aria-hidden="true">/</span>
      <RouterLink
        to="/lab#prompt-library"
        class="inline-flex min-h-11 items-center hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
      >
        动效设计提示词配方
      </RouterLink>
      <span aria-hidden="true">/</span>
      <span aria-current="page" class="text-slate-800">{{ recipe.title }}</span>
    </nav>

    <header class="mt-5 max-w-4xl">
      <p class="text-sm font-semibold text-blue-600">{{ recipe.category }}</p>
      <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
        {{ recipe.title }}
      </h1>
      <p class="mt-4 text-lg leading-8 text-slate-600">{{ recipe.summary }}</p>
      <div class="mt-4 flex flex-wrap gap-2">
        <span
          v-for="tag in recipe.tags"
          :key="tag"
          class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
        >
          {{ tag }}
        </span>
      </div>
    </header>

    <section class="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
      <div>
        <div class="mb-3 flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-semibold tracking-widest text-blue-600">实时预览</p>
            <h2 class="mt-1 text-lg font-semibold text-slate-950">实时效果预览</h2>
          </div>
          <span class="text-xs text-slate-500">引擎：{{ effect.name }}</span>
        </div>
        <LabDemoStage
          :effect-id="effect.id"
          :component="effect.component"
          :params="params"
        />
      </div>

      <div>
        <div class="mb-3">
          <p class="text-xs font-semibold tracking-widest text-blue-600">参数调节</p>
          <h2 class="mt-1 text-lg font-semibold text-slate-950">调整效果参数</h2>
        </div>
        <LabParamPanel
          :params="effect.params"
          :model-value="params"
          :has-changes="hasChanges"
          @update="updateParam"
          @reset="resetParams"
        />
      </div>
    </section>

    <section class="mt-6 grid gap-6 xl:grid-cols-2">
      <PromptRecipePromptPanel :prompt="promptText" />
      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p class="text-xs font-semibold tracking-widest text-blue-600">设计目标</p>
        <h2 class="mt-1 text-lg font-semibold text-slate-950">视觉与动态目标</h2>
        <dl class="mt-4 space-y-4 text-sm leading-6 text-slate-600">
          <div>
            <dt class="font-semibold text-slate-900">视觉方向</dt>
            <dd class="mt-1">{{ recipe.visualDirection }}</dd>
          </div>
          <div>
            <dt class="font-semibold text-slate-900">动态方向</dt>
            <dd class="mt-1">{{ recipe.motionDirection }}</dd>
          </div>
          <div>
            <dt class="font-semibold text-slate-900">灵感索引</dt>
            <dd class="mt-1">
              <a
                :href="recipe.sourceUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:underline"
              >
                MotionSites · {{ recipe.sourcePattern }} ↗
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>

    <div class="mt-6">
      <LabCodePanel
        :key="effect.id"
        :effect-id="effect.id"
        :usage="usage"
        :source-loader="effect.loadSource"
        @interaction="handleInteraction"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

import LabCodePanel from '@/components/lab/LabCodePanel.vue'
import LabDemoStage from '@/components/lab/LabDemoStage.vue'
import LabParamPanel from '@/components/lab/LabParamPanel.vue'
import PromptRecipePromptPanel from '@/components/lab/PromptRecipePromptPanel.vue'
import {
  buildPromptRecipeText,
  createPromptRecipeParams
} from '@/config/promptRecipeRegistry'
import { trackLabAnalytics } from '@/services/privacyAnalytics'
import type { LabEffect, LabParams, LabValue } from '@/types/lab'
import type { PromptRecipe } from '@/types/promptRecipe'

interface Props {
  recipe: PromptRecipe
  effect: LabEffect
}

const props = defineProps<Props>()
const params = ref<LabParams>({})

const resetParams = () => {
  params.value = createPromptRecipeParams(props.recipe, props.effect)
}

watch([() => props.recipe.id, () => props.effect.id], resetParams, { immediate: true })

const updateParam = (key: string, value: LabValue) => {
  params.value = { ...params.value, [key]: value }
}
const defaults = computed(() => createPromptRecipeParams(props.recipe, props.effect))
const hasChanges = computed(() =>
  props.effect.params.some((param) => params.value[param.key] !== defaults.value[param.key])
)
const promptText = computed(() => buildPromptRecipeText(props.recipe, props.effect, params.value))
const usage = computed(() => props.effect.createUsage(params.value))

const handleInteraction = (name: 'code_expand' | 'code_copy', target?: 'usage' | 'source') => {
  if (name === 'code_expand') {
    trackLabAnalytics({ event: name, effectId: props.effect.id })
    return
  }
  trackLabAnalytics({
    event: name,
    effectId: props.effect.id,
    copyTarget: target === 'source' ? 'full_source' : 'usage'
  })
}
</script>
