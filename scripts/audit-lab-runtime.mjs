import { chromium } from '@playwright/test'
import { preview } from 'vite'

const defaultIds = [
  'aurora',
  'meteors',
  'shine-border',
  'shimmer-button',
  'number-ticker',
  'marquee',
]
const requestedIds = process.env.LAB_RUNTIME_AUDIT_IDS?.split(',').filter(Boolean)
const ids = requestedIds?.length ? requestedIds : defaultIds
const durationMs = Number(process.env.LAB_RUNTIME_AUDIT_MS ?? 30_000)
const baseUrl = 'http://127.0.0.1:4181'
const results = []
const failures = []

const server = await preview({
  root: process.cwd(),
  configFile: false,
  logLevel: 'error',
  preview: { host: '127.0.0.1', port: 4181, open: false },
})
await fetch(baseUrl)
const browser = await chromium.launch({ headless: true })
const browserVersion = browser.version()

try {
  for (const id of ids) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      hasTouch: true,
      isMobile: true,
      reducedMotion: 'no-preference',
    })
    await context.addInitScript(() => {
      localStorage.setItem(
        'analytics-consent-v1',
        JSON.stringify({ decision: 'denied', savedAt: Date.now() }),
      )
    })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    const cdp = await context.newCDPSession(page)
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })

    await page.goto(`${baseUrl}/lab/${id}`, { waitUntil: 'networkidle' })
    const coldNavigationMs = await page.evaluate(() =>
      performance.getEntriesByType('navigation')[0]?.duration ?? 0,
    )
    const runtime = await page.evaluate(async auditDuration => {
      const longTasks = []
      let longTaskObserverSupported = true
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) longTasks.push(entry.duration)
      })
      try {
        observer.observe({ type: 'longtask' })
      } catch {
        longTaskObserverSupported = false
      }

      const frames = []
      const startedAt = performance.now()
      await new Promise(resolve => {
        const sample = timestamp => {
          frames.push(timestamp)
          if (timestamp - startedAt >= auditDuration) resolve()
          else requestAnimationFrame(sample)
        }
        requestAnimationFrame(sample)
      })
      observer.disconnect()
      const elapsed = (frames.at(-1) ?? startedAt) - (frames[0] ?? startedAt)
      return {
        frames: frames.length,
        fps: elapsed > 0 ? ((frames.length - 1) * 1000) / elapsed : 0,
        longTasks,
        longTaskObserverSupported,
      }
    }, durationMs)

    await page.reload({ waitUntil: 'networkidle' })
    const warmNavigationMs = await page.evaluate(() =>
      performance.getEntriesByType('navigation')[0]?.duration ?? 0,
    )
    const maxLongTaskMs = Math.max(0, ...runtime.longTasks)
    const result = {
      id,
      durationMs,
      coldNavigationMs: Number(coldNavigationMs.toFixed(1)),
      warmNavigationMs: Number(warmNavigationMs.toFixed(1)),
      fps: Number(runtime.fps.toFixed(1)),
      maxLongTaskMs: Number(maxLongTaskMs.toFixed(1)),
      longTasksOver200Ms: runtime.longTasks.filter(value => value > 200).length,
      longTaskObserverSupported: runtime.longTaskObserverSupported,
      pageErrors: errors,
    }
    results.push(result)
    if (result.fps < 55) failures.push(`${id}: ${result.fps}fps < 55fps`)
    if (!result.longTaskObserverSupported) failures.push(`${id}: Long Tasks API 不可用`)
    if (result.longTasksOver200Ms > 0) failures.push(`${id}: 出现 >200ms 主线程长任务`)
    if (errors.length > 0) failures.push(`${id}: ${errors.length} 个页面错误`)
    await context.close()
  }
} finally {
  await browser.close()
  await new Promise(resolve => server.httpServer.close(resolve))
}

console.log(JSON.stringify({
  browser: browserVersion,
  viewport: { width: 390, height: 844, deviceScaleFactor: 2 },
  cpuSlowdown: 4,
  results,
}, null, 2))

if (failures.length > 0) {
  console.error(failures.map(message => `- ${message}`).join('\n'))
  process.exitCode = 1
}
