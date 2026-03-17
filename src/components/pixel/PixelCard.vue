<template>
  <div class="pixel-card" :class="`pixel-card--${variant}`">
    <!-- 卡片头部 -->
    <div v-if="$slots.header" class="pixel-card__header">
      <slot name="header">
        <h3 class="pixel-card__title">{{ title }}</h3>
      </slot>
    </div>

    <!-- 卡片内容 -->
    <div class="pixel-card__content">
      <slot />
    </div>

    <!-- 卡片底部 -->
    <div v-if="$slots.footer" class="pixel-card__footer">
      <slot name="footer" />
    </div>

    <!-- 装饰元素 -->
    <div class="pixel-card__decoration">
      <div class="pixel-card__corner pixel-card__corner--top-left"></div>
      <div class="pixel-card__corner pixel-card__corner--top-right"></div>
      <div class="pixel-card__corner pixel-card__corner--bottom-left"></div>
      <div class="pixel-card__corner pixel-card__corner--bottom-right"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'outline' | 'filled' | 'gradient'
  title?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  title: ''
})
</script>

<style scoped>
.pixel-card {
  @apply relative w-full bg-pixel-dark border-2 border-pixel-cyan overflow-hidden;
  position: relative;
  transition: all 0.3s ease;
  font-family: 'JetBrains Mono', monospace;
  
  /* 卡片变体 */
  &.pixel-card--outline {
    @apply bg-transparent;
  }
  
  &.pixel-card--filled {
    @apply bg-pixel-cyan bg-opacity-10;
  }
  
  &.pixel-card--gradient {
    background: linear-gradient(135deg, #121212 0%, #1a1a1a 100%);
    border: 2px solid transparent;
    background-clip: padding-box;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      background: linear-gradient(135deg, #00FFFF 0%, #FF00FF 100%);
      border-radius: inherit;
      opacity: 0.1;
    }
  }
  
  /* 卡片头部 */
  .pixel-card__header {
    @apply px-6 py-4 border-b-2 border-pixel-cyan;
  }
  
  .pixel-card__title {
    @apply text-lg font-bold text-pixel-cyan;
    font-family: 'Press Start 2P', cursive;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  /* 卡片内容 */
  .pixel-card__content {
    @apply px-6 py-4;
  }
  
  /* 卡片底部 */
  .pixel-card__footer {
    @apply px-6 py-4 border-t-2 border-pixel-cyan bg-pixel-cyan bg-opacity-5;
  }
  
  /* 装饰元素 */
  .pixel-card__decoration {
    @apply absolute inset-0 pointer-events-none;
  }
  
  .pixel-card__corner {
    @apply absolute w-4 h-4;
    border: 2px solid #00FFFF;
    
    &.pixel-card__corner--top-left {
      @apply top-0 left-0;
      border-right: none;
      border-bottom: none;
    }
    
    &.pixel-card__corner--top-right {
      @apply top-0 right-0;
      border-left: none;
      border-bottom: none;
    }
    
    &.pixel-card__corner--bottom-left {
      @apply bottom-0 left-0;
      border-right: none;
      border-top: none;
    }
    
    &.pixel-card__corner--bottom-right {
      @apply bottom-0 right-0;
      border-left: none;
      border-top: none;
    }
  }
  
  /* 悬停效果 */
  &:hover {
    @apply transform scale-105;
    box-shadow: 0 8px 24px rgba(0, 255, 255, 0.2);
  }
  
  /* 点击效果 */
  &:active {
    @apply transform scale-95;
  }
  
  /* 响应式设计 */
  @media (max-width: 768px) {
    .pixel-card__header {
      @apply px-4 py-3;
    }
    
    .pixel-card__content {
      @apply px-4 py-3;
    }
    
    .pixel-card__footer {
      @apply px-4 py-3;
    }
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .pixel-card {
    @apply border-2;
  }
}

/* 减少运动支持 */
@media (prefers-reduced-motion: reduce) {
  .pixel-card {
    transition: none;
  }
}
</style>