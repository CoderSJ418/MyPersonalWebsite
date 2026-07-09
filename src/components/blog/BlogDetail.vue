<script setup lang="ts">
/**
 * BlogDetail — 博客详情页
 *
 * 重构要点：
 * - 使用 DetailNav 统一返回导航
 * - 使用 DetailHeader 统一头部排版（分类+标题+元数据+标签）
 * - 使用 DetailMeta 统一元数据行
 * - Unified Visual System v6.0
 * - 保留博客特有：Markdown渲染 + 目录 + 版权 + PostNavigation + RelatedPosts + Toast
 */

import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Share2, Link as LinkIcon } from 'lucide-vue-next'
import { useBlogStore } from '@/stores/useBlogStore'
import type { BlogPost } from '@/types/blog'
import { renderMarkdown, renderMarkdownSync, extractHeadings } from '@/utils/markdown'
import { formatDate } from '@/utils/format'
import DetailNav from '@/components/common/DetailNav.vue'
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import type { BreadcrumbItem } from '@/components/common/Breadcrumb.vue'
import DetailHeader from '@/components/common/DetailHeader.vue'
import type { MetaItem } from '@/components/common/DetailMeta.vue'
import TableOfContents from './TableOfContents.vue'
import BlogMarkdown from './BlogMarkdown.vue'
import BlogCopyright from './BlogCopyright.vue'
import RelatedPosts from './RelatedPosts.vue'
import PostNavigation from './PostNavigation.vue'
import ReadingProgress from './ReadingProgress.vue'

interface Props {
  post: BlogPost
}

const props = defineProps<Props>()

const router = useRouter()
const blogStore = useBlogStore()

// 渲染后的 Markdown 内容（异步加载）
const renderedContent = ref('')
const isLoadingContent = ref(true)
const showShareToast = ref(false)

// 提取的标题（用于目录）— 仅在 content 可用时提取
const headings = computed(() => {
  const content = props.post.content
  if (!content) return []
  return extractHeadings(content)
})

// 元数据项
const metaItems = computed<MetaItem[]>(() => {
  const items: MetaItem[] = []
  if (props.post.publishedAt) {
    items.push({
      icon: 'calendar',
      value: formatDate(props.post.publishedAt),
      datetime: props.post.publishedAt
    })
  }
  if (props.post.readTime) {
    items.push({ icon: 'clock', value: `${props.post.readTime} 分钟阅读` })
  }
  if (props.post.author) {
    items.push({ icon: 'user', value: props.post.author })
  }
  return items
})

// 异步渲染 Markdown 内容 — 支持 content 可选（两级加载）
onMounted(async () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })

  // If content is not loaded yet, show skeleton
  const content = props.post.content
  if (!content) {
    isLoadingContent.value = true
    return
  }

  try {
    renderedContent.value = await renderMarkdown(content)
  } catch (error) {
    renderedContent.value = renderMarkdownSync(content)
  } finally {
    isLoadingContent.value = false
  }
})

// Watch for content changes (when content is loaded async after mount)
watch(
  () => props.post.content,
  async (newContent) => {
    if (!newContent) {
      isLoadingContent.value = true
      renderedContent.value = ''
      return
    }

    try {
      renderedContent.value = await renderMarkdown(newContent)
    } catch (error) {
      renderedContent.value = renderMarkdownSync(newContent)
    } finally {
      isLoadingContent.value = false
    }
  }
)

// 代码复制处理（事件委托）
const handleContentClick = async (event: MouseEvent) => {
  const target = event.target
  if (!(target instanceof HTMLElement)) return
  const copyButton = target.closest('.code-copy')
  if (!(copyButton instanceof HTMLElement)) return
  const code = copyButton.dataset.code
  if (!code) return
  try {
    await navigator.clipboard.writeText(code)
    const span = copyButton.querySelector('span')
    if (span) {
      const originalText = span.textContent ?? '复制'
      span.textContent = '已复制'
      copyButton.classList.add('copied')
      setTimeout(() => {
        span.textContent = originalText
        copyButton.classList.remove('copied')
      }, 2000)
    }
  } catch (err) {
    // 剪贴板复制失败静默处理
  }
}

// 面包屑导航
const breadcrumbItems = computed<BreadcrumbItem[]>(() => [
  { text: '首页', path: '/' },
  { text: '博客', path: '/blog' },
  { text: props.post.title, path: `/blog/${props.post.id}`, disabled: true },
])

// 上一篇文章
const previousPost = computed(() => blogStore.getPreviousPost(props.post.id))
// 下一篇文章
const nextPost = computed(() => blogStore.getNextPost(props.post.id))
// 相关文章
const relatedPosts = computed(() => blogStore.getRelatedPosts(props.post.id, props.post.category, 5))

// 返回博客列表
const goBack = () => {
  router.push({ name: 'Blog' })
}

// 处理标签点击
const handleTagClick = (tag: string) => {
  router.push({ name: 'Blog', query: { tag } })
}

// 分享功能
const handleShare = async () => {
  const url = window.location.href
  if (navigator.share) {
    try {
      await navigator.share({ title: props.post.title, url })
    } catch { /* 用户取消 */ }
  } else {
    await navigator.clipboard.writeText(url)
    showShareToast.value = true
    setTimeout(() => { showShareToast.value = false }, 2000)
  }
}
</script>

<template>
  <div class="blog-detail">
    <!-- 阅读进度条 -->
    <ReadingProgress />

    <!-- 面包屑导航 -->
    <Breadcrumb :items="breadcrumbItems" />

    <!-- 顶部导航 -->
    <DetailNav back-label="返回" back-aria-label="返回博客列表" @back="goBack">
      <template #actions>
        <button class="blog-detail__share" aria-label="分享文章" @click="handleShare">
          <Share2 :size="16" />
        </button>
      </template>
    </DetailNav>

    <!-- 文章头部 -->
    <DetailHeader
layout="centered" :category="post.category" :title="post.title" :meta-items="metaItems"
      :tags="post.tags" @tag-click="handleTagClick"
      @category-click="(cat: string) => router.push({ name: 'Blog', query: { category: cat } })" />

    <!-- 文章内容区域 -->
    <div class="blog-detail__content-wrapper">
      <!-- 目录导航（桌面端显示在右侧） -->
      <aside v-if="headings.length > 0" class="blog-detail__sidebar">
        <TableOfContents :headings="headings" />
      </aside>

      <!-- 文章正文 -->
      <BlogMarkdown :content="renderedContent" :is-loading="isLoadingContent" @content-click="handleContentClick" />
    </div>

    <!-- 版权声明 -->
    <BlogCopyright />

    <!-- 上下篇导航 -->
    <PostNavigation :previous-post="previousPost" :next-post="nextPost" />

    <!-- 相关文章 -->
    <RelatedPosts
v-if="relatedPosts.length > 0" :posts="relatedPosts"
      @click="(post: BlogPost) => router.push({ name: 'BlogDetail', params: { id: post.id } })" />

    <!-- 分享成功提示 -->
    <transition name="toast">
      <div v-if="showShareToast" class="blog-detail__toast">
        <LinkIcon :size="14" />
        链接已复制到剪贴板
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* ===== 根容器 ===== */
.blog-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--us-space-8) var(--us-space-6);
}

/* ===== 分享按钮 ===== */
.blog-detail__share {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  color: var(--us-text-tertiary);
  background: var(--us-surface-hover);
  border: 1px solid var(--us-border);
  border-radius: var(--radius-lg);
  transition: color, background-color, border-color, opacity var(--us-duration-fast) var(--us-easing);
}

.blog-detail__share:hover {
  color: var(--us-accent);
  border-color: var(--us-accent);
}

.blog-detail__share:focus-visible {
  outline: 2px solid var(--us-accent);
  outline-offset: 2px;
}

/* ===== 内容区域 — 双栏 ===== */
.blog-detail__content-wrapper {
  display: grid;
  grid-template-columns: 1fr 240px;
  gap: var(--us-space-8);
  margin-bottom: var(--us-space-12);
}

.blog-detail__sidebar {
  position: sticky;
  top: 5rem;
  width: 240px;
  min-width: 240px;
  height: fit-content;
  max-height: calc(100vh - 7rem);
  overflow-y: auto;
  order: 2;
}

/* ===== 分享 Toast ===== */
.blog-detail__toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: var(--us-space-2);
  padding: var(--us-space-3) var(--us-space-5);
  font-size: 0.875rem;
  color: var(--us-text-primary);
  background: var(--us-surface-hover);
  border-radius: var(--radius-lg);
  box-shadow: var(--us-depth-2);
  z-index: var(--z-notification);
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity var(--us-duration-normal) var(--us-easing), transform var(--us-duration-normal) var(--us-easing);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .blog-detail {
    padding: var(--us-space-6) var(--us-space-4);
  }

  .blog-detail__content-wrapper {
    grid-template-columns: 1fr;
    gap: var(--us-space-8);
  }

  .blog-detail__sidebar {
    position: static;
    order: -1;
    max-height: none;
  }
}
</style>