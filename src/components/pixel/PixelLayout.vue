<template>
  <div class="pixel-layout">
    <!-- 顶部边框 -->
    <div class="pixel-layout__top">
      <div class="pixel-layout__corner pixel-layout__corner--top-left"></div>
      <div class="pixel-layout__corner pixel-layout__corner--top-right"></div>
    </div>

    <!-- 主要内容区域 -->
    <div class="pixel-layout__main">
      <slot />
    </div>

    <!-- 底部边框 -->
    <div class="pixel-layout__bottom">
      <div class="pixel-layout__corner pixel-layout__corner--bottom-left"></div>
      <div class="pixel-layout__corner pixel-layout__corner--bottom-right"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'card' | 'panel'
}

withDefaults(defineProps<Props>(), {
  variant: 'default'
})
</script>

<style scoped>
.pixel-layout {
  @apply w-full;
  background: linear-gradient(135deg, #121212 0%, #1a1a1a 100%);
  border: 2px solid #00FFFF;
  position: relative;
  overflow: hidden;
  
  /* 边框装饰 */
  &::before {
    content: '';
    @apply absolute inset-0 pointer-events-none;
    background-image: 
      linear-gradient(90deg, transparent 50%, rgba(0, 255, 255, 0.1) 50%),
      linear-gradient(180deg, transparent 50%, rgba(0, 255, 255, 0.1) 50%);
    background-size: 20px 20px;
  }
  
  /* 像素边角 */
  .pixel-layout__corner {
    @apply absolute w-4 h-4;
    border: 2px solid #00FFFF;
    
    &.pixel-layout__corner--top-left {
      @apply top-0 left-0;
      border-right: none;
      border-bottom: none;
    }
    
    &.pixel-layout__corner--top-right {
      @apply top-0 right-0;
      border-left: none;
      border-bottom: none;
    }
    
    &.pixel-layout__corner--bottom-left {
      @apply bottom-0 left-0;
      border-right: none;
      border-top: none;
    }
    
    &.pixel-layout__corner--bottom-right {
      @apply bottom-0 right-0;
      border-left: none;
      border-top: none;
    }
  }
  
  /* 布局变体 */
  &.pixel-layout--card {
    @apply p-4;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 255, 255, 0.1);
  }
  
  &.pixel-layout--panel {
    @apply p-6;
    border-radius: 12px;
    box-shadow: 
      0 4px 12px rgba(0, 255, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
}

.pixel-layout__main {
  @apply relative z-10;
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .pixel-layout {
    @apply border-2;
  }
}

/* 减少运动支持 */
@media (prefers-reduced-motion: reduce) {
  .pixel-layout {
    transition: none;
  }
}
</style>