<template>
  <div class="pixel-grid" :class="`pixel-grid--${variant}`">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'columns' | 'rows' | 'cards'
  columns?: number
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  columns: 3,
  rows: 1
})
</script>

<style scoped>
.pixel-grid {
  @apply w-full;
  
  /* 默认网格 */
  &.pixel-grid--default {
    @apply grid gap-4;
  }
  
  /* 列网格 */
  &.pixel-grid--columns {
    @apply grid;
    grid-template-columns: repeat(var(--columns, 3), 1fr);
    gap: 1rem;
  }
  
  /* 行网格 */
  &.pixel-grid--rows {
    @apply grid;
    grid-template-rows: repeat(var(--rows, 1), 1fr);
    gap: 1rem;
  }
  
  /* 卡片网格 */
  &.pixel-grid--cards {
    @apply grid gap-6;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
  
  /* 响应式列数 */
  @media (max-width: 768px) {
    &.pixel-grid--columns {
      grid-template-columns: repeat(var(--columns-sm, 2), 1fr);
    }
  }
  
  @media (max-width: 480px) {
    &.pixel-grid--columns {
      grid-template-columns: 1fr;
    }
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .pixel-grid {
    @apply border-2;
  }
}

/* 减少运动支持 */
@media (prefers-reduced-motion: reduce) {
  .pixel-grid {
    transition: none;
  }
}
</style>