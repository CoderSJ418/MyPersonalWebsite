<template>
  <div ref="shellRef" class="relative h-full min-h-64 overflow-hidden bg-[#f6f4f0]" @pointermove="handlePointer" @pointerleave="resetPointer">
    <canvas ref="canvasRef" class="absolute inset-0 h-full w-full" aria-hidden="true"></canvas>
    <div class="pointer-events-none absolute left-5 top-5"><p class="text-[9px] font-bold tracking-[.2em] text-slate-500">ALETHIA / 3D</p><p class="mt-2 max-w-[220px] text-2xl font-medium leading-[.95] tracking-[-.045em] text-slate-950">Clarity through form.</p></div>
    <div class="pointer-events-none absolute bottom-5 right-5 text-right text-[8px] font-semibold uppercase tracking-[.14em] text-slate-500"><p>glass / refraction</p><p class="mt-1">pointer / camera</p></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted,onUnmounted,ref } from 'vue'
import * as THREE from 'three'
import type { LabParams } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'

const props=defineProps<{scene:MotionSceneRuntime;params:LabParams}>()
const shellRef=ref<HTMLElement|null>(null),canvasRef=ref<HTMLCanvasElement|null>(null)
const pointer={x:0,y:0};let renderer:THREE.WebGLRenderer|null=null,root:THREE.Group|null=null,observer:ResizeObserver|null=null,frame=0
const num=(key:string,fallback:number)=>typeof props.params[key]==='number'?Number(props.params[key]):fallback
const handlePointer=(e:PointerEvent)=>{if(!(e.currentTarget instanceof HTMLElement)||e.pointerType==='touch')return;const r=e.currentTarget.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width-.5)*2;pointer.y=((e.clientY-r.top)/r.height-.5)*2}
const resetPointer=()=>{pointer.x=0;pointer.y=0}
onMounted(()=>{const shell=shellRef.value,canvas=canvasRef.value;if(!shell||!canvas)return;const scene=new THREE.Scene();scene.background=new THREE.Color('#f6f4f0');const camera=new THREE.PerspectiveCamera(38,1,.1,50);camera.position.set(0,0,5.4);renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.7));renderer.toneMapping=THREE.ACESFilmicToneMapping;root=new THREE.Group();root.position.x=.8;scene.add(root);const glass=new THREE.MeshPhysicalMaterial({color:'#c4b5fd',roughness:.08,metalness:.04,transmission:.78,thickness:1.1,transparent:true,opacity:.92,clearcoat:1,ior:1.28});const knot=new THREE.Mesh(new THREE.TorusKnotGeometry(.95,.28,180,32,2,3),glass);root.add(knot);const orb=new THREE.Mesh(new THREE.IcosahedronGeometry(.58,3),new THREE.MeshPhysicalMaterial({color:'#ffffff',roughness:.1,transmission:.38,transparent:true,opacity:.78,clearcoat:1}));orb.position.set(-1.05,-.55,.25);root.add(orb);const ring=new THREE.Mesh(new THREE.TorusGeometry(1.65,.018,8,120),new THREE.MeshBasicMaterial({color:'#2563eb',transparent:true,opacity:.35}));ring.rotation.set(1.1,.1,.4);root.add(ring);scene.add(new THREE.HemisphereLight('#ffffff','#c4b5fd',2.6));const key=new THREE.PointLight('#60a5fa',24,9);key.position.set(3,3,4);scene.add(key);const warm=new THREE.PointLight('#f0abfc',14,8);warm.position.set(-3,-1,2);scene.add(warm);const resize=()=>{if(!renderer)return;renderer.setSize(shell.clientWidth,shell.clientHeight,false);camera.aspect=shell.clientWidth/Math.max(1,shell.clientHeight);camera.updateProjectionMatrix()};observer=new ResizeObserver(resize);observer.observe(shell);resize();const tick=(time:number)=>{if(!renderer||!root)return;const speed=num('speed',.26),depth=num('depth',1.05),strength=num('pointerStrength',.24);root.scale.setScalar(.88+depth*.08);root.rotation.y=time*.00018*speed+pointer.x*strength*.18;root.rotation.x+=(pointer.y*strength*.12-root.rotation.x)*.025;renderer.render(scene,camera);frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick)})
onUnmounted(()=>{cancelAnimationFrame(frame);observer?.disconnect();root?.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();if(o.material instanceof THREE.Material)o.material.dispose()}});renderer?.dispose()})
</script>
