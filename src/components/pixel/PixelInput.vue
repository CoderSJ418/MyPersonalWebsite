<template>
  <div class="pixel-input-group">
    <!-- 标签 -->
    <label v-if="label" :id="labelId" class="pixel-input__label" :for="inputId">
      {{ label }}
      <span v-if="required" aria-hidden="true" class="pixel-input__required">*</span>
    </label>
    
    <!-- 输入框 -->
    <input
      :id="inputId"
      ref="inputRef"
      :class="[
        'pixel-input',
        `pixel-input--${variant}`,
        { 'pixel-input--disabled': disabled, 'pixel-input--error': error }
      ]"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :value="modelValue"
      :aria-labelledby="label ? labelId : undefined"
      :aria-describedby="helperText || error ? helperId : undefined"
      :aria-invalid="!!error"
      :aria-required="required"
      @input="handleInput"
    />
    
    <!-- 辅助文本 -->
    <div v-if="helperText || error" :id="helperId" class="pixel-input__helper" role="alert">
      <span class="pixel-input__text" :class="{ 'pixel-input__text--error': error }">
        {{ error || helperText }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue?: string
  type?: string
  label?: string
  placeholder?: string
  helperText?: string
  error?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  variant?: 'default' | 'outline' | 'filled'
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  variant: 'default',
  id: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputRef = ref<HTMLInputElement | null>(null)

// 生成唯一 ID 用于 ARIA 关联
const uniqueId = computed(() => props.id || `pixel-input-${Math.random().toString(36).slice(2, 9)}`)
const inputId = computed(() => uniqueId.value)
const labelId = computed(() => `${uniqueId.value}-label`)
const helperId = computed(() => `${uniqueId.value}-helper`)

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

// 暴露 focus 方法
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur()
})
</script>

<style scoped>
.pixel-input-group {
  @apply w-full mb-4;
}

.pixel-input__label {
  @apply block mb-2 text-pixel-cyan font-medium;
  font-family: 'Press Start 2P', cursive;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pixel-input__required {
  @apply text-pixel-purple ml-1;
}

.pixel-input {
  @apply w-full px-4 py-2 bg-pixel-dark border-2 border-pixel-cyan text-pixel-light;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  transition: all 0.2s ease;
  
  /* 焦点指示器 - 可访问性修复 */
  &:focus-visible {
    @apply outline-none ring-2 ring-pixel-purple ring-offset-2 ring-offset-pixel-dark;
    box-shadow: 0 0 8px rgba(255, 0, 255, 0.5);
  }
  
  &:focus {
    @apply border-pixel-purple;
    box-shadow: 0 0 8px rgba(255, 0, 255, 0.5);
  }
  
  &:disabled {
    @apply opacity-50 cursor-not-allowed;
    background: #2a2a2a;
  }
  
  &:read-only {
    @apply bg-pixel-gray bg-opacity-20;
  }
  
  &::placeholder {
    @apply text-pixel-gray;
  }
  
  /* 输入框变体 */
  &.pixel-input--outline {
    @apply bg-transparent;
  }
  
  &.pixel-input--filled {
    @apply bg-pixel-cyan bg-opacity-10;
  }
  
  &.pixel-input--error {
    @apply border-pixel-purple;
  }
}

.pixel-input__helper {
  @apply mt-1;
}

.pixel-input__text {
  @apply text-xs;
  
  &.pixel-input__text--error {
    @apply text-pixel-purple;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .pixel-input {
    @apply border-2;
  }
  
  .pixel-input:focus-visible {
    outline: 3px solid;
    outline-offset: 2px;
  }
}

/* 减少运动支持 */
@media (prefers-reduced-motion: reduce) {
  .pixel-input {
    transition: none;
  }
}
</style>
