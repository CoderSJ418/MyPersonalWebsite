<template>
  <div ref="shellRef" class="relative h-full min-h-64 overflow-hidden bg-[#f7f8fb]">
    <canvas ref="canvasRef" class="absolute inset-y-0 left-0 h-full w-[48%]" aria-hidden="true"></canvas>
    <div class="absolute inset-y-0 right-0 w-[58%] p-4 sm:p-5">
      <div class="flex items-center justify-between"><p class="text-[9px] font-bold tracking-[0.16em] text-slate-400">HEART HEALTH</p><span class="rounded-full bg-blue-600 px-2 py-1 text-[8px] font-bold text-white">LIVE</span></div>
      <div class="mt-4 grid grid-cols-3 gap-2">
        <div v-for="metric in metrics" :key="metric.label" class="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          <p class="text-[8px] text-slate-400">{{ metric.label }}</p><p class="mt-1 text-lg font-semibold text-slate-900">{{ metric.value }}</p>
          <svg viewBox="0 0 60 16" class="mt-1 h-4 w-full"><polyline :points="metric.points" fill="none" stroke="#2563eb" stroke-width="1.6" /></svg>
        </div>
      </div>
      <div class="mt-2 grid grid-cols-[1.2fr_.8fr] gap-2">
        <div class="rounded-xl border border-slate-200 bg-white p-3"><p class="text-[9px] font-semibold text-slate-700">Medication List</p><div class="mt-3 space-y-2"><span v-for="n in 3" :key="n" class="block h-2 rounded-full bg-slate-100" :class="n===1?'w-4/5':'w-3/5'"></span></div></div>
        <div class="rounded-xl bg-blue-600 p-3 text-white"><p class="text-[9px] opacity-70">Heart wellness</p><p class="mt-2 text-xl font-semibold">92%</p><p class="mt-1 text-[8px] opacity-75">stable range</p></div>
      </div>
    </div>
    <p class="absolute bottom-4 left-4 text-[9px] font-semibold tracking-[0.14em] text-rose-500">3D HEART / MOTIONSITES RECREATION</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'
import type { LabParams } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'

const props=defineProps<{scene:MotionSceneRuntime;params:LabParams}>()
const shellRef=ref<HTMLElement|null>(null),canvasRef=ref<HTMLCanvasElement|null>(null)
const metrics=[{label:'Pulse',value:'72',points:'0,12 10,8 18,11 25,3 33,12 40,7 50,10 60,5'},{label:'Oxygen',value:'98',points:'0,8 12,7 24,9 36,6 48,7 60,5'},{label:'Recovery',value:'86',points:'0,13 12,11 24,9 36,8 48,5 60,4'}]
let renderer:THREE.WebGLRenderer|null=null,heart:THREE.Mesh|null=null,observer:ResizeObserver|null=null,frame=0
const num=(key:string,fallback:number)=>typeof props.params[key]==='number'?Number(props.params[key]):fallback
const heartGeometry=()=>{
  const shape=new THREE.Shape();const pts:THREE.Vector2[]=[]
  for(let i=0;i<=90;i++){const t=Math.PI*2*i/90;pts.push(new THREE.Vector2(16*Math.pow(Math.sin(t),3)/18,(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))/18))}
  shape.moveTo(pts[0]?.x??0,pts[0]?.y??0);pts.slice(1).forEach(p=>shape.lineTo(p.x,p.y))
  return new THREE.ExtrudeGeometry(shape,{depth:.42,bevelEnabled:true,bevelSegments:5,bevelSize:.08,bevelThickness:.08})
}
onMounted(()=>{
  const shell=shellRef.value,canvas=canvasRef.value;if(!shell||!canvas)return
  const scene=new THREE.Scene();scene.background=new THREE.Color('#f7f8fb')
  const camera=new THREE.PerspectiveCamera(38,1,.1,30);camera.position.set(0,0,5.3)
  renderer=new THREE.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.7));renderer.toneMapping=THREE.ACESFilmicToneMapping
  heart=new THREE.Mesh(heartGeometry(),new THREE.MeshPhysicalMaterial({color:'#ef4444',roughness:.34,metalness:.03,clearcoat:.7}));heart.geometry.center();heart.rotation.x=-.18;scene.add(heart)
  const artery=new THREE.Mesh(new THREE.TorusGeometry(.7,.08,16,70,Math.PI*1.25),new THREE.MeshStandardMaterial({color:'#b91c1c'}));artery.position.set(.25,.6,.18);artery.rotation.set(.4,.2,.7);scene.add(artery)
  scene.add(new THREE.HemisphereLight('#ffffff','#fecaca',2.4));const light=new THREE.DirectionalLight('#ffffff',4);light.position.set(3,4,5);scene.add(light)
  const resize=()=>{if(!renderer)return;const w=Math.max(1,shell.clientWidth*.48),h=Math.max(1,shell.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()};observer=new ResizeObserver(resize);observer.observe(shell);resize()
  const tick=(time:number)=>{if(!renderer||!heart)return;const speed=num('speed',.3),depth=num('depth',.9);heart.scale.setScalar(.82+depth*.12);heart.rotation.y=time*.00035*speed;heart.position.y=Math.sin(time*.0012*speed)*.05;renderer.render(scene,camera);frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick)
})
onUnmounted(()=>{cancelAnimationFrame(frame);observer?.disconnect();renderer?.dispose()})
</script>
