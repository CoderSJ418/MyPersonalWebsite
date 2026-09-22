<template>
  <div ref="shellRef" class="relative h-full min-h-64 overflow-hidden bg-[#02030a]" @pointermove="handlePointer" @pointerleave="resetPointer">
    <canvas ref="canvasRef" class="absolute inset-0 h-full w-full" aria-hidden="true"></canvas>
    <div class="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-5 text-[9px] font-semibold tracking-[0.18em] text-white/45">
      <span>PARTICLE FIELD</span><span>WEBGL PORTFOLIO / INTERACTIVE</span>
    </div>
    <div class="pointer-events-none absolute bottom-5 left-5">
      <p class="text-[clamp(1.7rem,5vw,4.6rem)] font-medium leading-[0.84] tracking-[-0.06em] text-white">Ideas become<br>constellations.</p>
      <p class="mt-3 text-[9px] uppercase tracking-[0.2em] text-fuchsia-200/70">Move pointer through the field</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type { LabParams } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'

interface Particle { x:number; y:number; px:number; py:number; vx:number; vy:number; seed:number }
const props=defineProps<{scene:MotionSceneRuntime;params:LabParams}>()
const shellRef=ref<HTMLElement|null>(null),canvasRef=ref<HTMLCanvasElement|null>(null)
const pointer={x:0,y:0,active:false};let observer:ResizeObserver|null=null,frame=0,particles:Particle[]=[]
const num=(key:string,fallback:number)=>typeof props.params[key]==='number'?Number(props.params[key]):fallback
const handlePointer=(event:PointerEvent)=>{if(!(event.currentTarget instanceof HTMLElement)||event.pointerType==='touch')return;const r=event.currentTarget.getBoundingClientRect();pointer.x=event.clientX-r.left;pointer.y=event.clientY-r.top;pointer.active=true}
const resetPointer=()=>{pointer.active=false}

onMounted(()=>{
  const shell=shellRef.value,canvas=canvasRef.value;if(!shell||!canvas)return
  const ctx=canvas.getContext('2d');if(!ctx)return
  const rebuild=()=>{const ratio=Math.min(devicePixelRatio||1,1.7);canvas.width=Math.max(1,Math.floor(shell.clientWidth*ratio));canvas.height=Math.max(1,Math.floor(shell.clientHeight*ratio));canvas.style.width=`${shell.clientWidth}px`;canvas.style.height=`${shell.clientHeight}px`;ctx.setTransform(ratio,0,0,ratio,0,0);const count=Math.round(num('density',82));particles=Array.from({length:count},(_,i)=>({x:Math.random()*shell.clientWidth,y:Math.random()*shell.clientHeight,px:0,py:0,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18,seed:i*.73}))}
  observer=new ResizeObserver(rebuild);observer.observe(shell);rebuild()
  const tick=(time:number)=>{
    const w=shell.clientWidth,h=shell.clientHeight,speed=num('speed',.62),strength=num('pointerStrength',.78)
    ctx.fillStyle='rgba(2,3,10,.22)';ctx.fillRect(0,0,w,h)
    particles.forEach((p,i)=>{
      p.px=p.x;p.py=p.y;p.vx+=Math.cos(time*.00035+p.seed)*.004*speed;p.vy+=Math.sin(time*.00029+p.seed)*.004*speed
      if(pointer.active){const dx=pointer.x-p.x,dy=pointer.y-p.y,d=Math.max(36,Math.hypot(dx,dy));if(d<180){p.vx-=dx/d*.045*strength;p.vy-=dy/d*.045*strength}}
      p.vx*=.985;p.vy*=.985;p.x+=p.vx*speed*2.4;p.y+=p.vy*speed*2.4
      if(p.x<0)p.x=w;if(p.x>w)p.x=0;if(p.y<0)p.y=h;if(p.y>h)p.y=0
      ctx.beginPath();ctx.strokeStyle=i%5===0?'rgba(244,114,182,.5)':'rgba(129,140,248,.28)';ctx.lineWidth=.8;ctx.moveTo(p.px,p.py);ctx.lineTo(p.x,p.y);ctx.stroke()
      ctx.beginPath();ctx.fillStyle=i%7===0?'rgba(255,255,255,.95)':'rgba(196,181,253,.68)';ctx.arc(p.x,p.y,i%7===0?1.8:1.05,0,Math.PI*2);ctx.fill()
    })
    frame=requestAnimationFrame(tick)
  }
  ctx.fillStyle='#02030a';ctx.fillRect(0,0,shell.clientWidth,shell.clientHeight);frame=requestAnimationFrame(tick)
})
onUnmounted(()=>{cancelAnimationFrame(frame);observer?.disconnect()})
</script>
