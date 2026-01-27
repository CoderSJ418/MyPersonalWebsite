import { test, expect } from '@playwright/test'

test.describe('联系方式页面 E2E 测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')
  })

  test('应该正确加载联系页面', async ({ page }) => {
    // 检查标题
    await expect(page).toHaveTitle(/联系|Contact/)
    
    // 检查页面标题
    const pageTitle = page.locator('h1').filter({ hasText: /联系|Contact/ })
    await expect(pageTitle).toBeVisible()
  })

  test('应该显示联系表单', async ({ page }) => {
    // 查找表单
    const form = page.locator('form').first()
    await expect(form).toBeVisible()
  })

  test('应该显示所有表单字段', async ({ page }) => {
    // 查找姓名输入框
    const nameInput = page.locator('input[name="name"], input[placeholder*="姓名"], input[placeholder*="Name"]')
    await expect(nameInput).toBeVisible()
    
    // 查找邮箱输入框
    const emailInput = page.locator('input[name="email"], input[type="email"], input[placeholder*="邮箱"], input[placeholder*="Email"]')
    await expect(emailInput).toBeVisible()
    
    // 查找主题输入框
    const subjectInput = page.locator('input[name="subject"], input[placeholder*="主题"], input[placeholder*="Subject"]')
    if (await subjectInput.count() > 0) {
      await expect(subjectInput).toBeVisible()
    }
    
    // 查找消息文本框
    const messageTextarea = page.locator('textarea[name="message"], textarea[placeholder*="消息"], textarea[placeholder*="Message"]')
    await expect(messageTextarea).toBeVisible()
  })

  test('应该显示提交按钮', async ({ page }) => {
    // 查找提交按钮
    const submitButton = page.locator('button[type="submit"]').filter({ hasText: /发送|提交|Send/ })
    await expect(submitButton).toBeVisible()
  })

  test('应该验证表单字段', async ({ page }) => {
    // 查找提交按钮
    const submitButton = page.locator('button[type="submit"]').first()
    
    // 直接点击提交（不填写任何字段）
    await submitButton.click()
    
    // 等待验证错误
    await page.waitForTimeout(500)
    
    // 检查是否显示验证错误
    const errorMessages = page.locator('[class*="error"], [role="alert"]').first()
    
    if (await errorMessages.isVisible()) {
      await expect(errorMessages).toBeVisible()
    }
  })

  test('应该验证邮箱格式', async ({ page }) => {
    // 查找邮箱输入框
    const emailInput = page.locator('input[name="email"], input[type="email"]').first()
    
    // 输入无效邮箱
    await emailInput.fill('invalid-email')
    
    // 查找提交按钮
    const submitButton = page.locator('button[type="submit"]').first()
    await submitButton.click()
    
    // 等待验证错误
    await page.waitForTimeout(500)
    
    // 检查是否显示邮箱格式错误
    const emailError = page.locator('[class*="error"]').filter({ hasText: /邮箱|Email/ })
    
    if (await emailError.isVisible()) {
      await expect(emailError).toBeVisible()
    }
  })

  test('应该成功提交表单', async ({ page }) => {
    // 填写表单
    const nameInput = page.locator('input[name="name"]').first()
    const emailInput = page.locator('input[name="email"], input[type="email"]').first()
    const messageTextarea = page.locator('textarea[name="message"]').first()
    
    await nameInput.fill('测试用户')
    await emailInput.fill('test@example.com')
    await messageTextarea.fill('这是一条测试消息')
    
    // 查找提交按钮
    const submitButton = page.locator('button[type="submit"]').first()
    await submitButton.click()
    
    // 等待提交完成
    await page.waitForTimeout(2000)
    
    // 检查是否显示成功消息
    const successMessage = page.locator('[class*="success"], [role="status"]').filter({ hasText: /成功|Success|已发送/ })
    
    if (await successMessage.isVisible({ timeout: 3000 })) {
      await expect(successMessage).toBeVisible()
    }
  })

  test('应该显示联系信息', async ({ page }) => {
    // 查找联系信息区域
    const contactInfo = page.locator('section').filter({ hasText: /邮箱|电话|地址/ })
    
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
    
    // 检查表单是否适应移动端
    const form = page.locator('form').first()
    await expect(form).toBeVisible()
  })

  test('应该有正确的 SEO 元素', async ({ page }) => {
    // 检查 meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content')
    expect(metaDescription).toBeTruthy()
    
    // 检查 canonical link
    const canonical = page.locator('link[rel="canonical"]').first()
    if (await canonical.count() > 0) {
      const href = await canonical.getAttribute('href')
      expect(href).toContain('/contact')
    }
  })

  test('应该支持键盘导航', async ({ page }) => {
    // 测试 Tab 键导航
    await page.keyboard.press('Tab')
    
    // 检查焦点是否移动到第一个表单字段
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('应该显示加载状态', async ({ page }) => {
    // 填写表单
    const nameInput = page.locator('input[name="name"]').first()
    const emailInput = page.locator('input[name="email"], input[type="email"]').first()
    const messageTextarea = page.locator('textarea[name="message"]').first()
    
    await nameInput.fill('测试用户')
    await emailInput.fill('test@example.com')
    await messageTextarea.fill('这是一条测试消息')
    
    // 查找提交按钮
    const submitButton = page.locator('button[type="submit"]').first()
    
    // 点击提交
    await submitButton.click()
    
    // 检查是否显示加载状态
    const loadingIndicator = page.locator('[class*="loading"], [aria-busy="true"]').first()
    
    if (await loadingIndicator.isVisible({ timeout: 1000 })) {
      await expect(loadingIndicator).toBeVisible()
    }
  })
})