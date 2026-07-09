/**
 * useStripeGradient — Stripe-accurate WebGL gradient via whatamesh
 *
 * Uses the whatamesh library (jordienr/whatamesh) which reverse-engineered
 * Stripe's proprietary MiniGL WebGL gradient animation.
 *
 * Colors are read from CSS custom properties on the canvas element:
 *   --gradient-color-1 through --gradient-color-4
 */

import { onMounted, onUnmounted, type Ref } from 'vue'
import { Gradient } from 'whatamesh'

export interface StripeGradientOptions {
  accentColor?: string
  secondaryColor?: string
  tertiaryColor?: string
  darkenTop?: boolean
}

export function useStripeGradient(
  heroRef: Ref<HTMLElement | null>,
  canvasRef: Ref<HTMLCanvasElement | null>,
  _options: StripeGradientOptions = {}
) {
  let gradient: Gradient | null = null

  onMounted(() => {
    if (!canvasRef.value || !heroRef.value) return

    // Set CSS custom properties for whatamesh to read
    const root = document.documentElement
    root.style.setProperty('--gradient-color-1', '#6ec3f4')
    root.style.setProperty('--gradient-color-2', '#7038ff')
    root.style.setProperty('--gradient-color-3', '#ef008f')
    root.style.setProperty('--gradient-color-4', '#ffba27')

    // Initialize whatamesh gradient
    gradient = new Gradient()
    gradient.initGradient('#stripe-gradient-canvas')
  })

  onUnmounted(() => {
    if (gradient) {
      gradient.pause()
      gradient = null
    }
  })
}
