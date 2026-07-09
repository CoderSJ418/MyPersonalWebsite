<template>
  <!-- ═══════════════════════════════════════════════════════════
       HERO — Stripe-Accurate v10.0
       ═══════════════════════════════════════════════════════════
       White background, WebGL gradient mesh (whatamesh),
       three-layer text with mix-blend-mode: color-burn.
       No glass panel — text sits directly on the gradient.
       ═══════════════════════════════════════════════════════════ -->
  <section ref="heroRef" class="hero">
    <!-- Stripe-style WebGL gradient mesh canvas -->
    <canvas
      id="stripe-gradient-canvas"
      ref="gradientCanvasRef"
      class="hero__mesh-canvas"
      aria-hidden="true"
    ></canvas>

    <!-- Content — flat on white, no glass panel -->
    <div class="hero__content">
      <!-- Three-layer text system for Stripe blend effect -->
      <div class="hero__text-wrapper">
        <h1 class="hero__name hero__name--top">佘杰</h1>
        <h1 class="hero__name hero__name--blended" aria-hidden="true">佘杰</h1>
        <h1 class="hero__name hero__name--overlay" aria-hidden="true">佘杰</h1>
      </div>

      <div class="hero__name-accent" aria-hidden="true"></div>

      <div class="hero__metrics">
        <div class="metric">
          <div class="metric__value">
            <span data-count-up="7">0</span><span class="metric__suffix">+</span>
          </div>
          <div class="metric__label">Years</div>
        </div>
        <div class="metric">
          <div class="metric__value">
            <span data-count-up="50">0</span><span class="metric__suffix">+</span>
          </div>
          <div class="metric__label">Projects</div>
        </div>
        <div class="metric">
          <div class="metric__value">
            <span data-count-up="10">0</span><span class="metric__suffix">+</span>
          </div>
          <div class="metric__label">Team Size</div>
        </div>
      </div>

      <div class="hero__role">Vue Expert · Frontend Architect</div>

      <p class="hero__positioning">
        专注高性能前端架构，从0到1构建可规模化工程体系
      </p>
      <div class="hero__actions">
        <CTA href="/projects" variant="primary" size="large" label="查看作品集">查看作品</CTA>
        <CTA href="mailto:912999051@qq.com" variant="outline" size="large" label="联系我">联系我</CTA>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * HeroSection — Stripe-Accurate v10.0
 *
 * - whatamesh WebGL gradient (Stripe's MiniGL)
 * - Three-layer text with mix-blend-mode: color-burn
 * - White background, no glass panel
 * - GSAP choreographed entrance
 */

import { ref, onMounted, onUnmounted } from 'vue'
import CTA from '@/components/ui/CTA.vue'
import { gsap } from 'gsap'
import { useStripeGradient } from '@/composables/useStripeGradient'
import { useStripeScrollAnimation } from '@/composables/useStripeScrollAnimation'

const heroRef = ref<HTMLElement | null>(null)
const gradientCanvasRef = ref<HTMLCanvasElement | null>(null)

// Stripe-accurate WebGL gradient mesh via whatamesh
useStripeGradient(heroRef, gradientCanvasRef)

// Stripe-level GSAP scroll animation system
const { heroEntrance, cleanup } = useStripeScrollAnimation()

/** Count-Up Animation */
const animateCountUp = () => {
  if (!heroRef.value) return
  const elements = heroRef.value.querySelectorAll<HTMLElement>('[data-count-up]')
  elements.forEach((el) => {
    const target = parseInt(el.dataset.countUp || '0', 10)
    const duration = 1500
    const startTime = performance.now()
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const update = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutCubic(progress)
      const currentValue = Math.round(easedProgress * target)
      el.textContent = String(currentValue)
      if (progress < 1) {
        requestAnimationFrame(update)
      }
    }
    requestAnimationFrame(update)
  })
}

/** Entry — GSAP choreographed entrance */
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
    metrics: '.metric',
    role: '.hero__role',
    positioning: '.hero__positioning',
    actions: '.hero__actions',
  })
}

onMounted(() => {
  triggerEntry()
  setTimeout(animateCountUp, 1200)
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
/* ============================================
   HERO — Stripe-Accurate v10.0
   ═════════════════════════════════════════
   White background, WebGL gradient mesh,
   three-layer text blend mode, no glass panel
   ============================================ */

/* ── Hero Root ── */
.hero {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #fafafa;
  padding: var(--us-space-24) var(--us-space-6) var(--us-space-20);
}

/* ── Gradient Mesh Canvas ── */
.hero__mesh-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

/* ── Content Container ── */
.hero__content {
  position: relative;
  z-index: 10;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* ═══ Three-Layer Text System ═══ */
.hero__text-wrapper {
  position: relative;
  line-height: 0;
}

/* Layer 1: Normal text on top */
.hero__name--top {
  font-size: clamp(56px, 9vw, 80px);
  font-weight: 600;
  line-height: var(--leading-none);
  letter-spacing: -0.03em;
  margin: 0 0 var(--us-space-2) 0;
  color: #1a1a2e;
  position: relative;
  z-index: 3;
}

/* Layer 2: color-burn blend layer — text color interacts with gradient behind */
.hero__name--blended {
  font-size: clamp(56px, 9vw, 80px);
  font-weight: 600;
  line-height: var(--leading-none);
  letter-spacing: -0.03em;
  margin: 0 0 var(--us-space-2) 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  color: #3a3a3a;
  mix-blend-mode: color-burn;
  z-index: 2;
  pointer-events: none;
}

/* Layer 3: overlay — subtle opacity boost for readability */
.hero__name--overlay {
  font-size: clamp(56px, 9vw, 80px);
  font-weight: 600;
  line-height: var(--leading-none);
  letter-spacing: -0.03em;
  margin: 0 0 var(--us-space-2) 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  color: #3a3a3a;
  opacity: 0.2;
  z-index: 1;
  pointer-events: none;
}

/* Dark mode text colors */
.dark .hero {
  background: #0a0a1a;
}

.dark .hero__name--top {
  color: #ffffff;
}

.dark .hero__name--blended {
  color: #6a6a7a;
}

/* ── Name Accent Line ── */
.hero__name-accent {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #ef008f, #7038ff);
  border-radius: 2px;
  margin-top: var(--us-space-2);
  margin-bottom: var(--us-space-4);
}

/* ── Metrics ── */
.hero__metrics {
  display: flex;
  gap: var(--us-space-4);
  margin-bottom: var(--us-space-8);
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--us-space-3) var(--us-space-4);
  border-radius: var(--radius-card);
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition:
    transform var(--us-duration-normal) var(--us-easing-enter),
    box-shadow var(--us-duration-normal) var(--us-easing-enter);
  cursor: default;
}

.metric:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.metric__value {
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  font-size: 2rem;
  line-height: var(--leading-none);
  color: #7038ff;
  margin-bottom: var(--us-space-1);
}

.metric__suffix {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  font-size: var(--text-xl);
  line-height: var(--leading-none);
  color: #7038ff;
  opacity: 0.7;
}

.metric__label {
  font-size: var(--text-xs);
  font-weight: 600;
  line-height: var(--leading-none);
  color: #6b7280;
  letter-spacing: 0.02em;
}

/* Dark mode metrics */
.dark .metric {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.08);
}

.dark .metric__value {
  color: #a78bfa;
}

.dark .metric__suffix {
  color: #a78bfa;
}

.dark .metric__label {
  color: #9ca3af;
}

/* ── Role ── */
.hero__role {
  display: inline-block;
  font-size: 18px;
  font-weight: 500;
  line-height: var(--leading-normal);
  margin: 0 0 var(--us-space-8) 0;
  letter-spacing: 0.06em;
  color: #4b5563;
}

.dark .hero__role {
  color: #d1d5db;
}

/* ── Positioning ── */
.hero__positioning {
  font-size: var(--text-lg);
  font-weight: 400;
  line-height: var(--leading-relaxed);
  color: #4b5563;
  max-width: 540px;
  margin: 0 0 var(--us-space-8) 0;
  letter-spacing: -0.01em;
}

.dark .hero__positioning {
  color: #9ca3af;
}

/* ── Actions ── */
.hero__actions {
  display: flex;
  gap: var(--us-space-4);
  margin-bottom: var(--us-space-8);
}

/* ============================================
   Responsive
   ============================================ */
@media (max-width: 768px) {
  .hero {
    padding: var(--us-space-24) var(--us-space-4) var(--us-space-16);
  }

  .hero__name--top,
  .hero__name--blended,
  .hero__name--overlay {
    font-size: var(--text-5xl);
  }

  .hero__metrics {
    gap: var(--us-space-3);
  }

  .metric {
    padding: var(--us-space-3) var(--us-space-4);
  }

  .metric__value {
    font-size: 1.5rem;
  }

  .metric__suffix {
    font-size: var(--text-base);
  }

  .hero__actions {
    flex-direction: column;
    gap: var(--us-space-3);
  }
}

@media (max-width: 480px) {
  .hero__name--top,
  .hero__name--blended,
  .hero__name--overlay {
    font-size: var(--text-4xl);
  }

  .hero__metrics {
    flex-wrap: wrap;
  }

  .metric {
    flex: 1;
    min-width: 80px;
    padding: var(--us-space-3);
  }

  .metric__value {
    font-size: 1.25rem;
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

  .hero__name-accent {
    width: 60px !important;
    transition: none !important;
  }

  .metric:hover {
    transform: none;
  }
}
</style>
