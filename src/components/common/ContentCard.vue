<script setup lang="ts">
/**
 * ContentCard — Unified Visual System v6.0
 *
 * Migrated from --vs- tokens to --us- unified system tokens.
 * All visual properties now reference unified-system.css tokens.
 *
 * Retained Interactions:
 * 1. Card = 有体积的物体 (rgba + blur + border)
 * 2. 3D Tilt Effect — rotateX/rotateY 鼠标驱动
 * 3. Border Glow — accent 色边框光晕
 * 4. Shadow Expansion — hover 时 shadow 扩散
 *
 * Token 依赖: --us-surface, --us-border, --us-depth-*,
 *   --us-text-primary/secondary/tertiary, --us-accent,
 *   --us-duration-*, --us-easing
 */

interface Metric {
  label: string
  value: string
}

interface Props {
  /** 卡片变体：blog 或 project */
  variant?: 'blog' | 'project'
  /** 博客布局模式：card(精选大卡) / feed(分割线列表) */
  layout?: 'card' | 'feed'
  /** 封面图URL */
  coverImage?: string
  /** 封面图alt文本 */
  coverAlt?: string
  /** 标题 */
  title: string
  /** 描述/摘要 */
  description?: string
  /** 标签列表 */
  tags?: string[]
  /** 最大显示标签数 */
  maxTags?: number
  /** 是否精选/置顶 */
  featured?: boolean

  // Blog 专属
  category?: string
  date?: string
  readTime?: number

  // Project 专属
  year?: string
  linkUrl?: string
  linkLabel?: string
  /** Impact metrics — 视觉权重最高 */
  metrics?: Metric[]
  /** 卡片链接地址 — 用于语义化 a 标签导航 */
  href?: string
}

interface Emits {
  (e: 'click'): void
  (e: 'tag-click', tag: string): void
  (e: 'category-click', category: string): void
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'blog',
  layout: 'card',
  coverImage: '',
  coverAlt: '',
  description: '',
  tags: () => [],
  maxTags: 3,
  featured: false,
  category: '',
  date: '',
  readTime: 0,
  year: '',
  linkUrl: '',
  linkLabel: '查看详情',
  metrics: () => [],
  href: ''
})

const emit = defineEmits<Emits>()

const handleClick = (event: MouseEvent) => {
  // 当 href 存在时阻止默认导航，由父组件通过 @click + router.push 处理 SPA 路由
  if (props.href) {
    event.preventDefault()
  }
  emit('click')
}
const handleTagClick = (tag: string) => {
  emit('tag-click', tag)
}
const handleCategoryClick = () => {
  emit('category-click', props.category)
}

const formatShortDate = (dateStr: string): string => {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
  } catch {
    return dateStr
  }
}

import { ref, onUnmounted } from 'vue'
import SafeImage from './SafeImage.vue'

// ── Unified Visual System v6.0 — no legacy data-surface/data-magnetic ──
// 3D tilt and hover effects driven by CSS transitions only
const cardRef = ref<HTMLElement | null>(null)

onUnmounted(() => {
  // Cleanup handled by useCursorInteraction globally
})
</script>

<template>
  <!-- ===== PROJECT VARIANT — Solid Card + Visual Focus ===== -->
  <a
    v-if="variant === 'project'"
    ref="cardRef"
    class="pc vs-light-surface stripe-border"
    :href="href || undefined"
    @click="handleClick"
  >
    <div v-if="coverImage" class="pc__cover">
      <SafeImage
        :src="coverImage"
        :alt="coverAlt || title"
        image-class="pc__cover-img"
        object-fit="cover"
      />
    </div>

    <!-- Content -->
    <div class="pc__content">
      <!-- Impact Metrics — floating badges -->
      <div v-if="metrics.length > 0" class="pc__metrics">
        <div v-for="m in metrics.slice(0, 3)" :key="m.label" class="pc__metric">
          <span class="pc__metric-value">{{ m.value }}</span>
          <span class="pc__metric-label">{{ m.label }}</span>
        </div>
      </div>

      <!-- Title — strong weight -->
      <h3 class="pc__title">{{ title }}</h3>

      <!-- Description — secondary fade -->
      <p v-if="description" class="pc__desc">{{ description }}</p>

      <!-- Footer: Tags pill system + Link -->
      <div class="pc__footer">
        <div v-if="tags.length > 0" class="pc__tags">
          <span
            v-for="tag in tags.slice(0, maxTags)"
            :key="tag"
            class="pc__tag"
            @click.stop="handleTagClick(tag)"
            >{{ tag }}</span
          >
          <span v-if="tags.length > maxTags" class="pc__tag pc__tag--more"
            >+{{ tags.length - maxTags }}</span
          >
        </div>

        <a
          v-if="linkUrl"
          :href="linkUrl"
          class="pc__link"
          target="_blank"
          rel="noopener noreferrer"
          @click.stop
        >
          {{ linkLabel }}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </a>
      </div>
    </div>
  </a>
  <!-- ===== BLOG VARIANT — CARD mode (featured) ===== -->
  <a
    v-else-if="variant === 'blog' && layout === 'card'"
    class="bc"
    :class="featured ? 'bc--featured' : 'bc--standard'"
    :href="href || undefined"
    @click="handleClick"
  >
    <!-- 封面图 -->
    <div v-if="coverImage" class="bc__cover">
      <SafeImage
        :src="coverImage"
        :alt="coverAlt || title"
        image-class="bc__cover-img"
        object-fit="cover"
      />
    </div>

    <!-- 内容区 -->
    <div class="bc__body">
      <!-- Meta: category · date · readTime -->
      <div v-if="category || date || readTime" class="bc__meta">
        <button
          v-if="category"
          type="button"
          class="bc__category"
          @click.stop="handleCategoryClick"
        >
          {{ category }}
        </button>
        <span v-if="category && (date || readTime)" class="bc__dot">·</span>
        <time v-if="date" :datetime="date" class="bc__date">{{ formatShortDate(date) }}</time>
        <span v-if="date && readTime" class="bc__dot">·</span>
        <span v-if="readTime" class="bc__read-time">{{ readTime }} min</span>
      </div>

      <!-- Title -->
      <h3 class="bc__title">{{ title }}</h3>

      <!-- Excerpt -->
      <p v-if="description" class="bc__excerpt">{{ description }}</p>

      <!-- Footer: Tags + Arrow -->
      <div class="bc__footer">
        <div v-if="tags.length > 0" class="bc__tags">
          <span
            v-for="tag in tags.slice(0, maxTags)"
            :key="tag"
            class="bc__tag"
            @click.stop="handleTagClick(tag)"
          >
            {{ tag }}
          </span>
        </div>
        <span class="bc__arrow" aria-hidden="true">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </span>
      </div>
    </div>
  </a>
  <!-- ===== BLOG VARIANT — FEED mode (divider-line thought flow) ===== -->
  <a v-else class="bf" :href="href || undefined" @click="handleClick">
    <div class="bf__inner">
      <h3 class="bf__title">{{ title }}</h3>
      <p v-if="description" class="bf__insight">{{ description }}</p>
      <div class="bf__meta">
        <span v-if="category" class="bf__category">{{ category }}</span>
        <span v-if="category && date" class="bf__dot">·</span>
        <time v-if="date" :datetime="date" class="bf__date">{{ formatShortDate(date) }}</time>
        <span v-if="date && readTime" class="bf__dot">·</span>
        <span v-if="readTime" class="bf__read-time">{{ readTime }} min</span>
      </div>
    </div>
    <span class="bf__arrow" aria-hidden="true">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path d="M3 8h10M9 4l4 4-4 4" />
      </svg>
    </span>
  </a>
</template>

<style scoped>
/* ============================================================
   ContentCard — Unified Visual System v6.0
   ============================================================
   Migrated from --vs- tokens to --us- unified system tokens.
   
   Retained Interactions:
   - Card = 有体积的物体 (rgba + blur + border)
   - Border Glow: accent 色边框光晕
   - Shadow Expansion: hover 时 shadow 扩散
   ============================================================ */

/* ===== PROJECT CARD (pc) — Solid Card + Hover Effects ===== */
.pc {
  position: relative;
  display: flex;
  flex-direction: column;
  /* Reset <a> defaults */
  text-decoration: none;
  color: inherit;
  /* Solid card body — accent-tinted surface in light mode */
  background: var(--us-surface);
  border: 1px solid var(--us-border);
  border-radius: var(--us-card-radius);
  /* Hover: lift + shadow expansion */
  transform-style: preserve-3d;
  /* Shadow: base state — depth-1 + subtle accent glow (dark mode) */
  box-shadow: var(--us-depth-1), var(--us-accent-glow);
  /* Transition — exit easing for natural departure */
  transition:
    transform var(--us-duration-normal) var(--us-easing-exit),
    box-shadow var(--us-duration-normal) var(--us-easing-exit),
    border-color var(--us-duration-normal) var(--us-easing-exit),
    opacity var(--us-duration-normal) var(--us-easing-exit);
  overflow: hidden;
}

.pc:hover {
  /* Stripe-level lift — subtle scale for depth */
  transform: translateY(var(--us-lift-md)) scale(1.005);
  box-shadow: var(--us-depth-3-hover), var(--us-accent-glow-strong);
  border-color: var(--us-accent-border);
  will-change: transform;
  /* Enter easing for satisfying arrival */
  transition:
    transform var(--us-duration-normal) var(--us-easing-enter),
    box-shadow var(--us-duration-normal) var(--us-easing-enter),
    border-color var(--us-duration-normal) var(--us-easing-enter),
    opacity var(--us-duration-normal) var(--us-easing-enter);
}

.pc:active {
  transform: scale(var(--us-press-scale));
  box-shadow: var(--us-depth-1);
}

.pc:focus-visible {
  outline: 2px solid var(--us-accent);
  outline-offset: 2px;
}

/* ── Accent Border — left side for project cards ──
     Design intent: Project cards use LEFT accent line to suggest
     "depth/weight" — projects are substantial work items.
     Blog cards use TOP accent line to suggest "flow/reading direction". */
.pc::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--us-accent);
  border-radius: var(--us-card-radius) 0 0 var(--us-card-radius);
  transition: width var(--us-duration-normal) var(--us-easing-exit);
  z-index: 1;
}

.pc:hover::before {
  width: 3px;
  transition: width var(--us-duration-normal) var(--us-easing-enter);
}

/* ── Content — above surface highlight ── */
.pc__content {
  position: relative;
  z-index: var(--z-local-elevated);
  display: flex;
  flex-direction: column;
  gap: var(--us-space-3);
  flex: 1;
  padding: var(--us-card-padding-lg);
}

.pc__cover {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--us-bg-subtle);
}

.pc__cover :deep(.image-wrapper),
.pc__cover :deep(.pc__cover-img) {
  width: 100%;
  height: 100%;
}

.pc__cover :deep(.pc__cover-img) {
  object-fit: cover;
  transition: transform var(--us-duration-slow) var(--us-easing);
}

.pc:hover .pc__cover :deep(.pc__cover-img) {
  transform: scale(1.02);
}

/* ── Impact Metrics — floating badges ── */
.pc__metrics {
  display: flex;
  gap: var(--us-space-3);
  flex-wrap: wrap;
  padding-bottom: var(--us-space-1);
}

.pc__metric {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--us-space-1);
  padding: var(--us-space-2) var(--us-space-4);
  border-radius: var(--radius-md);
  /* Subtle badge */
  background: var(--us-accent-subtle);
  border: 1px solid var(--us-accent-border);
  transition:
    background var(--us-duration-fast) var(--us-easing),
    border-color var(--us-duration-fast) var(--us-easing);
}

.pc:hover .pc__metric {
  background: var(--us-accent-border);
  border-color: var(--us-accent-border);
}

.pc__metric-value {
  font-size: var(--text-3xl);
  font-weight: 600;
  color: var(--us-text-primary);
  line-height: var(--leading-none);
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}

.pc__metric-label {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--us-text-tertiary);
  letter-spacing: 0.02em;
}

/* ── Title — strong weight ── */
.pc__title {
  margin: 0;
  font-size: var(--text-lg);
  font-weight: 600;
  line-height: var(--leading-snug);
  color: var(--us-text-primary);
  letter-spacing: -0.01em;
  transition: color var(--us-duration-normal) var(--us-easing);
}

.pc:hover .pc__title {
  color: var(--us-accent);
}

/* ── Description — secondary fade ── */
.pc__desc {
  margin: 0;
  font-size: var(--text-sm);
  font-weight: 400;
  line-height: var(--leading-normal);
  color: var(--us-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Footer ── */
.pc__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--us-space-3);
  margin-top: auto;
  padding-top: var(--us-space-2);
}

/* ── Tags — pill system ── */
.pc__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--us-space-2);
}

.pc__tag {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--us-text-tertiary);
  background: var(--us-surface);
  border: 1px solid var(--us-border);
  padding: var(--us-space-1) var(--us-space-3);
  min-height: 28px;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition:
    color var(--us-duration-fast) var(--us-easing),
    background var(--us-duration-fast) var(--us-easing),
    border-color var(--us-duration-fast) var(--us-easing);
}

.pc__tag:hover {
  color: var(--us-accent);
  background: var(--us-accent-subtle);
  border-color: var(--us-accent-border);
}

.pc__tag--more {
  cursor: default;
}

.pc__tag--more:hover {
  color: var(--us-text-tertiary);
  background: var(--us-surface);
  border-color: var(--us-border);
}

/* ── Project Link ── */
.pc__link {
  display: inline-flex;
  align-items: center;
  gap: var(--us-space-1);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--us-text-tertiary);
  text-decoration: none;
  transition: color var(--us-duration-fast) var(--us-easing);
  flex-shrink: 0;
}

.pc__link:hover {
  color: var(--us-accent);
}

/* ===== BLOG CARD (bc) — Solid Card + Enhanced Hover ===== */
.bc {
  position: relative;
  /* Reset <a> defaults */
  display: block;
  text-decoration: none;
  color: inherit;
  /* Solid card — accent-tinted surface in light mode */
  background: var(--us-surface);
  border: 1px solid var(--us-border);
  border-radius: var(--us-card-radius);
  overflow: hidden;
  /* Shadow + subtle accent glow (dark mode) */
  box-shadow: var(--us-depth-1), var(--us-accent-glow);
  /* Transition — exit easing for natural departure */
  transition:
    transform var(--us-duration-normal) var(--us-easing-exit),
    box-shadow var(--us-duration-normal) var(--us-easing-exit),
    border-color var(--us-duration-normal) var(--us-easing-exit);
}

.bc:hover {
  transform: translateY(var(--us-lift-md)) scale(1.005);
  box-shadow: var(--us-depth-3-hover), var(--us-accent-glow-strong);
  border-color: var(--us-accent-border);
  /* Enter easing for satisfying arrival */
  transition:
    transform var(--us-duration-normal) var(--us-easing-enter),
    box-shadow var(--us-duration-normal) var(--us-easing-enter),
    border-color var(--us-duration-normal) var(--us-easing-enter);
}

.bc:active {
  transform: scale(var(--us-press-scale));
  box-shadow: var(--us-depth-1);
}

.bc:focus-visible {
  outline: 2px solid var(--us-accent);
  outline-offset: 2px;
}

/* ── Accent Border — top side for blog cards ──
     Design intent: Blog cards use TOP accent line to suggest
     "flow/reading direction" — content flows downward.
     Contrast with project cards' LEFT accent line. */
.bc::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--us-accent);
  border-radius: var(--us-card-radius) var(--us-card-radius) 0 0;
  transition: height var(--us-duration-normal) var(--us-easing-exit);
  z-index: 1;
}

.bc:hover::before {
  height: 3px;
  transition: height var(--us-duration-normal) var(--us-easing-enter);
}

/* Cover */
.bc__cover {
  position: relative;
  overflow: hidden;
}

.bc--standard .bc__cover {
  aspect-ratio: 16 / 9;
}

.bc--featured .bc__cover {
  aspect-ratio: 21 / 9;
}

.bc__cover :deep(.image-wrapper) {
  width: 100%;
  height: 100%;
}

.bc__cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--us-duration-slow) var(--us-easing);
}

.bc:hover :deep(.bc__cover-img) {
  transform: scale(1.02);
}

/* Body */
.bc__body {
  padding: var(--us-card-padding-lg);
  display: flex;
  flex-direction: column;
  gap: var(--us-space-3);
  position: relative;
  z-index: var(--z-local);
}

/* Meta */
.bc__meta {
  display: flex;
  align-items: center;
  gap: var(--us-space-2);
  font-size: var(--text-xs);
  color: var(--us-text-tertiary);
  line-height: var(--leading-none);
}

.bc__category {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--us-accent);
  background: var(--us-accent-subtle);
  border: 1px solid var(--us-accent-border);
  padding: var(--us-space-1) var(--us-space-3);
  border-radius: var(--radius-md);
  transition:
    background var(--us-duration-fast) var(--us-easing),
    border-color var(--us-duration-fast) var(--us-easing);
}

.bc__category:hover {
  background: var(--us-accent-border);
  border-color: var(--us-accent);
}

.bc__dot {
  color: var(--us-text-tertiary);
}

.bc__date,
.bc__read-time {
  font-variant-numeric: tabular-nums;
}

/* Title */
.bc__title {
  margin: 0;
  font-size: var(--text-lg);
  font-weight: 600;
  line-height: var(--leading-snug);
  color: var(--us-text-primary);
  letter-spacing: -0.01em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color var(--us-duration-normal) var(--us-easing);
}

.bc:hover .bc__title {
  color: var(--us-accent);
}

.bc--featured .bc__title {
  font-size: var(--text-2xl);
  font-weight: 600;
  line-height: var(--leading-snug);
}

/* Excerpt */
.bc__excerpt {
  margin: 0;
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: var(--us-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Footer */
.bc__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--us-space-1);
  gap: var(--us-space-2);
}

/* Tags — pill system */
.bc__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--us-space-2);
}

.bc__tag {
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--us-text-tertiary);
  background: var(--us-surface);
  border: 1px solid var(--us-border);
  padding: var(--us-space-1) var(--us-space-3);
  min-height: 28px;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition:
    color var(--us-duration-fast) var(--us-easing),
    background var(--us-duration-fast) var(--us-easing),
    border-color var(--us-duration-fast) var(--us-easing);
}

.bc__tag:hover {
  color: var(--us-accent);
  background: var(--us-accent-subtle);
  border-color: var(--us-accent-border);
}

/* Arrow */
.bc__arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-md);
  color: var(--us-text-tertiary);
  transition:
    transform var(--us-duration-normal) var(--us-easing),
    color var(--us-duration-normal) var(--us-easing);
  flex-shrink: 0;
}

.bc:hover .bc__arrow {
  transform: translateX(4px);
  color: var(--us-accent);
}

/* ===== BLOG FEED (bf) — Editorial preview · reading flow guide ===== */
.bf {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--us-space-2);
  padding: var(--us-space-8) 0 var(--us-space-8) var(--us-space-4);
  border-bottom: 1px solid var(--us-border);
  border-left: none;
  /* Reset <a> defaults */
  text-decoration: none;
  color: inherit;
  /* Subtle accent glow (dark mode) */
  box-shadow: var(--us-accent-glow);
  /* Transition — exit easing for natural departure */
  transition:
    transform var(--us-duration-normal) var(--us-easing-exit),
    border-color var(--us-duration-normal) var(--us-easing-exit),
    box-shadow var(--us-duration-normal) var(--us-easing-exit),
    opacity var(--us-duration-fast) var(--us-easing-exit);
}

.bf:first-child {
  border-top: 1px solid var(--us-border);
}

.bf:hover {
  transform: translateX(6px);
  box-shadow: var(--us-depth-1), var(--us-accent-glow-strong);
  /* Enter easing for satisfying arrival */
  transition:
    transform var(--us-duration-normal) var(--us-easing-enter),
    border-color var(--us-duration-normal) var(--us-easing-enter),
    box-shadow var(--us-duration-normal) var(--us-easing-enter),
    opacity var(--us-duration-fast) var(--us-easing-enter);
}

.bf:active {
  transform: translateX(2px) scale(var(--us-press-scale));
}

.bf:focus-visible {
  outline: 2px solid var(--us-accent);
  outline-offset: 2px;
}

/* ── Accent Border — left side for blog feed items ── */
.bf::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--us-accent);
  border-radius: 2px;
  transition: width var(--us-duration-normal) var(--us-easing-exit);
}

.bf:hover::before {
  width: 3px;
  transition: width var(--us-duration-normal) var(--us-easing-enter);
}

.bf__inner {
  display: flex;
  flex-direction: column;
  gap: var(--us-space-2);
  flex: 1;
  min-width: 0;
}

.bf__title {
  margin: 0;
  font-size: var(--text-base);
  font-weight: 600;
  line-height: var(--leading-normal);
  color: var(--us-text-primary);
  letter-spacing: -0.005em;
  transition: color var(--us-duration-normal) var(--us-easing);
}

.bf:hover .bf__title {
  color: var(--us-accent);
}

.bf__insight {
  margin: 0;
  font-size: var(--text-sm);
  font-weight: 400;
  line-height: var(--leading-relaxed);
  color: var(--us-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bf__meta {
  display: flex;
  align-items: center;
  gap: var(--us-space-2);
  font-size: var(--text-xs);
  color: var(--us-text-tertiary);
  line-height: var(--leading-none);
  margin-top: var(--us-space-1);
}

.bf__category {
  color: var(--us-accent);
  font-weight: 500;
}

.bf__dot {
  color: var(--us-text-tertiary);
}

.bf__date,
.bf__read-time {
  font-variant-numeric: tabular-nums;
}

.bf__arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--us-text-tertiary);
  flex-shrink: 0;
  transition:
    transform var(--us-duration-normal) var(--us-easing),
    color var(--us-duration-normal) var(--us-easing);
}

.bf:hover .bf__arrow {
  transform: translateX(4px);
  color: var(--us-accent);
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .pc {
    padding: var(--us-card-padding-md);
    /* Disable 3D tilt on mobile */
    transform: none;
  }

  .pc:hover {
    transform: translateY(var(--us-lift-md)) scale(1.005);
  }

  /* Disable surface deformation on mobile — legacy data-surface removed */

  .pc__metrics {
    gap: var(--us-space-3);
  }

  .pc__metric {
    padding: var(--us-space-2) var(--us-space-3);
  }

  .pc__metric-value {
    font-size: var(--text-2xl);
  }

  .bc:hover {
    transform: translateY(var(--us-lift-md)) scale(1.005);
  }

  .bc__body {
    padding: var(--us-card-padding-sm) var(--us-card-padding-md) var(--us-card-padding-md);
  }

  .bc__title {
    font-size: var(--text-base);
  }

  .bc--featured .bc__title {
    font-size: var(--text-lg);
  }

  .bf {
    padding: var(--us-card-padding-sm) 0;
  }

  .bf:hover {
    transform: translateX(4px);
  }

  .bf__title {
    font-size: var(--text-base);
  }
}

@media (max-width: 480px) {
  .pc__metrics {
    gap: var(--us-space-2);
  }

  .pc__metric-value {
    font-size: var(--text-lg);
  }

  .pc__metric-label {
    font-size: var(--text-xs);
  }
}

/* ===== Reduced Motion ===== */
@media (prefers-reduced-motion: reduce) {
  .pc,
  .bc,
  .bf,
  .pc::before,
  .bc::before,
  .bf::before,
  .pc__title,
  .bc__title,
  .bf__title,
  .bc__cover-img,
  .bc__arrow,
  .bf__arrow,
  .pc__tag,
  .bc__tag,
  .pc__link,
  .pc__metric {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }

  .pc:hover {
    transform: none !important;
  }

  .bc:hover {
    transform: none !important;
  }

  .bf:hover {
    transform: none !important;
  }

  .pc:hover::before,
  .bc:hover::before,
  .bf:hover::before {
    width: 2px !important;
    height: 2px !important;
  }
}

/* Touch device — disable hover lift effects */
@media (hover: none) {
  .pc:hover {
    transform: none;
  }

  .bc:hover {
    transform: none;
  }

  .bf:hover {
    transform: none;
  }
}
</style>
