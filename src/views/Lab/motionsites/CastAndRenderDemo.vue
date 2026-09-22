<template>
  <div ref="shellRef" class="relative h-full min-h-64 overflow-hidden bg-[#ece8df]" @pointermove="handlePointer" @pointerleave="resetPointer">
    <canvas ref="canvasRef" class="absolute inset-0 h-full w-full" aria-hidden="true"></canvas>
    <div class="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5">
      <div><p class="text-[9px] font-bold tracking-[0.2em] text-stone-500">CAST AND RENDER</p><p class="mt-1 text-xs text-stone-600">Digital material study</p></div>
      <p class="text-right text-[9px] leading-4 text-stone-500">01 / CERAMIC<br>02 / LIGHT<br>03 / FORM</p>
    </div>
    <p class="pointer-events-none absolute bottom-5 left-5 max-w-xs text-[clamp(1.5rem,4vw,3.8rem)] font-medium leading-[0.9] tracking-[-0.06em] text-stone-900">Objects deserve a stage.</p>
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
  const scene=new THREE.Scene();scene.background=new THREE.Color('#ece8df')
  const camera=new THREE.PerspectiveCamera(38,1,.1,50);camera.position.set(0,.15,5.5)
  renderer=new THREE.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.7));renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2
  root=new THREE.Group();root.position.x=.65;scene.add(root)
  const ceramic=new THREE.MeshPhysicalMaterial({color:'#c9c1b4',roughness:.26,metalness:.02,clearcoat:1,clearcoatRoughness:.18})
  const knot=new THREE.Mesh(new THREE.TorusKnotGeometry(.95,.34,180,28,2,3),ceramic);knot.rotation.x=.7;root.add(knot)
  const orb=new THREE.Mesh(new THREE.SphereGeometry(.48,48,48),new THREE.MeshPhysicalMaterial({color:'#1d4ed8',roughness:.18,metalness:.1,clearcoat:1}));orb.position.set(-1.2,-.65,.35);root.add(orb)
  const halo=new THREE.Mesh(new THREE.TorusGeometry(1.55,.025,10,120),new THREE.MeshStandardMaterial({color:'#78716c',roughness:.4}));halo.rotation.set(1.2,.2,.3);root.add(halo)
  scene.add(new THREE.HemisphereLight('#fffaf0','#8d7f70',2.2));const key=new THREE.DirectionalLight('#ffffff',5);key.position.set(4,5,5);scene.add(key);const rim=new THREE.PointLight('#60a5fa',20,8);rim.position.set(-3,1,2);scene.add(rim)
  const resize=()=>{if(!renderer)return;renderer.setSize(shell.clientWidth,shell.clientHeight,false);camera.aspect=shell.clientWidth/Math.max(1,shell.clientHeight);camera.updateProjectionMatrix()};observer=new ResizeObserver(resize);observer.observe(shell);resize()
  const tick=(time:number)=>{if(!renderer||!root)return;const speed=num('speed',.22),depth=num('depth',1.1),strength=num('pointerStrength',.2);root.scale.setScalar(.92+depth*.07);root.rotation.y=time*.00016*speed+pointer.x*strength*.18;root.rotation.x+=(pointer.y*strength*.12-root.rotation.x)*.025;renderer.render(scene,camera);frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick)
})
onUnmounted(()=>{cancelAnimationFrame(frame);observer?.disconnect();root?.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();if(o.material instanceof THREE.Material)o.material.dispose()}});renderer?.dispose()})
</script>
