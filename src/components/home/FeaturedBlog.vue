<script setup lang="ts">
/**
 * FeaturedBlog — Content-Focused v9.0 + Stripe Motion
 *
 * Stripe-level entrance choreography:
 * - GSAP sectionChoreography: label → title → featured → list items → CTA
 * - Stripe hover micro-interactions
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/useBlogStore'
import { useStripeScrollAnimation } from '@/composables/useStripeScrollAnimation'

const router = useRouter()
const blogStore = useBlogStore()

const sectionRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

// Stripe-level GSAP scroll animation system
const { sectionChoreography, cleanup } = useStripeScrollAnimation()

const featuredArticle = computed(() =>
  blogStore.recentPosts?.[0] ?? null
)

const timelinePosts = computed(() =>
  blogStore.recentPosts?.slice(1, 4) ?? []
)

const hasPosts = computed(() => blogStore.recentPosts && blogStore.recentPosts.length > 0)

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const month = date.toLocaleDateString('zh-CN', { month: 'short' })
  const day = date.getDate()
  return `${month} ${day}`
}

const formatReadTime = (minutes: number | undefined) => {
  if (!minutes) return ''
  return `${minutes} min read`
}

const handlePostClick = (post: { id: string }) => {
  router.push(`/blog/${post.id}`)
}

const handleViewAll = () => {
  router.push('/blog')
}

// ── Initialize blog data synchronously (from static blog-meta.json) ──
blogStore.loadPosts()

onMounted(() => {
  // GSAP choreographed entrance: label → title → cards → CTA
  sectionChoreography({
    sectionRef,
    titleSelector: '.fb__title',
    subtitleSelector: '.fb__label',
    cardSelector: '.fb__featured, .fb__item',
    ctaSelector: '.fb__cta',
    entrance: {
      start: 'top 85%',
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.1,
      yOffset: 40,
    },
  })
})

onUnmounted(() => {
  cleanup()
})
</script>

<template>
  <section ref="sectionRef" class="fb stripe-section stripe-section--blog stripe-orbs stripe-orbs--cyan">
    <div class="stripe-orb-extra stripe-orb-extra--cyan" style="top:20%;left:-5%;" aria-hidden="true"></div>
    <div class="fb__container">
      <div class="fb__header">
        <span class="fb__label stripe-text-gradient">Latest Writing</span>
        <h2 class="fb__title">最新文章</h2>
      </div>

      <div v-if="blogStore.loading" class="fb__loading">
        <div class="fb__spinner" />
        <p class="fb__loading-text">加载文章中...</p>
      </div>

      <div v-else-if="blogStore.error" class="fb__error">
        <p class="fb__error-text">{{ blogStore.error }}</p>
        <button class="fb__retry" @click="blogStore.loadPosts()">重试</button>
      </div>

      <div v-else-if="hasPosts" ref="contentRef" class="fb__content stripe-timeline">
        <!-- Featured Article -->
        <div
v-if="featuredArticle" class="fb__featured stripe-card vs-light-surface stripe-border"
          @click="handlePostClick(featuredArticle)">
          <span class="fb__featured__badge">Editor's Pick</span>
          <div class="fb__featured__meta">
            <span v-if="featuredArticle.category" class="fb__featured__category">
              {{ featuredArticle.category }}
            </span>
            <span class="fb__featured__date">{{ formatDate(featuredArticle.publishedAt) }}</span>
            <span v-if="featuredArticle.readTime" class="fb__featured__read-time">
              {{ formatReadTime(featuredArticle.readTime) }}
            </span>
          </div>
          <h3 class="fb__featured__title">{{ featuredArticle.title }}</h3>
          <p v-if="featuredArticle.excerpt" class="fb__featured__excerpt">
            {{ featuredArticle.excerpt }}
          </p>
          <div class="fb__featured__action">
            <span>阅读全文</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        <!-- Visual Breath -->
        <div v-if="timelinePosts.length > 0" class="fb__breath" />

        <!-- Reading Flow List -->
        <div v-if="timelinePosts.length > 0" class="fb__list">
          <div
v-for="post of timelinePosts" :key="post.id" class="fb__item stripe-glow"
            @click="handlePostClick(post)">
            <div class="fb__item__progress">
              <span class="fb__item__progress-dot stripe-timeline-dot" />
            </div>
            <div class="fb__item__accent-bar" />
            <div class="fb__item__content">
              <div class="fb__item__meta">
                <span class="fb__item__date">{{ formatDate(post.publishedAt) }}</span>
                <span v-if="post.readTime" class="fb__item__read-time">
                  {{ formatReadTime(post.readTime) }}
                </span>
              </div>
              <h4 class="fb__item__title">{{ post.title }}</h4>
              <p v-if="post.excerpt" class="fb__item__excerpt">{{ post.excerpt }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="fb__empty">
        <p class="fb__empty-text">暂无文章</p>
      </div>

      <!-- CTA -->
      <div v-if="hasPosts" class="fb__cta">
        <button class="fb__cta-btn" @click="handleViewAll">
          查看全部文章
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ============================================
   FeaturedBlog — Content-Focused v9.0
   ─────────────────────────────────────────
   阅读时间线: Featured(编辑精选) → 阅读流列表 → CTA收束
   无tilt/spring/field-intensity/surface/edge
   ============================================ */

.fb {
  position: relative;
  padding: var(--us-space-16) 0;
  background: transparent;
}

.fb__container {
  position: relative;
  z-index: var(--z-local);
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--us-space-6);
}

/* ── Section Header ── */
.fb__header {
  margin-bottom: var(--us-space-10);
  display: flex;
  align-items: baseline;
  gap: var(--us-space-3);
}

.fb__label {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--us-accent);
  letter-spacing: 0.02em;
}

.fb__title {
  margin: 0;
  font-size: var(--text-3xl);
  font-weight: 600;
  color: var(--us-text-primary);
  line-height: var(--leading-tight);
  letter-spacing: -0.02em;
}

/* ── Content Container ── */
.fb__content {
  position: relative;
}

/* ── Reading Guide Line ── */
.fb__content::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(37, 99, 235, 0.15);
  border-radius: 1px;
  pointer-events: none;
  z-index: 0;
}

/* ── Visual Breath ── */
.fb__breath {
  height: 56px;
  position: relative;
}

/* ── Featured Article ── */
.fb__featured {
  position: relative;
  background: var(--us-material-elevated-bg);
  border: 1px solid var(--us-material-elevated-border);
  border-left: none;
  border-radius: var(--radius-xl);
  box-shadow: var(--us-depth-2);
  cursor: pointer;
  padding: var(--us-space-8) var(--us-space-8);
  padding-left: var(--us-space-10);
  display: flex;
  flex-direction: column;
  gap: var(--us-space-3);
  overflow: hidden;
  transition:
    transform var(--us-duration-normal) var(--us-easing),
    box-shadow var(--us-duration-normal) var(--us-easing),
    border-color var(--us-duration-fast) var(--us-easing);
}

.fb__featured:hover {
  transform: translateY(var(--us-lift-md));
  box-shadow: var(--us-depth-2-hover);
  border-color: var(--us-accent-border);
}

.fb__featured:active {
  transform: translateY(var(--us-lift-sm)) scale(0.95);
}

/* ── Editor's Pick Badge ── */
.fb__featured__badge {
  position: absolute;
  top: 12px;
  right: 16px;
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--us-accent);
  background: var(--us-accent-subtle);
  padding: var(--us-space-1) var(--us-space-2);
  min-height: 28px;
  border-radius: var(--radius-sm);
  z-index: var(--z-local-high);
  opacity: 0.8;
}

.fb__featured__meta {
  display: flex;
  align-items: center;
  gap: var(--us-space-3);
  font-size: var(--text-xs);
  color: var(--us-text-tertiary);
  position: relative;
  z-index: var(--z-local-elevated);
}

.fb__featured__category {
  font-weight: 600;
  color: var(--us-accent);
  background: var(--us-accent-subtle);
  padding: var(--us-space-1) var(--us-space-2);
  min-height: 28px;
  border-radius: var(--radius-sm);
  letter-spacing: 0.02em;
}

.fb__featured__date {
  color: var(--us-text-tertiary);
}

.fb__featured__read-time {
  color: var(--us-text-tertiary);
}

.fb__featured__title {
  margin: 0;
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--us-text-primary);
  letter-spacing: -0.01em;
  line-height: var(--leading-snug);
  position: relative;
  z-index: var(--z-local-elevated);
}

.fb__featured__excerpt {
  margin: 0;
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: var(--us-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  position: relative;
  z-index: var(--z-local-elevated);
}

.fb__featured__action {
  display: inline-flex;
  align-items: center;
  gap: var(--us-space-2);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--us-accent);
  position: relative;
  z-index: var(--z-local-elevated);
  transition: gap var(--us-duration-fast) var(--us-easing);
}

.fb__featured:hover .fb__featured__action {
  gap: var(--us-space-3);
}

/* ── Article List ── */
.fb__list {
  position: relative;
}

.fb__item {
  position: relative;
  padding: var(--us-space-4) 0 var(--us-space-4) var(--us-space-8);
  border-bottom: 1px solid var(--us-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  gap: var(--us-space-3);
  overflow: hidden;
  background: transparent;
  transition:
    background var(--us-duration-fast) var(--us-easing),
    border-color var(--us-duration-fast) var(--us-easing);
}

.fb__item:hover {
  background: var(--us-surface);
}

.fb__item:active {
  transform: scale(0.95);
}

.fb__item:last-child {
  border-bottom: none;
}

/* ── Reading Progress Dot ── */
.fb__item__progress {
  position: absolute;
  left: 17px;
  top: 22px;
  width: 6px;
  height: 6px;
  z-index: var(--z-local-elevated);
}

.fb__item__progress-dot {
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(37, 99, 235, 0.3);
  transition: background var(--us-duration-normal) var(--us-easing);
}

.fb__item:hover .fb__item__progress-dot {
  background: var(--us-accent);
}

/* ── Accent Bar ── */
.fb__item__accent-bar {
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 2px;
  border-radius: 1px;
  background: var(--us-accent);
  opacity: 0;
  transform: scaleY(0.6);
  z-index: var(--z-local);
  transition:
    opacity var(--us-duration-normal) var(--us-easing),
    transform var(--us-duration-normal) var(--us-easing);
}

.fb__item:hover .fb__item__accent-bar {
  opacity: 1;
  transform: scaleY(1);
}

/* ── Item Content ── */
.fb__item__content {
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: var(--z-local);
}

.fb__item__meta {
  display: flex;
  align-items: center;
  gap: var(--us-space-3);
  font-size: var(--text-xs);
  color: var(--us-text-tertiary);
}

.fb__item__date {
  letter-spacing: 0.02em;
}

.fb__item__read-time {
  color: var(--us-text-tertiary);
}

.fb__item__title {
  margin: 0;
  font-size: var(--text-base);
  font-weight: 500;
  color: var(--us-text-primary);
  line-height: var(--leading-snug);
  transition: color var(--us-duration-fast) var(--us-easing);
}

.fb__item:hover .fb__item__title {
  color: var(--us-accent);
}

.fb__item__excerpt {
  margin: 0;
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  color: var(--us-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Loading / Error / Empty ── */
.fb__loading,
.fb__error,
.fb__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--us-space-3);
  padding: var(--us-space-12) 0;
}

.fb__spinner {
  width: 28px;
  height: 28px;
  border: 2.5px solid var(--us-border);
  border-top-color: var(--us-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}



.fb__loading-text,
.fb__error-text,
.fb__empty-text {
  font-size: var(--text-sm);
  color: var(--us-text-tertiary);
  margin: 0;
}

.fb__retry {
  margin-top: var(--us-space-2);
  padding: var(--us-space-2) var(--us-space-4);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--us-accent);
  background: var(--us-accent-subtle);
  border: 1px solid var(--us-accent-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition:
    background var(--us-duration-fast) var(--us-easing),
    border-color var(--us-duration-fast) var(--us-easing);
}

.fb__retry:hover {
  background: var(--us-accent-border);
  border-color: var(--us-accent);
}

.fb__retry:focus-visible {
  outline: 2px solid var(--us-accent);
  outline-offset: 2px;
}

/* ── CTA Button ── */
.fb__cta {
  margin-top: var(--us-space-8);
  padding-left: var(--us-space-8);
  display: flex;
  justify-content: flex-start;
  position: relative;
}

.fb__cta::before {
  content: '';
  position: absolute;
  left: 20px;
  top: -28px;
  width: 2px;
  height: 28px;
  background: rgba(37, 99, 235, 0.15);
  pointer-events: none;
}

.fb__cta-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--us-space-2);
  padding: var(--us-space-2) var(--us-space-5);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--us-text-tertiary);
  background: transparent;
  border: 1px solid var(--us-border);
  border-radius: var(--radius-lg);
  transition:
    color var(--us-duration-normal) var(--us-easing),
    border-color var(--us-duration-normal) var(--us-easing),
    background var(--us-duration-normal) var(--us-easing);
}

.fb__cta-btn:hover {
  color: var(--us-accent);
  border-color: var(--us-accent-border);
  background: var(--us-accent-subtle);
}

.fb__cta-btn:active {
  transform: scale(0.95);
}

/* ── Scroll Reveal — handled by GSAP useStripeScrollAnimation ── */

/* ── Reduced Motion ── */
@media (prefers-reduced-motion: reduce) {
  .fb__spinner {
    animation-duration: 0.01ms !important;
  }

  .fb__featured {
    transition: none !important;
  }

  .fb__featured:hover,
  .fb__featured:active {
    transform: none !important;
  }

  .fb__item {
    transition: none !important;
  }

  .fb__item:hover {
    transform: none !important;
  }

  .fb__item__accent-bar {
    transform: none !important;
  }

  /* GSAP-animated elements: force visible */
  .fb__label,
  .fb__title,
  .fb__featured,
  .fb__item,
  .fb__cta {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .fb {
    padding: var(--us-space-10) 0;
  }

  .fb__header {
    margin-bottom: var(--us-space-8);
  }

  .fb__featured {
    padding: var(--us-space-5) var(--us-space-6);
    padding-left: var(--us-space-8);
  }

  .fb__featured__title {
    font-size: var(--text-lg);
  }

  .fb__content::before,
  .fb__cta::before,
  .fb__item__progress {
    display: none;
  }

  .fb__item {
    padding-left: var(--us-space-3);
  }

  .fb__cta {
    padding-left: var(--us-space-3);
  }

  /* Touch target enhancement — 44px for primary interactive elements */
  .fb__cta-btn {
    min-height: 44px;
    min-width: 44px;
  }
}

@media (max-width: 480px) {
  .fb__container {
    padding: 0 var(--us-space-4);
  }

  .fb__featured {
    padding: var(--us-space-4) var(--us-space-5);
    padding-left: var(--us-space-6);
  }

  .fb__featured__title {
    font-size: var(--text-base);
  }

  .fb__item__title {
    font-size: var(--text-sm);
  }
}
</style>