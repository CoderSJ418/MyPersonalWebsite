<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  badge?: { icon: string; text: string }
  stats?: Array<{ number: string; label: string }>
}
defineProps<Props>()

defineSlots<{
  badge?(): unknown
  title?(): unknown
  subtitle?(): unknown
  stats?(): unknown
  actions?(): unknown
  decoration?(): unknown
  default?(): unknown
}>()
</script>

<template>
  <section class="page-hero">
    <div class="page-hero__container">
      <div class="page-hero__content">
        <!-- Badge slot -->
        <slot name="badge">
          <div v-if="badge" class="page-hero__badge">
            <span class="page-hero__badge-icon">{{ badge.icon }}</span>
            <span class="page-hero__badge-text">{{ badge.text }}</span>
          </div>
        </slot>

        <!-- Title slot -->
        <h1 class="page-hero__title">
          <slot name="title">{{ title }}</slot>
        </h1>

        <!-- Subtitle slot -->
        <p v-if="subtitle || $slots.subtitle" class="page-hero__subtitle">
          <slot name="subtitle">{{ subtitle }}</slot>
        </p>

        <!-- Stats slot -->
        <div v-if="stats && stats.length > 0 || $slots.stats" class="page-hero__stats">
          <slot name="stats">
            <div v-for="(stat, index) in stats" :key="index" class="page-hero__stat">
              <div class="page-hero__stat-number">{{ stat.number }}</div>
              <div class="page-hero__stat-label">{{ stat.label }}</div>
            </div>
          </slot>
        </div>

        <!-- Default slot for actions, decoration, etc. -->
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped>
.page-hero {
  position: relative;
  padding: var(--us-space-20) var(--us-space-4) var(--us-space-16);
  background: linear-gradient(180deg, var(--us-bg-start), var(--us-bg-end));
  border-bottom: 1px solid var(--us-border);
  overflow: hidden;
}

@media (min-width: 768px) {
  .page-hero {
    padding: var(--us-space-24) var(--us-space-6) var(--us-space-20);
  }
}

.page-hero__container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-hero__content {
  text-align: center;
}

/* ── Badge ── */
.page-hero__badge {
  display: inline-flex;
  align-items: center;
  gap: var(--us-space-2);
  margin-bottom: var(--us-space-4);
  padding: var(--us-space-2) var(--us-space-4);
  background: var(--us-glass-bg);
  border: 1px solid var(--us-glass-border);
  border-radius: 9999px;
}

.page-hero__badge-icon {
  font-size: 1.25rem;
  line-height: var(--leading-none);
}

.page-hero__badge-text {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--us-accent);
}

/* ── Title ── */
.page-hero__title {
  font-size: clamp(2.25rem, 5vw, 3.75rem);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: var(--leading-none);
  margin: 0 0 1rem;
  color: var(--us-text-primary);
}

/* ── Subtitle ── */
.page-hero__subtitle {
  font-size: 1.125rem;
  line-height: var(--leading-relaxed);
  max-width: 640px;
  margin: 0 auto;
  color: var(--us-text-secondary);
}

@media (min-width: 768px) {
  .page-hero__subtitle {
    font-size: 1.25rem;
  }
}

/* ── Stats ── */
.page-hero__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--us-space-6);
  margin-top: var(--us-space-8);
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
}

.page-hero__stat {
  text-align: center;
}

.page-hero__stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--us-accent);
  font-variant-numeric: tabular-nums;
}

@media (min-width: 768px) {
  .page-hero__stat-number {
    font-size: 2.25rem;
  }
}

.page-hero__stat-label {
  font-size: 0.875rem;
  margin-top: var(--us-space-1);
  color: var(--us-text-tertiary);
}
</style>