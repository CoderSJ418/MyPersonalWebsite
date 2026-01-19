<template>
  <canvas
    ref="canvasRef"
    class="particle-canvas"
    :class="{ 'dark': isDark }"
  ></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useAppStore } from '@/stores/useAppStore'

const canvasRef = ref<HTMLCanvasElement>()
const appStore = useAppStore()
const isDark = computed(() => appStore.theme === 'dark')

let ctx: CanvasRenderingContext2D | null = null
let particles: Particle[] = []
let animationId: number | null = null
let mouse = { x: 0, y: 0 }

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
}

class ParticleClass implements Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string

  constructor(canvas: HTMLCanvasElement) {
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height
    this.vx = (Math.random() - 0.5) * 1.0
    this.vy = (Math.random() - 0.5) * 1.0
    this.size = Math.random() * 4 + 2
    this.color = `rgba(59, 130, 246, ${Math.random() * 0.4 + 0.4})`
  }

  update(canvas: HTMLCanvasElement) {
    this.x += this.vx
    this.y += this.vy

    // Bounce off walls
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1

    // Slow down mouse attraction
    this.vx *= 0.999
    this.vy *= 0.999
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath()
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    context.fillStyle = this.color
    context.fill()
  }
}

const createParticles = (count: number, canvas: HTMLCanvasElement) => {
  particles = []
  for (let i = 0; i < count; i++) {
    particles.push(new ParticleClass(canvas))
  }
}

const drawParticles = (canvas: HTMLCanvasElement) => {
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Draw particles
  particles.forEach(particle => {
    particle.draw(ctx)
  })

  // Draw connections
  particles.forEach((p1, i) => {
    particles.slice(i + 1).forEach(p2 => {
      const dx = p1.x - p2.x
      const dy = p1.y - p2.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 120) {
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.strokeStyle = `rgba(59, 130, 246, ${1 - distance / 120})`
        ctx.stroke()
      }

      // Mouse interaction
      const dxMouse = p1.x - mouse.x
      const dyMouse = p1.y - mouse.y
      const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)

      if (distanceMouse < 150) {
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(mouse.x, mouse.y)
        ctx.strokeStyle = `rgba(59, 130, 246, ${1 - distanceMouse / 150})`
        ctx.stroke()

        // Attract to mouse
        p1.vx += dxMouse * 0.0001
        p1.vy += dyMouse * 0.0001
      }
    })
  })
}

const updateParticles = (canvas: HTMLCanvasElement) => {
  particles.forEach(particle => {
    particle.update(canvas)
  })
}

const animate = () => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  updateParticles(canvas)
  drawParticles(canvas)

  animationId = requestAnimationFrame(animate)
}

const init = () => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  ctx = canvas.getContext('2d')

  createParticles(80, canvas)

  canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
  })

  animate()
}

const handleResize = () => {
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  createParticles(80, canvas)
}

onMounted(() => {
  init()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.particle-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.particle-canvas.dark {
  opacity: 0.6;
}
</style>