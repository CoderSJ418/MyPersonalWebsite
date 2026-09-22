<template>
  <div class="relative h-full min-h-64 overflow-hidden bg-[#e9eef7]" @pointermove="handlePointer" @pointerleave="resetPointer">
    <div class="absolute -left-16 top-6 h-52 w-52 rounded-full bg-blue-500/35 blur-3xl" :style="glowStyle"></div>
    <div class="absolute right-[-5%] top-[18%] h-44 w-44 rounded-full bg-fuchsia-400/25 blur-3xl"></div>
    <div class="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:34px_34px]"></div>
    <div class="relative flex h-full min-h-64 flex-col justify-between p-5 sm:p-7">
      <div class="flex items-center justify-between"><p class="text-[9px] font-bold tracking-[0.2em] text-slate-600">LIQUID GLASS AGENCY</p><span class="rounded-full border border-white/70 bg-white/35 px-3 py-1 text-[9px] font-semibold text-slate-700 backdrop-blur-xl">AVAILABLE</span></div>
      <div class="grid grid-cols-[1.3fr_.7fr] gap-3">
        <div class="rounded-[2rem] border border-white/80 bg-white/28 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_24px_80px_rgba(37,99,235,.15)] backdrop-blur-2xl" :style="cardStyle">
          <p class="text-[clamp(1.7rem,5vw,4.4rem)] font-medium leading-[0.84] tracking-[-0.065em] text-slate-950">Design with<br>liquid clarity.</p>
          <div class="mt-5 flex gap-2"><span class="rounded-full bg-slate-950 px-3 py-2 text-[9px] font-bold text-white">Start a project</span><span class="rounded-full border border-white bg-white/50 px-3 py-2 text-[9px] font-bold text-slate-700">Show reel</span></div>
        </div>
        <div class="space-y-3">
          <div class="h-[56%] rounded-[1.6rem] border border-white/80 bg-white/35 p-4 shadow-lg backdrop-blur-2xl"><p class="text-[9px] font-bold text-blue-600">01 / REFRACT</p><div class="mt-6 h-12 rounded-full bg-gradient-to-r from-blue-500/40 via-white/70 to-fuchsia-400/30 blur-[1px]"></div></div>
          <div class="rounded-[1.6rem] border border-white/80 bg-slate-950 p-4 text-white shadow-lg"><p class="text-[9px] opacity-50">SELECTED WORK</p><p class="mt-2 text-sm font-semibold">Spatial systems →</p></div>
        </div>
      </div>
    </div>
    <div class="pointer-events-none absolute h-24 w-24 rounded-full border border-white/80 bg-white/10 shadow-[inset_0_0_24px_rgba(255,255,255,.6)] backdrop-blur-md" :style="lensStyle"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { LabParams } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'

const props=defineProps<{scene:MotionSceneRuntime;params:LabParams}>()
const pointer=ref({x:.72,y:.28})
const num=(key:string,fallback:number)=>typeof props.params[key]==='number'?Number(props.params[key]):fallback
const handlePointer=(e:PointerEvent)=>{if(!(e.currentTarget instanceof HTMLElement)||e.pointerType==='touch')return;const r=e.currentTarget.getBoundingClientRect();pointer.value={x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height}}
const resetPointer=()=>{pointer.value={x:.72,y:.28}}
const lensStyle=computed(()=>({left:`calc(${pointer.value.x*100}% - 3rem)`,top:`calc(${pointer.value.y*100}% - 3rem)`,transform:`scale(${.8+num('intensity',.92)*.18})`}))
const glowStyle=computed(()=>({transform:`translate3d(${pointer.value.x*22}px,${pointer.value.y*18}px,0) scale(${1+num('depth',.55)*.08})`}))
const cardStyle=computed(()=>({transform:`perspective(900px) rotateX(${(pointer.value.y-.5)*-3*num('intensity',.92)}deg) rotateY(${(pointer.value.x-.5)*4*num('depth',.55)}deg)`}))
</script>
