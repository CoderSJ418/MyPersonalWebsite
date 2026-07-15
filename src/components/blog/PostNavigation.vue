<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { BlogPost } from '@/types/blog'
import { formatDate } from '@/utils/format'

interface Props {
  previousPost: BlogPost | null
  nextPost: BlogPost | null
}

defineProps<Props>()

const router = useRouter()

const getPostHref = (post: BlogPost) => `/blog/${post.id}`

const navigateToPost = (post: BlogPost, event: MouseEvent) => {
  event.preventDefault()
  router.push({ name: 'BlogDetail', params: { id: post.id } })
}
</script>

<template>
  <nav class="post-navigation" aria-label="文章导航">
    <!-- 上一篇文章 -->
    <a
v-if="previousPost" class="post-navigation__item post-navigation__item--prev" :href="getPostHref(previousPost)"
      :aria-label="`上一篇：${previousPost.title}`" @click="navigateToPost(previousPost, $event)">
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
    </a>

    <!-- 下一篇文章 -->
    <a
v-if="nextPost" class="post-navigation__item post-navigation__item--next" :href="getPostHref(nextPost)"
      :aria-label="`下一篇：${nextPost.title}`" @click="navigateToPost(nextPost, $event)">
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
    </a>
  </nav>
</template>

<style scoped>
.post-navigation {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  min-width: 0;
  gap: var(--us-space-6);
  margin-top: var(--us-space-12);
  padding: var(--us-space-8) 0;
  border-top: 1px solid var(--us-border);
  border-bottom: 1px solid var(--us-border);
}

.post-navigation__item {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: var(--us-space-4);
  padding: var(--us-space-5);
  background-color: var(--us-surface-hover);
  border: 1px solid var(--us-border);
  border-radius: var(--radius-lg);
  /* Reset <a> defaults */
  text-decoration: none;
  color: inherit;
  transition: transform, box-shadow, color, background-color, border-color, opacity var(--us-duration-fast) var(--us-easing);
}

.post-navigation__item:hover {
  border-color: var(--us-accent);
  box-shadow: var(--us-depth-1);
  transform: translateY(var(--us-lift-sm));
}

.post-navigation__item:active {
  transform: scale(0.95);
}

.post-navigation__item:focus-visible {
  outline: 2px solid var(--us-accent);
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
  background-color: var(--us-surface-hover);
  border-radius: var(--radius-md);
  color: var(--us-text-secondary);
  flex-shrink: 0;
}

.post-navigation__content {
  display: flex;
  flex-direction: column;
  gap: var(--us-space-2);
  flex: 1;
  min-width: 0;
}

.post-navigation__label {
  font-size: 0.875rem;
  color: var(--us-text-tertiary);
  font-weight: 500;
}

.post-navigation__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--us-text-primary);
  line-height: var(--leading-snug);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-navigation__date {
  font-size: 0.875rem;
  color: var(--us-text-secondary);
}

/* 响应式 */
@media (max-width: 768px) {
  .post-navigation {
    grid-template-columns: minmax(0, 1fr);
    gap: var(--us-space-4);
    padding: var(--us-space-6) 0;
  }

  .post-navigation__item {
    padding: var(--us-space-4);
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
