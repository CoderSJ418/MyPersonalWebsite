<template>
  <article class="mx-auto max-w-[1680px] px-4 pb-16 pt-[calc(var(--us-header-height)+1.5rem)] sm:px-6 lg:px-8">
    <nav aria-label="面包屑" class="flex flex-wrap items-center gap-2 text-sm text-slate-500">
      <RouterLink to="/lab" class="inline-flex min-h-11 items-center hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">交互实验室</RouterLink>
      <span aria-hidden="true">/</span>
      <span class="hidden sm:inline">MotionSites 效果复刻 /</span>
      <span aria-current="page" class="text-slate-800">{{ scene.title }}</span>
    </nav>

    <header class="mt-3 max-w-5xl">
      <p class="text-sm font-semibold text-blue-600">
        {{ scene.referenceCategory }} · {{ scene.renderer.toUpperCase() }}
      </p>
      <h1 class="mt-2 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
        {{ scene.title }}
      </h1>
      <p class="mt-3 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
        {{ scene.subtitle }}
      </p>
    </header>

    <section class="mt-4 grid gap-5 sm:mt-6 xl:grid-cols-[minmax(0,1fr)_18rem] 2xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div class="min-w-0">
        <div class="mb-2 flex items-center justify-between gap-3 sm:mb-3 sm:items-end">
          <div class="min-w-0">
            <p class="text-[10px] font-semibold tracking-widest text-blue-600 sm:text-xs">LIVE RECREATION</p>
            <h2 class="mt-0.5 text-base font-semibold text-slate-950 sm:mt-1 sm:text-lg">实时效果预览</h2>
          </div>
          <div class="flex shrink-0 items-center gap-2 sm:gap-3">
            <span class="hidden text-xs text-slate-500 sm:inline">{{ scene.renderer.toUpperCase() }} · {{ scene.variant }}</span>
            <button type="button" class="inline-flex min-h-10 items-center rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:min-h-11 sm:px-4 sm:text-sm" @click="enterImmersive">
              放大预览
            </button>
          </div>
        </div>
        <div ref="stageRef" :class="stageClass" tabindex="-1" @keydown.esc="exitImmersive" @fullscreenchange="handleFullscreenChange">
          <MotionScenePreview :scene="scene" :params="params" />
          <button v-if="isImmersive" type="button" class="absolute right-4 top-4 z-20 inline-flex min-h-11 items-center rounded-xl border border-white/30 bg-slate-950/70 px-4 text-sm font-semibold text-white backdrop-blur hover:bg-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" @click="exitImmersive">
            退出沉浸
          </button>
        </div>
      </div>
      <aside class="xl:sticky xl:top-[calc(var(--us-header-height)+1.5rem)] xl:self-start">
        <div class="mb-3">
          <p class="text-xs font-semibold tracking-widest text-blue-600">TUNING</p>
          <h2 class="mt-1 text-lg font-semibold text-slate-950">场景参数</h2>
        </div>
        <LabParamPanel :params="scene.params" :model-value="params" :has-changes="hasChanges" @update="updateParam" @reset="resetParams" />
        <div class="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-xs font-semibold text-slate-900">参考识别</p>
          <dl class="mt-3 space-y-2 text-sm text-slate-600">
            <div class="flex justify-between gap-4"><dt>MotionSites</dt><dd class="font-medium text-slate-900">{{ scene.referenceName }}</dd></div>
            <div class="flex justify-between gap-4"><dt>分类</dt><dd>{{ scene.referenceCategory }}</dd></div>
            <div class="flex justify-between gap-4"><dt>实现</dt><dd>{{ scene.renderer.toUpperCase() }}</dd></div>
          </dl>
          <a :href="scene.referenceUrl" target="_blank" rel="noopener noreferrer" class="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">查看 MotionSites 公开参考 ↗</a>
          <p class="mt-3 border-t border-slate-200 pt-3 text-xs leading-5 text-slate-500">依据公开预览与教程中的视觉/交互特征原创实现，不复制付费 Prompt 或站点源码。</p>
        </div>
      </aside>
    </section>

    <div class="mt-6">
      <LabCodePanel :key="scene.id" :effect-id="analyticsEffectId" :usage="usage" :source-loader="scene.loadSource" />
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import LabCodePanel from '@/components/lab/LabCodePanel.vue'
import LabParamPanel from '@/components/lab/LabParamPanel.vue'
import MotionScenePreview from '@/components/lab/MotionScenePreview.vue'
import { createMotionSceneParams } from '@/config/motionSceneRegistry'
import { findPromptRecipe } from '@/config/promptRecipeRegistry'
import type { LabEffectId, LabParams, LabValue } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'

interface Props {
  scene: MotionSceneRuntime
}

const props = defineProps<Props>()
const params = ref<LabParams>({})
const stageRef = ref<HTMLElement | null>(null)
const isImmersive = ref(false)
let previousBodyOverflow = ''
const resetParams=()=>{params.value=createMotionSceneParams(props.scene)}
watch(()=>props.scene.id,resetParams,{immediate:true})
const defaults=computed(()=>createMotionSceneParams(props.scene))
const hasChanges=computed(()=>props.scene.params.some(param=>params.value[param.key]!==defaults.value[param.key]))
const updateParam=(key:string,value:LabValue)=>{params.value={...params.value,[key]:value}}
const usage = computed(() => props.scene.createUsage(params.value))
const analyticsEffectId = computed<LabEffectId>(
  () => findPromptRecipe(props.scene.recipeIds[0] ?? '')?.effectId ?? 'aurora'
)
const stageClass = computed(() =>
  isImmersive.value
    ? 'fixed inset-0 z-[100] h-[100dvh] w-[100dvw] overflow-hidden bg-slate-950'
    : 'relative h-[clamp(22rem,52vh,30rem)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:h-[clamp(32rem,68vh,44rem)] xl:h-[clamp(37.5rem,68vh,46rem)]'
)

const enterImmersive = async () => {
  const stage = stageRef.value
  previousBodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  isImmersive.value = true
  stage?.focus({ preventScroll: true })
  if (!stage || !document.fullscreenEnabled || document.fullscreenElement) return
  try {
    await stage.requestFullscreen()
  } catch {
    // Fullscreen may be unavailable; the fixed viewport mode remains as fallback.
  }
}

const restorePageScroll = () => {
  document.body.style.overflow = previousBodyOverflow
}

const exitImmersive = async () => {
  if (document.fullscreenElement) {
    try {
      await document.exitFullscreen()
    } catch {
      // The local immersive state still exits even if the browser API rejects.
    }
  }
  isImmersive.value = false
  restorePageScroll()
}

const handleFullscreenChange = () => {
  if (document.fullscreenElement) return
  isImmersive.value = false
  restorePageScroll()
}

onUnmounted(restorePageScroll)
</script>
