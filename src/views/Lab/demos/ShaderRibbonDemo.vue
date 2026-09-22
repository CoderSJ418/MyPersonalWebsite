<template>
  <div
    ref="shellRef"
    class="shader-shell"
    @pointermove="updatePointer"
    @pointerleave="resetPointer"
  >
    <canvas ref="canvasRef" class="shader-canvas" aria-hidden="true"></canvas>
    <div v-if="!decorative" class="shader-copy">
      <span>REAL WEBGL</span>
      <strong>Motion / Shader / Responsive</strong>
      <p>原生 WebGL fragment shader · 无图片素材</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

import fragmentSource from '../../../shaders/labRibbon/fragment.glsl?raw'
import vertexSource from '../../../shaders/labRibbon/vertex.glsl?raw'

interface Props {
  decorative?: boolean
}

withDefaults(defineProps<Props>(), { decorative: false })

const canvasRef = ref<HTMLCanvasElement | null>(null)
const shellRef = ref<HTMLElement | null>(null)
const pointer = { x: 0.5, y: 0.5 }
const isLowEndDevice = ref(false)
const prefersReducedMotion = ref(false)
let frame = 0
let observer: ResizeObserver | null = null
let gl: WebGLRenderingContext | null = null
let timeLocation: WebGLUniformLocation | null = null
let resolutionLocation: WebGLUniformLocation | null = null
let pointerLocation: WebGLUniformLocation | null = null

const compile = (context: WebGLRenderingContext, type: number, source: string) => {
  const shader = context.createShader(type)
  if (!shader) return null
  context.shaderSource(shader, source)
  context.compileShader(shader)
  if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
    context.deleteShader(shader)
    return null
  }
  return shader
}

const resize = () => {
  const canvas = canvasRef.value
  const shell = shellRef.value
  if (!canvas || !shell || !gl) return
  const ratio = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.max(1, Math.floor(shell.clientWidth * ratio))
  canvas.height = Math.max(1, Math.floor(shell.clientHeight * ratio))
  gl.viewport(0, 0, canvas.width, canvas.height)
}

const draw = (time: number) => {
  const canvas = canvasRef.value
  if (!gl || !canvas) return
  gl.uniform1f(timeLocation, time * 0.001)
  gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
  gl.uniform2f(pointerLocation, pointer.x, pointer.y)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

  if (!prefersReducedMotion.value && !isLowEndDevice.value) {
    frame = requestAnimationFrame(draw)
  }
}

const updatePointer = (event: PointerEvent) => {
  if (!(event.currentTarget instanceof HTMLElement) || event.pointerType === 'touch') return
  const rect = event.currentTarget.getBoundingClientRect()
  pointer.x = (event.clientX - rect.left) / rect.width
  pointer.y = 1 - (event.clientY - rect.top) / rect.height
}

const resetPointer = () => {
  pointer.x = 0.5
  pointer.y = 0.5
}

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  isLowEndDevice.value = (navigator.hardwareConcurrency || 4) < 4
  const canvas = canvasRef.value
  if (!canvas) return

  gl = canvas.getContext('webgl', { antialias: false, alpha: false })
  if (!gl) return

  const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource)
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource)
  if (!vertex || !fragment) return

  const program = gl.createProgram()
  if (!program) return
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
  gl.useProgram(program)

  const buffer = gl.createBuffer()
  if (!buffer) return
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW
  )

  const position = gl.getAttribLocation(program, 'aPosition')
  if (position < 0) return
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

  timeLocation = gl.getUniformLocation(program, 'uTime')
  resolutionLocation = gl.getUniformLocation(program, 'uResolution')
  pointerLocation = gl.getUniformLocation(program, 'uPointer')

  observer = new ResizeObserver(resize)
  if (shellRef.value) observer.observe(shellRef.value)
  resize()
  frame = requestAnimationFrame(draw)
})

onUnmounted(() => {
  cancelAnimationFrame(frame)
  observer?.disconnect()
})
</script>

<style scoped>
.shader-shell {
  position: relative;
  min-height: 20rem;
  overflow: hidden;
  border-radius: 1rem;
  background: #f8fbff;
}
.shader-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.shader-copy {
  position: absolute;
  left: 1.5rem;
  bottom: 1.5rem;
  display: grid;
  gap: 0.35rem;
  pointer-events: none;
}
.shader-copy span {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  color: #2563eb;
}
.shader-copy strong {
  font-size: 1.25rem;
  color: #0f172a;
}
.shader-copy p {
  margin: 0;
  font-size: 0.8rem;
  color: #64748b;
}
</style>
