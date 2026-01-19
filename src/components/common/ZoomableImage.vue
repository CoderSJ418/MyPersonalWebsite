<template>
  <div
    ref="containerRef"
    class="overflow-hidden relative"
    :style="{ width: width, height: height }"
  >
    <img
      ref="imageRef"
      :src="src"
      :alt="alt"
      class="transition-transform duration-300 cursor-zoom-in"
      :style="{ transform: `scale(${scale})` }"
      @click="handleClick"
      @load="handleImageLoad"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTouchGestures } from '@/composables/useTouchGestures'

interface Props {
  src: string
  alt?: string
  width?: string
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  width: '100%',
  height: 'auto'
})

const containerRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const scale = ref(1)
const isZoomed = ref(false)

// 使用触摸手势
useTouchGestures(containerRef, {
  onDoubleTap: () => {
    toggleZoom()
  }
})

const toggleZoom = () => {
  isZoomed.value = !isZoomed.value
  scale.value = isZoomed.value ? 2 : 1
}

const handleClick = () => {
  // 在非触摸设备上单击也可以缩放
  if (!('ontouchstart' in window)) {
    toggleZoom()
  }
}

const handleImageLoad = () => {
  // 图片加载完成后的处理
  if (imageRef.value) {
    imageRef.value.style.cursor = isZoomed.value ? 'zoom-out' : 'zoom-in'
  }
}
</script>

<style scoped>
img {
  display: block;
  max-width: 100%;
  height: auto;
  touch-action: manipulation;
}
</style>