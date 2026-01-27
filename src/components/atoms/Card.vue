<template>
  <article 
    class="card"
    :class="[
      `card--${variant}`,
      { 'card--interactive': interactive, 'card--hover': hover }
    ]"
    @click="handleClick"
  >
    <div v-if="$slots.header" class="card__header">
      <slot name="header"></slot>
    </div>
    
    <div v-if="$slots.image" class="card__image">
      <slot name="image"></slot>
    </div>
    
    <div class="card__content">
      <slot name="content"></slot>
    </div>
    
    <div v-if="$slots.footer" class="card__footer">
      <slot name="footer"></slot>
    </div>
  </article>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Props {
  variant?: 'default' | 'primary' | 'secondary'
  interactive?: boolean
  hover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  interactive: false,
  hover: true
})

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  if (props.interactive) {
    emit('click')
  }
}
</script>

<style scoped>
.card {
  background: var(--color-surface-card);
  border: 1px solid var(--color-surface-card-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
}

.card--primary {
  border-color: var(--color-primary);
  background: var(--color-primary-50);
}

.card--secondary {
  border-color: var(--color-surface-border-secondary);
  background: var(--color-surface-bg-secondary);
}

.card--interactive {
  cursor: pointer;
}

.card:hover:not(.card--disabled) {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.card:active:not(.card--disabled) {
  transform: translateY(-2px);
}

.card__header {
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--color-surface-border);
}

.card__image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.card:hover .card__image img {
  transform: scale(1.05);
}

.card__content {
  padding: var(--spacing-6);
}

.card__footer {
  padding: var(--spacing-4);
  border-top: 1px solid var(--color-surface-border);
  background: var(--color-surface-bg-secondary);
}
</style>