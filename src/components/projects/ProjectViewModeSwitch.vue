<template>
  <div class="mode-bar" aria-label="项目阅读模式">
    <button
      type="button"
      class="mode-bar__btn"
      :class="{ 'mode-bar__btn--active': isRecruit }"
      :aria-pressed="isRecruit"
      @click="emit('select-recruit')"
    >
      Recruit
    </button>
    <button
      type="button"
      class="mode-bar__btn"
      :class="{ 'mode-bar__btn--active': isReader }"
      :aria-pressed="isReader"
      @click="emit('select-reader')"
    >
      Reader
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isRecruit: boolean
  isReader: boolean
}

interface Emits {
  (event: 'select-recruit'): void
  (event: 'select-reader'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<style scoped>
.mode-bar {
  display: flex;
  width: fit-content;
  align-self: center;
  margin-bottom: var(--us-space-4);
  overflow: hidden;
  border: 1px solid var(--us-border);
  border-radius: var(--radius-md);
}

.mode-bar__btn {
  min-height: 44px;
  padding: var(--us-space-2) var(--us-space-5);
  color: var(--us-text-secondary);
  background: var(--us-surface);
  border: 0;
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: 0.02em;
  transition:
    color var(--us-duration-fast) var(--us-easing),
    background var(--us-duration-fast) var(--us-easing);
}

.mode-bar__btn:focus-visible {
  outline: 2px solid var(--us-accent);
  outline-offset: -2px;
}

.mode-bar__btn--active {
  color: var(--us-text-primary);
  background: var(--us-accent);
}

.mode-bar__btn:not(.mode-bar__btn--active):hover {
  color: var(--us-text-primary);
  background: var(--us-surface-hover);
}

@media (min-width: 768px) {
  .mode-bar {
    align-self: auto;
  }
}
</style>
