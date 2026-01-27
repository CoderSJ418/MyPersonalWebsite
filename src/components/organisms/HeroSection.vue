<template>
  <section class="hero">
    <div class="hero__container">
      <div class="hero__content">
        <div class="hero__badge">
          <span class="badge__text">全栈开发者</span>
        </div>
        <h1 class="hero__title">
          你好，我是<span class="hero__name">佘杰</span>
        </h1>
        <p class="hero__subtitle">
          Vue 3 & TypeScript 专家 | 个人作品集网站
        </p>
        <p class="hero__description">
          我专注于构建现代、高性能的Web应用，使用Vue 3、TypeScript和现代前端技术栈。
          致力于创造优秀的用户体验和高质量的代码。
        </p>
        <div class="hero__actions">
          <router-link 
            to="/projects" 
            class="btn btn--primary btn--lg"
          >
            查看项目
          </router-link>
          <router-link 
            to="/contact" 
            class="btn btn--outline btn--lg"
          >
            联系我
          </router-link>
        </div>
        <div class="hero__stats">
          <div class="stat">
            <span class="stat__number">7+</span>
            <span class="stat__label">年开发经验</span>
          </div>
          <div class="stat">
            <span class="stat__number">50+</span>
            <span class="stat__label">项目完成</span>
          </div>
          <div class="stat">
            <span class="stat__number">95%</span>
            <span class="stat__label">客户满意度</span>
          </div>
        </div>
      </div>
      <div class="hero__visual">
        <div class="visual__wrapper">
          <div class="visual__shape"></div>
          <div class="visual__shape"></div>
          <div class="visual__shape"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Hero Section 逻辑
</script>

<style scoped>
.hero {
  padding: var(--spacing-5xl) 0;
  position: relative;
  overflow: hidden;
}

.hero__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-3xl);
  align-items: center;
}

.hero__content {
  position: relative;
  z-index: 1;
}

.hero__badge {
  margin-bottom: var(--spacing-md);
}

.badge__text {
  display: inline-block;
  background: var(--color-primary);
  color: white;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.hero__title {
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-surface-text);
  margin-bottom: var(--spacing-md);
}

.hero__name {
  color: var(--color-primary);
}

.hero__subtitle {
  font-size: var(--font-size-xl);
  color: var(--color-surface-text-secondary);
  margin-bottom: var(--spacing-lg);
}

.hero__description {
  font-size: var(--font-size-lg);
  line-height: var(--line-height-relaxed);
  color: var(--color-surface-text-secondary);
  margin-bottom: var(--spacing-xl);
}

.hero__actions {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-2xl);
}

.hero__stats {
  display: flex;
  gap: var(--spacing-3xl);
}

.stat {
  text-align: center;
}

.stat__number {
  display: block;
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

.stat__label {
  font-size: var(--font-size-sm);
  color: var(--color-surface-text-secondary);
}

.hero__visual {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.visual__wrapper {
  position: relative;
  width: 400px;
  height: 400px;
}

.visual__shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-600));
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.visual__shape:nth-child(1) {
  width: 120px;
  height: 120px;
  top: 0;
  left: 0;
  animation-delay: 0s;
}

.visual__shape:nth-child(2) {
  width: 80px;
  height: 80px;
  bottom: 0;
  right: 0;
  animation-delay: 2s;
}

.visual__shape:nth-child(3) {
  width: 60px;
  height: 60px;
  top: 50%;
  right: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@media (max-width: 1024px) {
  .hero__container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero__visual {
    margin-top: var(--spacing-3xl);
  }
}

@media (max-width: 640px) {
  .hero {
    padding: var(--spacing-4xl) 0;
  }
  
  .hero__title {
    font-size: var(--font-size-4xl);
  }
  
  .hero__actions {
    flex-direction: column;
  }
  
  .hero__stats {
    flex-direction: column;
    gap: var(--spacing-lg);
  }
  
  .visual__wrapper {
    width: 250px;
    height: 250px;
  }
  
  .visual__shape:nth-child(1) {
    width: 80px;
    height: 80px;
  }
  
  .visual__shape:nth-child(2) {
    width: 50px;
    height: 50px;
  }
  
  .visual__shape:nth-child(3) {
    width: 40px;
    height: 40px;
  }
}
</style>