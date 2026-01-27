import { describe, it, expect, beforeEach } from 'vitest'
import { renderMarkdown, extractHeadings, calculateReadingTime, extractExcerpt } from '@/utils/markdown'

describe('markdown', () => {
  describe('renderMarkdown', () => {
    it('should render plain text', () => {
      const markdown = 'Hello World'
      const result = renderMarkdown(markdown)
      expect(result).toContain('Hello World')
    })

    it('should render headings', () => {
      const markdown = '# Heading 1\n## Heading 2\n### Heading 3'
      const result = renderMarkdown(markdown)
      expect(result).toContain('<h1')
      expect(result).toContain('<h2')
      expect(result).toContain('<h3')
    })

    it('should render paragraphs', () => {
      const markdown = 'Paragraph 1\n\nParagraph 2'
      const result = renderMarkdown(markdown)
      expect(result).toContain('<p')
    })

    it('should render links', () => {
      const markdown = '[Link text](https://example.com)'
      const result = renderMarkdown(markdown)
      expect(result).toContain('<a')
      expect(result).toContain('href="https://example.com"')
      expect(result).toContain('Link text')
    })

    it('should render images', () => {
      const markdown = '![Alt text](image.jpg)'
      const result = renderMarkdown(markdown)
      expect(result).toContain('<img')
      expect(result).toContain('src="image.jpg"')
      expect(result).toContain('alt="Alt text"')
    })

    it('should render lists', () => {
      const markdown = '- Item 1\n- Item 2\n- Item 3'
      const result = renderMarkdown(markdown)
      expect(result).toContain('<ul')
      expect(result).toContain('<li')
    })

    it('should render ordered lists', () => {
      const markdown = '1. Item 1\n2. Item 2\n3. Item 3'
      const result = renderMarkdown(markdown)
      expect(result).toContain('<ol')
      expect(result).toContain('<li')
    })

    it('should render code blocks', () => {
      const markdown = '```javascript\nconst hello = "world";\n```'
      const result = renderMarkdown(markdown)
      expect(result).toContain('<pre')
      expect(result).toContain('<code')
      expect(result).toContain('language-javascript')
    })

    it('should render inline code', () => {
      const markdown = 'This is `inline code`'
      const result = renderMarkdown(markdown)
      expect(result).toContain('<code')
    })

    it('should render blockquotes', () => {
      const markdown = '> This is a quote'
      const result = renderMarkdown(markdown)
      expect(result).toContain('<blockquote')
    })

    it('should render horizontal rules', () => {
      const markdown = '---'
      const result = renderMarkdown(markdown)
      expect(result).toContain('<hr')
    })

    it('should render tables', () => {
      const markdown = '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |'
      const result = renderMarkdown(markdown)
      expect(result).toContain('<table')
      expect(result).toContain('<thead')
      expect(result).toContain('<tbody')
    })

    it('should handle complex markdown', () => {
      const markdown = `# Title

This is a paragraph with **bold** and *italic* text.

## Subtitle

- List item 1
- List item 2

\`\`\`javascript
const hello = "world";
\`\`\`

> A quote

[Link](https://example.com)`

      const result = renderMarkdown(markdown)
      expect(result).toContain('<h1')
      expect(result).toContain('<h2')
      expect(result).toContain('<strong')
      expect(result).toContain('<em')
      expect(result).toContain('<ul')
      expect(result).toContain('<pre')
      expect(result).toContain('<blockquote')
      expect(result).toContain('<a')
    })

    it('should handle empty markdown', () => {
      const markdown = ''
      const result = renderMarkdown(markdown)
      expect(result).toBe('')
    })

    it('should handle special characters', () => {
      const markdown = 'Special characters: < > & " \''
      const result = renderMarkdown(markdown)
      expect(result).toContain('&lt;')
      expect(result).toContain('&gt;')
      expect(result).toContain('&amp;')
    })

    it('should handle nested lists', () => {
      const markdown = '- Item 1\n  - Nested item 1\n  - Nested item 2\n- Item 2'
      const result = renderMarkdown(markdown)
      expect(result).toContain('<ul')
    })
  })

  describe('extractHeadings', () => {
    it('should extract all headings', () => {
      const markdown = `# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6`

      const headings = extractHeadings(markdown)
      expect(headings.length).toBe(6)
    })

    it('should extract heading text', () => {
      const markdown = '# Introduction\n## Getting Started\n### Advanced Topics'
      const headings = extractHeadings(markdown)
      expect(headings[0].text).toBe('Introduction')
      expect(headings[1].text).toBe('Getting Started')
      expect(headings[2].text).toBe('Advanced Topics')
    })

    it('should extract heading level', () => {
      const markdown = `# Level 1
## Level 2
### Level 3`

      const headings = extractHeadings(markdown)
      expect(headings[0].level).toBe(1)
      expect(headings[1].level).toBe(2)
      expect(headings[2].level).toBe(3)
    })

    it('should generate heading id', () => {
      const markdown = '# Introduction'
      const headings = extractHeadings(markdown)
      expect(headings[0].id).toBeDefined()
      expect(typeof headings[0].id).toBe('string')
    })

    it('should handle empty markdown', () => {
      const markdown = ''
      const headings = extractHeadings(markdown)
      expect(headings.length).toBe(0)
    })

    it('should handle markdown without headings', () => {
      const markdown = 'This is just a paragraph'
      const headings = extractHeadings(markdown)
      expect(headings.length).toBe(0)
    })

    it('should handle headings with special characters', () => {
      const markdown = '# Heading with & special <characters>'
      const headings = extractHeadings(markdown)
      expect(headings[0].text).toContain('Heading with & special <characters>')
    })

    it('should handle duplicate headings', () => {
      const markdown = `# Introduction
## Getting Started
# Introduction`

      const headings = extractHeadings(markdown)
      expect(headings.length).toBe(3)
      expect(headings[0].text).toBe('Introduction')
      expect(headings[2].text).toBe('Introduction')
    })

    it('should handle headings with inline formatting', () => {
      const markdown = '# **Bold** and *italic* heading'
      const headings = extractHeadings(markdown)
      expect(headings[0].text).toContain('Bold')
      expect(headings[0].text).toContain('italic')
    })

    it('should handle headings with links', () => {
      const markdown = '# Heading with [link](https://example.com)'
      const headings = extractHeadings(markdown)
      expect(headings[0].text).toContain('link')
    })

    it('should handle headings with code', () => {
      const markdown = '# Heading with `code`'
      const headings = extractHeadings(markdown)
      expect(headings[0].text).toContain('code')
    })
  })

  describe('calculateReadingTime', () => {
    it('should return 0 for empty content', () => {
      const readingTime = calculateReadingTime('')
      expect(readingTime).toBe(0)
    })

    it('should return 0 for null content', () => {
      const readingTime = calculateReadingTime(null as any)
      expect(readingTime).toBe(0)
    })

    it('should calculate reading time for Chinese text', () => {
      const markdown = '这是一段中文文本，大约有四百个字。' + '这是一段中文文本，大约有四百个字。' + '这是一段中文文本，大约有四百个字。' + '这是一段中文文本，大约有四百个字。'
      const readingTime = calculateReadingTime(markdown)
      expect(readingTime).toBeGreaterThan(0)
    })

    it('should calculate reading time for English text', () => {
      const markdown = 'This is a sample text. ' + 'This is a sample text. ' + 'This is a sample text. ' + 'This is a sample text. ' + 'This is a sample text. ' + 'This is a sample text. ' + 'This is a sample text. ' + 'This is a sample text. ' + 'This is a sample text. ' + 'This is a sample text. '
      const readingTime = calculateReadingTime(markdown)
      expect(readingTime).toBeGreaterThan(0)
    })

    it('should calculate reading time for mixed text', () => {
      const markdown = 'This is English text. ' + '这是中文文本。' + 'More English words. ' + '更多中文。'
      const readingTime = calculateReadingTime(markdown)
      expect(readingTime).toBeGreaterThan(0)
    })

    it('should ignore markdown syntax', () => {
      const markdown = '# Heading\n\n**Bold** and *italic* text.\n\n```javascript\nconst code = "here";\n```\n\n> Quote'
      const readingTime = calculateReadingTime(markdown)
      expect(readingTime).toBeGreaterThan(0)
    })

    it('should handle links and images', () => {
      const markdown = '[Link text](https://example.com) and ![Image alt](image.jpg)'
      const readingTime = calculateReadingTime(markdown)
      expect(readingTime).toBeGreaterThan(0)
    })

    it('should handle code blocks', () => {
      const markdown = '```javascript\nconst hello = "world";\nconst foo = "bar";\n```'
      const readingTime = calculateReadingTime(markdown)
      expect(readingTime).toBeGreaterThan(0)
    })
  })

  describe('extractExcerpt', () => {
    it('should return empty string for empty content', () => {
      const excerpt = extractExcerpt('')
      expect(excerpt).toBe('')
    })

    it('should return empty string for null content', () => {
      const excerpt = extractExcerpt(null as any)
      expect(excerpt).toBe('')
    })

    it('should extract plain text from markdown', () => {
      const markdown = '# Heading\n\nThis is a paragraph.'
      const excerpt = extractExcerpt(markdown)
      expect(excerpt).toContain('Heading')
      expect(excerpt).toContain('This is a paragraph')
      expect(excerpt).not.toContain('#')
    })

    it('should remove bold and italic formatting', () => {
      const markdown = 'This is **bold** and *italic* text.'
      const excerpt = extractExcerpt(markdown)
      expect(excerpt).toContain('This is')
      expect(excerpt).toContain('bold')
      expect(excerpt).toContain('and')
      expect(excerpt).toContain('italic')
      expect(excerpt).toContain('text')
      expect(excerpt).not.toContain('**')
      expect(excerpt).not.toContain('*')
    })

    it('should remove inline code formatting', () => {
      const markdown = 'This is `code` text.'
      const excerpt = extractExcerpt(markdown)
      expect(excerpt).toContain('This is')
      expect(excerpt).toContain('code')
      expect(excerpt).toContain('text')
      expect(excerpt).not.toContain('`')
    })

    it('should remove links but keep text', () => {
      const markdown = 'Check out [this link](https://example.com).'
      const excerpt = extractExcerpt(markdown)
      expect(excerpt).toContain('Check out')
      expect(excerpt).toContain('this link')
      expect(excerpt).not.toContain('https://example.com')
      expect(excerpt).not.toContain('[')
      expect(excerpt).not.toContain(']')
      expect(excerpt).not.toContain('(')
      expect(excerpt).not.toContain(')')
    })

    it('should remove images', () => {
      const markdown = 'Here is an image ![Alt text](image.jpg).'
      const excerpt = extractExcerpt(markdown)
      expect(excerpt).toContain('Here is an image')
      expect(excerpt).not.toContain('image.jpg')
      expect(excerpt).not.toContain('[')
      expect(excerpt).not.toContain(']')
      expect(excerpt).not.toContain('(')
      expect(excerpt).not.toContain(')')
    })

    it('should remove newlines', () => {
      const markdown = 'Line 1\nLine 2\nLine 3'
      const excerpt = extractExcerpt(markdown)
      expect(excerpt).not.toContain('\n')
      expect(excerpt).toContain('Line 1')
      expect(excerpt).toContain('Line 2')
      expect(excerpt).toContain('Line 3')
    })

    it('should truncate to default max length', () => {
      const markdown = 'This is a very long text that should be truncated to the default max length of 200 characters. ' + 'This is a very long text that should be truncated to the default max length of 200 characters. ' + 'This is a very long text that should be truncated to the default max length of 200 characters. ' + 'This is a very long text that should be truncated to the default max length of 200 characters.'
      const excerpt = extractExcerpt(markdown)
      expect(excerpt.length).toBeLessThanOrEqual(203) // 200 + '...'
      expect(excerpt).toContain('...')
    })

    it('should truncate to custom max length', () => {
      const markdown = 'This is a very long text that should be truncated to a custom max length of 50 characters. This is a very long text that should be truncated to a custom max length of 50 characters.'
      const excerpt = extractExcerpt(markdown, 50)
      expect(excerpt.length).toBeLessThanOrEqual(53) // 50 + '...'
      expect(excerpt).toContain('...')
    })

    it('should not truncate if text is shorter than max length', () => {
      const markdown = 'Short text.'
      const excerpt = extractExcerpt(markdown, 100)
      expect(excerpt).toBe('Short text.')
      expect(excerpt).not.toContain('...')
    })

    it('should handle complex markdown', () => {
      const markdown = `# Title

This is a paragraph with **bold** and *italic* text.

## Subtitle

- List item 1
- List item 2

\`\`\`javascript
const hello = "world";
\`\`\`

> A quote

[Link](https://example.com)`

      const excerpt = extractExcerpt(markdown)
      expect(excerpt).toContain('Title')
      expect(excerpt).toContain('This is a paragraph')
      expect(excerpt).not.toContain('#')
      expect(excerpt).not.toContain('**')
      expect(excerpt).not.toContain('`')
    })
  })
})