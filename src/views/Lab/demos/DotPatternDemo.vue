<script setup lang="ts">
import { computed, onUnmounted, inject } from 'vue'
import type { Reactive } from 'vue'
import { useMobilePerformance } from '@/composables/useMobilePerformance'

const { prefersReducedMotion } = useMobilePerformance()
const params = inject<Reactive<Record<string, string | number>>>('labParams')

const dotSize = computed(() => Number(params?.dotSize ?? 2))
const spacing = computed(() => Number(params?.spacing ?? 20))

const patternId = 'dot-pattern-demo'

const reducedMotionClass = computed(() =>
  prefersReducedMotion.value ? 'reduced-motion' : ''
)

onUnmounted(() => {
  // SVG pattern 无事件监听，无需清理
})
</script>

<template>
  <div class="demo-container">
    <div class="demo-preview" :class="reducedMotionClass">
      <svg class="dot-pattern-svg" aria-hidden="true">
        <defs>
          <pattern :id="patternId" :width="spacing" :height="spacing" patternUnits="userSpaceOnUse">
            <circle :cx="spacing / 2" :cy="spacing / 2" :r="dotSize" fill="currentColor" />
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

.dot-pattern-svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>