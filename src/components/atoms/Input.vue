<template>
  <div class="input-group">
    <label v-if="label" :for="id" class="input-label">
      {{ label }}
      <span v-if="required" class="input-required">*</span>
    </label>
    
    <div class="input-wrapper">
      <input
        :id="id"
        type="text"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-describedby="helpText ? `${id}-help` : undefined"
        :aria-invalid="error ? 'true' : 'false'"
        :aria-required="required"
        class="input"
        :class="[
          `input--${size}`,
          { 'input--error': error, 'input--disabled': disabled }
        ]"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      
      <div v-if="error" class="input-error">
        <slot name="error">{{ error }}</slot>
      </div>
    </div>
    
    <div v-if="helpText" :id="`${id}-help`" class="input-help">
      {{ helpText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'

interface Props {
  modelValue: string
  id?: string
  label?: string
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  error?: string
  helpText?: string
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  size: 'md',
  required: false,
  disabled: false,
  readonly: false,
  error: '',
  helpText: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: []
  blur: []
}>()

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleFocus = () => {
  emit('focus')
}

const handleBlur = () => {
  emit('blur')
}

const inputId = computed(() => props.id || `input-${Date.now()}`)
</script>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.input-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-surface-text);
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.input-required {
  color: var(--color-error);
  font-size: var(--font-size-xs);
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.input {
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  transition: all var(--transition-normal);
  color: var(--color-surface-text);
  background: var(--color-surface-bg);
  font-family: var(--font-family-primary);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.input::placeholder {
  color: var(--color-surface-text-tertiary);
}

.input--error {
  border-color: var(--color-error);
}

.input--error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.input--disabled {
  background: var(--color-surface-bg-secondary);
  color: var(--color-surface-text-tertiary);
  cursor: not-allowed;
}

.input--disabled::placeholder {
  color: var(--color-surface-text-tertiary);
}

/* 尺寸 */
.input--sm {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--font-size-sm);
}

.input--lg {
  padding: var(--spacing-4) var(--spacing-6);
  font-size: var(--font-size-lg);
}

.input-error {
  font-size: var(--font-size-sm);
  color: var(--color-error);
  margin-top: var(--spacing-1);
}

.input-help {
  font-size: var(--font-size-sm);
  color: var(--color-surface-text-secondary);
}
</style>