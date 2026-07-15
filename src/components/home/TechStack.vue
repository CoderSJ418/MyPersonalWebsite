<template>
  <section class="ts stripe-orbs stripe-orbs--blue">
    <div class="stripe-orb-extra stripe-orb-extra--indigo" style="top:-10%;left:20%;" aria-hidden="true"></div>
    <div class="ts__container">
      <!-- 标题区域 -->
      <div class="ts__header">
        <h2 ref="titleRef" class="ts__title">
          技术栈
        </h2>
        <p ref="subtitleRef" class="ts__subtitle">
          深耕 Vue 技术栈，熟悉现代前端工程化体系
        </p>
      </div>

      <!-- 技术栈网格 -->
      <div ref="gridRef" class="ts__grid">
        <div v-for="(tech, index) in techStack" :key="tech.name" v-spotlight="{ color: '37,99,235', radius: 400 }" class="ts__card stripe-card stripe-border stripe-border--blue" :data-index="index">
          <!-- 图标背景装饰 - 渐变光晕 -->
          <div class="ts__card__glow" aria-hidden="true"></div>

          <!-- 图标容器 -->
          <div class="ts__card__icon">
            <component :is="tech.icon" class="ts__card__icon-svg" />
          </div>

          <!-- 名称 -->
          <span class="ts__card__name">
            {{ tech.name }}
          </span>

          <!-- 悬停效果 - 底部渐变高亮 -->
          <div class="ts__card__bar" aria-hidden="true"></div>
        </div>
      </div>

      <!-- 技术亮点 -->
      <div ref="highlightsRef" class="ts__highlights">
        <div class="ts__highlight">
          <div class="ts__highlight__header">
            <div class="ts__highlight__icon ts__highlight__icon--pink">
              <Zap class="ts__highlight__icon-svg" />
            </div>
            <h3 class="ts__highlight__title">性能优化</h3>
          </div>
          <p class="ts__highlight__desc">
            系统性地解决首屏加载、大数据渲染、内存优化等性能问题，Lighthouse 性能评分 95+
          </p>
        </div>

        <div class="ts__highlight">
          <div class="ts__highlight__header">
            <div class="ts__highlight__icon ts__highlight__icon--blue">
              <FlaskConical class="ts__highlight__icon-svg" />
            </div>
            <h3 class="ts__highlight__title">工程化</h3>
          </div>
          <p class="ts__highlight__desc">
            熟悉前端工程化体系，能够搭建开发规范、CI/CD 流程、性能监控体系
          </p>
        </div>

        <div class="ts__highlight">
          <div class="ts__highlight__header">
            <div class="ts__highlight__icon ts__highlight__icon--blue">
              <Settings class="ts__highlight__icon-svg" />
            </div>
            <h3 class="ts__highlight__title">架构设计</h3>
          </div>
          <p class="ts__highlight__desc">
            主导过技术栈升级，设计灵活的权限系统，具备架构设计和技术选型能力
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { useGSAPAnimations } from '@/composables/useGSAPAnimations'
import skillsData from '@/assets/data/skills.json'
import { Code2, Zap, Database, Layers, Palette, Smartphone, FlaskConical, Settings } from 'lucide-vue-next'

const topSkills = computed(() => {
  return [...skillsData].sort((a, b) => b.level - a.level)
})

const iconMap: Record<string, typeof Code2> = {
  'Vue.js': Code2,
  'Vite': Zap,
  'TypeScript': Database,
  'Pinia': Layers,
  'Tailwind CSS': Palette,
  'uni-app': Smartphone,
  'Element Plus': Layers,
  'ECharts': FlaskConical,
  'Git': Settings,
  'Webpack': Settings,
}

const displayNames: Record<string, string> = {
  'Vue.js': 'Vue 3',
  'Tailwind CSS': 'Tailwind',
}

const techStack = computed(() => {
  return topSkills.value
    .filter(skill => iconMap[skill.name])
    .slice(0, 6)
    .map(skill => ({
      name: displayNames[skill.name] || skill.name,
      icon: iconMap[skill.name],
    }))
})

const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const highlightsRef = ref<HTMLElement | null>(null)

const { fadeInUp, staggerIn } = useGSAPAnimations()

onMounted(() => {
  nextTick(() => {
    if (titleRef.value) {
      fadeInUp(titleRef.value, { duration: 0.8, delay: 0.1 })
    }

    if (subtitleRef.value) {
      fadeInUp(subtitleRef.value, { duration: 0.8, delay: 0.2 })
    }

    if (gridRef.value) {
      const cards = gridRef.value.querySelectorAll('.ts__card')
      if (cards.length > 0) {
        staggerIn(cards, { duration: 0.6, delay: 0.3 })
      }
    }

    if (highlightsRef.value) {
      const highlights = highlightsRef.value.querySelectorAll('.ts__highlight')
      if (highlights.length > 0) {
        staggerIn(highlights, { duration: 0.6, delay: 0.5 })
      }
    }
  })
})
</script>

<style scoped>
/* ============================================
   TechStack — Unified Dark Theme
   ─────────────────────────────────────────
   --us-* 变量体系，无Tailwind亮色/双模式类
   ============================================ */

.ts {
  position: relative;
  padding: var(--us-space-20) 0 calc(var(--us-space-20) + var(--us-space-8));
  background: transparent;
}

.ts__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--us-space-6);
}

/* ── Header ── */
.ts__header {
  text-align: center;
  margin-bottom: var(--us-space-16);
}

.ts__title {
  margin: 0 0 var(--us-space-6);
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: var(--leading-tight);
  color: var(--us-text-primary);
}

.ts__subtitle {
  margin: 0;
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  color: var(--us-text-tertiary);
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
}

/* ── Grid ── */
.ts__grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--us-space-6);
}

/* ── Card ── */
.ts__card {
  position: relative;
  border-radius: var(--radius-lg);
  padding: var(--us-space-8) var(--us-space-4);
  border: 1px solid var(--us-border);
  background: var(--us-surface);
  overflow: hidden;
  transition:
    transform var(--us-duration-normal, 300ms) var(--us-easing, cubic-bezier(0.4, 0, 0.2, 1)),
    border-color var(--us-duration-normal, 300ms) var(--us-easing, cubic-bezier(0.4, 0, 0.2, 1)),
    box-shadow var(--us-duration-normal, 300ms) var(--us-easing, cubic-bezier(0.4, 0, 0.2, 1));
}

.ts__card:hover {
  transform: translateY(var(--us-lift-md));
  border-color: var(--us-border-hover);
  box-shadow: var(--us-depth-1-hover, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1));
}

.ts__card:active {
  transform: translateY(var(--us-lift-sm)) scale(0.95);
}

/* ── Card Glow ── */
.ts__card__glow {
  position: absolute;
  top: 0;
  right: 0;
  width: 128px;
  height: 128px;
  border-radius: 50%;
  filter: blur(48px);
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%);
  opacity: 0;
  transition: opacity var(--us-duration-normal, 300ms) var(--us-easing, cubic-bezier(0.4, 0, 0.2, 1));
  pointer-events: none;
}

.ts__card:hover .ts__card__glow {
  opacity: 0.3;
}

/* ── Card Icon ── */
.ts__card__icon {
  position: relative;
  z-index: var(--z-local);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  margin: 0 auto var(--us-space-6);
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%);
  border: 1px solid rgba(37, 99, 235, 0.3);
  transition: transform var(--us-duration-normal, 300ms) var(--us-easing, cubic-bezier(0.4, 0, 0.2, 1));
}

.ts__card:hover .ts__card__icon {
  transform: translateY(var(--us-lift-sm));
}

.ts__card__icon-svg {
  width: 40px;
  height: 40px;
  color: #2563EB;
  transition: transform var(--us-duration-normal) var(--us-easing);
}

/* ── Card Name ── */
.ts__card__name {
  position: relative;
  z-index: var(--z-local);
  display: block;
  text-align: center;
  font-size: var(--text-base);
  font-weight: 500;
  color: var(--us-text-primary);
  transition: color var(--us-duration-fast, 150ms) var(--us-easing, cubic-bezier(0.4, 0, 0.2, 1));
}

/* ── Card Bottom Bar ── */
.ts__card__bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, rgba(37, 99, 235, 1) 0%, rgba(37, 99, 235, 0.7) 50%, rgba(37, 99, 235, 0.4) 100%);
  transform: scaleX(0);
  transition: transform var(--us-duration-enter) var(--us-easing);
}

.ts__card:hover .ts__card__bar {
  transform: scaleX(1);
}

/* ── Highlights ── */
.ts__highlights {
  margin-top: var(--us-space-20);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--us-space-8);
}

.ts__highlight {
  border-radius: var(--radius-lg);
  padding: var(--us-space-8);
  border: 1px solid var(--us-border);
  background: var(--us-surface);
  transition:
    transform var(--us-duration-normal, 300ms) var(--us-easing, cubic-bezier(0.4, 0, 0.2, 1)),
    border-color var(--us-duration-normal, 300ms) var(--us-easing, cubic-bezier(0.4, 0, 0.2, 1)),
    box-shadow var(--us-duration-normal, 300ms) var(--us-easing, cubic-bezier(0.4, 0, 0.2, 1));
}

.ts__highlight:hover {
  transform: translateY(var(--us-lift-md));
  border-color: var(--us-border-hover);
  box-shadow: var(--us-depth-1-hover, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1));
}

.ts__highlight:active {
  transform: translateY(var(--us-lift-sm)) scale(0.95);
}

.ts__highlight__header {
  display: flex;
  align-items: center;
  margin-bottom: var(--us-space-6);
}

.ts__highlight__icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--us-space-4);
  flex-shrink: 0;
}

.ts__highlight__icon--pink {
  background: linear-gradient(135deg, color-mix(in srgb, var(--accent-pink-500) 15%, transparent) 0%, color-mix(in srgb, var(--accent-pink-600) 15%, transparent) 100%);
  border: 1px solid color-mix(in srgb, var(--accent-pink-500) 30%, transparent);
}

.ts__highlight__icon--blue {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%);
  border: 1px solid rgba(37, 99, 235, 0.3);
}

.ts__highlight__icon-svg {
  width: 28px;
  height: 28px;
}

.ts__highlight__icon--pink .ts__highlight__icon-svg {
  color: var(--accent-pink-500);
}

.ts__highlight__icon--blue .ts__highlight__icon-svg {
  color: #2563EB;
}

.ts__highlight__title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  color: var(--us-text-primary);
}

.ts__highlight__desc {
  margin: 0;
  font-size: var(--text-base);
  line-height: var(--leading-relaxed);
  color: var(--us-text-tertiary);
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .ts__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .ts {
    padding: var(--us-space-12) 0 var(--us-space-16);
  }

  .ts__header {
    margin-bottom: var(--us-space-12);
  }

  .ts__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--us-space-4);
  }

  .ts__card {
    padding: var(--us-space-6) var(--us-space-3);
  }

  .ts__card__icon {
    width: 64px;
    height: 64px;
    margin-bottom: var(--us-space-4);
  }

  .ts__card__icon-svg {
    width: 32px;
    height: 32px;
  }

  .ts__highlights {
    grid-template-columns: 1fr;
    gap: var(--us-space-5);
  }

  .ts__highlight {
    padding: var(--us-space-6);
  }
}

@media (max-width: 480px) {
  .ts__container {
    padding: 0 var(--us-space-4);
  }

  .ts__card {
    padding: var(--us-space-5) var(--us-space-2);
  }

  .ts__card__icon {
    width: 56px;
    height: 56px;
  }
}

/* ── Reduced Motion ── */
@media (prefers-reduced-motion: reduce) {

  .ts__card,
  .ts__highlight {
    transition: none !important;
  }

  .ts__card:hover,
  .ts__highlight:hover {
    transform: none !important;
  }
}
</style>