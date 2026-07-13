<script setup lang="ts">
import { computed, onUnmounted, inject } from 'vue'
import type { Reactive } from 'vue'
import { useMobilePerformance } from '@/composables/useMobilePerformance'

const { prefersReducedMotion } = useMobilePerformance()
const params = inject<Reactive<Record<string, string | number>>>('labParams')

const speed = computed(() => Number(params?.speed ?? 30))
const direction = computed(() => String(params?.direction ?? 'left'))

const duration = computed(() => `${Math.max(1, 120 / speed.value)}s`)
const animDirection = computed(() =>
  direction.value === 'right' ? 'reverse' : 'normal'
)

const items = [
  'Vue 3', 'TypeScript', 'Vite', 'Tailwind CSS',
  'WebGL', 'GSAP', 'Pinia', 'Vue Router',
  'SVG', 'CSS Animation', 'Shader', 'Canvas'
]

const animClass = computed(() =>
  prefersReducedMotion.value ? 'marquee-paused' : 'marquee-running'
)

onUnmounted(() => {
  // CSS animation 无需手动清理
})
</script>

<template>
  <div class="demo-container">
    <div class="demo-preview">
      <div class="marquee-track" :class="animClass">
        <div
class="marquee-content" :style="{
          animationDuration: duration,
          animationDirection: animDirection
        }">
          <span v-for="(item, i) in items" :key="'a-' + i" class="marquee-item">
            {{ item }}
          </span>
        </div>
        <div
class="marquee-content" :style="{
          animationDuration: duration,
          animationDirection: animDirection
        }">
          <span v-for="(item, i) in items" :key="'b-' + i" class="marquee-item">
            {{ item }}
          </span>
        </div>
      </div>
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
  display: flex;
  align-items: center;
}

.marquee-track {
  display: flex;
  width: 200%;
}

.marquee-content {
  display: flex;
  flex-shrink: 0;
  width: 50%;
  animation: marquee-scroll 10s linear infinite;
  gap: 24px;
  padding: 0 12px;
}

.marquee-item {
  flex-shrink: 0;
  padding: 8px 20px;
  border-radius: 8px;
  background: var(--surface-hover, #1a1a1a);
  color: var(--text-secondary, #aaa);
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  border: 1px solid var(--border, #333);
}

.marquee-paused .marquee-content {
  animation-play-state: paused;
}

@keyframes marquee-scroll {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-100%);
  }
}
</style>