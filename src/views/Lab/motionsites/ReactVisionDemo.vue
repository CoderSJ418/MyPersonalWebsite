<template>
  <div ref="shellRef" class="relative h-full min-h-64 overflow-hidden bg-[#f5f9ff]" @pointermove="handlePointer" @pointerleave="resetPointer">
    <canvas ref="canvasRef" class="absolute inset-0 h-full w-full" aria-hidden="true"></canvas>
    <div class="pointer-events-none absolute left-5 top-5 max-w-[55%]">
      <p class="text-[9px] font-bold tracking-[0.18em] text-blue-600">REACT VISION / TECHNOLOGY</p>
      <h3 class="mt-3 text-[clamp(1.6rem,4vw,3.8rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-slate-950">Interfaces that react before you ask.</h3>
    </div>
    <div class="pointer-events-none absolute bottom-5 right-5 flex gap-2">
      <span v-for="item in ['SIGNAL','STATE','SYNC']" :key="item" class="rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-[8px] font-bold tracking-[0.14em] text-blue-600">{{ item }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type { LabParams } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'

const props=defineProps<{scene:MotionSceneRuntime;params:LabParams}>()
const shellRef=ref<HTMLElement|null>(null),canvasRef=ref<HTMLCanvasElement|null>(null)
const pointer={x:.72,y:.56};let observer:ResizeObserver|null=null,frame=0
const num=(key:string,fallback:number)=>typeof props.params[key]==='number'?Number(props.params[key]):fallback
const handlePointer=(event:PointerEvent)=>{if(!(event.currentTarget instanceof HTMLElement)||event.pointerType==='touch')return;const r=event.currentTarget.getBoundingClientRect();pointer.x=(event.clientX-r.left)/r.width;pointer.y=(event.clientY-r.top)/r.height}
const resetPointer=()=>{pointer.x=.72;pointer.y=.56}

onMounted(()=>{
  const shell=shellRef.value,canvas=canvasRef.value;if(!shell||!canvas)return;const ctx=canvas.getContext('2d');if(!ctx)return
  const resize=()=>{const ratio=Math.min(devicePixelRatio||1,1.7);canvas.width=Math.max(1,Math.floor(shell.clientWidth*ratio));canvas.height=Math.max(1,Math.floor(shell.clientHeight*ratio));canvas.style.width=`${shell.clientWidth}px`;canvas.style.height=`${shell.clientHeight}px`;ctx.setTransform(ratio,0,0,ratio,0,0)}
  observer=new ResizeObserver(resize);observer.observe(shell);resize()
  const tick=(time:number)=>{
    const w=shell.clientWidth,h=shell.clientHeight,density=Math.max(20,Math.round(num('density',48))),speed=num('speed',.5),strength=num('pointerStrength',.5)
    ctx.fillStyle='#f5f9ff';ctx.fillRect(0,0,w,h)
    ctx.lineWidth=1;ctx.strokeStyle='rgba(37,99,235,.09)'
    for(let x=0;x<w;x+=34){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}
    for(let y=0;y<h;y+=34){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
    const cx=pointer.x*w,cy=pointer.y*h
    for(let i=0;i<density;i++){
      const angle=i/density*Math.PI*2+time*.00015*speed
      const ring=54+(i%7)*23
      const x=cx+Math.cos(angle*(1+(i%3)*.12))*ring
      const y=cy+Math.sin(angle)*ring*.58
      ctx.beginPath();ctx.strokeStyle='rgba(59,130,246,.18)';ctx.moveTo(cx,cy);ctx.lineTo(x,y);ctx.stroke()
      ctx.beginPath();ctx.fillStyle=i%8===0?'rgba(37,99,235,.95)':'rgba(56,189,248,.55)';ctx.arc(x,y,1.2+(i%5===0?2.3:0),0,Math.PI*2);ctx.fill()
    }
    const pulse=22+Math.sin(time*.002*speed)*10*strength
    ctx.beginPath();ctx.strokeStyle='rgba(37,99,235,.45)';ctx.lineWidth=1.5;ctx.arc(cx,cy,pulse,0,Math.PI*2);ctx.stroke()
    ctx.beginPath();ctx.fillStyle='#2563eb';ctx.arc(cx,cy,5,0,Math.PI*2);ctx.fill()
    frame=requestAnimationFrame(tick)
  }
  frame=requestAnimationFrame(tick)
})
onUnmounted(()=>{cancelAnimationFrame(frame);observer?.disconnect()})
</script>
