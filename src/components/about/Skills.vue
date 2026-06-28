<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import gsap from 'gsap'
import skillsData from '@/assets/data/skills.json'
import type { Skill } from '@/types/project'

const skills = computed<Skill[]>(() => skillsData as Skill[])

const skillsByCategory = computed(() => {
  const grouped: Record<string, Skill[]> = {}
  skills.value.forEach((skill) => {
    if (!grouped[skill.category]) {
      grouped[skill.category] = []
    }
    grouped[skill.category].push(skill)
  })
  return grouped
})

const skillsRef = ref<HTMLElement | null>(null)

const getLevelColor = (level: number) => {
  // 使用新的精致色系
  if (level >= 90) return '#6366F1'  // 靛蓝 - 精通
  if (level >= 80) return '#8B5CF6'  // 紫罗兰 - 熟练
  if (level >= 70) return '#EC4899'  // 玫瑰粉 - 熟悉
  return '#F59E0B'  // 琥珀金 - 了解
}

const getLevelGradient = (level: number) => {
  // 返回渐变色
  if (level >= 90) return 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
  if (level >= 80) return 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)'
  if (level >= 70) return 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)'
  return 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)'
}

const getLevelText = (level: number) => {
  if (level >= 90) return '精通'
  if (level >= 80) return '熟练'
  if (level >= 70) return '熟悉'
  return '了解'
}

const getLevelIcon = (level: number) => {
  // 返回对应的图标SVG
  if (level >= 90) {
    return '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>'
  }
  if (level >= 80) {
    return '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>'
  }
  if (level >= 70) {
    return '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 0016 0zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/></svg>'
  }
  return '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>'
}

onMounted(() => {
  if (skillsRef.value) {
    // 添加入场动画
    gsap.from(skillsRef.value, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out'
    })
  }
})
</script>

<template>
  <section ref="skillsRef" class="skills-section">
    <!-- 标题区域 -->
    <div class="skills-header">
      <div class="skills-badge">
        <span class="badge-icon">⚡</span>
        <span class="badge-text">技术栈</span>
      </div>
      <h2 class="skills-title">技能展示</h2>
      <p class="skills-subtitle">
        7年技术沉淀，从入门到精通的专业技能体系
      </p>
    </div>

    <!-- 技能分类 -->
    <div class="skills-categories">
      <div
        v-for="(categorySkills, category) in skillsByCategory"
        :key="category"
        class="skill-category"
      >
        <!-- 分类标题 -->
        <div class="category-header">
          <h3 class="category-title">
            {{ category }}
          </h3>
          <div class="category-line" />
        </div>

        <!-- 技能网格 -->
        <div class="skills-grid">
          <div
            v-for="skill in categorySkills"
            :key="skill.id"
            class="skill-card"
            :style="{
              '--skill-color': getLevelColor(skill.level),
              '--skill-gradient': getLevelGradient(skill.level)
            }"
          >
            <!-- 技能头部 -->
            <div class="skill-header">
              <div class="skill-info">
                <h4 class="skill-name">{{ skill.name }}</h4>
                <div
                  class="skill-level-badge"
                  :style="{
                    background: getLevelGradient(skill.level),
                    color: 'white'
                  }"
                >
                  <span v-html="getLevelIcon(skill.level)" />
                  <span>{{ getLevelText(skill.level) }}</span>
                </div>
              </div>
              <div class="skill-percentage">{{ skill.level }}%</div>
            </div>

            <!-- 进度条 -->
            <div class="skill-progress-container">
              <div class="progress-track">
                <div
                  class="progress-bar"
                  :style="{
                    width: `${skill.level}%`,
                    background: getLevelGradient(skill.level)
                  }"
                >
                  <div class="progress-glow" />
                </div>
              </div>
            </div>

            <!-- 描述 -->
            <p v-if="skill.description" class="skill-description">
              {{ skill.description }}
            </p>

            <!-- 元数据 -->
            <div class="skill-meta">
              <div v-if="skill.yearsOfExperience" class="meta-item">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ skill.yearsOfExperience }} 年经验</span>
              </div>

              <div v-if="skill.projects && skill.projects.length > 0" class="meta-item">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{{ skill.projects.length }} 个项目</span>
              </div>
            </div>

            <!-- 相关项目标签 -->
            <div v-if="skill.projects && skill.projects.length > 0" class="skill-projects">
              <div class="projects-label">相关项目</div>
              <div class="projects-list">
                <span
                  v-for="project in skill.projects.slice(0, 3)"
                  :key="project"
                  class="project-tag"
                >
                  {{ project }}
                </span>
                <span v-if="skill.projects.length > 3" class="project-more">
                  +{{ skill.projects.length - 3 }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 技能区域容器 */
.skills-section {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
  backdrop-filter: blur(12px);
  border-radius: 2rem;
  border: 1px solid rgba(226, 232, 240, 0.6);
  box-shadow: var(--shadow-lg);
}
.dark .skills-section {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9));
  border-color: rgba(51, 65, 85, 0.6);
}

/* 标题区域 */
.skills-header {
  text-align: center;
  margin-bottom: 4rem;
}

.skills-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--primary-50);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--primary-600);
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--primary-200);
}
.dark .skills-badge {
  background: var(--primary-950);
  color: var(--primary-400);
  border-color: var(--primary-800);
}

.badge-icon {
  font-size: 1.125rem;
}

.skills-title {
  font-size: 3rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
  letter-spacing: -0.02em;
  line-height: 1.1;
}
.dark .skills-title {
  color: var(--text-primary);
}

.skills-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
.dark .skills-subtitle {
  color: var(--text-secondary);
}

/* 技能分类 */
.skills-categories {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.skill-category {
  display: flex;
  flex-direction: column;
}

/* 分类标题 */
.category-header {
  margin-bottom: 2.5rem;
  position: relative;
}

.category-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.dark .category-title {
  color: var(--text-primary);
}

.category-title::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gradient-primary);
  box-shadow: var(--shadow-primary);
}

.category-line {
  width: 100%;
  height: 2px;
  background: var(--gradient-primary);
  opacity: 0.3;
  position: relative;
}

.category-line::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  width: 100px;
  height: 100%;
  background: var(--gradient-primary);
}

/* 技能网格 */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

/* 技能卡片 */
.skill-card {
  position: relative;
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  border: 1px solid var(--border-default);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.dark .skill-card {
  background: var(--surface-1);
  border-color: var(--border-default);
}

.skill-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--skill-gradient);
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.skill-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-2xl);
  border-color: var(--skill-color);
}

.skill-card:hover::before {
  opacity: 1;
}

/* 技能头部 */
.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.skill-info {
  flex: 1;
}

.skill-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.75rem 0;
  letter-spacing: -0.01em;
}
.dark .skill-name {
  color: var(--text-primary);
}

.skill-level-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 600;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
}

.skill-card:hover .skill-level-badge {
  transform: translateY(-2px);
  box-shadow: var(--shadow-primary);
}

.skill-percentage {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--skill-color);
  line-height: 1;
  text-shadow: 0 0 20px var(--skill-color);
  opacity: 0.3;
  transition: opacity 0.3s ease;
}

.skill-card:hover .skill-percentage {
  opacity: 0.8;
}

/* 进度条 */
.skill-progress-container {
  margin-bottom: 1.5rem;
}

.progress-track {
  position: relative;
  height: 8px;
  background: var(--surface-2);
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 9999px;
  position: relative;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-glow {
  position: absolute;
  inset: -2px;
  background: inherit;
  filter: blur(8px);
  border-radius: 9999px;
  opacity: 0.6;
  animation: progress-pulse 2s ease-in-out infinite;
}

@keyframes progress-pulse {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
}

/* 技能描述 */
.skill-description {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}
.dark .skill-description {
  color: var(--text-secondary);
}

/* 元数据 */
.skill-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-subtle);
}
.dark .skill-meta {
  border-color: var(--border-subtle);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-tertiary);
  font-weight: 500;
}
.dark .meta-item {
  color: var(--text-tertiary);
}

.meta-item svg {
  color: var(--skill-color);
  opacity: 0.7;
}

/* 相关项目 */
.skill-projects {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.projects-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.dark .projects-label {
  color: var(--text-tertiary);
}

.projects-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.project-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  background: var(--surface-2);
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
  border: 1px solid var(--border-default);
  transition: all 0.3s ease;
}

.project-tag:hover {
  background: var(--primary-50);
  color: var(--primary-600);
  border-color: var(--primary-300);
  transform: translateY(-1px);
}
.dark .project-tag {
  color: var(--text-secondary);
}
.dark .project-tag:hover {
  background: var(--primary-950);
  color: var(--primary-400);
  border-color: var(--primary-700);
}

.project-more {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-tertiary);
}
.dark .project-more {
  color: var(--text-tertiary);
}

/* 响应式优化 */
@media (max-width: 1024px) {
  .skills-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .skills-section {
    padding: 3rem 1.5rem;
  }

  .skills-title {
    font-size: 2.5rem;
  }

  .skills-categories {
    gap: 3rem;
  }

  .skills-grid {
    grid-template-columns: 1fr;
  }

  .skill-card {
    padding: 1.5rem;
  }

  .skill-name {
    font-size: 1.25rem;
  }

  .skill-percentage {
    font-size: 2rem;
  }
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .skill-card,
  .progress-bar,
  .skill-level-badge,
  .progress-glow,
  .skill-percentage {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
</style>
