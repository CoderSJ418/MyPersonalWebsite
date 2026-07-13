<script setup lang="ts">
import type { LabParam } from '@/config/labRegistry'

const props = defineProps<{
  params: LabParam[]
  modelValue: Record<string, string | number>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, string | number>]
}>()

const updateParam = (key: string, value: string | number) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

const resetToDefaults = () => {
  const defaults: Record<string, string | number> = {}
  props.params.forEach(p => {
    defaults[p.key] = p.defaultValue
  })
  emit('update:modelValue', defaults)
}

const hasDefaults = (): boolean => {
  return props.params.some(p => props.modelValue[p.key] !== p.defaultValue)
}
</script>

<template>
  <div class="lab-param-panel">
    <div class="lab-param-panel-header">
      <h3 class="lab-param-panel-title">参数调节</h3>
      <button v-if="hasDefaults()" class="lab-param-reset" type="button" @click="resetToDefaults">
        重置默认值
      </button>
    </div>
    <div class="lab-param-panel-body">
      <div v-for="param in params" :key="param.key" class="lab-param-row">
        <label class="lab-param-label">{{ param.label }}</label>
        <div class="lab-param-control">
          <input
            v-if="param.type === 'range'"
            type="range"
            :min="param.min"
            :max="param.max"
            :step="param.step"
            :value="modelValue[param.key] ?? param.defaultValue"
            class="lab-param-range"
            @input="updateParam(param.key, ($event.target as HTMLInputElement).valueAsNumber)"
          />
          <input
            v-else-if="param.type === 'color'"
            type="color"
            :value="(modelValue[param.key] ?? param.defaultValue) as string"
            class="lab-param-color"
            @input="updateParam(param.key, ($event.target as HTMLInputElement).value)"
          />
          <select
            v-else-if="param.type === 'select'"
            :value="modelValue[param.key] ?? param.defaultValue"
            class="lab-param-select"
            @change="updateParam(param.key, ($event.target as HTMLSelectElement).value)"
          >
            <option v-for="opt in param.options" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
          <span class="lab-param-value">{{ modelValue[param.key] ?? param.defaultValue }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lab-param-panel {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  margin-top: 24px;
}
.lab-param-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.lab-param-panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}
.lab-param-reset {
  font-size: 13px;
  color: #2563EB;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}
.lab-param-reset:hover {
  background: #eff6ff;
}
.lab-param-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 0;
}
.lab-param-label {
  font-size: 14px;
  color: #475569;
  min-width: 80px;
}
.lab-param-control {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}
.lab-param-range {
  flex: 1;
  height: 4px;
  accent-color: #2563EB;
}
.lab-param-value {
  font-size: 14px;
  color: #2563EB;
  font-weight: 500;
  min-width: 40px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.lab-param-color {
  width: 40px;
  height: 28px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  cursor: pointer;
  padding: 2px;
}
.lab-param-select {
  padding: 4px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  color: #1e293b;
  background: white;
  cursor: pointer;
}
</style>
