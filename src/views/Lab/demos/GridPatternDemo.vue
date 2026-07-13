<script setup lang="ts">
import { computed, onUnmounted, inject } from 'vue'
import type { Reactive } from 'vue'
import { useMobilePerformance } from '@/composables/useMobilePerformance'

const { prefersReducedMotion } = useMobilePerformance()
const params = inject<Reactive<Record<string, string | number>>>('labParams')

const opacity = computed(() => Number(params?.opacity ?? 0.5))
const gridSize = computed(() => Number(params?.gridSize ?? 40))

const patternId = 'grid-pattern-demo'

const animClass = computed(() =>
  prefersReducedMotion.value ? '' : 'grid-breathe'
)

onUnmounted(() => {
  // CSS animation 无需手动清理
})
</script>

<template>
  <div class="demo-container">
    <div class="demo-preview">
      <svg class="grid-pattern-svg" :class="animClass" :style="{ '--grid-opacity': opacity }" aria-hidden="true">
        <defs>
          <pattern :id="patternId" :width="gridSize" :height="gridSize" patternUnits="userSpaceOnUse">
            <path :d="`M ${gridSize} 0 L 0 0 0 ${gridSize}`" fill="none" stroke="currentColor" stroke-width="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" :fill="`url(#${patternId})`" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  width: 100%;
  min-height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.demo-preview {
  width: 100%;
  height: 240px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  color: var(--text-secondary, #888);
  background: var(--surface, #111);
}

.grid-pattern-svg {
  width: 100%;
  height: 100%;
  display: block;
  opacity: var(--grid-opacity, 0.5);
}

.grid-breathe {
  animation: breathe 4s ease-in-out infinite;
}

@keyframes breathe {

  0%,
  100% {
    opacity: var(--grid-opacity, 0.5);
  }

  50% {
    opacity: calc(var(--grid-opacity, 0.5) * 0.4);
  }
}
</style>