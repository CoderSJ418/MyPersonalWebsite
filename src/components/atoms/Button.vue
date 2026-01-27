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
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  user-select: none;
  position: relative;
  overflow: hidden;
  min-height: 40px;
  min-width: 40px;
}

/* 按钮变体 */
.btn--primary {
  background: var(--primary-500);
  color: white;
}

.btn--primary:hover:not(:disabled) {
  background: var(--primary-600);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.btn--primary:active:not(:disabled) {
  background: var(--primary-700);
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
}

.btn--secondary {
  background: var(--surface-2);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
}

.btn--secondary:hover:not(:disabled) {
  background: var(--surface-3);
  border-color: var(--border-subtle);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn--outline {
  background: transparent;
  color: var(--primary-500);
  border: 1px solid var(--primary-500);
}

.btn--outline:hover:not(:disabled) {
  background: var(--primary-50);
  color: var(--primary-600);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
}

.btn--ghost {
  background: transparent;
  color: var(--text-primary);
}

.btn--ghost:hover:not(:disabled) {
  background: var(--surface-2);
  color: var(--primary-500);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.btn--text {
  background: transparent;
  color: var(--primary-500);
}

.btn--text:hover:not(:disabled) {
  background: var(--primary-50);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
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
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
</style>