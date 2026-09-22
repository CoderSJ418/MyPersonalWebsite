<template>
  <div ref="shellRef" class="relative h-full min-h-64 overflow-hidden bg-[#03101d]" @pointermove="handlePointer" @pointerleave="resetPointer">
    <canvas ref="canvasRef" class="absolute inset-0 h-full w-full" aria-hidden="true"></canvas>
    <div class="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-5 text-[9px] font-bold tracking-[.18em] text-cyan-100/55"><span>FROZEN CAVE / TRAVEL</span><span>ENTER / EXPLORE</span></div>
    <div class="pointer-events-none absolute bottom-5 left-5"><p class="text-[clamp(1.8rem,5vw,4.6rem)] font-medium leading-[.84] tracking-[-.06em] text-white">Follow the<br>ice signal.</p><p class="mt-3 text-[9px] tracking-[.14em] text-cyan-100/60">DEPTH FIELD / POINTER LIGHT</p></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted,onUnmounted,ref } from 'vue'
import type { LabParams } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'

const props=defineProps<{scene:MotionSceneRuntime;params:LabParams}>()
const shellRef=ref<HTMLElement|null>(null),canvasRef=ref<HTMLCanvasElement|null>(null),pointer={x:.5,y:.5}
let gl:WebGLRenderingContext|null=null,observer:ResizeObserver|null=null,frame=0
const vertex='attribute vec2 aPosition;varying vec2 vUv;void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}'
const fragment='precision highp float;uniform float uTime,uSpeed,uIntensity,uScale;uniform vec2 uResolution,uPointer;varying vec2 vUv;float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}void main(){vec2 p=vUv*2.-1.;p.x*=uResolution.x/max(uResolution.y,1.);p*=uScale;float t=uTime*uSpeed;float a=atan(p.y,p.x);float r=length(p);float ridges=.5+.5*sin(a*9.+sin(a*3.-t*.3)*2.+r*18.-t);float cave=smoothstep(.88,.18,r)*(1.-smoothstep(.44,.08,r));float ice=pow(ridges,6.)*cave;float depth=exp(-4.*abs(r-(.48+.05*sin(a*5.+t*.35))));vec2 m=(uPointer*2.-1.);m.x*=uResolution.x/max(uResolution.y,1.);float lamp=exp(-5.*length(p-m));vec3 color=vec3(.008,.035,.075);color+=vec3(.08,.42,.72)*ice*uIntensity;color+=vec3(.35,.82,1.)*depth*.38*uIntensity;color+=vec3(.65,.95,1.)*lamp*.28;float dust=step(.992,hash(floor((p+vec2(t*.02,0.))*90.)));color+=dust*.35;gl_FragColor=vec4(color,1.);}'
const num=(k:string,f:number)=>typeof props.params[k]==='number'?Number(props.params[k]):f
const compile=(ctx:WebGLRenderingContext,type:number,src:string)=>{const s=ctx.createShader(type);if(!s)return null;ctx.shaderSource(s,src);ctx.compileShader(s);return ctx.getShaderParameter(s,ctx.COMPILE_STATUS)?s:null}
const handlePointer=(e:PointerEvent)=>{if(!(e.currentTarget instanceof HTMLElement)||e.pointerType==='touch')return;const r=e.currentTarget.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width;pointer.y=1-(e.clientY-r.top)/r.height}
const resetPointer=()=>{pointer.x=.5;pointer.y=.5}
onMounted(()=>{const shell=shellRef.value,canvas=canvasRef.value;if(!shell||!canvas)return;gl=canvas.getContext('webgl');if(!gl)return;const vs=compile(gl,gl.VERTEX_SHADER,vertex),fs=compile(gl,gl.FRAGMENT_SHADER,fragment);if(!vs||!fs)return;const p=gl.createProgram();if(!p)return;gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);gl.useProgram(p);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);const pos=gl.getAttribLocation(p,'aPosition');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);const time=gl.getUniformLocation(p,'uTime'),speed=gl.getUniformLocation(p,'uSpeed'),intensity=gl.getUniformLocation(p,'uIntensity'),scale=gl.getUniformLocation(p,'uScale'),res=gl.getUniformLocation(p,'uResolution'),mouse=gl.getUniformLocation(p,'uPointer');const resize=()=>{if(!gl)return;const ratio=Math.min(devicePixelRatio||1,1.7);canvas.width=Math.max(1,Math.floor(shell.clientWidth*ratio));canvas.height=Math.max(1,Math.floor(shell.clientHeight*ratio));gl.viewport(0,0,canvas.width,canvas.height)};observer=new ResizeObserver(resize);observer.observe(shell);resize();const tick=(now:number)=>{if(!gl)return;gl.uniform1f(time,now*.001);gl.uniform1f(speed,num('speed',.35));gl.uniform1f(intensity,num('intensity',.9));gl.uniform1f(scale,num('scale',1.05));gl.uniform2f(res,canvas.width,canvas.height);gl.uniform2f(mouse,pointer.x,pointer.y);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick)})
onUnmounted(()=>{cancelAnimationFrame(frame);observer?.disconnect();gl=null})
</script>
