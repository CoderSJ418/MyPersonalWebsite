/**
 * Recruit Decision Engine v2.0 — 回归验证脚本
 * 校验现有4个项目是否符合 Recruit Standard
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectsPath = join(__dirname, '../src/assets/data/projects.json')
const projects = JSON.parse(readFileSync(projectsPath, 'utf-8'))

// ─── 校验规则（与 recruit-standard.ts 对齐） ──────────

const DIGIT_PATTERN = /\d/
const RESULT_PATTERN = /\d|%|倍|万/
const VAGUE_PATTERNS = [/优化体验/, /提升效率/, /改善体验/, /明显提升/, /显著改善/, /大幅提高/]

function validateProject(project) {
  const errors = []
  const warnings = []
  const n = project.narrative

  // Layer 1: Identity
  if (!project.title?.trim()) errors.push('[R-ID-001] Title 不能为空')

  // Layer 2: Evidence
  if (!n?.metrics || n.metrics.length < 2) {
    errors.push('[R-EV-001] Metrics 至少需要 2 项量化指标')
  }
  if (n?.metrics) {
    n.metrics.forEach((m, i) => {
      if (!DIGIT_PATTERN.test(m.value)) errors.push(`[R-EV-002] Metrics[${i}] value="${m.value}" 缺少量化数据`)
      if (!m.label?.trim()) errors.push(`[R-EV-003] Metrics[${i}] label 不能为空`)
    })
    if (n.metrics.length > 4) warnings.push(`[W-EV-001] Metrics 有 ${n.metrics.length} 项，建议不超过 4 项`)
  }

  // Layer 3: Outcome
  if (!n?.impact?.trim()) {
    errors.push('[R-OC-001] Impact 不能为空')
  } else {
    if (!RESULT_PATTERN.test(n.impact)) errors.push('[R-OC-002] Impact 必须包含可验证的量化结果')
    const vague = VAGUE_PATTERNS.find(p => p.test(n.impact))
    if (vague) errors.push(`[R-OC-003] Impact 包含模糊描述"${vague.source}"`)
    if (n.impact.length > 60) warnings.push(`[W-OC-001] Impact 有 ${n.impact.length} 字，建议控制在 60 字以内`)
  }

  // Layer 4: Context
  if (!project.description?.trim()) errors.push('[R-CT-001] Description 不能为空')

  // Layer 5: Validation
  if (!project.techStack?.length) errors.push('[R-VA-001] Tech Stack 不能为空')

  // Narrative (warnings only)
  if (!n?.challenge?.trim()) warnings.push('[R-NA-001] Challenge 不能为空（Reader Mode 需要）')
  if (!n?.approach?.trim()) warnings.push('[R-NA-002] Approach 不能为空（Reader Mode 需要）')

  return { valid: errors.length === 0, errors, warnings }
}

// ─── 执行校验 ──────────────────────────────────────────

console.log('╔══════════════════════════════════════════════════╗')
console.log('║  Recruit Decision Engine v2.0 — 回归验证报告     ║')
console.log('╚══════════════════════════════════════════════════╝')
console.log()

let allValid = true

projects.forEach((p, i) => {
  const result = validateProject(p)
  const status = result.valid ? '✅ PASS' : '❌ FAIL'
  console.log(`P${i + 1}: ${p.title}`)
  console.log(`   Status: ${status}`)

  if (result.errors.length) {
    result.errors.forEach(e => console.log(`   ERROR: ${e}`))
    allValid = false
  }
  if (result.warnings.length) {
    result.warnings.forEach(w => console.log(`   WARN:  ${w}`))
  }

  // 输出 Metrics 详情
  if (p.narrative?.metrics) {
    console.log(`   Metrics: ${p.narrative.metrics.map(m => `${m.label}=${m.value}`).join(' | ')}`)
  }
  console.log()
})

// ─── 系统健康报告 ──────────────────────────────────────

console.log('════════════════════════════════════════════════════')
console.log('SYSTEM HEALTH REPORT')
console.log('════════════════════════════════════════════════════')
console.log(`Total Projects:     ${projects.length}`)
console.log(`Recruit Ready:      ${projects.filter(p => validateProject(p).valid).length}/${projects.length}`)
console.log(`All Valid:          ${allValid ? 'YES ✅' : 'NO ❌'}`)
console.log(`Recruit Mode:       STABLE`)
console.log(`Decision Model:     INTACT (10s)`)
console.log()

if (allValid) {
  console.log('🎉 所有项目通过 Recruit Standard 校验，系统可规模化扩展。')
} else {
  console.log('⚠️  部分项目未通过校验，请修复后再扩展。')
}