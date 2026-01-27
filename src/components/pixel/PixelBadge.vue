<template>
  <span
    :class="[
      'pixel-badge',
      `pixel-badge--${variant}`,
      `pixel-badge--${size}`,
      { 'pixel-badge--dot': dot }
    ]"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  dot?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'medium',
  dot: false
})
</script>

<style scoped>
.pixel-badge {
  @apply inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium;
  position: relative;
  overflow: hidden;
  
  /* 徽章大小 */
  &.pixel-badge--small {
    @apply px-1.5 py-0.5 text-xs;
  }
  
  &.pixel-badge--large {
    @apply px-3 py-1.5 text-sm;
  }
  
  /* 徽章变体 */
  &.pixel-badge--default {
    @apply bg-pixel-cyan text-pixel-dark;
  }
  
  &.pixel-badge--primary {
    @apply bg-pixel-purple text-white;
  }
  
  &.pixel-badge--secondary {
    @apply bg-pixel-cyan bg-opacity-20 text-pixel-cyan;
  }
  
  &.pixel-badge--outline {
    @apply bg-transparent text-pixel-cyan border-2 border-pixel-cyan;
  }
  
  &.pixel-badge--ghost {
    @apply bg-transparent text-pixel-cyan;
  }
  
  /* 点状徽章 */
  &.pixel-badge--dot {
    @apply w-2 h-2 p-0 rounded-full;
  }
  
  /* 高对比度支持 */
  @media (prefers-contrast: high) {
    @apply border-2;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .pixel-badge {
    @apply border-2;
  }
}

/* 减少运动支持 */
@media (prefers-reduced-motion: reduce) {
  .pixel-badge {
    transition: none;
  }
}
</style>