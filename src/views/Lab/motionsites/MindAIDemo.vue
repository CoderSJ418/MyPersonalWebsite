<template>
  <div ref="shellRef" class="relative h-full min-h-64 overflow-hidden bg-[#050511]" @pointermove="handlePointer" @pointerleave="resetPointer">
    <canvas ref="canvasRef" class="absolute inset-0 h-full w-full" aria-hidden="true"></canvas>
    <div class="pointer-events-none absolute left-5 top-5"><p class="text-[9px] font-bold tracking-[0.2em] text-violet-200/60">MIND AI / 3D AI</p><p class="mt-2 max-w-[220px] text-xs leading-5 text-white/55">A neural core that feels alive rather than decorative.</p></div>
    <p class="pointer-events-none absolute bottom-5 right-5 text-[9px] font-semibold tracking-[0.16em] text-fuchsia-200/55">NEURAL / ENERGY / CORE</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type { LabParams } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'

const props=defineProps<{scene:MotionSceneRuntime;params:LabParams}>()
const shellRef=ref<HTMLElement|null>(null),canvasRef=ref<HTMLCanvasElement|null>(null),pointer={x:.5,y:.5}
let gl:WebGLRenderingContext|null=null,observer:ResizeObserver|null=null,frame=0
const vertex='attribute vec2 aPosition;varying vec2 vUv;void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}'
const fragment='precision highp float;uniform float uTime,uSpeed,uIntensity,uScale;uniform vec2 uResolution,uPointer;varying vec2 vUv;float band(float x,float c,float w){return 1.-smoothstep(w,w+.02,abs(x-c));}void main(){vec2 p=vUv*2.-1.;p.x*=uResolution.x/max(uResolution.y,1.);p*=uScale;float t=uTime*uSpeed;float d=length(p);float core=1.-smoothstep(.12,.5,d);float ring=band(d,.48+.04*sin(t),.035);float energy=0.;for(int i=0;i<7;i++){float fi=float(i);float a=atan(p.y,p.x)+sin(d*8.-t+fi)*.18;energy+=band(sin(a*(3.+mod(fi,3.))+t+fi),0.,.08)*smoothstep(.9,.1,d);}vec2 m=(uPointer*2.-1.);m.x*=uResolution.x/max(uResolution.y,1.);float mouse=exp(-4.*length(p-m));vec3 bg=vec3(.018,.018,.06),violet=vec3(.48,.26,.95),pink=vec3(.94,.28,.7),cyan=vec3(.2,.78,1.);vec3 color=bg;color+=violet*core*.9*uIntensity;color+=pink*ring*.75*uIntensity;color+=mix(violet,cyan,.5+.5*sin(t+d*6.))*energy*.09*uIntensity;color+=cyan*mouse*.28;gl_FragColor=vec4(color,1.);}'
const num=(key:string,fallback:number)=>typeof props.params[key]==='number'?Number(props.params[key]):fallback
const compile=(ctx:WebGLRenderingContext,type:number,src:string)=>{const sh=ctx.createShader(type);if(!sh)return null;ctx.shaderSource(sh,src);ctx.compileShader(sh);return ctx.getShaderParameter(sh,ctx.COMPILE_STATUS)?sh:null}
const handlePointer=(e:PointerEvent)=>{if(!(e.currentTarget instanceof HTMLElement)||e.pointerType==='touch')return;const r=e.currentTarget.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width;pointer.y=1-(e.clientY-r.top)/r.height}
const resetPointer=()=>{pointer.x=.5;pointer.y=.5}
onMounted(()=>{
  const shell=shellRef.value,canvas=canvasRef.value;if(!shell||!canvas)return;gl=canvas.getContext('webgl');if(!gl)return
  const vs=compile(gl,gl.VERTEX_SHADER,vertex),fs=compile(gl,gl.FRAGMENT_SHADER,fragment);if(!vs||!fs)return;const program=gl.createProgram();if(!program)return;gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.useProgram(program)
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);const pos=gl.getAttribLocation(program,'aPosition');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0)
  const time=gl.getUniformLocation(program,'uTime'),speed=gl.getUniformLocation(program,'uSpeed'),intensity=gl.getUniformLocation(program,'uIntensity'),scale=gl.getUniformLocation(program,'uScale'),resolution=gl.getUniformLocation(program,'uResolution'),mouse=gl.getUniformLocation(program,'uPointer')
  const resize=()=>{if(!gl)return;const ratio=Math.min(devicePixelRatio||1,1.7);canvas.width=Math.max(1,Math.floor(shell.clientWidth*ratio));canvas.height=Math.max(1,Math.floor(shell.clientHeight*ratio));gl.viewport(0,0,canvas.width,canvas.height)};observer=new ResizeObserver(resize);observer.observe(shell);resize()
  const tick=(now:number)=>{if(!gl)return;gl.uniform1f(time,now*.001);gl.uniform1f(speed,num('speed',.42));gl.uniform1f(intensity,num('intensity',.95));gl.uniform1f(scale,num('scale',1.15));gl.uniform2f(resolution,canvas.width,canvas.height);gl.uniform2f(mouse,pointer.x,pointer.y);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick)
})
onUnmounted(()=>{cancelAnimationFrame(frame);observer?.disconnect();gl=null})
</script>
