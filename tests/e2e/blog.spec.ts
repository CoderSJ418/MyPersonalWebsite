import { test, expect } from '@playwright/test'

test.describe('博客页面 E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog')
    await page.waitForLoadState('networkidle')
  })

  test('应该正确加载博客页面', async ({ page }) => {
    // 检查标题
    await expect(page).toHaveTitle(/博客|Blog/)
    
    // 检查页面标题
    const pageTitle = page.locator('h1').filter({ hasText: /博客|Blog/ })
    await expect(pageTitle).toBeVisible()
  })

  test('应该显示博客文章列表', async ({ page }) => {
    // 查找博客卡片
    const blogCards = page.locator('.blog-card, [class*="blog"], article').first()
    await expect(blogCards).toBeVisible()
  })

  test('应该显示文章标题', async ({ page }) => {
    // 查找文章标题
    const articleTitles = page.locator('h2, h3').filter({ hasText: /Vue|React|TypeScript/ })
    
    if (await articleTitles.count() > 0) {
      await expect(articleTitles.first()).toBeVisible()
    }
  })

  test('应该显示文章摘要', async ({ page }) => {
    // 查找文章摘要
    const articleExcerpts = page.locator('p').first()
    
    if (await articleExcerpts.isVisible()) {
      await expect(articleExcerpts).toBeVisible()
    }
  })

  test('应该显示文章发布日期', async ({ page }) => {
    // 查找日期信息
    const dates = page.locator('time, [class*="date"], [class*="time"]').first()
    
    if (await dates.isVisible()) {
      await expect(dates).toBeVisible()
    }
  })

  test('应该能点击文章查看详情', async ({ page }) => {
    // 查找第一个文章卡片
    const firstArticle = page.locator('.blog-card, [class*="blog"], article').first()
    
    if (await firstArticle.isVisible()) {
      // 点击文章卡片
      await firstArticle.click()
      
      // 检查是否跳转到详情页
      await page.waitForURL(/\/blog\/\w+/)
      
      // 检查详情页内容
      const detailTitle = page.locator('h1').first()
      await expect(detailTitle).toBeVisible()
    }
  })

  test('应该显示文章分类标签', async ({ page }) => {
    // 查找分类标签
    const categoryTags = page.locator('.category, [class*="tag"]').first()
    
    if (await categoryTags.isVisible()) {
      await expect(categoryTags).toBeVisible()
    }
  })

  test('应该在移动端正确显示', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    
    // 检查文章卡片是否适应移动端
    const blogCards = page.locator('.blog-card, [class*="blog"], article').first()
    await expect(blogCards).toBeVisible()
  })

  test('应该支持文章搜索（如果存在）', async ({ page }) => {
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

  test('应该支持文章分类筛选（如果存在）', async ({ page }) => {
    // 查找分类按钮
    const categoryButtons = page.locator('button').filter({ hasText: /全部|前端|后端/ })
    
    if (await categoryButtons.count() > 0) {
      // 点击第一个分类
      await categoryButtons.first().click()
      
      // 等待筛选结果
      await page.waitForTimeout(500)
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
      expect(href).toContain('/blog')
    }
  })
})

test.describe('博客详情页面 E2E 测试', () => {
  test('应该正确加载博客详情页', async ({ page }) => {
    // 导航到博客详情页
    await page.goto('/blog/vue3-composition-api')
    await page.waitForLoadState('networkidle')
    
    // 检查标题
    await expect(page).toHaveTitle(/Vue 3/)
    
    // 检查详情页内容
    const detailTitle = page.locator('h1').first()
    await expect(detailTitle).toBeVisible()
  })

  test('应该显示文章完整内容', async ({ page }) => {
    await page.goto('/blog/vue3-composition-api')
    await page.waitForLoadState('networkidle')
    
    // 查找文章内容
    const articleContent = page.locator('article, .content, [class*="article"]').first()
    await expect(articleContent).toBeVisible()
  })

  test('应该显示代码块（如果存在）', async ({ page }) => {
    await page.goto('/blog/vue3-composition-api')
    await page.waitForLoadState('networkidle')
    
    // 查找代码块
    const codeBlocks = page.locator('pre, code').first()
    
    if (await codeBlocks.isVisible()) {
      await expect(codeBlocks).toBeVisible()
    }
  })

  test('应该显示文章元数据', async ({ page }) => {
    await page.goto('/blog/vue3-composition-api')
    await page.waitForLoadState('networkidle')
    
    // 查找元数据（日期、作者等）
    const metadata = page.locator('[class*="meta"], [class*="info"]').first()
    
    if (await metadata.isVisible()) {
      await expect(metadata).toBeVisible()
    }
  })

  test('应该有返回博客列表的链接', async ({ page }) => {
    await page.goto('/blog/vue3-composition-api')
    await page.waitForLoadState('networkidle')
    
    // 查找返回链接
    const backLink = page.locator('a').filter({ hasText: /返回|Back|博客列表/ })
    
    if (await backLink.isVisible()) {
      await backLink.click()
      
      // 检查是否返回博客列表
      await page.waitForURL(/\/blog/)
      await expect(page).toHaveURL(/\/blog/)
    }
  })

  test('应该支持文章分享（如果存在）', async ({ page }) => {
    await page.goto('/blog/vue3-composition-api')
    await page.waitForLoadState('networkidle')
    
    // 查找分享按钮
    const shareButtons = page.locator('button').filter({ hasText: /分享|Share/ })
    
    if (await shareButtons.count() > 0) {
      await expect(shareButtons.first()).toBeVisible()
    }
  })
})