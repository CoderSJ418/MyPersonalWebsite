<template>
  <div class="pattern-shell">
    <svg class="pattern" :style="{ opacity }" aria-hidden="true">
      <defs>
        <pattern
          id="lab-grid-pattern"
          :width="gridSize"
          :height="gridSize"
          patternUnits="userSpaceOnUse"
        >
          <path
            :d="`M ${gridSize} 0 L 0 0 0 ${gridSize}`"
            fill="none"
            stroke="currentColor"
            stroke-width="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#lab-grid-pattern)" />
    </svg>
    <div class="pattern-shell__card">System Grid</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  opacity?: number
  gridSize?: number
}

withDefaults(defineProps<Props>(), {
  opacity: 0.5,
  gridSize: 40
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
  background: #f8fafc;
  color: #2563eb;
}
.pattern {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  mask-image: linear-gradient(to bottom, black, transparent);
}
.pattern-shell__card {
  position: relative;
  border: 1px solid #bfdbfe;
  border-radius: 0.75rem;
  background: rgb(255 255 255 / 85%);
  padding: 1.25rem 2rem;
  font-weight: 700;
  color: #0f172a;
  box-shadow: 0 10px 30px rgb(37 99 235 / 10%);
}
</style>
