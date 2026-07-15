import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { chromium } from '@playwright/test'
import sharp from 'sharp'
import { preview } from 'vite'

const root = process.cwd()
const metadata = JSON.parse(readFileSync(resolve(root, 'src/assets/data/lab-effects.json'), 'utf8'))
const requestedIds = process.argv.slice(2)
const effects = requestedIds.length > 0
  ? metadata.filter(effect => requestedIds.includes(effect.id))
  : metadata
const outputDir = resolve(root, 'public/images/lab')
const manifestPath = resolve(outputDir, 'manifest.json')
mkdirSync(outputDir, { recursive: true })

const server = await preview({
  root,
  configFile: false,
  logLevel: 'error',
  preview: { host: '127.0.0.1', port: 4179, open: false },
})
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: 720, height: 720 },
  deviceScaleFactor: 1,
  locale: 'zh-CN',
  reducedMotion: 'no-preference',
})
const page = await context.newPage()
await page.addInitScript(() => {
  let seed = 24
  Object.defineProperty(Math, 'random', {
    configurable: true,
    value: () => {
      seed += 0x6d2b79f5
      let value = seed
      value = Math.imul(value ^ (value >>> 15), value | 1)
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296
    },
  })
  localStorage.setItem(
    'analytics-consent-v1',
    JSON.stringify({ decision: 'denied', savedAt: Date.now() }),
  )
})
page.on('pageerror', error => console.error(`[preview page] ${error.message}`))
page.on('console', message => {
  if (message.type() === 'error') console.error(`[preview console] ${message.text()}`)
})

const previous = existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, 'utf8'))
  : { version: 1, items: [] }
const retained = previous.items.filter(item => !effects.some(effect => effect.id === item.id))
const generated = []

for (const effect of effects) {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto(`http://127.0.0.1:4179/lab/${effect.id}`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.addStyleTag({ content: '* { animation-delay: -1s !important; animation-play-state: paused !important; }' })
  if (effect.id === 'number-ticker') await page.waitForTimeout(2200)
  const preview = page.locator('[data-lab-preview]')
  await preview.waitFor({ state: 'visible' })
  const primaryPng = await preview.screenshot({ type: 'png' })
  await sharp(primaryPng).webp({ quality: 90 }).toFile(resolve(outputDir, `${effect.id}.webp`))

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.reload({ waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  const reducedPng = await preview.screenshot({ type: 'png' })
  await sharp(reducedPng).webp({ quality: 90 }).toFile(resolve(outputDir, `${effect.id}-reduced.webp`))

  const fileName = `${effect.id.split('-').map(part => `${part[0].toUpperCase()}${part.slice(1)}`).join('')}Demo.vue`
  const source = readFileSync(resolve(root, 'src/views/Lab/demos', fileName))
  generated.push({
    id: effect.id,
    params: Object.fromEntries(effect.params.map(param => [param.key, param.defaultValue])),
    sourceSha256: createHash('sha256').update(source).digest('hex'),
    representativeFrameMs: effect.id === 'number-ticker' ? 2200 : 1000,
    preview: `/images/lab/${effect.id}.webp`,
    reducedMotionPreview: `/images/lab/${effect.id}-reduced.webp`,
  })
}

writeFileSync(manifestPath, `${JSON.stringify({
  version: 1,
  browser: browser.version(),
  viewport: { width: 720, height: 720, deviceScaleFactor: 1 },
  randomSeed: 24,
  representativeFrame: 'CSS animations paused at -1s delay',
  items: [...retained, ...generated].sort((left, right) => left.id.localeCompare(right.id)),
}, null, 2)}\n`)

await context.close()
await browser.close()
await new Promise(resolveClose => server.httpServer.close(resolveClose))
console.log(`Generated ${generated.length} Lab preview pairs`)
