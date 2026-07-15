<template>
  <div class="stage" :style="{ perspective: `${perspective}px` }">
    <div
      class="tilt-card"
      :style="{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }"
      @pointermove="tilt"
      @pointerleave="reset"
    >
      <span>Architecture</span>
      <strong>Composable systems</strong>
      <p>Typed · resilient · portable</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface Props {
  maxTilt?: number
  perspective?: number
}

const props = withDefaults(defineProps<Props>(), { maxTilt: 10, perspective: 500 })
const rotation = reactive({ x: 0, y: 0 })

const tilt = (event: PointerEvent) => {
  if (!(event.currentTarget instanceof HTMLElement) || event.pointerType === 'touch') return
  const rect = event.currentTarget.getBoundingClientRect()
  rotation.x = -((event.clientY - rect.top) / rect.height - 0.5) * props.maxTilt * 2
  rotation.y = ((event.clientX - rect.left) / rect.width - 0.5) * props.maxTilt * 2
}
const reset = () => Object.assign(rotation, { x: 0, y: 0 })
</script>

<style scoped>
.stage {
  display: grid;
  min-height: 20rem;
  place-items: center;
  border-radius: 1rem;
  background: linear-gradient(145deg, #eff6ff, #fff);
  padding: 2rem;
}
.tilt-card {
  display: grid;
  width: min(100%, 24rem);
  gap: 0.75rem;
  border: 1px solid #bfdbfe;
  border-radius: 1rem;
  background: #fff;
  padding: 2.5rem;
  color: #0f172a;
  box-shadow: 0 24px 60px rgb(37 99 235 / 16%);
  transition: transform 120ms ease-out;
  transform-style: preserve-3d;
}
.tilt-card span {
  color: #2563eb;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  transform: translateZ(18px);
}
.tilt-card strong {
  font-size: 1.6rem;
  transform: translateZ(30px);
}
.tilt-card p {
  color: #64748b;
  transform: translateZ(22px);
}
@media (hover: none), (prefers-reduced-motion: reduce) {
  .tilt-card {
    transform: none !important;
    transition: none;
  }
}
</style>
