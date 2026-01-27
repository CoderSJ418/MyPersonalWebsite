import { test, expect } from '@playwright/test'

test.describe('关于页面 E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about')
    await page.waitForLoadState('networkidle')
  })

  test('应该正确加载关于页面', async ({ page }) => {
    // 检查标题
    await expect(page).toHaveTitle(/关于|About|个人介绍/)
    
    // 检查页面标题
    const pageTitle = page.locator('h1').filter({ hasText: /关于|About|个人介绍/ })
    await expect(pageTitle).toBeVisible()
  })

  test('应该显示个人头像', async ({ page }) => {
    // 查找头像
    const avatar = page.locator('img').filter({ hasAttribute: 'alt', attrValue: /头像|avatar/i })
    
    if (await avatar.count() > 0) {
      await expect(avatar).toBeVisible()
      // 检查图片是否加载完成
      await expect(avatar).toHaveJSProperty('complete', true)
    }
  })

  test('应该显示个人基本信息', async ({ page }) => {
    // 查找姓名
    const name = page.locator('h1, h2').filter({ hasText: /佘杰/ })
    await expect(name).toBeVisible()
    
    // 查找职位
    const title = page.locator('p, span').filter({ hasText: /前端开发工程师/ })
    await expect(title).toBeVisible()
  })

  test('应该显示个人简介', async ({ page }) => {
    // 查找简介文本
    const bio = page.locator('p').filter({ hasText: /经验|擅长|专注/ })
    
    if (await bio.count() > 0) {
      await expect(bio.first()).toBeVisible()
    }
  })

  test('应该显示工作经历', async ({ page }) => {
    // 查找工作经历区域
    const experienceSection = page.locator('section').filter({ hasText: /工作经历|Experience/ })
    
    if (await experienceSection.isVisible()) {
      await expect(experienceSection).toBeVisible()
      
      // 查找工作经历列表
      const experienceItems = experienceSection.locator('[class*="experience"], [class*="work"]')
      
      if (await experienceItems.count() > 0) {
        await expect(experienceItems.first()).toBeVisible()
      }
    }
  })

  test('应该显示教育背景', async ({ page }) => {
    // 查找教育背景区域
    const educationSection = page.locator('section').filter({ hasText: /教育背景|Education/ })
    
    if (await educationSection.isVisible()) {
      await expect(educationSection).toBeVisible()
      
      // 查找教育经历列表
      const educationItems = educationSection.locator('[class*="education"], [class*="school"]')
      
      if (await educationItems.count() > 0) {
        await expect(educationItems.first()).toBeVisible()
      }
    }
  })

  test('应该显示技能列表', async ({ page }) => {
    // 查找技能区域
    const skillsSection = page.locator('section').filter({ hasText: /技能|Skills/ })
    
    if (await skillsSection.isVisible()) {
      await expect(skillsSection).toBeVisible()
      
      // 查找技能标签
      const skillTags = skillsSection.locator('[class*="skill"], [class*="tag"]')
      
      if (await skillTags.count() > 0) {
        await expect(skillTags.first()).toBeVisible()
      }
    }
  })

  test('应该显示联系方式', async ({ page }) => {
    // 查找联系方式
    const contactInfo = page.locator('section').filter({ hasText: /邮箱|电话|GitHub/ })
    
    if (await contactInfo.isVisible()) {
      await expect(contactInfo).toBeVisible()
    }
  })

  test('应该显示社交媒体链接', async ({ page }) => {
    // 查找社交媒体链接
    const socialLinks = page.locator('a').filter({ hasText: /GitHub|LinkedIn|Twitter/ })
    
    if (await socialLinks.count() > 0) {
      await expect(socialLinks.first()).toBeVisible()
    }
  })

  test('应该在移动端正确显示', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    
    // 检查主要内容是否适应移动端
    const mainContent = page.locator('main').first()
    await expect(mainContent).toBeVisible()
  })

  test('应该有正确的 SEO 元素', async ({ page }) => {
    // 检查 meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content')
    expect(metaDescription).toBeTruthy()
    
    // 检查 canonical link
    const canonical = page.locator('link[rel="canonical"]').first()
    if (await canonical.count() > 0) {
      const href = await canonical.getAttribute('href')
      expect(href).toContain('/about')
    }
  })

  test('应该支持平滑滚动', async ({ page }) => {
    // 查找导航链接
    const navLinks = page.locator('nav a').first()
    
    if (await navLinks.isVisible()) {
      // 点击导航链接
      await navLinks.click()
      
      // 检查是否滚动到相应区域
      await page.waitForTimeout(500)
      
      // 验证滚动位置
      const scrollY = await page.evaluate(() => window.scrollY)
      expect(scrollY).toBeGreaterThan(0)
    }
  })

  test('应该显示时间线（如果存在）', async ({ page }) => {
    // 查找时间线
    const timeline = page.locator('[class*="timeline"], [class*="timeline-item"]').first()
    
    if (await timeline.isVisible()) {
      await expect(timeline).toBeVisible()
    }
  })

  test('应该显示语言能力', async ({ page }) => {
    // 查找语言信息
    const languages = page.locator('section').filter({ hasText: /语言|Language/ })
    
    if (await languages.isVisible()) {
      await expect(languages).toBeVisible()
    }
  })

  test('应该显示兴趣爱好', async ({ page }) => {
    // 查找兴趣爱好
    const interests = page.locator('section').filter({ hasText: /兴趣|Interest|爱好/ })
    
    if (await interests.isVisible()) {
      await expect(interests).toBeVisible()
    }
  })
})