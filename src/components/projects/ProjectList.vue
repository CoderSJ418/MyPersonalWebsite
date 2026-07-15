<script setup lang="ts">
/**
 * ProjectList — Visual System Migration Complete
 *
 * 迁移完成: --lv-* → --us-* tokens (via --vs-*)
 * 新增: useScrollReveal composable 集成
 */
import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Search, X } from 'lucide-vue-next'
import { useProjectStore } from '@/stores/useProjectStore'
import ContentCard from '@/components/common/ContentCard.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import type { Project } from '@/types/project'

const router = useRouter()
const projectStore = useProjectStore()

const filteredProjects = computed(() => projectStore.filteredProjects)
const loading = computed(() => projectStore.loading)
const error = computed(() => projectStore.error)
const searchQuery = computed({
  get: () => projectStore.searchQuery,
  set: (val: string) => projectStore.searchProjects(val)
})

const clearSearch = () => {
  projectStore.searchProjects('')
}

const handleProjectClick = (project: Project) => {
  router.push({ name: 'ProjectDetail', params: { id: project.id } })
}

const gridRef = ref<HTMLElement | null>(null)

const { observeChildren, disconnect } = useScrollReveal({
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px',
  once: true,
  staggerDelay: 80,
  maxStaggerDelay: 400,
})

onMounted(() => {
  if (gridRef.value) observeChildren(gridRef.value)
})

// Re-observe vs-reveal elements when filtered projects change (filter toggle, search)
watch(
  () => filteredProjects.value,
  (newProjects, oldProjects) => {
    const changed = !oldProjects || newProjects.length !== oldProjects.length ||
      (newProjects.length > 0 && oldProjects.length > 0 && newProjects[0]?.id !== oldProjects[0]?.id)
    if (changed) {
      nextTick(() => {
        if (gridRef.value) observeChildren(gridRef.value)
      })
    }
  }
)

onUnmounted(() => {
  disconnect()
})
</script>

<template>
  <div class="project-list">
    <!-- 搜索框 -->
    <div class="project-list__search">
      <div class="project-list__search-wrapper">
        <Search class="project-list__search-icon" />
        <input v-model="searchQuery" type="text" class="project-list__search-input" placeholder="搜索项目名称、描述或技术栈..." />
        <button v-if="searchQuery" class="project-list__search-clear" aria-label="清除搜索" @click="clearSearch">
          <X class="project-list__search-clear-icon" />
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="project-list__loading">
      <div v-for="i in 6" :key="i" class="project-list__skeleton">
        <div class="project-list__skeleton-image"></div>
        <div class="project-list__skeleton-content">
          <div class="project-list__skeleton-title"></div>
          <div class="project-list__skeleton-description"></div>
          <div class="project-list__skeleton-tags"></div>
        </div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="project-list__error">
      <p>{{ error }}</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="filteredProjects.length === 0" class="project-list__empty">
      <p>暂无项目</p>
    </div>

    <!-- 项目列表 -->
    <div v-else ref="gridRef" class="project-list__grid">
      <ContentCard
v-for="project in filteredProjects" :key="project.id" variant="project"
        :cover-image="project.coverImage" :cover-alt="project.title" :title="project.title"
        :description="project.description" :tags="project.techStack.map(t => t.name)" :max-tags="4"
        :featured="project.featured" :year="project.createdAt ? String(new Date(project.createdAt).getFullYear()) : ''"
        :link-url="project.demoUrl || project.liveUrl || ''" link-label="查看详情" :href="`/projects/${project.id}`"
        class="vs-reveal vs-reveal--stagger" @click="handleProjectClick(project)"
        @tag-click="(tag: string) => projectStore.searchProjects(tag)" />
    </div>
  </div>
</template>

<style scoped>
/* ============================================
   ProjectList — Visual System Migration Complete
   全部 --lv-* 已迁移至 --us-* tokens
   ============================================ */

.project-list {
  width: 100%;
}

/* 搜索框 */
.project-list__search {
  margin-bottom: var(--us-space-6);
}

.project-list__search-wrapper {
  position: relative;
  max-width: 480px;
}

.project-list__search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--us-text-tertiary);
  pointer-events: none;
}

.project-list__search-input {
  width: 100%;
  padding: var(--us-space-3) var(--us-space-10) var(--us-space-3) calc(var(--us-space-10) + var(--us-space-1));
  background-color: var(--us-surface);
  border: 1px solid var(--us-border);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: 400;
  color: var(--us-text-primary);
  outline: none;
  transition: border-color var(--us-duration-fast) var(--us-easing);
}

.project-list__search-input:focus-visible {
  border-color: var(--us-accent);
  box-shadow: 0 0 0 2px var(--us-accent-border);
}

.project-list__search-input::placeholder {
  color: var(--us-text-tertiary);
}

.project-list__search-clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  padding: var(--us-space-2);
  min-height: 28px;
  min-width: 28px;
  background: none;
  border: none;
  color: var(--us-text-tertiary);
  border-radius: var(--radius-sm);
  transition: color var(--us-duration-fast) var(--us-easing);
}

.project-list__search-clear:hover {
  color: var(--us-text-primary);
}

.project-list__search-clear-icon {
  width: 16px;
  height: 16px;
}

/* 加载骨架屏 */
.project-list__loading {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: var(--us-space-6);
}

.project-list__skeleton {
  background-color: var(--us-surface);
  border: 1px solid var(--us-border);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.project-list__skeleton-image {
  width: 100%;
  padding-top: 56.25%;
  background-color: var(--us-border);
  animation: pulse 1.5s ease-in-out infinite;
}

.project-list__skeleton-content {
  padding: var(--us-space-6);
}

.project-list__skeleton-title {
  width: 70%;
  height: 24px;
  background-color: var(--us-border);
  border-radius: var(--radius-sm);
  margin-bottom: var(--us-space-3);
  animation: pulse 1.5s ease-in-out infinite;
}

.project-list__skeleton-description {
  width: 100%;
  height: 16px;
  background-color: var(--us-border);
  border-radius: var(--radius-sm);
  margin-bottom: var(--us-space-2);
  animation: pulse 1.5s ease-in-out infinite;
}

.project-list__skeleton-tags {
  display: flex;
  gap: var(--us-space-2);
  margin-top: var(--us-space-4);
}

.project-list__skeleton-tags::before,
.project-list__skeleton-tags::after {
  content: '';
  width: 64px;
  height: 24px;
  background-color: var(--us-border);
  border-radius: var(--radius-sm);
  animation: pulse 1.5s ease-in-out infinite;
}

/* 错误/空状态 */
.project-list__error,
.project-list__empty {
  padding: var(--us-space-12);
  text-align: center;
  color: var(--us-text-secondary);
  font-size: var(--text-base);
}

/* 项目网格 */
.project-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: var(--us-space-6);
}

/* ── Scroll Reveal ── */
:deep(.vs-reveal) {
  opacity: 0;
  transform: translateY(24px);
  filter: blur(6px);
  transition:
    opacity 0.7s var(--us-easing-enter),
    transform 0.7s var(--us-easing-enter),
    filter 0.5s var(--us-easing-enter);
}

:deep(.vs-reveal.vs-reveal--visible) {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

:deep(.vs-reveal--stagger) {
  transition-delay: var(--stagger-delay, 0ms);
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
  .project-list__grid {
    grid-template-columns: 1fr;
    gap: var(--us-space-4);
  }

  .project-list__loading {
    grid-template-columns: 1fr;
    gap: var(--us-space-4);
  }

  .project-list__error,
  .project-list__empty {
    padding: var(--us-space-8);
  }

  /* Touch target enhancement — 44px for primary interactive elements */
  .project-list__search-clear {
    min-height: 44px;
    min-width: 44px;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .project-list__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .project-list__loading {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {

  .project-list__search-input,
  .project-list__search-clear,
  .project-list .vs-reveal {
    transition-duration: 0.01ms !important;
  }

  :deep(.vs-reveal) {
    opacity: 0 !important;
    transform: none !important;
    filter: none !important;
    transition: opacity var(--us-duration-fast) var(--us-easing) !important;
  }

  :deep(.vs-reveal.vs-reveal--visible) {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }

  :deep(.vs-reveal--stagger) {
    transition-delay: 0ms !important;
  }

  .project-list__skeleton-image,
  .project-list__skeleton-title,
  .project-list__skeleton-description,
  .project-list__skeleton-tags::before,
  .project-list__skeleton-tags::after {
    animation-duration: 0.01ms !important;
  }
}
</style>