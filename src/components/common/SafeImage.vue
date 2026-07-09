<template>
  <div class="image-wrapper" :class="{ 'image-wrapper--loading': loading, 'image-wrapper--error': error }">
    <img
v-if="!error" :src="src" :alt="alt" :loading="props.nativeLoading" :class="imageClass" :style="imageStyle"
      @load="onLoad" @error="onError" />
    <!-- 加载中状态：pulse 动画占位块 -->
    <div v-if="loading" class="image-skeleton" :class="skeletonClass" :style="skeletonStyle"></div>
    <!-- 加载失败状态：SVG图标 + 文字 + 重试按钮 -->
    <div v-if="error" class="image-fallback" :class="fallbackClass" :style="fallbackStyle">
      <slot name="fallback">
        <svg
class="image-fallback__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
          stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <span class="image-fallback__text">{{ alt || '图片加载失败' }}</span>
        <button type="button" class="image-fallback__retry" aria-label="重新加载图片" @click="retry">
          <svg
width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          重试
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  src: string
  alt?: string
  nativeLoading?: 'lazy' | 'eager'
  imageClass?: string
  fallbackClass?: string
  skeletonClass?: string
  width?: string | number
  height?: string | number
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  nativeLoading: 'lazy',
  imageClass: '',
  fallbackClass: '',
  skeletonClass: '',
  width: '100%',
  height: 'auto',
  objectFit: 'cover'
})

const loading = ref(true)
const error = ref(false)
const retryKey = ref(0)

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

const retry = () => {
  error.value = false
  loading.value = true
  retryKey.value++
  // Force re-render by changing the src key
  // The img element will re-mount and re-attempt loading
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
  transition: opacity var(--us-duration-normal, 0.2s) var(--us-easing, ease);
}

/* ===== 加载中骨架 ===== */
.image-skeleton {
  position: absolute;
  top: 0;
  left: 0;
  background: var(--us-surface-hover, #f0f0f0);
  border-radius: var(--radius-lg, 0.75rem);
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

@keyframes skeleton-pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }
}

/* ===== 加载失败 Fallback ===== */
.image-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--us-surface-hover, #f5f5f5);
  border-radius: var(--radius-lg, 0.75rem);
  color: var(--us-text-tertiary, #999);
  text-align: center;
  padding: var(--us-space-5);
  gap: var(--us-space-2);
}

.image-fallback__icon {
  width: 48px;
  height: 48px;
  color: var(--us-text-tertiary, #999);
  opacity: 0.5;
}

.image-fallback__text {
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  color: var(--us-text-secondary, #666);
}

.image-fallback__retry {
  display: inline-flex;
  align-items: center;
  gap: var(--us-space-1);
  padding: var(--us-space-2) var(--us-space-4);
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--us-accent, #2563EB);
  background: var(--us-accent-subtle, rgba(37, 99, 235, 0.08));
  border: 1px solid var(--us-accent-border, rgba(37, 99, 235, 0.2));
  border-radius: var(--radius-md, 0.375rem);
  transition:
    background var(--us-duration-fast, 0.15s) var(--us-easing, ease),
    border-color var(--us-duration-fast, 0.15s) var(--us-easing, ease),
    transform var(--us-duration-fast, 0.15s) var(--us-easing, ease),
    box-shadow var(--us-duration-fast, 0.15s) var(--us-easing, ease);
  margin-top: var(--us-space-1);
}

.image-fallback__retry:hover {
  background: var(--us-accent-border, rgba(37, 99, 235, 0.15));
  border-color: var(--us-accent, #2563EB);
  transform: translateY(-1px);
  box-shadow: var(--us-depth-2-hover);
}

.image-fallback__retry:active {
  transform: scale(0.95);
  box-shadow: var(--us-depth-1);
}

.image-fallback__retry:focus-visible {
  outline: 2px solid var(--us-accent, #2563EB);
  outline-offset: 2px;
}

/* ===== 暗色模式 ===== */
.dark .image-skeleton {
  background: var(--us-surface-hover, rgba(255, 255, 255, 0.08));
}

.dark .image-fallback {
  background: var(--us-surface, rgba(255, 255, 255, 0.06));
  border: 1px solid var(--us-border, rgba(255, 255, 255, 0.12));
}

.dark .image-fallback__icon {
  color: var(--us-text-tertiary, rgba(255, 255, 255, 0.3));
  opacity: 0.6;
}

.dark .image-fallback__retry:hover {
  box-shadow: var(--us-depth-2-hover), var(--us-accent-glow);
}

/* ===== Reduced Motion ===== */
@media (prefers-reduced-motion: reduce) {
  .image-skeleton {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
</style>