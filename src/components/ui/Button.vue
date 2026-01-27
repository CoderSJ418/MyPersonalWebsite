<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    :type="nativeType"
    :aria-label="label"
    :aria-disabled="disabled || loading"
    :aria-busy="loading"
    @click="handleClick"
  >
    <span v-if="loading" class="btn__spinner" aria-hidden="true"></span>
    <span v-if="icon && !loading" class="btn__icon" aria-hidden="true">
      <slot name="icon">{{ icon }}</slot>
    </span>
    <span class="btn__content">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  nativeType?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
  icon?: string
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  nativeType: 'button',
  fullWidth: false,
  icon: '',
  label: '',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>]

const buttonClasses = computed(() => {
  return [
    'btn',
    `btn--${props.variant}`,
    `btn--${props.size}`,
    {
      'btn--disabled': props.disabled || props.loading,
      'btn--loading': props.loading,
      'btn--full-width': props.fullWidth,
      'btn--with-icon': props.icon,
    },
  ]
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
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
  border-radius: var(--radius-lg);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-sans);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  user-select: none;
  white-space: nowrap;
}

.btn:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

.btn:active:not(.btn--disabled):not(.btn--loading) {
  transform: translateY(0);
}

/* ==================== Variants ==================== */

.btn--primary {
  background: var(--primary-500);
  color: white;
  border: 1px solid var(--primary-500);
}

.btn--primary:hover:not(.btn--disabled):not(.btn--loading) {
  background: var(--primary-600);
  border-color: var(--primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn--primary:active:not(.btn--disabled):not(.btn--loading) {
  background: var(--primary-700);
  border-color: var(--primary-700);
  box-shadow: var(--shadow-sm);
}

.btn--secondary {
  background: var(--surface-2);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
}

.btn--secondary:hover:not(.btn--disabled):not(.btn--loading) {
  background: var(--surface-3);
  border-color: var(--border-strong);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn--outline {
  background: transparent;
  color: var(--primary-500);
  border: 1px solid var(--primary-500);
}

.btn--outline:hover:not(.btn--disabled):not(.btn--loading) {
  background: var(--primary-50);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.btn--ghost {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid transparent;
}

.btn--ghost:hover:not(.btn--disabled):not(.btn--loading) {
  background: var(--surface-2);
  transform: translateY(-1px);
}

.btn--danger {
  background: var(--error);
  color: white;
  border: 1px solid var(--error);
}

.btn--danger:hover:not(.btn--disabled):not(.btn--loading) {
  background: #dc2626;
  border-color: #dc2626;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* ==================== Sizes ==================== */

.btn--xs {
  padding: var(--spacing-1) var(--spacing-3);
  font-size: var(--text-xs);
  border-radius: var(--radius-sm);
}

.btn--sm {
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--text-sm);
  border-radius: var(--radius-md);
}

.btn--md {
  padding: var(--spacing-3) var(--spacing-6);
  font-size: var(--text-base);
  border-radius: var(--radius-lg);
}

.btn--lg {
  padding: var(--spacing-4) var(--spacing-8);
  font-size: var(--text-lg);
  border-radius: var(--radius-xl);
}

.btn--xl {
  padding: var(--spacing-5) var(--spacing-10);
  font-size: var(--text-xl);
  border-radius: var(--radius-2xl);
}

/* ==================== States ==================== */

.btn--disabled,
.btn--loading {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* ==================== Full Width ==================== */

.btn--full-width {
  width: 100%;
}

/* ==================== With Icon ==================== */

.btn--with-icon {
  gap: var(--spacing-2);
}

.btn__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ==================== Loading State ==================== */

.btn__spinner {
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ==================== Content ==================== */

.btn__content {
  flex: 1;
  min-width: 0;
}

/* ==================== Dark Mode ==================== */

@media (prefers-color-scheme: dark) {
  .btn--primary:hover:not(.btn--disabled):not(.btn--loading) {
    background: var(--primary-400);
    border-color: var(--primary-400);
  }

  .btn--primary:active:not(.btn--disabled):not(.btn--loading) {
    background: var(--primary-300);
    border-color: var(--primary-300);
  }

  .btn--outline {
    color: var(--primary-400);
    border-color: var(--primary-400);
  }

  .btn--outline:hover:not(.btn--disabled):not(.btn--loading) {
    background: var(--primary-900);
  }

  .btn--danger:hover:not(.btn--disabled):not(.btn--loading) {
    background: #ef4444;
    border-color: #ef4444;
  }
}

/* ==================== Focus Ring for High Contrast Mode ==================== */

@media (prefers-contrast: high) {
  .btn:focus-visible {
    outline: 3px solid var(--text-primary);
    outline-offset: 3px;
  }
}
</style>