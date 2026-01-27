<template>
  <section class="pixel-cta-section">
    <PixelLayout variant="card" class="pixel-cta-content">
      <div class="pixel-cta-text">
        <PixelHeading level="2" pixel-font class="pixel-cta-title">
          准备开始您的项目？
        </PixelHeading>
        <p class="pixel-cta-description">
          联系我，让我们一起打造卓越的用户体验和高性能的前端应用。
        </p>
      </div>
      <div class="pixel-cta-actions">
        <PixelButton variant="primary" size="large">
          立即联系
        </PixelButton>
        <PixelButton variant="outline" size="large">
          了解更多
        </PixelButton>
      </div>
    </PixelLayout>
  </section>
</template>

<script setup lang="ts">
import { PixelHeading, PixelLayout, PixelButton } from '@/components/pixel'
</script>

<style scoped>
.pixel-cta-section {
  @apply py-20 px-4;
  background: linear-gradient(135deg, #121212 0%, #1a1a1a 100%);
}

.pixel-cta-content {
  @apply max-w-4xl mx-auto;
}

.pixel-cta-text {
  @apply text-center mb-8;
}

.pixel-cta-title {
  @apply mb-4;
}

.pixel-cta-description {
  @apply text-lg text-pixel-gray mb-6 max-w-2xl mx-auto;
}

.pixel-cta-actions {
  @apply flex flex-col sm:flex-row gap-4 justify-center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .pixel-cta-content {
    padding: 2rem;
  }
  
  .pixel-cta-title {
    font-size: 2rem;
  }
}
</style>