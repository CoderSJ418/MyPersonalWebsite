<template>
  <div ref="shellRef" class="relative h-full min-h-64 overflow-hidden bg-slate-50" @pointermove="handlePointer" @pointerleave="resetPointer">
    <canvas ref="canvasRef" class="absolute inset-0 h-full w-full" aria-hidden="true"></canvas>
    <div class="pointer-events-none absolute left-5 top-5">
      <p class="text-[10px] font-bold tracking-[0.18em] text-blue-600">{{ scene.eyebrow }}</p>
      <p class="mt-1 text-xs font-semibold text-slate-600">{{ scene.labels.join(' · ') }}</p>
    </div>
    <span class="pointer-events-none absolute bottom-4 right-4 rounded-full border border-blue-100 bg-white/80 px-2.5 py-1 text-[10px] font-bold text-blue-600 backdrop-blur">GLSL</span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

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
const pointer = { x: 0.5, y: 0.5 }
let frame = 0
let observer: ResizeObserver | null = null
let gl: WebGLRenderingContext | null = null
let timeLoc: WebGLUniformLocation | null = null
let resolutionLoc: WebGLUniformLocation | null = null
let pointerLoc: WebGLUniformLocation | null = null
let speedLoc: WebGLUniformLocation | null = null
let intensityLoc: WebGLUniformLocation | null = null
let scaleLoc: WebGLUniformLocation | null = null
let variantLoc: WebGLUniformLocation | null = null
let primaryLoc: WebGLUniformLocation | null = null
let secondaryLoc: WebGLUniformLocation | null = null
let baseLoc: WebGLUniformLocation | null = null

const vertexSource = 'attribute vec2 aPosition; varying vec2 vUv; void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}'
const fragmentSource = 'precision highp float; uniform float uTime,uSpeed,uIntensity,uScale; uniform vec2 uResolution,uPointer; uniform int uVariant; uniform vec3 uPrimary,uSecondary,uBase; varying vec2 vUv; float circle(vec2 p,float r){return 1.-smoothstep(r,r+.025,length(p));} float band(float x,float center,float width){return 1.-smoothstep(width,width+.025,abs(x-center));} void main(){vec2 p=(vUv*2.-1.);p.x*=uResolution.x/max(uResolution.y,1.);p*=uScale;float t=uTime*uSpeed;vec3 color=uBase;if(uVariant==0){float wave=sin(p.x*3.8+t)*.22+sin(p.x*7.2-t*.6)*.055;wave+=(uPointer.y-.5)*.18*exp(-2.8*abs(p.x-(uPointer.x*2.-1.)));float a=band(p.y,wave,.12),b=band(p.y,-wave*.65-.12,.09);color=mix(color,mix(uPrimary,uSecondary,.5+.5*sin(p.x*2.+t)),clamp((a+b*.72)*uIntensity,0.,1.));}else if(uVariant==1){float field=0.;for(int i=0;i<5;i++){float fi=float(i);vec2 c=vec2(sin(fi*2.1+t*.4),cos(fi*1.7-t*.3))*.55;field+=.055/(.02+length(p-c));}float scan=.5+.5*sin((p.y+t*.35)*13.);color=mix(color,mix(uSecondary,uPrimary,scan),smoothstep(.18,.85,field)*uIntensity);}else{float d=length(p);float ring=band(d,.58+.05*sin(t),.055);float inner=circle(p,.34+.03*sin(t*.7));float rays=.5+.5*cos(atan(p.y,p.x)*8.-t*2.);color=mix(color,uPrimary,ring*uIntensity);color=mix(color,uSecondary,inner*.26*uIntensity);color+=uPrimary*rays*ring*.14*uIntensity;}gl_FragColor=vec4(color,1.);}'

const numberParam = (key: string, fallback: number) => {
  const value = props.params[key]
  return typeof value === 'number' ? value : fallback
}

const rgb = (hex: string) => {
  const value = Number.parseInt(hex.replace('#', ''), 16)
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255]
}

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

const handlePointer = (event: PointerEvent) => {
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
  const canvas = canvasRef.value
  const shell = shellRef.value
  if (!canvas || !shell) return
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
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW)
  const position = gl.getAttribLocation(program, 'aPosition')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

  timeLoc=gl.getUniformLocation(program,'uTime');resolutionLoc=gl.getUniformLocation(program,'uResolution')
  pointerLoc=gl.getUniformLocation(program,'uPointer');speedLoc=gl.getUniformLocation(program,'uSpeed')
  intensityLoc=gl.getUniformLocation(program,'uIntensity');scaleLoc=gl.getUniformLocation(program,'uScale')
  variantLoc=gl.getUniformLocation(program,'uVariant');primaryLoc=gl.getUniformLocation(program,'uPrimary')
  secondaryLoc=gl.getUniformLocation(program,'uSecondary');baseLoc=gl.getUniformLocation(program,'uBase')
  const primary=rgb(motionColors.primary),secondary=rgb(motionColors.secondary),base=rgb(motionColors.surface)
  gl.uniform3f(primaryLoc,primary[0]??0,primary[1]??0,primary[2]??0)
  gl.uniform3f(secondaryLoc,secondary[0]??0,secondary[1]??0,secondary[2]??0)
  gl.uniform3f(baseLoc,base[0]??1,base[1]??1,base[2]??1)

  const resize=()=>{if(!gl)return;const ratio=Math.min(window.devicePixelRatio||1,1.8);canvas.width=Math.max(1,Math.floor(shell.clientWidth*ratio));canvas.height=Math.max(1,Math.floor(shell.clientHeight*ratio));gl.viewport(0,0,canvas.width,canvas.height)}
  observer=new ResizeObserver(resize);observer.observe(shell);resize()
  const variant=props.scene.variant==='ribbon'?0:props.scene.variant==='heat'?1:2
  const tick=(time:number)=>{if(!gl)return;gl.uniform1f(timeLoc,time*.001);gl.uniform2f(resolutionLoc,canvas.width,canvas.height);gl.uniform2f(pointerLoc,pointer.x,pointer.y);gl.uniform1f(speedLoc,numberParam('speed',.4));gl.uniform1f(intensityLoc,numberParam('intensity',.75));gl.uniform1f(scaleLoc,numberParam('scale',1));gl.uniform1i(variantLoc,variant);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);frame=requestAnimationFrame(tick)}
  frame=requestAnimationFrame(tick)
})

onUnmounted(()=>{cancelAnimationFrame(frame);observer?.disconnect();gl=null})
</script>
