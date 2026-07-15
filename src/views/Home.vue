<template>
  <div class="home">
    <SEOHead
      title="佘杰 - 前端开发工程师" description="7年前端开发经验，Vue 专家" keywords="佘杰,前端开发,Vue.js" type="profile"
      :structured-data="personStructuredData()" />

    <HeroSection />

    <div class="home__gap home__gap--tight"></div>

    <FeaturedProjects />

    <div class="home__gap">
      <div class="stripe-divider"></div>
    </div>

    <DeferredHomeSections />

    <!-- Static vignette for depth framing -->
    <div class="home__vignette home__vignette--top" aria-hidden="true"></div>
    <div class="home__vignette home__vignette--bottom" aria-hidden="true"></div>
  </div>
</template>

<script setup lang="ts">
/**
 * Home — Content-Focused v9.0
 *
 * 极简布局：内容优先，无视差/光场/注意力图
 * - 无：5-layer parallax, 4 glow blobs, light-field, mesh, noise
 * - 无：useGlobalLight, useScrollParallax, useAttentionGraph
 * - 静态背景渐变 + 简单vignette
 */
import { defineAsyncComponent } from 'vue'
import HeroSection from '@/components/home/HeroSection.vue'
import SEOHead from '@/components/common/SEOHead.vue'
import { personStructuredData } from '@/utils/structuredData'

// 首屏下方组件懒加载 — 减少首屏JS体积，用户滚动时按需加载
const FeaturedProjects = defineAsyncComponent(() => import('@/components/home/FeaturedProjects.vue'))
const DeferredHomeSections = defineAsyncComponent(() => import('@/components/home/DeferredHomeSections.vue'))
</script>

<style scoped>
/* ============================================
   Home — Content-Focused v9.0
   ─────────────────────────────────────────
   简单布局：渐变背景 + 内容组件 + 静态vignette
   无parallax/glow/light-field/attention-graph
   ============================================ */

.home {
  position: relative;
  min-height: 100vh;
  /* fallback for older browsers */
  min-height: 100dvh;
  /* dynamic viewport height for mobile */
  background: linear-gradient(180deg, var(--us-bg-start) 0%, var(--us-bg-end) 100%);
  color: var(--us-text-primary);
  padding-top: var(--us-header-height);
  overflow-x: hidden;
}

/* ── Section Spacing ── */
.home__gap {
  position: relative;
  height: var(--us-space-24);
}

/* Tighter gap after Hero — Hero has its own 200px bottom fade */
.home__gap--tight {
  height: var(--us-space-12);
}

/* ── Static Vignette ── */
.home__vignette {
  position: fixed;
  left: 0;
  right: 0;
  pointer-events: none;
  z-index: var(--z-sticky);
}

.home__vignette--top {
  top: 0;
  height: var(--us-space-20);
  background: linear-gradient(to bottom, var(--us-bg-start), transparent);
  opacity: 0.3;
}

.home__vignette--bottom {
  bottom: 0;
  height: var(--us-space-20);
  background: linear-gradient(to top, var(--us-bg-end), transparent);
  opacity: 0.3;
}

/* ── Reduced Motion ── */
@media (prefers-reduced-motion: reduce) {
  .home__vignette {
    position: absolute;
  }
}
</style>
