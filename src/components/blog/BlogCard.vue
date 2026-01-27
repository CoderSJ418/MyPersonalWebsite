<template>
  <article
    class="blog-card group relative overflow-hidden"
    tabindex="0"
    @click="handleClick"
    @keydown.enter="handleClick"
  >
    <!-- 封面图 - 16:9 比例 -->
    <div v-if="post.coverImage" class="blog-card__cover">
      <img
        :src="post.coverImage"
        :alt="post.title"
        loading="lazy"
        decoding="async"
        class="blog-card__cover-image"
      />
      <div class="blog-card__cover-gradient" />
    </div>

    <div class="p-6">
      <!-- 分类标签 -->
      <div class="mb-3">
        <span
          class="tag"
          @click.stop="handleCategoryClick(post.category)"
        >
          {{ post.category }}
        </span>
      </div>

      <!-- 元数据 -->
      <div class="blog-card__meta">
        <span class="blog-card__meta-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          {{ formatDate(post.publishedAt) }}
        </span>
        <span class="blog-card__meta-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          {{ post.readTime }} 分钟
        </span>
      </div>

      <!-- 标题 -->
      <h2 class="blog-card__title">
        {{ post.title }}
      </h2>

      <!-- 摘要 -->
      <p class="blog-card__excerpt">
        {{ post.excerpt }}
      </p>

      <!-- 标签 -->
      <div v-if="showTags && post.tags && post.tags.length > 0" class="flex flex-wrap gap-2">
        <span
          v-for="tag in post.tags.slice(0, 3)"
          :key="tag"
          class="tag"
          @click.stop="handleTagClick(tag)"
        >
          {{ tag }}
        </span>
        <span
          v-if="post.tags && post.tags.length > 3"
          class="tag"
        >
          +{{ post.tags.length - 3 }}
        </span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { BlogPost } from '@/types/blog'

interface Props {
  post: BlogPost
  showTags?: boolean
}

interface Emits {
  (e: 'click', post: BlogPost): void
  (e: 'tag-click', tag: string): void
  (e: 'category-click', category: string): void
}

const props = withDefaults(defineProps<Props>(), {
  showTags: true
})

const emit = defineEmits<Emits>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleClick = () => {
  emit('click', props.post)
}

const handleTagClick = (tag: string) => {
  emit('tag-click', tag)
}

const handleCategoryClick = (category: string) => {
  emit('category-click', category)
}
</script>

<style scoped>
.blog-card {
  cursor: pointer;
  background: var(--surface-1);
  border-radius: 1rem;
  border: 1px solid var(--border-default);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.blog-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.blog-card:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--accent-color);
}

.blog-card__cover {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
  background: var(--surface-2);
}

.blog-card__cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

.blog-card:hover .blog-card__cover-image {
  transform: scale(1.05);
}

.blog-card__cover-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(var(--surface-1-rgb), 0.8), transparent);
}

.blog-card__meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.blog-card__meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.blog-card__title {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.blog-card:hover .blog-card__title {
  color: var(--primary-500);
}

.blog-card__excerpt {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-secondary);
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--primary-500);
  background: rgba(var(--primary-500-rgb), 0.1);
  border-radius: 9999px;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.tag:hover {
  background: var(--primary-500);
  color: white;
}
</style>