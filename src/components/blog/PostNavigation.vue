<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { BlogPost } from '@/types/blog'

interface Props {
  previousPost: BlogPost | null
  nextPost: BlogPost | null
}

defineProps<Props>()

const router = useRouter()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const navigateToPost = (post: BlogPost) => {
  router.push({ name: 'BlogDetail', params: { id: post.id } })
}
</script>

<template>
  <nav class="post-navigation" aria-label="文章导航">
    <!-- 上一篇文章 -->
    <article
      v-if="previousPost"
      class="post-navigation__item post-navigation__item--prev"
      role="button"
      tabindex="0"
      :aria-label="`上一篇：${previousPost.title}`"
      @click="navigateToPost(previousPost)"
      @keydown.enter="navigateToPost(previousPost)"
    >
      <div class="post-navigation__icon">
        <ChevronLeft :size="20" />
      </div>
      <div class="post-navigation__content">
        <span class="post-navigation__label">上一篇</span>
        <h4 class="post-navigation__title">{{ previousPost.title }}</h4>
        <time :datetime="previousPost.publishedAt" class="post-navigation__date">
          {{ formatDate(previousPost.publishedAt) }}
        </time>
      </div>
    </article>

    <!-- 下一篇文章 -->
    <article
      v-if="nextPost"
      class="post-navigation__item post-navigation__item--next"
      role="button"
      tabindex="0"
      :aria-label="`下一篇：${nextPost.title}`"
      @click="navigateToPost(nextPost)"
      @keydown.enter="navigateToPost(nextPost)"
    >
      <div class="post-navigation__content">
        <span class="post-navigation__label">下一篇</span>
        <h4 class="post-navigation__title">{{ nextPost.title }}</h4>
        <time :datetime="nextPost.publishedAt" class="post-navigation__date">
          {{ formatDate(nextPost.publishedAt) }}
        </time>
      </div>
      <div class="post-navigation__icon">
        <ChevronRight :size="20" />
      </div>
    </article>
  </nav>
</template>

<style scoped>
.post-navigation {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 3rem;
  padding: 2rem 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
}

.post-navigation__item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.post-navigation__item:hover {
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.post-navigation__item:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.post-navigation__item--prev {
  justify-content: flex-start;
}

.post-navigation__item--next {
  justify-content: flex-end;
  text-align: right;
}

.post-navigation__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: var(--color-bg-tertiary);
  border-radius: 0.375rem;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.post-navigation__content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
}

.post-navigation__label {
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
  font-weight: 500;
}

.post-navigation__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-navigation__date {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

/* 响应式 */
@media (max-width: 768px) {
  .post-navigation {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1.5rem 0;
  }

  .post-navigation__item {
    padding: 1rem;
  }

  .post-navigation__title {
    font-size: 0.9375rem;
  }

  .post-navigation__icon {
    width: 2rem;
    height: 2rem;
  }

  .post-navigation__item--next {
    text-align: left;
  }
}
</style>
