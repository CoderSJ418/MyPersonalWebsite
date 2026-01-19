<template>
  <div
    ref="containerRef"
    class="relative"
  >
    <!-- 下拉刷新指示器 -->
    <div
      class="fixed top-0 left-0 right-0 z-40 flex items-center justify-center transition-transform duration-300 pointer-events-none"
      :style="{ transform: `translateY(${pullDistance - 60}px)` }"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-full shadow-lg p-3 flex items-center gap-2"
        :class="{ 'opacity-0': pullDistance < 30 }"
      >
        <div
          class="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full"
          :class="{ 'animate-spin': isRefreshing }"
        ></div>
        <span class="text-sm text-gray-600 dark:text-gray-400">
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

const { isPulling, pullDistance, isRefreshing } = usePullToRefresh(
  props.onRefresh,
  props.threshold
)
</script>