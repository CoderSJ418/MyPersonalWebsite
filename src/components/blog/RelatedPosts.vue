<script setup lang="ts">
import type { BlogPost } from '@/types/blog'

interface Props {
  posts: BlogPost[]
  title?: string
}

withDefaults(defineProps<Props>(), {
  title: '相关文章'
})

const emit = defineEmits<{
  click: [post: BlogPost]
}>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const handlePostClick = (post: BlogPost) => {
  emit('click', post)
}
</script>

<template>
  <div class="related-posts">
    <h3 class="related-posts__title">{{ title }}</h3>
    <div class="related-posts__list">
      <article
        v-for="post in posts"
        :key="post.id"
        class="related-posts__item"
        role="button"
        tabindex="0"
        :aria-label="`阅读文章：${post.title}`"
        @click="handlePostClick(post)"
        @keydown.enter="handlePostClick(post)"
      >
        <div class="related-posts__item-content">
          <h4 class="related-posts__item-title">{{ post.title }}</h4>
          <p class="related-posts__item-excerpt">{{ post.excerpt }}</p>
          <div class="related-posts__item-meta">
            <time :datetime="post.publishedAt" class="related-posts__item-date">
              {{ formatDate(post.publishedAt) }}
            </time>
            <span class="related-posts__item-read-time"> {{ post.readTime }} 分钟阅读 </span>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.related-posts {
  margin-top: 3rem;
  padding: 2rem;
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
}

.related-posts__title {
  margin: 0 0 1.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.related-posts__list {
  display: grid;
  gap: 1.5rem;
}

.related-posts__item {
  padding: 1.25rem;
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.related-posts__item:hover {
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.related-posts__item:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.related-posts__item-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.related-posts__item-title {
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.4;
}

.related-posts__item-excerpt {
  margin: 0;
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-posts__item-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
}

.related-posts__item-date,
.related-posts__item-read-time {
  display: flex;
  align-items: center;
}

/* 响应式 */
@media (max-width: 768px) {
  .related-posts {
    padding: 1.5rem;
    margin-top: 2rem;
  }

  .related-posts__title {
    font-size: 1.125rem;
  }

  .related-posts__item {
    padding: 1rem;
  }

  .related-posts__item-title {
    font-size: 1rem;
  }

  .related-posts__item-excerpt {
    font-size: 0.875rem;
  }
}
</style>
