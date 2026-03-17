<template>
  <div class="pixel-divider" :class="`pixel-divider--${variant}`">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'dashed' | 'dotted'
}

withDefaults(defineProps<Props>(), {
  variant: 'default'
})
</script>

<style scoped>
.pixel-divider {
  @apply w-full h-px bg-pixel-cyan;
  margin: 1rem 0;
  
  /* 分隔线样式 */
  &.pixel-divider--dashed {
    @apply border-t-2 border-dashed border-pixel-cyan;
  }
  
  &.pixel-divider--dotted {
    @apply border-t-2 border-dotted border-pixel-cyan;
  }
  
  /* 带内容的分隔线 */
  & > * {
    @apply absolute left-1/2 transform -translate-x-1/2 bg-pixel-dark px-4 text-pixel-cyan;
  }
}
</style>