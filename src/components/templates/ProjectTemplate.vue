<template>
  <div class="project-template">
    <HeroSection />
    
    <section class="projects-section">
      <div class="projects-section__container">
        <div class="projects-section__header">
          <h2 class="projects-section__title">精选项目</h2>
          <p class="projects-section__subtitle">展示我的技术能力和项目经验</p>
        </div>
        
        <div class="projects-section__grid">
          <ProjectCard 
            v-for="project in projects"
            :key="project.id"
            :project="project"
          />
        </div>
        
        <div class="projects-section__actions">
          <router-link to="/projects" class="btn btn--outline">
            查看所有项目
          </router-link>
        </div>
      </div>
    </section>
    
    <CTASection />
  </div>
</template>

<script setup lang="ts">
import HeroSection from '@/components/organisms/HeroSection.vue'
import ProjectCard from '@/components/molecules/ProjectCard.vue'
import CTASection from '@/components/organisms/CTASection.vue'

interface Project {
  id: string
  title: string
  description: string
  image: string
  technologies: string[]
  tags: string[]
  slug: string
}

const projects = ref<Project[]>([
  {
    id: '1',
    title: 'Vue 3 个人网站',
    description: '现代化的个人作品集网站，展示Vue 3和TypeScript技术栈',
    image: '/images/project-1.jpg',
    technologies: ['Vue 3', 'TypeScript', 'Tailwind CSS'],
    tags: ['前端', '设计', '性能'],
    slug: 'vue-3-website'
  },
  {
    id: '2',
    title: 'Next.js 作品集',
    description: '基于Next.js的个人作品集，支持SSR和SEO优化',
    image: '/images/project-2.jpg',
    technologies: ['Next.js', 'React', 'Tailwind CSS'],
    tags: ['全栈', 'SSR', 'SEO'],
    slug: 'nextjs-portfolio'
  }
])
</script>

<style scoped>
.project-template {
  min-height: 100vh;
}

.projects-section {
  padding: var(--spacing-5xl) 0;
  background: var(--color-surface-bg);
}

.projects-section__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.projects-section__header {
  text-align: center;
  margin-bottom: var(--spacing-4xl);
}

.projects-section__title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-surface-text);
  margin-bottom: var(--spacing-md);
}

.projects-section__subtitle {
  font-size: var(--font-size-xl);
  color: var(--color-surface-text-secondary);
}

.projects-section__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-4xl);
}

.projects-section__actions {
  text-align: center;
}

@media (max-width: 768px) {
  .projects-section {
    padding: var(--spacing-4xl) 0;
  }
  
  .projects-section__title {
    font-size: var(--font-size-3xl);
  }
  
  .projects-section__grid {
    grid-template-columns: 1fr;
  }
}
</style>