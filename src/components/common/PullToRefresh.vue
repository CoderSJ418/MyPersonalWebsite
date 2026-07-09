<template>
  <div ref="containerRef" class="ptr">
    <!-- 下拉刷新指示器 -->
    <div class="ptr__indicator" :style="{ transform: `translateY(${pullDistance - 60}px)` }">
      <div class="ptr__bubble" :class="{ 'ptr__bubble--hidden': pullDistance < 30 }">
        <div class="ptr__spinner" :class="{ 'ptr__spinner--active': isRefreshing }"></div>
        <span class="ptr__label">
          {{ isRefreshing ? '刷新中...' : pullDistance >= threshold ? '释放刷新' : '下拉刷新' }}
        </span>
      </div>
    </div>

    <!-- 内容插槽 -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePullToRefresh } from '@/composables/useTouchGestures'

interface Props {
  onRefresh: () => Promise<void>
  threshold?: number
}

const props = withDefaults(defineProps<Props>(), {
  threshold: 80
})

const containerRef = ref<HTMLElement | null>(null)

const { pullDistance, isRefreshing } = usePullToRefresh(props.onRefresh, props.threshold)
</script>

<style scoped>
.ptr {
  position: relative;
}

.ptr__indicator {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--us-duration-normal) var(--us-easing);
  pointer-events: none;
}

.ptr__bubble {
  background: var(--us-material-solid);
  border-radius: 9999px;
  box-shadow: var(--us-depth-2);
  padding: var(--us-space-3);
  display: flex;
  align-items: center;
  gap: var(--us-space-2);
  transition: opacity var(--us-duration-fast) var(--us-easing);
}

.ptr__bubble--hidden {
  opacity: 0;
}

.ptr__spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid var(--us-accent-border);
  border-top-color: transparent;
  border-radius: 50%;
}

.ptr__spinner--active {
  animation: spin 0.6s linear infinite;
}



.ptr__label {
  font-size: 0.875rem;
  color: var(--us-text-secondary);
}
</style>