/**
 * useStripeGradient — CSS aurora gradient ribbons
 *
 * Stripe-style flowing color ribbons using CSS animations.
 * The actual visual styles are in HeroSection.vue's scoped CSS.
 * This composable just toggles the active class on mount.
 */

import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export interface StripeGradientOptions {
  accentColor?: string
  secondaryColor?: string
  tertiaryColor?: string
  darkenTop?: boolean
}

export function useStripeGradient(
  heroRef: Ref<HTMLElement | null>,
  _canvasRef: Ref<HTMLCanvasElement | null>,
  _options: StripeGradientOptions = {}
) {
  onMounted(() => {
    if (!heroRef.value) return
    heroRef.value.classList.add('hero--gradient-active')
  })

  onUnmounted(() => {
    if (heroRef.value) {
      heroRef.value.classList.remove('hero--gradient-active')
    }
  })
}
