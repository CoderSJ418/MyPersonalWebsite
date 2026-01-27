<template>
  <Transition name="toast">
    <div
      v-if="isVisible"
      class="toast"
      :class="[
        `toast--${variant}`,
        { 'toast--dismissible': dismissible }
      ]"
      :aria-live="variant === 'error' ? 'assertive' : 'polite'"
      :aria-atomic="true"
    >
      <div class="toast__content">
        <div class="toast__icon">
          <component :is="icon" />
        </div>
        <div class="toast__message">
          <h3 v-if="title" class="toast__title">{{ title }}</h3>
          <p class="toast__text">{{ message }}</p>
        </div>
      </div>
      
      <button
        v-if="dismissible"
        class="toast__close"
        @click="handleClose"
        :aria-label="closeLabel"
      >
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { defineProps, defineEmits } from 'vue'
import CheckCircleIcon from './icons/CheckCircleIcon.vue'
import InfoIcon from './icons/InfoIcon.vue'
import WarningIcon from './icons/WarningIcon.vue'
import ErrorIcon from './icons/ErrorIcon.vue'

interface Props {
  variant?: 'success' | 'info' | 'warning' | 'error'
  title?: string
  message: string
  dismissible?: boolean
  duration?: number
  closeLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info',
  dismissible: true,
  duration: 5000,
  closeLabel: '关闭'
})

const emit = defineEmits<{
  close: []
}>()

const isVisible = ref(false)
let timer: ReturnType<typeof setTimeout>

const icon = computed(() => {
  const icons = {
    success: CheckCircleIcon,
    info: InfoIcon,
    warning: WarningIcon,
    error: ErrorIcon
  }
  return icons[props.variant]
})

const handleClose = () => {
  emit('close')
  hide()
}

const show = () => {
  isVisible.value = true
}

const hide = () => {
  isVisible.value = false
}

const autoHide = () => {
  if (props.duration > 0 && props.dismissible) {
    timer = setTimeout(() => {
      hide()
    }, props.duration)
  }
}

onMounted(() => {
  show()
  autoHide()
})

onUnmounted(() => {
  clearTimeout(timer)
})

// 监听可见性变化
watch(isVisible, (newVal) => {
  if (!newVal) {
    emit('close')
  }
})
</script>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: var(--color-surface-card);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-4);
  min-width: 300px;
  max-width: 400px;
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  z-index: var(--z-notification);
  animation: slideInRight var(--transition-normal) ease-out;
}

.toast--success {
  border-color: var(--color-success);
  background: var(--color-success-50);
}

.toast--info {
  border-color: var(--color-info);
  background: var(--color-info-50);
}

.toast--warning {
  border-color: var(--color-warning);
  background: var(--color-warning-50);
}

.toast--error {
  border-color: var(--color-error);
  background: var(--color-error-50);
}

.toast__content {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
}

.toast__icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast__title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-surface-text);
  margin-bottom: var(--spacing-1);
}

.toast__text {
  font-size: var(--font-size-sm);
  color: var(--color-surface-text-secondary);
  line-height: var(--line-height-normal);
}

.toast__close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: var(--color-surface-text-tertiary);
  cursor: pointer;
  padding: var(--spacing-1);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.toast__close:hover {
  background: var(--color-surface-bg-secondary);
  color: var(--color-surface-text);
}

.toast__close:active {
  background: var(--color-surface-bg-tertiary);
}

/* 过渡动画 */
.toast-enter-active,
.toast-leave-active {
  transition: all var(--transition-normal);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .toast {
    top: 10px;
    right: 10px;
    left: 10px;
    min-width: auto;
    max-width: none;
  }
}
</style>