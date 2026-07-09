/**
 * Recruit Decision Engine v2.0 — Build Guard
 *
 * 构建时校验 hook，确保 projects.json 数据完整性。
 * 校验不通过则阻断构建，防止非标准数据进入生产环境。
 *
 * 用法：node scripts/recruit-guard.mjs
 * 退出码：0=通过 1=阻断
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectsPath = join(__dirname, '../src/assets/data/projects.json')

// ─── 校验规则（与 recruit-standard.ts 对齐） ──────────

const DIGIT_PATTERN = /\d/
const RESULT_PATTERN = /\d|%|倍|万/
const VAGUE_PATTERNS = [/优化体验/, /提升效率/, /改善体验/, /明显提升/, /显著改善/, /大幅提高/]

const RULES = [
  { id: 'R-ID-001', layer: 'Identity', check: (p) => !p.title?.trim() ? 'Title 不能为空' : null },
  { id: 'R-EV-001', layer: 'Evidence', check: (p) => !p.narrative?.metrics || p.narrative.metrics.length < 2 ? 'Metrics 至少需要 2 项量化指标' : null },
  {
    id: 'R-EV-002', layer: 'Evidence', check: (p) => {
      if (!p.narrative?.metrics) return null
      const bad = p.narrative.metrics.map((m, i) => ({ i, m })).filter(({ m }) => !DIGIT_PATTERN.test(m.value))
      return bad.length ? `Metrics[${bad.map(({ i }) => i).join(',')}] value 缺少量化数据` : null
    }
  },
  {
    id: 'R-EV-003', layer: 'Evidence', check: (p) => {
      if (!p.narrative?.metrics) return null
      const bad = p.narrative.metrics.map((m, i) => ({ i, m })).filter(({ m }) => !m.label?.trim())
      return bad.length ? `Metrics[${bad.map(({ i }) => i).join(',')}] label 不能为空` : null
    }
  },
  { id: 'R-OC-001', layer: 'Outcome', check: (p) => !p.narrative?.impact?.trim() ? 'Impact 不能为空' : null },
  { id: 'R-OC-002', layer: 'Outcome', check: (p) => p.narrative?.impact && !RESULT_PATTERN.test(p.narrative.impact) ? 'Impact 必须包含可验证的量化结果' : null },
  {
    id: 'R-OC-003', layer: 'Outcome', check: (p) => {
      if (!p.narrative?.impact) return null
      const v = VAGUE_PATTERNS.find(r => r.test(p.narrative.impact))
      return v ? `Impact 包含模糊描述"${v.source}"` : null
    }
  },
  { id: 'R-CT-001', layer: 'Context', check: (p) => !p.description?.trim() ? 'Description 不能为空' : null },
  { id: 'R-VA-001', layer: 'Validation', check: (p) => !p.techStack?.length ? 'Tech Stack 不能为空' : null },
  { id: 'R-NA-001', layer: 'Narrative', check: (p) => !p.narrative?.challenge?.trim() ? 'Challenge 不能为空' : null },
  { id: 'R-NA-002', layer: 'Narrative', check: (p) => !p.narrative?.approach?.trim() ? 'Approach 不能为空' : null },
]

// ─── 执行校验 ──────────────────────────────────────────

function validateProject(project) {
  const errors = []
  const warnings = []

  for (const rule of RULES) {
    const result = rule.check(project)
    if (result) {
      if (rule.layer === 'Narrative') {
        warnings.push(`[${rule.id}] ${result}`)
      } else {
        errors.push(`[${rule.id}] ${result}`)
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings }
}

// ─── Main ──────────────────────────────────────────────

console.log('🔒 Recruit Decision Engine — Build Guard')
console.log('─'.repeat(50))

let projects
try {
  projects = JSON.parse(readFileSync(projectsPath, 'utf-8'))
} catch (e) {
  console.error('❌ FATAL: projects.json 解析失败')
  console.error(e.message)
  process.exit(1)
}

let allValid = true
let totalErrors = 0
let totalWarnings = 0

projects.forEach((p, i) => {
  const result = validateProject(p)
  if (!result.valid) {
    allValid = false
    totalErrors += result.errors.length
    console.log(`❌ P${i + 1}: ${p.title}`)
    result.errors.forEach(e => console.log(`   ERROR: ${e}`))
  }
  if (result.warnings.length) {
    totalWarnings += result.warnings.length
    console.log(`⚠️  P${i + 1}: ${p.title}`)
    result.warnings.forEach(w => console.log(`   WARN: ${w}`))
  }
  if (result.valid && result.warnings.length === 0) {
    console.log(`✅ P${i + 1}: ${p.title}`)
  }
})

console.log('─'.repeat(50))
console.log(`Projects: ${projects.length} | Errors: ${totalErrors} | Warnings: ${totalWarnings}`)

if (allValid) {
  console.log('✅ BUILD GUARD PASSED — 所有项目通过 Recruit Standard 校验')
  process.exit(0)
} else {
  console.log('🚫 BUILD GUARD FAILED — 存在不合规数据，构建已阻断')
  console.log('   请修复上述 ERROR 后重新构建')
  process.exit(1)
}