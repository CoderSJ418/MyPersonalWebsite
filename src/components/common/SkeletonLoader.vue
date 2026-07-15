<template>
  <template v-if="count > 1">
    <div v-for="i in count" :key="i" class="skeleton-loader" :class="variant">
      <div class="skeleton-loader__shimmer" />
    </div>
  </template>
  <div v-else class="skeleton-loader" :class="variant">
    <div class="skeleton-loader__shimmer" />
  </div>
</template>

<script setup lang="ts">
/**
 * 骨架屏变体
 */
export type SkeletonVariant = 'text' | 'title' | 'avatar' | 'card' | 'blog-card' | 'image' | 'button' | 'custom'

interface Props {
  variant?: SkeletonVariant
  width?: string
  height?: string
  borderRadius?: string
  count?: number
}

withDefaults(defineProps<Props>(), {
  variant: 'text',
  width: '100%',
  height: 'auto',
  borderRadius: '4px',
  count: 1
})
</script>

<style scoped>
.skeleton-loader {
  position: relative;
  overflow: hidden;
  background-color: var(--us-surface, rgba(0, 0, 0, 0.06));
  border-radius: var(--radius-sm);
}

/* Shimmer 动画 */
.skeleton-loader__shimmer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: shimmer 1.5s infinite;
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
  border-radius: var(--radius-lg);
}

/* Blog Card 变体 - 模拟博客卡片布局 */
.skeleton-loader.blog-card {
  width: v-bind(width);
  height: 280px;
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  gap: var(--us-space-3);
  padding: 0;
  overflow: hidden;
  background: none;
}

.skeleton-loader.blog-card .skeleton-loader__shimmer {
  border-radius: var(--radius-xl);
}

/* Image 变体 */
.skeleton-loader.image {
  width: v-bind(width);
  height: v-bind(height);
  border-radius: var(--radius-lg);
}

/* Button 变体 */
.skeleton-loader.button {
  width: 100px;
  height: 40px;
  border-radius: var(--radius-md);
}

/* Custom 变体 */
.skeleton-loader.custom {
  width: v-bind(width);
  height: v-bind(height);
  border-radius: v-bind(borderRadius);
}
</style>
