<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/useProjectStore'
import type { ProjectDetail as ProjectDetailType } from '@/types/project'
import SafeImage from '@/components/common/SafeImage.vue'

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()

const project = computed<ProjectDetailType | null>(() =>
  projectStore.getProjectDetail(route.params.id as string)
)
const loading = computed(() => projectStore.loading)
const error = computed(() => projectStore.error)
const relatedProjects = computed(() => projectStore.getRelatedProjects(route.params.id as string))

const handleBack = () => {
  router.push('/projects')
}

const handleTechStackClick = (techName: string) => {
  projectStore.filterByTechStack([techName])
  router.push('/projects')
}

onMounted(() => {
  if (route.params.id) {
    projectStore.loadProjectDetail(route.params.id as string)
  }
})
</script>

<template>
  <div class="project-detail">
    <!-- 加载状态 -->
    <div v-if="loading" class="project-detail__loading">
      <div class="project-detail__skeleton-header"></div>
      <div class="project-detail__skeleton-content">
        <div class="project-detail__skeleton-title"></div>
        <div class="project-detail__skeleton-description"></div>
        <div class="project-detail__skeleton-section"></div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="project-detail__error">
      <p>{{ error }}</p>
      <button class="project-detail__back-btn" @click="handleBack">返回作品集</button>
    </div>

    <!-- 项目不存在 -->
    <div v-else-if="!project" class="project-detail__not-found">
      <h2>项目不存在</h2>
      <button class="project-detail__back-btn" @click="handleBack">返回作品集</button>
    </div>

    <!-- 项目详情 -->
    <div v-else class="project-detail__content">
      <!-- 返回按钮 -->
      <button class="project-detail__back-btn" @click="handleBack">← 返回作品集</button>

      <!-- 项目头部 -->
      <section class="project-detail__header">
        <div class="project-detail__cover">
          <SafeImage
            :src="project.coverImage"
            :alt="project.title"
            image-class="project-detail__cover-image"
            width="800"
            height="450"
          />
          <div v-if="project.featured" class="project-detail__featured">精选项目</div>
        </div>

        <div class="project-detail__info">
          <h1 class="project-detail__title">{{ project.title }}</h1>
          <p class="project-detail__description">{{ project.description }}</p>

          <div class="project-detail__meta">
            <div class="project-detail__meta-item">
              <span class="project-detail__meta-label">分类:</span>
              <span class="project-detail__meta-value">{{ project.category }}</span>
            </div>
            <div class="project-detail__meta-item">
              <span class="project-detail__meta-label">创建时间:</span>
              <span class="project-detail__meta-value">{{ project.createdAt }}</span>
            </div>
            <div class="project__meta-item">
              <span class="project-detail__meta-label">更新时间:</span>
              <span class="project-detail__meta-value">{{ project.updatedAt }}</span>
            </div>
          </div>

          <div class="project-detail__tech-stack">
            <span class="project-detail__tech-label">技术栈:</span>
            <span
              v-for="tech in project.techStack"
              :key="tech.name"
              class="project-detail__tech-tag"
              @click="handleTechStackClick(tech.name)"
            >
              {{ tech.name }} {{ tech.version }}
            </span>
          </div>

          <div class="project-detail__links">
            <a
              v-if="project.demoUrl"
              :href="project.demoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="project-detail__link project-detail__link--demo"
            >
              查看演示
            </a>
            <a
              v-if="project.githubUrl"
              :href="project.githubUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="project-detail__link project-detail__link--github"
            >
              查看源码
            </a>
          </div>
        </div>
      </section>

      <!-- 项目背景 -->
      <section v-if="project.background" class="project-detail__section">
        <h2 class="project-detail__section-title">项目背景</h2>
        <p class="project-detail__text">{{ project.background }}</p>
      </section>

      <!-- 项目目标 -->
      <section v-if="project.goals && project.goals.length > 0" class="project-detail__section">
        <h2 class="project-detail__section-title">项目目标</h2>
        <ul class="project-detail__list">
          <li v-for="(goal, index) in project.goals" :key="index">
            {{ goal }}
          </li>
        </ul>
      </section>

      <!-- 实现功能 -->
      <section
        v-if="project.features && project.features.length > 0"
        class="project-detail__section"
      >
        <h2 class="project-detail__section-title">实现功能</h2>
        <ul class="project-detail__list">
          <li v-for="(feature, index) in project.features" :key="index">
            {{ feature }}
          </li>
        </ul>
      </section>

      <!-- 核心技术亮点 -->
      <section v-if="project.techHighlights" class="project-detail__section">
        <h2 class="project-detail__section-title">核心技术亮点</h2>

        <div v-if="project.techHighlights.architecture" class="project-detail__subsection">
          <h3 class="project-detail__subsection-title">架构设计</h3>
          <p class="project-detail__text">{{ project.techHighlights.architecture }}</p>
        </div>

        <div
          v-if="
            project.techHighlights.keyImplementations &&
            project.techHighlights.keyImplementations.length > 0
          "
          class="project-detail__subsection"
        >
          <h3 class="project-detail__subsection-title">关键实现</h3>
          <ul class="project-detail__list">
            <li v-for="(impl, index) in project.techHighlights.keyImplementations" :key="index">
              {{ impl }}
            </li>
          </ul>
        </div>

        <div
          v-if="
            project.techHighlights.performanceOptimizations &&
            project.techHighlights.performanceOptimizations.length > 0
          "
          class="project-detail__subsection"
        >
          <h3 class="project-detail__subsection-title">性能优化</h3>
          <ul class="project-detail__list">
            <li
              v-for="(opt, index) in project.techHighlights.performanceOptimizations"
              :key="index"
            >
              {{ opt }}
            </li>
          </ul>
        </div>

        <div v-if="project.techHighlights.solution" class="project-detail__subsection">
          <h3 class="project-detail__subsection-title">解决方案</h3>
          <p class="project-detail__text">{{ project.techHighlights.solution }}</p>
        </div>
      </section>

      <!-- 项目成果 -->
      <section v-if="project.results" class="project-detail__section">
        <h2 class="project-detail__section-title">项目成果</h2>

        <div v-if="project.results.performance" class="project-detail__result-item">
          <h3 class="project-detail__result-title">性能指标</h3>
          <p class="project-detail__text">{{ project.results.performance }}</p>
        </div>

        <div v-if="project.results.business" class="project-detail__result-item">
          <h3 class="project-detail__result-title">业务指标</h3>
          <p class="project-detail__text">{{ project.results.business }}</p>
        </div>

        <div v-if="project.results.feedback" class="project-detail__result-item">
          <h3 class="project-detail__result-title">用户反馈</h3>
          <p class="project-detail__text">{{ project.results.feedback }}</p>
        </div>

        <div
          v-if="project.results.highlights && project.results.highlights.length > 0"
          class="project-detail__result-item"
        >
          <h3 class="project-detail__result-title">项目亮点</h3>
          <ul class="project-detail__list">
            <li v-for="(highlight, index) in project.results.highlights" :key="index">
              {{ highlight }}
            </li>
          </ul>
        </div>
      </section>

      <!-- 项目截图 -->
      <section
        v-if="project.screenshots && project.screenshots.length > 0"
        class="project-detail__section"
      >
        <h2 class="project-detail__section-title">项目截图</h2>
        <div class="project-detail__screenshots">
          <SafeImage
            v-for="(screenshot, index) in project.screenshots"
            :key="index"
            :src="screenshot"
            :alt="`${project.title} 截图 ${index + 1}`"
            image-class="project-detail__screenshot"
            width="1200"
            height="800"
          />
        </div>
      </section>

      <!-- 相关项目推荐 -->
      <section v-if="relatedProjects.length > 0" class="project-detail__section">
        <h2 class="project-detail__section-title">相关项目</h2>
        <div class="project-detail__related">
          <div
            v-for="relatedProject in relatedProjects"
            :key="relatedProject.id"
            class="project-detail__related-item"
            @click="router.push(`/projects/${relatedProject.id}`)"
          >
            <SafeImage
              :src="relatedProject.coverImage"
              :alt="relatedProject.title"
              image-class="project-detail__related-image"
              width="400"
              height="225"
            />
            <div class="project-detail__related-info">
              <h3 class="project-detail__related-title">{{ relatedProject.title }}</h3>
              <p class="project-detail__related-description">{{ relatedProject.description }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.project-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.project-detail__loading,
.project-detail__error,
.project-detail__not-found {
  padding: 4rem 2rem;
  text-align: center;
}

.project-detail__skeleton-header {
  width: 100%;
  height: 400px;
  background-color: var(--color-bg-secondary);
  border-radius: 0.75rem;
  margin-bottom: 2rem;
  animation: pulse 1.5s ease-in-out infinite;
}

.project-detail__skeleton-content {
  max-width: 800px;
  margin: 0 auto;
}

.project-detail__skeleton-title {
  width: 70%;
  height: 2.5rem;
  background-color: var(--color-bg-secondary);
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  animation: pulse 1.5s ease-in-out infinite;
}

.project-detail__skeleton-description {
  width: 100%;
  height: 1rem;
  background-color: var(--color-bg-secondary);
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
  animation: pulse 1.5s ease-in-out infinite;
}

.project-detail__skeleton-section {
  width: 100%;
  height: 200px;
  background-color: var(--color-bg-secondary);
  border-radius: 0.75rem;
  margin-top: 2rem;
  animation: pulse 1.5s ease-in-out infinite;
}

.project-detail__back-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 2rem;
}

.project-detail__back-btn:hover {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.project-detail__header {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.project-detail__cover {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  background-color: var(--color-bg-secondary);
  border-radius: 0.75rem;
  overflow: hidden;
}

.project-detail__cover-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-detail__featured {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 0.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.project-detail__info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.project-detail__title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.2;
  margin: 0;
}

.project-detail__description {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
}

.project-detail__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.project-detail__meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.project-detail__meta-label {
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
  font-weight: 500;
}

.project-detail__meta-value {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.project-detail__tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.project-detail__tech-label {
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
  font-weight: 500;
  margin-right: 0.5rem;
}

.project-detail__tech-tag {
  padding: 0.5rem 1rem;
  background-color: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.project-detail__tech-tag:hover {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.project-detail__links {
  display: flex;
  gap: 0.75rem;
}

.project-detail__link {
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.project-detail__link:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.project-detail__section {
  margin-bottom: 3rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid var(--color-border);
}

.project-detail__section:last-child {
  border-bottom: none;
}

.project-detail__section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color__text-primary);
  margin: 0 0 1.5rem 0;
}

.project-detail__subsection {
  margin-bottom: 2rem;
}

.project-detail__subsection-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 1rem 0;
}

.project-detail__result-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 0.5rem 0;
}

.project-detail__text {
  font-size: 1rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
}

.project-detail__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.project-detail__list li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.project-detail__list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--color-primary);
  font-weight: bold;
}

.project-detail__screenshots {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.project-detail__screenshot {
  width: 100%;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.project-detail__related {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.project-detail__related-item {
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.project-detail__related-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary);
}

.project-detail__related-image {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
}

.project-detail__related-info {
  padding: 1rem;
}

.project-detail__related-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 0.5rem 0;
}

.project-detail__related-description {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .project-detail {
    padding: 1.5rem 1rem 3rem;
  }

  .project-detail__title {
    font-size: 1.75rem;
  }

  .project-detail__description {
    font-size: 1rem;
  }

  .project-detail__meta {
    flex-direction: column;
    gap: 0.75rem;
  }

  .project-detail__screenshots {
    grid-template-columns: 1fr;
  }

  .project-detail__related {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .project-detail__header {
    grid-template-columns: 1fr;
  }

  .project-detail__cover {
    padding-top: 56.25%;
  }
}

@media (min-width: 1025px) {
  .project-detail__header {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
