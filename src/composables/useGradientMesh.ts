/**
 * useGradientMesh — Stripe-style gradient mesh canvas animation
 *
 * Recreates Stripe's signature hero background: large vivid color blobs
 * flowing organically with mouse-responsive movement.
 *
 * Key design decisions matching Stripe:
 * - BIG vivid blobs (radius 0.3-0.5 of viewport)
 * - HIGH opacity colors (0.5-0.8) — not subtle
 * - Vibrant multi-hue palette: purple, blue, teal, cyan
 * - Smooth sine-wave organic motion
 * - Mouse attraction pulls blobs toward cursor
 * - Dark mode uses brighter, more saturated colors
 */
import { onMounted, onUnmounted, type Ref } from 'vue'

interface GradientBlob {
  x: number
  y: number
  radius: number
  color: string
  vx: number
  vy: number
  phase: number
}

interface GradientMeshOptions {
  /** Number of gradient blobs (default: 5) */
  blobCount?: number
  /** Animation speed multiplier (default: 1) */
  speed?: number
  /** Mouse influence strength 0-1 (default: 0.3) */
  mouseStrength?: number
  /** Custom colors for blobs (light mode) */
  lightColors?: string[]
  /** Custom colors for blobs (dark mode) */
  darkColors?: string[]
}

// Stripe-inspired vivid palette — these are BOLD, not subtle
const DEFAULT_LIGHT_COLORS = [
  'rgba(99, 102, 241, 0.55)',    // vivid indigo
  'rgba(59, 130, 246, 0.50)',    // vivid blue
  'rgba(6, 182, 212, 0.45)',     // vivid cyan
  'rgba(139, 92, 246, 0.50)',    // vivid violet
  'rgba(79, 70, 229, 0.45)',     // vivid indigo-dark
]

const DEFAULT_DARK_COLORS = [
  'rgba(129, 140, 248, 0.60)',   // bright indigo
  'rgba(96, 165, 250, 0.55)',    // bright blue
  'rgba(34, 211, 238, 0.50)',    // bright cyan
  'rgba(167, 139, 250, 0.55)',   // bright violet
  'rgba(99, 102, 241, 0.50)',    // bright indigo-dark
]

export function useGradientMesh(
  containerRef: Ref<HTMLElement | null>,
  canvasRef: Ref<HTMLCanvasElement | null>,
  options: GradientMeshOptions = {}
) {
  const {
    blobCount = 5,
    speed = 1,
    mouseStrength = 0.3,
    lightColors = DEFAULT_LIGHT_COLORS,
    darkColors = DEFAULT_DARK_COLORS,
  } = options

  let ctx: CanvasRenderingContext2D | null = null
  let animationId: number | null = null
  let blobs: GradientBlob[] = []
  let mouseX = 0.5 // Normalized 0-1
  let mouseY = 0.5
  let width = 0
  let height = 0
  let time = 0
  let isDarkMode = false

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const checkDarkMode = () => {
    isDarkMode = document.documentElement.classList.contains('dark')
  }

  const initBlobs = () => {
    const colors = isDarkMode ? darkColors : lightColors
    blobs = Array.from({ length: blobCount }, (_, i) => ({
      x: 0.15 + Math.random() * 0.7,  // Start more centered
      y: 0.15 + Math.random() * 0.7,
      radius: 0.3 + Math.random() * 0.25,  // BIG blobs: 30-55% of viewport
      color: colors[i % colors.length],
      vx: (Math.random() - 0.5) * 0.0004 * speed,
      vy: (Math.random() - 0.5) * 0.0004 * speed,
      phase: Math.random() * Math.PI * 2,
    }))
  }

  const resize = () => {
    if (!canvasRef.value || !containerRef.value) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = containerRef.value.getBoundingClientRect()
    width = rect.width
    height = rect.height
    canvasRef.value.width = width * dpr
    canvasRef.value.height = height * dpr
    canvasRef.value.style.width = `${width}px`
    canvasRef.value.style.height = `${height}px`
    ctx = canvasRef.value.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
    }
  }

  const draw = () => {
    if (!ctx || prefersReducedMotion()) return

    time += 0.004 * speed
    ctx.clearRect(0, 0, width, height)

    // Use 'lighter' blend mode for vivid color mixing like Stripe
    ctx.globalCompositeOperation = 'lighter'

    for (const blob of blobs) {
      // Organic sine-wave movement — smooth and flowing
      blob.x += blob.vx + Math.sin(time + blob.phase) * 0.0003 * speed
      blob.y += blob.vy + Math.cos(time * 0.7 + blob.phase) * 0.0003 * speed

      // Wrap around edges with padding
      if (blob.x < -0.3) blob.x = 1.3
      if (blob.x > 1.3) blob.x = -0.3
      if (blob.y < -0.3) blob.y = 1.3
      if (blob.y > 1.3) blob.y = -0.3

      // Mouse influence — pull blobs toward cursor
      const dx = mouseX - blob.x
      const dy = mouseY - blob.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 0.6) {
        const influence = (1 - dist / 0.6) * mouseStrength * 0.002
        blob.x += dx * influence
        blob.y += dy * influence
      }

      // Draw gradient blob
      const cx = blob.x * width
      const cy = blob.y * height
      const r = blob.radius * Math.min(width, height)

      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
      gradient.addColorStop(0, blob.color)
      gradient.addColorStop(0.5, blob.color.replace(/[\d.]+\)$/, '0.2)'))
      gradient.addColorStop(1, 'transparent')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
    }

    // Reset blend mode
    ctx.globalCompositeOperation = 'source-over'

    animationId = requestAnimationFrame(draw)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    mouseX = (e.clientX - rect.left) / rect.width
    mouseY = (e.clientY - rect.top) / rect.height
  }

  const handleMouseLeave = () => {
    mouseX = 0.5
    mouseY = 0.5
  }

  let darkModeObserver: MutationObserver | null = null

  const start = () => {
    if (prefersReducedMotion()) return

    checkDarkMode()
    initBlobs()
    resize()

    darkModeObserver = new MutationObserver(() => {
      const wasDark = isDarkMode
      checkDarkMode()
      if (wasDark !== isDarkMode) {
        initBlobs()
      }
    })
    darkModeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    animationId = requestAnimationFrame(draw)
  }

  const stop = () => {
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
    if (darkModeObserver) {
      darkModeObserver.disconnect()
      darkModeObserver = null
    }
  }

  let resizeTimeout: ReturnType<typeof setTimeout> | null = null
  const handleResize = () => {
    if (resizeTimeout) clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(resize, 100)
  }

  onMounted(() => {
    if (containerRef.value) {
      containerRef.value.addEventListener('mousemove', handleMouseMove, { passive: true })
      containerRef.value.addEventListener('mouseleave', handleMouseLeave, { passive: true })
    }
    window.addEventListener('resize', handleResize, { passive: true })
    start()
  })

  onUnmounted(() => {
    stop()
    if (containerRef.value) {
      containerRef.value.removeEventListener('mousemove', handleMouseMove)
      containerRef.value.removeEventListener('mouseleave', handleMouseLeave)
    }
    window.removeEventListener('resize', handleResize)
    if (resizeTimeout) clearTimeout(resizeTimeout)
  })
}