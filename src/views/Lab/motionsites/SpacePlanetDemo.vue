<template>
  <div ref="shellRef" class="relative h-full min-h-64 overflow-hidden bg-[#06101f]" @pointermove="handlePointer" @pointerleave="resetPointer">
    <canvas ref="canvasRef" class="absolute inset-0 h-full w-full" aria-hidden="true"></canvas>
    <div class="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5 text-white">
      <div><p class="text-[9px] font-bold tracking-[.2em] text-cyan-200/60">SPACE PLANET</p><p class="mt-2 text-xl font-medium tracking-[-.04em]">Runtime orbit</p></div>
      <dl class="grid grid-cols-3 gap-5 text-right text-[8px] uppercase tracking-[.1em] text-white/45"><div><dt>Orbit</dt><dd class="mt-1 text-white">01.42</dd></div><div><dt>Signal</dt><dd class="mt-1 text-white">98%</dd></div><div><dt>Status</dt><dd class="mt-1 text-cyan-200">LIVE</dd></div></dl>
    </div>
    <p class="pointer-events-none absolute bottom-5 left-5 max-w-xs text-[clamp(1.6rem,4.5vw,4rem)] font-medium leading-[.86] tracking-[-.06em] text-white">From code<br>to orbit.</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted,onUnmounted,ref } from 'vue'
import * as THREE from 'three'
import type { LabParams } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'

const props=defineProps<{scene:MotionSceneRuntime;params:LabParams}>()
const shellRef=ref<HTMLElement|null>(null),canvasRef=ref<HTMLCanvasElement|null>(null)
const pointer={x:0,y:0};let renderer:THREE.WebGLRenderer|null=null,planet:THREE.Mesh|null=null,group:THREE.Group|null=null,observer:ResizeObserver|null=null,frame=0
const num=(key:string,fallback:number)=>typeof props.params[key]==='number'?Number(props.params[key]):fallback
const handlePointer=(e:PointerEvent)=>{if(!(e.currentTarget instanceof HTMLElement)||e.pointerType==='touch')return;const r=e.currentTarget.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width-.5)*2;pointer.y=((e.clientY-r.top)/r.height-.5)*2}
const resetPointer=()=>{pointer.x=0;pointer.y=0}
onMounted(()=>{const shell=shellRef.value,canvas=canvasRef.value;if(!shell||!canvas)return;const scene=new THREE.Scene();scene.background=new THREE.Color('#06101f');const camera=new THREE.PerspectiveCamera(42,1,.1,60);camera.position.set(0,0,6);renderer=new THREE.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.7));renderer.toneMapping=THREE.ACESFilmicToneMapping;group=new THREE.Group();group.position.x=.7;scene.add(group);planet=new THREE.Mesh(new THREE.SphereGeometry(1.28,64,64),new THREE.MeshStandardMaterial({color:'#0b5ed7',roughness:.72,metalness:.05,emissive:'#082f49',emissiveIntensity:.35}));group.add(planet);const wire=new THREE.Mesh(new THREE.SphereGeometry(1.31,32,32),new THREE.MeshBasicMaterial({color:'#38bdf8',wireframe:true,transparent:true,opacity:.12}));group.add(wire);[1.75,2.15].forEach((r,i)=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.012,6,140),new THREE.MeshBasicMaterial({color:i?'#475569':'#38bdf8',transparent:true,opacity:.55}));ring.rotation.set(1.2+i*.28,.15,.35);group?.add(ring)});const moon=new THREE.Mesh(new THREE.SphereGeometry(.16,24,24),new THREE.MeshBasicMaterial({color:'#f59e0b'}));moon.position.set(1.75,0,0);group.add(moon);const positions=new Float32Array(180*3);for(let i=0;i<positions.length;i+=3){positions[i]=(Math.random()-.5)*12;positions[i+1]=(Math.random()-.5)*7;positions[i+2]=-Math.random()*7}const starsGeo=new THREE.BufferGeometry();starsGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));scene.add(new THREE.Points(starsGeo,new THREE.PointsMaterial({color:'#e0f2fe',size:.018})));scene.add(new THREE.HemisphereLight('#bae6fd','#020617',1.8));const key=new THREE.DirectionalLight('#7dd3fc',4);key.position.set(4,2,5);scene.add(key);const resize=()=>{if(!renderer)return;renderer.setSize(shell.clientWidth,shell.clientHeight,false);camera.aspect=shell.clientWidth/Math.max(1,shell.clientHeight);camera.updateProjectionMatrix()};observer=new ResizeObserver(resize);observer.observe(shell);resize();const tick=(time:number)=>{if(!renderer||!group||!planet)return;const speed=num('speed',.35),depth=num('depth',1.1),strength=num('pointerStrength',.24);group.scale.setScalar(.86+depth*.1);planet.rotation.y=time*.00028*speed;group.rotation.y+=(pointer.x*strength*.3-group.rotation.y)*.03;group.rotation.x+=(pointer.y*strength*.18-group.rotation.x)*.03;renderer.render(scene,camera);frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick)})
onUnmounted(()=>{cancelAnimationFrame(frame);observer?.disconnect();renderer?.dispose()})
</script>
