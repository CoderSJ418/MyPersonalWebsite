<template>
  <canvas
    ref="canvas"
    class="particle-background"
    :class="{ 'particle-background--dark': theme === 'dark' }"
  ></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useParticleSystem } from '@/composables/useParticleSystem'

interface Props {
  particleCount?: number
  connectionDistance?: number
  mouseInteraction?: 'repel' | 'attract' | 'none'
  theme?: 'light' | 'dark'
}

const props = withDefaults(defineProps<Props>(), {
  particleCount: 200,
  connectionDistance: 150,
  mouseInteraction: 'none',
  theme: 'dark'
})

const canvas = ref<HTMLCanvasElement | null>(null)

const {
  isEnabled,
  init,
  destroy
} = useParticleSystem({
  count: props.particleCount,
  connectionDistance: props.connectionDistance,
  mouseInteraction: props.mouseInteraction,
  theme: props.theme
})

onMounted(() => {
  if (isEnabled.value) {
    init()
  }
})

onUnmounted(() => {
  destroy()
})
</script>

<style scoped>
.particle-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.particle-background--dark {
  opacity: 0.5;
}
</style>