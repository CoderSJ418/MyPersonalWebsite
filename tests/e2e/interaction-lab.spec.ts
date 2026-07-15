import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'analytics-consent-v1',
      JSON.stringify({ decision: 'denied', savedAt: Date.now() })
    )
  })
})

test('catalog search, detail parameters, source expansion and copy work', async ({
  context,
  page
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/lab')
  await expect(page.locator('link[rel="preload"][href="/images/lab/aurora.webp"]')).toHaveCount(1)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index,follow')
  await expect(page.getByText(/面向招聘经理与 Vue 开发者/)).toBeVisible()
  await expect(page.getByRole('link', { name: /Aurora 极光背景/ })).toBeVisible()
  await page.getByRole('searchbox').fill('数字')
  await expect(page.getByRole('link', { name: /数字滚动/ })).toBeVisible()
  await page.getByRole('searchbox').fill('')
  const tagFilter = page.getByRole('combobox', { name: '技术标签', exact: true })
  await tagFilter.selectOption('requestAnimationFrame')
  await expect(page.getByRole('link', { name: /数字滚动/ })).toBeVisible()
  await expect(page.getByRole('link', { name: /Aurora 极光背景/ })).toHaveCount(0)
  await tagFilter.selectOption('all')
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight }))
  await page.getByRole('link', { name: /Aurora 极光背景/ }).click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  const speed = page.getByLabel('速度')
  await speed.fill('4')
  await expect(page.locator('pre').first()).toContainText(':speed="4"')
  await expect(page.getByRole('heading', { name: '使用场景与工程边界' })).toBeVisible()
  await expect(page.getByText('首页 Hero 的品牌氛围背景')).toBeVisible()
  await expect(page.getByRole('link', { name: '网格底纹' })).toBeVisible()
  await page.getByRole('button', { name: /完整 Vue SFC 源码/ }).click()
  await expect(page.getByText('<template>', { exact: false }).last()).toBeVisible()
  await page.getByRole('button', { name: '复制使用方式' }).click()
  await expect(page.getByRole('button', { name: '✓ 已复制' })).toBeVisible()
  await expect(page.locator('p[role="status"][aria-live="polite"]')).toHaveText('使用方式已复制')
  await expect(page.getByText('运行时依赖：vue')).toBeVisible()
  await expect(page.getByText(/已验证宿主工具链：Vue 3.4/)).toBeVisible()
})

test('invalid routes recover and mobile layout remains usable', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/lab/not-a-demo')
  await expect(page.getByRole('heading', { name: '没有找到这个效果' })).toBeVisible()
  await page.getByText('ID“not-a-demo”不在当前 12 个实验中。').dblclick()
  await expect.poll(() => page.evaluate(() => window.getSelection()?.toString() ?? '')).not.toBe('')
  await page.getByRole('link', { name: '返回交互实验室' }).click()
  await expect(page.getByRole('heading', { name: '交互实验室' })).toBeVisible()
  await expect.poll(() => page.evaluate(() => window.getSelection()?.toString() ?? '')).toBe('')

  await page.goto('/lab/number-ticker')
  await page.getByLabel('目标值').fill('50000')
  await expect(page.locator('.ticker-card strong')).toHaveText('50,000')

  const breadcrumbBox = await page.getByRole('link', { name: '交互实验室' }).boundingBox()
  const resetBox = await page.getByRole('button', { name: '恢复默认值' }).boundingBox()
  expect(breadcrumbBox?.height).toBeGreaterThanOrEqual(44)
  expect(resetBox?.height).toBeGreaterThanOrEqual(44)
})

test('portrait and landscape viewports keep Lab and Home within the canvas', async ({ page }) => {
  for (const viewport of [{ width: 375, height: 812 }, { width: 812, height: 375 }]) {
    await page.setViewportSize(viewport)
    await page.goto('/lab/aurora')
    await expect(page.getByRole('heading', { name: 'Aurora 极光背景' })).toBeVisible()
    const labWidths = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth
    }))
    expect(labWidths.document).toBeLessThanOrEqual(labWidths.viewport)

    await page.goto('/')
    await expect(page.getByRole('heading', { name: '佘杰' })).toBeVisible()
    const homeWidths = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth
    }))
    expect(homeWidths.document).toBeLessThanOrEqual(homeWidths.viewport)
  }
})

test('ten SPA demo switches remain recoverable without runtime errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  const names = [
    '网格底纹',
    '点阵背景',
    '噪点纹理',
    '流星效果',
    '卡片追光',
    '3D 倾斜卡片',
    '魔法卡片',
    '边框光泽',
    '按钮扫光',
    '数字滚动'
  ]

  await page.goto('/lab/aurora')
  for (const name of names) {
    await page.getByRole('link', { name: '交互实验室' }).click()
    await page.getByRole('link', { name: new RegExp(name) }).click()
    await expect(page.locator('[data-lab-preview]')).toHaveCount(1)
  }
  expect(errors).toEqual([])
})

test('catalog has no serious or critical WCAG violations', async ({ page }) => {
  await page.goto('/lab')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  const blockingViolations = results.violations.filter(
    ({ impact }) => impact === 'serious' || impact === 'critical'
  )

  expect(blockingViolations).toEqual([])
})

test('GA4 script is absent before consent and created after grant', async ({ page }) => {
  await page.addInitScript(() => localStorage.removeItem('analytics-consent-v1'))
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort())
  await page.goto('/lab')
  await expect(page.locator('#ga4-script')).toHaveCount(0)
  await page.getByRole('button', { name: '允许统计' }).click()
  await expect(page.locator('#ga4-script')).toHaveCount(1)
})

test('Do Not Track suppresses both prompt and GA4', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.removeItem('analytics-consent-v1')
    Object.defineProperty(navigator, 'doNotTrack', { get: () => '1' })
  })
  await page.goto('/lab')
  await expect(page.getByRole('heading', { name: '是否允许匿名使用统计？' })).toHaveCount(0)
  await expect(page.locator('#ga4-script')).toHaveCount(0)
})

test('footer preference entry can revoke a prior grant', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'analytics-consent-v1',
      JSON.stringify({ decision: 'granted', savedAt: Date.now() })
    )
  })
  await page.route('https://www.googletagmanager.com/**', (route) => route.abort())
  await page.goto('/lab')
  await expect(page.locator('#ga4-script')).toHaveCount(1)
  await page.getByRole('button', { name: '统计偏好' }).click()
  await page.getByRole('button', { name: '拒绝或撤回' }).click()
  await expect(page.locator('#ga4-script')).toHaveCount(0)
  const stored = await page.evaluate(() => localStorage.getItem('analytics-consent-v1'))
  expect(stored).toContain('denied')
})
