<script setup lang="ts">
/**
 * DetailLayout — 详情页通用布局容器
 *
 * 职责：
 * - 统一详情页 max-width 居中 + padding
 * - 提供 ReadingProgress 插槽
 * - 统一 loading / error / not-found 三种状态
 * - 单一亮色视觉模式
 *
 * 设计灵感：
 * - Stripe: 极简边框 + 微妙光影
 * - Apple: 大量留白 + 排版韵律
 * - Josh Comeau: 交互愉悦 + 微动画
 */

interface Props {
  /** 加载中状态 */
  loading?: boolean
  /** 错误信息 */
  error?: string | null
  /** 是否未找到 */
  notFound?: boolean
  /** 未找到提示文本 */
  notFoundText?: string
}

withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  notFound: false,
  notFoundText: '内容不存在'
})

const emit = defineEmits<{
  back: []
  retry: []
}>()
</script>

<template>
  <div class="dl">
    <!-- 阅读进度条插槽 -->
    <slot name="progress" />

    <!-- 加载状态 -->
    <div v-if="loading" class="dl__loading">
      <div class="dl__skeleton-cover" />
      <div class="dl__skeleton-body">
        <div class="dl__skeleton-title" />
        <div class="dl__skeleton-line" />
        <div class="dl__skeleton-line dl__skeleton-line--short" />
        <div class="dl__skeleton-block" />
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="dl__state">
      <div class="dl__state-icon">
        <svg
width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
          stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <p class="dl__state-text">{{ error }}</p>
      <button class="dl__state-btn" @click="emit('retry')">
        重试
      </button>
    </div>

    <!-- 未找到状态 -->
    <div v-else-if="notFound" class="dl__state">
      <div class="dl__state-icon">
        <svg
width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
          stroke-linecap="round" stroke-linejoin="round">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
          <polyline points="13 2 13 9 20 9" />
        </svg>
      </div>
      <p class="dl__state-text">{{ notFoundText }}</p>
      <button class="dl__state-btn" @click="emit('back')">
        返回列表
      </button>
    </div>

    <!-- 正常内容 -->
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<style scoped>
/* ===== 根容器 ===== */
.dl {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--us-space-6) var(--us-space-4) var(--us-space-12);
}

@media (min-width: 768px) {
  .dl {
    padding: var(--us-space-8) var(--us-space-6) var(--us-space-16);
  }
}

/* ===== 加载骨架屏 ===== */
.dl__loading {
  padding: var(--us-space-8) 0;
}

.dl__skeleton-cover {
  width: 100%;
  height: 200px;
  background: var(--us-surface-hover);
  border-radius: var(--radius-lg, 0.75rem);
  margin-bottom: var(--us-space-10);
  opacity: 0.6;
}

@media (min-width: 768px) {
  .dl__skeleton-cover {
    height: 360px;
    border-radius: var(--radius-xl, 1rem);
  }
}

.dl__skeleton-body {
  max-width: 720px;
  margin: 0 auto;
}

.dl__skeleton-title {
  width: 65%;
  height: 2.5rem;
  background: var(--us-surface-hover);
  border-radius: var(--radius-md, 0.375rem);
  margin-bottom: var(--us-space-5);
  opacity: 0.6;
}

.dl__skeleton-line {
  width: 100%;
  height: 1rem;
  background: var(--us-surface-hover);
  border-radius: var(--radius-md, 0.375rem);
  margin-bottom: var(--us-space-3);
  opacity: 0.6;
}

.dl__skeleton-line--short {
  width: 45%;
}

.dl__skeleton-block {
  width: 100%;
  height: 200px;
  background: var(--us-surface-hover);
  border-radius: var(--radius-lg, 0.75rem);
  margin-top: var(--us-space-8);
  opacity: 0.6;
}

/* ===== 空态/错误状态 ===== */
.dl__state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--us-space-24) var(--us-space-8);
  text-align: center;
}

.dl__state-icon {
  color: var(--us-text-tertiary);
  margin-bottom: var(--us-space-6);
}

.dl__state-text {
  font-size: 1.0625rem;
  color: var(--us-text-secondary);
  margin: 0 0 var(--us-space-8);
  line-height: var(--leading-relaxed);
}

.dl__state-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--us-space-2);
  padding: var(--us-space-3) var(--us-space-6);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--us-accent);
  background: var(--us-accent-subtle);
  border: 1px solid var(--us-accent-border);
  border-radius: var(--radius-lg, 0.75rem);
  box-shadow: var(--us-depth-1);
  transition: transform, box-shadow, color, background-color, border-color, opacity var(--us-duration-fast) var(--us-easing);
}

.dl__state-btn:hover {
  background: var(--us-accent-border);
  border-color: var(--us-accent);
  transform: translateY(-1px);
  box-shadow: var(--us-depth-2-hover);
}

.dl__state-btn:active {
  transform: scale(0.95);
  box-shadow: var(--us-depth-1);
}

.dl__state-btn:focus-visible {
  outline: 2px solid var(--us-accent);
  outline-offset: 2px;
}
</style>
