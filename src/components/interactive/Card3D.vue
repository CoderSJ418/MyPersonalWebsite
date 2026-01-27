<template>
  <div
    class="card-3d"
    :style="{ transform: transform }"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    @mouseenter="handleMouseEnter"
  >
    <div v-if="glare" class="card-3d__glare" :style="glareStyle"></div>
    <div class="card-3d__content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCard3D } from '@/composables/useCard3D'

interface Props {
  maxTilt?: number
  perspective?: number
  scale?: number
  glare?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  maxTilt: 15,
  perspective: 1000,
  scale: 1.05,
  glare: true
})

const {
  transform,
  glareStyle,
  handleMouseMove,
  handleMouseLeave,
  handleMouseEnter
} = useCard3D(props)
</script>

<style scoped>
.card-3d {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.1s ease;
}

.card-3d__glare {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  border-radius: inherit;
  overflow: hidden;
}

.card-3d__content {
  transform: translateZ(20px);
}
</style>