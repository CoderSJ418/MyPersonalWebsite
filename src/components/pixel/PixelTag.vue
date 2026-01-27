<template>
  <span
    :class="[
      'pixel-tag',
      `pixel-tag--${variant}`,
      `pixel-tag--${size}`,
      { 'pixel-tag--clickable': clickable }
    ]"
    @click="handleClick"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'medium',
  clickable: false
})

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>

<style scoped>
.pixel-tag {
  @apply inline-flex items-center px-3 py-1 rounded-full text-sm font-medium;
  position: relative;
  overflow: hidden;
  cursor: default;
  transition: all 0.2s ease;
  
  /* 标签大小 */
  &.pixel-tag--small {
    @apply px-2 py-0.5 text-xs;
  }
  
  &.pixel-tag--large {
    @apply px-4 py-2 text-base;
  }
  
  /* 标签变体 */
  &.pixel-tag--default {
    @apply bg-pixel-cyan text-pixel-dark;
  }
  
  &.pixel-tag--primary {
    @apply bg-pixel-purple text-white;
  }
  
  &.pixel-tag--secondary {
    @apply bg-pixel-cyan bg-opacity-20 text-pixel-cyan;
  }
  
  &.pixel-tag--outline {
    @apply bg-transparent text-pixel-cyan border-2 border-pixel-cyan;
  }
  
  &.pixel-tag--ghost {
    @apply bg-transparent text-pixel-cyan;
  }
  
  /* 可点击状态 */
  &.pixel-tag--clickable {
    @apply cursor-pointer;
    
    &:hover {
      @apply transform scale-105;
    }
    
    &:active {
      @apply transform scale-95;
    }
  }
  
  /* 点击效果 */
  &.pixel-tag--clickable::before {
    content: '';
    @apply absolute inset-0 bg-pixel-cyan opacity-0;
    transition: opacity 0.2s ease;
    z-index: -1;
  }
  
  &.pixel-tag--clickable:hover::before {
    @apply opacity-10;
  }
  
  /* 高对比度支持 */
  @media (prefers-contrast: high) {
    @apply border-2;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .pixel-tag {
    @apply border-2;
  }
}

/* 减少运动支持 */
@media (prefers-reduced-motion: reduce) {
  .pixel-tag {
    transition: none;
  }
}
</style>