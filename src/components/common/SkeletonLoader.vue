<template>
  <div class="skeleton-loader" :class="variant">
    <div class="skeleton-loader__shimmer" />
  </div>
</template>

<script setup lang="ts">
/**
 * 骨架屏变体
 */
export type SkeletonVariant =
  | 'text'
  | 'title'
  | 'avatar'
  | 'card'
  | 'image'
  | 'button'
  | 'custom'

interface Props {
  variant?: SkeletonVariant
  width?: string
  height?: string
  borderRadius?: string
  lines?: number
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'text',
  width: '100%',
  height: 'auto',
  borderRadius: '4px',
  lines: 1,
})
</script>

<style scoped>
.skeleton-loader {
  position: relative;
  overflow: hidden;
  background-color: #e5e7eb;
  border-radius: 4px;
}

.dark .skeleton-loader {
  background-color: #374151;
}

/* Shimmer 动画 */
.skeleton-loader__shimmer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

.dark .skeleton-loader__shimmer {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Text 变体 */
.skeleton-loader.text {
  width: v-bind(width);
  height: 16px;
}

/* Title 变体 */
.skeleton-loader.title {
  width: v-bind(width);
  height: 28px;
}

/* Avatar 变体 */
.skeleton-loader.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

/* Card 变体 */
.skeleton-loader.card {
  width: v-bind(width);
  height: 200px;
  border-radius: 8px;
}

/* Image 变体 */
.skeleton-loader.image {
  width: v-bind(width);
  height: v-bind(height);
  border-radius: 8px;
}

/* Button 变体 */
.skeleton-loader.button {
  width: 100px;
  height: 40px;
  border-radius: 6px;
}

/* Custom 变体 */
.skeleton-loader.custom {
  width: v-bind(width);
  height: v-bind(height);
  border-radius: v-bind(borderRadius);
}
</style>