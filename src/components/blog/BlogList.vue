<template>
  <div class="blog-list">
    <!-- 加载状态 -->
    <div v-if="loading" class="blog-list__loading">
      <SkeletonLoader type="card" :count="itemsPerPage" />
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="blog-list__error">
      <div class="blog-list__error-content">
        <AlertCircle :size="48" class="blog-list__error-icon" />
        <h3 class="blog-list__error-title">加载失败</h3>
        <p class="blog-list__error-message">{{ error }}</p>
        <button
          type="button"
          class="blog-list__retry-button"
          @click="handleRetry"
        >
          重试
        </button>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="posts.length === 0" class="blog-list__empty">
      <div class="blog-list__empty-content">
        <FileText :size="48" class="blog-list__empty-icon" />
        <h3 class="blog-list__empty-title">暂无文章</h3>
        <p class="blog-list__empty-message">还没有发布任何文章</p>
      </div>
    </div>

    <!-- 文章列表 -->
    <div v-else>
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        role="list"
        aria-label="文章列表"
      >
        <BlogCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
          role="listitem"
          @click="handlePostClick"
          @tag-click="handleTagClick"
        />
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="mt-8 md:mt-12">
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BlogPost } from '@/types/blog'
import { AlertCircle, FileText } from 'lucide-vue-next'
import BlogCard from './BlogCard.vue'
import Pagination from '@/components/common/Pagination.vue'
import SkeletonLoader from '@/components/common/SkeletonLoader.vue'

interface Props {
  posts: BlogPost[]
  currentPage: number
  totalPages: number
  loading?: boolean
  error?: string | null
  itemsPerPage?: number
}

interface Emits {
  (e: 'post-click', post: BlogPost): void
  (e: 'tag-click', tag: string): void
  (e: 'page-change', page: number): void
  (e: 'retry'): void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  itemsPerPage: 10
})

const emit = defineEmits<Emits>()

const handlePostClick = (post: BlogPost) => {
  emit('post-click', post)
}

const handleTagClick = (tag: string) => {
  emit('tag-click', tag)
}

const handlePageChange = (page: number) => {
  emit('page-change', page)
  // 滚动到列表顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleRetry = () => {
  emit('retry')
}
</script>

<style scoped>
.blog-list {
  min-height: 400px;
}

.blog-list__loading,
.blog-list__error,
.blog-list__empty {
  display: flex;
  align-items: center;
  justify-content: center;
}

.blog-list__loading {
  min-height: 600px;
}

.blog-list__error,
.blog-list__empty {
  min-height: 400px;
}

.blog-list__error-content,
.blog-list__empty-content {
  text-align: center;
  padding: 3rem 1rem;
}

.blog-list__error-icon {
  margin: 0 auto 1rem;
  color: #ef4444;
}

.blog-list__error-title {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.blog-list__error-message {
  margin: 0 0 1.5rem;
  font-size: 1rem;
  color: var(--text-secondary);
}

.blog-list__retry-button {
  padding: 0.5rem 1.5rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: white;
  background: var(--primary-500);
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.blog-list__retry-button:hover {
  background: var(--primary-600);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.blog-list__empty-icon {
  margin: 0 auto 1rem;
  color: var(--text-tertiary);
}

.blog-list__empty-title {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.blog-list__empty-message {
  margin: 0;
  font-size: 1rem;
  color: var(--text-secondary);
}

/* 响应式优化 */
@media (max-width: 767px) {
  .blog-list {
    gap: 1rem;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .blog-list {
    gap: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .blog-list {
    gap: 2rem;
  }
}
</style>
