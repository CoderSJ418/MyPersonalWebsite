<template>
  <div
    ref="rootRef"
    class="ticker-card"
    :class="{ 'ticker-card--compact': compact }"
    :aria-label="`${label} ${prefix}${formattedValue}${suffix}`"
  >
    <span>{{ label }}</span>
    <strong>{{ prefix }}{{ formattedValue }}{{ suffix }}</strong>
    <p v-if="supportingText">{{ supportingText }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

interface Props {
  targetValue?: number
  duration?: number
  label?: string
  prefix?: string
  suffix?: string
  supportingText?: string
  locale?: string
  precision?: number
  compact?: boolean
  animateOnVisible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  targetValue: 98234,
  duration: 2000,
  label: 'Performance score',
  prefix: '',
  suffix: '',
  supportingText: 'Measured, not guessed.',
  locale: 'en-US',
  precision: 0,
  compact: false,
  animateOnVisible: false
})
const rootRef = ref<HTMLElement | null>(null)
const currentValue = ref(0)
const prefersReducedMotion = ref(false)
const isVisible = ref(!props.animateOnVisible)
const formattedValue = computed(() => currentValue.value.toLocaleString(props.locale, {
  minimumFractionDigits: props.precision,
  maximumFractionDigits: props.precision
}))
let animationFrame = 0
let visibilityObserver: IntersectionObserver | null = null

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!props.animateOnVisible) return
  if (!('IntersectionObserver' in window) || !rootRef.value) {
    isVisible.value = true
    return
  }
  visibilityObserver = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return
    isVisible.value = true
    visibilityObserver?.disconnect()
    visibilityObserver = null
  }, { threshold: 0.35 })
  visibilityObserver.observe(rootRef.value)
})

onUnmounted(() => visibilityObserver?.disconnect())

watch(
  () => ({
    targetValue: props.targetValue,
    duration: Math.max(props.duration, 1),
    reducedMotion: prefersReducedMotion.value,
    visible: isVisible.value
  }),
  ({ targetValue, duration, reducedMotion, visible }, _, onCleanup) => {
    cancelAnimationFrame(animationFrame)
    const startValue = currentValue.value
    if (reducedMotion) {
      currentValue.value = targetValue
      return
    }
    if (!visible) {
      currentValue.value = 0
      return
    }
    const startTime = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const easedProgress =
        progress < 0.5 ? 4 * Math.pow(progress, 3) : 1 - Math.pow(-2 * progress + 2, 3) / 2
      currentValue.value = startValue + (targetValue - startValue) * easedProgress
      if (progress < 1) animationFrame = requestAnimationFrame(tick)
    }
    animationFrame = requestAnimationFrame(tick)
    onCleanup(() => cancelAnimationFrame(animationFrame))
  },
  { immediate: true }
)
</script>

<style scoped>
.ticker-card {
  display: grid;
  min-height: 20rem;
  place-content: center;
  gap: 0.75rem;
  border-radius: 1rem;
  background: linear-gradient(145deg, #eff6ff, #fff);
  text-align: center;
  color: #0f172a;
}
.ticker-card span {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #2563eb;
}
.ticker-card strong {
  font-size: clamp(3rem, 10vw, 6rem);
  line-height: 1;
  letter-spacing: -0.06em;
  font-variant-numeric: tabular-nums;
}
.ticker-card p {
  color: #64748b;
}
.ticker-card--compact {
  min-height: 0;
  place-content: start;
  gap: 0.35rem;
  background: transparent;
  text-align: left;
}
.ticker-card--compact strong {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  letter-spacing: -0.04em;
}
</style>
