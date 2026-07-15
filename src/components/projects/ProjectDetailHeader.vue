<script setup lang="ts">
/**
 * ProjectDetailHeader — 项目详情头部
 *
 * 重构：使用 DetailHeader + DetailMeta 通用组件
 * - side-by-side 布局（封面图 + 信息区）
 * - 技术栈标签通过 DetailHeader tags 渲染
 * - 链接按钮通过 links 插槽渲染
 */

import { computed } from 'vue'
import type { ProjectDetail as ProjectDetailType } from '@/types/project'
import DetailHeader from '@/components/common/DetailHeader.vue'
import type { MetaItem } from '@/components/common/DetailMeta.vue'
import { formatDate } from '@/utils/format'

interface Props {
  project: ProjectDetailType
}

const props = defineProps<Props>()

const emit = defineEmits<{
  techStackClick: [techName: string]
}>()

/** 元数据项 */
const metaItems = computed<MetaItem[]>(() => {
  const items: MetaItem[] = [
    { icon: 'layers', value: props.project.category }
  ]
  if (props.project.createdAt) {
    items.push({
      icon: 'calendar',
      value: formatDate(props.project.createdAt),
      datetime: props.project.createdAt
    })
  }
  return items
})

/** 技术栈标签 */
const techTags = computed(() =>
  props.project.techStack.map(t => t.version ? `${t.name} ${t.version}` : t.name)
)

const handleTagClick = (tag: string) => {
  // 从 "Vue 3.4" 格式中提取技术名
  const techName = tag.split(' ')[0]
  emit('techStackClick', techName)
}
</script>

<template>
  <DetailHeader
layout="side-by-side" :category="project.category" :title="project.title"
    :description="project.description" :cover-image="project.coverImage" :cover-alt="project.title"
    :featured="project.featured" :meta-items="metaItems" :tags="techTags" @tag-click="handleTagClick">
    <template #links>
      <a
v-if="project.demoUrl" :href="project.demoUrl" target="_blank" rel="noopener noreferrer"
        class="pdh__link pdh__link--primary">
        查看演示
      </a>
      <a
v-if="project.githubUrl" :href="project.githubUrl" target="_blank" rel="noopener noreferrer"
        class="pdh__link pdh__link--secondary">
        查看源码
      </a>
    </template>
  </DetailHeader>
</template>

<style scoped>
/* ===== 链接按钮 ===== */
.pdh__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--us-space-3) var(--us-space-6);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: var(--radius-xl);
  transition: transform, box-shadow, opacity, color, background-color, border-color var(--us-duration-fast) var(--us-easing);
}

.pdh__link:active {
  transform: scale(0.95);
}

.pdh__link:hover {
  color: var(--us-text-primary);
  background: var(--us-accent);
  box-shadow: var(--us-depth-1);
}

.pdh__link--primary:hover {
  background: var(--us-accent);
  transform: translateY(var(--us-lift-sm));
  box-shadow: var(--us-depth-2);
}

.pdh__link--secondary {
  color: var(--us-text-secondary);
  background: var(--us-surface-hover);
  border: 1px solid var(--us-border);
}

.pdh__link--secondary:hover {
  color: var(--us-text-primary);
  border-color: var(--us-accent);
  transform: translateY(var(--us-lift-sm));
}

/* ===== 响应式 ===== */
</style>