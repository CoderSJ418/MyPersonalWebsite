<template>
  <div ref="shellRef" class="relative h-full min-h-64 overflow-hidden bg-[#f7f9fc]" @pointermove="handlePointer" @pointerleave="resetPointer">
    <canvas ref="canvasRef" class="absolute inset-0 h-full w-full" aria-hidden="true"></canvas>
    <div class="pointer-events-none absolute inset-0 flex flex-col justify-between p-5 sm:p-7">
      <div class="max-w-[52%]">
        <p class="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Digital Epoch · MotionSites recreation</p>
        <h3 class="mt-4 text-[clamp(1.7rem,4.6vw,4.8rem)] font-semibold leading-[0.9] tracking-[-0.065em] text-slate-950">Engineering the next digital layer.</h3>
        <p class="mt-4 max-w-xs text-xs leading-5 text-slate-500">Light product hero · 3D product core · orbital paths</p>
      </div>
      <div class="flex max-w-[80%] gap-2 overflow-hidden">
        <span v-for="item in stack" :key="item" class="rounded-full border border-slate-200/80 bg-white/90 px-3 py-2 text-[9px] font-semibold text-slate-600 shadow-sm">{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'
import type { LabParams } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'

const props = defineProps<{ scene: MotionSceneRuntime; params: LabParams }>()
const shellRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const pointer = { x: 0, y: 0 }
const stack = ['Vue', 'Three.js', 'GSAP', 'Vite']
let renderer: THREE.WebGLRenderer | null = null
let root: THREE.Group | null = null
let observer: ResizeObserver | null = null
let frame = 0

const num = (key: string, fallback: number) => typeof props.params[key] === 'number' ? Number(props.params[key]) : fallback
const handlePointer = (event: PointerEvent) => {
  if (!(event.currentTarget instanceof HTMLElement) || event.pointerType === 'touch') return
  const rect = event.currentTarget.getBoundingClientRect()
  pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
  pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
}
const resetPointer = () => { pointer.x = 0; pointer.y = 0 }

const roundedSquare = () => {
  const shape = new THREE.Shape()
  const r = 0.22, s = 0.86
  shape.moveTo(-s + r, -s); shape.lineTo(s - r, -s); shape.quadraticCurveTo(s, -s, s, -s + r)
  shape.lineTo(s, s - r); shape.quadraticCurveTo(s, s, s - r, s); shape.lineTo(-s + r, s)
  shape.quadraticCurveTo(-s, s, -s, s - r); shape.lineTo(-s, -s + r); shape.quadraticCurveTo(-s, -s, -s + r, -s)
  return new THREE.ExtrudeGeometry(shape, { depth: 0.28, bevelEnabled: true, bevelSize: 0.12, bevelThickness: 0.1, bevelSegments: 6 })
}

onMounted(() => {
  const shell = shellRef.value, canvas = canvasRef.value
  if (!shell || !canvas) return
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('#f7f9fc')
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50)
  camera.position.set(0, 0, 6)
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.7))
  root = new THREE.Group(); root.position.x = 1.35; scene.add(root)
  const core = new THREE.Mesh(roundedSquare(), new THREE.MeshPhysicalMaterial({ color: '#2563eb', roughness: 0.2, metalness: 0.08, clearcoat: 1 }))
  core.geometry.center(); core.rotation.set(-0.62, 0.42, 0.78); root.add(core)
  ;[1.35, 1.72].forEach((radius, index) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.009, 6, 120), new THREE.MeshBasicMaterial({ color: index ? '#bfdbfe' : '#ffffff' }))
    ring.rotation.set(1.15 + index * 0.22, 0.12, 0.5); root?.add(ring)
  })
  scene.add(new THREE.HemisphereLight('#ffffff', '#bfdbfe', 2.4))
  const light = new THREE.DirectionalLight('#ffffff', 4); light.position.set(4, 4, 5); scene.add(light)
  const resize = () => { if (!renderer) return; renderer.setSize(shell.clientWidth, shell.clientHeight, false); camera.aspect = shell.clientWidth / Math.max(1, shell.clientHeight); camera.updateProjectionMatrix() }
  observer = new ResizeObserver(resize); observer.observe(shell); resize()
  const tick = (time: number) => {
    if (!renderer || !root) return
    const speed = num('speed', 0.38), depth = num('depth', 0.95), strength = num('pointerStrength', 0.3)
    root.scale.setScalar(0.9 + depth * 0.08)
    root.rotation.y += 0.0016 * speed
    root.rotation.x += (pointer.y * strength * 0.12 - root.rotation.x) * 0.035
    root.position.y = Math.sin(time * 0.00055 * speed) * 0.08
    camera.position.x += (pointer.x * strength * 0.28 - camera.position.x) * 0.035
    renderer.render(scene, camera); frame = requestAnimationFrame(tick)
  }
  frame = requestAnimationFrame(tick)
})

onUnmounted(() => { cancelAnimationFrame(frame); observer?.disconnect(); root?.traverse(obj => { if (obj instanceof THREE.Mesh) { obj.geometry.dispose(); if (obj.material instanceof THREE.Material) obj.material.dispose() } }); renderer?.dispose() })
</script>
