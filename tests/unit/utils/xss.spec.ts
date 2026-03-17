/**
 * XSS 工具函数测试
 */
import { describe, it, expect } from 'vitest'
import {
  sanitizeHtml,
  sanitizeCode,
  sanitizeHighlight,
  stripHtml,
  safeHtml,
} from '@/utils/xss'

describe('xss utils', () => {
  describe('sanitizeHtml', () => {
    it('should return empty string for empty input', () => {
      expect(sanitizeHtml('')).toBe('')
      expect(sanitizeHtml(null as unknown as string)).toBe('')
      expect(sanitizeHtml(undefined as unknown as string)).toBe('')
    })

    it('should allow safe HTML tags', () => {
      const result = sanitizeHtml('<p>Hello <strong>World</strong></p>')
      expect(result).toBe('<p>Hello <strong>World</strong></p>')
    })

    it('should remove script tags', () => {
      const result = sanitizeHtml('<script>alert("xss")</script><p>Safe</p>')
      expect(result).toBe('<p>Safe</p>')
    })

    it('should remove dangerous attributes', () => {
      const result = sanitizeHtml('<p onclick="alert(1)">Click</p>')
      expect(result).toBe('<p>Click</p>')
    })
  })

  describe('sanitizeCode', () => {
    it('should return empty string for empty input', () => {
      expect(sanitizeCode('')).toBe('')
    })

    it('should only allow code-related tags', () => {
      const result = sanitizeCode('<pre><code>const x = 1</code></pre>')
      expect(result).toBe('<pre><code>const x = 1</code></pre>')
    })

    it('should remove non-code tags', () => {
      const result = sanitizeCode('<div><code>test</code></div>')
      expect(result).toBe('<code>test</code>')
    })
  })

  describe('sanitizeHighlight', () => {
    it('should return empty string for empty input', () => {
      expect(sanitizeHighlight('')).toBe('')
    })

    it('should allow highlight tags', () => {
      const result = sanitizeHighlight('<mark>highlighted</mark>')
      expect(result).toBe('<mark>highlighted</mark>')
    })

    it('should remove non-highlight tags', () => {
      const result = sanitizeHighlight('<div><mark>test</mark></div>')
      expect(result).toBe('<mark>test</mark>')
    })
  })

  describe('stripHtml', () => {
    it('should return empty string for empty input', () => {
      expect(stripHtml('')).toBe('')
    })

    it('should remove script tags', () => {
      const result = stripHtml('<script>alert(1)</script>Safe')
      expect(result).toBe('Safe')
    })

    it('should preserve text content', () => {
      const result = stripHtml('<p>Text content</p>')
      expect(result).toContain('Text content')
    })
  })

  describe('safeHtml', () => {
    it('should return empty string for empty input', () => {
      expect(safeHtml('')).toBe('')
    })

    it('should use default mode by default', () => {
      const result = safeHtml('<p>Test</p>')
      expect(result).toBe('<p>Test</p>')
    })

    it('should use code mode when specified', () => {
      const result = safeHtml('<pre><code>test</code></pre>', { mode: 'code' })
      expect(result).toBe('<pre><code>test</code></pre>')
    })

    it('should use highlight mode when specified', () => {
      const result = safeHtml('<mark>highlighted</mark>', { mode: 'highlight' })
      expect(result).toBe('<mark>highlighted</mark>')
    })
  })
})
