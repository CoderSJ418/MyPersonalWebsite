<template>
  <!-- ═══════════════════════════════════════════════════════════
       HERO — Content-Focused v9.0
       ═══════════════════════════════════════════════════════════
       "我是谁" — 单焦点，内容优先，极少动效
       
       Structure: hero > subtle-glow + content > panel
       - Subtle accent glow (single, static)
       - Name = primary focus
       - Metrics / Role / Actions / Social = supporting info
       ═══════════════════════════════════════════════════════════ -->
  <section ref="heroRef" class="hero">
    <!-- Stripe-style gradient mesh canvas background -->
    <canvas ref="gradientCanvasRef" class="hero__mesh-canvas" aria-hidden="true"></canvas>
    <!-- Stripe-style grid overlay — subtle line pattern -->
    <div class="hero__grid-overlay" aria-hidden="true"></div>
    <!-- Ambient glow (kept for fallback / depth layering) -->
    <div class="hero__glow" aria-hidden="true"></div>

    <!-- Content — flat, no z-layers -->
    <div class="hero__content">
      <div ref="panelRef" class="hero__panel">
        <h1 class="hero__name stripe-text-gradient">佘杰</h1>
        <div class="hero__name-accent" aria-hidden="true"></div>

        <div class="hero__metrics">
          <div class="metric stripe-glow">
            <div class="metric__value">
              <span data-count-up="7">0</span><span class="metric__suffix">+</span>
            </div>
            <div class="metric__label">Years</div>
          </div>
          <div class="metric stripe-glow">
            <div class="metric__value">
              <span data-count-up="50">0</span><span class="metric__suffix">+</span>
            </div>
            <div class="metric__label">Projects</div>
          </div>
          <div class="metric stripe-glow">
            <div class="metric__value">
              <span data-count-up="10">0</span><span class="metric__suffix">+</span>
            </div>
            <div class="metric__label">Team Size</div>
          </div>
        </div>

        <div class="hero__role stripe-text-gradient">Vue Expert · Frontend Architect</div>

        <p class="hero__positioning">
          专注高性能前端架构，从0到1构建可规模化工程体系
        </p>
        <div class="hero__actions">
          <CTA href="/projects" variant="primary" size="large" label="查看作品集">查看作品</CTA>
          <CTA href="mailto:912999051@qq.com" variant="outline" size="large" label="联系我">联系我</CTA>
        </div>
      </div>
    </div>

    <!-- Bottom Fade -->
    <div class="hero__fade" aria-hidden="true"></div>
  </section>
</template>

<script setup lang="ts">
/**
 * HeroSection — Content-Focused v9.0 + Stripe Motion
 *
 * Stripe-level entrance choreography:
 * - GSAP timeline: name → metrics → role → positioning → actions → social
 * - Canvas gradient mesh background
 * - Count-up animation for metrics
 * - Spring-like micro-interactions
 */
import { ref, onMounted, onUnmounted } from 'vue'
import CTA from '@/components/ui/CTA.vue'
import { gsap } from 'gsap'
import { useStripeGradient } from '@/composables/useStripeGradient'
import { useStripeScrollAnimation } from '@/composables/useStripeScrollAnimation'

const heroRef = ref<HTMLElement | null>(null)
const gradientCanvasRef = ref<HTMLCanvasElement | null>(null)

// Stripe-style WebGL gradient mesh background — Vertex displacement + WaveLayer color mixing
useStripeGradient(heroRef, gradientCanvasRef, {
  accentColor: '#ef008f',
  secondaryColor: '#6ec3f4',
  tertiaryColor: '#7038ff',
  darkenTop: true,
})

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
  // Animate the hero container itself (GSAP takes over from CSS default opacity:0)
  if (heroRef.value) {
    gsap.to(heroRef.value, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    })
  }
  // GSAP handles the choreographed entrance of all hero elements
  heroEntrance(heroRef, {
    name: '.hero__name',
    metrics: '.metric',
    role: '.hero__role',
    positioning: '.hero__positioning',
    actions: '.hero__actions',
  })
}

onMounted(() => {
  triggerEntry()
  // Count-up starts after metrics have faded in (GSAP timeline delay ~0.6s + 0.6s duration)
  setTimeout(animateCountUp, 1200)
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
/* ============================================
   HERO — Content-Focused v9.0
   ─────────────────────────────────────────
   "我是谁" — 单焦点，内容优先，极少动效
   - 单一微光 (hero__glow)
   - 名字 = 主焦点 (渐变文字 + 单drop-shadow)
   - 卡片hover = translateY + shadow elevation
   - 无tilt/spring/3D/perspective/clip-path
   ============================================ */

/* ── Hero Root ── */
.hero {
  position: relative;
  min-height: 100vh;
  /* fallback for older browsers */
  min-height: 100dvh;
  /* dynamic viewport height for mobile */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: transparent;
  padding: var(--us-space-24) var(--us-space-6) var(--us-space-20);
  /* Entry animation handled by GSAP heroEntrance — no CSS transition needed */
}

/* ── Gradient Mesh Canvas ── */
.hero__mesh-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  /* Stripe gradient colors — magenta/cyan/purple/gold (authentic Stripe palette) */
  --gradient-color-1: #ef008f;
  --gradient-color-2: #6ec3f4;
  --gradient-color-3: #7038ff;
  --gradient-color-4: #ffba27;
}

/* Dark mode — same authentic Stripe palette, slightly richer */
.dark .hero__mesh-canvas {
  --gradient-color-1: #ef008f;
  --gradient-color-2: #6ec3f4;
  --gradient-color-3: #7038ff;
  --gradient-color-4: #ffba27;
}

/* ── Ambient Glow ── */
.hero__glow {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(ellipse at center,
      var(--us-accent-subtle) 0%,
      transparent 70%);
  opacity: 0.4;
  pointer-events: none;
  z-index: 0;
}

/* ── Stripe-style Grid Overlay — subtle line pattern ── */
.hero__grid-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  opacity: 0;
  transition: opacity 2s ease-out;
  /* Grid lines — horizontal + vertical */
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 80px 80px;
  /* Radial fade — center visible, edges fade out */
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 70%);
  mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 70%);
}

.hero--entered .hero__grid-overlay {
  opacity: 1;
}

/* ── Bottom Fade ── */
.hero__fade {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(to bottom, transparent 0%, var(--us-bg-end) 100%);
  pointer-events: none;
  z-index: var(--z-sticky);
}

/* ── Content Container ── */
.hero__content {
  position: relative;
  z-index: var(--z-sticky);
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Glass Panel ── */
.hero__panel {
  position: relative;
  padding: var(--us-hero-padding);
  border-radius: var(--radius-xl);
  background: var(--us-glass-bg);
  border: 1px solid var(--us-glass-border);
  box-shadow: var(--us-depth-2);
  max-width: min(var(--measure-relaxed), 860px);
  width: 100%;
  transition:
    transform var(--us-duration-slow) var(--us-easing),
    box-shadow var(--us-duration-slow) var(--us-easing),
    border-color var(--us-duration-slow) var(--us-easing);
}

.hero__panel:hover {
  transform: translateY(var(--us-lift-lg));
  box-shadow: var(--us-depth-3);
  border-color: var(--us-accent-border);
}

/* Dark mode: accent glow on panel hover */
:root.dark .hero__panel:hover {
  box-shadow: var(--us-depth-3), var(--us-accent-glow);
}

/* Dark mode — dark glass panel so white text is readable */
:root.dark .hero__panel {
  background: rgba(15, 15, 24, 0.85);
  border-color: rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(20px);
}

/* ── Name — Primary Focus ── */
.hero__name {
  font-size: clamp(56px, 9vw, 80px);
  font-weight: 600;
  line-height: var(--leading-none);
  letter-spacing: -0.03em;
  margin: 0 0 var(--us-space-2) 0;
  color: var(--us-text-primary);
}

/* ── Name Accent Line — decorative bar below name ── */
.hero__name-accent {
  width: 60px;
  height: 3px;
  background: var(--us-accent);
  border-radius: 2px;
  margin-top: var(--us-space-2);
  margin-bottom: var(--us-space-4);
  transition: width 0.6s var(--us-easing-enter);
}

.hero--entered .hero__name-accent {
  width: 80px;
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
  border-radius: var(--us-card-radius);
  background: var(--us-surface);
  border: 1px solid var(--us-border);
  box-shadow: var(--us-depth-1);
  transition:
    transform var(--us-duration-normal) var(--us-easing-enter),
    box-shadow var(--us-duration-normal) var(--us-easing-enter),
    border-color var(--us-duration-normal) var(--us-easing-enter);
  cursor: default;
}

.metric:hover {
  transform: translateY(var(--us-lift-md));
  box-shadow: var(--us-depth-1-hover);
  border-color: var(--us-accent-border);
}

.metric__value {
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  font-size: 2rem;
  line-height: var(--leading-none);
  color: var(--us-accent);
  margin-bottom: var(--us-space-1);
}

.metric__suffix {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  font-size: var(--text-xl);
  line-height: var(--leading-none);
  color: var(--us-accent);
  opacity: 0.7;
}

.metric__label {
  font-size: var(--text-xs);
  font-weight: 600;
  line-height: var(--leading-none);
  color: var(--us-text-tertiary);
  letter-spacing: 0.02em;
}

/* ── Role — gradient text only, no pill decoration ── */
.hero__role {
  display: inline-block;
  font-size: 18px;
  font-weight: 500;
  line-height: var(--leading-normal);
  margin: 0 0 var(--us-space-8) 0;
  letter-spacing: 0.06em;
}

/* ── Positioning ── */
.hero__positioning {
  font-size: var(--text-lg);
  font-weight: 400;
  line-height: var(--leading-relaxed);
  color: var(--us-text-secondary);
  max-width: 540px;
  margin: 0 0 var(--us-space-8) 0;
  letter-spacing: -0.01em;
}

/* ── Actions ── */
.hero__actions {
  display: flex;
  gap: var(--us-space-4);
  margin-bottom: var(--us-space-8);
}

/* ── GSAP entrance — initial states set by JS, no CSS vs-reveal needed ── */
/* GSAP sets opacity:0 and y:offset on mount, then animates to visible */

/* ============================================
   Responsive
   ============================================ */
@media (max-width: 768px) {
  .hero {
    padding: var(--us-space-24) var(--us-space-4) var(--us-space-16);
  }

  .hero__panel {
    padding: var(--us-space-10) var(--us-space-6);
    border-radius: var(--radius-xl);
  }

  .hero__name {
    font-size: var(--text-5xl);
  }

  .hero__name-accent {
    width: 50px;
  }

  .hero--entered .hero__name-accent {
    width: 60px;
  }

  .hero__metrics {
    gap: var(--us-space-3);
  }

  .metric {
    padding: var(--us-space-3) var(--us-space-4);
    border-radius: var(--radius-lg);
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

  .hero__glow {
    width: 500px;
    height: 350px;
  }
}

@media (max-width: 480px) {
  .hero__name {
    font-size: var(--text-4xl);
  }

  .hero__name-accent {
    width: 40px;
  }

  .hero--entered .hero__name-accent {
    width: 50px;
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

  .hero__glow {
    width: 350px;
    height: 250px;
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

  .hero__name {
    filter: none;
  }

  .hero__name-accent {
    width: 80px !important;
    transition: none !important;
  }

  .hero__panel {
    transition: none !important;
  }

  .hero__panel:hover {
    transform: none;
  }

  .metric:hover {
    transform: none;
  }

  /* GSAP-animated elements: force visible */
  .hero__name,
  .metric,
  .hero__role,
  .hero__positioning,
  .hero__actions,
  .hero__social {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }
}
</style>