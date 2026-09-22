<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-5" aria-labelledby="recipe-prompt-title">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-xs font-semibold tracking-widest text-blue-600">提示词</p>
        <h2 id="recipe-prompt-title" class="mt-1 text-lg font-semibold text-slate-950">
          中文提示词
        </h2>
      </div>
      <button
        type="button"
        class="min-h-11 rounded-lg border border-blue-600 px-3 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        @click="copyPrompt"
      >
        {{ copied ? '已复制 ✓' : '复制 Prompt' }}
      </button>
    </div>

    <pre class="mt-4 max-h-[32rem] overflow-auto whitespace-pre-wrap rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">{{ prompt }}</pre>

    <p class="mt-3 text-xs leading-5 text-slate-500">
      上方参数变化会同步写入 Prompt。MotionSites 案例仅作为方法与结构灵感索引，不复制其付费 Prompt 原文。
    </p>
  </section>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue'

interface Props {
  prompt: string
}

const props = defineProps<Props>()
const copied = ref(false)
let timer = 0

const copyPrompt = async () => {
  if (!navigator.clipboard) return
  await navigator.clipboard.writeText(props.prompt)
  copied.value = true
  window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    copied.value = false
  }, 1800)
}

onUnmounted(() => window.clearTimeout(timer))
</script>
