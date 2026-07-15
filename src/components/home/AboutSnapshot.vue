<script setup lang="ts">
/**
 * AboutSnapshot — Content-Focused v9.0 + Stripe Motion
 *
 * Stripe-level entrance choreography:
 * - GSAP entrance: panel fades up with scale
 * - Stripe hover micro-interactions on tags
 */
import { computed, ref, onMounted, onUnmounted } from 'vue'
import personalInfoData from '@/assets/data/personal-info.json'
import skillsData from '@/assets/data/skills.json'
import type { PersonalInfo, Skill } from '@/types/project'
import { useStripeScrollAnimation } from '@/composables/useStripeScrollAnimation'

const personalInfo = computed<PersonalInfo>(() => personalInfoData as PersonalInfo)
const skills = computed<Skill[]>(() => skillsData as Skill[])

const displayedSkills = computed(() => {
  return skills.value
    .filter(s => s.level >= 70)
    .sort((a, b) => b.level - a.level)
    .slice(0, 8)
})

const sectionRef = ref<HTMLElement | null>(null)

// Stripe-level GSAP scroll animation system
const { entrance, cleanup } = useStripeScrollAnimation()

onMounted(() => {
  // GSAP entrance for the about panel
  entrance(sectionRef.value?.querySelector('.as__panel') || null, {
    start: 'top 85%',
    duration: 0.8,
    ease: 'power3.out',
    yOffset: 50,
  })
})

onUnmounted(() => {
  cleanup()
})
</script>

<template>
  <section ref="sectionRef" class="as stripe-section stripe-section--about stripe-orbs stripe-orbs--violet">
    <div class="stripe-orb-extra stripe-orb-extra--violet" style="bottom:10%;right:-5%;" aria-hidden="true"></div>
    <div class="as__container">
      <div class="as__panel stripe-card vs-light-surface stripe-border stripe-border--animated">
        <div class="as__content">
          <div class="as__left">
            <h2 class="as__title">关于我</h2>
            <p class="as__bio">{{ personalInfo.bio }}</p>
            <div class="as__meta">
              <span class="as__metric">{{ personalInfo.yearsOfExperience }}+ 年经验</span>
              <span class="as__metric-divider" />
              <span class="as__metric">{{ personalInfo.location }}</span>
            </div>
          </div>
          <div class="as__right">
            <h3 class="as__skills-title">核心技术栈</h3>
            <div class="as__skills-grid">
              <span v-for="skill in displayedSkills" :key="skill.id" class="as__skill stripe-tag">{{ skill.name
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ============================================
   AboutSnapshot — Content-Focused v9.0
   ─────────────────────────────────────────
   身份声明面板：Elevated材质 + 纯CSS hover
   无spring/tilt/field-intensity/surface/edge
   ============================================ */

.as {
  position: relative;
  margin-top: var(--us-space-12);
  padding: var(--us-space-8) 0;
  background: transparent;
}

.as__container {
  position: relative;
  z-index: var(--z-local);
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--us-space-4);
}

/* ── Panel ── */
.as__panel {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-xl);
  background: var(--us-material-elevated-bg);
  border: 1px solid var(--us-material-elevated-border);
  box-shadow: var(--us-depth-2);
  border-left: none;
  transition:
    transform var(--us-duration-normal) var(--us-easing),
    box-shadow var(--us-duration-normal) var(--us-easing),
    border-color var(--us-duration-fast) var(--us-easing);
}

.as__panel:hover {
  transform: translateY(var(--us-lift-md));
  box-shadow: var(--us-depth-2-hover);
  border-color: var(--us-accent-border);
}

.as__panel:active {
  transform: translateY(var(--us-lift-sm)) scale(0.95);
}

/* ── Content ── */
.as__content {
  position: relative;
  z-index: var(--z-local);
  display: flex;
  flex-direction: column;
  gap: var(--us-space-6);
  padding: var(--us-space-5);
}

/* ── Left Column ── */
.as__left {
  display: flex;
  flex-direction: column;
  gap: var(--us-space-3);
}

/* ── Right Column ── */
.as__right {
  display: flex;
  flex-direction: column;
  gap: var(--us-space-3);
}

/* ── Title ── */
.as__title {
  margin: 0 0 var(--us-space-2) 0;
  font-size: var(--text-2xl);
  font-weight: 600;
  color: var(--us-text-primary);
  line-height: var(--leading-tight);
  letter-spacing: -0.02em;
}

/* ── Bio ── */
.as__bio {
  margin: 0;
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: var(--us-text-secondary);
  max-width: 640px;
}

/* ── Meta ── */
.as__meta {
  display: flex;
  align-items: center;
  gap: var(--us-space-5);
}

.as__metric {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--us-text-tertiary);
  letter-spacing: -0.01em;
}

.as__metric-divider {
  width: 1px;
  height: 14px;
  background: var(--us-border);
}

/* ── Skills ── */
.as__skills-title {
  margin: 0;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--us-text-tertiary);
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.as__skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--us-space-2);
}

.as__skill {
  display: inline-flex;
  align-items: center;
  padding: var(--us-space-1) var(--us-space-3);
  min-height: 28px;
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--us-text-tertiary);
  background: var(--us-glass-bg);
  border: 1px solid var(--us-glass-border);
  border-radius: 9999px;
  transition:
    color var(--us-duration-fast) var(--us-easing),
    border-color var(--us-duration-fast) var(--us-easing),
    background var(--us-duration-fast) var(--us-easing);
}

.as__skill:hover {
  color: var(--us-accent);
  border-color: var(--us-accent-border);
  background: var(--us-accent-subtle);
}

.as__skill:active {
  transform: scale(0.95);
}

/* ── Scroll Reveal — handled by GSAP useStripeScrollAnimation ── */

/* ── Reduced Motion ── */
@media (prefers-reduced-motion: reduce) {
  .as__panel {
    transition: none !important;
  }

  .as__panel:hover,
  .as__panel:active {
    transform: none !important;
  }

  .as__skill {
    transition: none !important;
  }

  /* GSAP-animated elements: force visible */
  .as__panel {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }
}

/* ── Responsive (mobile-first) ── */
@media (min-width: 481px) {
  .as__container {
    padding: 0 var(--us-space-6);
  }

  .as__content {
    padding: var(--us-space-8);
    gap: var(--us-space-4);
  }

  .as__skill {
    padding: var(--us-space-1) var(--us-space-4);
  }
}

@media (min-width: 768px) {
  .as {
    padding: var(--us-space-12) 0;
  }

  .as__content {
    flex-direction: row;
    align-items: flex-start;
    padding: var(--us-space-10) var(--us-space-10);
    gap: var(--us-space-12);
  }

  .as__left {
    flex: 1.2;
    min-width: 0;
  }

  .as__right {
    flex: 1;
    min-width: 0;
    padding-top: var(--us-space-6);
  }

  .as__bio {
    font-size: var(--text-base);
  }
}
</style>