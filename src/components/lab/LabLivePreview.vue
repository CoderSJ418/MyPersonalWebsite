<template>
  <div
    ref="rootRef"
    class="relative h-52 overflow-hidden bg-slate-100"
    :aria-label="`实时预览：${effect.name}`"
  >
    <div
      v-if="shouldRenderLive"
      class="absolute left-0 top-0 h-[21rem] w-[161.3%] origin-top-left scale-[0.62]"
    >
      <component :is="effect.component" v-bind="previewProps" />
    </div>

    <SafeImage
      v-else
      :src="effect.preview.src"
      :alt="effect.preview.alt"
      class="h-full w-full"
      image-class="h-full w-full object-cover"
      width="100%"
      :height="208"
      :intrinsic-width="640"
      :intrinsic-height="360"
      native-loading="lazy"
    />

    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/80 to-transparent"
      aria-hidden="true"
    ></div>
    <span
      class="absolute right-3 top-3 rounded-full border border-white/70 bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-slate-600 shadow-sm backdrop-blur"
    >
      {{ shouldRenderLive ? 'LIVE' : 'STATIC' }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

import SafeImage from '@/components/common/SafeImage.vue'
import { useMobilePerformance } from '@/composables/useMobilePerformance'
import type { LabEffect } from '@/types/lab'

interface Props {
  effect: LabEffect
}

const props = defineProps<Props>()
const rootRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const { isMobile, isLowEndDevice, prefersReducedMotion } = useMobilePerformance()
let observer: IntersectionObserver | null = null

const previewProps = computed<Record<string, string | number | boolean>>(() => {
  if (props.effect.id === 'aurora') {
    return { embedded: true, decorative: true, speed: 1.4, colorTheme: 'indigo' }
  }
  if (props.effect.id === 'number-ticker') {
    return {
      targetValue: 96,
      duration: 1100,
      label: 'Runtime score',
      supportingText: 'Measured, not guessed.'
    }
  }
  if (props.effect.id === 'tilt-card') return { maxTilt: 8, perspective: 650 }
  if (props.effect.id === 'magic-card') return { borderWidth: 1 }
  return {}
})

const shouldRenderLive = computed(
  () =>
    isVisible.value &&
    !isMobile.value &&
    !isLowEndDevice.value &&
    !prefersReducedMotion.value
)

onMounted(() => {
  if (!rootRef.value || !('IntersectionObserver' in window)) {
    isVisible.value = true
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      isVisible.value = entries.some((entry) => entry.isIntersecting)
    },
    { rootMargin: '120px 0px', threshold: 0.05 }
  )
  observer.observe(rootRef.value)
})

onUnmounted(() => observer?.disconnect())
</script>
