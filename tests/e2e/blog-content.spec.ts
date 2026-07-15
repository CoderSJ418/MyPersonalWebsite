import { test, expect } from '@playwright/test'

test.describe('工程化博客内容', () => {
  test('时间线完整展示 2024 至 2026 年各 6 篇文章', async ({ page }) => {
    await page.goto('/blog')

    for (const year of ['2026', '2025', '2024']) {
      const header = page.locator('.timeline__year-header').filter({ hasText: year })
      await expect(header).toBeVisible()
      await expect(header).toContainText('6 篇')
    }

    await expect(page.getByText('【2025最新版】3小时学会Vue3')).toHaveCount(0)
  })

  test('长文章先渲染摘要，点击后才显示完整正文', async ({ page }) => {
    await page.goto('/blog/21')
    await expect(
      page.getByRole('heading', { name: '长文章不该一次性渲染：Markdown 按需展开架构' })
    ).toBeVisible()
    await expect(page.getByRole('heading', { name: '明确折叠标记，而不是猜长度' })).toHaveCount(0)

    const expand = page.getByRole('button', { name: /展开完整文章/ })
    await expect(expand).toHaveAttribute('aria-expanded', 'false')
    await expand.click()

    await expect(page.getByRole('heading', { name: '明确折叠标记，而不是猜长度' })).toBeVisible()
    await expect(page.getByRole('button', { name: '收起到文章摘要' })).toHaveAttribute(
      'aria-expanded',
      'true'
    )
  })

  test('普通文章直接展示全文且移动端无横向滚动', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/blog/1')

    await expect(
      page.getByRole('heading', { name: 'INP 替代 FID：把“页面能点”升级为“交互真正及时”' })
    ).toBeVisible()
    await expect(page.getByRole('button', { name: /展开完整文章/ })).toHaveCount(0)

    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth
    }))
    expect(dimensions.document).toBe(dimensions.viewport)
  })
})
