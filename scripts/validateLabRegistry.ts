import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Phase 1 模式：只校验格式
const PHASE1_MODE = process.argv.includes('--phase1')

interface LabEffect {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  component: () => Promise<{ default: unknown }>
  code: string
  language: string
  params?: { key: string; type: string; defaultValue: string | number }[]
}

function _validateRegistry(registry: LabEffect[]): string[] {
  const errors: string[] = []

  registry.forEach((effect, index) => {
    const prefix = `[${index}] ${effect.id || 'unnamed'}`

    // id 格式
    if (!effect.id || !/^[a-z]+(-[a-z]+)*$/.test(effect.id)) {
      errors.push(`${prefix}: id 必须是小写字母+连字符`)
    }

    // description 长度
    if (!effect.description || effect.description.length > 100) {
      errors.push(`${prefix}: description 必须 ≤ 100 字符（当前 ${effect.description?.length || 0}）`)
    }

    // language
    const validLanguages = ['vue', 'css', 'html']
    if (!validLanguages.includes(effect.language)) {
      errors.push(`${prefix}: language 必须是 vue/css/html 之一`)
    }

    // params key 唯一性
    if (effect.params) {
      const keys = effect.params.map(p => p.key)
      const uniqueKeys = new Set(keys)
      if (keys.length !== uniqueKeys.size) {
        errors.push(`${prefix}: params key 有重复`)
      }
    }

    // Phase 2+ 校验：文件存在
    if (!PHASE1_MODE) {
      const demoPath = path.join(__dirname, '..', 'src', 'views', 'Lab', 'demos', `${effect.id}Demo.vue`)
      if (!fs.existsSync(demoPath)) {
        errors.push(`${prefix}: 对应的 demo 文件不存在 — ${demoPath}`)
      }
    }
  })

  return errors
}

// 动态导入注册表（通过构建时注入或直接读取源码）
const registryPath = path.join(__dirname, '..', 'src', 'config', 'labRegistry.ts')
const registryContent = fs.readFileSync(registryPath, 'utf-8')

// 简单校验：检查文件包含必要字段
const errors: string[] = []
const hasInterface = registryContent.includes('export interface LabEffect')
const hasRegistry = registryContent.includes('export const labRegistry')
const hasIds = (registryContent.match(/id: '/g) || []).length

if (!hasInterface) errors.push('缺少 LabEffect 接口定义')
if (!hasRegistry) errors.push('缺少 labRegistry 导出')
if (hasIds < 12) errors.push(`注册表 entry 数量不足：期望 12，实际 ${hasIds}`)

// 检查旧 accent 色值（Lab 中不应出现）
const legacyColors = ['#7B4EED', '#F03880', '#0052FF']
const labFiles = ['src/views/Lab/', 'src/components/lab/', 'src/config/labRegistry.ts']
labFiles.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir)
  if (fs.existsSync(fullPath)) {
    const stat = fs.statSync(fullPath)
    if (stat.isFile()) {
      const content = fs.readFileSync(fullPath, 'utf-8')
      legacyColors.forEach(color => {
        if (content.includes(color)) {
          errors.push(`${dir}: 包含已废弃的 accent 色 ${color}`)
        }
      })
    } else if (stat.isDirectory()) {
      const files = fs.readdirSync(fullPath, { recursive: true }) as string[]
      files.forEach(file => {
        const filePath = path.join(fullPath, file)
        if (fs.statSync(filePath).isFile()) {
          const content = fs.readFileSync(filePath, 'utf-8')
          legacyColors.forEach(color => {
            if (content.includes(color)) {
              errors.push(`${dir}${file}: 包含已废弃的 accent 色 ${color}`)
            }
          })
        }
      })
    }
  }
})

// 检查是否创建了 LabCodeBlock.vue（禁止）
const codeblockPath = path.join(__dirname, '..', 'src', 'components', 'lab', 'LabCodeBlock.vue')
if (fs.existsSync(codeblockPath)) {
  errors.push('发现 LabCodeBlock.vue — 应复用 CodeBlock.vue，此文件必须删除')
}

if (errors.length > 0) {
  console.error('❌ 注册表校验失败：')
  errors.forEach(e => console.error(`  - ${e}`))
  process.exit(1)
} else {
  console.log('✅ 注册表校验通过')
  process.exit(0)
}
