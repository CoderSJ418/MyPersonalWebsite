/**
 * useStripeGradient — Stripe-accurate WebGL gradient via whatamesh
 *
 * Uses whatamesh (jordienr/whatamesh) which reverse-engineered
 * Stripe's proprietary MiniGL WebGL gradient animation.
 */

import { onMounted, onUnmounted, type Ref } from 'vue'
import { Gradient } from 'whatamesh'

// whatamesh Gradient internal state (not in .d.ts)
interface GradientInternal {
  width: number
  height: number
  xSegCount: number
  ySegCount: number
  minigl: { setSize: (w: number, h: number) => void; setOrthographicCamera: () => void }
  mesh: {
    geometry: {
      setTopology: (x: number, y: number) => void
      setSize: (w: number, h: number) => void
    }
    material: {
      uniforms: {
        u_shadow_power: { value: number }
      }
    }
  }
}

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

    // Stripe-standard cooler palette: blue/indigo/purple/lavender
    const root = document.documentElement
    root.style.setProperty('--gradient-color-1', '#449ce4')
    root.style.setProperty('--gradient-color-2', '#3a3aff')
    root.style.setProperty('--gradient-color-3', '#ccbeee')
    root.style.setProperty('--gradient-color-4', '#4c57f6')

    gradient = new Gradient()
    gradient.initGradient('#stripe-gradient-canvas')

    // Resize canvas to fill hero (whatamesh defaults to 600px height)
    requestAnimationFrame(() => {
      if (!canvasRef.value || !heroRef.value) return
      const rect = heroRef.value.getBoundingClientRect()
      const w = Math.ceil(rect.width)
      const h = Math.ceil(rect.height)
      // Update whatamesh internal state
      const gi = gradient as unknown as GradientInternal
      gi.width = w
      gi.height = h
      gi.minigl.setSize(w, h)
      gi.minigl.setOrthographicCamera()
      gi.xSegCount = Math.ceil(w * 0.06)
      gi.ySegCount = Math.ceil(h * 0.16)
      gi.mesh.geometry.setTopology(gi.xSegCount, gi.ySegCount)
      gi.mesh.geometry.setSize(w, h)
      gi.mesh.material.uniforms.u_shadow_power.value = w < 600 ? 5 : 6
    })
  })

  onUnmounted(() => {
    if (gradient) {
      gradient.pause()
      gradient = null
    }
  })
}
