<template>
  <div ref="shellRef" class="relative h-full min-h-64 overflow-hidden bg-[#070716]" @pointermove="handlePointer" @pointerleave="resetPointer">
    <canvas ref="canvasRef" class="absolute inset-0 h-full w-full" aria-hidden="true"></canvas>
    <div class="pointer-events-none absolute left-5 top-5"><p class="text-[9px] font-bold tracking-[.2em] text-violet-300/70">NIVAL CYBERSPACE</p><p class="mt-2 text-2xl font-medium tracking-[-.04em] text-white">Projects in depth.</p></div>
    <p class="pointer-events-none absolute bottom-5 right-5 text-[9px] font-semibold tracking-[.14em] text-cyan-200/60">POINTER / DEPTH / FOCUS</p>
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
const makeTexture=(index:number)=>{const c=document.createElement('canvas');c.width=480;c.height=300;const x=c.getContext('2d');if(!x)return new THREE.CanvasTexture(c);x.fillStyle=index%2?'#111827':'#161233';x.fillRect(0,0,c.width,c.height);const g=x.createLinearGradient(0,0,c.width,c.height);g.addColorStop(0,index%2?'#22d3ee':'#8b5cf6');g.addColorStop(1,'#1e1b4b');x.fillStyle=g;x.fillRect(20,42,440,170);x.fillStyle='#fff';x.font='700 28px Arial';x.fillText(['SYSTEM 01','PRODUCT 02','CASE 03','LAB 04'][index]??'PROJECT',24,262);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
const handlePointer=(e:PointerEvent)=>{if(!(e.currentTarget instanceof HTMLElement)||e.pointerType==='touch')return;const r=e.currentTarget.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width-.5)*2;pointer.y=((e.clientY-r.top)/r.height-.5)*2}
const resetPointer=()=>{pointer.x=0;pointer.y=0}
onMounted(()=>{const shell=shellRef.value,canvas=canvasRef.value;if(!shell||!canvas)return;const scene=new THREE.Scene();scene.background=new THREE.Color('#070716');scene.fog=new THREE.Fog('#070716',4.5,12);const camera=new THREE.PerspectiveCamera(46,1,.1,40);camera.position.set(0,0,6);renderer=new THREE.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.7));root=new THREE.Group();scene.add(root);[[-1.6,.8,-2.3,-.28],[.45,.15,-.2,.08],[1.65,.95,-1.8,.3],[-.85,-1.15,-3,-.08]].forEach((v,i)=>{const p=new THREE.Mesh(new THREE.PlaneGeometry(2.55,1.6),new THREE.MeshBasicMaterial({map:makeTexture(i),toneMapped:false}));p.position.set(v[0]??0,v[1]??0,v[2]??0);p.rotation.y=v[3]??0;root?.add(p)});const resize=()=>{if(!renderer)return;renderer.setSize(shell.clientWidth,shell.clientHeight,false);camera.aspect=shell.clientWidth/Math.max(1,shell.clientHeight);camera.updateProjectionMatrix()};observer=new ResizeObserver(resize);observer.observe(shell);resize();const tick=(time:number)=>{if(!renderer||!root)return;const strength=num('pointerStrength',.42),depth=num('depth',1.3),speed=num('speed',.3);root.position.z=(depth-1.2)*-.35;root.rotation.y+=(pointer.x*strength*.22-root.rotation.y)*.025;root.rotation.x+=(-pointer.y*strength*.1-root.rotation.x)*.025;root.position.y=Math.sin(time*.00035*speed)*.07;renderer.render(scene,camera);frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick)})
onUnmounted(()=>{cancelAnimationFrame(frame);observer?.disconnect();root?.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();if(o.material instanceof THREE.Material){if('map' in o.material&&o.material.map)o.material.map.dispose();o.material.dispose()}}});renderer?.dispose()})
</script>
