<template>
  <article class="mx-auto max-w-[1680px] px-4 pb-16 pt-[calc(var(--us-header-height)+1.5rem)] sm:px-6 lg:px-8">
    <nav aria-label="面包屑" class="flex flex-wrap items-center gap-2 text-sm text-slate-500">
      <RouterLink to="/lab" class="inline-flex min-h-10 items-center hover:text-blue-600">交互实验室</RouterLink>
      <span aria-hidden="true">/</span>
      <RouterLink :to="`/lab/scenes/${scene.id}`" class="inline-flex min-h-10 items-center hover:text-blue-600">
        {{ scene.title }}
      </RouterLink>
      <span aria-hidden="true">/</span>
      <span aria-current="page" class="text-slate-800">{{ recipe.title }}</span>
    </nav>

    <header class="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div class="max-w-4xl">
        <p class="text-sm font-semibold text-blue-600">PROMPT PRESET · {{ recipe.category }}</p>
        <h1 class="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">{{ recipe.title }}</h1>
        <p class="mt-3 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">{{ recipe.summary }}</p>
      </div>
      <RouterLink
        :to="`/lab/scenes/${scene.id}`"
        class="inline-flex min-h-11 items-center self-start rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-600 lg:self-auto"
      >
        返回 {{ scene.title }} 主场景
      </RouterLink>
    </header>

    <section class="mt-5">
      <div class="mb-2 flex items-center justify-between gap-3">
        <div>
          <p class="text-[10px] font-semibold tracking-widest text-blue-600 sm:text-xs">LIVE EXPERIENCE</p>
          <h2 class="mt-0.5 text-base font-semibold text-slate-950 sm:text-lg">效果是主角</h2>
        </div>
        <button
          type="button"
          class="inline-flex min-h-10 items-center rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-600 sm:min-h-11 sm:px-4 sm:text-sm"
          @click="enterImmersive"
        >
          放大预览
        </button>
      </div>

      <div ref="stageRef" :class="stageClass" tabindex="-1" @keydown.esc="exitImmersive" @fullscreenchange="handleFullscreenChange">
        <MotionScenePreview :scene="scene" :params="params" />
        <div class="pointer-events-none absolute inset-x-4 bottom-4 z-10 flex items-end justify-between gap-3">
          <span class="rounded-full border border-white/20 bg-slate-950/55 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur sm:text-xs">
            {{ presentation.interactionHint }}
          </span>
          <span class="hidden rounded-full border border-white/20 bg-slate-950/55 px-3 py-1.5 text-[10px] font-semibold text-white backdrop-blur sm:inline">
            {{ presentation.styleGroup }} · {{ scene.renderer.toUpperCase() }}
          </span>
        </div>
        <button
          v-if="isImmersive"
          type="button"
          class="absolute right-4 top-4 z-20 inline-flex min-h-11 items-center rounded-xl border border-white/30 bg-slate-950/70 px-4 text-sm font-semibold text-white backdrop-blur"
          @click="exitImmersive"
        >
          退出沉浸
        </button>
      </div>
    </section>

    <section class="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:p-4" aria-label="效果配件">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="item in accessoryItems"
          :key="item.id"
          type="button"
          class="min-h-10 rounded-xl border px-3 text-sm font-semibold transition"
          :class="activeAccessory === item.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-blue-600 hover:text-blue-600'"
          :aria-pressed="activeAccessory === item.id"
          @click="toggleAccessory(item.id)"
        >
          {{ item.label }}
        </button>
        <span class="ml-auto hidden items-center text-xs text-slate-500 lg:flex">
          Prompt / 参数 / 设计目标 / 源码均为配件，默认收起
        </span>
      </div>

      <div v-if="activeAccessory" class="mt-4 border-t border-slate-200 pt-4">
        <LabParamPanel
          v-if="activeAccessory === 'params'"
          :params="scene.params"
          :model-value="params"
          :has-changes="hasChanges"
          @update="updateParam"
          @reset="resetParams"
        />
        <PromptRecipePromptPanel v-else-if="activeAccessory === 'prompt'" :prompt="promptText" />
        <div v-else-if="activeAccessory === 'design'" class="grid gap-4 md:grid-cols-2">
          <div class="rounded-2xl bg-white p-5">
            <p class="text-xs font-semibold tracking-widest text-blue-600">视觉方向</p>
            <p class="mt-3 text-sm leading-7 text-slate-600">{{ recipe.visualDirection }}</p>
          </div>
          <div class="rounded-2xl bg-white p-5">
            <p class="text-xs font-semibold tracking-widest text-blue-600">动态方向</p>
            <p class="mt-3 text-sm leading-7 text-slate-600">{{ recipe.motionDirection }}</p>
          </div>
        </div>
        <LabCodePanel
          v-else
          :key="scene.id"
          :effect-id="recipe.effectId"
          :usage="usage"
          :source-loader="scene.loadSource"
          @interaction="handleInteraction"
        />
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

import LabCodePanel from '@/components/lab/LabCodePanel.vue'
import LabParamPanel from '@/components/lab/LabParamPanel.vue'
import MotionScenePreview from '@/components/lab/MotionScenePreview.vue'
import PromptRecipePromptPanel from '@/components/lab/PromptRecipePromptPanel.vue'
import { getScenePresentation } from '@/config/motionSceneExperience'
import { buildPromptRecipeSceneText, createPromptRecipeSceneParams } from '@/config/promptRecipeRegistry'
import { trackLabAnalytics } from '@/services/privacyAnalytics'
import type { LabParams, LabValue } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'
import type { PromptRecipe } from '@/types/promptRecipe'

type AccessoryId = 'params' | 'prompt' | 'design' | 'source'
const accessoryItems: { id: AccessoryId; label: string }[] = [
  { id: 'params', label: '参数' },
  { id: 'prompt', label: 'Prompt' },
  { id: 'design', label: '设计目标' },
  { id: 'source', label: '源码 / 使用方式' }
]

const props = defineProps<{ recipe: PromptRecipe; scene: MotionSceneRuntime }>()
const params = ref<LabParams>({})
const activeAccessory = ref<AccessoryId | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const isImmersive = ref(false)
let previousBodyOverflow = ''

const resetParams = () => { params.value = createPromptRecipeSceneParams(props.recipe, props.scene) }
watch([() => props.recipe.id, () => props.scene.id], resetParams, { immediate: true })
const defaults = computed(() => createPromptRecipeSceneParams(props.recipe, props.scene))
const hasChanges = computed(() => props.scene.params.some((param) => params.value[param.key] !== defaults.value[param.key]))
const updateParam = (key: string, value: LabValue) => { params.value = { ...params.value, [key]: value } }
const promptText = computed(() => buildPromptRecipeSceneText(props.recipe, props.scene, params.value))
const usage = computed(() => props.scene.createUsage(params.value))
const presentation = computed(() => getScenePresentation(props.scene.id))
const stageClass = computed(() => isImmersive.value
  ? 'fixed inset-0 z-[100] h-[100dvh] w-[100dvw] overflow-hidden bg-slate-950'
  : 'relative h-[clamp(22rem,52vh,30rem)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:h-[clamp(32rem,68vh,44rem)] xl:h-[clamp(37.5rem,68vh,46rem)]'
)
const toggleAccessory = (id: AccessoryId) => { activeAccessory.value = activeAccessory.value === id ? null : id }

const enterImmersive = async () => {
  const stage = stageRef.value
  previousBodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  isImmersive.value = true
  stage?.focus({ preventScroll: true })
  if (!stage || !document.fullscreenEnabled || document.fullscreenElement) return
  try { await stage.requestFullscreen() } catch { /* fixed viewport remains available */ }
}
const restorePageScroll = () => { document.body.style.overflow = previousBodyOverflow }
const exitImmersive = async () => {
  if (document.fullscreenElement) {
    try { await document.exitFullscreen() } catch { /* local state still exits */ }
  }
  isImmersive.value = false
  restorePageScroll()
}
const handleFullscreenChange = () => {
  if (document.fullscreenElement) return
  isImmersive.value = false
  restorePageScroll()
}
const handleInteraction = (name: 'code_expand' | 'code_copy', target?: 'usage' | 'source') => {
  trackLabAnalytics({ event: name, effectId: props.recipe.effectId, copyTarget: name === 'code_copy' ? (target === 'source' ? 'full_source' : 'usage') : undefined })
}
onUnmounted(restorePageScroll)
</script>
