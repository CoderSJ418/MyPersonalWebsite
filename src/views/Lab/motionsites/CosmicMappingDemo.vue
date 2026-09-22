<template>
  <div ref="shellRef" class="relative h-full min-h-64 overflow-hidden bg-[#030616]" @pointermove="handlePointer" @pointerleave="resetPointer">
    <canvas ref="canvasRef" class="absolute inset-0 h-full w-full" aria-hidden="true"></canvas>
    <div class="pointer-events-none absolute left-5 top-5"><p class="text-[9px] font-bold tracking-[.2em] text-indigo-200/65">COSMIC MAPPING / AI</p><p class="mt-2 text-2xl font-medium tracking-[-.045em] text-white">Reveal the system.</p></div>
    <div class="pointer-events-none absolute bottom-5 left-5 flex gap-2"><span v-for="tag in ['MASK','MAP','REVEAL']" :key="tag" class="rounded-full border border-white/15 bg-white/[.05] px-3 py-1.5 text-[8px] font-bold tracking-[.12em] text-white/55">{{ tag }}</span></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted,onUnmounted,ref } from 'vue'
import type { LabParams } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'

const props=defineProps<{scene:MotionSceneRuntime;params:LabParams}>()
const shellRef=ref<HTMLElement|null>(null),canvasRef=ref<HTMLCanvasElement|null>(null),pointer={x:.62,y:.48}
let gl:WebGLRenderingContext|null=null,observer:ResizeObserver|null=null,frame=0
const vertex='attribute vec2 aPosition;varying vec2 vUv;void main(){vUv=aPosition*.5+.5;gl_Position=vec4(aPosition,0.,1.);}'
const fragment='precision highp float;uniform float uTime,uSpeed,uIntensity,uScale;uniform vec2 uResolution,uPointer;varying vec2 vUv;float hash(vec2 p){return fract(sin(dot(p,vec2(41.,289.)))*43758.5453);}void main(){vec2 p=vUv*2.-1.;p.x*=uResolution.x/max(uResolution.y,1.);p*=uScale;float t=uTime*uSpeed;vec2 m=(uPointer*2.-1.);m.x*=uResolution.x/max(uResolution.y,1.);float d=length(p-m);float mask=1.-smoothstep(.18,.68,d);float stars=step(.987,hash(floor((p+2.)*110.)));float grid=(smoothstep(.97,1.,abs(sin(p.x*12.)))+smoothstep(.97,1.,abs(sin(p.y*12.))))*.11;float rings=pow(.5+.5*cos(length(p)*28.-t*1.4),12.)*.18;vec3 base=vec3(.012,.02,.07)+vec3(.08,.08,.2)*stars;vec3 map=vec3(.08,.32,.8)*grid+vec3(.48,.28,.95)*rings;float node=exp(-22.*length(p-vec2(.18*sin(t*.3),.13*cos(t*.24))));map+=vec3(.3,.85,1.)*node;vec3 color=mix(base,base+map*uIntensity,mask);color+=vec3(.18,.38,1.)*(1.-smoothstep(.01,.025,abs(d-.68)))*.55;gl_FragColor=vec4(color,1.);}'
const num=(k:string,f:number)=>typeof props.params[k]==='number'?Number(props.params[k]):f
const compile=(ctx:WebGLRenderingContext,type:number,src:string)=>{const s=ctx.createShader(type);if(!s)return null;ctx.shaderSource(s,src);ctx.compileShader(s);return ctx.getShaderParameter(s,ctx.COMPILE_STATUS)?s:null}
const handlePointer=(e:PointerEvent)=>{if(!(e.currentTarget instanceof HTMLElement)||e.pointerType==='touch')return;const r=e.currentTarget.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width;pointer.y=1-(e.clientY-r.top)/r.height}
const resetPointer=()=>{pointer.x=.62;pointer.y=.48}
onMounted(()=>{const shell=shellRef.value,canvas=canvasRef.value;if(!shell||!canvas)return;gl=canvas.getContext('webgl');if(!gl)return;const vs=compile(gl,gl.VERTEX_SHADER,vertex),fs=compile(gl,gl.FRAGMENT_SHADER,fragment);if(!vs||!fs)return;const p=gl.createProgram();if(!p)return;gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);gl.useProgram(p);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);const pos=gl.getAttribLocation(p,'aPosition');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);const time=gl.getUniformLocation(p,'uTime'),speed=gl.getUniformLocation(p,'uSpeed'),intensity=gl.getUniformLocation(p,'uIntensity'),scale=gl.getUniformLocation(p,'uScale'),res=gl.getUniformLocation(p,'uResolution'),mouse=gl.getUniformLocation(p,'uPointer');const resize=()=>{if(!gl)return;const ratio=Math.min(devicePixelRatio||1,1.7);canvas.width=Math.max(1,Math.floor(shell.clientWidth*ratio));canvas.height=Math.max(1,Math.floor(shell.clientHeight*ratio));gl.viewport(0,0,canvas.width,canvas.height)};observer=new ResizeObserver(resize);observer.observe(shell);resize();const tick=(now:number)=>{if(!gl)return;gl.uniform1f(time,now*.001);gl.uniform1f(speed,num('speed',.34));gl.uniform1f(intensity,num('intensity',.9));gl.uniform1f(scale,num('scale',1.05));gl.uniform2f(res,canvas.width,canvas.height);gl.uniform2f(mouse,pointer.x,pointer.y);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick)})
onUnmounted(()=>{cancelAnimationFrame(frame);observer?.disconnect();gl=null})
</script>
