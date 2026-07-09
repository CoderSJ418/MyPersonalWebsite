<template>
  <!-- ═══════════════════════════════════════════════════════════
       Footer — Spatial Fade Out Layer v8.0
       ═══════════════════════════════════════════════════════════
       Max 2 visual effects per element (unified-system.css):
       Effect 1: Spatial Dissolve — mask-image fade
       Effect 2: Interactive Preservation — spring hover

       REMOVED (exceeded Max 2 rule):
       - Light Field Fadeout (::before/::after)
       - Depth Fade (translateZ + tier opacity)
       - Ambient Transition (radial gradient)
       ═══════════════════════════════════════════════════════════ -->
  <!-- Max 2 visual effects per element (unified-system.css):
       Effect 1: Spatial Dissolve — mask-image fade (KEPT)
       Effect 2: Interactive Preservation — spring hover (KEPT)
       REMOVED: Light Field Fadeout (::before/::after)
       REMOVED: Depth Fade (translateZ + tier opacity)
       REMOVED: Ambient Transition (radial gradient) -->
  <footer class="sf">
    <!-- Effect 1: Spatial Dissolve — top soft blend -->
    <div class="sf__dissolve-top" aria-hidden="true"></div>

    <div class="sf__container">
      <!-- Main Content — Three columns -->
      <div class="sf__main">
        <!-- Identity — Brand + positioning (tier-3, closer) -->
        <div class="sf__identity">
          <div class="sf__logo">
            <span class="sf__logo-name stripe-text-gradient">佘杰</span>
            <span class="sf__logo-dot"></span>
          </div>
          <p class="sf__positioning">
            Vue Expert · Frontend Architect<br />
            7年专注高性能前端架构，从0到1构建可规模化工程体系
          </p>
        </div>

        <!-- Contact — Interactive Chips -->
        <div class="sf__contact">
          <h3 class="sf__section-title">取得联系</h3>
          <ul class="sf__contact-list">
            <li>
              <a
:href="'mailto:' + contactStore.contact.email" class="sf__chip stripe-glow"
                :style="{
                  '--chip-o': chipOpacity.email.value,
                }" @mouseenter="handleChipEnter('email')" @mouseleave="handleChipLeave('email')">
                <Mail class="sf__chip-icon" />
                <span>{{ contactStore.contact.email }}</span>
              </a>
            </li>
            <li>
              <span class="sf__chip sf__chip--static">
                <MapPin class="sf__chip-icon" />
                <span>{{ contactStore.contact.location }}</span>
              </span>
            </li>
          </ul>
        </div>

        <!-- Social — Interactive Icons -->
        <div class="sf__social">
          <h3 class="sf__section-title">社交网络</h3>
          <div class="sf__social-icons">
            <a
v-if="contactStore.contact.social.github" :href="contactStore.contact.social.github" target="_blank"
              rel="noopener noreferrer" class="sf__social-icon" :style="{
                '--social-o': socialOpacity.github.value,
              }"
              aria-label="GitHub" @mouseenter="handleSocialEnter('github')" @mouseleave="handleSocialLeave('github')">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a
v-if="contactStore.contact.social.linkedin" :href="contactStore.contact.social.linkedin" target="_blank"
              rel="noopener noreferrer" class="sf__social-icon" :style="{
                '--social-o': socialOpacity.linkedin.value,
              }"
              aria-label="LinkedIn" @mouseenter="handleSocialEnter('linkedin')" @mouseleave="handleSocialLeave('linkedin')">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a
v-if="contactStore.contact.social.email"
              :href="'mailto:' + contactStore.contact.social.email.replace(/^mailto:/i, '')" class="sf__social-icon"
              :style="{
                '--social-o': socialOpacity.mail.value,
              }" aria-label="Email" @mouseenter="handleSocialEnter('mail')" @mouseleave="handleSocialLeave('mail')">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
            <a
v-if="contactStore.contact.social.twitter" :href="contactStore.contact.social.twitter" target="_blank"
              rel="noopener noreferrer" class="sf__social-icon" :style="{
                '--social-o': socialOpacity.twitter.value,
              }"
              aria-label="Twitter" @mouseenter="handleSocialEnter('twitter')" @mouseleave="handleSocialLeave('twitter')">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom — Copyright + Tech badges (tier-4, farthest) -->
      <div class="sf__bottom">
        <p class="sf__copyright">&copy; {{ currentYear }} 佘杰. All rights reserved.</p>
        <div class="sf__tech">
          <span class="sf__tech-chip">
            <Zap class="w-3 h-3" />
            Vue 3
          </span>
          <span class="sf__tech-chip">
            <Palette class="w-3 h-3" />
            TypeScript
          </span>
          <span class="sf__tech-chip">
            <Monitor class="w-3 h-3" />
            Vite
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useContactInfoStore } from '@/stores/useContactInfoStore'
import { useSpringPhysics } from '@/composables/useSpringPhysics'
import { Mail, MapPin, Zap, Palette, Monitor } from 'lucide-vue-next'

const contactStore = useContactInfoStore()
const currentYear = computed(() => new Date().getFullYear())

// REMOVED: Effect 2 — Light Field Fadeout (fieldIntensity) — exceeded Max 2 rule
// REMOVED: Effect 3 — Depth Fade (depthZ) — exceeded Max 2 rule

// ── Effect 2 (was 5): Interactive Preservation — chip spring hover ──
// REMOVED: chipSprings (translateZ) — Depth Fade removed per Max 2 rule
// KEPT: chipOpacity (spring-driven opacity 0.5→0.9)
const chipOpacity = {
  email: useSpringPhysics({ stiffness: 0.15, damping: 0.8, initial: 0.5 }),
}

const handleChipEnter = (key: string) => {
  if (key === 'email') {
    chipOpacity.email.setTarget(0.9)
  }
}

const handleChipLeave = (key: string) => {
  if (key === 'email') {
    chipOpacity.email.setTarget(0.5)
  }
}

// ── Effect 2 (was 5): Interactive Preservation — social icon spring hover ──
// REMOVED: socialSprings (translateZ) — Depth Fade removed per Max 2 rule
// KEPT: socialOpacity (spring-driven opacity 0.5→0.9)
const socialOpacity = {
  github: useSpringPhysics({ stiffness: 0.15, damping: 0.8, initial: 0.5 }),
  linkedin: useSpringPhysics({ stiffness: 0.15, damping: 0.8, initial: 0.5 }),
  mail: useSpringPhysics({ stiffness: 0.15, damping: 0.8, initial: 0.5 }),
  twitter: useSpringPhysics({ stiffness: 0.15, damping: 0.8, initial: 0.5 }),
}

const handleSocialEnter = (key: string) => {
  if (socialOpacity[key as keyof typeof socialOpacity]) {
    socialOpacity[key as keyof typeof socialOpacity].setTarget(0.9)
  }
}

const handleSocialLeave = (key: string) => {
  if (socialOpacity[key as keyof typeof socialOpacity]) {
    socialOpacity[key as keyof typeof socialOpacity].setTarget(0.5)
  }
}

// ── Reduced motion detection ──
const prefersReducedMotion = ref(false)
onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})
</script>

<style scoped>
/* ============================================================
   Footer — Spatial Fade Out Layer v8.0
   ─────────────────────────────────────────────────────────
   Max 2 visual effects per element (unified-system.css):
   Effect 1: Spatial Dissolve — mask-image fade
   Effect 2: Interactive Preservation — spring hover

   REMOVED (exceeded Max 2 rule):
   - Light Field Fadeout (::before/::after)
   - Depth Fade (translateZ + tier opacity)
   - Ambient Transition (radial gradient)
   ============================================================ */

.sf {
  position: relative;
  background: var(--us-bg-end);
  padding: var(--us-space-20) 0 var(--us-space-12);
  margin-top: 0;
  overflow: hidden;

  /* Effect 1: Spatial Dissolve — bottom mask fade */
  mask-image: linear-gradient(to bottom,
      transparent 0%,
      black 4%,
      black 90%,
      transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom,
      transparent 0%,
      black 4%,
      black 90%,
      transparent 100%);
}

/* REMOVED: Effect 2 — Light Field Fadeout (::before/::after) — exceeded Max 2 rule */
/* REMOVED: Effect 4 — Ambient Transition (.sf__ambient) — exceeded Max 2 rule */

/* ── Effect 1: Spatial Dissolve — top soft blend ── */
.sf__dissolve-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(to bottom,
      var(--us-bg-end) 0%,
      transparent 100%);
  pointer-events: none;
  z-index: var(--z-local-elevated);
}

/* REMOVED: Effect 3 — Depth Fade (translateZ/perspective on container) — exceeded Max 2 rule */
.sf__container {
  position: relative;
  z-index: var(--z-local-high);
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--us-space-6);
}

/* ═══════════════════════════════════════════════════════════
   Main Content — Three columns
   ═══════════════════════════════════════════════════════════ */

.sf__main {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--us-space-12);
  margin-bottom: var(--us-space-10);
  padding-bottom: var(--us-space-10);
  border-bottom: 1px solid var(--us-border);
}

/* ── Identity ── */
.sf__identity {
  display: flex;
  flex-direction: column;
  gap: var(--us-space-4);
  /* REMOVED: tier-3 opacity — Depth Fade removed per Max 2 rule */
}

.sf__logo {
  display: flex;
  align-items: center;
  gap: var(--us-space-2);
}

.sf__logo-name {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--us-text-secondary);
  letter-spacing: -0.03em;
}

.sf__logo-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--us-accent);
}

.sf__positioning {
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: var(--us-text-tertiary);
  max-width: 320px;
  margin: 0;
}

/* ── Section Title ── */
.sf__section-title {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--us-text-tertiary);
  letter-spacing: 0.02em;
  margin: 0 0 var(--us-space-4) 0;
}

/* ── Contact ── */
.sf__contact {
  display: flex;
  flex-direction: column;
  /* REMOVED: tier-3 opacity — Depth Fade removed per Max 2 rule */
}

.sf__contact-list {
  display: flex;
  flex-direction: column;
  gap: var(--us-space-3);
  list-style: none;
  padding: 0;
  margin: 0;
}

/* ── Effect 2: Interactive Preservation — chip hover ──
   Spring physics: stiffness=0.15, damping=0.8
   opacity 0.5→0.9 on hover (spring-driven) */
.sf__chip {
  display: inline-flex;
  align-items: center;
  gap: var(--us-space-2);
  font-size: var(--text-sm);
  color: var(--us-text-secondary);
  text-decoration: none;
  padding: var(--us-space-2) var(--us-space-4);
  border-radius: var(--radius-md);
  background: var(--us-surface);
  border: 1px solid var(--us-border);
  /* Interactive Preservation: spring-driven opacity */
  opacity: var(--chip-o, 0.5);
  /* REMOVED: translateZ/perspective/will-change — Depth Fade removed per Max 2 rule */
  transition:
    color var(--us-duration-fast) var(--us-easing),
    border-color var(--us-duration-fast) var(--us-easing),
    background var(--us-duration-fast) var(--us-easing),
    transform var(--us-duration-normal) var(--us-easing),
    box-shadow var(--us-duration-normal) var(--us-easing);
}

.sf__chip:hover {
  color: var(--us-accent);
  border-color: var(--us-accent-border);
  background: var(--us-accent-subtle);
  transform: translateY(var(--us-lift-xs));
  box-shadow: var(--us-depth-2-hover);
}

.sf__chip:active {
  transform: scale(var(--us-press-scale));
  box-shadow: var(--us-depth-1);
}

.sf__chip--static {
  cursor: default;
}

.sf__chip--static:hover {
  color: var(--us-text-secondary);
  border-color: var(--us-border);
  background: var(--us-surface);
}

.sf__chip-icon {
  width: 14px;
  height: 14px;
  opacity: 0.5;
  flex-shrink: 0;
}

/* ── Social Icons ── */
.sf__social {
  display: flex;
  flex-direction: column;
  /* REMOVED: tier-3 opacity — Depth Fade removed per Max 2 rule */
}

.sf__social-icons {
  display: flex;
  align-items: center;
  gap: var(--us-space-2);
}

/* ── Effect 2: Interactive Preservation — social icon hover ──
   Spring hover: opacity 0.5→0.9
   Accent glow via outline offset */
.sf__social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: var(--us-text-tertiary);
  background: var(--us-surface);
  border: 1px solid var(--us-border);
  /* Interactive Preservation: spring-driven opacity */
  opacity: var(--social-o, 0.5);
  /* REMOVED: translateZ/perspective/will-change — Depth Fade removed per Max 2 rule */
  transition:
    color var(--us-duration-fast) var(--us-easing),
    border-color var(--us-duration-fast) var(--us-easing),
    background var(--us-duration-fast) var(--us-easing),
    transform var(--us-duration-normal) var(--us-easing),
    box-shadow var(--us-duration-normal) var(--us-easing);
}

.sf__social-icon:hover {
  color: var(--us-accent);
  border-color: var(--us-accent-border);
  background: var(--us-accent-subtle);
  transform: translateY(var(--us-lift-xs));
  box-shadow: var(--us-depth-2-hover);
}

.sf__social-icon:active {
  transform: scale(var(--us-press-scale));
  box-shadow: var(--us-depth-1);
}

/* ═══════════════════════════════════════════════════════════
   Bottom — Copyright + Tech (tier-4, farthest)
   ═══════════════════════════════════════════════════════════ */

.sf__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* REMOVED: tier-4 opacity + translateZ — Depth Fade removed per Max 2 rule */
}

.sf__copyright {
  font-size: var(--text-xs);
  color: var(--us-text-tertiary);
  opacity: 0.7;
  margin: 0;
}

.sf__tech {
  display: flex;
  align-items: center;
  gap: var(--us-space-2);
}

/* ── Tech Chips (tier-4, farthest, non-interactive) ── */
.sf__tech-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--us-space-1);
  padding: var(--us-space-1) var(--us-space-3);
  min-height: 28px;
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--us-text-tertiary);
  background: var(--us-surface);
  border: 1px solid var(--us-border);
  border-radius: var(--radius-md);
  transition:
    color var(--us-duration-fast) var(--us-easing),
    border-color var(--us-duration-fast) var(--us-easing),
    background var(--us-duration-fast) var(--us-easing),
    transform var(--us-duration-normal) var(--us-easing),
    box-shadow var(--us-duration-normal) var(--us-easing);
}

.sf__tech-chip:hover {
  color: var(--us-accent);
  border-color: var(--us-accent-border);
  background: var(--us-accent-subtle);
  transform: translateY(var(--us-lift-xs));
  box-shadow: var(--us-depth-2-hover);
}

.sf__tech-chip:active {
  transform: scale(var(--us-press-scale));
  box-shadow: var(--us-depth-1);
}

/* ═══════════════════════════════════════════════════════════
   Responsive
   ═══════════════════════════════════════════════════════════ */

@media (max-width: 768px) {
  .sf {
    padding: var(--us-space-16) 0 var(--us-space-10);
  }

  .sf__main {
    grid-template-columns: 1fr;
    gap: var(--us-space-8);
    margin-bottom: var(--us-space-8);
    padding-bottom: var(--us-space-8);
  }

  .sf__bottom {
    flex-direction: column;
    gap: var(--us-space-4);
    text-align: center;
  }

  .sf__tech {
    flex-wrap: wrap;
    justify-content: center;
  }

  /* Touch target enhancement — 44px for primary interactive elements */
  .sf__social-icon {
    min-height: 44px;
    min-width: 44px;
  }
}

@media (max-width: 480px) {
  .sf {
    padding: var(--us-space-12) 0 var(--us-space-8);
  }

  .sf__container {
    padding: 0 var(--us-space-4);
  }

  .sf__main {
    gap: var(--us-space-6);
    margin-bottom: var(--us-space-6);
    padding-bottom: var(--us-space-6);
  }

  .sf__positioning {
    font-size: var(--text-sm);
  }
}

/* ═══════════════════════════════════════════════════════════
   Reduced Motion
   ═══════════════════════════════════════════════════════════ */

@media (prefers-reduced-motion: reduce) {
  /* REMOVED: .sf__container transform:none — Depth Fade already removed */
  /* REMOVED: .sf__bottom transform:none — Depth Fade already removed */

  .sf__chip {
    transition:
      opacity var(--us-duration-fast) var(--us-easing),
      color var(--us-duration-fast) var(--us-easing),
      border-color var(--us-duration-fast) var(--us-easing),
      background var(--us-duration-fast) var(--us-easing);
  }

  .sf__social-icon {
    transition:
      opacity var(--us-duration-fast) var(--us-easing),
      color var(--us-duration-fast) var(--us-easing),
      border-color var(--us-duration-fast) var(--us-easing),
      background var(--us-duration-fast) var(--us-easing);
  }

  .sf__tech-chip {
    transition-duration: 0.01ms !important;
  }
}
</style>