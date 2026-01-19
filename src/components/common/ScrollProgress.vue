<template>
  <div
    class="scroll-progress"
    :class="{ 'scroll-progress--visible': isVisible }"
  >
    <div
      class="scroll-progress__bar"
      :style="{ width: `${progress * 100}%` }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useScrollAnimations } from '@/composables/useScrollAnimations'

interface Props {
  position?: 'top' | 'bottom'
  color?: string
  height?: number
  showAfter?: number
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top',
  color: '#3b82f6',
  height: 3,
  showAfter: 100,
})

const { scrollProgress, createScrollProgressIndicator } = useScrollAnimations()
const progress = ref(0)
const isVisible = ref(false)

let progressRef: HTMLElement | null = null

/**
 * 更新进度
 */
const updateProgress = (value: number) => {
  progress.value = value
  isVisible.value = value > 0
}

/**
 * 初始化滚动进度
 */
onMounted(() => {
  // 创建进度条元素
  progressRef = document.createElement('div')
  progressRef.className = 'scroll-progress-indicator'
  progressRef.style.position = 'fixed'
  progressRef.style.left = '0'
  progressRef.style.width = '0%'
  progressRef.style.height = `${props.height}px`
  progressRef.style.backgroundColor = props.color
  progressRef.style.zIndex = '9999'
  progressRef.style.transition = 'width 0.1s linear'

  if (props.position === 'top') {
    progressRef.style.top = '0'
  } else {
    progressRef.style.bottom = '0'
  }

  document.body.appendChild(progressRef)

  // 创建滚动进度指示器
  createScrollProgressIndicator(progressRef)

  // 监听滚动进度变化
  const unwatch = scrollProgress.value = 0
  const interval = setInterval(() => {
    updateProgress(scrollProgress.value)
  }, 16)

  // 清理函数
  onUnmounted(() => {
    clearInterval(interval)
    if (progressRef && progressRef.parentNode) {
      progressRef.parentNode.removeChild(progressRef)
    }
  })
})
</script>

<style scoped>
.scroll-progress {
  position: fixed;
  left: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.scroll-progress--visible {
  opacity: 1;
}

.scroll-progress__bar {
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  transition: width 0.1s linear;
}

/* 顶部位置 */
.scroll-progress[data-position="top"] {
  top: 0;
}

/* 底部位置 */
.scroll-progress[data-position="bottom"] {
  bottom: 0;
}
</style>