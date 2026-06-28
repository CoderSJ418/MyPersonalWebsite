<template>
  <div
    class="scroll-progress-bar"
    :class="`scroll-progress-bar--${position}`"
    :style="{ height: `${height}px` }"
  >
    <div
      class="scroll-progress-bar__fill"
      :style="{ width: `${progress * 100}%`, backgroundColor: color }"
    ></div>
    <div
      v-if="showPercentage"
      class="scroll-progress-bar__percentage"
      :style="{ color: color }"
    >
      {{ percentage }}%
    </div>
  </div>
</template>

<script setup lang="ts">
import { useScrollProgress } from '@/composables/useScrollProgress'

interface Props {
  height?: number
  color?: string
  position?: 'top' | 'bottom'
  showPercentage?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: 3,
  color: '#3b82f6',
  position: 'top',
  showPercentage: false
})

const {
  progress,
  percentage
} = useScrollProgress({
  height: props.height,
  color: props.color,
  position: props.position,
  showPercentage: props.showPercentage
})
</script>

<style scoped>
.scroll-progress-bar {
  position: fixed;
  left: 0;
  width: 100%;
  z-index: 1000;
}

.scroll-progress-bar--top {
  top: 0;
}

.scroll-progress-bar--bottom {
  bottom: 0;
}

.scroll-progress-bar__fill {
  height: 100%;
  transition: width 0.3s ease;
}

.scroll-progress-bar__percentage {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  font-weight: 600;
}
</style>