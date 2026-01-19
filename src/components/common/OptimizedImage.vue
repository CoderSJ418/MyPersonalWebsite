<template>
  <div
    ref="container"
    :class="['optimized-image', { 'is-loaded': isLoaded, 'has-error': hasError }]"
    :style="containerStyle"
  >
    <!-- 占位符 -->
    <div v-if="!isLoaded && !hasError" class="placeholder" :style="placeholderStyle">
      <slot name="placeholder">
        <div class="skeleton"></div>
      </slot>
    </div>

    <!-- 主图片 -->
    <img
      ref="imageEl"
      :src="currentSrc"
      :srcset="srcset"
      :sizes="sizes"
      :alt="alt"
      :loading="lazy ? 'lazy' : 'eager'"
      :width="width"
      :height="height"
      :class="['image', imageClass]"
      :style="imageStyle"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- 错误状态 -->
    <div v-if="hasError" class="error">
      <slot name="error">
        <span class="error-icon">❌</span>
        <span class="error-text">图片加载失败</span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { checkWebPSupport, generatePlaceholder } from '@/utils/image'

interface Props {
  src: string
  alt?: string
  width?: number
  height?: number
  lazy?: boolean
  placeholder?: boolean
  placeholderColor?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  imageClass?: string
  sizes?: string
  srcset?: string
  aspectRatio?: number
  backgroundColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  lazy: true,
  placeholder: true,
  placeholderColor: '#e5e7eb',
  objectFit: 'cover',
  aspectRatio: 16 / 9,
  backgroundColor: 'transparent'
})

const emit = defineEmits<{
  load: [event: Event]
  error: [event: Event]
}>()

const container = ref<HTMLDivElement>()
const imageEl = ref<HTMLImageElement>()
const isLoaded = ref(false)
const hasError = ref(false)
const supportsWebP = ref(false)
const currentSrc = ref(props.src)

// 容器样式
const containerStyle = computed(() => ({
  aspectRatio: props.aspectRatio ? `${props.aspectRatio}` : undefined,
  backgroundColor: props.backgroundColor
}))

// 图片样式
const imageStyle = computed(() => ({
  objectFit: props.objectFit
}))

// 占位符样式
const placeholderStyle = computed(() => ({
  backgroundColor: props.placeholderColor
}))

// 处理图片加载
const handleLoad = (event: Event) => {
  isLoaded.value = true
  emit('load', event)
}

// 处理图片错误
const handleError = (event: Event) => {
  hasError.value = true
  console.error('Image load error:', props.src)
  emit('error', event)
}

// 初始化
onMounted(async () => {
  // 检查 WebP 支持
  supportsWebP.value = await checkWebPSupport()

  // 如果支持 WebP 且图片是 JPEG/PNG，尝试使用 WebP
  if (supportsWebP.value) {
    const ext = props.src.split('.').pop()?.toLowerCase()
    if (['jpg', 'jpeg', 'png'].includes(ext || '')) {
      currentSrc.value = props.src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
    }
  }
})

// 监听 src 变化
watch(
  () => props.src,
  (newSrc) => {
    isLoaded.value = false
    hasError.value = false
    currentSrc.value = newSrc
  }
)
</script>

<style scoped>
.optimized-image {
  position: relative;
  overflow: hidden;
  width: 100%;
  background-color: v-bind(backgroundColor);
}

.image {
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  display: block;
}

.optimized-image.is-loaded .image {
  opacity: 1;
}

.placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skeleton {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    vbind(placeholderColor) 25%,
    #f3f4f6 50%,
    vbind(placeholderColor) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  color: #6b7280;
}

.error-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.error-text {
  font-size: 0.875rem;
}
</style>