<template>
  <div class="blog-page">
    <SEOHead title="技术博客" description="分享 Vue 3、TypeScript、前端工程化等技术文章" />

    <!-- ═══════════════════════════════════════════════════════════
         Blog Hero — Visual Anchor · Section级光源投影
         ═══════════════════════════════════════════════════════════
         Blog Hero = Section级光效 (intensity 0.6)
         光源: --global-light-x/y (viewport %)
         由 useCursorInteraction 统一设置 on <html>
         禁止独立 mouse tracking
         ═══════════════════════════════════════════════════════════ -->
    <section ref="heroRef" class="blog-hero vs-light-section">
      <!-- Layer 0: Background Canvas — Max 2 visual effects per element (unified-system.css)
           REMOVED: Canvas noise texture — exceeded Max 2 rule
           REMOVED: Mesh gradient cursor distortion — exceeded Max 2 rule
           KEPT: Global light follow — core interaction sense -->
      <div class="blog-hero__canvas" aria-hidden="true" data-parallax="slow">
        <!-- Global Light Follow — uses --global-light-x/y from <html> -->
        <div class="blog-hero__mouse-light"></div>
      </div>

      <!-- Layer 1: Ambient Motion — single subtle blob -->
      <div class="blog-hero__ambient" aria-hidden="true" data-parallax="slow">
        <div class="blog-hero__blob"></div>
      </div>

      <!-- Layer 2: Content — floats above the light field -->
      <div class="blog-hero__container">
        <!-- Glassmorphism Badge -->
        <div class="blog-hero__badge vs-reveal" style="--stagger-delay: 0ms">
          <span class="blog-hero__badge-dot"></span>
          <span class="blog-hero__badge-text">Engineering Notes</span>
        </div>

        <!-- Gradient Title -->
        <h1 class="blog-hero__title vs-reveal vs-reveal--stagger" style="--stagger-delay: 60ms">
          分享知识<span class="blog-hero__accent">·</span>记录成长
        </h1>

        <!-- Subtitle -->
        <p class="blog-hero__subtitle vs-reveal vs-reveal--stagger" style="--stagger-delay: 120ms">
          Vue 3、TypeScript、前端工程化 — 每篇文章都是一次 Engineering Breakdown
        </p>

        <!-- Proof Chips — glassmorphism stat cards -->
        <div class="blog-hero__chips vs-reveal vs-reveal--stagger" style="--stagger-delay: 180ms">
          <div class="blog-hero__chip">
            <span class="blog-hero__chip-value">{{ blogStore.posts.length }}</span>
            <span class="blog-hero__chip-label">篇文章</span>
          </div>
          <div class="blog-hero__chip">
            <span class="blog-hero__chip-value">{{ blogStore.allTags.length }}</span>
            <span class="blog-hero__chip-label">个标签</span>
          </div>
          <div class="blog-hero__chip">
            <span class="blog-hero__chip-value">{{ totalReadTime }}</span>
            <span class="blog-hero__chip-label">分钟阅读</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════
         Filters — Sticky Header
         ═══════════════════════════════════════════════════════════ -->
    <section ref="filtersRef" class="blog-page__filters vs-sticky-header" :class="{ 'is-scrolled': isScrolled }">
      <div class="blog-page__filters-inner">
        <div class="blog-page__search">
          <Search class="blog-page__search-icon" :size="16" />
          <input
v-model="blogStore.searchQuery" type="text" placeholder="搜索文章..." class="blog-page__search-input"
            @input="handleSearch" />
          <button
v-if="blogStore.searchQuery" type="button" class="blog-page__search-clear" aria-label="清除搜索"
            @click="clearSearch">
            <X :size="14" />
          </button>
          <transition name="fade">
            <span v-if="blogStore.searchQuery" class="blog-page__search-count">
              {{ blogStore.filteredPosts.length }} 篇
            </span>
          </transition>
        </div>

        <div v-if="blogStore.selectedCategory" class="blog-page__category-filter">
          <span class="blog-page__category-label">分类：</span>
          <span class="blog-page__category-pill">
            {{ blogStore.selectedCategory }}
            <button
type="button" class="blog-page__category-clear" aria-label="清除分类筛选"
              @click="handleCategoryClick(null as any)">
              <X :size="12" />
            </button>
          </span>
        </div>

        <div v-if="blogStore.allTags.length > 0" class="blog-page__tags">
          <button
type="button" class="blog-page__tag"
            :class="{ 'blog-page__tag--active': blogStore.selectedTag === null }" @click="handleTagClick(null)">
            全部
          </button>
          <button
v-for="tag in blogStore.allTags" :key="tag" type="button" class="blog-page__tag"
            :class="{ 'blog-page__tag--active': blogStore.selectedTag === tag }" @click="handleTagClick(tag)">
            {{ tag }}
          </button>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════
         Blog List — Timeline Layout
         ═══════════════════════════════════════════════════════════ -->
    <section class="blog-page__content">
      <div class="blog-page__content-inner">
        <BlogList
:posts="blogStore.paginatedPosts" :current-page="blogStore.currentPage"
          :total-pages="blogStore.totalPages" :loading="blogStore.loading" :error="blogStore.error"
          :items-per-page="blogStore.itemsPerPage" @post-click="handlePostClick" @tag-click="handleTagClick"
          @category-click="handleCategoryClick" @page-change="handlePageChange" @retry="blogStore.loadPosts" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
/**
 * Blog — Section级光源投影 · Unified Visual System v6.0
 *
 * Blog Hero = Section级光效 (intensity 0.6)
 * 光源: --global-light-x/y (viewport %)
 * 由 useCursorInteraction 统一设置 on <html>
 * 禁止独立 mouse tracking
 *
 * Max 2 visual effects per element (unified-system.css):
 * Effect 1: Global Light Follow — core interaction sense
 * Effect 2: Ambient Blob Float — atmosphere layer
 *
 * REMOVED (exceeded Max 2 rule):
 * - Canvas noise texture
 * - Mesh gradient cursor distortion
 * - Badge pulse animation
 */
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBlogStore } from '@/stores/useBlogStore'
import { Search, X } from 'lucide-vue-next'
import SEOHead from '@/components/common/SEOHead.vue'
import BlogList from '@/components/blog/BlogList.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import type { BlogPost } from '@/types/blog'

const router = useRouter()
const route = useRoute()
const blogStore = useBlogStore()

// ── Hero ref for scroll reveal only ──
const heroRef = ref<HTMLElement | null>(null)

const { observeChildren, disconnect: disconnectReveal } = useScrollReveal({
  threshold: 0.1,
  rootMargin: '0px 0px 0px 0px',
  once: true,
  staggerDelay: 60,
  maxStaggerDelay: 300,
})

// ── Sticky Filters ──
const isScrolled = ref(false)
const filtersRef = ref<HTMLElement | null>(null)
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

// ── Stats ──
const totalReadTime = computed(() => {
  return blogStore.posts.reduce((sum: number, post: { readTime: number }) => sum + post.readTime, 0)
})

// ── Event Handlers ──
const handlePostClick = (post: BlogPost) => {
  router.push(`/blog/${post.id}`)
}

const handleTagClick = (tag: string | null) => {
  blogStore.filterByTag(tag)
}

const handleCategoryClick = (category: string) => {
  blogStore.filterByCategory(category)
}

const handleSearch = () => {
  blogStore.searchPosts(blogStore.searchQuery)
}

const clearSearch = () => {
  blogStore.searchPosts('')
}

const handlePageChange = (page: number) => {
  blogStore.setPage(page)
}

// ── URL Sync ──
const restoreFiltersFromUrl = () => {
  blogStore.filterByTag(null)
  blogStore.filterByCategory(null)
  blogStore.searchPosts('')
  blogStore.setPage(1)

  const { tag, category, q, page } = route.query
  if (tag && typeof tag === 'string') blogStore.filterByTag(tag)
  if (category && typeof category === 'string') blogStore.filterByCategory(category)
  if (q && typeof q === 'string') blogStore.searchPosts(q)
  if (page && typeof page === 'string') {
    const pageNum = parseInt(page, 10)
    if (!isNaN(pageNum) && pageNum >= 1) blogStore.setPage(pageNum)
  }
}

const syncFiltersToUrl = () => {
  const query: Record<string, string> = {}
  if (blogStore.selectedTag) query.tag = blogStore.selectedTag
  if (blogStore.selectedCategory) query.category = blogStore.selectedCategory
  if (blogStore.searchQuery) query.q = blogStore.searchQuery
  if (blogStore.currentPage > 1) query.page = String(blogStore.currentPage)
  router.replace({ query })
}

watch(
  () => [blogStore.selectedTag, blogStore.selectedCategory, blogStore.searchQuery, blogStore.currentPage],
  () => { syncFiltersToUrl() }
)

// ── Initialize blog data synchronously (from static blog-meta.json) ──
blogStore.loadPosts()
restoreFiltersFromUrl()

// ── Lifecycle ──
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })

  if (heroRef.value) {
    observeChildren(heroRef.value)
  }

  document.title = '技术博客 - 佘杰'
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  disconnectReveal()
})
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════
   Blog — Section级光源投影 · Unified Visual System v6.0
   ═══════════════════════════════════════════════════════════════
   Max 2 visual effects per element (unified-system.css):
   Effect 1: Global Light Follow — core interaction sense
   Effect 2: Ambient Blob Float — atmosphere layer

   REMOVED (exceeded Max 2 rule):
   - Canvas noise texture
   - Mesh gradient cursor distortion
   - Badge pulse animation
   ═══════════════════════════════════════════════════════════════ */

.blog-page {
  min-height: 100vh;
  /* fallback for older browsers */
  min-height: 100dvh;
  /* dynamic viewport height for mobile */
  background: linear-gradient(180deg, var(--us-bg-start), var(--us-bg-end));
}

/* ═══════════════════════════════════════════════════════════════
   HERO — 3-Layer Depth
   ═══════════════════════════════════════════════════════════════ */
.blog-hero {
  position: relative;
  min-height: 420px;
  display: flex;
  align-items: center;
  padding: calc(var(--us-space-24) + var(--us-space-8)) var(--us-space-6) var(--us-space-16);
  overflow: hidden;
  z-index: var(--z-sticky);
}

/* ── Layer 1: Background Canvas ── */
.blog-hero__canvas {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

/* REMOVED: .blog-hero__noise — exceeded Max 2 visual effects per element (unified-system.css) */
/* REMOVED: .blog-hero__mesh — exceeded Max 2 visual effects per element (unified-system.css) */

/* Global Light Follow — uses --global-light-x/y from <html>
   Blog Hero = Section级光效 (intensity 0.6, 比Hero暗) */
.blog-hero__mouse-light {
  position: absolute;
  inset: 0;
  background: radial-gradient(500px circle at var(--global-light-x, 50%) var(--global-light-y, 50%),
      var(--us-light-color) 0%,
      transparent 70%);
  opacity: var(--global-light-active, 0);
  transition: opacity var(--us-duration-normal) var(--us-easing);
  pointer-events: none;
}

/* ── Layer 2: Ambient Motion ── */
.blog-hero__ambient {
  position: absolute;
  inset: 0;
  z-index: var(--z-local-elevated);
  pointer-events: none;
  overflow: hidden;
}

.blog-hero__blob {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.04) 0%, transparent 70%);
  top: 20%;
  right: -10%;
  animation: blog-blob-float 25s ease-in-out infinite;
}

@keyframes blog-blob-float {

  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }

  33% {
    transform: translate(-30px, 20px) scale(1.05);
  }

  66% {
    transform: translate(20px, -15px) scale(0.95);
  }
}

/* ── Layer 3: Content ── */
.blog-hero__container {
  position: relative;
  z-index: var(--z-overlay-subtle);
  max-width: 1200px;
  margin-inline: auto;
  width: 100%;
}

/* ── Glassmorphism Badge ── */
.blog-hero__badge {
  display: inline-flex;
  align-items: center;
  gap: var(--us-space-2);
  padding: var(--us-space-2) var(--us-space-4);
  background: var(--us-glass-bg);
  border: 1px solid var(--us-glass-border);
  border-radius: 9999px;
  margin-bottom: var(--us-space-8);
}

/* REMOVED: badge-pulse animation — exceeded Max 2 visual effects per element (unified-system.css)
   Badge dot is now static, no animation */
.blog-hero__badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--us-accent);
}

.blog-hero__badge-text {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--us-accent);
}

/* ── Gradient Title ── */
.blog-hero__title {
  font-size: clamp(2.25rem, 5vw, 3.25rem);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: var(--leading-none);
  margin: 0 0 var(--us-space-4);
  color: var(--us-text-primary);
}

.blog-hero__accent {}

/* ── Subtitle ── */
.blog-hero__subtitle {
  font-size: 1rem;
  color: var(--us-text-secondary);
  max-width: 520px;
  margin: 0 0 var(--us-space-12);
  line-height: var(--leading-relaxed);
}

/* ── Proof Chips — glassmorphism stat cards ── */
.blog-hero__chips {
  display: flex;
  gap: var(--us-space-4);
  flex-wrap: wrap;
}

.blog-hero__chip {
  display: flex;
  align-items: center;
  gap: var(--us-space-2);
  padding: var(--us-space-2) var(--us-space-4);
  background: var(--us-surface);
  border: 1px solid var(--us-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--us-depth-1);
  cursor: default;
  transition: transform, box-shadow, background-color, border-color, opacity var(--us-duration-normal) var(--us-easing);
}

.blog-hero__chip:hover {
  background: var(--us-surface-hover);
  box-shadow: var(--us-depth-2);
  transform: translateY(var(--us-lift-sm));
}

.blog-hero__chip:active {
  transform: translateY(0) scale(0.95);
}

.blog-hero__chip-value {
  font-size: 1.5rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--us-text-primary);
}

.blog-hero__chip-label {
  font-size: 0.75rem;
  color: var(--us-text-tertiary);
}

/* ═══════════════════════════════════════════════════════════════
   FILTERS — Sticky Header
   ═══════════════════════════════════════════════════════════════ */
.blog-page__filters {
  position: sticky;
  top: 64px;
  z-index: var(--z-sticky-filter);
  padding: var(--us-space-4) 0;
  margin-bottom: var(--us-space-8);
  transition: box-shadow var(--us-duration-normal) var(--us-easing);
}

.blog-page__filters.is-scrolled {
  box-shadow: var(--us-depth-2);
}

.blog-page__filters-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--us-space-4);
  display: flex;
  flex-direction: column;
  gap: var(--us-space-3);
}

@media (min-width: 768px) {
  .blog-page__filters-inner {
    padding: 0 var(--us-space-6);
  }
}

/* ── Search ── */
.blog-page__search {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 480px;
}

.blog-page__search-icon {
  position: absolute;
  left: 0.75rem;
  color: var(--us-text-tertiary);
  pointer-events: none;
}

.blog-page__search-input {
  width: 100%;
  padding: var(--us-space-2) var(--us-space-10) var(--us-space-2) var(--us-space-8);
  font-size: 0.875rem;
  color: var(--us-text-primary);
  background: var(--us-surface);
  border: 1px solid var(--us-border);
  border-radius: var(--radius-md);
  outline: none;
  transition: border-color, box-shadow, color var(--us-duration-fast) var(--us-easing);
}

.blog-page__search-input::placeholder {
  color: var(--us-text-tertiary);
}

.blog-page__search-input:focus-visible {
  border-color: var(--us-accent);
  box-shadow: 0 0 0 2px var(--us-accent-border);
}

.blog-page__search-clear {
  position: absolute;
  right: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: var(--radius-sm);
  color: var(--us-text-tertiary);
  background: transparent;
  border: none;
  transition: color, background-color, opacity var(--us-duration-fast) var(--us-easing);
}

.blog-page__search-clear:hover {
  color: var(--us-text-primary);
  background: var(--us-border);
}

.blog-page__search-clear:active {
  transform: scale(0.95);
}

.blog-page__search-count {
  position: absolute;
  right: 1.75rem;
  font-size: 0.75rem;
  color: var(--us-text-tertiary);
  font-variant-numeric: tabular-nums;
}

/* ── Category Filter ── */
.blog-page__category-filter {
  display: flex;
  align-items: center;
  gap: var(--us-space-2);
}

.blog-page__category-label {
  font-size: 0.75rem;
  color: var(--us-text-tertiary);
}

.blog-page__category-pill {
  display: inline-flex;
  align-items: center;
  gap: var(--us-space-1);
  padding: var(--us-space-1) var(--us-space-2);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--us-accent);
  background: var(--us-accent-subtle);
  border: 1px solid var(--us-accent-border);
  border-radius: 9999px;
}

.blog-page__category-clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  color: var(--us-text-tertiary);
  background: transparent;
  border: none;
  transition: color, background-color, opacity var(--us-duration-fast) var(--us-easing);
}

.blog-page__category-clear:hover {
  color: var(--us-accent);
  background: var(--us-accent-border);
}

/* ── Tags ── */
.blog-page__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--us-space-1);
}

.blog-page__tag {
  padding: var(--us-space-1) var(--us-space-3);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--us-text-secondary);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 9999px;
  transition: color, background-color, border-color, opacity var(--us-duration-fast) var(--us-easing);
}

.blog-page__tag:hover {
  color: var(--us-accent);
  background: var(--us-accent-subtle);
}

.blog-page__tag--active {
  color: var(--us-accent);
  background: var(--us-accent-subtle);
  border-color: var(--us-accent-border);
}

.blog-page__tag--active:hover {
  color: var(--us-accent);
  background: var(--us-accent-border);
  border-color: var(--us-accent);
}

/* ═══════════════════════════════════════════════════════════════
   CONTENT
   ═══════════════════════════════════════════════════════════════ */
.blog-page__content {
  padding: 0 0 calc(var(--us-space-24) + var(--us-space-16));
}

.blog-page__content-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 768px) {
  .blog-page__content-inner {
    padding: 0 var(--us-space-6);
  }
}

/* ═══════════════════════════════════════════════════════════════
   REDUCED MOTION
   ═══════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════
   REDUCED MOTION
   ═══════════════════════════════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  .blog-hero__blob {
    animation: none;
  }

  /* REMOVED: .blog-hero__badge-dot animation none — badge-pulse already removed */
  /* REMOVED: .blog-hero__mesh transform none — mesh already removed */

  .blog-hero__chip {
    translate: none !important;
  }
}

/* ═══════════════════════════════════════════════════════════════
   MOBILE
   ═══════════════════════════════════════════════════════════════ */
@media (max-width: 640px) {
  .blog-hero {
    min-height: 340px;
    padding: var(--us-space-24) var(--us-space-4) var(--us-space-12);
  }

  .blog-hero__title {
    font-size: 1.75rem;
  }

  .blog-hero__chips {
    gap: var(--us-space-2);
  }

  .blog-hero__chip {
    padding: var(--us-space-2) var(--us-space-3);
  }

  .blog-hero__chip-value {
    font-size: 1rem;
  }

  .blog-hero__blob {
    width: 300px;
    height: 300px;
  }

  .blog-page__filters-inner {
    gap: var(--us-space-2);
  }

  .blog-page__tags {
    overflow-x: auto;
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding-bottom: 0.25rem;
  }

  .blog-page__tags::-webkit-scrollbar {
    display: none;
  }
}

/* ═══════════════════════════════════════════════════════════════
   TRANSITIONS
   ═══════════════════════════════════════════════════════════════ */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--us-duration-fast) var(--us-easing);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>