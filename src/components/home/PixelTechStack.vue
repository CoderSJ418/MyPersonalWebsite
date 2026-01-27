<template>
  <section class="pixel-tech-stack">
    <div class="pixel-section-header">
      <PixelHeading level="2" pixel-font>技术栈</PixelHeading>
      <p class="pixel-section-subtitle">
        掌握的技术和工具
      </p>
    </div>

    <div class="pixel-tech-grid">
      <PixelCard v-for="tech in techStack" :key="tech.name" variant="gradient" class="pixel-tech-card">
        <div class="pixel-tech-icon">
          <PixelIcon :size="tech.iconSize || 'large'" :color="tech.color" />
        </div>
        <PixelHeading level="4" class="pixel-tech-name">{{ tech.name }}</PixelHeading>
        <p class="pixel-tech-description">{{ tech.description }}</p>
        <div class="pixel-tech-level">
          <div class="pixel-tech-bar" :style="{ width: tech.level + '%' }"></div>
        </div>
      </PixelCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { PixelHeading, PixelCard, PixelIcon } from '@/components/pixel'

interface TechStackItem {
  name: string
  description: string
  level: number
  color: string
  iconSize?: string
}

const techStack: TechStackItem[] = [
  {
    name: 'Vue.js',
    description: '渐进式JavaScript框架，构建用户界面',
    level: 95,
    color: 'cyan'
  },
  {
    name: 'TypeScript',
    description: 'JavaScript的超集，添加了类型系统',
    level: 90,
    color: 'purple'
  },
  {
    name: 'Vite',
    description: '快速的构建工具和开发服务器',
    level: 85,
    color: 'cyan'
  },
  {
    name: 'Tailwind CSS',
    description: '实用优先的CSS框架',
    level: 80,
    color: 'cyan'
  },
  {
    name: 'Node.js',
    description: 'JavaScript运行时环境',
    level: 75,
    color: 'purple'
  },
  {
    name: 'Git',
    description: '分布式版本控制系统',
    level: 85,
    color: 'gray'
  }
]
</script>

<style scoped>
.pixel-tech-stack {
  @apply py-20 px-4;
  background: linear-gradient(135deg, #121212 0%, #1a1a1a 100%);
}

.pixel-section-header {
  @apply text-center mb-16;
}

.pixel-section-subtitle {
  @apply text-lg text-pixel-gray mt-4;
}

.pixel-tech-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto;
}

.pixel-tech-card {
  @apply transition-all duration-300 hover:scale-105;
}

.pixel-tech-icon {
  @apply mb-4;
}

.pixel-tech-name {
  @apply mb-2;
}

.pixel-tech-description {
  @apply text-sm text-pixel-gray mb-4;
}

.pixel-tech-level {
  @apply h-2 bg-pixel-dark rounded-full overflow-hidden;
}

.pixel-tech-bar {
  @apply h-full bg-pixel-cyan transition-all duration-1000 ease-out;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .pixel-tech-grid {
    grid-template-columns: 1fr;
  }
  
  .pixel-section-header {
    text-align: center;
  }
}
</style>