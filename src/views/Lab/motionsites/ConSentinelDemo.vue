<template>
  <div ref="shellRef" class="relative h-full min-h-64 overflow-hidden bg-[#07090d]">
    <div class="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(56,189,248,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,.08)_1px,transparent_1px)] [background-size:30px_30px]"></div>
    <div class="relative flex h-full min-h-64 flex-col justify-between p-5">
      <div class="flex items-center justify-between"><p class="text-[9px] font-bold tracking-[0.2em] text-cyan-300/70">CONSENTINEL / MOTION</p><span class="text-[9px] text-white/35">SCROLL DRIVEN</span></div>
      <div class="relative mx-auto grid w-full max-w-lg grid-cols-[.7fr_1.4fr] gap-3">
        <div class="space-y-2">
          <div v-for="(label,index) in stages" :key="label" class="rounded-xl border px-3 py-3 transition-all duration-500" :class="index===activeStage?'border-cyan-300/50 bg-cyan-300/10 text-cyan-100':'border-white/10 bg-white/[.03] text-white/35'">
            <p class="text-[8px] font-bold tracking-[.14em]">0{{ index + 1 }}</p><p class="mt-1 text-[10px] font-semibold">{{ label }}</p>
          </div>
        </div>
        <div class="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1017] p-4 shadow-2xl">
          <div class="absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-cyan-300 to-transparent transition-all duration-500" :style="{ left: scanLeft }"></div>
          <p class="text-[9px] font-bold text-white/45">{{ stages[activeStage] }}</p>
          <p class="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">{{ headline }}</p>
          <div class="mt-7 space-y-2"><span v-for="n in 5" :key="n" class="block h-2 rounded-full bg-white/[.06]" :style="{ width: `${48+n*8}%` }"></span></div>
          <div class="mt-5 flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-cyan-300"></span><span class="text-[9px] text-cyan-100">stage {{ activeStage + 1 }} / 3</span></div>
        </div>
      </div>
      <div class="h-1 overflow-hidden rounded-full bg-white/10"><div class="h-full bg-cyan-300 transition-[width] duration-150" :style="{width:`${progress*100}%`}"></div></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import type { LabParams } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'

const props=defineProps<{scene:MotionSceneRuntime;params:LabParams}>()
const shellRef=ref<HTMLElement|null>(null),progress=ref(0)
const num=(key:string,fallback:number)=>typeof props.params[key]==='number'?Number(props.params[key]):fallback
const stages=['OBSERVE','ANALYZE','RESOLVE']
let trigger:ScrollTrigger|null=null
const activeStage=computed(()=>Math.min(2,Math.floor(progress.value*3)))
const headline=computed(()=>['Watch the signal.','Read the anomaly.','Resolve with confidence.'][activeStage.value] ?? '')
const scanLeft=computed(()=>`${12+progress.value*78}%`)
onMounted(()=>{if(!shellRef.value||matchMedia('(prefers-reduced-motion: reduce)').matches){progress.value=.66;return}gsap.registerPlugin(ScrollTrigger);trigger=ScrollTrigger.create({trigger:shellRef.value,start:'top bottom',end:'bottom top',scrub:Math.max(.15,1.2-num('speed',.58)),onUpdate:self=>{progress.value=self.progress}})})
onUnmounted(()=>trigger?.kill())
</script>
