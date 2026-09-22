<template>
  <div ref="shellRef" class="relative h-full min-h-64 overflow-hidden bg-[#070714]" @pointermove="handlePointer" @pointerleave="resetPointer">
    <canvas ref="canvasRef" class="absolute inset-0 h-full w-full" aria-hidden="true"></canvas>
    <div class="pointer-events-none absolute left-5 top-5">
      <p class="text-[9px] font-bold tracking-[.2em] text-violet-300/70">DIGITAL PERSONA / SOCIAL</p>
      <p class="mt-2 max-w-[250px] text-2xl font-medium leading-[.95] tracking-[-.045em] text-white">A presence made of signals.</p>
    </div>
    <div class="pointer-events-none absolute bottom-5 right-5 flex gap-2">
      <span v-for="tag in ['IDENTITY','GRAPH','RAYMARCH']" :key="tag" class="rounded-full border border-white/15 bg-white/[.05] px-3 py-1.5 text-[8px] font-bold tracking-[.12em] text-white/55">{{ tag }}</span>
    </div>
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
const fragment='precision highp float;uniform float uTime,uSpeed,uIntensity,uScale;uniform vec2 uResolution,uPointer;varying vec2 vUv;float sdSphere(vec3 p,float r){return length(p)-r;}float map(vec3 p){float t=uTime*uSpeed;p.xy*=mat2(cos(t*.16),-sin(t*.16),sin(t*.16),cos(t*.16));float a=sdSphere(p,0.56);float b=sdSphere(p-vec3(.38,.18,.12),.28);return min(a,b);}void main(){vec2 uv=(vUv*2.-1.);uv.x*=uResolution.x/max(uResolution.y,1.);uv*=uScale;vec2 m=(uPointer*2.-1.)*.22;vec3 ro=vec3(m.x,m.y,2.8),rd=normalize(vec3(uv,-1.8));float t=0.,d=0.;for(int i=0;i<54;i++){vec3 p=ro+rd*t;d=map(p);t+=d*.72;if(abs(d)<.003||t>5.)break;}vec3 bg=vec3(.02,.02,.075);vec3 color=bg;if(t<5.){vec3 p=ro+rd*t;float glow=exp(-3.*length(p));float scan=.5+.5*sin((p.y+uTime*.12)*34.);color=mix(vec3(.25,.18,.78),vec3(.93,.28,.74),scan)*(.55+.45*glow)*uIntensity;}float grid=pow(max(0.,sin(uv.x*22.)*sin(uv.y*22.)),12.)*.07;color+=vec3(.25,.65,1.)*grid;gl_FragColor=vec4(color,1.);}'
const num=(key:string,fallback:number)=>typeof props.params[key]==='number'?Number(props.params[key]):fallback
const compile=(ctx:WebGLRenderingContext,type:number,source:string)=>{const s=ctx.createShader(type);if(!s)return null;ctx.shaderSource(s,source);ctx.compileShader(s);return ctx.getShaderParameter(s,ctx.COMPILE_STATUS)?s:null}
const handlePointer=(e:PointerEvent)=>{if(!(e.currentTarget instanceof HTMLElement)||e.pointerType==='touch')return;const r=e.currentTarget.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width;pointer.y=1-(e.clientY-r.top)/r.height}
const resetPointer=()=>{pointer.x=.5;pointer.y=.5}
onMounted(()=>{const shell=shellRef.value,canvas=canvasRef.value;if(!shell||!canvas)return;gl=canvas.getContext('webgl');if(!gl)return;const vs=compile(gl,gl.VERTEX_SHADER,vertex),fs=compile(gl,gl.FRAGMENT_SHADER,fragment);if(!vs||!fs)return;const p=gl.createProgram();if(!p)return;gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);gl.useProgram(p);const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);const pos=gl.getAttribLocation(p,'aPosition');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);const time=gl.getUniformLocation(p,'uTime'),speed=gl.getUniformLocation(p,'uSpeed'),intensity=gl.getUniformLocation(p,'uIntensity'),scale=gl.getUniformLocation(p,'uScale'),resolution=gl.getUniformLocation(p,'uResolution'),mouse=gl.getUniformLocation(p,'uPointer');const resize=()=>{if(!gl)return;const ratio=Math.min(devicePixelRatio||1,1.7);canvas.width=Math.max(1,Math.floor(shell.clientWidth*ratio));canvas.height=Math.max(1,Math.floor(shell.clientHeight*ratio));gl.viewport(0,0,canvas.width,canvas.height)};observer=new ResizeObserver(resize);observer.observe(shell);resize();const tick=(now:number)=>{if(!gl)return;gl.uniform1f(time,now*.001);gl.uniform1f(speed,num('speed',.36));gl.uniform1f(intensity,num('intensity',.92));gl.uniform1f(scale,num('scale',1.08));gl.uniform2f(resolution,canvas.width,canvas.height);gl.uniform2f(mouse,pointer.x,pointer.y);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick)})
onUnmounted(()=>{cancelAnimationFrame(frame);observer?.disconnect();gl=null})
</script>
