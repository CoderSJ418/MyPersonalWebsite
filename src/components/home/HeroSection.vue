<template>
  <!-- ═══════════════════════════════════════════════════════════
       HERO — Stripe-Accurate v13.0
       ═══════════════════════════════════════════════════════════
       - Canvas = full hero (gradient fills entire viewport)
       - Content = 1216px baseline container centered
       - Content overlaid on top of the gradient
       ═══════════════════════════════════════════════════════════ -->
  <section ref="heroRef" class="hero">
    <!-- Stripe WebGL gradient mesh — full hero -->
    <canvas
      id="stripe-gradient-canvas"
      ref="gradientCanvasRef"
      class="hero__mesh-canvas"
      aria-hidden="true"
    ></canvas>

    <!-- Content — 1216px baseline container, centered -->
    <div class="hero__content">
      <div class="hero__text-wrapper">
        <h1 class="hero__name hero__name--top">佘杰</h1>
        <h1 class="hero__name hero__name--blended" aria-hidden="true">佘杰</h1>
        <h1 class="hero__name hero__name--overlay" aria-hidden="true">佘杰</h1>
      </div>

      <div class="hero__name-accent" aria-hidden="true"></div>

      <p class="hero__subtitle">
        Vue Expert · Frontend Architect
      </p>

      <p class="hero__positioning">
        专注高性能前端架构，从0到1构建可规模化工程体系
      </p>

      <div class="hero__actions">
        <CTA href="/projects" variant="primary" size="large" label="查看作品集">查看作品集</CTA>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * HeroSection — Stripe-Accurate v13.0
 *
 * - Canvas = full hero (gradient fills entire viewport)
 * - Content = 1216px baseline container, centered
 * - Three-layer text blend mode
 */

import { ref, onMounted, onUnmounted } from 'vue'
import CTA from '@/components/ui/CTA.vue'
import { gsap } from 'gsap'
import { useStripeGradient } from '@/composables/useStripeGradient'
import { useStripeScrollAnimation } from '@/composables/useStripeScrollAnimation'

const heroRef = ref<HTMLElement | null>(null)
const gradientCanvasRef = ref<HTMLCanvasElement | null>(null)

useStripeGradient(heroRef, gradientCanvasRef)

const { heroEntrance, cleanup } = useStripeScrollAnimation()

const triggerEntry = () => {
  if (heroRef.value) {
    gsap.to(heroRef.value, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    })
  }
  heroEntrance(heroRef, {
    name: '.hero__name--top',
    role: '.hero__subtitle',
    positioning: '.hero__positioning',
    actions: '.hero__actions',
  })
}

onMounted(() => {
  triggerEntry()
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
/* ============================================
   HERO — Stripe-Accurate v13.0
   ═════════════════════════════════════════
   - Canvas = full hero (gradient fills viewport)
   - Content = 1216px baseline container
   - Minimal: headline + subtitle + CTA
   ============================================ */

.hero {
  position: relative;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  overflow: hidden;
}

/* ── Canvas = full hero ── */
.hero__mesh-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

/* ── Content — 1216px baseline, centered ── */
.hero__content {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1216px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: var(--us-space-16);
}

/* ═══ Three-Layer Text System ═══ */
.hero__text-wrapper {
  position: relative;
  line-height: 0;
}

.hero__name--top {
  font-size: clamp(64px, 8vw, 96px);
  font-weight: 700;
  line-height: var(--leading-none);
  letter-spacing: -0.04em;
  margin: 0;
  color: #1a1a2e;
  position: relative;
  z-index: 3;
}

.hero__name--blended {
  font-size: clamp(64px, 8vw, 96px);
  font-weight: 700;
  line-height: var(--leading-none);
  letter-spacing: -0.04em;
  margin: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  color: #3a3a3a;
  mix-blend-mode: color-burn;
  z-index: 2;
  pointer-events: none;
}

.hero__name--overlay {
  font-size: clamp(64px, 8vw, 96px);
  font-weight: 700;
  line-height: var(--leading-none);
  letter-spacing: -0.04em;
  margin: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  color: #3a3a3a;
  opacity: 0.2;
  z-index: 1;
  pointer-events: none;
}

.dark .hero__name--top {
  color: #ffffff;
}

.dark .hero__name--blended {
  color: #6a6a7a;
}

/* ── Name Accent Line ── */
.hero__name-accent {
  width: 48px;
  height: 3px;
  background: linear-gradient(90deg, #ef008f, #7038ff);
  border-radius: 2px;
  margin-top: var(--us-space-6);
  margin-bottom: var(--us-space-6);
}

/* ── Subtitle ── */
.hero__subtitle {
  font-size: clamp(18px, 2.2vw, 22px);
  font-weight: 500;
  line-height: var(--leading-normal);
  margin: 0 0 var(--us-space-4) 0;
  letter-spacing: 0.04em;
  color: #4b5563;
}

.dark .hero__subtitle {
  color: #d1d5db;
}

/* ── Positioning ── */
.hero__positioning {
  font-size: clamp(15px, 1.6vw, 17px);
  font-weight: 400;
  line-height: var(--leading-relaxed);
  color: #6b7280;
  max-width: 520px;
  margin: 0 0 var(--us-space-10) 0;
}

.dark .hero__positioning {
  color: #9ca3af;
}

/* ── Actions ── */
.hero__actions {
  display: flex;
  gap: var(--us-space-4);
  justify-content: center;
}

/* ============================================
   Responsive
   ============================================ */
@media (max-width: 768px) {
  .hero__content {
    padding: 0 24px;
    padding-top: var(--us-space-12);
  }

  .hero__name--top,
  .hero__name--blended,
  .hero__name--overlay {
    font-size: var(--text-5xl);
  }

  .hero__name-accent {
    width: 40px;
    margin-top: var(--us-space-4);
    margin-bottom: var(--us-space-4);
  }

  .hero__actions {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .hero__name--top,
  .hero__name--blended,
  .hero__name--overlay {
    font-size: var(--text-4xl);
  }

  .hero__name-accent {
    width: 36px;
  }
}

/* ============================================
   Reduced Motion
   ============================================ */
@media (prefers-reduced-motion: reduce) {
  .hero {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }

  .hero__mesh-canvas {
    display: none !important;
  }

  .hero__name--blended {
    mix-blend-mode: normal;
    opacity: 1;
  }

  .hero__name--overlay {
    display: none;
  }
}
</style>
