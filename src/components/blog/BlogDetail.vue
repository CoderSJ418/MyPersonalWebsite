<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-vue-next'
import { useBlogStore } from '@/stores/useBlogStore'
import type { BlogPost } from '@/types/blog'
import { renderMarkdown, extractHeadings } from '@/utils/markdown'
import TableOfContents from './TableOfContents.vue'
import RelatedPosts from './RelatedPosts.vue'
import PostNavigation from './PostNavigation.vue'

interface Props {
  post: BlogPost
}

const props = defineProps<Props>()

const router = useRouter()
const blogStore = useBlogStore()

// 渲染后的 Markdown 内容（异步加载）
const renderedContent = ref('')
const isLoading = ref(true)

// 提取的标题（用于目录）
const headings = computed(() => {
  return extractHeadings(props.post.content)
})

// 异步渲染 Markdown 内容
onMounted(async () => {
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })

  // 异步渲染 Markdown
  try {
    renderedContent.value = await renderMarkdown(props.post.content)
  } catch (error) {
    console.error('Failed to render markdown:', error)
    renderedContent.value = renderMarkdownSync(props.post.content)
  } finally {
    isLoading.value = false
  }

  // 添加复制按钮事件监听（延迟执行，等待内容渲染完成）
  setTimeout(() => {
    const copyButtons = document.querySelectorAll('.code-copy')
    copyButtons.forEach((button) => {
      button.addEventListener('click', async () => {
        const code = button.getAttribute('data-code')
        if (code) {
          try {
            await navigator.clipboard.writeText(code)
            const span = button.querySelector('span')
            if (span) {
              const originalText = span.textContent
              span.textContent = '已复制'
              button.classList.add('copied')
              setTimeout(() => {
                span.textContent = originalText
                button.classList.remove('copied')
              }, 2000)
            }
          } catch (err) {
            console.error('Failed to copy code:', err)
          }
        }
      })
    })
  }, 100)
})

// 上一篇文章
const previousPost = computed(() => {
  return blogStore.getPreviousPost(props.post.id)
})

// 下一篇文章
const nextPost = computed(() => {
  return blogStore.getNextPost(props.post.id)
})

// 相关文章
const relatedPosts = computed(() => {
  return blogStore.getRelatedPosts(props.post.id, props.post.category, 5)
})

// 格式化日期
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 返回博客列表
const goBack = () => {
  router.push({ name: 'Blog' })
}

// 处理标签点击
const handleTagClick = (tag: string) => {
  router.push({ name: 'Blog', query: { tag } })
}
</script>

<template>
  <div class="blog-detail">
    <!-- 返回按钮 -->
    <button class="blog-detail__back" aria-label="返回博客列表" @click="goBack">
      <ArrowLeft :size="20" />
      <span>返回博客列表</span>
    </button>

    <!-- 文章头部 -->
    <header class="blog-detail__header">
      <!-- 文章分类 -->
      <div v-if="post.category" class="blog-detail__category">
        {{ post.category }}
      </div>

      <!-- 文章标题 -->
      <h1 class="blog-detail__title">{{ post.title }}</h1>

      <!-- 文章元信息 -->
      <div class="blog-detail__meta">
        <div class="blog-detail__meta-item">
          <Calendar :size="16" />
          <time :datetime="post.publishedAt">
            {{ formatDate(post.publishedAt) }}
          </time>
        </div>
        <div class="blog-detail__meta-item">
          <Clock :size="16" />
          <span>{{ post.readTime }} 分钟阅读</span>
        </div>
        <div v-if="post.author" class="blog-detail__meta-item">
          <span>{{ post.author }}</span>
        </div>
      </div>

      <!-- 文章标签 -->
      <div v-if="post.tags && post.tags.length > 0" class="blog-detail__tags">
        <Tag :size="16" />
        <div class="blog-detail__tags-list">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="tag"
            role="button"
            tabindex="0"
            @click="handleTagClick(tag)"
            @keydown.enter="handleTagClick(tag)"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </header>

    <!-- 文章内容区域 -->
    <div class="blog-detail__content-wrapper">
      <!-- 目录导航（桌面端显示在右侧，280px 宽度） -->
      <aside v-if="headings.length > 0" class="blog-detail__sidebar">
        <TableOfContents :headings="headings" />
      </aside>

      <!-- 文章正文 -->
      <article class="blog-detail__content">
        <!-- 加载状态 -->
        <div v-if="isLoading" class="blog-detail__loading">
          <div class="loading-spinner"></div>
          <p>正在加载内容...</p>
        </div>
        
        <!-- 渲染后的内容 -->
        <div 
          v-else 
          class="blog-detail__markdown" 
          v-html="renderedContent"
        ></div>
      </article>
    </div>

    <!-- 上一篇/下一篇导航 -->
    <PostNavigation :previous-post="previousPost" :next-post="nextPost" />

    <!-- 相关文章推荐 -->
    <RelatedPosts v-if="relatedPosts.length > 0" :posts="relatedPosts" />
  </div>
</template>

<style scoped>
.blog-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* 返回按钮 */
.blog-detail__back {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  margin-bottom: 2rem;
  font-size: 0.9375rem;
  color: var(--text-secondary);
  background-color: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.blog-detail__back:hover {
  color: var(--text-primary);
  background-color: var(--bg-tertiary);
  border-color: var(--accent-color);
  transform: translateY(-2px);
}

.blog-detail__back:focus {
  outline: 2px solid var(--accent-color);
  outline-offset: 2px;
}

/* 文章头部 */
.blog-detail__header {
  margin-bottom: 3rem;
  text-align: center;
}

.blog-detail__category {
  display: inline-block;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--accent-color);
  background-color: rgba(74, 144, 226, 0.1);
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.blog-detail__title {
  margin: 0 0 1.5rem 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
}

.blog-detail__meta {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
  font-size: 0.9375rem;
  color: var(--text-secondary);
}

.blog-detail__meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.blog-detail__tags {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.blog-detail__tags-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* 文章内容区域 - 280px 侧边栏 */
.blog-detail__content-wrapper {
  display: grid;
  grid-template-columns: 1fr minmax(280px, 280px);
  gap: 3rem;
  margin-bottom: 3rem;
}

.blog-detail__sidebar {
  position: sticky;
  top: 6rem;
  width: 280px;
  min-width: 280px;
  height: fit-content;
  max-height: calc(100vh - 8rem);
  overflow-y: auto;
}

.blog-detail__content {
  min-width: 0;
}

/* 加载状态样式 */
.blog-detail__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
  color: var(--text-secondary);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--border-color);
  border-top-color: var(--accent-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Markdown 内容样式 */
.blog-detail__markdown {
  font-size: 1rem;
  line-height: 1.75;
  color: var(--text-primary);
}

/* 代码块样式 */
.blog-detail__markdown :deep(.code-wrapper) {
  margin: 1.5rem 0;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
}

.blog-detail__markdown :deep(.code-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color);
}

.blog-detail__markdown :deep(.code-language) {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-family: 'JetBrains Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.blog-detail__markdown :deep(.code-copy) {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.blog-detail__markdown :deep(.code-copy:hover) {
  background-color: var(--bg-secondary);
  border-color: var(--text-secondary);
}

.blog-detail__markdown :deep(.code-copy.copied) {
  color: var(--accent-color);
  border-color: var(--accent-color);
}

.blog-detail__markdown :deep(.code-wrapper pre) {
  margin: 0;
  padding: 1.5rem;
  overflow-x: auto;
  background-color: var(--bg-secondary);
}

.blog-detail__markdown :deep(.code-wrapper code) {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--text-primary);
}

/* Markdown 内容内部样式 */
.blog-detail__markdown :deep(h1),
.blog-detail__markdown :deep(h2),
.blog-detail__markdown :deep(h3),
.blog-detail__markdown :deep(h4),
.blog-detail__markdown :deep(h5),
.blog-detail__markdown :deep(h6) {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
}

.blog-detail__markdown :deep(h1) {
  font-size: 2rem;
}

.blog-detail__markdown :deep(h2) {
  font-size: 1.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.blog-detail__markdown :deep(h3) {
  font-size: 1.5rem;
}

.blog-detail__markdown :deep(h4) {
  font-size: 1.25rem;
}

.blog-detail__markdown :deep(h5) {
  font-size: 1.125rem;
}

.blog-detail__markdown :deep(h6) {
  font-size: 1rem;
}

.blog-detail__markdown :deep(p) {
  margin: 1.25rem 0;
}

.blog-detail__markdown :deep(a) {
  color: var(--accent-color);
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 2px;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.blog-detail__markdown :deep(a:hover) {
  text-decoration-thickness: 3px;
}

.blog-detail__markdown :deep(ul),
.blog-detail__markdown :deep(ol) {
  margin: 1.25rem 0;
  padding-left: 2rem;
}

.blog-detail__markdown :deep(li) {
  margin: 0.5rem 0;
}

.blog-detail__markdown :deep(blockquote) {
  margin: 1.5rem 0;
  padding: 1rem 1.5rem;
  border-left: 4px solid var(--accent-color);
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
}

.blog-detail__markdown :deep(code) {
  padding: 0.125rem 0.375rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875em;
  color: var(--accent-color);
  background-color: var(--bg-tertiary);
  border-radius: 4px;
}

.blog-detail__markdown :deep(pre) {
  margin: 1.5rem 0;
}

.blog-detail__markdown :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 1.5rem 0;
  border-radius: 8px;
}

.blog-detail__markdown :deep(table) {
  width: 100%;
  margin: 1.5rem 0;
  border-collapse: collapse;
}

.blog-detail__markdown :deep(th),
.blog-detail__markdown :deep(td) {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  text-align: left;
}

.blog-detail__markdown :deep(th) {
  font-weight: 600;
  background-color: var(--bg-tertiary);
}

.blog-detail__markdown :deep(hr) {
  margin: 2rem 0;
  border: none;
  border-top: 1px solid var(--border-color);
}

/* 响应式 */
@media (max-width: 768px) {
  .blog-detail__content-wrapper {
    grid-template-columns: 1fr;
  }

  .blog-detail__sidebar {
    position: static;
    order: -1;
    max-height: none;
  }
}

@media (max-width: 768px) {
  .blog-detail {
    padding: 1.5rem;
  }

  .blog-detail__title {
    font-size: 1.875rem;
  }

  .blog-detail__meta {
    flex-direction: column;
    gap: 0.75rem;
  }

  .blog-detail__content-wrapper {
    gap: 2rem;
  }

  .blog-detail__markdown {
    font-size: 0.9375rem;
    line-height: 1.6;
  }

  .blog-detail__markdown :deep(h1) {
    font-size: 1.625rem;
  }

  .blog-detail__markdown :deep(h2) {
    font-size: 1.4375rem;
  }

  .blog-detail__markdown :deep(h3) {
    font-size: 1.25rem;
  }

  .blog-detail__markdown :deep(h4) {
    font-size: 1.125rem;
  }
}
</style>