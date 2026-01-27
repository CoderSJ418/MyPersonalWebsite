<template>
  <Transition name="error-message">
    <div
      v-if="show"
      ref="errorRef"
      class="error-message"
      role="alert"
      aria-live="assertive"
    >
      <!-- 图标 -->
      <div class="error-message__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      
      <!-- 消息内容 -->
      <div class="error-message__content">
        <span v-if="title" class="error-message__title">{{ title }}</span>
        <p class="error-message__text">{{ message }}</p>
      </div>
      
      <!-- 关闭按钮 -->
      <button
        v-if="dismissible"
        type="button"
        class="error-message__close"
        :aria-label="closeLabel"
        @click="dismiss"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  /**
   * 错误消息
   */
  message: string
  
  /**
   * 错误标题（可选）
   */
  title?: string
  
  /**
   * 是否可关闭
   */
  dismissible?: boolean
  
  /**
   * 自动消失时间（毫秒），0 表示不自动消失
   */
  autoDismiss?: number
  
  /**
   * 类型
   */
  type?: 'error' | 'warning' | 'info' | 'success'
  
  /**
   * 关闭按钮标签
   */
  closeLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  dismissible: true,
  autoDismiss: 5000,
  type: 'error',
  closeLabel: '关闭',
})

const emit = defineEmits<{
  dismiss: []
}>()

const show = ref(true)
const errorRef = ref<HTMLElement | null>(null)
let dismissTimer: number | null = null

/**
 * 关闭错误消息
 */
function dismiss(): void {
  show.value = false
  emit('dismiss')
}

/**
 * 清除自动消失定时器
 */
function clearAutoDismiss(): void {
  if (dismissTimer !== null) {
    clearTimeout(dismissTimer)
    dismissTimer = null
  }
}

/**
 * 设置自动消失
 */
function setupAutoDismiss(): void {
  clearAutoDismiss()
  
  if (props.autoDismiss > 0) {
    dismissTimer = window.setTimeout(() => {
      dismiss()
    }, props.autoDismiss)
  }
}

// 监听 message 变化
watch(
  () => props.message,
  (newMessage) => {
    if (newMessage) {
      show.value = true
      setupAutoDismiss()
    } else {
      show.value = false
    }
  }
)

// 组件挂载时设置自动消失
onMounted(() => {
  if (props.message) {
    setupAutoDismiss()
  }
})

// 组件卸载时清除定时器
onUnmounted(() => {
  clearAutoDismiss()
})

// 暴露方法
defineExpose({
  dismiss,
})
</script>

<style scoped>
.error-message {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-lg);
  background: var(--error-50);
  border: 1px solid var(--error-200);
  box-shadow: var(--shadow-sm);
  position: relative;
}

/* 图标 */
.error-message__icon {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  color: var(--error-500);
}

.error-message__icon svg {
  width: 100%;
  height: 100%;
}

/* 内容 */
.error-message__content {
  flex: 1;
  min-width: 0;
}

.error-message__title {
  display: block;
  font-weight: 600;
  color: var(--error-700);
  font-size: 0.9375rem;
  margin-bottom: 0.25rem;
}

.error-message__text {
  margin: 0;
  color: var(--error-600);
  font-size: 0.875rem;
  line-height: 1.5;
}

/* 关闭按钮 */
.error-message__close {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--error-500);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.error-message__close:hover {
  background: var(--error-100);
  color: var(--error-600);
}

.error-message__close:focus-visible {
  outline: 2px solid var(--error-500);
  outline-offset: 2px;
}

.error-message__close svg {
  width: 1rem;
  height: 1rem;
}

/* 类型变体 */
.error-message--warning {
  background: var(--warning-50);
  border-color: var(--warning-200);
}

.error-message--warning .error-message__icon {
  color: var(--warning-500);
}

.error-message--warning .error-message__title {
  color: var(--warning-700);
}

.error-message--warning .error-message__text {
  color: var(--warning-600);
}

.error-message--warning .error-message__close {
  color: var(--warning-500);
}

.error-message--warning .error-message__close:hover {
  background: var(--warning-100);
  color: var(--warning-600);
}

.error-message--info {
  background: var(--info-50);
  border-color: var(--info-200);
}

.error-message--info .error-message__icon {
  color: var(--info-500);
}

.error-message--info .error-message__title {
  color: var(--info-700);
}

.error-message--info .error-message__text {
  color: var(--info-600);
}

.error-message--info .error-message__close {
  color: var(--info-500);
}

.error-message--info .error-message__close:hover {
  background: var(--info-100);
  color: var(--info-600);
}

.error-message--success {
  background: var(--success-50);
  border-color: var(--success-200);
}

.error-message--success .error-message__icon {
  color: var(--success-500);
}

.error-message--success .error-message__title {
  color: var(--success-700);
}

.error-message--success .error-message__text {
  color: var(--success-600);
}

.error-message--success .error-message__close {
  color: var(--success-500);
}

.error-message--success .error-message__close:hover {
  background: var(--success-100);
  color: var(--success-600);
}

/* 暗黑模式 */
@media (prefers-color-scheme: dark) {
  .error-message {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.2);
  }
  
  .error-message__icon {
    color: var(--error-400);
  }
  
  .error-message__title {
    color: var(--error-300);
  }
  
  .error-message__text {
    color: var(--error-400);
  }
  
  .error-message__close {
    color: var(--error-400);
  }
  
  .error-message__close:hover {
    background: rgba(239, 68, 68, 0.15);
  }
  
  .error-message--warning {
    background: rgba(245, 158, 11, 0.1);
    border-color: rgba(245, 158, 11, 0.2);
  }
  
  .error-message--warning .error-message__icon {
    color: var(--warning-400);
  }
  
  .error-message--warning .error-message__title {
    color: var(--warning-300);
  }
  
  .error-message--warning .error-message__text {
    color: var(--warning-400);
  }
  
  .error-message--warning .error-message__close {
    color: var(--warning-400);
  }
  
  .error-message--warning .error-message__close:hover {
    background: rgba(245, 158, 11, 0.15);
  }
  
  .error-message--info {
    background: rgba(59, 130, 246, 0.1);
    border-color: rgba(59, 130, 246, 0.2);
  }
  
  .error-message--info .error-message__icon {
    color: var(--info-400);
  }
  
  .error-message--info .error-message__title {
    color: var(--info-300);
  }
  
  .error-message--info .error-message__text {
    color: var(--info-400);
  }
  
  .error-message--info .error-message__close {
    color: var(--info-400);
  }
  
  .error-message--info .error-message__close:hover {
    background: rgba(59, 130, 246, 0.15);
  }
  
  .error-message--success {
    background: rgba(16, 185, 129, 0.1);
    border-color: rgba(16, 185, 129, 0.2);
  }
  
  .error-message--success .error-message__icon {
    color: var(--success-400);
  }
  
  .error-message--success .error-message__title {
    color: var(--success-300);
  }
  
  .error-message--success .error-message__text {
    color: var(--success-400);
  }
  
  .error-message--success .error-message__close {
    color: var(--success-400);
  }
  
  .error-message--success .error-message__close:hover {
    background: rgba(16, 185, 129, 0.15);
  }
}

/* 响应式优化 */
@media (max-width: 768px) {
  .error-message {
    padding: 0.875rem 1rem;
  }
  
  .error-message__icon {
    width: 1.125rem;
    height: 1.125rem;
  }
  
  .error-message__title {
    font-size: 0.875rem;
  }
  
  .error-message__text {
    font-size: 0.8125rem;
  }
  
  .error-message__close {
    width: 1.25rem;
    height: 1.25rem;
  }
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .error-message__close,
  .error-message__close:hover,
  .error-message__close:focus-visible {
    transition-duration: 0.01ms !important;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: more) {
  .error-message {
    border-width: 2px;
  }
}

/* 过渡动画 */
.error-message-enter-active,
.error-message-leave-active {
  transition: all 0.3s ease;
}

.error-message-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.error-message-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>