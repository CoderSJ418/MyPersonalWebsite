<template>
  <div
    class="relative h-full min-h-64 touch-none overflow-hidden bg-[#f2f0e8] select-none"
    @pointerdown="startDrag"
    @pointermove="moveDrag"
    @pointerup="endDrag"
    @pointercancel="endDrag"
  >
    <div class="absolute inset-0 grid place-items-center">
      <div class="grid h-28 w-28 place-items-center rounded-full border border-black/10 bg-[#ff5c35] text-center text-xs font-black uppercase tracking-[0.12em] text-white shadow-2xl">
        ORBIT<br>STICKERS
      </div>
    </div>
    <div
      v-for="(sticker,index) in stickers"
      :key="sticker.text"
      class="absolute left-1/2 top-1/2 grid h-16 w-24 place-items-center rounded-2xl border-2 border-black bg-white text-[10px] font-black uppercase tracking-[0.08em] text-slate-950 shadow-[5px_5px_0_#111]"
      :class="sticker.className"
      :style="stickerStyle(index)"
    >
      {{ sticker.text }}
    </div>
    <div class="pointer-events-none absolute left-5 top-5"><p class="text-[9px] font-bold tracking-[0.18em] text-slate-500">MOTIONSITES / INTERACTIVE</p><p class="mt-1 text-xs font-semibold text-slate-900">Drag anywhere to rotate the orbit.</p></div>
    <span class="pointer-events-none absolute bottom-4 right-4 rounded-full bg-black px-3 py-1.5 text-[9px] font-bold text-white">DRAG</span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type { CSSProperties } from 'vue'
import type { LabParams } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'

const props=defineProps<{scene:MotionSceneRuntime;params:LabParams}>()
const phase=ref(0),dragging=ref(false),lastX=ref(0),reduced=ref(false)
let frame=0,lastTime=0
const stickers=[{text:'Vue',className:'bg-[#b7f7d7]'},{text:'Three.js',className:'bg-[#dbeafe]'},{text:'GSAP',className:'bg-[#d9f99d]'},{text:'WebGL',className:'bg-[#fbcfe8]'},{text:'Motion',className:'bg-[#fde68a]'},{text:'AI Native',className:'bg-white'}]
const num=(key:string,fallback:number)=>typeof props.params[key]==='number'?Number(props.params[key]):fallback
const stickerStyle=(index:number):CSSProperties=>{const angle=phase.value+index/stickers.length*Math.PI*2;const depth=num('depth',.8);const rx=122+depth*38,ry=68+depth*24;const scale=.78+(Math.sin(angle)+1)*.12;return{transform:`translate(calc(-50% + ${Math.cos(angle)*rx}px), calc(-50% + ${Math.sin(angle)*ry}px)) rotate(${Math.sin(angle)*10}deg) scale(${scale})`,zIndex:String(Math.round(scale*10))}}
const startDrag=(e:PointerEvent)=>{if(e.pointerType==='touch'||e.pointerType==='mouse'){dragging.value=true;lastX.value=e.clientX;(e.currentTarget as HTMLElement)?.setPointerCapture?.(e.pointerId)}}
const moveDrag=(e:PointerEvent)=>{if(!dragging.value)return;const dx=e.clientX-lastX.value;lastX.value=e.clientX;phase.value+=dx*.008*num('intensity',.88)}
const endDrag=()=>{dragging.value=false}
onMounted(()=>{reduced.value=matchMedia('(prefers-reduced-motion: reduce)').matches;const tick=(time:number)=>{const dt=Math.min(32,time-lastTime||16);lastTime=time;if(!dragging.value&&!reduced.value)phase.value+=dt*.00022*num('speed',.48);frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick)})
onUnmounted(()=>cancelAnimationFrame(frame))
</script>
