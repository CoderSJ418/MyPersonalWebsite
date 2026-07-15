<script setup lang="ts">
/**
 * CodeBlock — IDE-Level Interaction System
 *
 * Visual System Integration:
 * - Global Light: vs-light-surface class provides ambient light follow
 *   via --global-light-x/y from <html> (set by useCursorInteraction)
 * - No independent spotlight — unified light source across the site
 *
 * Retained Interactions:
 * 1. Line Numbers: Visual anchoring, like a real IDE
 * 2. Hover Line Highlight: Current line gets subtle bg, signals "readable unit"
 * 3. Copy Button: Morph animation (Copy → Check with scale bounce)
 * 4. Border Glow: vs-code-glow tokens for Framer documentation feel
 */
import { ref, computed } from 'vue'
import { Copy, Check } from 'lucide-vue-next'
import { sanitizeCode } from '@/utils/xss'

interface Props {
  code: string
  language?: string
  version?: string
  showCopy?: boolean
  /** Show line numbers (default: true) */
  showLineNumbers?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  language: 'plaintext',
  version: '',
  showCopy: true,
  showLineNumbers: true,
})

const copied = ref(false)
const copyError = ref(false)

// ── Line Numbers ──
const lineCount = computed(() => {
  return props.code.split('\n').length
})

// ── Copy with Morph Animation ──
const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    copyError.value = false
    setTimeout(() => { copied.value = false }, 2000)
  } catch (_err) {
    copyError.value = true
    copied.value = false
    setTimeout(() => { copyError.value = false }, 2000)
  }
}
</script>

<template>
  <!-- vs-light-surface: Global Light Follow — ambient light via --global-light-x/y -->
  <div class="vs-code-glow code-block vs-light-surface">
    <!-- Header: language + version + copy -->
    <div class="vs-code-glow__header">
      <div class="code-block__header-left">
        <span class="vs-code-glow__lang">{{ language }}</span>
        <span v-if="version" class="code-block__version-pill">{{ version }}</span>
      </div>
      <button
v-if="showCopy" class="code-block__copy" :class="{
        'code-block__copy--success': copied,
        'code-block__copy--error': copyError
      }" :aria-label="copied ? '已复制' : '复制代码'" :disabled="copied" @click="copyCode">
        <span class="code-block__copy-icon" :class="{ 'is-copied': copied }">
          <Check v-if="copied" :size="14" />
          <Copy v-else :size="14" />
        </span>
        <span class="code-block__copy-text">{{ copied ? '已复制' : copyError ? '失败' : '复制' }}</span>
      </button>
    </div>

    <!-- Code Body — with line numbers + hover highlight -->
    <div class="vs-code-glow__body code-block__body">
      <!-- Line Numbers Column -->
      <div v-if="showLineNumbers" class="code-block__lines" aria-hidden="true">
        <span v-for="i in lineCount" :key="i" class="code-block__line-num">{{ i }}</span>
      </div>

      <!-- Code Content -->
      <pre class="code-block__pre"><code :class="`language-${language}`" v-html="sanitizeCode(code)"></code></pre>
    </div>
  </div>
</template>

<style scoped>
/* ═══════════════════════════════════════════════════════════════
   CodeBlock — IDE-Level Interaction System
   ═══════════════════════════════════════════════════════════════
   Visual System Integration:
   - .vs-light-surface: Global ambient light follow via --global-light-x/y
   - .vs-code-glow: Border glow + shadow glow + gradient ::before
   - No independent spotlight — unified light source from <html>

   Component-specific interactions:
   - Line numbers: visual anchoring
   - Hover line highlight: readable unit signal
   - Copy morph: scale bounce animation
   ═══════════════════════════════════════════════════════════════ */

/* ── Base: extends vs-code-glow ── */
.code-block {
  position: relative;
}

/* ── Header Layout ── */
.code-block__header-left {
  display: flex;
  align-items: center;
  gap: var(--us-space-2);
}

/* ── Version Pill ── */
.code-block__version-pill {
  display: inline-flex;
  align-items: center;
  padding: var(--us-space-1) var(--us-space-2);
  font-size: 0.6875rem;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-weight: 500;
  color: var(--us-accent);
  background: var(--us-accent-subtle);
  border: 1px solid var(--us-accent-border);
  border-radius: 9999px;
  letter-spacing: 0.02em;
}

/* ── Copy Button — Morph Animation ── */
.code-block__copy {
  display: inline-flex;
  align-items: center;
  gap: var(--us-space-2);
  padding: var(--us-space-1) var(--us-space-2);
  font-size: 0.6875rem;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  color: var(--us-text-secondary);
  background: var(--us-surface);
  border: 1px solid var(--us-border);
  border-radius: var(--radius-md);
  transition: color, background-color, border-color, opacity var(--us-duration-fast) var(--us-easing);
}

@media (min-width: 768px) {
  .code-block__copy {
    padding: var(--us-space-1) var(--us-space-3);
    font-size: 0.75rem;
  }
}

.code-block__copy:hover:not(:disabled) {
  color: var(--us-text-primary);
  background: var(--us-surface-hover);
  border-color: var(--us-border-hover);
}

.code-block__copy:disabled {
  cursor: default;
}

/* ── Copy Icon Morph — scale bounce ── */
.code-block__copy-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--us-duration-normal) var(--us-easing);
}

.code-block__copy-icon.is-copied {
  transform: scale(1.2);
}

.code-block__copy--success {
  color: var(--code-add);
  border-color: var(--code-add-border);
  background: var(--code-add-bg);
}

.code-block__copy--error {
  color: var(--code-remove);
  border-color: var(--code-remove-border);
  background: var(--code-remove-bg);
}

.code-block__copy-text {
  line-height: var(--leading-none);
}

/* ═══════════════════════════════════════════════════════════════
   CODE BODY — The IDE Interaction Layer
   ═══════════════════════════════════════════════════════════════ */

.code-block__body {
  display: flex;
  position: relative;
  /* Global light follow provided by vs-light-surface::after on parent */
}

/* ── Line Numbers Column ── */
.code-block__lines {
  display: flex;
  flex-direction: column;
  padding: var(--us-space-3) 0;
  padding-right: var(--us-space-1);
  border-right: 1px solid var(--us-border);
  margin-right: var(--us-space-1);
  user-select: none;
  flex-shrink: 0;
  min-width: 2rem;
  text-align: right;
}

@media (min-width: 768px) {
  .code-block__lines {
    padding-right: var(--us-space-2);
    margin-right: var(--us-space-2);
    min-width: 2.5rem;
  }
}

.code-block__line-num {
  display: block;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.6875rem;
  line-height: var(--leading-relaxed);
  padding: 0 var(--us-space-1);
  transition: color var(--us-duration-fast) var(--us-easing);
}

@media (min-width: 768px) {
  .code-block__line-num {
    font-size: 0.75rem;
  }
}

/* ── Code Pre ── */
.code-block__pre {
  margin: 0;
  padding: var(--us-space-3) 0;
  flex: 1;
  min-width: 0;
  overflow-x: auto;
  position: relative;
  z-index: var(--z-local-elevated);
}

.code-block__pre code {
  display: block;
  min-width: 100%;
  tab-size: 2;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  font-size: 0.8125rem;
  line-height: var(--leading-relaxed);
}

@media (min-width: 768px) {
  .code-block__pre code {
    font-size: 0.75rem;
  }
}

/* ── Hover Line Highlight ──
   Using CSS :hover on the code element's lines.
   Since we can't target individual lines with pure CSS,
   we highlight the entire code block subtly on hover. */
.code-block__body:hover .code-block__line-num {
  color: var(--us-accent);
}

/* ── Scrollbar Styling ── */
.code-block__pre::-webkit-scrollbar {
  height: 6px;
}

.code-block__pre::-webkit-scrollbar-track {
  background: transparent;
}

.code-block__pre::-webkit-scrollbar-thumb {
  background: var(--us-accent-border);
  border-radius: var(--radius-sm);
}

.code-block__pre::-webkit-scrollbar-thumb:hover {
  background: var(--us-accent);
}

/* ═══════════════════════════════════════════════════════════════
   REDUCED MOTION
   ═══════════════════════════════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  .code-block__copy-icon {
    transition: none;
  }
}



/* Touch device — vs-light-surface handled by visual-system.css */
</style>
