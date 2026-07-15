<script setup lang="ts">
/**
 * BlogMarkdown — 博客Markdown渲染区
 *
 * 职责：
 * - 渲染Markdown HTML内容 + 加载状态
 * - 事件委托处理代码复制
 * - 全套Markdown排版 :deep() 样式
 * - BEM `bm` 前缀，Unified Visual System v6.0
 */

interface Props {
  /** 渲染后的HTML内容 */
  content: string
  /** 是否加载中 */
  isLoading: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  contentClick: [event: MouseEvent]
}>()
</script>

<template>
  <article class="bm">
    <div v-if="isLoading" class="bm__loading">
      <div class="bm__loading-spinner" />
      <p>正在加载内容...</p>
    </div>
    <div v-else class="bm__markdown" @click="emit('contentClick', $event)" v-html="content" />
  </article>
</template>

<style scoped>
/* ===== 根容器 ===== */
.bm {
  min-width: 0;
  max-width: var(--measure-normal);
  order: 1;
}

/* ===== 加载状态 ===== */
.bm__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--us-space-16) var(--us-space-8);
  gap: var(--us-space-4);
  color: var(--us-text-tertiary);
}

.bm__loading-spinner {
  width: 40px;
  height: 40px;
  border: 2px solid var(--us-border);
  border-top-color: var(--us-accent);
  border-radius: 50%;
  animation: bm-spin 0.8s linear infinite;
}

@keyframes bm-spin {
  to {
    transform: rotate(360deg);
  }
}

/* ===== Markdown 排版 — prose 风格 ===== */
.bm__markdown {
  font-size: 1.0625rem;
  line-height: var(--leading-loose);
  color: var(--us-text-primary);
  overflow-wrap: break-word;
}

/* 代码块样式 */
.bm__markdown :deep(.code-wrapper) {
  display: flex;
  flex-direction: column;
  margin: var(--us-space-6) 0;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--us-border);
  box-shadow: var(--us-depth-1);
  background-color: var(--us-surface-hover);
}

.bm__markdown :deep(.code-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--us-space-3) var(--us-space-4);
  background-color: var(--us-surface);
  border-bottom: 1px solid var(--us-border);
}

.bm__markdown :deep(.code-language) {
  font-size: 0.75rem;
  color: var(--us-text-secondary);
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.02em;
  padding: var(--us-space-1) var(--us-space-2);
  background-color: var(--us-surface-hover);
  border-radius: var(--radius-sm);
  border: 1px solid var(--us-border);
}

.bm__markdown :deep(.code-copy) {
  display: inline-flex;
  align-items: center;
  gap: var(--us-space-2);
  padding: var(--us-space-2) var(--us-space-3);
  font-size: 0.875rem;
  line-height: var(--leading-none);
  color: var(--us-text-primary);
  background-color: var(--us-surface);
  border: 1px solid var(--us-border);
  border-radius: var(--radius-md);
  transition: color, background-color, border-color, opacity var(--us-duration-fast) var(--us-easing);
  flex-shrink: 0;
}

.bm__markdown :deep(.code-copy:hover) {
  background-color: var(--us-surface-hover);
  border-color: var(--us-border-hover);
}

.bm__markdown :deep(.code-copy.copied) {
  color: var(--us-accent);
  border-color: var(--us-accent);
}

.bm__markdown :deep(.code-wrapper pre) {
  margin: 0;
  padding: var(--us-space-6);
  overflow-x: auto;
  white-space: pre;
  tab-size: 2;
  -webkit-overflow-scrolling: touch;
}

.bm__markdown :deep(.code-wrapper pre::-webkit-scrollbar) {
  height: 6px;
}

.bm__markdown :deep(.code-wrapper pre::-webkit-scrollbar-track) {
  background: transparent;
}

.bm__markdown :deep(.code-wrapper pre::-webkit-scrollbar-thumb) {
  background-color: var(--us-border);
  border-radius: var(--radius-sm);
}

.bm__markdown :deep(.code-wrapper code) {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  line-height: var(--leading-relaxed);
  padding: 0;
  background: none;
  border-radius: 0;
  overflow-wrap: normal;
  word-wrap: normal;
}

/* 亮色模式代码块背景由 .code-wrapper 控制 */
.bm__markdown :deep(.hljs) {
  /* background-color 由 .code-wrapper 提供，pre 不再设置 */
}

/* 标题 */
.bm__markdown :deep(h1),
.bm__markdown :deep(h2),
.bm__markdown :deep(h3),
.bm__markdown :deep(h4),
.bm__markdown :deep(h5),
.bm__markdown :deep(h6) {
  font-weight: 600;
  color: var(--us-text-primary);
  line-height: var(--leading-snug);
}

.bm__markdown :deep(h1) {
  font-size: 2rem;
  margin: var(--us-space-10) 0 var(--us-space-4);
}

.bm__markdown :deep(h2) {
  font-size: 1.75rem;
  margin: var(--us-space-8) 0 var(--us-space-4);
  padding-bottom: var(--us-space-2);
  border-bottom: 1px solid var(--us-border);
}

.bm__markdown :deep(h3) {
  font-size: 1.5rem;
  margin: var(--us-space-6) 0 var(--us-space-3);
}

.bm__markdown :deep(h4) {
  font-size: 1.25rem;
  margin: var(--us-space-6) 0 var(--us-space-3);
}

.bm__markdown :deep(h5) {
  font-size: 1.125rem;
}

.bm__markdown :deep(h6) {
  font-size: 1rem;
}

.bm__markdown :deep(h5),
.bm__markdown :deep(h6) {
  margin: var(--us-space-5) 0 var(--us-space-2);
}

/* 首个子元素不需要顶部margin */
.bm__markdown> :deep(:first-child) {
  margin-top: 0;
}

.bm__markdown :deep(p) {
  margin: var(--us-space-5) 0;
}

.bm__markdown :deep(p:first-child) {
  margin-top: 0;
}

.bm__markdown :deep(a) {
  color: var(--us-accent);
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 2px;
  transition: color, opacity var(--us-duration-normal) var(--us-easing);
}

.bm__markdown :deep(a:hover) {
  text-decoration-thickness: 3px;
}

.bm__markdown :deep(ul),
.bm__markdown :deep(ol) {
  margin: var(--us-space-5) 0;
  padding-left: var(--us-space-8);
}

.bm__markdown :deep(li) {
  margin: var(--us-space-2) 0;
}

.bm__markdown :deep(blockquote) {
  position: relative;
  margin: var(--us-space-6) 0;
  padding: var(--us-space-4) var(--us-space-6) var(--us-space-4) var(--us-space-10);
  border-left: none;
  border: 1px solid var(--us-border);
  border-radius: var(--radius-lg);
  background-color: var(--us-surface-hover);
  color: var(--us-text-secondary);
}

.bm__markdown :deep(blockquote)::before {
  content: '\201C';
  position: absolute;
  top: -0.25rem;
  left: 0.5rem;
  font-size: 2.5rem;
  font-family: Georgia, 'Times New Roman', serif;
  color: var(--us-accent);
  opacity: 0.25;
  line-height: var(--leading-none);
  pointer-events: none;
}

.bm__markdown :deep(code) {
  padding: var(--us-space-1) var(--us-space-2);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875em;
  color: var(--us-accent);
  background-color: var(--us-surface-hover);
  border-radius: var(--radius-sm);
}

/* 非 hljs 代码块内的 code 也需重置行内样式 */
.bm__markdown :deep(pre:not(.hljs) code) {
  padding: 0;
  background: none;
  border-radius: 0;
  font-size: 0.875rem;
  color: var(--us-text-primary);
  white-space: pre;
}

.bm__markdown :deep(pre:not(.hljs)) {
  margin: var(--us-space-6) 0;
  padding: var(--us-space-4);
  overflow-x: auto;
  background-color: var(--us-surface-hover);
  border-radius: var(--radius-lg);
  border: 1px solid var(--us-border);
}

.bm__markdown :deep(img) {
  display: block;
  max-width: 100%;
  height: auto;
  margin: var(--us-space-6) auto;
  border-radius: var(--radius-lg);
}

.bm__markdown :deep(table) {
  display: block;
  width: 100%;
  margin: var(--us-space-6) 0;
  border-collapse: collapse;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.bm__markdown :deep(th),
.bm__markdown :deep(td) {
  padding: var(--us-space-3) var(--us-space-4);
  border: 1px solid var(--us-border);
  text-align: left;
}

.bm__markdown :deep(th) {
  font-weight: 600;
  background-color: var(--us-surface-hover);
}

.bm__markdown :deep(hr) {
  margin: var(--us-space-8) 0;
  border: none;
  border-top: 1px solid var(--us-border);
}

.bm__markdown :deep(kbd) {
  display: inline-block;
  padding: var(--us-space-1) var(--us-space-2);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8em;
  color: var(--us-text-primary);
  background-color: var(--us-surface-hover);
  border: 1px solid var(--us-border);
  border-radius: var(--radius-sm);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
}

.bm__markdown :deep(mark) {
  padding: var(--us-space-1) var(--us-space-1);
  background-color: rgba(250, 204, 21, 0.3);
  color: inherit;
  border-radius: 2px;
}

.bm__markdown :deep(figure) {
  margin: var(--us-space-6) 0;
}

.bm__markdown :deep(figcaption) {
  margin-top: var(--us-space-2);
  font-size: 0.875rem;
  color: var(--us-text-tertiary);
  text-align: center;
}

/* ===== One Dark 语法高亮 ===== */
.bm__markdown :deep(.hljs) {
  color: #abb2bf;
}

.bm__markdown :deep(.hljs-keyword),
.bm__markdown :deep(.hljs-selector-tag),
.bm__markdown :deep(.hljs-built_in) {
  color: #c678dd;
}

.bm__markdown :deep(.hljs-string),
.bm__markdown :deep(.hljs-attr),
.bm__markdown :deep(.hljs-template-variable) {
  color: #98c379;
}

.bm__markdown :deep(.hljs-title),
.bm__markdown :deep(.hljs-section),
.bm__markdown :deep(.hljs-function) {
  color: #61afef;
}

.bm__markdown :deep(.hljs-comment),
.bm__markdown :deep(.hljs-quote) {
  color: #5c6370;
  font-style: italic;
}

.bm__markdown :deep(.hljs-number),
.bm__markdown :deep(.hljs-literal),
.bm__markdown :deep(.hljs-type),
.bm__markdown :deep(.hljs-params) {
  color: #d19a66;
}

.bm__markdown :deep(.hljs-meta),
.bm__markdown :deep(.hljs-tag) {
  color: #e06c75;
}

.bm__markdown :deep(.hljs-variable),
.bm__markdown :deep(.hljs-name) {
  color: #e06c75;
}

.bm__markdown :deep(.hljs-symbol),
.bm__markdown :deep(.hljs-bullet),
.bm__markdown :deep(.hljs-link) {
  color: #56b6c2;
}

.bm__markdown :deep(.hljs-addition) {
  color: #98c379;
  background-color: rgba(152, 195, 121, 0.1);
}

.bm__markdown :deep(.hljs-deletion) {
  color: #e06c75;
  background-color: rgba(224, 108, 117, 0.1);
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .bm__markdown {
    font-size: 0.9375rem;
    line-height: var(--leading-relaxed);
  }

  .bm__markdown :deep(h1) {
    font-size: 1.5rem;
  }

  .bm__markdown :deep(h2) {
    font-size: 1.375rem;
  }

  .bm__markdown :deep(h3) {
    font-size: 1.25rem;
  }

  .bm__markdown :deep(.code-wrapper pre) {
    padding: var(--us-space-4);
  }

  .bm__markdown :deep(.code-wrapper code) {
    font-size: 0.8125rem;
  }

  .bm__markdown :deep(.code-header) {
    padding: var(--us-space-2) var(--us-space-3);
  }
}
</style>