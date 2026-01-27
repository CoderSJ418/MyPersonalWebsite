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
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.input-required {
  color: var(--error-500);
  font-size: var(--font-size-xs);
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.input {
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--text-primary);
  background: var(--surface-1);
  font-family: var(--font-family-primary);
}

.input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  transform: translateY(-1px);
}

.input::placeholder {
  color: var(--text-secondary);
  opacity: 0.7;
}

.input--error {
  border-color: var(--error-500);
}

.input--error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.input--disabled {
  background: var(--surface-2);
  color: var(--text-secondary);
  cursor: not-allowed;
}

.input--disabled::placeholder {
  color: var(--text-secondary);
  opacity: 0.5;
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
  color: var(--error-500);
  margin-top: var(--spacing-1);
}

.input-help {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
</style>