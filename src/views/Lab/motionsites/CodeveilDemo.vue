<template>
  <div ref="shellRef" class="relative h-full min-h-64 overflow-hidden bg-[#070b10] text-white">
    <div class="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(56,189,248,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,.08)_1px,transparent_1px)] [background-size:32px_32px]"></div>
    <div class="relative grid h-full min-h-64 grid-cols-[.78fr_1.22fr] gap-3 p-4 sm:p-5">
      <div class="flex flex-col justify-between rounded-2xl border border-cyan-300/15 bg-black/30 p-4">
        <div><p class="text-[9px] font-bold tracking-[.18em] text-cyan-300">CODEVEIL / DEVELOPER</p><p class="mt-3 text-xl font-semibold tracking-[-.04em]">Build. Inspect. Verify.</p></div>
        <ol class="space-y-2">
          <li v-for="(step,index) in steps" :key="step" class="rounded-xl border px-3 py-2 transition-all duration-300" :class="index<=activeStep?'border-cyan-300/35 bg-cyan-300/10 text-cyan-50':'border-white/10 text-white/35'">
            <span class="text-[8px] font-bold">0{{ index+1 }}</span><span class="ml-2 text-[9px] font-semibold tracking-[.08em]">{{ step }}</span>
          </li>
        </ol>
      </div>
      <div class="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b111a] p-4">
        <div class="flex items-center justify-between"><p class="text-[9px] font-bold text-white/50">runtime.ts</p><span class="h-2 w-2 rounded-full bg-emerald-400"></span></div>
        <div class="mt-4 space-y-2 font-mono text-[9px] leading-5">
          <p v-for="(line,index) in lines" :key="line" :class="index<=activeStep?'text-cyan-200':'text-slate-600'"><span class="mr-3 text-slate-700">{{ String(index+1).padStart(2,'0') }}</span>{{ line }}</p>
        </div>
        <div class="absolute inset-x-4 bottom-4 rounded-xl border border-emerald-400/20 bg-emerald-400/[.06] p-3">
          <div class="flex items-center gap-2"><span class="h-2 w-2 rounded-full bg-emerald-400"></span><span class="text-[9px] font-bold tracking-[.12em] text-emerald-200">BROWSER EVIDENCE</span></div>
          <p class="mt-2 text-xs font-semibold text-white">{{ evidence }}</p>
        </div>
      </div>
    </div>
    <div class="absolute bottom-0 left-0 h-1 bg-cyan-300 transition-[width] duration-150" :style="{width:`${progress*100}%`}"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import type { LabParams } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'

const props=defineProps<{scene:MotionSceneRuntime;params:LabParams}>()
const shellRef=ref<HTMLElement|null>(null),progress=ref(.12)
const steps=['REQUIREMENT','INSPECT','IMPLEMENT','VERIFY']
const lines=['const goal = parse(requirement)','inspect(repository, constraints)','apply(minimalPatch)','verify(browser, network)','return evidence']
let trigger:ScrollTrigger|null=null
const num=(key:string,fallback:number)=>typeof props.params[key]==='number'?Number(props.params[key]):fallback
const activeStep=computed(()=>Math.min(3,Math.floor(progress.value*4)))
const evidence=computed(()=>['Requirement locked','Existing system mapped','Patch applied locally','Rendered state verified'][activeStep.value]??'Verified')
onMounted(()=>{if(!shellRef.value||matchMedia('(prefers-reduced-motion: reduce)').matches){progress.value=.9;return}gsap.registerPlugin(ScrollTrigger);trigger=ScrollTrigger.create({trigger:shellRef.value,start:'top bottom',end:'bottom top',scrub:Math.max(.15,1.1-num('speed',.55)),onUpdate:self=>{progress.value=self.progress}})})
onUnmounted(()=>trigger?.kill())
</script>
