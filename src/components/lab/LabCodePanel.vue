<template>
  <section
    class="space-y-4 rounded-xl border border-slate-200 bg-white p-5"
    aria-labelledby="lab-code-title"
  >
    <div class="flex items-center justify-between gap-3">
      <h2 id="lab-code-title" class="font-semibold text-slate-900">使用方式</h2>
      <button type="button" class="code-action min-w-32" @click="copyText(usage, 'usage')">
        {{ copyButtonLabel('usage', '复制使用方式') }}
      </button>
    </div>
    <pre
      class="overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm text-slate-100"
    ><code>{{ usage }}</code></pre>
    <div class="border-t border-slate-200 pt-4">
      <button
        type="button"
        class="flex min-h-11 w-full items-center justify-between rounded-lg px-2 text-left font-medium text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        :aria-expanded="expanded"
        aria-controls="lab-full-source"
        @click="toggleSource"
      >
        <span>完整 Vue SFC 源码</span>
        <span aria-hidden="true">{{ expanded ? '收起' : '展开' }}</span>
      </button>
      <div v-if="expanded" id="lab-full-source" class="mt-3 space-y-3">
        <p v-if="status === 'loading'" role="status" class="text-sm text-slate-500">
          正在加载源码…
        </p>
        <div
          v-else-if="status === 'error'"
          role="alert"
          class="rounded-lg bg-red-50 p-4 text-sm text-red-700"
        >
          源码加载失败。
          <button type="button" class="ml-2 underline" @click="loadSource">重试</button>
        </div>
        <template v-else-if="source">
          <div class="flex justify-end">
            <button
              type="button"
              class="code-action min-w-32"
              @click="copyText(source, 'source')"
            >
              {{ copyButtonLabel('source', '复制完整源码') }}
            </button>
          </div>
          <pre
            class="max-h-[32rem] overflow-auto rounded-lg bg-slate-950 p-4 text-xs leading-6 text-slate-100"
          ><code>{{ source }}</code></pre>
        </template>
      </div>
    </div>
    <p class="sr-only" role="status" aria-live="polite">{{ feedback }}</p>
  </section>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue'

import type { LabEffectId } from '@/types/lab'

interface Props {
  effectId: LabEffectId
  usage: string
  sourceLoader: () => Promise<string>
}

interface Emits {
  (event: 'interaction', name: 'code_expand' | 'code_copy', target?: 'usage' | 'source'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const expanded = ref(false)
const source = ref('')
const status = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
const feedback = ref('')
const feedbackTarget = ref<'usage' | 'source' | null>(null)
const feedbackKind = ref<'success' | 'error'>('success')
let feedbackTimer = 0

const loadSource = async () => {
  if (status.value === 'loading' || source.value) return
  status.value = 'loading'
  try {
    source.value = await props.sourceLoader()
    status.value = 'ready'
  } catch {
    status.value = 'error'
  }
}

const toggleSource = () => {
  expanded.value = !expanded.value
  if (expanded.value) {
    emit('interaction', 'code_expand')
    void loadSource()
  }
}

const copyButtonLabel = (target: 'usage' | 'source', idleLabel: string) => {
  if (feedbackTarget.value !== target) return idleLabel
  return feedbackKind.value === 'success' ? '✓ 已复制' : '复制失败'
}

const scheduleFeedbackReset = () => {
  window.clearTimeout(feedbackTimer)
  feedbackTimer = window.setTimeout(() => {
    feedback.value = ''
    feedbackTarget.value = null
  }, 2000)
}

const copyText = async (text: string, target: 'usage' | 'source') => {
  feedbackTarget.value = target
  try {
    await navigator.clipboard.writeText(text)
    feedbackKind.value = 'success'
    feedback.value = target === 'source' ? '完整源码已复制' : '使用方式已复制'
    emit('interaction', 'code_copy', target)
    scheduleFeedbackReset()
  } catch {
    feedbackKind.value = 'error'
    feedback.value = '复制失败，请手动选择代码'
    scheduleFeedbackReset()
  }
}

onUnmounted(() => window.clearTimeout(feedbackTimer))
</script>

<style scoped>
.code-action {
  @apply min-h-11 rounded-lg border border-blue-600 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600;
}
</style>
