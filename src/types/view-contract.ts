/**
 * View Contract Layer — UI唯一依赖的类型
 *
 * 稳定性原则：字段来自业务语义，不来自UI布局
 * 扩展性原则：Contract不变，selector适配不同source（Blog/CaseStudy）
 */

/** 叙事视图（Contract内嵌，不依赖源类型） */
export interface NarrativeView {
  challenge: string
  approach: string
  impact: string
  metrics?: Array<{ label: string; value: string }>
}

/** 招聘导向展示契约 — 90秒决策最小信息集 */
export interface RecruitView {
  title: string
  description: string
  techStack: Array<{ name: string; version: string; displayLabel: string }>
  demoUrl?: string
  githubUrl?: string
  narrative: NarrativeView
}

/** 完整阅读展示契约 — 技术深度阅读 */
export interface ReaderView {
  title: string
  description: string
  techStack: Array<{ name: string; version: string; displayLabel: string }>
  demoUrl?: string
  githubUrl?: string
  narrative?: NarrativeView
  background: string
  goals: string[]
  features: string[]
  techHighlights: {
    architecture?: string
    keyImplementations?: string[]
    performanceOptimizations?: string[]
    solution?: string
  }
  results: {
    performance?: string
    business?: string
    feedback?: string
    highlights?: string[]
  }
  screenshots: string[]
}

/** density参数类型 — 控制Narrative渲染密度 */
export type NarrativeDensity = 'recruit' | 'reader'

/** viewMode状态类型 */
export type ViewMode = 'recruit' | 'reader'