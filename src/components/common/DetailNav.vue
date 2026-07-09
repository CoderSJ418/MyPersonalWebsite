<script setup lang="ts">
/**
 * DetailNav — 详情页顶部导航组件
 *
 * 职责：
 * - 统一返回按钮样式（BlogDetail/ProjectDetail 共用）
 * - 提供右侧操作区插槽（分享按钮等）
 * - BEM `dn` 前缀，新CSS变量体系，深色模式
 *
 * 设计灵感：
 * - Stripe: 微妙边框 + hover渐变光晕
 * - Josh Comeau: translateX(-2px)返回微动画 + focus-visible
 */

import { ArrowLeft } from 'lucide-vue-next'

interface Props {
  /** 返回按钮文本 */
  backLabel?: string
  /** aria-label */
  backAriaLabel?: string
}

withDefaults(defineProps<Props>(), {
  backLabel: '返回',
  backAriaLabel: '返回列表'
})

const emit = defineEmits<{
  back: []
}>()
</script>

<template>
  <nav class="dn" aria-label="详情页导航">
    <button class="dn__back" :aria-label="backAriaLabel" @click="emit('back')">
      <ArrowLeft :size="18" />
      <span>{{ backLabel }}</span>
    </button>

    <!-- 右侧操作区插槽 -->
    <div class="dn__actions">
      <slot name="actions" />
    </div>
  </nav>
</template>

<style scoped>
/* ===== 导航栏 ===== */
.dn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--us-space-6);
}

@media (min-width: 640px) {
  .dn {
    margin-bottom: var(--us-space-10);
  }
}

/* ===== 返回按钮 ===== */
.dn__back {
  display: inline-flex;
  align-items: center;
  gap: var(--us-space-2);
  padding: var(--us-space-2) var(--us-space-3);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--us-text-secondary);
  background: var(--us-surface-hover);
  border: 1px solid var(--us-border);
  border-radius: var(--radius-lg, 0.75rem);
  box-shadow: var(--us-depth-1);
  transition: transform, box-shadow, color, background-color, border-color, opacity var(--us-duration-fast) var(--us-easing);
}

@media (min-width: 640px) {
  .dn__back {
    padding: var(--us-space-2) var(--us-space-4);
    font-size: 0.875rem;
  }
}

.dn__back:hover {
  color: var(--us-text-primary);
  border-color: var(--us-accent);
  transform: translateX(-2px) translateY(-1px);
  box-shadow: var(--us-depth-2-hover);
}

.dn__back:active {
  transform: scale(0.95);
  box-shadow: var(--us-depth-1);
}

.dn__back:focus-visible {
  outline: 2px solid var(--us-accent);
  outline-offset: 2px;
}

/* ===== 右侧操作区 ===== */
.dn__actions {
  display: flex;
  align-items: center;
  gap: var(--us-space-2);
}
</style>