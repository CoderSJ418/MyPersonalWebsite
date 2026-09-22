<template>
  <div ref="shellRef" class="relative h-full min-h-64 overflow-hidden bg-[#07111f]">
    <canvas ref="canvasRef" class="absolute inset-0 h-full w-full" aria-hidden="true"></canvas>
    <div class="pointer-events-none absolute inset-0 flex flex-col justify-between p-5 text-white">
      <div class="flex justify-between text-[9px] font-semibold tracking-[0.18em] text-white/55">
        <span>AETHERIS VOYAGE</span><span>SCROLL TO DEPART</span>
      </div>
      <div class="max-w-sm">
        <p class="text-[clamp(1.8rem,5vw,4.7rem)] font-medium leading-[0.84] tracking-[-0.065em]">
          Beyond the known horizon.
        </p>
        <p class="mt-3 text-[10px] leading-5 text-white/60">
          Atmosphere, horizon and celestial scale move at different scroll speeds.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

import type { LabParams } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'

const props = defineProps<{ scene: MotionSceneRuntime; params: LabParams }>()
const shellRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
let gl: WebGLRenderingContext | null = null
let observer: ResizeObserver | null = null
let trigger: ScrollTrigger | null = null
let frame = 0
let scrollProgress = 0.22

const vertexSource =
  'attribute vec2 aPosition;varying vec2 vUv;void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}'
const fragmentSource =
  'precision highp float;uniform float uTime,uSpeed,uIntensity,uScale,uScroll;uniform vec2 uResolution;varying vec2 vUv;float hill(vec2 p,float y,float f,float a,float phase){return smoothstep(.018,-.018,p.y-y-sin(p.x*f+phase)*a);}void main(){vec2 uv=vUv;vec2 p=uv*2.-1.;p.x*=uResolution.x/max(uResolution.y,1.);float t=uTime*uSpeed;float scroll=uScroll;vec3 top=vec3(.025,.067,.125),mid=vec3(.13,.25,.42),warm=vec3(.95,.49,.27);vec3 color=mix(top,mid,uv.y);color=mix(color,warm,pow(max(0.,1.-abs(uv.y-.35)*2.1),3.)*.48*uIntensity);vec2 sun=vec2(.45-scroll*.32,.16+scroll*.22);sun.x*=uResolution.x/max(uResolution.y,1.);float d=length(p-sun);float sr=.24*uScale+.05*scroll;float disc=1.-smoothstep(sr,sr+.012,d);float glow=exp(-4.2*d/sr);color+=vec3(1.,.72,.46)*glow*.33*uIntensity;color=mix(color,vec3(.98,.88,.72),disc*.92);float back=hill(p,-.05+scroll*.08,1.6,.055,t*.12);float midh=hill(p,-.30+scroll*.16,2.1,.075,-t*.09);float front=hill(p,-.58+scroll*.25,2.8,.09,t*.06);color=mix(color,vec3(.11,.20,.31),back*.88);color=mix(color,vec3(.065,.12,.20),midh*.94);color=mix(color,vec3(.025,.055,.10),front);float haze=exp(-pow((p.y+.16-scroll*.12)*5.,2.));color+=vec3(.58,.72,.88)*haze*.045*uIntensity;gl_FragColor=vec4(color,1.);}'

const numberParam = (key: string, fallback: number) =>
  typeof props.params[key] === 'number' ? Number(props.params[key]) : fallback

const compileShader = (context: WebGLRenderingContext, type: number, source: string) => {
  const shader = context.createShader(type)
  if (!shader) return null
  context.shaderSource(shader, source)
  context.compileShader(shader)
  return context.getShaderParameter(shader, context.COMPILE_STATUS) ? shader : null
}

onMounted(() => {
  const shell = shellRef.value
  const canvas = canvasRef.value
  if (!shell || !canvas) return
  gl = canvas.getContext('webgl', { antialias: false })
  if (!gl) return

  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexSource)
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource)
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
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
  const position = gl.getAttribLocation(program, 'aPosition')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

  const timeLocation = gl.getUniformLocation(program, 'uTime')
  const speedLocation = gl.getUniformLocation(program, 'uSpeed')
  const intensityLocation = gl.getUniformLocation(program, 'uIntensity')
  const scaleLocation = gl.getUniformLocation(program, 'uScale')
  const scrollLocation = gl.getUniformLocation(program, 'uScroll')
  const resolutionLocation = gl.getUniformLocation(program, 'uResolution')

  const resize = () => {
    if (!gl) return
    const ratio = Math.min(devicePixelRatio || 1, 1.7)
    canvas.width = Math.max(1, Math.floor(shell.clientWidth * ratio))
    canvas.height = Math.max(1, Math.floor(shell.clientHeight * ratio))
    gl.viewport(0, 0, canvas.width, canvas.height)
  }
  observer = new ResizeObserver(resize)
  observer.observe(shell)
  resize()

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    scrollProgress = 0.55
  } else {
    gsap.registerPlugin(ScrollTrigger)
    trigger = ScrollTrigger.create({
      trigger: shell,
      start: 'top bottom',
      end: 'bottom top',
      scrub: Math.max(0.15, 1.15 - numberParam('speed', 0.24)),
      onUpdate: (self) => { scrollProgress = self.progress }
    })
  }

  const tick = (now: number) => {
    if (!gl) return
    gl.uniform1f(timeLocation, now * 0.001)
    gl.uniform1f(speedLocation, numberParam('speed', 0.24))
    gl.uniform1f(intensityLocation, numberParam('intensity', 0.78))
    gl.uniform1f(scaleLocation, numberParam('scale', 1.08))
    gl.uniform1f(scrollLocation, scrollProgress)
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    frame = requestAnimationFrame(tick)
  }
  frame = requestAnimationFrame(tick)
})

onUnmounted(() => {
  cancelAnimationFrame(frame)
  observer?.disconnect()
  trigger?.kill()
  gl = null
})
</script>
