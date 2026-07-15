<script setup lang="ts">
/**
 * RouteSkeleton — 路由级骨架屏占位组件
 *
 * 职责：在 Suspense fallback 期间提供页面结构占位
 * - 模拟页面结构：header区域 + content区域
 * - CSS pulse 动画
 * - 支持暗色模式
 * - 高度 100dvh，居中显示
 */
</script>

<template>
  <div class="route-skeleton" aria-hidden="true">
    <!-- Header 骨架 -->
    <div class="rs-header">
      <div class="rs-header__logo" />
      <div class="rs-header__nav">
        <div class="rs-header__nav-item" />
        <div class="rs-header__nav-item" />
        <div class="rs-header__nav-item" />
        <div class="rs-header__nav-item" />
      </div>
    </div>

    <!-- Content 骨架 -->
    <div class="rs-content">
      <div class="rs-content__hero">
        <div class="rs-content__hero-title" />
        <div class="rs-content__hero-subtitle" />
        <div class="rs-content__hero-line" />
      </div>
      <div class="rs-content__cards">
        <div class="rs-content__card" />
        <div class="rs-content__card" />
        <div class="rs-content__card" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.route-skeleton {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: 0 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  opacity: 0.6;
}

/* ===== Header 骨架 ===== */
.rs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--us-space-4) 0;
  border-bottom: 1px solid var(--us-border, rgba(0, 0, 0, 0.06));
}

.rs-header__logo {
  width: 120px;
  height: 28px;
  border-radius: var(--radius-md);
  background: var(--us-surface-hover, #f0f0f0);
  animation: rs-pulse 1.5s ease-in-out infinite;
}

.rs-header__nav {
  display: flex;
  gap: var(--us-space-6);
}

.rs-header__nav-item {
  width: 60px;
  height: 16px;
  border-radius: var(--radius-sm);
  background: var(--us-surface-hover, #f0f0f0);
  animation: rs-pulse 1.5s ease-in-out infinite;
}

.rs-header__nav-item:nth-child(2) {
  animation-delay: 0.1s;
}

.rs-header__nav-item:nth-child(3) {
  animation-delay: 0.2s;
}

.rs-header__nav-item:nth-child(4) {
  animation-delay: 0.3s;
}

/* ===== Content 骨架 ===== */
.rs-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--us-space-10);
  padding-top: var(--us-space-12);
}

.rs-content__hero {
  display: flex;
  flex-direction: column;
  gap: var(--us-space-4);
  align-items: center;
}

.rs-content__hero-title {
  width: 60%;
  height: 40px;
  border-radius: var(--radius-lg);
  background: var(--us-surface-hover, #f0f0f0);
  animation: rs-pulse 1.5s ease-in-out infinite;
}

.rs-content__hero-subtitle {
  width: 40%;
  height: 20px;
  border-radius: var(--radius-md);
  background: var(--us-surface-hover, #f0f0f0);
  animation: rs-pulse 1.5s ease-in-out infinite;
  animation-delay: 0.15s;
}

.rs-content__hero-line {
  width: 25%;
  height: 14px;
  border-radius: var(--radius-sm);
  background: var(--us-surface-hover, #f0f0f0);
  animation: rs-pulse 1.5s ease-in-out infinite;
  animation-delay: 0.3s;
}

.rs-content__cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--us-space-6);
}

.rs-content__card {
  aspect-ratio: 16 / 9;
  border-radius: var(--us-card-radius, 12px);
  background: var(--us-surface-hover, #f0f0f0);
  animation: rs-pulse 1.5s ease-in-out infinite;
}

.rs-content__card:nth-child(2) {
  animation-delay: 0.15s;
}

.rs-content__card:nth-child(3) {
  animation-delay: 0.3s;
}

/* ===== Pulse 动画 ===== */
@keyframes rs-pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .rs-content__cards {
    grid-template-columns: 1fr;
  }

  .rs-content__hero-title {
    width: 80%;
  }

  .rs-content__hero-subtitle {
    width: 60%;
  }

  .rs-header__nav {
    display: none;
  }
}

/* ===== Reduced Motion ===== */
@media (prefers-reduced-motion: reduce) {
  .route-skeleton * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
</style>
