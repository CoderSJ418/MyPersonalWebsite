<template>
  <div ref="shellRef" class="relative h-full min-h-64 overflow-hidden bg-[#080b10]" @pointermove="handlePointer" @pointerleave="resetPointer">
    <canvas ref="canvasRef" class="absolute inset-0 h-full w-full" aria-hidden="true"></canvas>
    <div class="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-5 text-[9px] font-semibold tracking-[0.17em] text-slate-400"><span>FUTURE MACHINE</span><span>ROBOTICS / SYSTEM 04</span></div>
    <div class="pointer-events-none absolute bottom-5 left-5"><p class="text-2xl font-semibold tracking-[-0.04em] text-white">Machine intelligence,<br>made visible.</p><p class="mt-2 text-[9px] tracking-[0.14em] text-cyan-300">ROTATE / INSPECT / TRACE</p></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'
import type { LabParams } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'

const props=defineProps<{scene:MotionSceneRuntime;params:LabParams}>()
const shellRef=ref<HTMLElement|null>(null),canvasRef=ref<HTMLCanvasElement|null>(null)
const pointer={x:0,y:0};let renderer:THREE.WebGLRenderer|null=null,root:THREE.Group|null=null,observer:ResizeObserver|null=null,frame=0
const num=(key:string,fallback:number)=>typeof props.params[key]==='number'?Number(props.params[key]):fallback
const handlePointer=(event:PointerEvent)=>{if(!(event.currentTarget instanceof HTMLElement)||event.pointerType==='touch')return;const r=event.currentTarget.getBoundingClientRect();pointer.x=((event.clientX-r.left)/r.width-.5)*2;pointer.y=((event.clientY-r.top)/r.height-.5)*2}
const resetPointer=()=>{pointer.x=0;pointer.y=0}
onMounted(()=>{
  const shell=shellRef.value,canvas=canvasRef.value;if(!shell||!canvas)return
  const scene=new THREE.Scene();scene.background=new THREE.Color('#080b10');const camera=new THREE.PerspectiveCamera(42,1,.1,40);camera.position.set(0,0,6)
  renderer=new THREE.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.7));renderer.toneMapping=THREE.ACESFilmicToneMapping
  root=new THREE.Group();root.position.x=.75;scene.add(root)
  const metal=new THREE.MeshStandardMaterial({color:'#334155',metalness:.82,roughness:.24});const blue=new THREE.MeshStandardMaterial({color:'#38bdf8',metalness:.5,roughness:.18,emissive:'#075985',emissiveIntensity:.7})
  ;[1.55,1.15,.76].forEach((r,index)=>{const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.1-index*.018,12,96),index===1?blue:metal);ring.rotation.set(.7+index*.4,.25,index*.45);root?.add(ring)})
  for(let i=0;i<8;i++){const tooth=new THREE.Mesh(new THREE.BoxGeometry(.18,.46,.16),metal);const a=Math.PI*2*i/8;tooth.position.set(Math.cos(a)*1.55,Math.sin(a)*1.55,0);tooth.rotation.z=a;root.add(tooth)}
  const core=new THREE.Mesh(new THREE.IcosahedronGeometry(.46,1),blue);root.add(core)
  scene.add(new THREE.HemisphereLight('#dbeafe','#020617',1.7));const key=new THREE.PointLight('#38bdf8',28,9);key.position.set(2.5,2.5,4);scene.add(key);const rim=new THREE.PointLight('#818cf8',18,8);rim.position.set(-3,-1,2);scene.add(rim)
  const resize=()=>{if(!renderer)return;renderer.setSize(shell.clientWidth,shell.clientHeight,false);camera.aspect=shell.clientWidth/Math.max(1,shell.clientHeight);camera.updateProjectionMatrix()};observer=new ResizeObserver(resize);observer.observe(shell);resize()
  const tick=(time:number)=>{if(!renderer||!root)return;const speed=num('speed',.5),depth=num('depth',1.2),strength=num('pointerStrength',.26);root.scale.setScalar(.84+depth*.1);root.rotation.z=time*.0002*speed;root.rotation.y+=(pointer.x*strength*.35-root.rotation.y)*.035;root.rotation.x+=(pointer.y*strength*.2-root.rotation.x)*.035;renderer.render(scene,camera);frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick)
})
onUnmounted(()=>{cancelAnimationFrame(frame);observer?.disconnect();root?.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();if(o.material instanceof THREE.Material)o.material.dispose()}});renderer?.dispose()})
</script>
