<template>
  <div class="input-wrapper" :class="wrapperClasses">
    <label
      v-if="label"
      :for="inputId"
      class="input-wrapper__label"
      :class="{ 'input-wrapper__label--required': required }"
    >
      {{ label }}
    </label>
    
    <div class="input-wrapper__input-container">
      <input
        :id="inputId"
        ref="inputRef"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :name="name"
        :autocomplete="autocomplete"
        :min="min"
        :max="max"
        :step="step"
        :class="inputClasses"
        :aria-label="ariaLabel || label"
        :aria-invalid="hasError"
        :aria-describedby="hasError ? `${inputId}-error` : undefined"
        :aria-required="required"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      
      <span v-if="hasError" class="input-wrapper__icon input-wrapper__icon--error" aria-hidden="true">
        <slot name="error-icon">⚠️</slot>
      </span>
      
      <span v-else-if="showSuccessIcon && success && !hasError" class="input-wrapper__icon input-wrapper__icon--success" aria-hidden="true">
        <slot name="success-icon">✓</slot>
      </span>
    </div>
    
    <p
      v-if="errorMessage"
      :id="`${inputId}-error`"
      class="input-wrapper__error"
      role="alert"
      aria-live="assertive"
    >
      {{ errorMessage }}
    </p>
    
    <p
      v-if="helperText && !hasError"
      class="input-wrapper__helper"
    >
      {{ helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  label?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  name?: string
  autocomplete?: string
  min?: string | number
  max?: string | number
  step?: string | number
  error?: string
  helperText?: string
  success?: boolean
  showSuccessIcon?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'outlined'
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
  showSuccessIcon: true,
  size: 'md',
  variant: 'default',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const hasError = computed(() => !!props.error)

const errorMessage = computed(() => props.error)

const wrapperClasses = computed(() => {
  return [
    'input-wrapper',
    `input-wrapper--${props.size}`,
    `input-wrapper--${props.variant}`,
    {
      'input-wrapper--has-error': hasError.value,
      'input-wrapper--disabled': props.disabled,
      'input-wrapper--readonly': props.readonly,
      'input-wrapper--has-label': !!props.label,
    },
  ]
})

const inputClasses = computed(() => {
  return [
    'input',
    `input--${props.size}`,
    `input--${props.variant}`,
    {
      'input--has-error': hasError.value,
      'input--has-success': props.success && !hasError.value,
      'input--disabled': props.disabled,
      'input--readonly': props.readonly,
      'input--with-icon': hasError.value || (props.showSuccessIcon && props.success),
    },
  ]
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value: string | number = target.value
  
  // 如果是数字类型，转换为数字
  if (props.type === 'number') {
    value = target.valueAsNumber
  }
  
  emit('update:modelValue', value)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

// 暴露 inputRef 以便外部访问
defineExpose({
  inputRef,
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
})
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  width: 100%;
}

/* ==================== Label ==================== */

.input-wrapper__label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  margin-bottom: var(--spacing-1);
}

.input-wrapper__label--required::after {
  content: ' *';
  color: var(--error);
  margin-left: 2px;
}

/* ==================== Input Container ==================== */

.input-wrapper__input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  line-height: 1.5;
  font-family: var(--font-sans);
  color: var(--text-primary);
  background: var(--surface-1);
  border: 1px solid var(--border-default);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
}

.input::placeholder {
  color: var(--text-tertiary);
}

.input:focus {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  transform: translateY(-1px);
}

.input:disabled {
  background: var(--surface-2);
  color: var(--text-disabled);
  cursor: not-allowed;
  opacity: 0.6;
}

.input:readonly {
  background: var(--surface-2);
  cursor: default;
}

/* ==================== Sizes ==================== */

.input--sm {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--text-sm);
  border-radius: var(--radius-md);
}

.input--md {
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--text-base);
  border-radius: var(--radius-lg);
}

.input--lg {
  padding: var(--spacing-4) var(--spacing-5);
  font-size: var(--text-lg);
  border-radius: var(--radius-xl);
}

/* ==================== Variants ==================== */

.input--default {
  background: var(--surface-1);
  border: 1px solid var(--border-default);
}

.input--filled {
  background: var(--surface-2);
  border: 1px solid var(--border-subtle);
}

.input--filled:focus {
  background: var(--surface-1);
  border-color: var(--primary-500);
}

.input--outlined {
  background: transparent;
  border: 1px solid var(--border-default);
}

/* ==================== States ==================== */

.input--has-error {
  border-color: var(--error);
  background: var(--error-50);
}

.input--has-error:focus {
  border-color: var(--error);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.input--has-success {
  border-color: var(--success);
}

.input--has-success:focus {
  border-color: var(--success);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* ==================== Icon ==================== */

.input-wrapper__icon {
  position: absolute;
  right: var(--spacing-3);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  font-size: var(--text-lg);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.input--with-icon {
  padding-right: var(--spacing-10);
}

.input--sm.input--with-icon {
  padding-right: var(--spacing-8);
}

.input--lg.input--with-icon {
  padding-right: var(--spacing-12);
}

/* ==================== Error Message ==================== */

.input-wrapper__error {
  font-size: var(--text-sm);
  color: var(--error);
  margin: 0;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ==================== Helper Text ==================== */

.input-wrapper__helper {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin: 0;
}

/* ==================== Dark Mode ==================== */

@media (prefers-color-scheme: dark) {
  .input--default {
    background: var(--surface-2);
    border-color: var(--border-strong);
  }

  .input--filled {
    background: var(--surface-3);
  }

  .input--filled:focus {
    background: var(--surface-2);
  }

  .input--has-error {
    background: rgba(239, 68, 68, 0.1);
  }
}

/* ==================== Focus Ring for High Contrast Mode ==================== */

@media (prefers-contrast: high) {
  .input:focus {
    outline: 3px solid var(--text-primary);
    outline-offset: 3px;
  }
}
</style>