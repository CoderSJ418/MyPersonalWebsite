<template>
  <a
    :href="href"
    :target="target"
    :rel="rel"
    :aria-label="ariaLabel"
    :aria-describedby="ariaDescribedBy"
    :aria-current="ariaCurrent"
    :aria-disabled="disabled"
    :class="[
      'accessible-link',
      `accessible-link--${variant}`,
      { 'accessible-link--disabled': disabled }
    ]"
    @click="handleClick"
  >
    <slot></slot>
    <span v-if="isExternal" class="accessible-link__external">
      <ExternalIcon />
    </span>
  </a>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import ExternalIcon from './icons/ExternalIcon.vue'

interface Props {
  href: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  rel?: string
  ariaLabel?: string
  ariaDescribedBy?: string
  ariaCurrent?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false'
  variant?: 'primary' | 'secondary' | 'text'
  disabled?: boolean
  external?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  target: '_self',
  rel: '',
  variant: 'primary',
  disabled: false,
  external: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const isExternal = computed(() => {
  return props.external || (props.href.startsWith('http') && !props.href.includes(window.location.hostname))
})

const relValue = computed(() => {
  let rel = props.rel || ''
  if (props.target === '_blank') {
    rel += ' noopener noreferrer'
  }
  return rel.trim()
})

const handleClick = (event: MouseEvent) => {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  
  emit('click', event)
  
  // 如果是外部链接，添加访问提示
  if (isExternal.value) {
    console.log(`访问外部链接: ${props.href}`)
  }
}
</script>

<style scoped>
.accessible-link {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  position: relative;
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-sm);
}

.accessible-link--primary {
  color: var(--color-primary);
}

.accessible-link--primary:hover {
  color: var(--color-primary-600);
  background: var(--color-primary-50);
}

.accessible-link--secondary {
  color: var(--color-surface-text);
}

.accessible-link--secondary:hover {
  color: var(--color-primary);
  background: var(--color-surface-bg-secondary);
}

.accessible-link--text {
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

.accessible-link--text:hover {
  color: var(--color-primary-600);
  text-decoration: underline;
}

.accessible-link--disabled {
  color: var(--color-surface-text-tertiary);
  cursor: not-allowed;
  pointer-events: none;
}

.accessible-link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.accessible-link__external {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-left: var(--spacing-1);
  color: inherit;
}

/* 微交互 */
.accessible-link:active {
  transform: scale(0.98);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .accessible-link {
    padding: var(--spacing-2) var(--spacing-3);
  }
}
</style>