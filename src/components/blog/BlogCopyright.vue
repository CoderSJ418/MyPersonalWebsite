<script setup lang="ts">
/**
 * BlogCopyright — 博客版权声明组件
 *
 * 职责：
 * - CC BY-NC-SA 4.0 版权声明
 * - BEM `bc` 前缀，Unified Visual System v6.0
 */
</script>

<template>
  <footer class="bc">
    <p>本文采用 <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener">CC BY-NC-SA
        4.0</a> 协议发布，转载请注明出处。</p>
  </footer>
</template>

<style scoped>
/* ===== 版权声明 ===== */
.bc {
  margin: var(--us-space-8) 0;
  padding: var(--us-space-5) var(--us-space-6);
  font-size: 0.8125rem;
  color: var(--us-text-tertiary);
  background: var(--us-surface-hover);
  border-left: none;
  border: 1px solid var(--us-border);
  border-radius: var(--radius-lg);
  text-align: center;
  line-height: var(--leading-relaxed);
}

.bc a {
  color: var(--us-accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.bc a:hover {
  color: var(--us-accent);
}
</style>