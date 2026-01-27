<template>
  <article
    ref="cardRef"
    class="project-card group"
    @click="handleClick"
  >
    <!-- 图片区域 -->
    <div class="project-card__image-wrapper">
      <img
        :src="project.image"
        :alt="project.title"
        loading="lazy"
        decoding="async"
        width="800"
        height="600"
        class="project-card__image"
      />
      
      <!-- 渐变遮罩 -->
      <div class="project-card__image-overlay" />
      
      <!-- 主要技术标签 -->
      <div class="project-card__main-tech">
        <span class="tech-badge">{{ project.technologies[0] }}</span>
      </div>
      
      <!-- 悬停时的覆盖层 -->
      <div class="project-card__hover-overlay">
        <div class="hover-content">
          <svg class="w-12 h-12 text-white mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span class="hover-text">查看项目</span>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="project-card__content">
      <!-- 标题 -->
      <h3 class="project-card__title">
        {{ project.title }}
      </h3>

      <!-- 描述 -->
      <p class="project-card__description">
        {{ project.description }}
      </p>

      <!-- 技术标签 -->
      <div class="project-card__tags">
        <span
          v-for="tag in project.tags.slice(0, 4)"
          :key="tag"
          class="tag-item"
        >
          {{ tag }}
        </span>
      </div>

      <!-- 底部信息 -->
      <div class="project-card__footer">
        <div class="project-meta">
          <div class="meta-item">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ project.status || '已完成' }}</span>
          </div>
          <div class="meta-item">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>{{ project.category || 'Web应用' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 顶部装饰条 -->
    <div class="project-card__accent" />
  </article>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import gsap from 'gsap'
import { useRouter } from 'vue-router'

interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  tags: string[]
  slug: string
  status?: string
  category?: string
}

const props = defineProps<{
  project: Project
}>()

const cardRef = ref<HTMLElement | null>(null)
const router = useRouter()

const handleClick = () => {
  router.push(`/projects/${props.project.slug}`)
}

onMounted(() => {
  if (cardRef.value) {
    // 初始动画
    gsap.from(cardRef.value, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: 'power3.out',
      delay: Math.random() * 0.3
    })
  }
})
</script>

<style scoped>
.project-card {
  position: relative;
  background: white;
  dark:bg-slate-900;
  border-radius: 1.5rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(226, 232, 240, 0.8);
  dark:border(rgba(51, 65, 85, 0.8));
  box-shadow: var(--shadow-sm);
}

.project-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-2xl);
  border-color: rgba(99, 102, 241, 0.3);
  dark:border(rgba(99, 102, 241, 0.3));
}

/* 图片区域 */
.project-card__image-wrapper {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.project-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.project-card:hover .project-card__image {
  transform: scale(1.1);
}

/* 渐变遮罩 */
.project-card__image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.8), transparent);
  transition: opacity 0.4s ease;
}

/* 主要技术标签 */
.project-card__main-tech {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
}

.tech-badge {
  display: inline-flex;
  align-items-center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.95);
  dark:bg(rgba(30, 41, 59, 0.95));
  backdrop-filter: blur(12px);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary-600);
  dark:color(var(--primary-400));
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(255, 255, 255, 0.2);
  dark:border(rgba(51, 65, 85, 0.3));
  transition: all 0.3s ease;
}

.project-card:hover .tech-badge {
  background: var(--primary-500);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-primary);
}

/* 悬停覆盖层 */
.project-card__hover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(139, 92, 246, 0.9));
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.project-card:hover .project-card__hover-overlay {
  opacity: 1;
}

.hover-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  transform: translateY(20px);
  transition: transform 0.4s ease;
}

.project-card:hover .hover-content {
  transform: translateY(0);
}

.hover-text {
  color: white;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.025em;
}

/* 内容区域 */
.project-card__content {
  padding: 1.5rem;
}

.project-card__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  dark:color(var(--text-primary));
  margin-bottom: 0.75rem;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.project-card:hover .project-card__title {
  color: var(--primary-600);
  dark:color(var(--primary-400));
}

.project-card__description {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text-secondary);
  dark:color(var(--text-secondary));
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 技术标签 */
.project-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  background: var(--surface-2);
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
  dark:color(var(--text-secondary));
  border: 1px solid var(--border-default);
  transition: all 0.3s ease;
}

.project-card:hover .tag-item {
  background: var(--primary-50);
  dark:background(var(--primary-950));
  color: var(--primary-600);
  dark:color(var(--primary-400));
  border-color: var(--primary-300);
  dark:border(var(--primary-700));
  transform: translateY(-1px);
}

/* 底部信息 */
.project-card__footer {
  padding-top: 1rem;
  border-top: 1px solid var(--border-subtle);
  dark:border(var(--border-subtle));
}

.project-meta {
  display: flex;
  gap: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: var(--text-tertiary);
  dark:color(var(--text-tertiary));
  transition: color 0.3s ease;
}

.project-card:hover .meta-item {
  color: var(--text-secondary);
  dark:color(var(--text-secondary));
}

/* 顶部装饰条 */
.project-card__accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient-primary);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.project-card:hover .project-card__accent {
  opacity: 1;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .project-card__image-wrapper {
    height: 200px;
  }
  
  .project-card__content {
    padding: 1.25rem;
  }
  
  .project-card__title {
    font-size: 1.125rem;
  }
  
  .project-card__description {
    font-size: 0.875rem;
  }
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .project-card,
  .project-card__image,
  .project-card__hover-overlay,
  .hover-content,
  .tech-badge,
  .tag-item,
  .project-card__title,
  .project-card__accent,
  .meta-item {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
</style>