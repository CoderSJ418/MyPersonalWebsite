<template>
  <div ref="shellRef" class="relative h-full min-h-64 overflow-hidden bg-[#f3fbf7]">
    <canvas ref="canvasRef" class="absolute inset-0 h-full w-full" aria-hidden="true"></canvas>
    <div class="relative flex h-full min-h-64 flex-col justify-between p-5">
      <div class="flex items-start justify-between"><div><p class="text-[9px] font-bold tracking-[.18em] text-emerald-700">BIONOVA BIOTECH</p><p class="mt-2 text-2xl font-semibold tracking-[-.045em] text-slate-950">Living systems,<br>measurable outcomes.</p></div><span class="rounded-full border border-emerald-200 bg-white/70 px-3 py-1.5 text-[8px] font-bold text-emerald-700 backdrop-blur">BIO SIGNAL 98.4</span></div>
      <div class="grid grid-cols-3 gap-2">
        <div v-for="(item,index) in cards" :key="item.label" class="rounded-xl border border-emerald-100 bg-white/80 p-3 shadow-sm backdrop-blur">
          <div class="flex items-center justify-between"><p class="text-[8px] font-semibold text-slate-500">{{ item.label }}</p><span class="h-2 w-2 rounded-full" :class="index===1?'bg-amber-400':'bg-emerald-400'"></span></div>
          <p class="mt-2 text-xl font-semibold text-slate-950">{{ item.value }}</p>
          <svg viewBox="0 0 80 18" class="mt-2 h-4 w-full"><polyline :points="item.points" fill="none" stroke="#059669" stroke-width="1.6"/></svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted,onUnmounted,ref } from 'vue'
import type { LabParams } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'

const props=defineProps<{scene:MotionSceneRuntime;params:LabParams}>()
const shellRef=ref<HTMLElement|null>(null),canvasRef=ref<HTMLCanvasElement|null>(null)
const cards=[{label:'CELL VIABILITY',value:'96.8%',points:'0,14 12,10 24,12 36,6 48,8 60,4 80,5'},{label:'GROWTH RATE',value:'+18%',points:'0,15 12,13 24,11 36,9 48,8 60,5 80,3'},{label:'SIGNAL',value:'0.82',points:'0,10 12,8 24,9 36,6 48,7 60,5 80,4'}]
let observer:ResizeObserver|null=null,frame=0
const num=(key:string,fallback:number)=>typeof props.params[key]==='number'?Number(props.params[key]):fallback
onMounted(()=>{const shell=shellRef.value,canvas=canvasRef.value;if(!shell||!canvas)return;const ctx=canvas.getContext('2d');if(!ctx)return;const resize=()=>{const ratio=Math.min(devicePixelRatio||1,1.7);canvas.width=Math.max(1,Math.floor(shell.clientWidth*ratio));canvas.height=Math.max(1,Math.floor(shell.clientHeight*ratio));canvas.style.width=`${shell.clientWidth}px`;canvas.style.height=`${shell.clientHeight}px`;ctx.setTransform(ratio,0,0,ratio,0,0)};observer=new ResizeObserver(resize);observer.observe(shell);resize();const tick=(time:number)=>{const w=shell.clientWidth,h=shell.clientHeight,density=Math.round(num('density',48)),speed=num('speed',.48),strength=num('pointerStrength',.45);ctx.clearRect(0,0,w,h);const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,'#effcf5');g.addColorStop(1,'#e0f2fe');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);for(let i=0;i<density;i++){const a=i/density*Math.PI*2+time*.00008*speed;const radius=40+(i%9)*14;const cx=w*.72+Math.cos(a)*radius,cy=h*.45+Math.sin(a*1.2)*radius*.55;ctx.beginPath();ctx.fillStyle=i%6===0?'rgba(5,150,105,.16)':'rgba(59,130,246,.08)';ctx.arc(cx,cy,6+(i%4)*2*strength,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(5,150,105,.13)';ctx.lineWidth=1;ctx.stroke()}frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick)})
onUnmounted(()=>{cancelAnimationFrame(frame);observer?.disconnect()})
</script>
