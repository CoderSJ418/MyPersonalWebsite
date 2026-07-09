<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { AlertTriangle, RefreshCw } from 'lucide-vue-next'

interface Props {
  fallbackTitle?: string
  fallbackMessage?: string
  showRetry?: boolean
}

withDefaults(defineProps<Props>(), {
  fallbackTitle: '页面加载出错',
  fallbackMessage: '抱歉，页面加载时发生了错误，请稍后重试。',
  showRetry: true
})

const emit = defineEmits<{
  retry: []
}>()

const hasError = ref(false)
const errorMessage = ref('')

onErrorCaptured((err) => {
  hasError.value = true
  errorMessage.value = err.message
  return false // 阻止错误继续向上传播
})

const handleRetry = () => {
  hasError.value = false
  errorMessage.value = ''
  emit('retry')
}
</script>

<template>
  <slot v-if="!hasError" />
  <div v-else class="error-boundary">
    <div class="error-boundary__content">
      <AlertTriangle :size="48" class="error-boundary__icon" />
      <h3 class="error-boundary__title">{{ fallbackTitle }}</h3>
      <p class="error-boundary__message">
        {{ errorMessage || fallbackMessage }}
      </p>
      <button v-if="showRetry" type="button" class="error-boundary__retry" @click="handleRetry">
        <RefreshCw :size="16" />
        <span>重试</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: var(--us-space-8);
}

.error-boundary__content {
  text-align: center;
  max-width: 400px;
}

.error-boundary__icon {
  margin: 0 auto var(--us-space-4);
  color: #ef4444;
}

.error-boundary__title {
  margin: 0 0 var(--us-space-2);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--us-text-primary);
}

.error-boundary__message {
  margin: 0 0 var(--us-space-6);
  font-size: 0.9375rem;
  color: var(--us-text-secondary);
  line-height: var(--leading-normal);
}

.error-boundary__retry {
  display: inline-flex;
  align-items: center;
  gap: var(--us-space-2);
  padding: var(--us-space-2) var(--us-space-6);
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-on-accent);
  background: var(--us-accent);
  border: none;
  border-radius: var(--radius-xl, 1rem);
  box-shadow: var(--us-depth-1);
  transition: transform, box-shadow, opacity var(--us-duration-fast) var(--us-easing);
}

.error-boundary__retry:hover {
  background: var(--us-accent-dark);
  transform: translateY(-1px);
  box-shadow: var(--us-depth-2-hover);
}

.error-boundary__retry:active {
  transform: scale(0.95);
  box-shadow: var(--us-depth-1);
}
</style>