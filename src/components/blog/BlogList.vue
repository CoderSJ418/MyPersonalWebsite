<template>
  <div ref="listRef" class="blog-list">
    <!-- 加载状态 -->
    <div v-if="loading" class="blog-list__loading">
      <SkeletonLoader variant="card" :count="itemsPerPage" />
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="blog-list__error">
      <div class="blog-list__error-content">
        <AlertCircle :size="40" class="blog-list__error-icon" />
        <h3 class="blog-list__error-title">加载失败</h3>
        <p class="blog-list__error-message">{{ error }}</p>
        <button type="button" class="blog-list__retry-btn" @click="handleRetry">重新加载</button>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="posts.length === 0" class="blog-list__empty">
      <div class="blog-list__empty-content">
        <FileText :size="40" class="blog-list__empty-icon" />
        <h3 class="blog-list__empty-title">暂无文章</h3>
        <p class="blog-list__empty-message">还没有发布任何文章，敬请期待</p>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════════════════
         Timeline — Scroll-Driven Interaction System
         ═══════════════════════════════════════════════════════════
         NOT a visual decoration — this is an interaction system:
         - Progressive line draw: timeline line height driven by scroll
         - Active node glow: current section's dot pulses
         - Choreographed entrance: opacity + translateY + blur cascade
         ═══════════════════════════════════════════════════════════ -->
    <div v-else class="blog-timeline">
      <!-- Featured Section -->
      <section v-if="featuredPosts.length > 0" class="blog-timeline__featured vs-reveal" aria-label="精选文章">
        <div class="blog-timeline__section-header">
          <span class="blog-timeline__section-label">Featured</span>
        </div>
        <div class="blog-timeline__featured-grid">
          <ContentCard
v-for="(post, index) in featuredPosts" :key="'featured-' + post.id" variant="blog"
            :cover-image="post.coverImage" :cover-alt="post.title" :title="post.title" :description="post.excerpt"
            :tags="post.tags" :featured="true" :category="post.category" :date="post.publishedAt"
            :read-time="post.readTime" :href="`/blog/${post.id}`" role="listitem" class="vs-reveal vs-reveal--stagger"
            :style="{ '--stagger-delay': `${index * 80}ms` }" @click="handlePostClick(post)" @tag-click="handleTagClick"
            @category-click="handleCategoryClick" />
        </div>
      </section>

      <!-- Timeline — Progressive Scroll System -->
      <div ref="timelineRef" class="timeline">
        <!-- The line — height driven by scroll progress -->
        <div ref="timelineLineRef" class="timeline__line">
          <div class="timeline__line-fill" :style="{ height: lineProgress + '%' }"></div>
        </div>

        <!-- Year Groups -->
        <div
v-for="(group, gIdx) in groupedPosts" :key="group.year" :ref="el => { if (el) yearRefs[group.year] = el as HTMLElement }"
          class="timeline__group"
          :class="{ 'is-active': activeYear === group.year }">
          <!-- Year Node + Sticky Header -->
          <div class="timeline__year-header vs-sticky-header">
            <div class="timeline__node" :class="{ 'is-active': activeYear === group.year }">
              <span class="timeline__node-dot"></span>
            </div>
            <span class="vs-sticky-header__title">{{ group.year }}</span>
            <span class="timeline__year-count">{{ group.posts.length }} 篇</span>
          </div>

          <!-- Posts in this year -->
          <div
v-for="(post, pIdx) in group.posts" :key="post.id" class="timeline__item vs-reveal vs-reveal--stagger"
            :style="{ '--stagger-delay': `${Math.min((gIdx * 3 + pIdx) * 60, 400)}ms` }">
            <div class="timeline__date">{{ formatDate(post.publishedAt) }}</div>
            <ContentCard
variant="blog" layout="feed" :title="post.title" :description="post.excerpt"
              :category="post.category" :date="post.publishedAt" :read-time="post.readTime" :tags="post.tags"
              :href="`/blog/${post.id}`" role="listitem" @click="handlePostClick(post)"
              @category-click="handleCategoryClick" @tag-click="handleTagClick" />
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="blog-timeline__pagination">
        <Pagination :current-page="currentPage" :total-pages="totalPages" @page-change="handlePageChange" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * BlogList — Scroll-Driven Timeline Interaction System
 *
 * NOT "applying vs-timeline CSS class" — this is an interaction system:
 *
 * 1. Progressive Line Draw:
 *    - IntersectionObserver watches each year group
 *    - Line fill height = percentage of observed groups
 *    - Creates "drawing in" effect as user scrolls
 *
 * 2. Active Node Glow:
 *    - Current year's dot gets enhanced glow + scale
 *    - Signals "you are here" in the timeline
 *
 * 3. Choreographed Entrance:
 *    - vs-reveal: opacity 0→1 + translateY(20px→0) + blur(10px→0)
 *    - Stagger delay creates cascade rhythm
 */
import type { BlogPost } from '@/types/blog'
import { computed, ref, onMounted, onUnmounted, reactive, watch, nextTick } from 'vue'
import { AlertCircle, FileText } from 'lucide-vue-next'
import ContentCard from '@/components/common/ContentCard.vue'
import Pagination from '@/components/common/Pagination.vue'
import SkeletonLoader from '@/components/common/SkeletonLoader.vue'
import { useScrollReveal } from '@/composables/useScrollReveal'

interface Props {
  posts: BlogPost[]
  currentPage: number
  totalPages: number
  loading?: boolean
  error?: string | null
  itemsPerPage?: number
  featuredIds?: string[]
}

interface Emits {
  (e: 'post-click', post: BlogPost): void
  (e: 'tag-click', tag: string): void
  (e: 'category-click', category: string): void
  (e: 'page-change', page: number): void
  (e: 'retry'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  itemsPerPage: 10,
  featuredIds: () => []
})

const emit = defineEmits<Emits>()

const listRef = ref<HTMLElement | null>(null)
const timelineRef = ref<HTMLElement | null>(null)
const timelineLineRef = ref<HTMLElement | null>(null)
const yearRefs = reactive<Record<string, HTMLElement>>({})

// ── Scroll-Driven Timeline Progress ──
const lineProgress = ref(0)
const activeYear = ref('')

let yearObserver: IntersectionObserver | null = null

const setupTimelineObserver = () => {
  if (!timelineRef.value) return

  yearObserver = new IntersectionObserver(
    (entries) => {
      const visibleYears: string[] = []
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const year = (entry.target as HTMLElement).dataset.year
          if (year) visibleYears.push(year)
        }
      })

      // Update active year — bottom-most visible year
      if (visibleYears.length > 0) {
        activeYear.value = visibleYears[visibleYears.length - 1]
      }

      // Calculate line progress based on active year position
      updateLineProgress()
    },
    {
      threshold: 0.2,
      rootMargin: '-80px 0px -40% 0px',
    }
  )

  // Observe each year group
  Object.entries(yearRefs).forEach(([year, el]) => {
    if (el) {
      el.dataset.year = year
      yearObserver!.observe(el)
    }
  })
}

const updateLineProgress = () => {
  if (!timelineRef.value || !activeYear.value) return

  const years = Object.keys(yearRefs).sort()
  const activeIdx = years.indexOf(activeYear.value)
  if (activeIdx === -1) return

  // Progress = how far through the timeline we are
  const progress = ((activeIdx + 1) / years.length) * 100
  lineProgress.value = Math.min(progress, 100)
}

// ── Scroll Reveal ──
const { observeChildren, disconnect: disconnectReveal } = useScrollReveal({
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px',
  once: true,
  staggerDelay: 60,
  maxStaggerDelay: 400,
})

// ── Date Formatting ──
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[date.getMonth()]} ${date.getDate()}`
}

const getYear = (dateStr: string): string => {
  return String(new Date(dateStr).getFullYear())
}

// ── Featured / Normal Split ──
const featuredPosts = computed(() => {
  if (props.featuredIds.length === 0) return []
  return props.posts.filter(p => props.featuredIds.includes(p.id))
})

const normalPosts = computed(() => {
  if (props.featuredIds.length === 0) return props.posts
  return props.posts.filter(p => !props.featuredIds.includes(p.id))
})

// ── Group by Year (descending) ──
interface YearGroup {
  year: string
  posts: BlogPost[]
}

const groupedPosts = computed<YearGroup[]>(() => {
  const map = new Map<string, BlogPost[]>()
  for (const post of normalPosts.value) {
    const year = getYear(post.publishedAt)
    if (!map.has(year)) map.set(year, [])
    map.get(year)!.push(post)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, posts]) => ({ year, posts }))
})

// ── Event Handlers ──
const handlePostClick = (post: BlogPost) => emit('post-click', post)
const handleTagClick = (tag: string) => emit('tag-click', tag)
const handleCategoryClick = (category: string) => emit('category-click', category)
const handlePageChange = (page: number) => {
  emit('page-change', page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
const handleRetry = () => emit('retry')

// ── Lifecycle ──
onMounted(() => {
  if (listRef.value) observeChildren(listRef.value)

  // Delay timeline observer setup to allow DOM rendering
  requestAnimationFrame(() => {
    setupTimelineObserver()
  })
})

// ── Watch posts prop — re-observe vs-reveal elements after data changes ──
// Root cause fix: posts load asynchronously AFTER onMounted, so the initial
// observeChildren() finds no .vs-reveal elements. Also, pagination changes
// the posts array, so new elements need re-observation.
watch(
  () => props.posts,
  (newPosts, oldPosts) => {
    // Re-observe when posts change (initial load, pagination, filter change)
    const postCountChanged = !oldPosts || newPosts.length !== oldPosts.length
    const postIdsChanged = newPosts.length > 0 && oldPosts && oldPosts.length > 0 &&
      (newPosts[0]?.id !== oldPosts[0]?.id || newPosts[newPosts.length - 1]?.id !== oldPosts[oldPosts.length - 1]?.id)
    if (postCountChanged || postIdsChanged || (newPosts.length > 0 && (!oldPosts || oldPosts.length === 0))) {
      nextTick(() => {
        if (listRef.value) {
          observeChildren(listRef.value)
        }
        // Re-setup timeline observer for year groups
        requestAnimationFrame(() => {
          setupTimelineObserver()
        })
      })
    }
  }
)

onUnmounted(() => {
  disconnectReveal()
  if (yearObserver) {
    yearObserver.disconnect()
    yearObserver = null
  }
})
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════
   BlogList — Scroll-Driven Timeline Interaction System
   ═══════════════════════════════════════════════════════════════
   Every visual element serves an interaction purpose:
   - Line fill: scroll progress indicator
   - Node glow: "you are here" signal
   - Stagger entrance: content discovery rhythm
   ═══════════════════════════════════════════════════════════════ */

.blog-list {
  display: flex;
  flex-direction: column;
  gap: var(--us-space-12);
}

.blog-timeline {
  display: flex;
  flex-direction: column;
  gap: var(--us-space-6);
}

/* ── Featured Section ── */
.blog-timeline__featured {
  padding-bottom: var(--us-space-12);
  border-bottom: 1px solid var(--us-border);
  margin-bottom: var(--us-space-6);
}

.blog-timeline__section-header {
  margin-bottom: var(--us-space-8);
}

.blog-timeline__section-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--us-accent);
}

.blog-timeline__featured-grid {
  display: grid;
  gap: var(--us-space-6);
}

/* ═══════════════════════════════════════════════════════════════
   TIMELINE — The Interaction System
   ═══════════════════════════════════════════════════════════════ */

.timeline {
  position: relative;
  padding-left: var(--us-space-8);
}

/* ── The Line — scroll-driven fill ── */
.timeline__line {
  position: absolute;
  left: 5px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(37, 99, 235, 0.1);
  border-radius: 1px;
  overflow: hidden;
}

.timeline__line-fill {
  width: 100%;
  background: linear-gradient(180deg, var(--us-accent) 0%, rgba(37, 99, 235, 0.3) 100%);
  border-radius: 1px;
  transition: height var(--us-duration-slow) var(--us-easing);
}

/* ── Year Group ── */
.timeline__group {
  position: relative;
  padding-bottom: var(--us-space-12);
}

/* ── Year Header — Sticky with node ── */
.timeline__year-header {
  display: flex;
  align-items: center;
  gap: var(--us-space-4);
  margin-bottom: var(--us-space-8);
}

/* ── Timeline Node — "you are here" signal ── */
.timeline__node {
  position: relative;
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  /* Align dot center with line center (line at left:5px, center=6px) */
  margin-left: -32px;
}

.timeline__node-dot {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--us-surface);
  border: 2px solid rgba(37, 99, 235, 0.3);
  transition: transform, box-shadow, background-color, border-color, opacity var(--us-duration-normal) var(--us-easing);
}

/* ── enhanced glow + scale */
.timeline__node.is-active .timeline__node-dot {
  border-color: var(--us-accent);
  background: var(--us-accent);
  box-shadow: 0 0 0 3px var(--us-accent-border);
  transform: scale(1.1);
}

.timeline__node-dot:active {
  transform: scale(0.95);
}

/* ── Year Count ── */
.timeline__year-count {
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  color: var(--us-text-tertiary);
  margin-left: auto;
}

/* ── Timeline Item ── */
.timeline__item {
  position: relative;
  padding-bottom: var(--us-space-6);
}

/* ── Date Label ── */
.timeline__date {
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--us-text-tertiary);
  font-variant-numeric: tabular-nums;
  margin-bottom: var(--us-space-2);
  letter-spacing: 0.02em;
}

/* ── Pagination ── */
.blog-timeline__pagination {
  margin-top: var(--us-space-6);
  padding-top: var(--us-space-12);
  border-top: 1px solid var(--us-border);
  padding-left: 0;
}

/* ═══════════════════════════════════════════════════════════════
   STATES — Loading / Error / Empty
   ═══════════════════════════════════════════════════════════════ */
.blog-list__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 600px;
}

.blog-list__error {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.blog-list__error-content {
  text-align: center;
  max-width: 360px;
}

.blog-list__error-icon {
  color: var(--us-accent);
  margin: 0 auto var(--us-space-6);
}

.blog-list__error-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--us-text-primary);
  margin: 0 0 var(--us-space-2);
}

.blog-list__error-message {
  font-size: 0.875rem;
  color: var(--us-text-secondary);
  margin: 0 0 var(--us-space-8);
}

.blog-list__retry-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--us-space-2);
  padding: var(--us-space-2) var(--us-space-5);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-on-accent);
  background: var(--us-accent);
  border: none;
  border-radius: var(--radius-md);
  transition: opacity var(--us-duration-fast) var(--us-easing);
}

.blog-list__retry-btn:hover {
  opacity: 0.9;
}

.blog-list__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}

.blog-list__empty-content {
  text-align: center;
}

.blog-list__empty-icon {
  color: var(--us-text-tertiary);
  margin: 0 auto var(--us-space-6);
}

.blog-list__empty-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--us-text-primary);
  margin: 0 0 var(--us-space-2);
}

.blog-list__empty-message {
  font-size: 0.875rem;
  color: var(--us-text-secondary);
  margin: 0;
}

/* ═══════════════════════════════════════════════════════════════
   REDUCED MOTION
   ═══════════════════════════════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  .timeline__line-fill {
    transition: none;
  }

  .timeline__node-dot {
    transition: none;
  }
}

/* ═══════════════════════════════════════════════════════════════
   MOBILE
   ═══════════════════════════════════════════════════════════════ */
@media (max-width: 768px) {
  .blog-timeline__featured-grid {
    gap: var(--us-space-6);
  }

  .timeline {
    padding-left: var(--us-space-6);
  }

  .timeline__line {
    left: 3px;
  }

  .timeline__node {
    margin-left: -25px;
    width: 10px;
    height: 10px;
  }
}
</style>