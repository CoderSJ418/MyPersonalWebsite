<script setup lang="ts">
/**
 * DetailHeader — 详情页通用头部组件
 *
 * 职责：
 * - 居中排版头部：分类pill + 标题 + 描述 + 元数据行 + 标签区
 * - 通过Props + slots适配blog/project差异
 * - 支持封面图（project模式侧栏布局，blog模式隐藏封面）
 * - BEM `dh` 前缀，新CSS变量体系，深色模式
 *
 * 设计灵感：
 * - Apple: 居中排版 + 大量留白 + 分类pill渐变填充
 * - Stripe: 标题letter-spacing -0.02em + 排版韵律
 * - Josh Comeau: 标签微交互 + 可访问性
 */

import DetailMeta from './DetailMeta.vue'
import SafeImage from './SafeImage.vue'

interface MetaItem {
  icon?: string
  label?: string
  value: string
}

interface Props {
  /** 分类文本 */
  category?: string
  /** 标题 */
  title: string
  /** 描述 */
  description?: string
  /** 元数据项列表 */
  metaItems?: MetaItem[]
  /** 标签列表 */
  tags?: string[]
  /** 封面图URL（project模式） */
  coverImage?: string
  /** 封面图alt */
  coverAlt?: string
  /** 是否精选 */
  featured?: boolean
  /** 布局模式：centered(博客) | side-by-side(项目) */
  layout?: 'centered' | 'side-by-side'
}

withDefaults(defineProps<Props>(), {
  category: '',
  description: '',
  metaItems: () => [],
  tags: () => [],
  coverImage: '',
  coverAlt: '',
  featured: false,
  layout: 'centered'
})

const emit = defineEmits<{
  'tag-click': [tag: string]
  'category-click': [category: string]
}>()
</script>

<template>
  <header class="dh" :class="`dh--${layout}`">
    <!-- 封面图（side-by-side模式） -->
    <div v-if="layout === 'side-by-side' && coverImage" class="dh__cover">
      <SafeImage :src="coverImage" :alt="coverAlt || title" image-class="dh__cover-image" object-fit="cover" />
      <span v-if="featured" class="dh__featured">精选项目</span>
    </div>

    <div class="dh__body">
      <div class="dh__inner" :class="layout === 'centered' ? 'dh__inner--centered' : ''">
        <!-- 分类pill -->
        <span
v-if="category" class="dh__category" role="button" tabindex="0" @click="emit('category-click', category)"
          @keydown.enter="emit('category-click', category)">
          {{ category }}
        </span>

        <!-- 标题 -->
        <h1 class="dh__title">{{ title }}</h1>

        <!-- 描述 -->
        <p v-if="description" class="dh__description">{{ description }}</p>

        <!-- 元数据行 -->
        <DetailMeta v-if="metaItems.length > 0" :items="metaItems" />

        <!-- 标签区 -->
        <div v-if="tags.length > 0" class="dh__tags">
          <span
v-for="tag in tags" :key="tag" class="dh__tag" role="button" tabindex="0"
            @click="emit('tag-click', tag)" @keydown.enter="emit('tag-click', tag)">
            {{ tag }}
          </span>
        </div>

        <!-- 链接操作区插槽（project模式放链接按钮） -->
        <div v-if="$slots.links" class="dh__links">
          <slot name="links" />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* ===== 根容器 ===== */
.dh {
  margin-bottom: var(--us-space-12);
}

.dh--centered {
  text-align: center;
}

.dh--side-by-side {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--us-space-8);
}

/* ===== 封面区 ===== */
.dh__cover {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  background: var(--us-surface-hover);
  border-radius: var(--radius-xl, 1rem);
  overflow: hidden;
}

.dh__cover :deep(.image-wrapper) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.dh__cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--us-duration-normal) var(--us-easing);
}

.dh__cover:hover :deep(.dh__cover-image) {
  transform: scale(1.02);
}

.dh__featured {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: var(--us-space-2) var(--us-space-4);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--us-text-primary);
  background: var(--us-accent);
  border-radius: var(--radius-md, 0.375rem);
  box-shadow: var(--us-depth-1);
}

/* ===== 主体区 ===== */
.dh__body {
  display: flex;
  flex-direction: column;
  gap: var(--us-space-5);
}

.dh__inner {
  display: flex;
  flex-direction: column;
  gap: var(--us-space-4);
}

.dh__inner--centered {
  max-width: var(--measure-normal);
  margin: 0 auto;
  align-items: center;
}

/* ===== 分类pill ===== */
.dh__category {
  display: inline-block;
  padding: var(--us-space-1) var(--us-space-3);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--us-accent);
  background: var(--us-accent-subtle);
  border: 1px solid var(--us-accent-border);
  border-radius: var(--radius-md, 0.375rem);
  cursor: pointer;
  transition: color, background-color, border-color, opacity var(--us-duration-fast) var(--us-easing);
}

.dh__category:hover {
  background: var(--us-accent-border);
  border-color: var(--us-accent-border);
  transform: translateY(-1px);
  box-shadow: var(--us-depth-2-hover);
}

.dh__category:active {
  transform: scale(0.95);
  box-shadow: var(--us-depth-1);
}

/* ===== 标题 ===== */
.dh__title {
  margin: 0;
  font-size: 2.75rem;
  font-weight: 600;
  line-height: var(--leading-tight);
  color: var(--us-text-primary);
  letter-spacing: -0.025em;
}

/* ===== 描述 ===== */
.dh__description {
  margin: 0;
  font-size: 1.125rem;
  line-height: var(--leading-relaxed);
  color: var(--us-text-secondary);
}

.dh--centered .dh__description {
  max-width: 600px;
}

/* ===== 标签区 ===== */
.dh__tags {
  display: flex;
  align-items: center;
  gap: var(--us-space-2);
  flex-wrap: wrap;
}

.dh--centered .dh__tags {
  justify-content: center;
}

.dh__tag {
  padding: var(--us-space-1) var(--us-space-2);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--us-text-tertiary);
  background: var(--us-surface-hover);
  border-radius: var(--radius-md, 0.375rem);
  cursor: pointer;
  transition: color var(--us-duration-fast) var(--us-easing), background var(--us-duration-fast) var(--us-easing), transform var(--us-duration-fast) var(--us-easing);
}

.dh__tag:hover {
  color: var(--us-accent);
  background: var(--us-accent-subtle);
  transform: translateY(-1px);
  box-shadow: var(--us-depth-2-hover);
}

.dh__tag:active {
  transform: scale(0.95);
  box-shadow: var(--us-depth-1);
}

/* ===== 链接区 ===== */
.dh__links {
  display: flex;
  gap: var(--us-space-3);
  flex-wrap: wrap;
  margin-top: var(--us-space-2);
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .dh__title {
    font-size: 2rem;
  }

  .dh__description {
    font-size: 1rem;
  }
}

@media (min-width: 1025px) {
  .dh--side-by-side {
    grid-template-columns: 1fr 1fr;
  }
}
</style>