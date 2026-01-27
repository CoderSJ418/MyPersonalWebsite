<template>
  <article
    class="blog-card group relative bg-bg-card rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    tabindex="0"
    @click="handleClick"
    @keydown.enter="handleClick"
  >
    <!-- 封面图 - 16:9 比例 -->
    <div v-if="post.coverImage" class="relative aspect-video overflow-hidden bg-bg-secondary">
      <img
        :src="post.coverImage"
        :alt="post.title"
        loading="lazy"
        decoding="async"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-bg-card/80 to-transparent" />
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
      <div class="flex items-center gap-4 mb-3 text-sm text-text-secondary">
        <span class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          {{ formatDate(post.publishedAt) }}
        </span>
        <span class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          {{ post.readTime }} 分钟
        </span>
      </div>

      <!-- 标题 -->
      <h2
        class="text-xl font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-theme-primary transition-colors"
      >
        {{ post.title }}
      </h2>

      <!-- 摘要 -->
      <p class="text-base text-text-secondary mb-4 line-clamp-3">
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
}

.blog-card:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--accent-color);
}
</style>