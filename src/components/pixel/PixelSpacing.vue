<template>
  <div class="pixel-spacing" :class="`pixel-spacing--${size}`">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

withDefaults(defineProps<Props>(), {
  size: 'md'
})
</script>

<style scoped>
.pixel-spacing {
  @apply w-full;
  
  /* 间距大小 */
  &.pixel-spacing--xs {
    @apply h-2;
  }
  
  &.pixel-spacing--sm {
    @apply h-4;
  }
  
  &.pixel-spacing--md {
    @apply h-6;
  }
  
  &.pixel-spacing--lg {
    @apply h-8;
  }
  
  &.pixel-spacing--xl {
    @apply h-12;
  }
  
  &.pixel-spacing--2xl {
    @apply h-16;
  }
}

/* 像素风格的间距 */
.pixel-spacing {
  /* 检查点间距 */
  &::before {
    content: '';
    @apply block w-full h-px bg-pixel-cyan;
  }
  
  /* 响应式间距 */
  @media (max-width: 768px) {
    &.pixel-spacing--lg {
      @apply h-6;
    }
    
    &.pixel-spacing--xl {
      @apply h-8;
    }
    
    &.pixel-spacing--2xl {
      @apply h-12;
    }
  }
  
  @media (max-width: 480px) {
    &.pixel-spacing--md {
      @apply h-3;
    }
    
    &.pixel-spacing--lg {
      @apply h-4;
    }
    
    &.pixel-spacing--xl {
      @apply h-6;
    }
    
    &.pixel-spacing--2xl {
      @apply h-8;
    }
  }
}
</style>