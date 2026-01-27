<template>
  <div class="pixel-input-group">
    <!-- 标签 -->
    <label v-if="label" class="pixel-input__label" :for="id">
      {{ label }}
    </label>
    
    <!-- 输入框 -->
    <input
      :id="id"
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
      @input="handleInput"
    />
    
    <!-- 辅助文本 -->
    <div v-if="helperText || error" class="pixel-input__helper">
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

const inputId = computed(() => props.id || `pixel-input-${Math.random().toString(36).substr(2, 9)}`)

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
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

.pixel-input {
  @apply w-full px-4 py-2 bg-pixel-dark border-2 border-pixel-cyan text-pixel-light;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  transition: all 0.2s ease;
  outline: none;
  
  &:focus {
    @apply border-pixel-purple shadow-[0_0_8px_rgba(255,0,255,0.5)];
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
}

/* 减少运动支持 */
@media (prefers-reduced-motion: reduce) {
  .pixel-input {
    transition: none;
  }
}
</style>