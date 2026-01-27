<template>
  <component
    :is="isLink ? 'a' : 'button'"
    :class="ctaClasses"
    :href="isLink ? href : undefined"
    :target="target"
    :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
    :disabled="disabled || loading"
    :aria-label="label || (isLink ? `访问 ${label}` : undefined)"
    :aria-busy="loading"
    @click="handleClick"
  >
    <!-- 加载动画 -->
    <span v-if="loading" class="cta__spinner" aria-hidden="true">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"></circle>
        <path d="M12 2A10 10 0 0 1 22 12" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 12 12"
            to="360 12 12"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </span>

    <!-- 图标（前置） -->
    <span v-if="icon && iconPosition === 'left'" class="cta__icon cta__icon--left" aria-hidden="true">
      <component :is="icon" />
    </span>

    <!-- 内容 -->
    <span class="cta__content">
      <slot />
    </span>

    <!-- 图标（后置） -->
    <span v-if="icon && iconPosition === 'right'" class="cta__icon cta__icon--right" aria-hidden="true">
      <component :is="icon" />
    </span>

    <!-- 箭头图标（当 size="large" 时显示） -->
    <span v-if="size === 'large' && !icon" class="cta__arrow" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  icon?: Component
  iconPosition?: 'left' | 'right'
  href?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  iconPosition: 'left',
  target: '_self',
  disabled: false,
  loading: false,
  fullWidth: false,
})

const emit = defineEmits<{
  click: [event: Event]
}>()

const isLink = computed(() => !!props.href)

const ctaClasses = computed(() => [
  'cta',
  `cta--${props.variant}`,
  `cta--${props.size}`,
  {
    'cta--link': isLink.value,
    'cta--disabled': props.disabled || props.loading,
    'cta--loading': props.loading,
    'cta--full-width': props.fullWidth,
    'cta--has-icon': !!props.icon,
  },
])

function handleClick(event: Event) {
  if (props.disabled || props.loading) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<style scoped>
.cta {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

/* 尺寸变体 */
.cta--small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.cta--medium {
  padding: 0.75rem 1.5rem;
  font-size: 0.9375rem;
}

.cta--large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

/* 宽度 */
.cta--full-width {
  width: 100%;
}

/* Primary 变体 */
.cta--primary {
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.cta--primary:hover:not(.cta--disabled):not(.cta--loading) {
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.cta--primary:active:not(.cta--disabled):not(.cta--loading) {
  transform: translateY(0);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Secondary 变体 */
.cta--secondary {
  background: linear-gradient(135deg, var(--secondary-500) 0%, var(--secondary-600) 100%);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.cta--secondary:hover:not(.cta--disabled):not(.cta--loading) {
  background: linear-gradient(135deg, var(--secondary-600) 0%, var(--secondary-700) 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Accent 变体 */
.cta--accent {
  background: linear-gradient(135deg, var(--accent-500) 0%, var(--accent-600) 100%);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.cta--accent:hover:not(.cta--disabled):not(.cta--loading) {
  background: linear-gradient(135deg, var(--accent-600) 0%, var(--accent-700) 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Outline 变体 */
.cta--outline {
  background: transparent;
  color: var(--primary-500);
  border-color: var(--primary-500);
}

.cta--outline:hover:not(.cta--disabled):not(.cta--loading) {
  background: var(--primary-50);
  border-color: var(--primary-600);
  color: var(--primary-600);
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Ghost 变体 */
.cta--ghost {
  background: transparent;
  color: var(--text-primary);
}

.cta--ghost:hover:not(.cta--disabled):not(.cta--loading) {
  background: var(--surface-2);
  transform: translateY(-2px);
}

/* 禁用状态 */
.cta--disabled,
.cta--loading {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* 加载状态 */
.cta--loading {
  pointer-events: none;
}

.cta__spinner {
  position: absolute;
  width: 1.25em;
  height: 1.25em;
  color: currentColor;
}

.cta__spinner svg {
  width: 100%;
  height: 100%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 图标 */
.cta__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25em;
  height: 1.25em;
}

.cta__icon--left {
  margin-right: 0.5rem;
}

.cta__icon--right {
  margin-left: 0.5rem;
}

.cta__icon svg {
  width: 100%;
  height: 100%;
}

/* 内容 */
.cta__content {
  position: relative;
  z-index: 1;
}

/* 箭头 */
.cta__arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25em;
  height: 1.25em;
  margin-left: 0.5rem;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cta:hover:not(.cta--disabled):not(.cta--loading) .cta__arrow {
  transform: translateX(4px);
}

.cta__arrow svg {
  width: 100%;
  height: 100%;
}

/* 高对比度模式 */
@media (prefers-contrast: more) {
  .cta {
    border-width: 3px;
  }

  .cta--primary,
  .cta--secondary,
  .cta--accent {
    background: var(--primary-500);
  }

  .cta--outline {
    background: var(--surface-1);
    border-width: 3px;
  }
}

/* 暗黑模式 */
@media (prefers-color-scheme: dark) {
  .cta--outline:hover:not(.cta--disabled):not(.cta--loading) {
    background: var(--primary-900);
  }

  .cta--ghost:hover:not(.cta--disabled):not(.cta--loading) {
    background: var(--surface-3);
  }
}

/* 动画效果 */
.cta::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
  pointer-events: none;
}

.cta:active:not(.cta--disabled):not(.cta--loading)::before {
  width: 300px;
  height: 300px;
}

/* 无障碍焦点样式 */
.cta:focus-visible {
  outline: 3px solid var(--primary-500);
  outline-offset: 2px;
}

/* 减少动画（用户偏好） */
@media (prefers-reduced-motion: reduce) {
  .cta {
    transition: none;
  }

  .cta__arrow {
    transition: none;
  }

  .cta:hover:not(.cta--disabled):not(.cta--loading) {
    transform: none;
  }

  .cta:active:not(.cta--disabled):not(.cta--loading) {
    transform: none;
  }

  .cta:hover:not(.cta--disabled):not(.cta--loading) .cta__arrow {
    transform: none;
  }
}
</style>