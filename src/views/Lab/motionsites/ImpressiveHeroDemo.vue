<template>
  <div class="relative h-full min-h-64 overflow-hidden bg-[#f3f0ea]" @pointermove="handlePointer" @pointerleave="resetPointer">
    <div class="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(15,23,42,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,.08)_1px,transparent_1px)] [background-size:42px_42px]"></div>
    <div class="relative flex h-full min-h-64 flex-col justify-between p-5 sm:p-7">
      <div class="flex items-center justify-between text-[9px] font-bold tracking-[0.18em] text-slate-500">
        <span>IMPRESSIVE HERO</span><span>EDITORIAL / MOTION</span>
      </div>
      <div class="relative">
        <p class="text-[clamp(3.3rem,10vw,8rem)] font-black leading-[0.72] tracking-[-0.085em] text-slate-950">
          MAKE<br>IMPACT
        </p>
        <div class="absolute left-[48%] top-[12%] h-28 w-28 rounded-full border-[12px] border-blue-600 bg-[#ff5b3d] shadow-2xl transition-transform duration-300 sm:h-36 sm:w-36" :style="anchorStyle">
          <span class="absolute inset-0 grid place-items-center text-[9px] font-black tracking-[0.14em] text-white">MOVE</span>
        </div>
      </div>
      <div class="flex items-end justify-between gap-4">
        <p class="max-w-xs text-xs leading-5 text-slate-600">Oversized editorial type with one unmistakable moving visual anchor.</p>
        <div class="flex gap-2"><span v-for="tag in ['TYPE','ANCHOR','DEPTH']" :key="tag" class="rounded-full border border-slate-300 bg-white/70 px-3 py-1.5 text-[8px] font-bold text-slate-700">{{ tag }}</span></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { LabParams } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'

const props=defineProps<{scene:MotionSceneRuntime;params:LabParams}>()
const pointer=ref({x:0,y:0})
const num=(key:string,fallback:number)=>typeof props.params[key]==='number'?Number(props.params[key]):fallback
const handlePointer=(e:PointerEvent)=>{if(!(e.currentTarget instanceof HTMLElement)||e.pointerType==='touch')return;const r=e.currentTarget.getBoundingClientRect();pointer.value={x:((e.clientX-r.left)/r.width-.5)*2,y:((e.clientY-r.top)/r.height-.5)*2}}
const resetPointer=()=>{pointer.value={x:0,y:0}}
const anchorStyle=computed(()=>({transform:`translate3d(${pointer.value.x*20*num('intensity',.8)}px,${pointer.value.y*14*num('depth',.6)}px,0) rotate(${pointer.value.x*7}deg) scale(${.9+num('intensity',.8)*.08})`}))
</script>
