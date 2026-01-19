<template>
  <div
    ref="containerRef"
    class="relative overflow-hidden"
    :style="{ width: width, height: height, minHeight: minHeight }"
  >
    <!-- 占位符 -->
    <div
      v-if="!loaded || error"
      class="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 animate-pulse"
    >
      <component
        :is="error ? AlertCircle : Loader2"
        class="w-8 h-8 text-gray-400"
        :class="{ 'animate-spin': !error }"
      />
    </div>

    <!-- 图片 -->
    <img
      ref="imageRef"
      :src="loaded ? actualSrc : undefined"
      :alt="alt"
      :loading="loading"
      class="w-full h-full object-cover transition-opacity duration-300"
      :class="{ 'opacity-0': !loaded, 'opacity-100': loaded }"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- 错误提示 -->
    <div
      v-if="error"
      class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
    >
      <div class="text-center">
        <AlertCircle class="w-8 h-8 mx-auto mb-2" />
        <span class="text-sm">加载失败</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Loader2, AlertCircle } from 'lucide-vue-next'

interface Props {
  src: string
  alt?: string
  width?: string
  height?: string
  minHeight?: string
  loading?: 'lazy' | 'eager'
  threshold?: number
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  width: '100%',
  height: 'auto',
  minHeight: '200px',
  loading: 'lazy',
  threshold: 0.1
})

const containerRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const loaded = ref(false)
const error = ref(false)
const actualSrc = ref('')

let observer: IntersectionObserver | null = null

const handleLoad = () => {
  loaded.value = true
}

const handleError = () => {
  error.value = true
  loaded.value = false
}

const loadImage = () => {
  if (loaded.value || error.value) return

  actualSrc.value = props.src
}

onMounted(() => {
  // 如果是急切加载，直接加载
  if (props.loading === 'eager') {
    loadImage()
    return
  }

  // 使用 Intersection Observer 实现懒加载
  if ('IntersectionObserver' in window && containerRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage()
            observer?.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: `${props.threshold * 100}%`,
        threshold: props.threshold
      }
    )

    observer.observe(containerRef.value)
  } else {
    // 不支持 IntersectionObserver，直接加载
    loadImage()
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
/* 优化移动端图片渲染 */
img {
  will-change: opacity;
  transform: translateZ(0);
}
</style>