<template>
  <div class="relative h-full min-h-64 overflow-hidden bg-[#e8dfcc]" @pointermove="handlePointer" @pointerleave="resetPointer">
    <div class="absolute inset-0 opacity-30 [background-image:radial-gradient(#6b5a3f_0.7px,transparent_0.7px)] [background-size:7px_7px]"></div>
    <div class="relative flex h-full min-h-64 flex-col justify-between p-5 sm:p-7">
      <div class="flex items-center justify-between text-[9px] font-bold tracking-[.18em] text-stone-600">
        <span>ANCIENT OATH / CREATIVE</span><span>FORM / LENS / STORY</span>
      </div>
      <div class="grid grid-cols-[1fr_.9fr] items-center gap-4">
        <div>
          <p class="font-serif text-[clamp(2.5rem,7vw,6rem)] leading-[.82] tracking-[-.055em] text-stone-950">The form<br>remembers.</p>
          <p class="mt-4 max-w-xs text-xs leading-5 text-stone-600">A parchment composition where one visual mass changes shape instead of fading between sections.</p>
        </div>
        <div class="relative mx-auto h-40 w-40 sm:h-52 sm:w-52">
          <div class="absolute inset-0 border-2 border-stone-900/70 bg-[#b4532d] shadow-[10px_12px_0_rgba(70,55,35,.16)] transition-[clip-path,transform] duration-300" :style="shapeStyle"></div>
          <div class="absolute h-24 w-24 rounded-full border border-white/80 bg-white/20 shadow-[inset_0_0_30px_rgba(255,255,255,.55),0_12px_40px_rgba(60,45,30,.18)] backdrop-blur-sm" :style="lensStyle"></div>
        </div>
      </div>
      <div class="flex gap-2"><span v-for="tag in ['MORPH','PARCHMENT','MAGNIFY']" :key="tag" class="rounded-full border border-stone-500/30 bg-white/30 px-3 py-1.5 text-[8px] font-bold text-stone-700">{{ tag }}</span></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed,ref } from 'vue'
import type { LabParams } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'

const props=defineProps<{scene:MotionSceneRuntime;params:LabParams}>()
const pointer=ref({x:.62,y:.42})
const num=(key:string,fallback:number)=>typeof props.params[key]==='number'?Number(props.params[key]):fallback
const handlePointer=(e:PointerEvent)=>{if(!(e.currentTarget instanceof HTMLElement)||e.pointerType==='touch')return;const r=e.currentTarget.getBoundingClientRect();pointer.value={x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height}}
const resetPointer=()=>{pointer.value={x:.62,y:.42}}
const shapeStyle=computed(()=>{const x=pointer.value.x,y=pointer.value.y,intensity=num('intensity',.82);const cut=Math.round(10+x*22*intensity);return{clipPath:`polygon(${cut}% 0,100% ${Math.round(8+y*16)}%,${Math.round(86-x*9)}% 100%,0 ${Math.round(78-y*12)}%)`,transform:`rotate(${(x-.5)*10}deg) scale(${.9+num('depth',.7)*.08})`}})
const lensStyle=computed(()=>({left:`calc(${pointer.value.x*100}% - 3rem)`,top:`calc(${pointer.value.y*100}% - 3rem)`}))
</script>
