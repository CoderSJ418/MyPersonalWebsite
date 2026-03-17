<template>
  <div class="blog-detail-page">
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBlogStore } from '@/stores/useBlogStore'
import BlogDetail from '@/components/blog/BlogDetail.vue'

const route = useRoute()
const blogStore = useBlogStore()

const loading = ref(false)
const error = ref<string | null>(null)

const post = computed(() => blogStore.getPostById(route.params.id as string))

// 加载文章数据
const loadPost = async () => {
  try {
    loading.value = true
    error.value = null
    await blogStore.loadPosts()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load post'
    console.error('Error loading post:', err)
  } finally {
    loading.value = false
  }
}

// 监听路由参数变化
watch(
  () => route.params.id,
  () => {
    loadPost()
  },
  { immediate: true }
)

onMounted(() => {
  loadPost()
})
</script>

<style scoped>
.blog-detail-page {
  min-height: 100vh;
  padding-top: 6rem;
  background-color: var(--bg-primary);
}

/* 加载状态 */
.blog-detail-page__loading {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-secondary) 25%,
    var(--bg-tertiary) 50%,
    var(--bg-secondary) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 0.5rem;
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
  margin: 4rem auto;
  padding: 3rem;
  text-align: center;
  background-color: var(--bg-secondary);
  border: 1px solid var(--error);
  border-radius: 0.5rem;
}

.blog-detail-page__error-title {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--error);
}

.blog-detail-page__error-message {
  margin: 0 0 2rem 0;
  color: var(--text-secondary);
}

.blog-detail-page__error-button {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.blog-detail-page__error-button:hover {
  background-color: var(--bg-tertiary);
  border-color: var(--color-primary);
}

/* 文章未找到 */
.blog-detail-page__not-found {
  max-width: 600px;
  margin: 4rem auto;
  padding: 3rem;
  text-align: center;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
}

.blog-detail-page__not-found-title {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.blog-detail-page__not-found-message {
  margin: 0 0 2rem 0;
  color: var(--text-secondary);
}

.blog-detail-page__not-found-button {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.blog-detail-page__not-found-button:hover {
  background-color: var(--bg-tertiary);
  border-color: var(--color-primary);
}

/* 响应式 */
@media (max-width: 768px) {
  .blog-detail-page {
    padding-top: 5rem;
  }

  .blog-detail-page__loading,
  .blog-detail-page__error,
  .blog-detail-page__not-found {
    padding: 2rem 1.5rem;
    margin: 2rem auto;
  }
}
</style>