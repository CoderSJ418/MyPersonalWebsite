<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  variant?: 'primary' | 'secondary' | 'accent'
}
const props = withDefaults(defineProps<Props>(), {
  variant: 'primary'
})

const colorMap = {
  primary: { bg: 'bg-primary-500/10', text: 'text-primary-600' },
  secondary: { bg: 'bg-cyan-500/10', text: 'text-cyan-600' },
  accent: { bg: 'bg-orange-500/10', text: 'text-orange-600' }
}
const colors = computed(() => colorMap[props.variant])
</script>

<template>
  <span :class="['px-3 py-1 rounded-xl text-sm font-medium', colors.bg, colors.text]">
    {{ name }}
  </span>
</template>
