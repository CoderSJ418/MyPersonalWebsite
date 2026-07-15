<template>
  <div
    class="aurora"
    :class="[`aurora--${colorTheme}`, { 'aurora--embedded': embedded }]"
    :style="{ '--duration': `${12 / speed}s` }"
    :aria-label="decorative ? undefined : label"
    :aria-hidden="decorative ? 'true' : undefined"
  >
    <span v-for="band in 3" :key="band" class="aurora__band" :class="`aurora__band--${band}`" />
    <slot>
      <p v-if="!decorative">Build with clarity.</p>
    </slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  speed?: number
  colorTheme?: 'blue' | 'indigo' | 'purple'
  embedded?: boolean
  decorative?: boolean
  label?: string
}

withDefaults(defineProps<Props>(), {
  speed: 2,
  colorTheme: 'blue',
  embedded: false,
  decorative: false,
  label: '流动极光背景演示'
})
</script>

<style scoped>
.aurora {
  --c1: #2563eb;
  --c2: #06b6d4;
  --c3: #93c5fd;
  position: relative;
  display: grid;
  min-height: 20rem;
  place-items: center;
  overflow: hidden;
  border-radius: 1rem;
  background: #eff6ff;
}
.aurora--embedded {
  position: absolute;
  inset: 0;
  min-height: 0;
  border-radius: 0;
}
.aurora--indigo {
  --c1: #4f46e5;
  --c2: #818cf8;
  --c3: #c7d2fe;
}
.aurora--purple {
  --c1: #7c3aed;
  --c2: #a855f7;
  --c3: #ddd6fe;
}
.aurora__band {
  position: absolute;
  width: 75%;
  height: 150%;
  border-radius: 50%;
  filter: blur(32px);
  opacity: 0.58;
  animation: drift var(--duration) ease-in-out infinite alternate;
}
.aurora__band--1 {
  left: -20%;
  background: var(--c1);
  transform: rotate(24deg);
}
.aurora__band--2 {
  background: var(--c2);
  animation-delay: -2s;
}
.aurora__band--3 {
  right: -25%;
  background: var(--c3);
  animation-delay: -4s;
  transform: rotate(-24deg);
}
.aurora p {
  position: relative;
  font-size: clamp(1.8rem, 6vw, 3.5rem);
  font-weight: 800;
  color: #0f172a;
}
@keyframes drift {
  to {
    transform: translate3d(12%, -8%, 0) rotate(12deg) scale(1.08);
  }
}
@media (prefers-reduced-motion: reduce) {
  .aurora__band {
    animation: none;
  }
}
</style>
