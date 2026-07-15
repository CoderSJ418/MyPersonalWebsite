/**
 * Projection Layer — 纯函数，Source → Contract
 *
 * 约束：
 * - 只做结构转换，不含UI逻辑/样式逻辑/展示决策
 * - 不修改ProjectDetail schema
 * - 返回Contract类型（RecruitView / ReaderView）
 */

import type { ProjectDetail } from '@/types/project'
import type { NarrativeView, ProjectCaseView, ReaderView, RecruitView } from '@/types/view-contract'

/** 格式化技术栈标签 — 数据转换在selector层完成 */
function formatTechLabel(tech: { name: string; version: string }): string {
  return tech.version ? `${tech.name} ${tech.version}` : tech.name
}

/**
 * 招聘导向投影
 * narrative不存在时返回null → 调用方回退到传统展示
 */
export function getRecruitView(project: ProjectDetail): RecruitView | null {
  if (!project.narrative) return null

  return {
    ...toCaseView(project),
    title: project.title,
    description: project.description,
    techStack: project.techStack.map((t) => ({
      name: t.name,
      version: t.version,
      displayLabel: formatTechLabel(t)
    })),
    demoUrl: project.demoUrl,
    githubUrl: project.githubUrl,
    narrative: toNarrativeView(project.narrative)
  }
}

/**
 * 完整阅读投影
 * 始终返回，narrative为可选
 */
export function getReaderView(project: ProjectDetail): ReaderView {
  return {
    ...toCaseView(project),
    title: project.title,
    description: project.description,
    techStack: project.techStack.map((t) => ({
      name: t.name,
      version: t.version,
      displayLabel: formatTechLabel(t)
    })),
    demoUrl: project.demoUrl,
    githubUrl: project.githubUrl,
    narrative: project.narrative ? toNarrativeView(project.narrative) : undefined,
    background: project.background,
    goals: project.goals,
    features: project.features,
    techHighlights: {
      architecture: project.techHighlights.architecture,
      keyImplementations: project.techHighlights.keyImplementations,
      performanceOptimizations: project.techHighlights.performanceOptimizations,
      solution: project.techHighlights.solution
    },
    results: {
      performance: project.results.performance,
      business: project.results.business,
      feedback: project.results.feedback,
      highlights: project.results.highlights
    },
    screenshots: project.screenshots
  }
}

/** 内部转换：职责字段保持可选，旧项目无需迁移 */
function toCaseView(project: ProjectDetail): ProjectCaseView {
  return {
    role: project.role,
    teamContext: project.teamContext,
    platforms: project.platforms,
    responsibilities: project.responsibilities,
    teamResults: project.teamResults,
    constraints: project.constraints
  }
}

/** 内部转换：ProjectNarrative → NarrativeView */
function toNarrativeView(narrative: NonNullable<ProjectDetail['narrative']>): NarrativeView {
  return {
    challenge: narrative.challenge,
    approach: narrative.approach,
    impact: narrative.impact,
    metrics: narrative.metrics
  }
}
