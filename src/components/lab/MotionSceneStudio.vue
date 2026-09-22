<template>
  <article class="mx-auto max-w-7xl px-6 pb-16 pt-[calc(var(--us-header-height)+2.5rem)] lg:px-8">
    <nav aria-label="面包屑" class="flex flex-wrap items-center gap-2 text-sm text-slate-500">
      <RouterLink to="/lab" class="inline-flex min-h-11 items-center hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">交互实验室</RouterLink>
      <span aria-hidden="true">/</span><span>MotionSites 效果复刻</span><span aria-hidden="true">/</span>
      <span aria-current="page" class="text-slate-800">{{ scene.title }}</span>
    </nav>

    <header class="mt-5 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
      <div class="max-w-4xl">
        <p class="text-sm font-semibold text-blue-600">{{ scene.referenceCategory }} · {{ scene.renderer.toUpperCase() }}</p>
        <h1 class="mt-2 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">{{ scene.title }}</h1>
        <p class="mt-4 text-lg leading-8 text-slate-600">{{ scene.subtitle }}</p>
      </div>
      <a :href="scene.referenceUrl" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
        查看 MotionSites 公开参考 ↗
      </a>
    </header>

    <p class="mt-4 max-w-4xl rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-900">
      这是依据 MotionSites 公开预览和公开教程中的视觉/交互特征重新实现的实验，不复制其付费 Prompt 或站点源码。
    </p>

    <section class="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(20rem,.5fr)]">
      <div>
        <div class="mb-3 flex items-center justify-between gap-3">
          <div><p class="text-xs font-semibold tracking-widest text-blue-600">LIVE RECREATION</p><h2 class="mt-1 text-lg font-semibold text-slate-950">运行效果</h2></div>
          <span class="text-xs text-slate-500">{{ scene.renderer.toUpperCase() }} · {{ scene.variant }}</span>
        </div>
        <div class="min-h-[32rem] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <MotionScenePreview :scene="scene" :params="params" force-live />
        </div>
      </div>
      <div>
        <div class="mb-3"><p class="text-xs font-semibold tracking-widest text-blue-600">TUNING</p><h2 class="mt-1 text-lg font-semibold text-slate-950">场景参数</h2></div>
        <LabParamPanel :params="scene.params" :model-value="params" :has-changes="hasChanges" @update="updateParam" @reset="resetParams" />
        <div class="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-xs font-semibold text-slate-900">参考识别</p>
          <dl class="mt-3 space-y-2 text-sm text-slate-600">
            <div class="flex justify-between gap-4"><dt>MotionSites</dt><dd class="font-medium text-slate-900">{{ scene.referenceName }}</dd></div>
            <div class="flex justify-between gap-4"><dt>分类</dt><dd>{{ scene.referenceCategory }}</dd></div>
            <div class="flex justify-between gap-4"><dt>实现</dt><dd>{{ scene.renderer.toUpperCase() }}</dd></div>
          </dl>
        </div>
      </div>
    </section>

    <div class="mt-6">
      <LabCodePanel :key="scene.id" :effect-id="analyticsEffectId" :usage="usage" :source-loader="scene.loadSource" />
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import LabCodePanel from '@/components/lab/LabCodePanel.vue'
import LabParamPanel from '@/components/lab/LabParamPanel.vue'
import MotionScenePreview from '@/components/lab/MotionScenePreview.vue'
import { createMotionSceneParams } from '@/config/motionSceneRegistry'
import { findPromptRecipe } from '@/config/promptRecipeRegistry'
import type { LabEffectId, LabParams, LabValue } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'

const props=defineProps<{scene:MotionSceneRuntime}>()
const params=ref<LabParams>({})
const resetParams=()=>{params.value=createMotionSceneParams(props.scene)}
watch(()=>props.scene.id,resetParams,{immediate:true})
const defaults=computed(()=>createMotionSceneParams(props.scene))
const hasChanges=computed(()=>props.scene.params.some(param=>params.value[param.key]!==defaults.value[param.key]))
const updateParam=(key:string,value:LabValue)=>{params.value={...params.value,[key]:value}}
const usage=computed(()=>props.scene.createUsage(params.value))
const analyticsEffectId=computed<LabEffectId>(()=>findPromptRecipe(props.scene.recipeIds[0]??'')?.effectId??'aurora')
</script>
