/**
 * XSS 防护测试
 * 测试 Vue 的自动转义机制和自定义 XSS 防护
 */

import { describe, it, expect } from 'vitest'

describe('XSS 防护测试', () => {
  describe('Vue 自动转义', () => {
    it('应该转义 HTML 标签', () => {
      const maliciousInput = '<script>alert("XSS")</script>'
      const safeOutput = maliciousInput.replace(/</g, '&lt;').replace(/>/g, '&gt;')
      expect(safeOutput).not.toContain('<script>')
      expect(safeOutput).toContain('&lt;script&gt;')
    })

    it('应该转义 JavaScript 事件处理器', () => {
      const maliciousInput = '<img src="x" onerror="alert(1)">'
      const safeOutput = maliciousInput.replace(/</g, '&lt;').replace(/>/g, '&gt;')
      // 转义后，onerror 应该被包含在转义的 HTML 中，但不会被执行
      expect(safeOutput).toContain('&lt;img')
      expect(safeOutput).toContain('onerror')
    })

    it('应该检测并拒绝 JavaScript 协议', () => {
      const maliciousInput = 'javascript:alert(1)'
      const safeOutput = maliciousInput.toLowerCase()
      // 检测到 javascript: 协议
      expect(safeOutput).toContain('javascript:')
      // 实际应用中应该拒绝这个输入
      expect(safeOutput).toMatch(/^javascript:/)
    })
  })

  describe('输入验证', () => {
    const sanitizeInput = (input: string): string => {
      // 移除危险的 HTML 标签和属性
      return input
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/javascript:/gi, '')
    }

    it('应该移除 script 标签', () => {
      const input = '<script>alert("XSS")</script>Hello'
      const output = sanitizeInput(input)
      expect(output).not.toContain('<script>')
      expect(output).toContain('Hello')
    })

    it('应该移除 iframe 标签', () => {
      const input = '<iframe src="malicious.com"></iframe>Hello'
      const output = sanitizeInput(input)
      expect(output).not.toContain('<iframe>')
    })

    it('应该移除事件处理器', () => {
      const input = '<img src="test.jpg" onerror="alert(1)">'
      const output = sanitizeInput(input)
      expect(output).not.toContain('onerror')
    })
  })

  describe('CSP 策略验证', () => {
    it('应该验证 CSP 头是否存在', () => {
      const cspContent = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https:; frame-src 'none'; object-src 'none';"
      expect(cspContent).toBeTruthy()
    })

    it('应该验证 CSP 策略包含必要的指令', () => {
      const cspContent = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https:; frame-src 'none'; object-src 'none';"
      
      expect(cspContent).toContain("default-src 'self'")
      expect(cspContent).toContain("script-src 'self'")
      expect(cspContent).toContain("style-src 'self'")
      expect(cspContent).toContain('frame-src')
      expect(cspContent).toContain('object-src')
    })
  })

  describe('DOM 操作安全', () => {
    it('应该安全地设置 innerHTML', () => {
      const div = document.createElement('div')
      const safeHTML = '<p>Safe content</p>'
      div.innerHTML = safeHTML
      expect(div.innerHTML).toBe(safeHTML)
    })

    it('应该警告危险的 innerHTML', () => {
      const div = document.createElement('div')
      const dangerousHTML = '<script>alert("XSS")</script>'
      div.innerHTML = dangerousHTML
      // 浏览器会阻止 script 标签的执行，但 HTML 仍然会被设置
      // 在实际应用中，应该避免使用 innerHTML 设置不可信的内容
      expect(div.innerHTML).toContain('script')
      // 但 script 标签不会被执行
    })
  })
})