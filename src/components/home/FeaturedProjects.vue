<script setup lang="ts">
import { ref, computed, onMounted, inject } from 'vue'
import { useProjectStore } from '@/stores/useProjectStore'
import { ChevronDown } from 'lucide-vue-next'

// Guard against lazy-loaded component timing (Pinia may not be ready on first render)
const projectStore = inject('$pinia') ? useProjectStore() : null

const expandedId = ref<string | null>(null)

// Static fallback data (used when store is unavailable)
const fallbackProjects = [
  {
    id: '1', title: '澳斯康生物官网重构项目', category: '企业官网',
    description: 'Vue 3 + TypeScript 重构的生物制药企业官网，首屏加载从 3.5s 降至 1.5s，Lighthouse Performance 96 分。',
    techStack: ['Vue', 'TypeScript', 'Vite', 'Element Plus'],
    narrative: { challenge: '原官网技术栈老旧，首屏加载超过 3.5 秒', approach: 'Vue 3 Composition API + TypeScript + Vite 全量重构', impact: '首屏从3.5s降至1.5s，Performance 96、SEO 98' },
    metrics: [{ label: '首屏加载', value: '1.5s' }, { label: 'Lighthouse', value: '96分' }]
  },
  {
    id: '2', title: '企业后台管理系统', category: 'SaaS',
    description: '基于 Vue 3 + Element Plus 的企业级后台管理系统，支持 20+ 业务模块，权限系统被多个项目复用。',
    techStack: ['Vue', 'TypeScript', 'Pinia', 'Element Plus'],
    narrative: { challenge: '多业务线管理混乱，权限系统零散', approach: '模块化架构 + RBAC 权限系统', impact: '开发效率提升 40%，维护成本降低 60%' },
    metrics: [{ label: '业务模块', value: '20+' }, { label: '效率提升', value: '40%' }]
  },
  {
    id: '3', title: 'Rixoptics 光学品牌官网', category: '品牌官网',
    description: '基于 WordPress 主题定制的精密光学产品官网，首屏加载从 4 秒优化到 2 秒以内。',
    techStack: ['WordPress', 'JavaScript', 'jQuery'],
    narrative: null, metrics: []
  }
]

const featuredProjects = computed(() => {
  if (projectStore) {
    try {
      const raw = projectStore.featuredProjects
      if (raw && raw.length > 0) return raw.slice(0, 5)
    } catch { /* fall through */ }
  }
  return fallbackProjects
})

const _getTechNames = (project: { techStack?: string[] }): string[] => {
  return project.techStack || []
}

const toggleExpand = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id
}

onMounted(async () => {
  if (projectStore) {
    try { await projectStore.loadProjects() } catch { /* store handles error */ }
  }
})
</script>

<template>
  <section class="fp stripe-section stripe-section--projects stripe-orbs stripe-orbs--indigo">
    <div class="fp__container">
      <div class="fp__header">
        <span class="fp__label stripe-text-gradient">Featured Work</span>
        <h2 class="fp__title">精选项目</h2>
      </div>

      <div class="fp__field">
        <div
v-for="project in featuredProjects" :key="project.id"
          class="fp__card stripe-card stripe-border stripe-border--indigo" @click="toggleExpand(project.id)">
          <div class="fp__card-header">
            <div class="fp__card-title-group">
              <h3 class="fp__card-title">{{ project.title }}</h3>
              <span v-if="project.category" class="fp__card-category">{{ project.category }}</span>
            </div>
            <div class="fp__card-arrow" :class="{ 'fp__card-arrow--open': expandedId === project.id }">
              <ChevronDown :size="20" />
            </div>
          </div>

          <div class="fp__expandable" :class="{ 'fp__expandable--open': expandedId === project.id }">
            <div class="fp__expandable-inner">
              <p class="fp__card-desc">{{ project.description }}</p>

              <div v-if="project.narrative" class="fp__narrative">
                <div v-if="project.narrative.challenge" class="fp__narrative-item">
                  <span class="fp__narrative-label">挑战</span>
                  <p>{{ project.narrative.challenge }}</p>
                </div>
                <div v-if="project.narrative.approach" class="fp__narrative-item">
                  <span class="fp__narrative-label">方案</span>
                  <p>{{ project.narrative.approach }}</p>
                </div>
                <div v-if="project.narrative.impact" class="fp__narrative-item">
                  <span class="fp__narrative-label">影响</span>
                  <p>{{ project.narrative.impact }}</p>
                </div>
              </div>

              <div v-if="project.metrics && project.metrics.length > 0" class="fp__metrics">
                <div v-for="m in project.metrics" :key="m.label" class="fp__metric">
                  <span class="fp__metric-value">{{ m.value }}</span>
                  <span class="fp__metric-label">{{ m.label }}</span>
                </div>
              </div>

              <div class="fp__card-tags">
                <span v-for="tag in project.techStack.slice(0, 6)" :key="tag" class="fp__card-tag">{{ tag }}</span>
              </div>

              <div class="fp__card-actions">
                <a href="#" class="fp__card-link fp__card-link--primary" @click.stop>
                  查看演示
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </a>
                <RouterLink to="/projects" class="fp__card-link" @click.stop>
                  查看详情
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="fp__cta">
        <RouterLink to="/projects" class="fp__cta-link">
          查看全部项目
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fp {
  position: relative;
  padding: var(--us-space-20) 0;
  background: transparent;
}

.fp__container {
  position: relative;
  z-index: var(--z-local);
  max-width: 900px;
  margin: 0 auto;
  padding: 0 var(--us-space-6);
}

.fp__header {
  margin-bottom: var(--us-space-12);
  display: flex;
  align-items: baseline;
  gap: var(--us-space-3);
}

.fp__label {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--us-accent);
  letter-spacing: 0.02em;
}

.fp__title {
  margin: 0;
  font-size: var(--text-3xl);
  font-weight: 600;
  color: var(--us-text-primary);
  line-height: var(--leading-tight);
  letter-spacing: -0.02em;
}

.fp__field {
  display: flex;
  flex-direction: column;
  gap: var(--us-space-4);
}

.fp__card {
  position: relative;
  border-radius: var(--radius-xl);
  cursor: pointer;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.fp__card:hover {
  border-color: rgba(255, 255, 255, 0.16);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 12px 32px rgba(0, 0, 0, 0.2), 0 0 60px rgba(99, 102, 241, 0.06);
}

.fp__card-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--us-space-4);
  padding: var(--us-space-6) var(--us-space-8);
}

.fp__card-title-group {
  flex: 1;
  min-width: 0;
}

.fp__card-title {
  margin: 0;
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--us-text-primary);
  letter-spacing: -0.02em;
}

.fp__card-category {
  display: inline-block;
  margin-top: var(--us-space-1);
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--us-accent);
}

.fp__card-arrow {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  color: var(--us-text-tertiary);
  transition: transform 0.3s ease, color 0.3s ease;
}

.fp__card:hover .fp__card-arrow {
  color: var(--us-accent);
}

.fp__card-arrow--open {
  transform: rotate(180deg);
}

.fp__expandable {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
  opacity: 0;
}

.fp__expandable--open {
  max-height: 800px;
  opacity: 1;
}

.fp__expandable-inner {
  padding: 0 var(--us-space-8) var(--us-space-8) var(--us-space-8);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.fp__card-desc {
  margin: var(--us-space-6) 0 0;
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--us-text-secondary);
}

.fp__narrative {
  margin-top: var(--us-space-6);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--us-space-4);
}

.fp__narrative-item {
  padding: var(--us-space-4);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.fp__narrative-label {
  display: block;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--us-accent);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: var(--us-space-2);
}

.fp__narrative-item p {
  margin: 0;
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: var(--us-text-tertiary);
}

.fp__metrics {
  margin-top: var(--us-space-6);
  display: flex;
  gap: var(--us-space-6);
}

.fp__metric {
  display: flex;
  flex-direction: column;
}

.fp__metric-value {
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--us-accent);
}

.fp__metric-label {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--us-text-tertiary);
  margin-top: var(--us-space-1);
}

.fp__card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--us-space-2);
  margin-top: var(--us-space-6);
}

.fp__card-tag {
  font-size: var(--text-xs);
  font-weight: 500;
  padding: var(--us-space-1) var(--us-space-3);
  min-height: 28px;
  border-radius: var(--radius-md);
  background: rgba(99, 102, 241, 0.12);
  color: rgba(99, 102, 241, 0.9);
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.fp__card-actions {
  display: flex;
  gap: var(--us-space-3);
  margin-top: var(--us-space-6);
}

.fp__card-link {
  display: inline-flex;
  align-items: center;
  gap: var(--us-space-2);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--us-text-secondary);
  text-decoration: none;
  padding: var(--us-space-2) var(--us-space-4);
  border: 1px solid var(--us-border);
  border-radius: var(--radius-lg);
  transition: color 0.2s, border-color 0.2s, background 0.2s;
}

.fp__card-link:hover {
  color: var(--us-accent);
  border-color: var(--us-accent-border);
  background: rgba(99, 102, 241, 0.08);
}

.fp__card-link--primary {
  color: var(--us-accent);
  border-color: var(--us-accent-border);
  background: rgba(99, 102, 241, 0.1);
}

.fp__cta {
  margin-top: var(--us-space-8);
  text-align: center;
}

.fp__cta-link {
  display: inline-flex;
  align-items: center;
  gap: var(--us-space-2);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--us-text-secondary);
  text-decoration: none;
  padding: var(--us-space-3) var(--us-space-6);
  border: 1px solid var(--us-border);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.04);
  transition: color 0.2s, border-color 0.2s, background 0.2s, transform 0.2s;
}

.fp__cta-link:hover {
  color: var(--us-accent);
  border-color: var(--us-accent-border);
  background: rgba(99, 102, 241, 0.08);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .fp {
    padding: var(--us-space-12) 0;
  }

  .fp__header {
    margin-bottom: var(--us-space-8);
  }

  .fp__title {
    font-size: var(--text-2xl);
  }

  .fp__card-header {
    padding: var(--us-space-5) var(--us-space-5);
  }

  .fp__expandable-inner {
    padding: 0 var(--us-space-5) var(--us-space-6) var(--us-space-5);
  }

  .fp__narrative {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .fp__container {
    padding: 0 var(--us-space-4);
  }

  .fp__card-header {
    padding: var(--us-space-4) var(--us-space-4);
  }

  .fp__expandable-inner {
    padding: 0 var(--us-space-4) var(--us-space-5) var(--us-space-4);
  }

  .fp__card-title {
    font-size: var(--text-base);
  }
}
</style>
