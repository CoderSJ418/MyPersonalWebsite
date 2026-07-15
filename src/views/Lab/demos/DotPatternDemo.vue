<template>
  <div class="pattern-shell">
    <svg class="pattern" aria-hidden="true">
      <defs>
        <pattern
          id="lab-dot-pattern"
          :width="spacing"
          :height="spacing"
          patternUnits="userSpaceOnUse"
        >
          <circle :cx="spacing / 2" :cy="spacing / 2" :r="dotSize" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#lab-dot-pattern)" />
    </svg>
    <p>Precise by design</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  dotSize?: number
  spacing?: number
}

withDefaults(defineProps<Props>(), {
  dotSize: 2,
  spacing: 20
})
</script>

<style scoped>
.pattern-shell {
  position: relative;
  display: grid;
  min-height: 20rem;
  place-items: center;
  overflow: hidden;
  border-radius: 1rem;
  background: linear-gradient(135deg, #fff, #eff6ff);
  color: #60a5fa;
}
.pattern {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  mask-image: radial-gradient(circle, black 20%, transparent 75%);
}
.pattern-shell p {
  position: relative;
  font-size: clamp(1.5rem, 5vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #0f172a;
}
</style>
