<template>
  <svg
    :class="[
      'pixel-icon',
      `pixel-icon--${size}`,
      `pixel-icon--${color}`,
      { 'pixel-icon--rotate': rotate }
    ]"
    :width="sizePx"
    :height="sizePx"
    viewBox="0 0 24 24"
    fill="none"
    :stroke="color === 'current' ? 'currentColor' : undefined"
    :stroke-width="strokeWidth"
    :stroke-linecap="strokeLinecap"
    :stroke-linejoin="strokeLinejoin"
  >
    <slot />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: 'small' | 'medium' | 'large' | 'xlarge'
  color?: 'current' | 'cyan' | 'purple' | 'gray'
  rotate?: boolean
  strokeWidth?: number
  strokeLinecap?: 'round' | 'square' | 'butt'
  strokeLinejoin?: 'round' | 'bevel' | 'miter'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  color: 'current',
  rotate: false,
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
})

const sizePx = {
  small: 16,
  medium: 20,
  large: 24,
  xlarge: 32
}[props.size]
</script>

<style scoped>
.pixel-icon {
  @apply inline-block;
  transition: all 0.2s ease;
  
  /* 旋转动画 */
  &.pixel-icon--rotate {
    animation: pixel-rotate 2s linear infinite;
  }
}

@keyframes pixel-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 尺寸 */
.pixel-icon--small {
  @apply w-4 h-4;
}

.pixel-icon--medium {
  @apply w-5 h-5;
}

.pixel-icon--large {
  @apply w-6 h-6;
}

.pixel-icon--xlarge {
  @apply w-8 h-8;
}

/* 颜色 */
.pixel-icon--cyan {
  @apply text-pixel-cyan;
}

.pixel-icon--purple {
  @apply text-pixel-purple;
}

.pixel-icon--gray {
  @apply text-pixel-gray;
}

/* 旋转动画 */
.pixel-icon--rotate {
  animation: pixel-rotate 2s linear infinite;
}

/* 减少运动支持 */
@media (prefers-reduced-motion: reduce) {
  .pixel-icon--rotate {
    animation: none;
  }
}
</style>