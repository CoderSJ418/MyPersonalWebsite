<template>
  <div class="pixel-list" :class="`pixel-list--${type}`">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'ul' | 'ol' | 'dl'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'ul'
})
</script>

<style scoped>
.pixel-list {
  @apply w-full;
  
  /* 列表类型 */
  &.pixel-list--ul {
    @apply list-none pl-0;
  }
  
  &.pixel-list--ol {
    @apply list-none pl-0;
  }
  
  &.pixel-list--dl {
    @apply space-y-2;
  }
  
  /* 列表项样式 */
  & > * {
    @apply py-1 text-pixel-light;
  }
  
  & > li {
    @apply relative pl-4;
  }
  
  & > li::before {
    content: '•';
    @apply absolute left-0 text-pixel-cyan;
  }
  
  & > li::marker {
    color: #00FFFF;
  }
  
  & > ol > li::before {
    content: '';
  }
  
  & > ol > li::marker {
    color: #00FFFF;
  }
}
</style>