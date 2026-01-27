<template>
  <div class="pixel-code-block">
    <!-- 代码头部 -->
    <div class="pixel-code-block__header">
      <div class="pixel-code-block__header-left">
        <span v-if="language" class="pixel-code-block__language">
          {{ language }}
        </span>
      </div>
      <div class="pixel-code-block__header-right">
        <button
          v-if="copyable"
          class="pixel-code-block__copy-btn"
          :title="copied ? '已复制!' : '复制代码'"
          @click="handleCopy"
        >
          <PixelIcon v-if="!copied" name="copy" />
          <PixelIcon v-else name="check" />
        </button>
      </div>
    </div>

    <!-- 代码内容 -->
    <div class="pixel-code-block__content">
      <pre class="pixel-code-block__pre"><code class="pixel-code-block__code">{{ code }}</code></pre>
    </div>

    <!-- 滚动条装饰 -->
    <div class="pixel-code-block__scrollbar">
      <div class="pixel-code-block__scrollbar-thumb"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PixelIcon from './PixelIcon.vue'

interface Props {
  code: string
  language?: string
  copyable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  language: '',
  copyable: true
})

const copied = ref(false)

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}
</script>

<style scoped>
.pixel-code-block {
  @apply w-full bg-pixel-dark border-2 border-pixel-cyan rounded-lg overflow-hidden;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
  position: relative;
  
  /* 滚动条样式 */
  &::-webkit-scrollbar {
    @apply w-2;
  }
  
  &::-webkit-scrollbar-track {
    @apply bg-pixel-dark border-l border-pixel-cyan;
  }
  
  &::-webkit-scrollbar-thumb {
    @apply bg-pixel-cyan rounded-full;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    @apply bg-pixel-purple;
  }
}

.pixel-code-block__header {
  @apply flex justify-between items-center px-4 py-2 bg-pixel-cyan bg-opacity-10 border-b-2 border-pixel-cyan;
  font-family: 'Press Start 2P', cursive;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pixel-code-block__header-left {
  @apply flex items-center space-x-2;
}

.pixel-code-block__language {
  @apply text-pixel-cyan;
}

.pixel-code-block__header-right {
  @apply flex items-center space-x-2;
}

.pixel-code-block__copy-btn {
  @apply p-1 rounded border border-pixel-cyan text-pixel-cyan hover:bg-pixel-cyan hover:text-pixel-dark transition-colors duration-200;
  font-size: 12px;
  line-height: 1;
}

.pixel-code-block__content {
  @apply p-4 overflow-auto;
  max-height: 400px;
}

.pixel-code-block__pre {
  @apply m-0 whitespace-pre-wrap break-all;
}

.pixel-code-block__code {
  @apply text-pixel-light;
}

.pixel-code-block__scrollbar {
  @apply absolute bottom-0 right-0 w-2 h-2;
}

.pixel-code-block__scrollbar-thumb {
  @apply w-full h-full bg-pixel-cyan rounded-full;
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .pixel-code-block {
    @apply border-2;
  }
}

/* 减少运动支持 */
@media (prefers-reduced-motion: reduce) {
  .pixel-code-block {
    transition: none;
  }
}
</style>