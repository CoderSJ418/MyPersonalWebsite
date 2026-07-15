<template>
  <div class="stage">
    <div
      class="spotlight-card"
      :style="{ '--x': `${position.x}%`, '--y': `${position.y}%`, '--radius': `${radius}px` }"
      @pointermove="moveSpotlight"
      @pointerleave="resetSpotlight"
    >
      <span class="spotlight-card__eyebrow">Interactive surface</span>
      <strong>Follow the signal</strong>
      <p>指针位置驱动径向渐变，不读取全局状态。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface Props {
  radius?: number
}

withDefaults(defineProps<Props>(), { radius: 250 })
const position = reactive({ x: 50, y: 42 })

const moveSpotlight = (event: PointerEvent) => {
  if (!(event.currentTarget instanceof HTMLElement) || event.pointerType === 'touch') return
  const rect = event.currentTarget.getBoundingClientRect()
  position.x = ((event.clientX - rect.left) / rect.width) * 100
  position.y = ((event.clientY - rect.top) / rect.height) * 100
}
const resetSpotlight = () => Object.assign(position, { x: 50, y: 42 })
</script>

<style scoped>
.stage {
  display: grid;
  min-height: 20rem;
  place-items: center;
  border-radius: 1rem;
  background: #eff6ff;
  padding: 2rem;
}
.spotlight-card {
  position: relative;
  max-width: 25rem;
  overflow: hidden;
  border: 1px solid #bfdbfe;
  border-radius: 1rem;
  background:
    radial-gradient(
      circle var(--radius) at var(--x) var(--y),
      rgb(37 99 235 / 18%),
      transparent 48%
    ),
    #fff;
  padding: 2rem;
  color: #0f172a;
  box-shadow: 0 20px 50px rgb(37 99 235 / 12%);
}
.spotlight-card__eyebrow {
  display: block;
  margin-bottom: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #2563eb;
}
.spotlight-card strong {
  font-size: 1.5rem;
}
.spotlight-card p {
  margin-top: 0.75rem;
  line-height: 1.6;
  color: #64748b;
}
@media (hover: none), (prefers-reduced-motion: reduce) {
  .spotlight-card {
    --x: 50% !important;
    --y: 42% !important;
  }
}
</style>
