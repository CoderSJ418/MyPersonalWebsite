/**
 * useParticleField — Stripe-style particle field with mouse attraction
 * v2.0 — Performance-optimized:
 * - Offscreen detection: pauses when section leaves viewport
 * - Frame throttling: targets ~30fps for smooth but efficient rendering
 * - Spatial grid: O(n) line connection instead of O(n²)
 * - Reduced motion support: respects prefers-reduced-motion
 *
 * Inspired by Stripe's modular solutions bento cards.
 */
import { ref, onMounted, onUnmounted, type Ref } from 'vue'

interface Particle {
  x: number
  y: number
  originX: number
  originY: number
  vx: number
  vy: number
  radius: number
  opacity: number
  phase: number
}

interface ParticleFieldOptions {
  /** Number of particles (default: 35) */
  count?: number
  /** Particle base radius in px (default: 1.2) */
  particleRadius?: number
  /** Mouse attraction radius in px (default: 120) */
  attractRadius?: number
  /** Mouse attraction strength 0-1 (default: 0.3) */
  attractStrength?: number
  /** Spring return force (default: 0.03) */
  springForce?: number
  /** Damping factor (default: 0.85) */
  damping?: number
  /** Distribution pattern: 'scatter' | 'circle' (default: 'scatter') */
  pattern?: 'scatter' | 'circle'
  /** Particle color for light mode (default: 'rgba(37, 99, 235, 0.3)') */
  lightColor?: string
  /** Particle color for dark mode (default: 'rgba(129, 140, 248, 0.4)') */
  darkColor?: string
  /** Connection line max distance (0 = no lines, default: 0) */
  lineDistance?: number
  /** Target frame interval in ms (default: 33 ≈ 30fps) */
  frameInterval?: number
}

export function useParticleField(
  containerRef: Ref<HTMLElement | null>,
  canvasRef: Ref<HTMLCanvasElement | null>,
  options: ParticleFieldOptions = {}
) {
  const {
    count = 35,
    particleRadius = 1.2,
    attractRadius = 120,
    attractStrength = 0.3,
    springForce = 0.03,
    damping = 0.85,
    pattern = 'scatter',
    lightColor = 'rgba(37, 99, 235, 0.3)',
    darkColor = 'rgba(129, 140, 248, 0.4)',
    lineDistance = 0,
    frameInterval = 33,
  } = options

  let ctx: CanvasRenderingContext2D | null = null
  let animationId: number | null = null
  let particles: Particle[] = []
  let mouseX = -1000 // Off-screen initially
  let mouseY = -1000
  let width = 0
  let height = 0
  let isDarkMode = false
  let time = 0
  let isVisible = true
  let lastFrameTime = 0
  let visibilityObserver: IntersectionObserver | null = null

  // Spatial grid for O(n) line connection
  const GRID_CELL_SIZE = 100
  const spatialGrid: Map<string, number[]> = new Map()

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const checkDarkMode = () => {
    isDarkMode = document.documentElement.classList.contains('dark')
  }

  const initParticles = () => {
    particles = []
    const cx = width / 2
    const cy = height / 2

    for (let i = 0; i < count; i++) {
      let x: number, y: number

      if (pattern === 'circle') {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5
        const r = Math.min(width, height) * (0.2 + Math.random() * 0.25)
        x = cx + Math.cos(angle) * r
        y = cy + Math.sin(angle) * r
      } else {
        const margin = 40
        x = margin + Math.random() * (width - margin * 2)
        y = margin + Math.random() * (height - margin * 2)
      }

      particles.push({
        x,
        y,
        originX: x,
        originY: y,
        vx: 0,
        vy: 0,
        radius: particleRadius * (0.5 + Math.random() * 1),
        opacity: 0.3 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      })
    }
  }

  /** Build spatial grid for efficient neighbor lookup */
  const buildSpatialGrid = () => {
    spatialGrid.clear()
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      const cellX = Math.floor(p.x / GRID_CELL_SIZE)
      const cellY = Math.floor(p.y / GRID_CELL_SIZE)
      const key = `${cellX},${cellY}`
      if (!spatialGrid.has(key)) spatialGrid.set(key, [])
      spatialGrid.get(key)!.push(i)
    }
  }

  /** Get neighboring particle indices within lineDistance */
  const getNeighbors = (index: number): number[] => {
    const p = particles[index]
    const cellX = Math.floor(p.x / GRID_CELL_SIZE)
    const cellY = Math.floor(p.y / GRID_CELL_SIZE)
    const neighbors: number[] = []
    const searchRadius = Math.ceil(lineDistance / GRID_CELL_SIZE)

    for (let dx = -searchRadius; dx <= searchRadius; dx++) {
      for (let dy = -searchRadius; dy <= searchRadius; dy++) {
        const key = `${cellX + dx},${cellY + dy}`
        const cell = spatialGrid.get(key)
        if (cell) {
          for (const idx of cell) {
            if (idx > index) neighbors.push(idx) // Avoid duplicate pairs
          }
        }
      }
    }
    return neighbors
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
    ctx = canvasRef.value.getContext('2d', { alpha: true })
    if (ctx) {
      ctx.scale(dpr, dpr)
    }
    initParticles()
  }

  const draw = (timestamp: number) => {
    if (!ctx || prefersReducedMotion()) return

    // Frame throttling — skip if too soon
    const elapsed = timestamp - lastFrameTime
    if (elapsed < frameInterval) {
      animationId = requestAnimationFrame(draw)
      return
    }
    lastFrameTime = timestamp

    // Skip rendering when offscreen
    if (!isVisible) {
      animationId = requestAnimationFrame(draw)
      return
    }

    time += 0.01
    ctx.clearRect(0, 0, width, height)

    const color = isDarkMode ? darkColor : lightColor

    // Build spatial grid for line connections
    if (lineDistance > 0) buildSpatialGrid()

    // Draw connection lines if enabled (spatial grid optimized)
    if (lineDistance > 0) {
      ctx.strokeStyle = color
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        const neighbors = getNeighbors(i)
        for (const j of neighbors) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < lineDistance) {
            const alpha = (1 - dist / lineDistance) * 0.12
            ctx.globalAlpha = alpha
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
      ctx.globalAlpha = 1
    }

    // Update and draw particles
    for (const p of particles) {
      // Subtle breathing animation
      const breathe = Math.sin(time * 2 + p.phase) * 0.3

      // Mouse attraction
      const dx = mouseX - p.x
      const dy = mouseY - p.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < attractRadius && dist > 0) {
        const force = (1 - dist / attractRadius) * attractStrength
        p.vx += (dx / dist) * force * 2
        p.vy += (dy / dist) * force * 2
      }

      // Spring back to origin
      p.vx += (p.originX - p.x) * springForce
      p.vy += (p.originY - p.y) * springForce

      // Damping
      p.vx *= damping
      p.vy *= damping

      // Apply velocity
      p.x += p.vx
      p.y += p.vy

      // Draw particle
      const r = Math.max(0.5, p.radius + breathe * 0.3)
      ctx.beginPath()
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.globalAlpha = p.opacity + breathe * 0.1
      ctx.fill()
    }

    ctx.globalAlpha = 1
    animationId = requestAnimationFrame(draw)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top
  }

  const handleMouseLeave = () => {
    mouseX = -1000
    mouseY = -1000
  }

  let darkModeObserver: MutationObserver | null = null
  let resizeTimeout: ReturnType<typeof setTimeout> | null = null

  const handleResize = () => {
    if (resizeTimeout) clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(resize, 200)
  }

  /** Visibility observer — pause rendering when offscreen */
  const setupVisibilityObserver = () => {
    if (!containerRef.value) return
    visibilityObserver = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true
      },
      { threshold: 0 }
    )
    visibilityObserver.observe(containerRef.value)
  }

  const start = () => {
    if (prefersReducedMotion()) return

    checkDarkMode()
    resize()
    setupVisibilityObserver()

    darkModeObserver = new MutationObserver(() => {
      checkDarkMode()
    })
    darkModeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    lastFrameTime = performance.now()
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
    if (visibilityObserver) {
      visibilityObserver.disconnect()
      visibilityObserver = null
    }
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