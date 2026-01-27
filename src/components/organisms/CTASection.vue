<template>
  <section class="cta">
    <div class="cta__container">
      <div class="cta__content">
        <h2 class="cta__title">准备好开始您的项目了吗？</h2>
        <p class="cta__description">
          我随时准备与您合作，将您的想法转化为现实的数字产品。
          让我们一起创造令人惊叹的用户体验。
        </p>
        <div class="cta__actions">
          <router-link 
            to="/contact" 
            class="btn btn--primary btn--lg"
          >
            开始对话
          </router-link>
          <router-link 
            to="/projects" 
            class="btn btn--outline btn--lg"
          >
            查看作品
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// CTA Section 逻辑
</script>

<style scoped>
.cta {
  padding: var(--spacing-5xl) 0;
  background: linear-gradient(135deg, var(--color-primary-50), var(--color-primary-100));
  position: relative;
  overflow: hidden;
}

.cta__container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  position: relative;
  z-index: 1;
}

.cta__content {
  text-align: center;
  background: var(--color-surface-card);
  padding: var(--spacing-6xl) var(--spacing-4xl);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-lg);
}

.cta__title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-surface-text);
  margin-bottom: var(--spacing-lg);
}

.cta__description {
  font-size: var(--font-size-xl);
  line-height: var(--line-height-relaxed);
  color: var(--color-surface-text-secondary);
  margin-bottom: var(--spacing-3xl);
}

.cta__actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
}

.cta::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .cta {
    padding: var(--spacing-4xl) 0;
  }
  
  .cta__content {
    padding: var(--spacing-4xl) var(--spacing-3xl);
  }
  
  .cta__title {
    font-size: var(--font-size-3xl);
  }
  
  .cta__actions {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 640px) {
  .cta__content {
    padding: var(--spacing-3xl) var(--spacing-2xl);
  }
  
  .cta__title {
    font-size: var(--font-size-2xl);
  }
}
</style>