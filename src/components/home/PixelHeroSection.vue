<template>
  <section class="pixel-hero-section">
    <!-- 像素背景装饰 -->
    <div class="pixel-hero-background">
      <div class="pixel-grid-pattern"></div>
      <div class="pixel-pixel-effect"></div>
    </div>

    <!-- 主内容 -->
    <div class="pixel-hero-content">
      <!-- 像素时间线 -->
      <div class="pixel-timeline">
        <div class="pixel-timeline-line"></div>
        <PixelHeading level="4" pixel-font>7年沉淀 · 从入门到架构</PixelHeading>
      </div>

      <!-- 像素标题 -->
      <PixelHeading level="1" pixel-font class="pixel-hero-title">
        佘杰
      </PixelHeading>

      <!-- 像素副标题 -->
      <PixelHeading level="3" class="pixel-hero-subtitle">
        Vue 专家 · 7年开发经验 · 技术架构师
      </PixelHeading>

      <!-- 像素描述 -->
      <p class="pixel-hero-description">
        专注于构建高性能、可维护的前端应用，擅长 Vue 生态系统和现代前端技术栈。
      </p>

      <!-- 像素统计 -->
      <div class="pixel-stats">
        <PixelCard variant="outline" class="pixel-stat-card">
          <div class="pixel-stat-value">7+</div>
          <div class="pixel-stat-label">年开发经验</div>
        </PixelCard>
        <PixelCard variant="outline" class="pixel-stat-card">
          <div class="pixel-stat-value">20+</div>
          <div class="pixel-stat-label">项目交付</div>
        </PixelCard>
        <PixelCard variant="outline" class="pixel-stat-card">
          <div class="pixel-stat-value">5</div>
          <div class="pixel-stat-label">人团队带领</div>
        </PixelCard>
      </div>

      <!-- 像素CTA按钮 -->
      <div class="pixel-cta-buttons">
        <RouterLink to="/projects" class="pixel-cta-button">
          <PixelButton variant="primary" size="large">
            查看项目
          </PixelButton>
        </RouterLink>
        <RouterLink to="/pixel-demo" class="pixel-cta-button">
          <PixelButton variant="outline" size="large">
            像素演示
          </PixelButton>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { PixelHeading, PixelButton, PixelCard } from '@/components/pixel'
</script>

<style scoped>
.pixel-hero-section {
  @apply min-h-screen flex items-center relative overflow-hidden;
  background: linear-gradient(135deg, #121212 0%, #1a1a1a 100%);
  position: relative;
}

.pixel-hero-background {
  @apply absolute inset-0;
}

.pixel-grid-pattern {
  @apply absolute inset-0 opacity-10;
  background-image: 
    linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

.pixel-pixel-effect {
  @apply absolute inset-0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 0, 255, 0.1) 0%, transparent 50%);
}

.pixel-hero-content {
  @apply container mx-auto px-4 py-16 md:py-20 relative z-10;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
}

.pixel-timeline {
  @apply flex items-center gap-4 mb-8;
}

.pixel-timeline-line {
  @apply w-16 h-0.5 bg-pixel-cyan;
}

.pixel-hero-title {
  @apply text-6xl md:text-7xl lg:text-8xl mb-6 leading-none;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.pixel-hero-subtitle {
  @apply text-2xl md:text-3xl font-semibold mb-6;
  color: #F8F8F8;
}

.pixel-hero-description {
  @apply text-lg md:text-xl mb-8 leading-relaxed max-w-2xl;
  color: #E2E8F0;
}

.pixel-stats {
  @apply flex flex-wrap gap-6 mb-8;
}

.pixel-stat-card {
  @apply min-w-[120px];
}

.pixel-stat-value {
  @apply text-3xl font-bold mb-1 text-pixel-cyan;
}

.pixel-stat-label {
  @apply text-xs font-medium text-pixel-gray;
}

.pixel-cta-buttons {
  @apply flex flex-col sm:flex-row gap-4;
}

.pixel-cta-button {
  @apply inline-block;
}

/* 响应式设计 */
@media (min-width: 1024px) {
  .pixel-hero-content {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }
  
  .pixel-hero-title {
    font-size: 8rem;
  }
}

@media (max-width: 768px) {
  .pixel-hero-title {
    font-size: 4rem;
  }
  
  .pixel-hero-subtitle {
    font-size: 1.5rem;
  }
  
  .pixel-stats {
    gap: 2rem;
  }
}
</style>