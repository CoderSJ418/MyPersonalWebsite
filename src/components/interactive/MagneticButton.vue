<template>
  <button
    class="magnetic-button"
    :style="{ transform: `translate(${buttonPosition.x}px, ${buttonPosition.y}px)` }"
    @mousemove="handleMouseMove"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { useMagneticButton } from '@/composables/useMagneticButton'

interface Props {
  strength?: number
  elasticity?: number
  scale?: number
}

const props = withDefaults(defineProps<Props>(), {
  strength: 0.5,
  elasticity: 0.3,
  scale: 1.05
})

const {
  buttonPosition,
  handleMouseMove,
  handleMouseEnter,
  handleMouseLeave,
  handleClick
} = useMagneticButton(props)
</script>

<style scoped>
.magnetic-button {
  position: relative;
  transition: transform var(--us-duration-micro) var(--us-easing);
}

.magnetic-button:hover {
  z-index: var(--z-sticky);
}
</style>