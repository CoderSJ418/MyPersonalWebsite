<template>
  <div class="stage">
    <button
      type="button"
      class="shine-button"
      :style="{ '--border': `${borderWidth}px`, '--duration': `${Math.max(1, 20 / speed)}s` }"
    >
      Explore work
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  borderWidth?: number
  speed?: number
}

withDefaults(defineProps<Props>(), { borderWidth: 1, speed: 3 })
</script>

<style scoped>
@property --shine-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
.stage {
  display: grid;
  min-height: 20rem;
  place-items: center;
  border-radius: 1rem;
  background: #eff6ff;
}
.shine-button {
  position: relative;
  z-index: 0;
  overflow: hidden;
  border: 0;
  border-radius: 0.8rem;
  background: transparent;
  padding: 1rem 2rem;
  font-weight: 700;
  color: #1e3a8a;
  cursor: pointer;
}
.shine-button::before {
  content: '';
  position: absolute;
  z-index: -2;
  inset: 0;
  border-radius: inherit;
  background: conic-gradient(
    from var(--shine-angle),
    #bfdbfe 10%,
    #2563eb 35%,
    #7c3aed 50%,
    #bfdbfe 70%
  );
  animation: rotate var(--duration) linear infinite;
}
.shine-button::after {
  content: '';
  position: absolute;
  z-index: -1;
  inset: var(--border);
  border-radius: calc(0.8rem - var(--border));
  background: #fff;
}
.shine-button:hover {
  color: #2563eb;
}
@keyframes rotate {
  to {
    --shine-angle: 360deg;
  }
}
@supports not (background: conic-gradient(from 0deg, red, blue)) {
  .shine-button::before {
    background: #2563eb;
  }
}
@media (prefers-reduced-motion: reduce) {
  .shine-button::before {
    animation: none;
    --shine-angle: 120deg;
  }
}
</style>
