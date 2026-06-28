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
  <section class="py-16 md:py-24 relative overflow-hidden">
    <div class="container mx-auto px-4">
      <div class="text-center">
        <!-- Badge slot -->
        <slot name="badge">
          <div v-if="badge" class="inline-flex items-center gap-2 mb-4">
            <span class="text-xl">{{ badge.icon }}</span>
            <span class="text-sm font-medium text-slate-600 dark:text-slate-400">{{ badge.text }}</span>
          </div>
        </slot>

        <!-- Title slot -->
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          <slot name="title">{{ title }}</slot>
        </h1>

        <!-- Subtitle slot -->
        <p v-if="subtitle || $slots.subtitle" class="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          <slot name="subtitle">{{ subtitle }}</slot>
        </p>

        <!-- Stats slot -->
        <div v-if="stats && stats.length > 0 || $slots.stats" class="grid grid-cols-3 gap-6 mt-8 max-w-2xl mx-auto">
          <slot name="stats">
            <div v-for="(stat, index) in stats" :key="index" class="text-center">
              <div class="text-3xl md:text-4xl font-bold text-primary-500">{{ stat.number }}</div>
              <div class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ stat.label }}</div>
            </div>
          </slot>
        </div>

        <!-- Default slot for actions, decoration, etc. -->
        <slot />
      </div>
    </div>
  </section>
</template>
