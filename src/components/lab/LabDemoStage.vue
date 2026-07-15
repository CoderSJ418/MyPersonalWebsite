<template>
  <div
    data-lab-preview
    class="relative min-h-64 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-6"
  >
    <div
      v-if="runtimeError"
      class="flex min-h-64 flex-col items-center justify-center gap-3 text-center"
      role="alert"
    >
      <p class="font-medium text-slate-900">演示运行时出现问题</p>
      <button type="button" class="rounded-lg bg-blue-600 px-4 py-2 text-white" @click="retry">
        重新加载演示
      </button>
    </div>
    <component :is="component" v-else :key="renderKey" v-bind="params" />
  </div>
</template>

<script setup lang="ts">
import { onErrorCaptured, ref, watch, type Component } from 'vue'

import type { LabEffectId, LabParams } from '@/types/lab'

interface Props {
  effectId: LabEffectId
  component: Component
  params: LabParams
}

const props = defineProps<Props>()
const runtimeError = ref(false)
const renderKey = ref(0)

onErrorCaptured(() => {
  runtimeError.value = true
  return false
})

watch(
  () => props.effectId,
  () => {
    runtimeError.value = false
    renderKey.value += 1
  }
)

const retry = () => {
  runtimeError.value = false
  renderKey.value += 1
}
</script>
