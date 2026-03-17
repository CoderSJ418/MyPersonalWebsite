<template>
  <div class="lazy-image-container" :style="{ aspectRatio }">
    <!-- 占位符 -->
    <div v-if="!isLoaded" class="lazy-image-placeholder">
      <div v-if="placeholder === 'blur'" class="blur-placeholder" />
      <div v-else-if="placeholder === 'color'" class="color-placeholder" />
      <div v-else-if="placeholder === 'spinner'" class="spinner-placeholder">
        <div class="spinner"></div>
      </div>
    </div>

    <!-- 图片元素 -->
    <img
      v-show="isLoaded"
      ref="imageRef"
      :src="optimizedUrl"
      :srcset="srcset"
      :sizes="sizes"
      :alt="alt"
      :loading="loading"
      :class="[
        'lazy-image',
        { 'lazy-image-loaded': isLoaded },
        { 'lazy-image-failed': hasError }
      ]"
      @load="onLoad"
      @error="onError"
    />

    <!-- 加载状态指示器 -->
    <div v-if="isLoading" class="lazy-image-loading">
      <div class="loading-spinner"></div>
    </div>

    <!-- 错误状态指示器 -->
    <div v-if="hasError" class="lazy-image-error">
      <span class="error-icon">⚠️</span>
      <span class="error-text">{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { imageOptimizer, type ImageOptimizationConfig } from '@/utils/imageOptimizer'

interface Props {
  src: string
  alt?: string
  aspectRatio?: string
  quality?: number
  placeholder?: 'blur' | 'color' | 'spinner' | 'none'
  loading?: 'auto' | 'lazy' | 'eager'
  lazyLoad?: boolean
  sizes?: string
  srcset?: string
  config?: ImageOptimizationConfig
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  aspectRatio: '16/9',
  quality: 80,
  placeholder: 'blur',
  loading: 'lazy',
  lazyLoad: true,
  sizes: '100vw',
  srcset: '',
  config: () => ({})
})

const emit = defineEmits<{
  load: []
  error: [error: Error]
  retry: []
}>()

const imageRef = ref<HTMLImageElement>()
const isLoaded = ref(false)
const isLoading = ref(false)
const hasError = ref(false)
const errorMessage = ref('图片加载失败')

// 优化后的 URL
const optimizedUrl = ref('')
const srcset = computed(() => {
  if (props.srcset) return props.srcset
  
  const config = {
    ...props.config,
    quality: props.quality,
    lazyLoad: props.lazyLoad
  }
  
  return imageOptimizer.generateImageUrl(props.src, config)
})

const sizes = computed(() => props.sizes)

// 重试加载
const retryLoad = () => {
  hasError.value = false
  isLoaded.value = false
  isLoading.value = true
  
  if (imageRef.value) {
    imageRef.value.src = optimizedUrl.value
  }
  
  emit('retry')
}

// 加载完成回调
const onLoad = () => {
  isLoaded.value = true
  isLoading.value = false
  hasError.value = false
  
  emit('load')
}

// 加载失败回调
const onError = () => {
  isLoading.value = false
  hasError.value = true
  
  const error = new Error(`Failed to load image: ${props.src}`)
  emit('error', error)
}

// 懒加载观察器
const observer = ref<IntersectionObserver>()
const observeElement = (element: Element) => {
  if (!observer.value) {
    observer.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (imageRef.value && !isLoaded.value && !isLoading.value) {
              isLoading.value = true
              imageRef.value.src = optimizedUrl.value
            }
            observer.value?.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '50px' }
    )
  }
  
  observer.value.observe(element)
}

// 组件挂载
onMounted(() => {
  if (props.lazyLoad) {
    observeElement(imageRef.value!)
  } else {
    isLoading.value = true
    if (imageRef.value) {
      imageRef.value.src = optimizedUrl.value
    }
  }
})

// 组件卸载
onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect()
  }
})

// 监听配置变化
watch(
  () => props.config,
  (newConfig) => {
    const config = {
      ...newConfig,
      quality: props.quality,
      lazyLoad: props.lazyLoad
    }
    optimizedUrl.value = imageOptimizer.generateImageUrl(props.src, config)
  },
  { deep: true }
)

// 重试方法暴露给父组件
defineExpose({
  retry: retryLoad
})
</script>

<style scoped>
.lazy-image-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.lazy-image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  z-index: 1;
}

.blur-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.color-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #667eea, #764ba2, #f093fb, #4facfe);
  background-size: 400% 400%;
  animation: gradientShift 3s ease infinite;
}

.spinner-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.lazy-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
  position: absolute;
  top: 0;
  left: 0;
}

.lazy-image-loaded {
  opacity: 1;
}

.lazy-image-failed {
  opacity: 0.5;
  filter: grayscale(100%);
}

.lazy-image-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.lazy-image-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 2;
}

.error-icon {
  font-size: 24px;
}

.error-text {
  color: #e74c3c;
  font-size: 12px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>