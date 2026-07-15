<script setup lang="ts">
/**
 * DetailSection — 详情页通用内容区section容器
 *
 * 职责：
 * - 统一section标题 + 分隔线 + slot内容
 * - 支持h2主标题和h3副标题
 * - BEM `ds` 前缀，新CSS变量体系，深色模式
 *
 * 设计灵感：
 * - Stripe: section标题左侧primary色竖线装饰
 * - Apple: section间留白韵律 3rem
 */

interface Props {
  /** section标题 */
  title?: string
  /** 标题级别 */
  level?: 2 | 3
  /** 是否显示底部分隔线 */
  divided?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '',
  level: 2,
  divided: true
})
</script>

<template>
  <section class="ds" :class="{ 'ds--divided': divided }">
    <h2 v-if="title && level === 2" class="ds__title">
      {{ title }}
    </h2>
    <h3 v-if="title && level === 3" class="ds__subtitle">
      {{ title }}
    </h3>
    <slot />
  </section>
</template>

<style scoped>
/* ===== Section容器 ===== */
.ds {
  margin-bottom: var(--us-space-8);
  padding-bottom: var(--us-space-8);
}

@media (min-width: 768px) {
  .ds {
    margin-bottom: var(--us-space-12);
    padding-bottom: var(--us-space-12);
  }
}

.ds--divided {
  border-bottom: 1px solid var(--us-border);
}

.ds:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

/* ===== 主标题 h2 ===== */
.ds__title {
  position: relative;
  margin: 0 0 var(--us-space-6);
  padding-left: var(--us-space-4);
  font-size: 1.25rem;
  font-weight: 600;
  line-height: var(--leading-snug);
  color: var(--us-text-primary);
  letter-spacing: -0.01em;
}

@media (min-width: 768px) {
  .ds__title {
    font-size: 1.5rem;
  }
}

/* 左侧primary色竖线装饰 */
.ds__title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.15em;
  width: 3px;
  height: 1.1em;
  background: var(--us-accent);
  border-radius: 2px;
}

/* ===== 副标题 h3 ===== */
.ds__subtitle {
  margin: 0 0 1rem;
  font-size: 1rem;
  font-weight: 600;
  line-height: var(--leading-snug);
  color: var(--us-text-primary);
}

@media (min-width: 768px) {
  .ds__subtitle {
    font-size: 1.125rem;
  }
}
</style>