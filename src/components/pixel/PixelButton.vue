<template>
  <component
    :is="tag"
    :class="[
      'pixel-button',
      `pixel-button--${variant}`,
      `pixel-button--${size}`,
      { 'pixel-button--loading': loading, 'pixel-button--disabled': disabled }
    ]"
    :disabled="disabled || loading"
    :type="type"
    @click="handleClick"
  >
    <!-- 加载状态 -->
    <div v-if="loading" class="pixel-button__spinner">
      <div class="pixel-button__spinner-dot"></div>
      <div class="pixel-button__spinner-dot"></div>
      <div class="pixel-button__spinner-dot"></div>
    </div>

    <!-- 图标 -->
    <PixelIcon
      v-if="icon"
      :size="iconSize"
      :color="iconColor"
      class="pixel-button__icon"
    >
      <slot name="icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M5 12h14M12 5l7 7-7 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </slot>
    </PixelIcon>

    <!-- 文本 -->
    <span v-if="!loading" class="pixel-button__text">
      <slot />
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PixelIcon from './PixelIcon.vue'

interface Props {
  tag?: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'default' | 'primary' | 'outline' | 'ghost' | 'text'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  disabled?: boolean
  icon?: boolean
  iconColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'button',
  type: 'button',
  variant: 'default',
  size: 'medium',
  loading: false,
  disabled: false,
  icon: false,
  iconColor: 'current'
})

const emit = defineEmits<{
  click: []
}>()

const iconSize = computed(() => {
  if (props.size === 'small') return 'small'
  if (props.size === 'large') return 'large'
  return 'medium'
})

const iconColorClass = computed(() => {
  if (props.iconColor === 'cyan') return 'text-pixel-cyan'
  if (props.iconColor === 'purple') return 'text-pixel-purple'
  if (props.iconColor === 'gray') return 'text-pixel-gray'
  return ''
})

const handleClick = () => {
  if (!props.disabled && !props.loading) {
    emit('click')
  }
}
</script>

<style scoped>
.pixel-button {
  @apply inline-flex items-center justify-center px-4 py-2 font-medium rounded-lg transition-all duration-200;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  font-family: 'Press Start 2P', cursive;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 2px solid;
  
  /* 按钮大小 */
  &.pixel-button--small {
    @apply px-3 py-1.5 text-xs;
  }
  
  &.pixel-button--large {
    @apply px-6 py-3 text-base;
  }
  
  /* 按钮变体 */
  &.pixel-button--default {
    @apply bg-pixel-cyan text-pixel-dark border-pixel-cyan hover:bg-pixel-purple hover:border-pixel-purple;
  }
  
  &.pixel-button--primary {
    @apply bg-pixel-purple text-white border-pixel-purple hover:bg-pixel-cyan hover:border-pixel-cyan;
  }
  
  &.pixel-button--outline {
    @apply bg-transparent text-pixel-cyan border-pixel-cyan hover:bg-pixel-cyan hover:text-pixel-dark;
  }
  
  &.pixel-button--ghost {
    @apply bg-transparent text-pixel-cyan border-transparent hover:bg-pixel-cyan hover:bg-opacity-10;
  }
  
  &.pixel-button--text {
    @apply bg-transparent text-pixel-cyan border-transparent hover:bg-pixel-cyan hover:bg-opacity-10;
  }
  
  /* 加载状态 */
  &.pixel-button--loading {
    @apply cursor-not-allowed;
  }
  
  /* 禁用状态 */
  &.pixel-button--disabled {
    @apply opacity-50 cursor-not-allowed;
    background: #2a2a2a;
  }
  
  /* 悬停效果 */
  &:hover:not(.pixel-button--disabled):not(.pixel-button--loading) {
    @apply transform scale-105;
    box-shadow: 0 4px 12px rgba(0, 255, 255, 0.3);
  }
  
  /* 点击效果 */
  &:active:not(.pixel-button--disabled):not(.pixel-button--loading) {
    @apply transform scale-95;
  }
  
  /* 加载动画 */
  .pixel-button__spinner {
    @apply flex space-x-1;
  }
  
  .pixel-button__spinner-dot {
    width: 0.25rem;
    height: 0.25rem;
    background-color: currentColor;
    border-radius: 9999px;
    animation: pixel-pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  @keyframes pixel-pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  .animate-pixel-pulse {
    animation: pixel-pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  /* 图标 */
  .pixel-button__icon {
    @apply mr-2;
  }
  
  /* 文本 */
  .pixel-button__text {
    @apply flex items-center;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .pixel-button {
    @apply border-2;
  }
}

/* 减少运动支持 */
@media (prefers-reduced-motion: reduce) {
  .pixel-button {
    transition: none;
  }
}
</style>