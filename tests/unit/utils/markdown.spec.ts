// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest'

import {
  calculateReadingTime,
  clearRenderCache,
  extractExcerpt,
  extractHeadings,
  renderMarkdown,
  renderMarkdownSync,
  splitExpandableMarkdown
} from '@/utils/markdown'

describe('markdown utilities', () => {
  beforeEach(() => clearRenderCache())

  it('renders safe synchronous markdown and reuses cache', () => {
    const source = '# Title\n\nHello **Vue**.\n\n<script>alert(1)</script>'
    const first = renderMarkdownSync(source)
    const second = renderMarkdownSync(source)
    expect(first).toContain('<h1')
    expect(first).toContain('<strong>Vue</strong>')
    expect(first).not.toContain('<script>')
    expect(second).toBe(first)
    expect(renderMarkdownSync('')).toBe('')
  })

  it('renders highlighted code asynchronously', async () => {
    const result = await renderMarkdown('```ts\nconst answer = 42\n```')
    expect(result).toContain('const')
    await expect(renderMarkdown('')).resolves.toBe('')
  })

  it('extracts document navigation and summaries', () => {
    const source = '# First\n## Second\n### Third\n\nA paragraph with **formatting**.'
    const headings = extractHeadings(source)
    expect(headings.map((heading) => heading.level)).toEqual([1, 2, 3])
    expect(calculateReadingTime('word '.repeat(500))).toBeGreaterThanOrEqual(1)
    expect(extractExcerpt(source, 20)).toContain('...')
    expect(extractExcerpt('Short text', 200)).toBe('Short text')
  })

  it('splits long-form markdown at the explicit fold marker', () => {
    const folded = splitExpandableMarkdown('摘要\n\n<!-- article-fold -->\n\n## 完整正文')
    expect(folded.preview).toBe('摘要')
    expect(folded.full).toContain('## 完整正文')
    expect(folded.isExpandable).toBe(true)

    const short = splitExpandableMarkdown('普通文章')
    expect(short).toEqual({ preview: '普通文章', full: '普通文章', isExpandable: false })
  })
})
