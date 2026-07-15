<template>
  <div class="noise-shell">
    <svg class="noise" :style="{ opacity }" aria-hidden="true">
      <filter id="lab-noise-filter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.72"
          numOctaves="3"
          seed="24"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#lab-noise-filter)" />
    </svg>
    <div class="noise-shell__sample">
      <strong>Subtle Texture</strong>
      <span>SVG · deterministic seed</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  opacity?: number
}

withDefaults(defineProps<Props>(), {
  opacity: 0.1
})
</script>

<style scoped>
.noise-shell {
  position: relative;
  display: grid;
  min-height: 20rem;
  place-items: center;
  overflow: hidden;
  border-radius: 1rem;
  background: linear-gradient(145deg, #dbeafe, #fff);
}
.noise {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  mix-blend-mode: multiply;
  pointer-events: none;
}
.noise-shell__sample {
  position: relative;
  display: grid;
  gap: 0.4rem;
  border: 1px solid rgb(255 255 255 / 80%);
  border-radius: 1rem;
  background: rgb(255 255 255 / 72%);
  padding: 2rem;
  color: #0f172a;
  box-shadow: 0 18px 50px rgb(37 99 235 / 12%);
}
.noise-shell__sample strong {
  font-size: 1.4rem;
}
.noise-shell__sample span {
  font-size: 0.85rem;
  color: #64748b;
}
</style>
