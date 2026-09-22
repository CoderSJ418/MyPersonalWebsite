<template>
  <div
    ref="shellRef"
    class="relative h-full min-h-64 overflow-hidden bg-slate-50"
    @pointermove="handlePointer"
    @pointerleave="resetPointer"
  >
    <canvas ref="canvasRef" class="absolute inset-0 h-full w-full" aria-hidden="true"></canvas>
    <div class="pointer-events-none absolute left-5 top-5">
      <p class="text-[10px] font-bold tracking-[0.18em] text-blue-600">{{ scene.eyebrow }}</p>
      <p class="mt-1 text-xs font-semibold text-slate-600">{{ scene.labels.join(' · ') }}</p>
    </div>
    <span class="pointer-events-none absolute bottom-4 right-4 rounded-full border border-blue-100 bg-white/80 px-2.5 py-1 text-[10px] font-bold text-blue-600 backdrop-blur">
      CANVAS 2D
    </span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

import { motionCanvasColors } from '@/design-system/tokens/motion'
import type { LabParams } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'

interface Props {
  scene: MotionSceneRuntime
  params: LabParams
}

const props = defineProps<Props>()
const shellRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const pointer = { x: 0.5, y: 0.5, active: false }
let resizeObserver: ResizeObserver | null = null
let frame = 0

const numberParam = (key: string, fallback: number) => {
  const value = props.params[key]
  return typeof value === 'number' ? value : fallback
}

const handlePointer = (event: PointerEvent) => {
  if (!(event.currentTarget instanceof HTMLElement) || event.pointerType === 'touch') return
  const rect = event.currentTarget.getBoundingClientRect()
  pointer.x = (event.clientX - rect.left) / rect.width
  pointer.y = (event.clientY - rect.top) / rect.height
  pointer.active = true
}

const resetPointer = () => {
  pointer.x = 0.5
  pointer.y = 0.5
  pointer.active = false
}

const drawParticles = (context: CanvasRenderingContext2D, width: number, height: number, time: number) => {
  const density = Math.round(numberParam('density', 48))
  const speed = numberParam('speed', 0.6)
  const strength = numberParam('pointerStrength', 0.5)
  const px = pointer.x * width
  const py = pointer.y * height

  for (let index = 0; index < density; index += 1) {
    const baseX = ((index * 83) % 997) / 997
    const baseY = ((index * 149) % 991) / 991
    const orbit = time * 0.00025 * speed + index * 0.38
    let x = baseX * width + Math.cos(orbit) * (8 + (index % 5) * 3)
    let y = baseY * height + Math.sin(orbit * 1.2) * (7 + (index % 4) * 3)
    if (pointer.active) {
      const dx = px - x
      const dy = py - y
      const distance = Math.max(40, Math.sqrt(dx * dx + dy * dy))
      x += (dx / distance) * 22 * strength
      y += (dy / distance) * 22 * strength
    }
    context.beginPath()
    context.fillStyle = index % 4 === 0 ? motionCanvasColors.secondary : motionCanvasColors.primary
    context.arc(x, y, 1.5 + (index % 3) * 0.55, 0, Math.PI * 2)
    context.fill()

    if (index % 4 === 0) {
      context.beginPath()
      context.strokeStyle = motionCanvasColors.line
      context.moveTo(x, y)
      context.lineTo(width * 0.5, height * 0.5)
      context.stroke()
    }
  }
}

const drawNetwork = (context: CanvasRenderingContext2D, width: number, height: number, time: number) => {
  const density = Math.max(12, Math.round(numberParam('density', 36) / 3))
  const speed = numberParam('speed', 0.55)
  const nodes = Array.from({ length: density }, (_, index) => ({
    x: width * (0.08 + (((index * 37) % 89) / 100)),
    y: height * (0.12 + (((index * 53) % 76) / 100))
  }))

  context.lineWidth = 1
  nodes.forEach((node, index) => {
    const next = nodes[(index + 3) % nodes.length]
    if (!next) return
    context.beginPath()
    context.strokeStyle = motionCanvasColors.line
    context.moveTo(node.x, node.y)
    context.lineTo(next.x, next.y)
    context.stroke()

    const phase = (time * 0.00018 * speed + index / nodes.length) % 1
    const pulseX = node.x + (next.x - node.x) * phase
    const pulseY = node.y + (next.y - node.y) * phase
    context.beginPath()
    context.fillStyle = motionCanvasColors.primary
    context.arc(pulseX, pulseY, 2.5, 0, Math.PI * 2)
    context.fill()
  })
  nodes.forEach((node, index) => {
    context.beginPath()
    context.fillStyle = index % 5 === 0 ? motionCanvasColors.primary : motionCanvasColors.panel
    context.strokeStyle = motionCanvasColors.primarySoft
    context.arc(node.x, node.y, index % 5 === 0 ? 7 : 4.5, 0, Math.PI * 2)
    context.fill()
    context.stroke()
  })
}

const drawFilmstrip = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number
) => {
  const speed = numberParam('speed', 0.9)
  const density = Math.max(8, Math.round(numberParam('density', 18) / 2))
  for (let index = 0; index < density; index += 1) {
    const lane = index % 3
    const cardWidth = width * (0.2 + lane * 0.025)
    const cardHeight = height * 0.28
    const travel = width + cardWidth
    const x = ((index * (travel / density) + time * 0.04 * speed * (1 + lane * 0.18)) % travel) - cardWidth
    const y = height * (0.12 + lane * 0.28)
    context.fillStyle = lane === 1 ? motionCanvasColors.primarySoft : motionCanvasColors.panel
    context.strokeStyle = lane === 1 ? motionCanvasColors.primary : motionCanvasColors.line
    context.lineWidth = lane === 1 ? 2 : 1
    context.beginPath()
    context.roundRect(x, y, cardWidth, cardHeight, 14)
    context.fill()
    context.stroke()
    context.fillStyle = lane === 1 ? motionCanvasColors.primary : motionCanvasColors.ink
    context.fillRect(x + 16, y + 18, cardWidth * 0.44, 5)
    context.fillStyle = motionCanvasColors.line
    context.fillRect(x + 16, y + 36, cardWidth * 0.68, 4)
  }
}

onMounted(() => {
  const canvas = canvasRef.value
  const shell = shellRef.value
  if (!canvas || !shell) return
  const context = canvas.getContext('2d')
  if (!context) return

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.8)
    canvas.width = Math.max(1, Math.floor(shell.clientWidth * ratio))
    canvas.height = Math.max(1, Math.floor(shell.clientHeight * ratio))
    canvas.style.width = `${shell.clientWidth}px`
    canvas.style.height = `${shell.clientHeight}px`
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
  }
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(shell)
  resize()

  const tick = (time: number) => {
    const width = shell.clientWidth
    const height = shell.clientHeight
    context.clearRect(0, 0, width, height)
    context.fillStyle = motionCanvasColors.panel
    context.fillRect(0, 0, width, height)
    if (props.scene.variant === 'particles') drawParticles(context, width, height, time)
    else if (props.scene.variant === 'network') drawNetwork(context, width, height, time)
    else drawFilmstrip(context, width, height, time)
    frame = requestAnimationFrame(tick)
  }
  frame = requestAnimationFrame(tick)
})

onUnmounted(() => {
  cancelAnimationFrame(frame)
  resizeObserver?.disconnect()
})
</script>
