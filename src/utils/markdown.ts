import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import toc from 'markdown-it-table-of-contents'
import { sanitizeHtml } from './xss'

export const ARTICLE_FOLD_MARKER = '<!-- article-fold -->'

/** Split an intentionally long article before rendering its deferred body. */
export function splitExpandableMarkdown(content: string) {
  const markerIndex = content.indexOf(ARTICLE_FOLD_MARKER)
  if (markerIndex === -1) {
    return { preview: content, full: content, isExpandable: false }
  }

  const preview = content.slice(0, markerIndex).trim()
  const remainder = content.slice(markerIndex + ARTICLE_FOLD_MARKER.length).trim()
  return {
    preview,
    full: `${preview}\n\n${remainder}`,
    isExpandable: remainder.length > 0,
  }
}

// 按需导入 highlight.js — 仅注册博客实际使用的5种语言，体积从304KB降至49KB gzip
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let hljs: any = null
let hljsLoaded = false

// 语言别名映射（博客markdown中使用的语言名 → hljs注册名）
const LANG_ALIASES: Record<string, string> = {
  vue: 'xml',
  html: 'xml',
  js: 'javascript',
  ts: 'typescript',
  jsx: 'javascript',
  tsx: 'typescript',
}

async function loadHighlightJS() {
  if (hljsLoaded) {
    return hljs
  }

  try {
    // 导入 hljs core（不含任何语言，约2KB）
    const hljsModule = await import('highlight.js/lib/core')
    hljs = hljsModule.default

    // 并行注册5种博客常用语言
    const [javascript, typescript, css, xml, markdown] = await Promise.all([
      import('highlight.js/lib/languages/javascript'),
      import('highlight.js/lib/languages/typescript'),
      import('highlight.js/lib/languages/css'),
      import('highlight.js/lib/languages/xml'),
      import('highlight.js/lib/languages/markdown'),
    ])

    hljs.registerLanguage('javascript', javascript.default)
    hljs.registerLanguage('typescript', typescript.default)
    hljs.registerLanguage('css', css.default)
    hljs.registerLanguage('xml', xml.default)
    hljs.registerLanguage('markdown', markdown.default)

    hljsLoaded = true
    return hljs
  } catch (error) {
    console.error('Failed to load highlight.js:', error)
    return null
  }
}

/** 生成代码块外壳 HTML（含复制按钮） */
function buildCodeBlock(lang: string, codeBody: string, rawEscaped: string): string {
  return `<div class="code-wrapper">
  <div class="code-header">
    <span class="code-language">${lang || 'plaintext'}</span>
    <button class="code-copy" data-code="${rawEscaped}">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <span>复制</span>
    </button>
  </div>
  <pre class="hljs"><code class="language-${lang || 'plaintext'}">${codeBody}</code></pre>
</div>`
}

/** 同步 highlight 函数 — 依赖 hljs 已加载 */
function highlightWithHljs(str: string, lang: string, md: MarkdownIt): string {
  const escapedCode = md.utils.escapeHtml(str)
  // 应用语言别名映射（vue→xml, js→javascript 等）
  const resolvedLang = LANG_ALIASES[lang] || lang
  if (hljs && resolvedLang && hljs.getLanguage(resolvedLang)) {
    try {
      const highlighted = hljs.highlight(str, { language: resolvedLang }).value
      return buildCodeBlock(lang, highlighted, escapedCode)
    } catch (_) { /* 高亮失败，回退纯文本 */ }
  }
  return buildCodeBlock(lang || 'plaintext', escapedCode, escapedCode)
}

// Markdown 渲染器（highlight 函数在渲染时通过闭包引用 hljs）
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => highlightWithHljs(str, lang, md)
})

// 同步 Markdown 渲染器（无高亮，用于 fallback）
const mdSync = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    const escapedCode = mdSync.utils.escapeHtml(str)
    return buildCodeBlock(lang || 'plaintext', escapedCode, escapedCode)
  }
})

// 使用 anchor 插件为标题添加锚点
md.use(anchor, {
  permalink: anchor.permalink.linkInsideHeader({
    symbol: '#',
    placement: 'before',
    class: 'header-anchor'
  }),
  level: [1, 2, 3, 4, 5, 6],
  slugify: (s: string) => {
    return encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'))
  }
})

// 使用 table-of-contents 插件生成目录
md.use(toc, {
  includeLevel: [2, 3, 4],
  containerClass: 'table-of-contents',
  listType: 'ul',
  listHeader: '',
  listClass: 'toc-list',
  listItemClass: 'toc-item',
  linkClass: 'toc-link',
  callback: function (html: string) {
    return html
  }
})

// 使用 anchor 插件为标题添加锚点（同步版本）
mdSync.use(anchor, {
  permalink: anchor.permalink.linkInsideHeader({
    symbol: '#',
    placement: 'before',
    class: 'header-anchor'
  }),
  level: [1, 2, 3, 4, 5, 6],
  slugify: (s: string) => {
    return encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'))
  }
})

// 使用 table-of-contents 插件生成目录（同步版本）
mdSync.use(toc, {
  includeLevel: [2, 3, 4],
  containerClass: 'table-of-contents',
  listType: 'ul',
  listHeader: '',
  listClass: 'toc-list',
  listItemClass: 'toc-item',
  linkClass: 'toc-link',
  callback: function (html: string) {
    return html
  }
})

// 覆盖 fence 渲染器 — 直接使用 highlight 函数的完整输出，避免 markdown-it 自动包裹 <pre><code>
// markdown-it 默认行为：若 highlight 返回值不以 <pre 开头，则包裹 <pre><code>...</code></pre>
// 我们的 buildCodeBlock 返回 <div class="code-wrapper">...</div>，会被额外包裹导致嵌套无效 HTML
md.renderer.rules.fence = (tokens, idx) => {
  const token = tokens[idx]
  const info = token.info ? token.info.trim() : ''
  const lang = info.split(/\s+/)[0] || ''
  const code = token.content
  return highlightWithHljs(code, lang, md) + '\n'
}

mdSync.renderer.rules.fence = (tokens, idx) => {
  const token = tokens[idx]
  const info = token.info ? token.info.trim() : ''
  const lang = info.split(/\s+/)[0] || ''
  const code = token.content
  const escapedCode = mdSync.utils.escapeHtml(code)
  return buildCodeBlock(lang || 'plaintext', escapedCode, escapedCode) + '\n'
}

// ── 渲染结果缓存（LRU，避免重复渲染同一文章） ──
const renderCache = new Map<string, string>()
const RENDER_CACHE_MAX = 20

function cacheGet(content: string): string | undefined {
  return renderCache.get(content)
}

function cacheSet(content: string, result: string): void {
  if (renderCache.size >= RENDER_CACHE_MAX) {
    // 删除最早的条目（Map 保持插入顺序）
    const firstKey = renderCache.keys().next().value
    if (firstKey !== undefined) renderCache.delete(firstKey)
  }
  renderCache.set(content, result)
}

/** 清除渲染缓存（用于主题切换等场景） */
export function clearRenderCache(): void {
  renderCache.clear()
}

// Markdown 渲染函数（异步版本 — 先加载 hljs 再同步渲染，带缓存）
export async function renderMarkdown(content: string): Promise<string> {
  if (!content) {
    return ''
  }
  // 检查缓存
  const cached = cacheGet(content)
  if (cached) return cached

  // 确保 highlight.js 已加载，再同步渲染
  await loadHighlightJS()
  const rendered = md.render(content)
  const sanitized = sanitizeHtml(rendered)

  // 存入缓存
  cacheSet(content, sanitized)
  return sanitized
}

// 同步版本（用于不需要高亮的场景，带缓存）
export function renderMarkdownSync(content: string): string {
  if (!content) {
    return ''
  }
  // 检查缓存
  const cached = cacheGet(content)
  if (cached) return cached

  // 渲染 Markdown 后进行 XSS 过滤
  const rendered = mdSync.render(content)
  const sanitized = sanitizeHtml(rendered)

  // 存入缓存
  cacheSet(content, sanitized)
  return sanitized
}

// 从 Markdown 内容中提取标题（用于生成目录）
export function extractHeadings(content: string): Array<{
  level: number
  text: string
  id: string
}> {
  const headings: Array<{ level: number; text: string; id: string }> = []
  const headingRegex = /^(#{1,6})\s+(.+)$/gm

  let match
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = encodeURIComponent(String(text).trim().toLowerCase().replace(/\s+/g, '-'))
    headings.push({ level, text, id })
  }

  return headings
}

// 计算阅读时间（基于字数）
export function calculateReadingTime(content: string): number {
  if (!content) {
    return 0
  }

  // 移除 Markdown 语法，只保留纯文本
  const plainText = content
    .replace(/#+\s/g, '') // 移除标题
    .replace(/\*\*/g, '') // 移除粗体
    .replace(/\*/g, '') // 移除斜体
    .replace(/`/g, '') // 移除代码标记
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接，保留文本
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // 移除图片
    .replace(/\n/g, ' ') // 移除换行

  // 计算字数（中文字符 + 英文单词）
  const chineseChars = (plainText.match(/[\u4e00-\u9fa5]/g) || []).length
  const englishWords = (plainText.match(/[a-zA-Z]+/g) || []).length

  // 假设阅读速度：中文 400 字/分钟，英文 200 词/分钟
  const readingTime = Math.ceil(chineseChars / 400 + englishWords / 200)

  return readingTime
}

// 移除 Markdown 语法，提取纯文本摘要
export function extractExcerpt(content: string, maxLength: number = 200): string {
  if (!content) {
    return ''
  }

  // 移除 Markdown 语法
  const plainText = content
    .replace(/#+\s/g, '') // 移除标题
    .replace(/\*\*/g, '') // 移除粗体
    .replace(/\*/g, '') // 移除斜体
    .replace(/`/g, '') // 移除代码标记
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接，保留文本
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // 移除图片
    .replace(/\n/g, ' ') // 移除换行
    .trim()

  // 截取指定长度
  if (plainText.length <= maxLength) {
    return plainText
  }

  return plainText.substring(0, maxLength) + '...'
}
