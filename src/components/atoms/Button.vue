<template>
  <button 
    class="btn"
    :class="[
      `btn--${variant}`,
      `btn--${size}`,
      { 'btn--disabled': disabled, 'btn--loading': loading }
    ]"
    :disabled="disabled"
    :aria-busy="loading"
    :aria-label="loading ? '加载中...' : label"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'text'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md'
})

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  if (!props.disabled && !props.loading) {
    emit('click')
  }
}
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-6);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
  transition: all var(--transition-normal);
  cursor: pointer;
  user-select: none;
  position: relative;
  overflow: hidden;
  min-height: 40px;
  min-width: 40px;
}

/* 按钮变体 */
.btn--primary {
  background: var(--color-primary);
  color: white;
}

.btn--primary:hover:not(:disabled) {
  background: var(--color-primary-600);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.btn--primary:active:not(:disabled) {
  background: var(--color-primary-700);
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
}

.btn--secondary {
  background: var(--color-surface-bg-secondary);
  color: var(--color-surface-text);
  border: 1px solid var(--color-surface-border);
}

.btn--secondary:hover:not(:disabled) {
  background: var(--color-surface-bg-tertiary);
  border-color: var(--color-surface-border-secondary);
}

.btn--outline {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.btn--outline:hover:not(:disabled) {
  background: var(--color-primary-50);
  color: var(--color-primary-600);
}

.btn--ghost {
  background: transparent;
  color: var(--color-surface-text);
}

.btn--ghost:hover:not(:disabled) {
  background: var(--color-surface-bg-secondary);
  color: var(--color-primary);
}

.btn--text {
  background: transparent;
  color: var(--color-primary);
}

.btn--text:hover:not(:disabled) {
  background: var(--color-primary-50);
}

/* 按钮尺寸 */
.btn--sm {
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--font-size-sm);
  min-height: 32px;
  min-width: 32px;
}

.btn--lg {
  padding: var(--spacing-4) var(--spacing-8);
  font-size: var(--font-size-lg);
  min-height: 48px;
  min-width: 48px;
}

.btn--xl {
  padding: var(--spacing-5) var(--spacing-12);
  font-size: var(--font-size-xl);
  min-height: 56px;
  min-width: 56px;
}

/* 状态 */
.btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.btn--loading {
  pointer-events: none;
}

/* 微交互 */
.btn:active:not(:disabled) {
  transform: scale(0.98);
}

.btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>