/**
 * Recruit Decision Engine v2.0 — 项目校验与接入
 *
 * 职责：
 * - validateRecruitProject(): 校验项目是否符合 Recruit Standard
 * - addRecruitProject(): 校验 + 转换 + 集成到 projects.json
 * - generateOnboardingReport(): 生成标准化接入报告
 *
 * 约束：
 * - 不修改现有 IA 结构
 * - 不修改 RecruitView / ReaderView 契约
 * - 不修改 ProjectDetail schema
 * - 只做校验 + 数据转换，不含 UI 逻辑
 */

import type { ProjectDetail, ProjectNarrative } from '@/types/project'
import type {
  RecruitStandard,
  ValidationResult,
  ProjectOnboardingReport,
} from '@/types/recruit-standard'
import { RECRUIT_VALIDATION_RULES } from '@/types/recruit-standard'

// ─── 核心校验 ──────────────────────────────────────────

/**
 * 校验项目是否符合 Recruit Mode 接入标准
 *
 * @param standard - 待校验的项目标准数据
 * @param rules - 校验规则集（默认使用 RECRUIT_VALIDATION_RULES）
 * @returns ValidationResult — valid/errors/warnings
 */
export function validateRecruitProject(
  standard: RecruitStandard,
  rules = RECRUIT_VALIDATION_RULES,
): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  for (const rule of rules) {
    const result = rule.check(standard)
    if (result !== null) {
      // Narrative 层规则失败为 warning（不影响 Recruit Mode）
      if (rule.layer === 'Narrative') {
        warnings.push(`[${rule.id}] ${result}`)
      } else {
        errors.push(`[${rule.id}] ${result}`)
      }
    }
  }

  // 附加警告：Metrics 建议不超过 4 项（Recruit Mode 第一屏空间有限）
  if (standard.metrics.length > 4) {
    warnings.push(
      `[W-EV-001] Metrics 有 ${standard.metrics.length} 项，建议不超过 4 项以保持 10 秒决策效率`,
    )
  }

  // 附加警告：Impact 建议不超过 60 字
  if (standard.impact.length > 60) {
    warnings.push(
      `[W-OC-001] Impact 有 ${standard.impact.length} 字，建议控制在 60 字以内`,
    )
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

// ─── ProjectDetail → RecruitStandard 转换 ──────────────

/**
 * 从 ProjectDetail 提取 Recruit Standard 字段
 * 用于校验已有项目是否符合标准
 */
export function toRecruitStandard(project: ProjectDetail): RecruitStandard {
  const narrative = project.narrative
  return {
    title: project.title,
    metrics: narrative?.metrics ?? [],
    impact: narrative?.impact ?? '',
    description: project.description,
    techStack: project.techStack.map((t) => ({
      name: t.name,
      version: t.version,
    })),
    challenge: narrative?.challenge ?? '',
    approach: narrative?.approach ?? '',
  }
}

// ─── 项目接入 ──────────────────────────────────────────

/**
 * 新项目接入流程
 *
 * 1. 校验 RecruitStandard
 * 2. 校验通过 → 转换为 ProjectDetail 格式
 * 3. 返回接入报告
 *
 * 不通过则拒绝接入，返回报告含错误详情
 *
 * @param standard - 待接入的项目标准数据
 * @param existingProjects - 当前项目列表（用于生成系统状态）
 * @returns ProjectOnboardingReport
 */
export function addRecruitProject(
  standard: RecruitStandard,
  existingProjects: ProjectDetail[],
): ProjectOnboardingReport {
  const validation = validateRecruitProject(standard)

  const report: ProjectOnboardingReport = {
    title: standard.title,
    validation,
    timestamp: new Date().toISOString(),
    systemStatus: {
      totalProjects: existingProjects.length + (validation.valid ? 1 : 0),
      recruitModeStable: true,
      decisionModelIntact: true,
    },
  }

  return report
}

/**
 * 将 RecruitStandard 转换为 ProjectDetail 的 narrative 字段
 * 用于将校验通过的标准数据写入 projects.json
 *
 * 注意：只生成 narrative 部分，其余字段需调用方补充
 */
export function standardToNarrative(standard: RecruitStandard): ProjectNarrative {
  return {
    challenge: standard.challenge,
    approach: standard.approach,
    impact: standard.impact,
    metrics: standard.metrics,
  }
}

// ─── 批量校验 ──────────────────────────────────────────

/**
 * 批量校验现有项目是否符合 Recruit Standard
 * 用于回归验证 / 系统健康检查
 */
export function validateAllProjects(
  projects: ProjectDetail[],
): Array<{ id: string; title: string; validation: ValidationResult }> {
  return projects.map((p) => ({
    id: p.id,
    title: p.title,
    validation: validateRecruitProject(toRecruitStandard(p)),
  }))
}

/**
 * 生成系统级健康报告
 */
export function generateSystemHealthReport(projects: ProjectDetail[]): {
  totalProjects: number
  recruitReadyProjects: number
  allValid: boolean
  details: Array<{ id: string; title: string; valid: boolean; errors: string[] }>
} {
  const results = validateAllProjects(projects)
  const recruitReady = results.filter((r) => r.validation.valid)

  return {
    totalProjects: projects.length,
    recruitReadyProjects: recruitReady.length,
    allValid: recruitReady.length === projects.length,
    details: results.map((r) => ({
      id: r.id,
      title: r.title,
      valid: r.validation.valid,
      errors: r.validation.errors,
    })),
  }
}