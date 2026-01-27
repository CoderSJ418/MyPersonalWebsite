<template>
  <div class="lazy-image" :class="{ 'lazy-image--loaded': isLoaded }">
    <img
      ref="imageRef"
      :src="src"
      :alt="alt"
      :loading="loading"
      :width="width"
      :height="height"
      :sizes="sizes"
      :srcset="srcset"
      class="lazy-image__img"
      :class="{ 'lazy-image__img--loaded': isLoaded }"
      @load="handleLoad"
      @error="handleError"
    />
    
    <div v-if="!isLoaded" class="lazy-image__placeholder">
      <div class="lazy-image__skeleton"></div>
    </div>
    
    <div v-if="error" class="lazy-image__error">
      <ErrorIcon />
      <span>加载失败</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { defineProps, defineEmits } from 'vue'
import ErrorIcon from './icons/ErrorIcon.vue'

interface Props {
  src: string
  alt: string
  width?: number | string
  height?: number | string
  loading?: 'lazy' | 'eager'
  sizes?: string
  srcset?: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: 'lazy',
  sizes: '100vw',
  placeholder: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"%3E%3C/svg%3E'
})

const emit = defineEmits<{
  load: []
  error: []
}>()

const imageRef = ref<HTMLImageElement>()
const isLoaded = ref(false)
const error = ref(false)
let observer: IntersectionObserver

const handleLoad = () => {
  isLoaded.value = true
  error.value = false
  emit('load')
}

const handleError = () => {
  error.value = true
  isLoaded.value = false
  emit('error')
}

const initIntersectionObserver = () => {
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && imageRef.value) {
          observer.unobserve(imageRef.value)
          imageRef.value.src = props.src
        }
      })
    }, {
      rootMargin: '50px',
      threshold: 0.1
    })
    
    if (imageRef.value) {
      observer.observe(imageRef.value)
    }
  } else {
    // 降级方案：直接加载
    imageRef.value!.src = props.src
  }
}

onMounted(() => {
  initIntersectionObserver()
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
.lazy-image {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--color-surface-bg-secondary);
  border-radius: var(--radius-md);
}

.lazy-image__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.lazy-image__img--loaded {
  opacity: 1;
}

.lazy-image__placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lazy-image__skeleton {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--color-surface-bg-secondary) 25%,
    var(--color-surface-bg-tertiary) 50%,
    var(--color-surface-bg-secondary) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.lazy-image__error {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  color: var(--color-error);
  font-size: var(--font-size-sm);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .lazy-image__skeleton {
    background-size: 300% 100%;
  }
}
</style>