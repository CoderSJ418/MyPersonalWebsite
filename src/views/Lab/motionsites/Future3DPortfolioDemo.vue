<template>
  <div ref="shellRef" class="relative h-full min-h-64 overflow-hidden bg-[#050505]" @pointermove="handlePointer" @pointerleave="resetPointer">
    <canvas ref="canvasRef" class="absolute inset-0 h-full w-full" aria-hidden="true"></canvas>
    <div class="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-5 text-[9px] font-semibold tracking-[0.18em] text-white/60">
      <span>FUTURE 3D PORTFOLIO</span><span>PROJECTS / ABOUT / CONTACT</span>
    </div>
    <div class="pointer-events-none absolute bottom-5 left-5 max-w-xs">
      <p class="text-xs uppercase tracking-[0.18em] text-white/45">Spatial portfolio</p>
      <p class="mt-1 text-2xl font-semibold tracking-tight text-white">Move through the work.</p>
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
let renderer: THREE.WebGLRenderer | null = null
let root: THREE.Group | null = null
let observer: ResizeObserver | null = null
let frame = 0
const num = (key: string, fallback: number) => typeof props.params[key] === 'number' ? Number(props.params[key]) : fallback

const makeTexture = (index: number) => {
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 320
  const ctx = canvas.getContext('2d'); if (!ctx) return new THREE.CanvasTexture(canvas)
  ctx.fillStyle = index % 2 ? '#111827' : '#f8fafc'; ctx.fillRect(0, 0, 512, 320)
  ctx.fillStyle = index % 2 ? '#60a5fa' : '#2563eb'; ctx.fillRect(28, 28, 160, 12)
  ctx.fillStyle = index % 2 ? '#334155' : '#dbeafe'; ctx.fillRect(28, 68, 456, 160)
  ctx.fillStyle = index % 2 ? '#e2e8f0' : '#0f172a'; ctx.font = '700 34px Arial'; ctx.fillText(['FIELD OPS','AI FLOW','MOTION LAB','PRODUCT'][index] ?? 'PROJECT', 28, 278)
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; return texture
}
const handlePointer = (event: PointerEvent) => {
  if (!(event.currentTarget instanceof HTMLElement) || event.pointerType === 'touch') return
  const rect = event.currentTarget.getBoundingClientRect(); pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2; pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
}
const resetPointer = () => { pointer.x = 0; pointer.y = 0 }

onMounted(() => {
  const shell = shellRef.value, canvas = canvasRef.value; if (!shell || !canvas) return
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#050505'); scene.fog = new THREE.Fog('#050505', 5, 12)
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 30); camera.position.set(0, 0, 5.8)
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true }); renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.7))
  root = new THREE.Group(); scene.add(root)
  const layout = [[-1.65,0.7,-1.7,-0.28],[0.2,0.1,0,0.08],[1.55,0.82,-1.1,0.28],[-0.9,-1.05,-2.2,-0.12]]
  layout.forEach((v,index) => {
    const material = new THREE.MeshBasicMaterial({ map: makeTexture(index), toneMapped: false })
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(2.35,1.47), material)
    panel.position.set(v[0] ?? 0,v[1] ?? 0,v[2] ?? 0); panel.rotation.y = v[3] ?? 0; root?.add(panel)
  })
  const stars = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ color:'#64748b', size:0.018 }))
  const positions = new Float32Array(240 * 3); for(let i=0;i<positions.length;i+=3){positions[i]=(Math.random()-.5)*10;positions[i+1]=(Math.random()-.5)*6;positions[i+2]=-Math.random()*7}
  stars.geometry.setAttribute('position', new THREE.BufferAttribute(positions,3)); scene.add(stars)
  const resize=()=>{if(!renderer)return;renderer.setSize(shell.clientWidth,shell.clientHeight,false);camera.aspect=shell.clientWidth/Math.max(1,shell.clientHeight);camera.updateProjectionMatrix()}
  observer=new ResizeObserver(resize);observer.observe(shell);resize()
  const tick=(time:number)=>{if(!renderer||!root)return;const speed=num('speed',.3),depth=num('depth',1.3),strength=num('pointerStrength',.42);root.position.z=(depth-1)*-.25;root.rotation.y+=(pointer.x*strength*.18-root.rotation.y)*.025;root.rotation.x+=(-pointer.y*strength*.1-root.rotation.x)*.025;root.position.y=Math.sin(time*.00035*speed)*.08;renderer.render(scene,camera);frame=requestAnimationFrame(tick)}
  frame=requestAnimationFrame(tick)
})
onUnmounted(()=>{cancelAnimationFrame(frame);observer?.disconnect();root?.traverse(obj=>{if(obj instanceof THREE.Mesh){obj.geometry.dispose();if(obj.material instanceof THREE.Material){if('map' in obj.material && obj.material.map) obj.material.map.dispose();obj.material.dispose()}}});renderer?.dispose()})
</script>
