<template>
  <div ref="shellRef" class="relative h-full min-h-64 overflow-hidden bg-[#f4f7fb]">
    <canvas ref="canvasRef" class="absolute inset-0 h-full w-full" aria-hidden="true"></canvas>
    <div class="relative grid h-full min-h-64 grid-cols-[1.3fr_.7fr] gap-3 p-4 sm:p-5">
      <div class="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
        <div class="flex items-center justify-between"><div><p class="text-[9px] font-bold tracking-[.18em] text-blue-600">AXLE JOURNEY</p><p class="mt-1 text-xs font-semibold text-slate-800">Live operations</p></div><span class="rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-bold text-emerald-700">ONLINE</span></div>
        <div class="grid grid-cols-3 gap-2">
          <div v-for="metric in metrics" :key="metric.label" class="rounded-xl border border-slate-200 bg-white p-2"><p class="text-[8px] text-slate-400">{{ metric.label }}</p><p class="mt-1 text-lg font-semibold text-slate-900">{{ metric.value }}</p></div>
        </div>
      </div>
      <div class="space-y-3">
        <div class="rounded-2xl bg-slate-950 p-4 text-white shadow-lg"><p class="text-[9px] font-bold tracking-[.14em] text-white/45">ACTIVE TASK</p><p class="mt-3 text-2xl font-semibold">Field 07</p><div class="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"><div class="h-full bg-blue-400 transition-[width] duration-300" :style="{width:`${progress}%`}"></div></div><p class="mt-2 text-[9px] text-white/45">{{ progress }}% complete</p></div>
        <div class="rounded-2xl border border-blue-100 bg-blue-50 p-4"><p class="text-[9px] font-bold text-blue-600">NETWORK</p><p class="mt-2 text-xl font-semibold text-slate-950">42 ms</p><p class="mt-1 text-[8px] text-slate-500">stable telemetry</p></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted,onUnmounted,ref } from 'vue'
import type { LabParams } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'

const props=defineProps<{scene:MotionSceneRuntime;params:LabParams}>()
const shellRef=ref<HTMLElement|null>(null),canvasRef=ref<HTMLCanvasElement|null>(null),progress=ref(68)
const metrics=[{label:'Speed',value:'7.4'},{label:'Depth',value:'18cm'},{label:'Area',value:'12.8ha'}]
let observer:ResizeObserver|null=null,frame=0,start=0
const num=(key:string,fallback:number)=>typeof props.params[key]==='number'?Number(props.params[key]):fallback
onMounted(()=>{const shell=shellRef.value,canvas=canvasRef.value;if(!shell||!canvas)return;const ctx=canvas.getContext('2d');if(!ctx)return;const resize=()=>{const ratio=Math.min(devicePixelRatio||1,1.7);canvas.width=Math.max(1,Math.floor(shell.clientWidth*ratio));canvas.height=Math.max(1,Math.floor(shell.clientHeight*ratio));canvas.style.width=`${shell.clientWidth}px`;canvas.style.height=`${shell.clientHeight}px`;ctx.setTransform(ratio,0,0,ratio,0,0)};observer=new ResizeObserver(resize);observer.observe(shell);resize();const tick=(time:number)=>{if(!start)start=time;const w=shell.clientWidth,h=shell.clientHeight,speed=num('speed',.55),strength=num('pointerStrength',.3);ctx.clearRect(0,0,w,h);ctx.fillStyle='#e8eef7';ctx.fillRect(0,0,w,h);ctx.strokeStyle='rgba(37,99,235,.08)';ctx.lineWidth=1;for(let x=0;x<w;x+=32){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}for(let y=0;y<h;y+=32){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}const path=[[.08,.78],[.18,.62],[.28,.66],[.38,.46],[.49,.52],[.59,.34],[.69,.42],[.82,.24]].map(([x,y])=>[x*w,y*h]);ctx.beginPath();path.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.strokeStyle='rgba(37,99,235,.22)';ctx.lineWidth=8;ctx.lineCap='round';ctx.stroke();ctx.strokeStyle='#2563eb';ctx.lineWidth=2;ctx.setLineDash([8,10]);ctx.lineDashOffset=-time*.02*speed;ctx.stroke();ctx.setLineDash([]);path.forEach((p,i)=>{ctx.beginPath();ctx.fillStyle=i===path.length-1?'#2563eb':'#fff';ctx.strokeStyle='#2563eb';ctx.lineWidth=2;ctx.arc(p[0],p[1],i===path.length-1?6:4,0,Math.PI*2);ctx.fill();ctx.stroke()});const elapsed=(time-start)*.001*speed;progress.value=Math.round(62+Math.sin(elapsed)*4+strength*4);frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick)})
onUnmounted(()=>{cancelAnimationFrame(frame);observer?.disconnect()})
</script>
