import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const dist = resolve(root, 'dist')
const manifest = JSON.parse(readFileSync(resolve(dist, '.vite/manifest.json'), 'utf8'))
const entry = manifest['index.html']

if (!entry || !Array.isArray(entry.css) || entry.css.length === 0) {
  throw new Error('构建清单缺少入口 CSS')
}

const styles = entry.css
  .map(file => readFileSync(resolve(dist, file), 'utf8'))
  .join('\n')
let html = readFileSync(resolve(dist, 'index.html'), 'utf8')

for (const file of entry.css) {
  const href = `/${file}`
  html = html.replace(new RegExp(`<link[^>]+href=["']${href}["'][^>]*>`, 'g'), '')
}

html = html.replace('</head>', `<style data-critical>\n${styles}\n</style>\n</head>`)
writeFileSync(resolve(dist, 'index.html'), html)
console.log(`Critical CSS inlined: ${entry.css.length} file(s)`)
