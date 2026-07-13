/**
 * useStripeGradient — Stripe-accurate WebGL gradient via whatamesh
 *
 * Uses whatamesh (jordienr/whatamesh) which reverse-engineered
 * Stripe's proprietary MiniGL WebGL gradient animation.
 *
 * Init flow: initGradient() → connect() → rAF → waitForCssVars() → init()
 */

import { onMounted, onUnmounted, type Ref } from 'vue'
import { Gradient } from 'whatamesh'

// whatamesh Gradient internal state (not in .d.ts)
interface GradientInternal {
  width: number
  height: number
  amp: number
  seed: number
  xSegCount: number
  ySegCount: number
  conf: { density: [number, number]; playing: boolean }
  minigl: {
    setSize: (w: number, h: number) => void
    setOrthographicCamera: () => void
  }
  mesh: {
    geometry: {
      setTopology: (x: number, y: number) => void
      setSize: (w: number, h: number) => void
    }
    material: {
      uniforms: {
        u_shadow_power: { value: number }
        u_vertDeform: {
          value: {
            incline: { value: number }
            noiseAmp: { value: number }
            noiseFreq: { value: [number, number] }
            noiseSpeed: { value: number }
            noiseFlow: { value: number }
            noiseSeed: { value: number }
            offsetTop: { value: number }
            offsetBottom: { value: number }
          }
        }
        u_waveLayers: {
          value: Array<{
            noiseFreq: { value: [number, number] }
            noiseCeil: { value: number }
            noiseFloor: { value: number }
            noiseSpeed: { value: number }
            noiseFlow: { value: number }
            noiseSeed: { value: number }
            color: { value: number[] }
          }>
        }
      }
    }
  }
  resize(): void
  pause(): void
  play(): void
}

export function useStripeGradient(
  heroRef: Ref<HTMLElement | null>,
  canvasRef: Ref<HTMLCanvasElement | null>
) {
  let gradient: Gradient | null = null

  onMounted(() => {
    if (!canvasRef.value || !heroRef.value) return

    gradient = new Gradient()

    // ── Patch connect() to fix rAF timing ──
    // whatamesh connect() → rAF → waitForCssVars → init()
    // The rAF never fires in Vue SPA. We bypass it.
    const gAny = gradient as unknown
    const _origConnect = gAny.connect.bind(gradient)

    gAny.connect = function () {
      gAny.computedCanvasStyle = getComputedStyle(gAny.el)
      gAny.waitForCssVars()
    }

    // 拦截init()的resize调用
    const origInit = gAny.init.bind(gradient)
    gAny.init = function () {
      origInit()
      const r = heroRef.value?.getBoundingClientRect()
      if (r && r.width > 1) {
        const w = Math.max(Math.round(r.width), 100)
        const h = Math.max(Math.round(r.height), 100)
        const gi = gradient as unknown as GradientInternal
        gi.width = w
        gi.height = h
        gi.minigl.setSize(w, h)
        gi.minigl.setOrthographicCamera()
        gi.xSegCount = Math.ceil(w * gi.conf.density[0])
        gi.ySegCount = Math.ceil(h * gi.conf.density[1])
        gi.mesh.geometry.setTopology(gi.xSegCount, gi.ySegCount)
        gi.mesh.geometry.setSize(w, h)
        gi.mesh.material.uniforms.u_shadow_power.value = w < 600 ? 3 : 5
      }
    }

    // Start init chain
    gAny.initGradient('#stripe-gradient-canvas')

    // ── Override resize() to use hero container size ──
    const _origResize = gAny.resize.bind(gradient)
    gAny.resize = function () {
      if (!heroRef.value || !canvasRef.value) return
      const rect = heroRef.value.getBoundingClientRect()
      const w = Math.max(Math.round(rect.width), 100)
      if (w === 100 && rect.width < 1) return
      const h = Math.max(Math.round(rect.height), 100)
      const g = gradient as unknown as GradientInternal
      g.width = w
      g.height = h
      g.xSegCount = Math.ceil(w * g.conf.density[0])
      g.ySegCount = Math.ceil(h * g.conf.density[1])
      g.minigl.setSize(w, h)
      g.minigl.setOrthographicCamera()
      g.mesh.geometry.setTopology(g.xSegCount, g.ySegCount)
      g.mesh.geometry.setSize(w, h)
      g.mesh.material.uniforms.u_shadow_power.value = w < 600 ? 3 : 5
    }

    // DOM布局完成后重试resize
    const tryResize = () => {
      const rect = heroRef.value?.getBoundingClientRect()
      if (!rect || rect.width < 1 || rect.height < 1) {
        requestAnimationFrame(tryResize)
        return
      }
      gAny.resize()
    }
    requestAnimationFrame(tryResize)

    // ── Apply parameters after init ──
    const applyParams = () => {
      const g = gradient as unknown as GradientInternal
      if (!g.mesh?.material?.uniforms) {
        requestAnimationFrame(applyParams)
        return
      }

      g.amp = 100

      const vd = g.mesh.material.uniforms.u_vertDeform.value
      vd.incline.value = -Math.sin(0.55) / Math.cos(0.55)
      vd.noiseAmp.value = 100
      vd.noiseFreq.value = [6, 8]
      vd.noiseSpeed.value = 5
      vd.noiseFlow.value = 3
      vd.noiseSeed.value = 7
      vd.offsetBottom.value = -0.3
      vd.offsetTop.value = 0.5

      const wl = g.mesh.material.uniforms.u_waveLayers.value
      const setLayer = (idx: number, freq: [number, number], ceil: number, floor: number, speed: number, flow: number) => {
        const layer = wl[idx]
        if (!layer) return
        const u = layer.value
        if (u.noiseFreq) u.noiseFreq.value = freq
        if (u.noiseCeil) u.noiseCeil.value = ceil
        if (u.noiseFloor) u.noiseFloor.value = floor
        if (u.noiseSpeed) u.noiseSpeed.value = speed
        if (u.noiseFlow) u.noiseFlow.value = flow
        if (u.noiseSeed) u.noiseSeed.value = 7 + idx * 10
      }

      setLayer(0, [3.0, 4.0], 0.50, 0.45, 6.0, 4.0)
      setLayer(1, [4.0, 5.0], 0.60, 0.55, 6.5, 4.5)
      setLayer(2, [5.0, 6.0], 0.70, 0.65, 7.0, 5.0)

      g.mesh.material.uniforms.u_shadow_power.value = 3
    }
    requestAnimationFrame(applyParams)
  })

  onUnmounted(() => {
    if (gradient) {
      gradient.pause()
      gradient = null
    }
  })
}
