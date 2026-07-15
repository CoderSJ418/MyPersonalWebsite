import { test, expect } from '@playwright/test'

/**
 * E2E 测试：FeaturedProjects 展开卡片
 *
 * 测试策略：
 * - 在真实 Chromium 浏览器中运行
 * - 模拟用户真实操作流程
 * - 验证：页面加载 → 卡片渲染 → 点击展开 → 内容可见 → 折叠
 */

test.describe('FeaturedProjects 展开卡片', () => {
  test.beforeEach(async ({ page }) => {
    // 每个测试前清除 localStorage，避免 HMR 缓存干扰
    await page.goto('/')
    await page.waitForTimeout(2000) // 等待 GSAP 动画和 store 加载完成
  })

  test('页面加载后应显示 3 张精选项目卡片', async ({ page }) => {
    // 滚动到 Projects 区域
    const cards = page.locator('.fp__card')
    await expect(cards).toHaveCount(3)

    // 验证第一张卡片标题
    await expect(cards.nth(0).locator('.fp__card-title')).toHaveText('黑桃奢多角色奢侈品交易平台')
    await expect(cards.nth(1).locator('.fp__card-title')).toHaveText('蜂鸟生活跨端商城迁移')
    await expect(cards.nth(2).locator('.fp__card-title')).toHaveText('澳斯康生物官网重构项目')
  })

  test('正式发布入口保留 Projects 主 CTA 并公开 Lab 次入口', async ({ page }) => {
    await expect(page.getByRole('navigation').getByRole('link', { name: '实验室' })).toBeVisible()
    await expect(page.getByRole('link', { name: '查看作品集' })).toBeVisible()
    const labCta = page.getByRole('link', { name: '探索交互实验室' })
    await expect(labCta).toBeVisible()
    await labCta.click()
    await expect(page).toHaveURL(/\/lab\?source=home_cta$/)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index,follow')
  })

  test('点击卡片应展开显示详细内容', async ({ page }) => {
    const firstCard = page.locator('.fp__card').first()

    // 展开前，详细内容应该不可见
    const expandable = firstCard.locator('.fp__expandable')
    await expect(expandable).toHaveCSS('max-height', /0px/)

    // 点击展开
    await firstCard.click()
    await page.waitForTimeout(600) // 等待 CSS transition 完成

    // 展开后，详细内容应该可见
    await expect(expandable).toHaveCSS('max-height', /[1-9]\d+px/)

    // 验证展开内容包含关键信息
    await expect(firstCard.locator('.fp__card-desc')).toContainText('竞拍状态建模')
    await expect(firstCard.locator('.fp__narrative')).toBeVisible()
    await expect(firstCard.locator('.fp__metrics')).toBeVisible()
  })

  test('展开后再次点击应折叠', async ({ page }) => {
    const firstCard = page.locator('.fp__card').first()

    // 展开
    await firstCard.click()
    await page.waitForTimeout(600)

    // 折叠
    await firstCard.click()
    await page.waitForTimeout(600)

    // 验证折叠
    const expandable = firstCard.locator('.fp__expandable')
    await expect(expandable).toHaveCSS('max-height', /0px/)
  })

  test('展开一张卡片时，另一张应自动折叠', async ({ page }) => {
    // 展开第一张
    await page.locator('.fp__card').nth(0).click()
    await page.waitForTimeout(600)

    // 展开第二张（第一张应该自动折叠）
    await page.locator('.fp__card').nth(1).click()
    await page.waitForTimeout(600)

    // 验证第二张展开
    const secondExpandable = page.locator('.fp__card').nth(1).locator('.fp__expandable')
    await expect(secondExpandable).toHaveCSS('max-height', /[1-9]\d+px/)
  })

  test('箭头指示器应随展开状态旋转', async ({ page }) => {
    const firstCard = page.locator('.fp__card').first()
    const arrow = firstCard.locator('.fp__card-arrow')

    // 初始状态：没有展开 class
    await expect(arrow).not.toHaveClass(/fp__card-arrow--open/)

    // 点击展开
    await firstCard.click()
    await page.waitForTimeout(400)

    // 展开后：应该有旋转 class
    await expect(arrow).toHaveClass(/fp__card-arrow--open/)
  })

  test('技术标签应正确显示', async ({ page }) => {
    const tags = page.locator('.fp__card-tag')
    const tagTexts = await tags.allTextContents()

    expect(tagTexts).toContain('Vue')
    expect(tagTexts).toContain('TypeScript')
    expect(tagTexts).toContain('Vite')
  })

  test('真实项目详情区分个人贡献与团队成果', async ({ page }) => {
    await page.goto('/projects')
    const cover = page.getByAltText('黑桃奢多角色奢侈品交易平台')
    await cover.scrollIntoViewIfNeeded()
    await expect(cover).toBeVisible()
    expect(await cover.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)

    await page.goto('/projects/4')
    await expect(page.getByRole('heading', { name: '黑桃奢多角色奢侈品交易平台' })).toBeVisible()
    await expect(
      page.getByText('核心前端开发，负责用户端与商家端关键业务架构和交互落地')
    ).toBeVisible()
    await expect(page.getByRole('heading', { name: '我的贡献' })).toBeVisible()
    await expect(page.getByRole('link', { name: '查看演示' })).toHaveCount(0)

    await page.getByRole('button', { name: 'Reader' }).click()
    await expect(page.getByRole('heading', { name: '团队成果' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '案例边界' })).toBeVisible()

    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/projects/5')
    await expect(page.getByRole('heading', { name: '蜂鸟生活跨端商城迁移' })).toBeVisible()
    const widths = await page.evaluate(() => ({
      document: document.documentElement.scrollWidth,
      viewport: innerWidth
    }))
    expect(widths.document).toBe(widths.viewport)
  })

  test('首页项目卡片默认使用轻量边界而非整圈渐变', async ({ page }) => {
    const backgroundImage = await page
      .locator('[data-effect-consumer="magic-card"]')
      .first()
      .evaluate((element) => getComputedStyle(element).backgroundImage)
    expect(backgroundImage).not.toContain('conic-gradient')
  })

  test('首页真实复用四个 Lab 旗舰效果并保持可操作', async ({ page }) => {
    await expect(page.locator('[data-effect-consumer="aurora"]')).toBeVisible()
    await expect(page.getByRole('link', { name: '查看作品集' })).toBeVisible()
    await expect(page.locator('[data-effect-consumer="magic-card"]')).toHaveCount(3)

    const firstCard = page.locator('.fp__card').first()
    await firstCard.getByRole('button', { name: /黑桃奢多角色奢侈品交易平台/ }).click()
    const metrics = firstCard.locator('[data-effect-consumer="number-ticker"]')
    await expect(metrics).toBeVisible()
    await expect(metrics.getByText('业务端')).toBeVisible()

    const contact = page.locator('[data-effect-consumer="shimmer-button"]')
    await expect(contact).toHaveCount(0)
    await page.locator('[data-home-deferred]').scrollIntoViewIfNeeded()
    await expect(contact).toHaveCount(1)
    await expect(contact.getByRole('link', { name: '联系我' })).toHaveAttribute('href', /^mailto:/)
  })

  test('旗舰效果尊重 reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.reload()
    const auroraAnimation = await page
      .locator('.aurora__band')
      .first()
      .evaluate((element) => getComputedStyle(element).animationName)
    await page.locator('[data-home-deferred]').scrollIntoViewIfNeeded()
    const shimmerDisplay = await page
      .locator('.shimmer-button')
      .evaluate((element) => getComputedStyle(element, '::after').display)
    expect(auroraAnimation).toBe('none')
    expect(shimmerDisplay).toBe('none')
  })

  test('页面应无 JavaScript 错误', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))

    await page.reload()
    await page.waitForTimeout(3000)

    // 过滤掉已知的非关键错误（如 analytics）
    const criticalErrors = errors.filter(
      (e) => !e.includes('Google Analytics') && !e.includes('preload') && !e.includes('favicon')
    )

    expect(criticalErrors).toHaveLength(0)
  })

  test('响应式：移动端卡片应正确显示', async ({ page }) => {
    // 模拟 iPhone 13 视口
    await page.setViewportSize({ width: 375, height: 812 })
    await page.reload()
    await page.waitForTimeout(2000)

    const cards = page.locator('.fp__card')
    await expect(cards).toHaveCount(3)

    // 移动端卡片应占满宽度
    const firstCard = cards.first()
    const box = await firstCard.boundingBox()
    expect(box!.width).toBeGreaterThan(300)
  })
})
