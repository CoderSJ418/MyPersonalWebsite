<template>
  <div
    class="magic-card"
    :class="{ 'magic-card--embedded': embedded }"
    :style="{ '--border': `${borderWidth}px`, '--x': `${position.x}%`, '--y': `${position.y}%` }"
    :aria-label="embedded ? undefined : label"
    @pointermove="moveGlow"
    @pointerleave="resetGlow"
  >
    <div class="magic-card__content" :class="{ 'magic-card__content--showcase': !embedded }">
      <slot>
        <span>AI Native</span>
        <strong>Intent becomes interface.</strong>
        <p>渐变边框与局部高光共享同一个指针坐标。</p>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface Props {
  borderWidth?: number
  embedded?: boolean
  label?: string
}

withDefaults(defineProps<Props>(), {
  borderWidth: 1,
  embedded: false,
  label: '指针渐变高光卡片演示'
})
const position = reactive({ x: 50, y: 35 })

const moveGlow = (event: PointerEvent) => {
  if (!(event.currentTarget instanceof HTMLElement) || event.pointerType === 'touch') return
  const rect = event.currentTarget.getBoundingClientRect()
  position.x = ((event.clientX - rect.left) / rect.width) * 100
  position.y = ((event.clientY - rect.top) / rect.height) * 100
}
const resetGlow = () => Object.assign(position, { x: 50, y: 35 })
</script>

<style scoped>
.magic-card {
  display: grid;
  min-height: 20rem;
  place-items: center;
  width: min(100%, 25rem);
  border-radius: 1rem;
  padding: var(--border);
  background: conic-gradient(from 180deg at var(--x) var(--y), #93c5fd, #2563eb, #7c3aed, #93c5fd);
  box-shadow: 0 22px 60px rgb(37 99 235 / 16%);
}
.magic-card--embedded {
  min-height: 0;
  width: 100%;
  place-items: stretch;
}
.magic-card__content {
  width: 100%;
  border-radius: calc(1rem - var(--border));
  background:
    radial-gradient(circle at var(--x) var(--y), rgb(37 99 235 / 14%), transparent 42%), #fff;
  color: #0f172a;
}
.magic-card__content--showcase {
  padding: 2.5rem;
}
.magic-card span {
  display: block;
  margin-bottom: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #2563eb;
}
.magic-card strong {
  font-size: 1.6rem;
}
.magic-card p {
  margin-top: 0.75rem;
  line-height: 1.6;
  color: #64748b;
}
@media (hover: none), (prefers-reduced-motion: reduce) {
  .magic-card,
  .magic-card__content {
    --x: 50% !important;
    --y: 35% !important;
  }
}
</style>
