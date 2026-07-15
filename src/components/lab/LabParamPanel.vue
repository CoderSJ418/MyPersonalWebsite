<template>
  <section
    class="rounded-xl border border-slate-200 bg-slate-50 p-5"
    aria-labelledby="lab-params-title"
  >
    <div class="mb-4 flex items-center justify-between">
      <h2 id="lab-params-title" class="font-semibold text-slate-900">参数调节</h2>
      <button
        type="button"
        class="min-h-11 rounded px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        :class="{ 'invisible pointer-events-none': !hasChanges }"
        :aria-hidden="!hasChanges"
        :tabindex="hasChanges ? 0 : -1"
        :disabled="!hasChanges"
        @click="$emit('reset')"
      >
        恢复默认值
      </button>
    </div>
    <div class="space-y-4">
      <div
        v-for="param in params"
        :key="param.key"
        class="grid gap-2 sm:grid-cols-[120px_1fr_72px] sm:items-center"
      >
        <label :for="`lab-param-${param.key}`" class="text-sm font-medium text-slate-700">
          {{ param.label }}
        </label>
        <input
          v-if="param.type === 'range'"
          :id="`lab-param-${param.key}`"
          type="range"
          :min="param.min"
          :max="param.max"
          :step="param.step"
          :value="modelValue[param.key] ?? param.defaultValue"
          class="w-full accent-blue-600"
          @input="handleRange(param.key, $event)"
        />
        <input
          v-else-if="param.type === 'color'"
          :id="`lab-param-${param.key}`"
          type="color"
          :value="modelValue[param.key] ?? param.defaultValue"
          class="h-9 w-full rounded border border-slate-300 bg-white"
          @input="handleText(param.key, $event)"
        />
        <select
          v-else
          :id="`lab-param-${param.key}`"
          :value="modelValue[param.key] ?? param.defaultValue"
          class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800"
          @change="handleText(param.key, $event)"
        >
          <option v-for="option in param.options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <output
          :for="`lab-param-${param.key}`"
          class="text-right text-sm font-medium text-blue-600"
        >
          {{ modelValue[param.key] ?? param.defaultValue }}
        </output>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { LabParam, LabParams, LabValue } from '@/types/lab'

interface Props {
  params: LabParam[]
  modelValue: LabParams
  hasChanges: boolean
}

interface Emits {
  (event: 'update', key: string, value: LabValue): void
  (event: 'reset'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleRange = (key: string, event: Event) => {
  if (event.target instanceof HTMLInputElement) emit('update', key, event.target.valueAsNumber)
}

const handleText = (key: string, event: Event) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) {
    emit('update', key, event.target.value)
  }
}
</script>
