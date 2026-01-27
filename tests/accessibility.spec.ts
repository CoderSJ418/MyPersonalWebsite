/**
 * 可访问性测试
 * 使用 axe-core 进行可访问性测试
 */

import { test, expect } from '@playwright/test'
import axe from 'axe-core'

declare global {
  interface Window {
    axe: typeof axe
  }
}

test.describe('可访问性测试', () => {
  test.beforeEach(async ({ page }) => {
    // 注入 axe-core
    await page.addInitScript(() => {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.2/axe.min.js'
      document.head.appendChild(script)
    })
  })

  test('首页应通过可访问性测试', async ({ page }) => {
    await page.goto('/')
    
    // 等待页面加载完成
    await page.waitForLoadState('networkidle')
    
    // 运行 axe-core 测试
    const results = await page.evaluate(() => {
      return window.axe.run(document)
    })

    // 检查是否有严重错误
    const seriousViolations = results.violations.filter(v => v.impact === 'critical')
    expect(seriousViolations).toHaveLength(0)

    // 输出可访问性报告
    console.log('可访问性测试结果:')
    console.log(`严重错误: ${results.violations.filter(v => v.impact === 'critical').length}`)
    console.log(`错误: ${results.violations.filter(v => v.impact === 'serious').length}`)
    console.log(`警告: ${results.violations.filter(v => v.impact === 'moderate').length}`)
    console.log(`建议: ${results.violations.filter(v => v.impact === 'minor').length}`)
  })

  test('项目页面应通过可访问性测试', async ({ page }) => {
    await page.goto('/projects')
    await page.waitForLoadState('networkidle')
    
    const results = await page.evaluate(() => {
      return window.axe.run(document)
    })

    const seriousViolations = results.violations.filter(v => v.impact === 'critical')
    expect(seriousViolations).toHaveLength(0)
  })

  test('技能页面应通过可访问性测试', async ({ page }) => {
    await page.goto('/skills')
    await page.waitForLoadState('networkidle')
    
    const results = await page.evaluate(() => {
      return window.axe.run(document)
    })

    const seriousViolations = results.violations.filter(v => v.impact === 'critical')
    expect(seriousViolations).toHaveLength(0)
  })

  test('博客页面应通过可访问性测试', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')
    
    const results = await page.evaluate(() => {
      return window.axe.run(document)
    })

    const seriousViolations = results.violations.filter(v => v.impact === 'critical')
    expect(seriousViolations).toHaveLength(0)
  })

  test('联系页面应通过可访问性测试', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
    
    const results = await page.evaluate(() => {
      return window.axe.run(document)
    })

    const seriousViolations = results.violations.filter(v => v.impact === 'critical')
    expect(seriousViolations).toHaveLength(0)
  })

  test('测试组件可访问性', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // 测试特定组件
    const testComponents = [
      'button',
      '.card',
      '.input',
      'a',
      'img'
    ]

    for (const selector of testComponents) {
      const results = await page.evaluate((sel) => {
        const element = document.querySelector(sel)
        if (element) {
          return window.axe.run(element)
        }
        return { violations: [], passes: [], incomplete: [] }
      }, selector)

      const seriousViolations = results.violations.filter(v => v.impact === 'critical')
      expect(seriousViolations).toHaveLength(0, `组件 ${selector} 存在严重可访问性问题`)
    }
  })
})

/**
 * 可访问性测试报告生成器
 */
export class AccessibilityTestReport {
  static generateReport(results: axe.AxeResults): string {
    let report = `# 可访问性测试报告\n\n`
    report += `**测试时间**: ${new Date().toISOString()}\n\n`

    // 统计信息
    const stats = {
      critical: results.violations.filter(v => v.impact === 'critical').length,
      serious: results.violations.filter(v => v.impact === 'serious').length,
      moderate: results.violations.filter(v => v.impact === 'moderate').length,
      minor: results.violations.filter(v => v.impact === 'minor').length
    }

    report += `## 测试统计\n\n`
    report += `- **严重错误**: ${stats.critical}\n`
    report += `- **错误**: ${stats.serious}\n`
    report += `- **警告**: ${stats.moderate}\n`
    report += `- **建议**: ${stats.minor}\n\n`

    // 详细错误列表
    if (results.violations.length > 0) {
      report += `## 详细错误列表\n\n`
      results.violations.forEach((violation, index) => {
        report += `### ${index + 1}. ${violation.impact.toUpperCase()}: ${violation.id}\n\n`
        report += `**描述**: ${violation.description}\n\n`
        report += `**建议**: ${violation.help}\n\n`
        report += `**元素**: \`\`\`\n${violation.nodes.map(n => n.html).join('\n')}\n\`\`\`\n\n`
      })
    }

    // 成功通过的测试
    if (results.passes.length > 0) {
      report += `## 成功通过的测试\n\n`
      results.passes.slice(0, 10).forEach((pass, index) => {
        report += `${index + 1}. ${pass.id}\n`
      })
      if (results.passes.length > 10) {
        report += `... 还有 ${results.passes.length - 10} 个通过的测试\n`
      }
    }

    return report
  }
}
