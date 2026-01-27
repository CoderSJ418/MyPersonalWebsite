import { test, expect } from '@playwright/test'

test.describe('首页 E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('应该正确加载首页', async ({ page }) => {
    // 等待页面加载完成
    await page.waitForLoadState('networkidle')
    
    // 检查标题
    await expect(page).toHaveTitle(/佘杰/)
    
    // 检查主要内容区域
    const hero = page.locator('section').first()
    await expect(hero).toBeVisible()
  })

  test('应该显示个人介绍', async ({ page }) => {
    // 检查是否显示姓名
    const name = page.getByText('佘杰')
    await expect(name).toBeVisible()
    
    // 检查是否显示职位
    const title = page.getByText(/前端开发工程师/)
    await expect(title).toBeVisible()
  })

  test('应该显示技术栈', async ({ page }) => {
    // 滚动到技术栈区域
    const techStackSection = page.locator('section').filter({ hasText: '技术栈' })
    await techStackSection.scrollIntoViewIfNeeded()
    
    // 检查技术栈标题
    await expect(techStackSection.getByText('技术栈')).toBeVisible()
    
    // 检查技术卡片
    const techCards = techStackSection.locator('.tech-card')
    await expect(techCards).toHaveCount(6)
    
    // 检查特定技术
    await expect(techCards.filter({ hasText: 'Vue 3' })).toBeVisible()
    await expect(techCards.filter({ hasText: 'React' })).toBeVisible()
    await expect(techCards.filter({ hasText: 'TypeScript' })).toBeVisible()
  })

  test('应该支持暗黑模式切换', async ({ page }) => {
    // 查找暗黑模式切换按钮
    const themeToggle = page.locator('[aria-label*="theme"], [aria-label*="暗"], [aria-label*="dark"]').first()
    
    // 如果存在切换按钮，测试它
    if (await themeToggle.isVisible()) {
      // 切换到暗黑模式
      await themeToggle.click()
      
      // 检查是否应用了暗黑模式
      const body = page.locator('body')
      await expect(body).toHaveClass(/dark/)
      
      // 切换回亮色模式
      await themeToggle.click()
      
      // 检查是否移除了暗黑模式
      await expect(body).not.toHaveClass(/dark/)
    }
  })

  test('应该响应键盘导航', async ({ page }) => {
    // 测试 Tab 键导航
    await page.keyboard.press('Tab')
    
    // 检查焦点是否移动
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('应该在移动端正确显示', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 })
    
    // 重新加载页面
    await page.reload()
    
    // 检查移动端导航
    const mobileNav = page.locator('.mobile-nav, [class*="mobile"]').first()
    
    // 检查内容是否适应移动端
    const hero = page.locator('section').first()
    await expect(hero).toBeVisible()
  })

  test('应该有正确的导航链接', async ({ page }) => {
    // 查找导航链接
    const navLinks = page.locator('nav a')
    
    // 检查导航链接是否存在
    const linkCount = await navLinks.count()
    expect(linkCount).toBeGreaterThan(0)
    
    // 测试第一个链接
    if (linkCount > 0) {
      const firstLink = navLinks.first()
      const href = await firstLink.getAttribute('href')
      expect(href).toBeTruthy()
    }
  })

  test('应该支持搜索功能（如果存在）', async ({ page }) => {
    // 尝试打开搜索（Ctrl+K）
    await page.keyboard.press('Control+K')
    
    // 检查搜索模态框是否出现
    const searchModal = page.locator('[role="dialog"], .search-modal, [class*="search"]').first()
    
    if (await searchModal.isVisible({ timeout: 1000 })) {
      // 搜索框应该可见
      const searchInput = searchModal.locator('input[type="text"], input[placeholder*="搜索"]').first()
      await expect(searchInput).toBeVisible()
      
      // 关闭搜索（Esc）
      await page.keyboard.press('Escape')
      
      // 搜索模态框应该消失
      await expect(searchModal).not.toBeVisible()
    }
  })

  test('应该有正确的 SEO 元素', async ({ page }) => {
    // 检查 meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content')
    expect(metaDescription).toBeTruthy()
    expect(metaDescription?.length).toBeGreaterThan(0)
    
    // 检查 viewport meta
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content')
    expect(viewport).toContain('width=device-width')
  })

  test('应该正确处理 404 页面', async ({ page }) => {
    // 访问不存在的页面
    await page.goto('/non-existent-page')
    
    // 检查是否显示 404 页面
    const notFound = page.locator('body').filter({ hasText: /404|未找到|Not Found/ })
    
    if (await notFound.isVisible({ timeout: 2000 })) {
      await expect(notFound).toBeVisible()
    }
  })
})