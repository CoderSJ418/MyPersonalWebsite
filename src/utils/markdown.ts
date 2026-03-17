import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import toc from 'markdown-it-table-of-contents'
import { sanitizeHtml } from './xss'

// 动态导入 highlight.js 以减少初始加载体积
let hljs: { default: unknown } | null = null
let hljsLoaded = false

async function loadHighlightJS() {
  if (hljsLoaded) {
    return hljs
  }

  try {
    // 动态导入 highlight.js
    const hljsModule = await import('highlight.js')
    hljs = hljsModule.default
    hljsLoaded = true
    return hljs
  } catch (error) {
    console.error('Failed to load highlight.js:', error)
    return null
  }
}

// 异步 highlight 函数（用于 renderMarkdown）
async function highlightAsync(str: string, lang: string): Promise<string> {
  try {
    // 异步加载 highlight.js
    const highlighter = await loadHighlightJS()
    
    // 如果指定了语言且 highlight.js 支持，则进行高亮
    if (highlighter && lang && highlighter.getLanguage(lang)) {
      try {
        const highlightedCode = highlighter.highlight(str, { language: lang }).value
        const escapedCode = mdAsync.utils.escapeHtml(str)
        return `<div class="code-wrapper">
          <div class="code-header">
            <span class="code-language">${lang}</span>
            <button class="code-copy" data-code="${escapedCode}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>复制</span>
            </button>
          </div>
          <pre class="hljs"><code class="language-${lang}">${highlightedCode}</code></pre>
        </div>`
      } catch (__) {}
    }

    // 如果没有指定语言或不支持，则不进行高亮
    const escapedCode = mdAsync.utils.escapeHtml(str)
    return `<div class="code-wrapper">
      <div class="code-header">
        <span class="code-language">${lang || 'plaintext'}</span>
        <button class="code-copy" data-code="${escapedCode}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span>复制</span>
        </button>
      </div>
      <pre class="hljs"><code>${escapedCode}</code></pre>
    </div>`
  } catch (error) {
    // 如果异步高亮失败，使用简单的转义
    const escapedCode = mdAsync.utils.escapeHtml(str)
    return `<div class="code-wrapper">
      <div class="code-header">
        <span class="code-language">${lang || 'plaintext'}</span>
      </div>
      <pre><code>${escapedCode}</code></pre>
    </div>`
  }
}

// 同步 highlight 函数（用于 renderMarkdownSync）
function highlightSync(str: string, lang: string): string {
  // 同步版本不进行高亮，只进行转义
  const escapedCode = mdSync.utils.escapeHtml(str)
  return `<div class="code-wrapper">
    <div class="code-header">
      <span class="code-language">${lang || 'plaintext'}</span>
      <button class="code-copy" data-code="${escapedCode}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <span>复制</span>
      </button>
    </div>
    <pre><code>${escapedCode}</code></pre>
  </div>`
}

// 异步 Markdown 渲染器（带高亮）
const mdAsync = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: highlightAsync
})

// 同步 Markdown 渲染器（不带高亮）
const mdSync = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: highlightSync
})

// 使用 anchor 插件为标题添加锚点（异步版本）
mdAsync.use(anchor, {
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

// 使用 table-of-contents 插件生成目录（异步版本）
mdAsync.use(toc, {
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

// Markdown 渲染函数（异步版本）
export async function renderMarkdown(content: string): Promise<string> {
  if (!content) {
    return ''
  }
  // 渲染 Markdown 后进行 XSS 过滤
  const rendered = mdAsync.render(content)
  return sanitizeHtml(rendered)
}

// 同步版本（用于不需要高亮的场景）
export function renderMarkdownSync(content: string): string {
  if (!content) {
    return ''
  }
  // 渲染 Markdown 后进行 XSS 过滤
  const rendered = mdSync.render(content)
  return sanitizeHtml(rendered)
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
