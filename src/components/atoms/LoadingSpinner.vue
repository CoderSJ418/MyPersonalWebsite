<template>
  <div 
    class="loading-spinner"
    :class="{ 'loading-spinner--large': size === 'lg' }"
    :aria-label="label"
    role="status"
  >
    <svg class="spinner" viewBox="0 0 50 50">
      <circle
        class="spinner__path"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke-width="5"
        stroke-linecap="round"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  label: '加载中...'
})
</script>

<style scoped>
.loading-spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.loading-spinner--large {
  width: 60px;
  height: 60px;
}

.spinner {
  animation: rotate 2s linear infinite;
  width: 100%;
  height: 100%;
}

.spinner__path {
  stroke: var(--color-primary);
  stroke-dasharray: 150;
  stroke-dashoffset: 100;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dashoffset: 100;
  }
  50% {
    stroke-dashoffset: 25;
  }
  100% {
    stroke-dashoffset: 100;
  }
}
</style>