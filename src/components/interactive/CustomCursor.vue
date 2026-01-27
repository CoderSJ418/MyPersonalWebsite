<template>
  <div v-if="cursorEnabled" class="custom-cursor" :style="cursorStyle">
    <div class="cursor-dot" :style="dotStyle"></div>
    <div v-if="showRing" class="cursor-ring" :style="ringStyle"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useCursor } from '@/composables/useCursor'

const {
  position,
  isHovering,
  cursorSize,
  cursorColor,
  cursorEnabled
} = useCursor({
  size: 20,
  hoverSize: 40,
  color: '#3b82f6',
  hoverColor: '#8b5cf6',
  enableRipple: true
})

const cursorStyle = computed(() => ({
  position: 'fixed',
  left: '0',
  top: '0',
  pointerEvents: 'none',
  zIndex: 9999,
  transform: `translate(${position.value.x}px, ${position.value.y}px)`
}))

const dotStyle = computed(() => ({
  width: `${cursorSize.value}px`,
  height: `${cursorSize.value}px`,
  backgroundColor: cursorColor.value,
  borderRadius: '50%',
  transition: 'width 0.3s ease, height 0.3s ease, background-color 0.3s ease'
}))

const ringStyle = computed(() => ({
  width: `${cursorSize.value * 2}px`,
  height: `${cursorSize.value * 2}px`,
  border: `2px solid ${cursorColor.value}`,
  borderRadius: '50%',
  opacity: isHovering.value ? 1 : 0,
  transition: 'all 0.3s ease'
}))

const showRing = computed(() => isHovering.value)

// 隐藏默认光标
onMounted(() => {
  document.body.style.cursor = 'none'
})

onUnmounted(() => {
  document.body.style.cursor = 'auto'
})
</script>

<style scoped>
.custom-cursor {
  mix-blend-mode: difference;
}

.cursor-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.cursor-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>