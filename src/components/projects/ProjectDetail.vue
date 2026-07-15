<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/useProjectStore'
import type { ProjectDetail as ProjectDetailType } from '@/types/project'
import { getRecruitView, getReaderView } from '@/composables/useProjectProjection'
import { useViewMode } from '@/composables/useViewMode'
import DetailLayout from '@/components/common/DetailLayout.vue'
import DetailNav from '@/components/common/DetailNav.vue'
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import type { BreadcrumbItem } from '@/components/common/Breadcrumb.vue'
import ReadingProgress from '@/components/blog/ReadingProgress.vue'
import ProjectDetailHeader from './ProjectDetailHeader.vue'
import ProjectDetailContent from './ProjectDetailContent.vue'
import ProjectDetailRelated from './ProjectDetailRelated.vue'
import ProjectNarrative from './ProjectNarrative.vue'
import ProjectCaseContext from './ProjectCaseContext.vue'
import ProjectViewModeSwitch from './ProjectViewModeSwitch.vue'

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()
const { viewMode: _viewMode, isRecruit, isReader, switchToRecruit, switchToReader } = useViewMode()

const project = computed<ProjectDetailType | null>(() =>
  projectStore.getProjectDetail(route.params.id as string)
)
const loading = computed(() => projectStore.loading)
const error = computed(() => projectStore.error)
const relatedProjects = computed(() => projectStore.getRelatedProjects(route.params.id as string))

/** Projection: Source → Contract */
const recruitView = computed(() => (project.value ? getRecruitView(project.value) : null))
const readerView = computed(() => (project.value ? getReaderView(project.value) : null))

/** 是否有narrative（决定Recruit Mode是否可用） */
const hasNarrative = computed(() => recruitView.value !== null)

/** 面包屑导航 */
const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
  if (!project.value) return []
  return [
    { text: '首页', path: '/' },
    { text: '项目', path: '/projects' },
    { text: project.value.title, path: `/projects/${project.value.id}`, disabled: true }
  ]
})

/** 切换项目时重置为recruit模式 */
watch(
  () => route.params.id,
  () => {
    switchToRecruit()
  }
)

const handleBack = () => {
  router.push('/projects')
}

const handleRetry = () => {
  if (route.params.id) {
    projectStore.loadProjectDetail(route.params.id as string)
  }
}

const handleTechStackClick = (techName: string) => {
  projectStore.filterByTechStack([techName])
  router.push('/projects')
}

const handleRelatedNavigate = (projectId: string) => {
  router.push(`/projects/${projectId}`)
}

onMounted(() => {
  if (route.params.id) {
    projectStore.loadProjectDetail(route.params.id as string)
  }
})
</script>

<template>
  <DetailLayout
    :loading="loading"
    :error="error"
    :not-found="!project && !loading && !error"
    not-found-text="项目不存在"
    @back="handleBack"
    @retry="handleRetry"
  >
    <template #progress>
      <ReadingProgress />
    </template>

    <!-- 面包屑导航 -->
    <Breadcrumb v-if="project" :items="breadcrumbItems" />

    <!-- ===== 决策层：招聘者10秒判断信息 ===== -->

    <!-- 有narrative + Recruit Mode：Narrative替代Header -->
    <ProjectNarrative
      v-if="hasNarrative && isRecruit && recruitView"
      :data="recruitView"
      density="recruit"
    />

    <!-- 无narrative回退：传统Header -->
    <ProjectDetailHeader
      v-if="!hasNarrative && project"
      :project="project"
      @tech-stack-click="handleTechStackClick"
    />

    <!-- Reader Mode：Narrative(导读) + Details -->
    <template v-if="hasNarrative && isReader && readerView">
      <ProjectNarrative :data="readerView" density="reader" />
    </template>

    <ProjectViewModeSwitch
      v-if="hasNarrative"
      :is-recruit="isRecruit"
      :is-reader="isReader"
      @select-recruit="switchToRecruit"
      @select-reader="switchToReader"
    />

    <ProjectCaseContext v-if="isRecruit && recruitView" :data="recruitView" density="recruit" />
    <template v-if="isReader && readerView">
      <ProjectCaseContext :data="readerView" density="reader" />
      <ProjectDetailContent :data="readerView" />
    </template>

    <!-- 无narrative时始终显示Details -->
    <ProjectDetailContent v-if="!hasNarrative && readerView" :data="readerView" />

    <ProjectDetailRelated
      v-if="relatedProjects.length > 0"
      :projects="relatedProjects"
      @navigate="handleRelatedNavigate"
    />

    <!-- ===== 非决策层：行为控制（降级） ===== -->
    <div class="pn-demoted">
      <!-- 导航 — 降级为非决策信息，不抢占第一屏注意力 -->
      <DetailNav back-label="返回作品集" back-aria-label="返回项目列表" @back="handleBack" />
    </div>
  </DetailLayout>
</template>

<style scoped>
/* ═══════════════════════════════════════════════════════
   Project Detail Container — Unified System v3.0
   us-* tokens + component-level private tokens
   ═══════════════════════════════════════════════════════ */

/* ─── Demoted Area — 行为控制不抢占决策注意力 ─────────── */
.pn-demoted {
  margin-top: var(--us-space-6);
  padding-top: var(--us-space-2);
  border-top: 1px solid var(--us-border);
  display: flex;
  flex-direction: column;
  gap: var(--us-space-2);
}
</style>
