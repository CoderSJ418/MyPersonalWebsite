import { defineConfig, devices } from '@playwright/test'

const testPort = Number(process.env.PLAYWRIGHT_PORT ?? 4175)
const testBaseUrl = `http://127.0.0.1:${testPort}`

/**
 * Playwright E2E 测试配置
 *
 * 测试策略：
 * - 使用 dev server（vite）作为测试目标
 * - Chromium 为主（覆盖大部分用户）
 * - Mobile viewport 测试响应式
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: testBaseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },

  // 启动 dev server 进行测试
  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${testPort} --strictPort`,
    env: { ...process.env, VITE_GA_MEASUREMENT_ID: 'G-TEST123' },
    url: testBaseUrl,
    reuseExistingServer: false,
    timeout: 120 * 1000
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
})
