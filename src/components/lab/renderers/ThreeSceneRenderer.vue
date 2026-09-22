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
      THREE.JS
    </span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'

import { motionColors } from '@/design-system/tokens/motion'
import type { LabParams } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'

interface Props {
  scene: MotionSceneRuntime
  params: LabParams
}

const props = defineProps<Props>()
const shellRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const pointer = { x: 0, y: 0 }
let resizeObserver: ResizeObserver | null = null
let frame = 0
let renderer: THREE.WebGLRenderer | null = null
let root: THREE.Group | null = null

const numberParam = (key: string, fallback: number) => {
  const value = props.params[key]
  return typeof value === 'number' ? value : fallback
}

const material = (color: string, opacity = 1) =>
  new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.34,
    metalness: 0.06,
    transparent: opacity < 1,
    opacity
  })

const buildBrowserStack = (group: THREE.Group) => {
  const positions = [
    [-1.25, 0.28, -0.85, -0.14],
    [0.15, -0.12, 0, 0.06],
    [1.18, 0.38, -0.5, 0.14]
  ]
  positions.forEach((item, index) => {
    const panel = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 1.12, 0.08),
      material(index === 1 ? motionColors.panel : motionColors.surface, index === 1 ? 1 : 0.82)
    )
    panel.position.set(item[0] ?? 0, item[1] ?? 0, item[2] ?? 0)
    panel.rotation.y = item[3] ?? 0
    group.add(panel)

    const accent = new THREE.Mesh(
      new THREE.BoxGeometry(1.35, 0.08, 0.04),
      material(index === 1 ? motionColors.primary : motionColors.line)
    )
    accent.position.copy(panel.position).add(new THREE.Vector3(0, 0.35, 0.07))
    accent.rotation.y = panel.rotation.y
    group.add(accent)
  })
}

const buildOrbital = (group: THREE.Group) => {
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.72, 2),
    material(motionColors.primary, 0.94)
  )
  group.add(core)

  ;[1.15, 1.55, 1.95].forEach((radius, index) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.014 + index * 0.006, 8, 96),
      material(index === 1 ? motionColors.secondary : motionColors.line, 0.78)
    )
    ring.rotation.set(0.8 + index * 0.24, 0.15, index * 0.65)
    group.add(ring)
  })
}

const buildTopology = (group: THREE.Group) => {
  const points = [
    [-1.6, 0.7, -0.8], [-0.65, -0.7, 0.25], [0, 0.35, 0.75],
    [0.8, -0.45, -0.1], [1.55, 0.72, -0.65], [1.4, -0.8, 0.6]
  ]
  const vectors = points.map((point) => new THREE.Vector3(point[0] ?? 0, point[1] ?? 0, point[2] ?? 0))
  vectors.forEach((point, index) => {
    const node = new THREE.Mesh(
      new THREE.SphereGeometry(index === 2 ? 0.22 : 0.13, 24, 24),
      material(index === 2 ? motionColors.primary : motionColors.secondary)
    )
    node.position.copy(point)
    group.add(node)
  })
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(
    vectors.flatMap((point, index) => index < vectors.length - 1 ? [point, vectors[index + 1] ?? point] : [])
  )
  group.add(new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({ color: motionColors.line })))
}

const handlePointer = (event: PointerEvent) => {
  if (!(event.currentTarget instanceof HTMLElement) || event.pointerType === 'touch') return
  const rect = event.currentTarget.getBoundingClientRect()
  pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
  pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
}

const resetPointer = () => {
  pointer.x = 0
  pointer.y = 0
}

onMounted(() => {
  const canvas = canvasRef.value
  const shell = shellRef.value
  if (!canvas || !shell) return

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(motionColors.surface)
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
  camera.position.set(0, 0, 5.2)
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8))

  scene.add(new THREE.HemisphereLight(motionColors.panel, motionColors.line, 2.2))
  const light = new THREE.DirectionalLight(motionColors.panel, 3.5)
  light.position.set(3, 4, 5)
  scene.add(light)

  root = new THREE.Group()
  if (props.scene.variant === 'browser-stack') buildBrowserStack(root)
  else if (props.scene.variant === 'orbital') buildOrbital(root)
  else buildTopology(root)
  scene.add(root)

  const resize = () => {
    if (!renderer || !shell) return
    const width = Math.max(1, shell.clientWidth)
    const height = Math.max(1, shell.clientHeight)
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(shell)
  resize()

  const tick = (time: number) => {
    if (!renderer || !root) return
    const speed = numberParam('speed', 0.4)
    const depth = numberParam('depth', 1)
    const strength = numberParam('pointerStrength', 0.3)
    root.scale.setScalar(0.9 + depth * 0.1)
    root.rotation.y += 0.0017 * speed
    root.rotation.x += (pointer.y * 0.14 * strength - root.rotation.x) * 0.045
    root.rotation.y += (pointer.x * 0.18 * strength - root.rotation.y * 0.05) * 0.018
    root.position.y = Math.sin(time * 0.0006 * speed) * 0.08
    renderer.render(scene, camera)
    frame = requestAnimationFrame(tick)
  }
  frame = requestAnimationFrame(tick)
})

onUnmounted(() => {
  cancelAnimationFrame(frame)
  resizeObserver?.disconnect()
  root?.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.geometry.dispose()
      if (object.material instanceof THREE.Material) object.material.dispose()
    }
    if (object instanceof THREE.LineSegments) {
      object.geometry.dispose()
      if (object.material instanceof THREE.Material) object.material.dispose()
    }
  })
  renderer?.dispose()
})
</script>
