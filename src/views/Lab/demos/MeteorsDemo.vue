<template>
  <div
    class="meteors"
    :style="{ '--duration': `${Math.max(0.8, 4 / speed)}s` }"
    aria-label="流星背景演示"
  >
    <span
      v-for="index in count"
      :key="index"
      class="meteor"
      :style="{ '--x': `${(index * 37) % 100}%`, '--delay': `${index * -0.23}s` }"
    />
    <p>Ship at light speed</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  count?: number
  speed?: number
}

withDefaults(defineProps<Props>(), {
  count: 15,
  speed: 2
})
</script>

<style scoped>
.meteors {
  position: relative;
  display: grid;
  min-height: 20rem;
  place-items: center;
  overflow: hidden;
  border-radius: 1rem;
  background: radial-gradient(circle at top, #dbeafe, #f8fafc 64%);
}
.meteor {
  position: absolute;
  top: -6rem;
  left: var(--x);
  width: 2px;
  height: 6rem;
  border-radius: 99px;
  background: linear-gradient(to bottom, #2563eb, transparent);
  box-shadow: 0 0 12px #60a5fa;
  animation: fall var(--duration) linear infinite;
  animation-delay: var(--delay);
  transform: rotate(-35deg);
}
.meteors p {
  position: relative;
  font-size: clamp(1.7rem, 5vw, 3rem);
  font-weight: 800;
  color: #0f172a;
}
@keyframes fall {
  from {
    opacity: 0;
    transform: translate3d(0, -4rem, 0) rotate(-35deg);
  }
  15%,
  70% {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translate3d(-12rem, 32rem, 0) rotate(-35deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .meteor {
    animation: none;
    top: 18%;
    opacity: 0.35;
  }
}
</style>
