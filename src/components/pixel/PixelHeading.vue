<template>
  <component
    :is="tag"
    :class="[
      'pixel-heading',
      `pixel-heading--${level}`,
      { 'pixel-heading--pixel-font': pixelFont }
    ]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  tag?: string
  pixelFont?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  level: 1,
  tag: 'h1',
  pixelFont: false
})
</script>

<style scoped>
.pixel-heading {
  @apply font-medium text-pixel-cyan;
  line-height: 1.2;
  letter-spacing: -0.025em;
  
  /* 标题级别 */
  &.pixel-heading--1 {
    @apply text-4xl font-bold;
  }
  
  &.pixel-heading--2 {
    @apply text-3xl font-bold;
  }
  
  &.pixel-heading--3 {
    @apply text-2xl font-bold;
  }
  
  &.pixel-heading--4 {
    @apply text-xl font-bold;
  }
  
  &.pixel-heading--5 {
    @apply text-lg font-bold;
  }
  
  &.pixel-heading--6 {
    @apply text-base font-bold;
  }
  
  /* 像素字体 */
  &.pixel-heading--pixel-font {
    font-family: 'Press Start 2P', cursive;
    font-weight: 400;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  }
}
</style>