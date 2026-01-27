<template>
  <main class="projects-page">
    <!-- 英雄区域 -->
    <section class="projects-hero">
      <div class="container mx-auto px-4 sm:px-6">
        <div class="projects-hero__content">
          <div class="projects-hero__badge">
            <span class="badge-icon">🚀</span>
            <span class="badge-text">项目展示</span>
          </div>
          
          <h1 class="projects-hero__title">
            <span class="text-gradient">精选项目</span>
            <br />
            展示我的技术实力
          </h1>
          
          <p class="projects-hero__subtitle">
            从企业官网到 SaaS 平台，从微信小程序到数据可视化，每个项目都承载着独特的技术挑战和创新思路
          </p>
          
          <!-- 统计数据 -->
          <div class="projects-hero__stats">
            <div class="stat-item">
              <div class="stat-number">50+</div>
              <div class="stat-label">完成项目</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">15+</div>
              <div class="stat-label">技术栈</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">100%</div>
              <div class="stat-label">客户满意</div>
            </div>
          </div>
        </div>
        
        <!-- 装饰性元素 -->
        <div class="projects-hero__decoration">
          <div class="decoration-circle decoration-circle--1"></div>
          <div class="decoration-circle decoration-circle--2"></div>
          <div class="decoration-circle decoration-circle--3"></div>
        </div>
      </div>
    </section>

    <!-- 筛选器区域 -->
    <section class="projects-filter">
      <div class="container mx-auto px-4 sm:px-6">
        <div class="filter-header">
          <h2 class="filter-title">筛选项目</h2>
          <p class="filter-description">按技术栈或类型筛选项目</p>
        </div>
        <TechStackFilter />
      </div>
    </section>

    <!-- 项目列表区域 -->
    <section class="projects-list">
      <div class="container mx-auto px-4 sm:px-6">
        <ProjectList />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useProjectStore } from '@/stores/useProjectStore'
import TechStackFilter from '@/components/projects/TechStackFilter.vue'
import ProjectList from '@/components/projects/ProjectList.vue'

const projectStore = useProjectStore()

onMounted(() => {
  projectStore.loadProjects()
  document.title = '项目展示 - 佘杰'
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<style scoped>
/* 项目页面 */
.projects-page {
  min-height: 100vh;
  background: var(--bg-primary);
}

/* 英雄区域 */
.projects-hero {
  position: relative;
  padding: 6rem 0 4rem;
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--primary-100) 50%, var(--primary-200) 100%);
  dark:background(linear-gradient(135deg, var(--primary-950) 0%, var(--primary-900) 50%, var(--primary-800) 100%));
  overflow: hidden;
}

.projects-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.projects-hero__content {
  position: relative;
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
  z-index: 1;
}

.projects-hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  margin-bottom: 1.5rem;
  background: white;
  dark:background(var(--surface-2));
  border: 1px solid var(--border-default);
  border-radius: 9999px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
}

.projects-hero__badge:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.badge-icon {
  font-size: 1.25rem;
}

.badge-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.projects-hero__title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.02em;
}

.text-gradient {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.projects-hero__subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.7;
}

.projects-hero__stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
  max-width: 800px;
  margin: 0 auto;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9375rem;
  color: var(--text-tertiary);
  font-weight: 500;
}

/* 装饰性元素 */
.projects-hero__decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.3;
  filter: blur(60px);
  animation: float-circle 20s ease-in-out infinite;
}

.decoration-circle--1 {
  width: 300px;
  height: 300px;
  background: var(--primary-500);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.decoration-circle--2 {
  width: 200px;
  height: 200px;
  background: var(--accent-pink-500);
  top: 60%;
  right: 15%;
  animation-delay: -5s;
}

.decoration-circle--3 {
  width: 250px;
  height: 250px;
  background: var(--accent-amber-500);
  bottom: 20%;
  left: 20%;
  animation-delay: -10s;
}

@keyframes float-circle {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

/* 筛选器区域 */
.projects-filter {
  padding: 3rem 0 2rem;
  background: var(--bg-primary);
}

.filter-header {
  text-align: center;
  margin-bottom: 2rem;
}

.filter-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.filter-description {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  margin: 0;
}

/* 项目列表区域 */
.projects-list {
  padding: 2rem 0 4rem;
  background: var(--bg-primary);
}

/* 响应式 */
@media (max-width: 768px) {
  .projects-hero {
    padding: 4rem 0 3rem;
  }
  
  .projects-hero__stats {
    gap: 2rem;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .projects-filter {
    padding: 2rem 0 1.5rem;
  }
  
  .filter-title {
    font-size: 1.5rem;
  }
  
  .projects-list {
    padding: 1.5rem 0 3rem;
  }
}

@media (max-width: 640px) {
  .projects-hero__stats {
    gap: 1.5rem;
  }
  
  .stat-number {
    font-size: 1.75rem;
  }
  
  .decoration-circle {
    opacity: 0.2;
  }
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .projects-hero__badge,
  .decoration-circle {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
</style>