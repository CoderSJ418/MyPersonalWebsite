<template>
  <div class="not-found">
    <SEOHead title="404" description="页面未找到" />
    <div class="not-found__content">
      <h1 class="not-found__code">404</h1>
      <p class="not-found__message">页面未找到</p>
      <RouterLink to="/" class="not-found__link">
        返回首页
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import SEOHead from '@/components/common/SEOHead.vue'
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  /* fallback for older browsers */
  min-height: 100dvh;
  /* dynamic viewport height for mobile */
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 4rem;
  background: var(--us-bg-start);
}

.not-found__content {
  text-align: center;
}

.not-found__code {
  font-size: 8rem;
  font-weight: 600;
  line-height: var(--leading-none);
  margin-bottom: 1rem;
  color: var(--us-accent);
}

.not-found__message {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: var(--us-text-secondary);
}

.not-found__link {
  display: inline-block;
  padding: var(--us-space-4) var(--us-space-8);
  border-radius: var(--radius-lg);
  background: var(--us-accent);
  color: var(--us-text-primary);
  font-weight: 600;
  text-decoration: none;
  transition: opacity var(--us-duration-normal, 0.2s) var(--us-easing, ease);
}

.not-found__link:hover {
  opacity: 0.9;
}
</style>