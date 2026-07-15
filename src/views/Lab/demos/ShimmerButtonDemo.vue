<template>
  <div class="shimmer-stage" :class="{ 'shimmer-stage--embedded': embedded }">
    <component
      :is="href ? 'a' : 'button'"
      :type="href ? undefined : 'button'"
      :href="href"
      :target="target"
      :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
      :download="download || undefined"
      :aria-label="label"
      class="shimmer-button"
      :style="{ '--duration': `${Math.max(0.8, 3 / duration)}s` }"
    >
      <slot>Start a conversation</slot>
    </component>
  </div>
</template>

<script setup lang="ts">
interface Props {
  duration?: number
  embedded?: boolean
  href?: string
  target?: '_blank' | '_self'
  download?: boolean
  label?: string
}

withDefaults(defineProps<Props>(), {
  duration: 2,
  embedded: false,
  href: '',
  target: '_self',
  download: false,
  label: '开始沟通'
})
</script>

<style scoped>
.shimmer-stage {
  display: grid;
  min-height: 20rem;
  place-items: center;
  border-radius: 1rem;
  background: linear-gradient(145deg, #eff6ff, #fff);
}
.shimmer-stage--embedded {
  display: inline-flex;
  min-height: 0;
  border-radius: 0;
  background: transparent;
}
.shimmer-button {
  position: relative;
  overflow: hidden;
  border: 0;
  border-radius: 0.75rem;
  background: #2563eb;
  padding: 1rem 1.6rem;
  font-weight: 700;
  color: #fff;
  box-shadow: 0 14px 35px rgb(37 99 235 / 28%);
  cursor: pointer;
  text-decoration: none;
}
.shimmer-button::after {
  content: '';
  position: absolute;
  inset: -50% auto -50% -45%;
  width: 35%;
  transform: rotate(18deg);
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 65%), transparent);
  animation: sweep var(--duration) ease-in-out infinite;
}
.shimmer-button:hover {
  background: #1d4ed8;
}
@keyframes sweep {
  55%,
  100% {
    left: 120%;
  }
}
@media (prefers-reduced-motion: reduce) {
  .shimmer-button::after {
    animation: none;
    display: none;
  }
}
</style>
