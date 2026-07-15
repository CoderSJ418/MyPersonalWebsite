<template>
  <div class="marquee-shell">
    <div
      class="marquee"
      :style="{ '--duration': `${Math.max(4, 160 / speed)}s`, '--direction': animationDirection }"
    >
      <ul v-for="copy in 2" :key="copy" :aria-hidden="copy === 2">
        <li v-for="item in items" :key="`${copy}-${item}`">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  speed?: number
  direction?: 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), { speed: 30, direction: 'left' })
const animationDirection = computed(() => (props.direction === 'right' ? 'reverse' : 'normal'))
const items = ['Vue 3', 'TypeScript', 'Vite', 'Tailwind CSS', 'Accessibility', 'Performance']
</script>

<style scoped>
.marquee-shell {
  display: flex;
  min-height: 20rem;
  align-items: center;
  overflow: hidden;
  border-radius: 1rem;
  background: linear-gradient(145deg, #eff6ff, #fff);
  mask-image: linear-gradient(90deg, transparent, black 12%, black 88%, transparent);
}
.marquee {
  display: flex;
  width: max-content;
  animation: scroll var(--duration) linear infinite;
  animation-direction: var(--direction);
}
.marquee ul {
  display: flex;
  flex-shrink: 0;
  gap: 1rem;
  margin: 0;
  padding: 0 0.5rem;
  list-style: none;
}
.marquee li {
  border: 1px solid #bfdbfe;
  border-radius: 999px;
  background: #fff;
  padding: 0.8rem 1.2rem;
  font-weight: 600;
  color: #1e3a8a;
  box-shadow: 0 8px 24px rgb(37 99 235 / 10%);
  white-space: nowrap;
}
@keyframes scroll {
  to {
    transform: translateX(-50%);
  }
}
@media (prefers-reduced-motion: reduce) {
  .marquee {
    width: 100%;
    animation: none;
  }
  .marquee ul {
    flex-wrap: wrap;
    justify-content: center;
  }
  .marquee ul[aria-hidden='true'] {
    display: none;
  }
}
</style>
