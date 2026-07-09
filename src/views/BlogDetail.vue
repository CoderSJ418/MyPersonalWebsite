<template>
  <div class="pt-16 min-h-screen min-h-dvh" style="background-color: var(--us-bg-start)">
    <SEOHead
:title="post?.title || '文章详情'" :description="post?.excerpt || ''" type="article"
      :publish-date="post?.publishedAt" :modified-date="post?.updatedAt" :tags="post?.tags"
      :structured-data="post ? blogPostStructuredData(post) : undefined" />
    <!-- 加载状态 -->
    <div v-if="loading" class="blog-detail-page__loading">
      <div class="skeleton skeleton--header"></div>
      <div class="skeleton skeleton--content"></div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="blog-detail-page__error">
      <h2 class="blog-detail-page__error-title">加载失败</h2>
      <p class="blog-detail-page__error-message">{{ error }}</p>
      <button class="blog-detail-page__error-button" @click="$router.push({ name: 'Blog' })">
        返回博客列表
      </button>
    </div>

    <!-- 文章未找到 -->
    <div v-else-if="!post" class="blog-detail-page__not-found">
      <h2 class="blog-detail-page__not-found-title">文章未找到</h2>
      <p class="blog-detail-page__not-found-message">您访问的文章不存在或已被删除</p>
      <button class="blog-detail-page__not-found-button" @click="$router.push({ name: 'Blog' })">
        返回博客列表
      </button>
    </div>

    <!-- 文章内容 -->
    <BlogDetail v-else :post="post" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBlogStore } from '@/stores/useBlogStore'
import BlogDetail from '@/components/blog/BlogDetail.vue'
import SEOHead from '@/components/common/SEOHead.vue'
import { blogPostStructuredData } from '@/utils/structuredData'

const route = useRoute()
const blogStore = useBlogStore()

// Ensure metadata is loaded (sync, instant from blog-meta.json)
if (blogStore.posts.length === 0) {
  blogStore.loadPosts()
}

const loading = ref(false)
const error = ref<string | null>(null)

// Get post metadata from store (instant — from static index)
const post = computed(() => blogStore.getPostById(route.params.id as string))

// 加载文章完整内容（异步 — 按需加载单篇 .md）
const loadPost = async () => {
  try {
    loading.value = true
    error.value = null
    const postId = route.params.id as string

    // Load full content for this post
    const loadedPost = await blogStore.loadSinglePost(postId)
    if (!loadedPost) {
      error.value = '文章未找到'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load post'
  } finally {
    loading.value = false
  }
}

// 监听路由参数变化（immediate: true 已处理首次加载，无需 onMounted 重复调用）
watch(
  () => route.params.id,
  () => {
    loadPost()
  },
  { immediate: true }
)
</script>

<style scoped>
.blog-detail-page {
  min-height: 100vh;
  /* fallback for older browsers */
  min-height: 100dvh;
  /* dynamic viewport height for mobile */
  padding-top: 5rem;
  background-color: var(--us-bg-start);
}

@media (min-width: 768px) {
  .blog-detail-page {
    padding-top: 6rem;
  }
}

/* 加载状态 */
.blog-detail-page__loading {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--us-space-8) var(--us-space-6);
}

@media (min-width: 768px) {
  .blog-detail-page__loading {
    padding: var(--us-space-8);
  }
}

.skeleton {
  background: linear-gradient(90deg,
      var(--us-surface) 25%,
      var(--us-surface-hover) 50%,
      var(--us-surface) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: var(--radius-lg);
}

.skeleton--header {
  height: 200px;
  margin-bottom: 2rem;
}

.skeleton--content {
  height: 400px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

/* 错误状态 */
.blog-detail-page__error {
  max-width: 600px;
  margin: var(--us-space-8) auto;
  padding: var(--us-space-8) var(--us-space-6);
  text-align: center;
  background-color: var(--us-surface);
  border: 1px solid var(--error);
  border-radius: var(--radius-lg);
}

@media (min-width: 768px) {
  .blog-detail-page__error {
    margin: var(--us-space-16) auto;
    padding: var(--us-space-12);
  }
}

.blog-detail-page__error-title {
  margin: 0 0 var(--us-space-4) 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--error);
}

.blog-detail-page__error-message {
  margin: 0 0 var(--us-space-8) 0;
  color: var(--us-text-secondary);
}

.blog-detail-page__error-button {
  padding: var(--us-space-3) var(--us-space-8);
  font-size: 1rem;
  color: var(--us-text-primary);
  background-color: var(--us-bg-start);
  border: 1px solid var(--us-border);
  border-radius: var(--radius-lg);
  transition: color, background-color, border-color, opacity var(--us-duration-fast) var(--us-easing);
}

.blog-detail-page__error-button:hover {
  background-color: var(--us-surface-hover);
  border-color: var(--us-accent);
}

/* 文章未找到 */
.blog-detail-page__not-found {
  max-width: 600px;
  margin: var(--us-space-8) auto;
  padding: var(--us-space-8) var(--us-space-6);
  text-align: center;
  background-color: var(--us-surface);
  border: 1px solid var(--us-border);
  border-radius: var(--radius-lg);
}

@media (min-width: 768px) {
  .blog-detail-page__not-found {
    margin: var(--us-space-16) auto;
    padding: var(--us-space-12);
  }
}

.blog-detail-page__not-found-title {
  margin: 0 0 var(--us-space-4) 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--us-text-primary);
}

.blog-detail-page__not-found-message {
  margin: 0 0 var(--us-space-8) 0;
  color: var(--us-text-secondary);
}

.blog-detail-page__not-found-button {
  padding: var(--us-space-3) var(--us-space-8);
  font-size: 1rem;
  color: var(--us-text-primary);
  background-color: var(--us-bg-start);
  border: 1px solid var(--us-border);
  border-radius: var(--radius-lg);
  transition: color, background-color, border-color, opacity var(--us-duration-fast) var(--us-easing);
}

.blog-detail-page__not-found-button:hover {
  background-color: var(--us-surface-hover);
  border-color: var(--us-accent);
}
</style>