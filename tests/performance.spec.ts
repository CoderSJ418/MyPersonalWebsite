/**
 * 性能测试
 * 测试页面加载性能和用户体验
 */

import { test, expect } from '@playwright/test'

test.describe('性能测试', () => {
  test('首页加载性能', async ({ page }) => {
    // 记录页面加载开始时间
    const startTime = performance.now()
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // 记录页面加载完成时间
    const loadTime = performance.now() - startTime
    
    // 检查加载时间是否在可接受范围内
    expect(loadTime).toBeLessThan(2500) // 2.5秒
    
    console.log(`首页加载时间: ${loadTime.toFixed(2)}ms`)
  })

  test('项目页面加载性能', async ({ page }) => {
    const startTime = performance.now()
    
    await page.goto('/projects')
    await page.waitForLoadState('networkidle')
    
    const loadTime = performance.now() - startTime
    expect(loadTime).toBeLessThan(2500)
    
    console.log(`项目页面加载时间: ${loadTime.toFixed(2)}ms`)
  })

  test('技能页面加载性能', async ({ page }) => {
    const startTime = performance.now()
    
    await page.goto('/skills')
    await page.waitForLoadState('networkidle')
    
    const loadTime = performance.now() - startTime
    expect(loadTime).toBeLessThan(2500)
    
    console.log(`技能页面加载时间: ${loadTime.toFixed(2)}ms`)
  })

  test('博客页面加载性能', async ({ page }) => {
    const startTime = performance.now()
    
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')
    
    const loadTime = performance.now() - startTime
    expect(loadTime).toBeLessThan(2500)
    
    console.log(`博客页面加载时间: ${loadTime.toFixed(2)}ms`)
  })

  test('联系页面加载性能', async ({ page }) => {
    const startTime = performance.now()
    
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
    
    const loadTime = performance.now() - startTime
    expect(loadTime).toBeLessThan(2500)
    
    console.log(`联系页面加载时间: ${loadTime.toFixed(2)}ms`)
  })

  test('首屏渲染性能', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    
    // 检查首屏内容是否可见
    const heroSectionVisible = await page.isVisible('.hero')
    expect(heroSectionVisible).toBe(true)
    
    console.log('首屏内容已渲染')
  })

  test('交互响应性能', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // 测试按钮点击响应
    const button = await page.locator('.btn')
    if (await button.isVisible()) {
      const clickStartTime = performance.now()
      await button.click()
      const clickTime = performance.now() - clickStartTime
      
      // 检查点击响应时间
      expect(clickTime).toBeLessThan(100)
      
      console.log(`按钮点击响应时间: ${clickTime.toFixed(2)}ms`)
    }
  })

  test('滚动性能', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // 测试滚动性能
    const scrollStartTime = performance.now()
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
    await page.waitForTimeout(1000) // 等待滚动完成
    
    const scrollTime = performance.now() - scrollStartTime
    expect(scrollTime).toBeLessThan(1000)
    
    console.log(`滚动性能测试完成: ${scrollTime.toFixed(2)}ms`)
  })

  test('图片加载性能', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // 检查图片加载
    const images = await page.locator('img')
    const imageCount = await images.count()
    
    if (imageCount > 0) {
      const loadedImages = await images.filter({ hasClass: 'lazy-image__img--loaded' })
      const loadRate = loadedImages.count() / imageCount
      
      // 检查图片加载率
      expect(loadRate).toBeGreaterThan(0.5)
      
      console.log(`图片加载率: ${(loadRate * 100).toFixed(1)}%`)
    }
  })

  test('动画流畅度', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // 检查动画性能
    const animationFrames = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let frames = 0
        const startTime = performance.now()
        
        const checkFrame = () => {
          frames++
          const currentTime = performance.now()
          
          if (currentTime - startTime < 2000) {
            requestAnimationFrame(checkFrame)
          } else {
            resolve(frames)
          }
        }
        
        requestAnimationFrame(checkFrame)
      })
    })
    
    // 检查FPS是否稳定
    const fps = animationFrames / 2 // 2秒内的帧数
    expect(fps).toBeGreaterThan(30)
    
    console.log(`动画性能: ${fps.toFixed(1)} FPS`)
  })

  test('内存使用监控', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // 监控内存使用
    const memoryUsage = await page.evaluate(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        return {
          used: memory.usedJSHeapSize / 1048576, // MB
          total: memory.totalJSHeapSize / 1048576, // MB
          limit: memory.jsHeapSizeLimit / 1048576 // MB
        }
      }
      return null
    })
    
    if (memoryUsage) {
      console.log(`内存使用: ${memoryUsage.used.toFixed(2)}MB / ${memoryUsage.total.toFixed(2)}MB`)
      expect(memoryUsage.used).toBeLessThan(memoryUsage.total * 0.8) // 使用率不超过80%
    }
  })

  test('网络请求性能', async ({ page }) => {
    // 启用网络日志
    await page.route('**', (route) => {
      const startTime = Date.now()
      
      route.continue().then(() => {
        const duration = Date.now() - startTime
        if (duration > 1000) {
          console.warn(`慢请求: ${route.request().url()} - ${duration}ms`)
        }
      })
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // 检查请求数量
    const requests = await page.evaluate(() => {
      return performance.getEntriesByType('resource').length
    })
    
    expect(requests).toBeLessThan(50) // 请求数量限制
    console.log(`网络请求数量: ${requests}`)
  })
})

/**
 * 性能测试报告生成器
 */
export class PerformanceTestReport {
  static generateReport(testResults: any[]): string {
    let report = `# 性能测试报告\n\n`
    report += `**测试时间**: ${new Date().toISOString()}\n\n`

    // 总体统计
    const totalTests = testResults.length
    const passedTests = testResults.filter(r => r.status === 'passed').length
    const failedTests = testResults.filter(r => r.status === 'failed').length

    report += `## 总体统计\n\n`
    report += `- **总测试数**: ${totalTests}\n`
    report += `- **通过**: ${passedTests}\n`
    report += `- **失败**: ${failedTests}\n`
    report += `- **成功率**: ${((passedTests / totalTests) * 100).toFixed(1)}%\n\n`

    // 详细结果
    report += `## 详细结果\n\n`
    testResults.forEach((result, index) => {
      report += `### ${index + 1}. ${result.title}\n\n`
      report += `- **状态**: ${result.status}\n`
      
      if (result.duration) {
        report += `- **耗时**: ${result.duration.toFixed(2)}ms\n`
      }
      
      if (result.error) {
        report += `- **错误**: ${result.error}\n`
      }
      
      report += `\n`
    })

    // 性能指标
    const metrics = this.extractMetrics(testResults)
    if (Object.keys(metrics).length > 0) {
      report += `## 性能指标\n\n`
      Object.entries(metrics).forEach(([metric, value]) => {
        report += `- **${metric}**: ${value}\n`
      })
    }

    return report
  }

  private static extractMetrics(testResults: any[]): Record<string, string> {
    const metrics: Record<string, string> = {}
    
    testResults.forEach(result => {
      if (result.title.includes('加载时间')) {
        metrics['页面加载时间'] = `${result.duration.toFixed(2)}ms`
      }
      
      if (result.title.includes('响应时间')) {
        metrics['交互响应时间'] = `${result.duration.toFixed(2)}ms`
      }
      
      if (result.title.includes('内存使用')) {
        metrics['内存使用率'] = `${result.duration.toFixed(2)}%`
      }
    })
    
    return metrics
  }
}
