<script setup lang="ts">
/**
 * ProjectNarrative — Presentation-only Render Engine
 *
 * 纯渲染引擎，零数据转换逻辑
 * - 输入：RecruitView | ReaderView + density
 * - 输出：纯UI
 * - density仅控制视觉（布局/间距/字号），不控制数据结构
 *
 * 禁止：selector调用、schema mapping、数据转换、store access
 *
 * 视觉系统 v3.0 — Unified System (us-* tokens)
 * - Typography: us-text-* scale + component-level metric tokens
 * - Color: us-text-* hierarchy (primary/secondary/tertiary/accent)
 * - Layout: 800px container, us-gap-* spacing
 * - Component: Metrics卡片 / Narrative左线 / Tech单行pill / Context降级
 * - Interaction: opacity + translateY(-4px) only
 * - Mobile: 独立优化，非缩放桌面
 */

import type { RecruitView, ReaderView, NarrativeDensity } from '@/types/view-contract'

interface Props {
  data: RecruitView | ReaderView
  density: NarrativeDensity
}

defineProps<Props>()
</script>

<template>
  <!-- Layer 1: Identity — 项目身份锚点 -->
  <div class="pn" :class="`pn--${density}`">
    <h1 class="pn__title">{{ data.title }}</h1>

    <!-- Layer 2: Evidence — 能力证据（Metrics） -->
    <div v-if="data.narrative?.metrics?.length" class="pn__metrics">
      <div v-for="metric in data.narrative.metrics" :key="metric.label" class="pn__metric">
        <span class="pn__metric-value">{{ metric.value }}</span>
        <span class="pn__metric-label">{{ metric.label }}</span>
      </div>
    </div>

    <!-- Layer 3: Outcome — 结果叙事（Challenge → Approach → Impact） -->
    <div v-if="data.narrative" class="pn__story">
      <div class="pn__story-item">
        <span class="pn__story-label">Challenge</span>
        <p class="pn__story-text">{{ data.narrative.challenge }}</p>
      </div>
      <div class="pn__story-item">
        <span class="pn__story-label">Approach</span>
        <p class="pn__story-text">{{ data.narrative.approach }}</p>
      </div>
      <div class="pn__story-item">
        <span class="pn__story-label">Impact</span>
        <p class="pn__story-text">{{ data.narrative.impact }}</p>
      </div>
    </div>

    <!-- Layer 4: Context — 系统说明（Description） -->
    <span class="pn__desc-label">Context</span>
    <p class="pn__desc">{{ data.description }}</p>

    <!-- Layer 5: Validation — 技术验证（Tech Stack） -->
    <div v-if="data.techStack.length" class="pn__tech">
      <span v-for="tech in data.techStack" :key="tech.name" class="pn__tech-tag">
        {{ tech.displayLabel }}
      </span>
    </div>

    <!-- Action: Links -->
    <div v-if="data.demoUrl || data.githubUrl" class="pn__links">
      <a
v-if="data.demoUrl" :href="data.demoUrl" target="_blank" rel="noopener noreferrer"
        class="pn__link pn__link--primary">
        查看演示
      </a>
      <a
v-if="data.githubUrl" :href="data.githubUrl" target="_blank" rel="noopener noreferrer"
        class="pn__link pn__link--secondary">
        查看源码
      </a>
    </div>
  </div>
</template>

<style scoped>
/* ═══════════════════════════════════════════════════════
   Project Narrative — Unified System v3.0
   us-* tokens + component-level private tokens
   Token-driven, IA-locked, Mobile-first
   ═══════════════════════════════════════════════════════ */

/* ─── Root Container + Component-Level Private Tokens ── */
.pn {
  /* Component-level private tokens (no vs-* equivalent) */
  --pn-metric-value-size: 34px;
  --pn-metric-value-weight: 600;
  --pn-metric-label-size: 11px;
  --pn-metric-label-weight: 400;
  --pn-accent-line-width: 3px;
  --pn-tech-pill-height: 24px;
  --pn-hover-opacity: 0.8;

  max-width: var(--measure-relaxed);
  margin-bottom: var(--us-space-6);
}

/* ─── Layer 1: Identity — Title ──────────────────────── */
.pn__title {
  font-size: 2.25rem;
  font-weight: 600;
  color: var(--us-text-primary);
  letter-spacing: -0.02em;
  line-height: var(--leading-tight);
  margin: 0 0 var(--us-space-2);
}

.pn--reader .pn__title {
  font-size: 1.5rem;
}

/* ─── Layer 2: Evidence — Metrics Block ──────────────── */
/* 卡片式结构，value在上label在下，value视觉权重>title */
.pn__metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--us-space-1);
  margin-bottom: var(--us-space-6);
}

.pn--reader .pn__metrics {
  display: flex;
  gap: var(--us-space-2);
  margin-bottom: var(--us-space-2);
}

.pn__metric {
  display: flex;
  flex-direction: column;
  gap: var(--us-space-1);
  padding: var(--us-space-2);
  background: var(--us-surface);
  border-radius: var(--radius-xl);
  border: 1px solid var(--us-border);
  transition: opacity var(--us-duration-fast) var(--us-easing);
}

.pn__metric:hover {
  opacity: var(--pn-hover-opacity);
}

.pn--reader .pn__metric {
  padding: 0;
  background: transparent;
  border: none;
}

.pn--reader .pn__metric:hover {
  opacity: 1;
}

.pn__metric-value {
  font-size: var(--pn-metric-value-size);
  font-weight: var(--pn-metric-value-weight);
  color: var(--us-accent);
  letter-spacing: -0.02em;
  line-height: var(--leading-tight);
}

.pn--reader .pn__metric-value {
  font-size: 1rem;
  font-weight: 600;
}

.pn__metric-label {
  font-size: var(--pn-metric-label-size);
  font-weight: var(--pn-metric-label-weight);
  color: var(--us-text-tertiary);
  line-height: var(--leading-snug);
}

.pn--reader .pn__metric-label {
  font-size: 0.75rem;
}

/* ─── Layer 3: Outcome — Narrative Block ─────────────── */
/* Impact 是唯一视觉主内容，Challenge/Approach 不参与主视觉竞争 */
.pn__story {
  display: flex;
  flex-direction: column;
  gap: var(--us-space-2);
  margin-bottom: var(--us-space-6);
  padding-left: var(--us-space-2);
  border-left: none;
}

.pn--reader .pn__story {
  gap: var(--us-space-2);
  margin-bottom: var(--us-space-2);
}

/* Recruit Mode: 只保留 Impact — Challenge/Approach 隐藏 */
.pn--recruit .pn__story-item:nth-child(-n+2) {
  display: none;
}

.pn__story-item {
  display: flex;
  flex-direction: column;
  gap: var(--us-space-1);
}

.pn__story-label {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--us-accent);
}

.pn__story-text {
  font-size: 1rem;
  font-weight: 400;
  color: var(--us-text-secondary);
  line-height: var(--leading-relaxed);
  margin: 0;
}

.pn--reader .pn__story-text {
  font-size: 0.875rem;
}

/* ─── Layer 4: Context — Description Block ───────────── */
/* 明确降级为 Context-only，最弱视觉层级 */
.pn__desc-label {
  display: block;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--us-text-tertiary);
  margin-bottom: var(--us-space-1);
}

.pn--reader .pn__desc-label {
  display: none;
}

.pn__desc {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--us-text-tertiary);
  line-height: var(--leading-normal);
  margin: 0 0 var(--us-space-2);
  /* 与 Narrative 保持明确空间隔离（≥24px） */
  margin-top: var(--us-space-6);
}

.pn--reader .pn__desc {
  font-size: 0.9375rem;
  color: var(--us-text-secondary);
  margin-top: 0;
  margin-bottom: var(--us-space-2);
}

/* ─── Layer 5: Validation — Tech Stack Block ─────────── */
/* pill 统一高度，单行优先，溢出折叠 */
.pn__tech {
  display: flex;
  flex-wrap: nowrap;
  gap: var(--us-space-1);
  margin-bottom: var(--us-space-2);
  overflow: hidden;
}

.pn--reader .pn__tech {
  flex-wrap: wrap;
  overflow: visible;
}

.pn__tech-tag {
  display: inline-flex;
  align-items: center;
  height: var(--pn-tech-pill-height);
  padding: 0 var(--us-space-1);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--us-text-tertiary);
  background: var(--us-surface);
  border: 1px solid var(--us-border);
  border-radius: var(--radius-md);
  line-height: var(--leading-none);
  white-space: nowrap;
  transition: opacity var(--us-duration-fast) var(--us-easing),
    transform var(--us-duration-fast) var(--us-easing);
}

.pn__tech-tag:hover {
  opacity: var(--pn-hover-opacity);
  transform: translateY(var(--us-lift-md));
}

/* ─── Decision Closure Signal ────────────────────────── */
.pn--recruit::after {
  content: '';
  display: block;
  margin-top: var(--us-space-6);
  height: 1px;
  background: var(--us-border);
}

/* ─── Action Links ───────────────────────────────────── */
.pn__links {
  display: flex;
  gap: var(--us-space-2);
  flex-wrap: wrap;
  margin-top: var(--us-space-2);
}

.pn__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--us-space-3) var(--us-space-6);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: var(--radius-lg);
  transition: opacity var(--us-duration-fast) var(--us-easing),
    transform var(--us-duration-fast) var(--us-easing);
}

.pn__link:hover {
  opacity: var(--pn-hover-opacity);
  transform: translateY(var(--us-lift-md));
}

.pn__link--primary {
  color: var(--us-text-primary);
  background: var(--us-accent);
}

.pn__link--secondary {
  color: var(--us-text-secondary);
  background: var(--us-surface);
  border: 1px solid var(--us-border);
}

.pn__link--secondary:hover {
  color: var(--us-text-primary);
  border-color: var(--us-accent);
}

/* ═══════════════════════════════════════════════════════
   Mobile — 独立优化（非缩放桌面）
   ═══════════════════════════════════════════════════════ */
@media (max-width: 768px) {
  .pn {
    max-width: 100%;
  }

  /* Title: 缩小但保持层级 */
  .pn__title {
    font-size: 1.75rem;
  }

  .pn--reader .pn__title {
    font-size: 1.25rem;
  }

  /* Metrics: 2-column grid → 1-column stack */
  .pn__metrics {
    grid-template-columns: 1fr 1fr;
    gap: var(--us-space-1);
  }

  .pn__metric-value {
    font-size: 1.5rem;
  }

  /* Narrative: spacing 压缩 20% */
  .pn__story {
    gap: var(--us-space-3);
    padding-left: var(--us-space-3);
    margin-bottom: var(--us-space-6);
  }

  .pn__story-text {
    font-size: 0.875rem;
    line-height: var(--leading-relaxed);
  }

  /* Description: 默认折叠（移动端） */
  .pn__desc {
    margin-top: var(--us-space-4);
    /* 2行截断，点击展开由 JS 控制 */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .pn__desc.is-expanded {
    display: block;
    -webkit-line-clamp: unset;
  }

  /* Tech Stack: 可横滑 */
  .pn__tech {
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
    /* 横滑时右侧渐隐 */
    mask-image: linear-gradient(to right, black 85%, transparent 100%);
    -webkit-mask-image: linear-gradient(to right, black 85%, transparent 100%);
  }

  .pn__tech::-webkit-scrollbar {
    display: none;
  }

  /* Links: 全宽 */
  .pn__links {
    flex-direction: column;
  }

  .pn__link {
    width: 100%;
    text-align: center;
  }
}

/* 小屏手机 (<375px) */
@media (max-width: 374px) {
  .pn__metrics {
    grid-template-columns: 1fr;
  }

  .pn__title {
    font-size: 1.5rem;
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {

  .pn__metric,
  .pn__tech-tag,
  .pn__link {
    transition-duration: 0.01ms !important;
  }
}
</style>