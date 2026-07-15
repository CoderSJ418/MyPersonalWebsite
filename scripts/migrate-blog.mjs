/**
 * Backward-compatible entry point for the retired JSON-to-Markdown migration.
 * Markdown is now the only source of truth; running this command refreshes metadata.
 */
console.warn('[migrate-blog] 旧索引迁移已停用，改为校验 Markdown 并刷新元数据。')
await import('./generate-blog-meta.mjs')
