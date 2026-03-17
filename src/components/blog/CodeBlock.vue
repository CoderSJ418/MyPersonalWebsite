<script setup lang="ts">
import { ref } from 'vue'
import { Copy, Check } from 'lucide-vue-next'
import { sanitizeCode } from '@/utils/xss'

interface Props {
  code: string
  language?: string
  version?: string
  showCopy?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  language: 'plaintext',
  version: '',
  showCopy: true
})

const copied = ref(false)
const copyError = ref(false)

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    copyError.value = false

    // 2秒后重置复制状态
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy code:', err)
    copyError.value = true
    copied.value = false

    // 2秒后重置错误状态
    setTimeout(() => {
      copyError.value = false
    }, 2000)
  }
}
</script>

<template>
  <div class="code-block">
    <!-- 代码版本标注 -->
    <div v-if="version" class="code-block__version">
      <span class="code-block__version-text">{{ version }}</span>
    </div>

    <!-- 代码块头部 -->
    <div class="code-block__header">
      <span class="code-block__language">{{ language }}</span>
      <button
        v-if="showCopy"
        class="code-block__copy"
        :aria-label="copied ? '已复制' : '复制代码'"
        :disabled="copied"
        @click="copyCode"
      >
        <Copy v-if="!copied" :size="16" />
        <Check v-else :size="16" class="code-block__copy-icon-success" />
        <span class="code-block__copy-text">
          {{ copied ? '已复制' : '复制' }}
        </span>
      </button>
    </div>

    <!-- 代码内容 -->
    <pre
      class="code-block__content"
    ><code :class="`language-${language}`" v-html="sanitizeCode(code)"></code></pre>
  </div>
</template>

<style scoped>
.code-block {
  position: relative;
  margin: 1.5rem 0;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
}

.code-block__version {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.25rem 0.75rem;
  background-color: var(--color-bg-tertiary);
  border-bottom-left-radius: 0.5rem;
  border-bottom: 1px solid var(--color-border);
  border-left: 1px solid var(--color-border);
  z-index: 10;
}

.code-block__version-text {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
}

.code-block__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: var(--color-bg-tertiary);
  border-bottom: 1px solid var(--color-border);
}

.code-block__language {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.code-block__copy {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  color: var(--color-text-primary);
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.code-block__copy:hover:not(:disabled) {
  background-color: var(--color-bg-secondary);
  border-color: var(--color-text-secondary);
}

.code-block__copy:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.code-block__copy-icon-success {
  color: var(--color-success);
}

.code-block__copy-text {
  font-size: 0.875rem;
}

.code-block__content {
  margin: 0;
  padding: 1.5rem;
  overflow-x: auto;
  background-color: var(--color-bg-secondary);
}

.code-block__content code {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-text-primary);
}

/* 响应式 */
@media (max-width: 768px) {
  .code-block__content {
    padding: 1rem;
  }

  .code-block__content code {
    font-size: 0.8125rem;
  }
}
</style>
