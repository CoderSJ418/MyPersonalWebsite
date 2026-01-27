<template>
  <div class="image-wrapper" :class="{ 'image-wrapper--loading': loading, 'image-wrapper--error': error }">
    <img
      v-if="!error"
      :src="src"
      :alt="alt"
      :class="imageClass"
      :style="imageStyle"
      @load="onLoad"
      @error="onError"
    />
    <div v-if="error" class="image-fallback" :class="fallbackClass" :style="fallbackStyle">
      <slot name="fallback">
        <span class="image-fallback__icon">🖼️</span>
        <span class="image-fallback__text">{{ alt || 'Image not available' }}</span>
      </slot>
    </div>
    <div v-if="loading" class="image-skeleton" :class="skeletonClass" :style="skeletonStyle"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  src: string
  alt?: string
  imageClass?: string
  fallbackClass?: string
  skeletonClass?: string
  width?: string | number
  height?: string | number
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  imageClass: '',
  fallbackClass: '',
  skeletonClass: '',
  width: '100%',
  height: 'auto',
  objectFit: 'cover'
})

const loading = ref(true)
const error = ref(false)

const imageStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  objectFit: props.objectFit,
  display: error.value ? 'none' : 'block'
}))

const fallbackStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  minHeight: typeof props.height === 'number' ? `${props.height}px` : '200px'
}))

const skeletonStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  minHeight: typeof props.height === 'number' ? `${props.height}px` : '200px'
}))

const onLoad = () => {
  loading.value = false
  error.value = false
}

const onError = () => {
  loading.value = false
  error.value = true
}
</script>

<style scoped>
.image-wrapper {
  position: relative;
  overflow: hidden;
}

.image-wrapper--loading img {
  opacity: 0;
}

.image-wrapper img {
  transition: opacity 0.3s ease;
}

.image-skeleton {
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.image-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 8px;
  color: #999;
  text-align: center;
  padding: 20px;
}

.image-fallback__icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.image-fallback__text {
  font-size: 14px;
  line-height: 1.5;
}
</style>