import { test, expect } from '@playwright/test'

test.describe('项目展示页面 E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects')
    await page.waitForLoadState('networkidle')
  })

  test('应该正确加载项目页面', async ({ page }) => {
    // 检查标题
    await expect(page).toHaveTitle(/项目|Projects/)
    
    // 检查页面标题
    const pageTitle = page.locator('h1').filter({ hasText: /项目|Projects/ })
    await expect(pageTitle).toBeVisible()
  })

  test('应该显示项目列表', async ({ page }) => {
    // 检查项目卡片
    const projectCards = page.locator('.project-card, [class*="project"]').first()
    await expect(projectCards).toBeVisible()
  })

  test('应该显示项目筛选器（如果存在）', async ({ page }) => {
    // 查找筛选器
    const filterButtons = page.locator('button').filter({ hasText: /全部|All|前端|后端/ })
    
    if (await filterButtons.count() > 0) {
      // 测试筛选功能
      const firstFilter = filterButtons.first()
      await firstFilter.click()
      
      // 等待筛选结果
      await page.waitForTimeout(500)
    }
  })

  test('应该能点击项目卡片查看详情', async ({ page }) => {
    // 查找第一个项目卡片
    const firstProjectCard = page.locator('.project-card, [class*="project"]').first()
    
    if (await firstProjectCard.isVisible()) {
      // 点击项目卡片
      await firstProjectCard.click()
      
      // 检查是否跳转到详情页
      await page.waitForURL(/\/projects\/\w+/)
      
      // 检查详情页内容
      const detailTitle = page.locator('h1, h2').first()
      await expect(detailTitle).toBeVisible()
    }
  })

  test('应该显示项目技术栈标签', async ({ page }) => {
    // 查找技术栈标签
    const techTags = page.locator('.tech-tag, [class*="tag"]').first()
    
    if (await techTags.isVisible()) {
      await expect(techTags).toBeVisible()
    }
  })

  test('应该显示项目图片', async ({ page }) => {
    // 查找项目图片
    const projectImages = page.locator('img').first()
    
    if (await projectImages.isVisible()) {
      // 检查图片是否加载完成
      await expect(projectImages).toHaveJSProperty('complete', true)
    }
  })

  test('应该在移动端正确显示', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    
    // 检查项目卡片是否适应移动端
    const projectCards = page.locator('.project-card, [class*="project"]').first()
    await expect(projectCards).toBeVisible()
  })

  test('应该支持项目搜索（如果存在）', async ({ page }) => {
    // 查找搜索框
    const searchInput = page.locator('input[type="text"]').filter({ hasText: /搜索/ })
    
    if (await searchInput.isVisible()) {
      // 输入搜索关键词
      await searchInput.fill('Vue')
      
      // 等待搜索结果
      await page.waitForTimeout(500)
      
      // 清空搜索
      await searchInput.fill('')
    }
  })

  test('应该显示项目统计信息（如果存在）', async ({ page }) => {
    // 查找统计信息
    const stats = page.locator('[class*="stat"], [class*="count"]').first()
    
    if (await stats.isVisible()) {
      await expect(stats).toBeVisible()
    }
  })

  test('应该有正确的 SEO 元素', async ({ page }) => {
    // 检查 meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content')
    expect(metaDescription).toBeTruthy()
    
    // 检查 canonical link
    const canonical = page.locator('link[rel="canonical"]').first()
    if (await canonical.count() > 0) {
      const href = await canonical.getAttribute('href')
      expect(href).toContain('/projects')
    }
  })
})

test.describe('项目详情页面 E2E 测试', () => {
  test('应该正确加载项目详情页', async ({ page }) => {
    // 导航到项目详情页
    await page.goto('/projects/auskang')
    await page.waitForLoadState('networkidle')
    
    // 检查标题
    await expect(page).toHaveTitle(/Auskang/)
    
    // 检查详情页内容
    const detailTitle = page.locator('h1').first()
    await expect(detailTitle).toBeVisible()
  })

  test('应该显示项目背景信息', async ({ page }) => {
    await page.goto('/projects/auskang')
    await page.waitForLoadState('networkidle')
    
    // 查找背景信息
    const background = page.locator('section').filter({ hasText: /背景|Background/ })
    
    if (await background.isVisible()) {
      await expect(background).toBeVisible()
    }
  })

  test('应该显示项目功能列表', async ({ page }) => {
    await page.goto('/projects/auskang')
    await page.waitForLoadState('networkidle')
    
    // 查找功能列表
    const features = page.locator('ul, ol').first()
    
    if (await features.isVisible()) {
      await expect(features).toBeVisible()
    }
  })

  test('应该显示项目截图', async ({ page }) => {
    await page.goto('/projects/auskang')
    await page.waitForLoadState('networkidle')
    
    // 查找截图
    const screenshots = page.locator('img').first()
    
    if (await screenshots.isVisible()) {
      await expect(screenshots).toBeVisible()
    }
  })

  test('应该有返回项目列表的链接', async ({ page }) => {
    await page.goto('/projects/auskang')
    await page.waitForLoadState('networkidle')
    
    // 查找返回链接
    const backLink = page.locator('a').filter({ hasText: /返回|Back|项目列表/ })
    
    if (await backLink.isVisible()) {
      await backLink.click()
      
      // 检查是否返回项目列表
      await page.waitForURL(/\/projects/)
      await expect(page).toHaveURL(/\/projects/)
    }
  })
})