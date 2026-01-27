<template>
  <article
    :class="cardClasses"
    :role="role"
    :tabindex="hoverable ? 0 : undefined"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <slot />
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
  clickable?: boolean
  disabled?: boolean
  role?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
  hoverable: false,
  clickable: false,
  disabled: false,
  role: 'article',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const cardClasses = computed(() => {
  return [
    'card',
    `card--${props.variant}`,
    `card--padding-${props.padding}`,
    {
      'card--hoverable': props.hoverable,
      'card--clickable': props.clickable,
      'card--disabled': props.disabled,
    },
  ]
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && (props.hoverable || props.clickable)) {
    emit('click', event)
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.hoverable || props.clickable) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick(event as any)
    }
  }
}
</script>

<style scoped>
.card {
  background: var(--surface-1);
  border-radius: var(--radius-xl);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.card:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

/* ==================== Variants ==================== */

.card--default {
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-sm);
}

.card--elevated {
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-lg);
}

.card--outlined {
  background: transparent;
  border: 1px solid var(--border-default);
  box-shadow: none;
}

.card--ghost {
  background: transparent;
  border: 1px solid transparent;
  box-shadow: none;
}

/* ==================== Hover Effects ==================== */

.card--hoverable:hover:not(.card--disabled),
.card--clickable:hover:not(.card--disabled) {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.card--hoverable:active:not(.card--disabled),
.card--clickable:active:not(.card--disabled) {
  transform: translateY(-2px);
}

.card--outlined:hover:not(.card--disabled) {
  border-color: var(--primary-500);
  background: var(--surface-1);
}

.card--ghost:hover:not(.card--disabled) {
  background: var(--surface-2);
}

/* ==================== Padding ==================== */

.card--padding-none {
  padding: 0;
}

.card--padding-sm {
  padding: var(--spacing-4);
}

.card--padding-md {
  padding: var(--spacing-6);
}

.card--padding-lg {
  padding: var(--spacing-8);
}

/* ==================== States ==================== */

.card--disabled {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}

/* ==================== Focus Ring for High Contrast Mode ==================== */

@media (prefers-contrast: high) {
  .card:focus-visible {
    outline: 3px solid var(--text-primary);
    outline-offset: 3px;
  }
}

/* ==================== Dark Mode ==================== */

@media (prefers-color-scheme: dark) {
  .card--default,
  .card--elevated {
    border-color: var(--border-strong);
  }

  .card--outlined:hover:not(.card--disabled) {
    border-color: var(--primary-400);
  }
}
</style>