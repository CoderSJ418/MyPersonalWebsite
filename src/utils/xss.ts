/**
 * XSS 安全过滤工具
 * 使用 DOMPurify 对 HTML 内容进行安全过滤，防止 XSS 攻击
 */
import DOMPurify from 'dompurify'

/**
 * DOMPurify 配置选项
 */
const DEFAULT_CONFIG: DOMPurify.Config = {
  // 允许的标签
  ALLOWED_TAGS: [
    // 文本格式化
    'p', 'br', 'span', 'strong', 'em', 'b', 'i', 'u', 's', 'del', 'ins',
    'sub', 'sup', 'mark', 'small', 'abbr',
    // 标题
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    // 列表
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    // 链接和引用
    'a', 'blockquote', 'cite', 'q',
    // 代码
    'code', 'pre', 'kbd', 'samp', 'var',
    // 表格
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
    // 图片和媒体
    'img', 'figure', 'figcaption', 'picture', 'source',
    // 分隔线
    'hr',
    // 语义化标签
    'article', 'section', 'aside', 'header', 'footer', 'nav', 'main', 'address',
    'details', 'summary', 'dialog',
    // 表单（只读展示）
    'label',
    // 自定义容器
    'div',
  ],
  // 允许的属性
  ALLOWED_ATTR: [
    // 全局属性
    'id', 'class', 'title', 'lang', 'dir', 'hidden', 'tabindex',
    'data-*',  // 支持 data-* 属性
    // 链接属性
    'href', 'target', 'rel', 'download',
    // 图片属性
    'src', 'alt', 'width', 'height', 'loading', 'decoding',
    'srcset', 'sizes',
    // 表格属性
    'colspan', 'rowspan', 'scope', 'headers',
    // 代码属性
    'datetime', 'cite',
    // ARIA 属性
    'aria-*', 'role',
    // 其他
    'name', 'value', 'type', 'placeholder',
    // 媒体属性
    'controls', 'autoplay', 'loop', 'muted', 'playsinline',
  ],
  // 允许的 URI 协议
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
  // 允许 data-* 属性
  ALLOW_DATA_ATTR: true,
  // 保持 HTML 注释（可选，通常不需要）
  ALLOW_UNKNOWN_PROTOCOLS: false,
}

/**
 * 代码块专用配置 - 更严格，只允许代码相关标签
 */
const CODE_CONFIG: DOMPurify.Config = {
  ALLOWED_TAGS: ['code', 'pre', 'span', 'br'],
  ALLOWED_ATTR: ['class', 'id'],
  ALLOW_DATA_ATTR: false,
}

/**
 * 高亮文本专用配置 - 最严格，只允许高亮标签
 */
const HIGHLIGHT_CONFIG: DOMPurify.Config = {
  ALLOWED_TAGS: ['mark', 'span', 'em', 'strong', 'b', 'i'],
  ALLOWED_ATTR: ['class'],
  ALLOW_DATA_ATTR: false,
}

/**
 * 对 HTML 内容进行 XSS 安全过滤
 * @param html - 需要过滤的 HTML 字符串
 * @param config - 可选的自定义配置
 * @returns 过滤后的安全 HTML 字符串
 */
export function sanitizeHtml(html: string, config?: DOMPurify.Config): string {
  if (!html) {
    return ''
  }

  return DOMPurify.sanitize(html, {
    ...DEFAULT_CONFIG,
    ...config,
  })
}

/**
 * 对代码内容进行安全过滤
 * @param code - 需要过滤的代码字符串
 * @returns 过滤后的安全代码字符串
 */
export function sanitizeCode(code: string): string {
  if (!code) {
    return ''
  }

  return DOMPurify.sanitize(code, CODE_CONFIG)
}

/**
 * 对高亮文本进行安全过滤（用于搜索结果高亮等场景）
 * @param text - 需要过滤的文本字符串
 * @returns 过滤后的安全文本字符串
 */
export function sanitizeHighlight(text: string): string {
  if (!text) {
    return ''
  }

  return DOMPurify.sanitize(text, HIGHLIGHT_CONFIG)
}

/**
 * 移除所有 HTML 标签，只保留纯文本
 * @param html - HTML 字符串
 * @returns 纯文本字符串
 */
export function stripHtml(html: string): string {
  if (!html) {
    return ''
  }

  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] })
}

/**
 * 创建 Vue 安全的 v-html 绑定函数
 * 返回一个可以直接用于 v-html 的安全 HTML 字符串
 * @param html - 原始 HTML 字符串
 * @param options - 配置选项
 * @returns 安全的 HTML 字符串
 */
export function safeHtml(
  html: string,
  options?: {
    mode?: 'default' | 'code' | 'highlight'
    config?: DOMPurify.Config
  }
): string {
  if (!html) {
    return ''
  }

  const mode = options?.mode || 'default'

  switch (mode) {
    case 'code':
      return sanitizeCode(html)
    case 'highlight':
      return sanitizeHighlight(html)
    default:
      return sanitizeHtml(html, options?.config)
  }
}

// 导出 DOMPurify 实例，供高级用法
export { DOMPurify }

// 默认导出
export default sanitizeHtml
