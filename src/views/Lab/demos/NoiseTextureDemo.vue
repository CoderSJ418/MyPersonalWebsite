<script setup lang="ts">
import { computed, onUnmounted, inject } from 'vue'
import type { Reactive } from 'vue'
import { useMobilePerformance } from '@/composables/useMobilePerformance'

const { prefersReducedMotion } = useMobilePerformance()
const params = inject<Reactive<Record<string, string | number>>>('labParams')

const opacity = computed(() => Number(params?.opacity ?? 0.1))

const filterId = 'noise-texture-demo'

const reducedMotionClass = computed(() =>
  prefersReducedMotion.value ? 'reduced-motion' : ''
)

onUnmounted(() => {
  // SVG filter 无事件监听，无需清理
})
</script>

<template>
  <div class="demo-container">
    <div class="demo-preview" :class="reducedMotionClass">
      <svg class="noise-svg" :style="{ opacity }" aria-hidden="true">
        <defs>
          <filter :id="filterId">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" :filter="`url(#${filterId})`" />
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
  background: var(--surface, #111);
}

.noise-svg {
  width: 100%;
  height: 100%;
  display: block;
  mix-blend-mode: overlay;
  pointer-events: none;
}
</style>