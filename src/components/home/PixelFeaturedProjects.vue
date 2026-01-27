<template>
  <section class="pixel-featured-projects">
    <div class="pixel-section-header">
      <PixelHeading level="2" pixel-font>精选项目</PixelHeading>
      <p class="pixel-section-subtitle">
        代表性项目展示
      </p>
    </div>

    <div class="pixel-projects-grid">
      <PixelCard v-for="project in projects" :key="project.id" variant="gradient" class="pixel-project-card">
        <div class="pixel-project-image">
          <img
            :src="project.image"
            :alt="project.title"
            loading="lazy"
            decoding="async"
            width="800"
            height="600"
            class="w-full h-48 object-cover"
          />
        </div>
        <div class="pixel-project-content">
          <PixelHeading level="4" class="pixel-project-title">{{ project.title }}</PixelHeading>
          <p class="pixel-project-description">{{ project.description }}</p>
          <div class="pixel-project-tags">
            <PixelTag v-for="tag in project.tags" :key="tag" variant="outline" size="small">
              {{ tag }}
            </PixelTag>
          </div>
          <div class="pixel-project-actions">
            <PixelButton variant="outline" size="small">
              查看详情
            </PixelButton>
            <PixelButton variant="primary" size="small">
              源码
            </PixelButton>
          </div>
        </div>
      </PixelCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { PixelHeading, PixelCard, PixelTag, PixelButton } from '@/components/pixel'

interface Project {
  id: number
  title: string
  description: string
  image: string
  tags: string[]
}

const projects: Project[] = [
  {
    id: 1,
    title: '个人作品集网站',
    description: 'Vue 3 + TypeScript + Tailwind CSS 个人作品集网站',
    image: '/images/projects/portfolio.jpg',
    tags: ['Vue.js', 'TypeScript', 'Tailwind CSS']
  },
  {
    id: 2,
    title: '企业级管理系统',
    description: '基于 Vue.js 的企业级管理系统，支持多用户协作',
    image: '/images/projects/management.jpg',
    tags: ['Vue.js', 'Node.js', 'MongoDB']
  },
  {
    id: 3,
    title: '电商网站',
    description: '全栈电商网站，包含前端、后端和数据库设计',
    image: '/images/projects/ecommerce.jpg',
    tags: ['Vue.js', 'Express', 'PostgreSQL']
  },
  {
    id: 4,
    title: '实时协作工具',
    description: '基于 WebSocket 的实时协作工具',
    image: '/images/projects/collaboration.jpg',
    tags: ['Vue.js', 'WebSocket', 'Redis']
  },
  {
    id: 5,
    title: '数据分析平台',
    description: '数据可视化和分析平台',
    image: '/images/projects/analytics.jpg',
    tags: ['Vue.js', 'D3.js', 'Python']
  },
  {
    id: 6,
    title: '移动应用',
    description: '基于 Vue.js 的移动应用',
    image: '/images/projects/mobile.jpg',
    tags: ['Vue.js', 'PWA', 'Mobile']
  }
]
</script>

<style scoped>
.pixel-featured-projects {
  @apply py-20 px-4;
  background: linear-gradient(135deg, #1a1a1a 0%, #242424 100%);
}

.pixel-section-header {
  @apply text-center mb-16;
}

.pixel-section-subtitle {
  @apply text-lg text-pixel-gray mt-4;
}

.pixel-projects-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto;
}

.pixel-project-card {
  @apply transition-all duration-300 hover:scale-105;
}

.pixel-project-image {
  @apply mb-4;
}

.pixel-project-image img {
  @apply rounded-lg;
}

.pixel-project-content {
  @apply space-y-3;
}

.pixel-project-title {
  @apply mb-2;
}

.pixel-project-description {
  @apply text-sm text-pixel-gray mb-4;
}

.pixel-project-tags {
  @apply flex flex-wrap gap-2 mb-4;
}

.pixel-project-actions {
  @apply flex gap-2;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .pixel-projects-grid {
    grid-template-columns: 1fr;
  }
  
  .pixel-section-header {
    text-align: center;
  }
}
</style>