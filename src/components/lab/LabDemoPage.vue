<template>
  <article
    class="mx-auto max-w-6xl space-y-6 px-6 pb-10 pt-[calc(var(--us-header-height)+2.5rem)] lg:px-8"
  >
    <nav aria-label="面包屑" class="flex items-center gap-2 text-sm text-slate-500">
      <RouterLink
        to="/lab"
        class="inline-flex min-h-11 items-center hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
      >
        交互实验室
      </RouterLink>
      <span aria-hidden="true">/</span>
      <span aria-current="page" class="text-slate-800">{{ effect.name }}</span>
    </nav>
    <header>
      <p class="mb-2 text-sm font-semibold text-blue-600">{{ effect.tags.join(' · ') }}</p>
      <h1 class="text-3xl font-bold text-slate-950">{{ effect.name }}</h1>
      <p class="mt-3 max-w-3xl leading-7 text-slate-600">{{ effect.description }}</p>
    </header>
    <LabDemoStage :effect-id="effect.id" :component="effect.component" :params="params" />
    <LabParamPanel
      :params="effect.params"
      :model-value="params"
      :has-changes="hasChanges"
      @update="updateParam"
      @reset="resetParams"
    />
    <LabDemoGuidance :effect="effect" />
    <LabCodePanel
      :key="effect.id"
      :effect-id="effect.id"
      :usage="usage"
      :source-loader="effect.loadSource"
      @interaction="handleInteraction"
    />
    <aside
      class="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600 sm:grid-cols-2"
    >
      <div>
        <h2 class="mb-2 font-semibold text-slate-900">兼容与降级</h2>
        <p>{{ effect.compatibility.browsers }}</p>
        <p class="mt-1">{{ effect.compatibility.fallback }}</p>
      </div>
      <div>
        <h2 class="mb-2 font-semibold text-slate-900">源码授权</h2>
        <p>{{ effect.license }} · {{ originLabel }}</p>
        <p class="mt-1">运行时依赖：{{ effect.dependencies.join('、') }}</p>
        <p class="mt-1">
          已验证宿主工具链：Vue 3.4、Vite 5、@vitejs/plugin-vue 5、TypeScript
          5；构建工具由宿主项目提供。
        </p>
      </div>
    </aside>
  </article>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

import LabCodePanel from '@/components/lab/LabCodePanel.vue'
import LabDemoGuidance from '@/components/lab/LabDemoGuidance.vue'
import LabDemoStage from '@/components/lab/LabDemoStage.vue'
import LabParamPanel from '@/components/lab/LabParamPanel.vue'
import { analyticsConsent, trackLabAnalytics } from '@/services/privacyAnalytics'
import type { LabEffect, LabParams, LabValue } from '@/types/lab'

interface Props {
  effect: LabEffect
}

const props = defineProps<Props>()
const params = ref<LabParams>({})
const trackedDemoId = ref<LabEffect['id'] | null>(null)

const defaults = (): LabParams =>
  Object.fromEntries(props.effect.params.map((param) => [param.key, param.defaultValue]))
const resetParams = () => {
  params.value = defaults()
}
watch(() => props.effect.id, resetParams, { immediate: true })
watch(
  [analyticsConsent, () => props.effect.id],
  ([decision, effectId]) => {
    if (decision !== 'granted' || trackedDemoId.value === effectId) return
    trackLabAnalytics({
      event: 'demo_open',
      effectId,
      category: props.effect.category
    })
    trackedDemoId.value = effectId
  },
  { immediate: true }
)

const updateParam = (key: string, value: LabValue) => {
  params.value = { ...params.value, [key]: value }
}
const hasChanges = computed(() =>
  props.effect.params.some((param) => params.value[param.key] !== param.defaultValue)
)
const usage = computed(() => props.effect.createUsage(params.value))
const originLabel = computed(
  () =>
    ({
      original: '原创实现',
      'clean-room': '净室实现',
      'mit-adaptation': 'MIT 改编'
    })[props.effect.implementationOrigin]
)

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
