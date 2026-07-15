import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const expectedIds = [
  'aurora', 'grid-pattern', 'dot-pattern', 'noise-texture', 'meteors', 'spotlight',
  'tilt-card', 'magic-card', 'shine-border', 'shimmer-button', 'number-ticker', 'marquee',
]
const idToFile = id => `${id.split('-').map(part => `${part[0].toUpperCase()}${part.slice(1)}`).join('')}Demo.vue`
const failures = []
const fail = message => failures.push(message)
const read = path => readFileSync(resolve(root, path), 'utf8')
const contentFields = [
  'useCases', 'avoidWhen', 'pairings', 'stack', 'implementationNotes',
  'performanceNotes', 'accessibilityNotes', 'usedIn',
]
const animatedIds = new Set([
  'aurora', 'meteors', 'shine-border', 'shimmer-button', 'number-ticker', 'marquee',
])

const metadata = JSON.parse(read('src/assets/data/lab-effects.json'))
const ids = metadata.map(effect => effect.id)
if (JSON.stringify(ids) !== JSON.stringify(expectedIds)) fail('元数据 ID 或顺序不符合冻结清单')
if (new Set(ids).size !== expectedIds.length) fail('元数据存在重复 ID')

for (const effect of metadata) {
  const fields = [
    'id', 'name', 'description', 'category', 'tags', 'params', 'compatibility', 'preview',
    'dependencies', 'license', 'sourceUrl', 'implementationOrigin', ...contentFields,
  ]
  for (const field of fields) {
    if (!Object.hasOwn(effect, field)) fail(`${effect.id} 缺少字段 ${field}`)
  }
  if (effect.license !== 'MIT') fail(`${effect.id} 不是 MIT`)
  if (!['original', 'clean-room', 'mit-adaptation'].includes(effect.implementationOrigin)) {
    fail(`${effect.id} 的实现来源无效`)
  }
  if (effect.implementationOrigin === 'original' && effect.sourceUrl !== null) {
    fail(`${effect.id} 为原创实现但 sourceUrl 非 null`)
  }
  if (effect.implementationOrigin !== 'original' && !effect.sourceUrl) {
    fail(`${effect.id} 的非原创实现缺少 sourceUrl`)
  }
  if (!Array.isArray(effect.useCases) || effect.useCases.length < 2) {
    fail(`${effect.id} 至少需要两个适用场景`)
  }
  for (const field of contentFields.filter(field => field !== 'usedIn')) {
    if (!Array.isArray(effect[field]) || effect[field].length === 0) {
      fail(`${effect.id} 的 ${field} 不能为空`)
    }
  }
  if (!effect.preview?.alt?.trim()) fail(`${effect.id} 的预览缺少替代文本`)
  if (!Array.isArray(effect.dependencies)) fail(`${effect.id} 的 dependencies 必须为数组`)
  if (effect.pairings?.some(id => !expectedIds.includes(id) || id === effect.id)) {
    fail(`${effect.id} 的搭配引用无效或自引用`)
  }
  if (effect.pairings && new Set(effect.pairings).size !== effect.pairings.length) {
    fail(`${effect.id} 的搭配引用重复`)
  }
  if (!Array.isArray(effect.usedIn) || effect.usedIn.some(item => !item.label?.trim() || !item.path?.startsWith('/'))) {
    fail(`${effect.id} 的站内应用记录无效`)
  }
}

const demosDir = resolve(root, 'src/views/Lab/demos')
const demoFiles = readdirSync(demosDir).filter(file => file.endsWith('Demo.vue')).sort()
const expectedFiles = expectedIds.map(idToFile).sort()
if (JSON.stringify(demoFiles) !== JSON.stringify(expectedFiles)) fail('Demo 文件与 12 项清单不一致')
for (const file of demoFiles) {
  const source = read(`src/views/Lab/demos/${file}`)
  if (source.split('\n').length >= 200) fail(`${file} 达到或超过 200 行`)
  if (source.includes('inject(') || source.includes("from '@/")) fail(`${file} 依赖 Lab 私有上下文或项目模块`)
  if (source.includes('requestAnimationFrame') && !source.includes('cancelAnimationFrame')) {
    fail(`${file} 创建 rAF 但未声明取消逻辑`)
  }
  if (source.includes('addEventListener') && !source.includes('removeEventListener')) {
    fail(`${file} 注册事件监听但未声明移除逻辑`)
  }
  if (source.includes('setInterval') && !source.includes('clearInterval')) {
    fail(`${file} 创建 interval 但未声明清理逻辑`)
  }
  if (source.includes('gsap.') && !source.includes('.kill(')) {
    fail(`${file} 创建 GSAP 实例但未声明 kill 逻辑`)
  }
}
if (!existsSync(resolve(demosDir, 'LICENSE'))) fail('Demo 目录缺少 MIT LICENSE')

const registry = read('src/config/labRegistry.ts')
for (const file of expectedFiles) {
  if (!registry.includes(`${file}')`) || !registry.includes(`${file}?raw')`)) {
    fail(`${file} 未同时绑定组件和 raw 源码`)
  }
}
if (registry.includes('code:') || registry.includes('animated-gradient-text')) {
  fail('注册表仍包含手写源码或已排除条目')
}

const robots = read('public/robots.txt')
if (robots.includes('Disallow: /lab')) fail('正式发布 robots.txt 仍排除 /lab')
const sitemapBuilder = read('scripts/build-sitemap.js')
if (!sitemapBuilder.includes('lab-effects.json')) fail('正式 Sitemap 未使用 Lab 元数据生成详情 URL')

const phaseOneOnly = process.argv.includes('--phase=1')
const idsArgument = process.argv.find(argument => argument.startsWith('--ids='))
const previewIds = idsArgument ? idsArgument.slice('--ids='.length).split(',') : expectedIds
if (!phaseOneOnly) {
  const manifestPath = resolve(root, 'public/images/lab/manifest.json')
  if (!existsSync(manifestPath)) fail('缺少静态预览 manifest')
  else {
    const manifest = JSON.parse(read('public/images/lab/manifest.json'))
    if (!manifest.browser || manifest.randomSeed !== 24) fail('预览 manifest 缺少固定浏览器或随机种子')
    if (manifest.viewport?.width !== 720 || manifest.viewport?.height !== 720 || manifest.viewport?.deviceScaleFactor !== 1) {
      fail('预览 manifest 的 viewport 或 device scale factor 不符合固定配置')
    }
    if (manifest.items.length !== expectedIds.length) fail('预览 manifest 存在缺失或孤儿条目')
    for (const id of previewIds) {
      const item = manifest.items.find(entry => entry.id === id)
      const previewPath = resolve(root, `public/images/lab/${id}.webp`)
      const reducedPath = resolve(root, `public/images/lab/${id}-reduced.webp`)
      const demoPath = resolve(demosDir, idToFile(id))
      if (!item) fail(`${id} 缺少预览 manifest 条目`)
      if (!existsSync(previewPath)) fail(`${id} 缺少 WebP 预览`)
      if (!existsSync(reducedPath)) fail(`${id} 缺少 reduced-motion WebP 预览`)
      if (item && existsSync(demoPath)) {
        const digest = createHash('sha256').update(readFileSync(demoPath)).digest('hex')
        if (item.sourceSha256 !== digest) fail(`${id} 的预览已与源码漂移`)
      }
      if (item && animatedIds.has(id) && !Number.isFinite(item.representativeFrameMs)) {
        fail(`${id} 缺少动画代表帧时间`)
      }
      const effect = metadata.find(entry => entry.id === id)
      const defaults = effect && Object.fromEntries(effect.params.map(param => [param.key, param.defaultValue]))
      if (item && JSON.stringify(item.params) !== JSON.stringify(defaults)) {
        fail(`${id} 的预览参数与注册默认值不一致`)
      }
    }
  }
}

const buildManifestPath = resolve(root, 'dist/.vite/manifest.json')
if (existsSync(buildManifestPath)) {
  const buildManifest = JSON.parse(read('dist/.vite/manifest.json'))
  for (const file of expectedFiles) {
    const key = `src/views/Lab/demos/${file}`
    if (!buildManifest[key] || !buildManifest[`${key}?raw`]) fail(`${file} 未进入构建清单的组件/raw 模块`)
  }
}
const builtSitemapPath = resolve(root, 'dist/sitemap.xml')
if (existsSync(builtSitemapPath)) {
  const builtSitemap = read('dist/sitemap.xml')
  for (const path of ['/lab', ...expectedIds.map(id => `/lab/${id}`)]) {
    if (!builtSitemap.includes(`${path}</loc>`)) fail(`正式 Sitemap 缺少 ${path}`)
  }
}

if (failures.length > 0) {
  console.error(failures.map(message => `- ${message}`).join('\n'))
  process.exitCode = 1
} else {
  console.log(`Lab 校验通过：${expectedIds.length} 个冻结条目${phaseOneOnly ? '（Phase 1）' : ''}`)
}
