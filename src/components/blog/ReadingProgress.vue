<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

/**
 * ReadingProgress — 阅读进度条
 * 设计理念：极细渐变线条，不干扰阅读，提供位置感知
 * 对标：Josh W. Comeau 博客的进度条 + Medium 阅读进度
 */
const progress = ref(0)

const updateProgress = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  if (docHeight <= 0) {
    progress.value = 0
    return
  }
  progress.value = Math.min(100, (scrollTop / docHeight) * 100)
}

onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true })
  updateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})
</script>

<template>
  <div
class="reading-progress" role="progressbar" :aria-valuenow="Math.round(progress)" aria-valuemin="0"
    aria-valuemax="100" aria-label="阅读进度">
    <div class="reading-progress__bar" :style="{ width: `${progress}%` }" />
  </div>
</template>

<style scoped>
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: var(--z-progress);
  background: transparent;
  pointer-events: none;
}

.reading-progress__bar {
  height: 100%;
  background: linear-gradient(90deg, var(--us-accent), rgba(37, 99, 235, 0.8), rgba(37, 99, 235, 0.6));
  border-radius: 0 2px 2px 0;
  transition: width 80ms linear;
  will-change: width;
}

</style>
