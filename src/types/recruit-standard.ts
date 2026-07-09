/**
 * Recruit Decision Engine v2.0 — 项目接入标准
 *
 * 约束：
 * - 所有新项目必须通过 RecruitStandard 校验才能接入
 * - 校验基于已冻结的 Recruit Mode IA 五层架构
 * - 不修改现有 IA 结构、布局、视觉系统
 *
 * IA 五层映射：
 *   Layer 1 Identity  → title（非空）
 *   Layer 2 Evidence  → narrative.metrics（≥2项量化指标）
 *   Layer 3 Outcome   → narrative.impact（结果导向表达）
 *   Layer 4 Context   → description（背景说明，不参与决策）
 *   Layer 5 Validation→ techStack（非空，支撑结果）
 */

/** 量化指标 — value 必须包含数字 */
export interface QuantifiedMetric {
  label: string
  value: string
}

/** 项目接入标准模板 — 新项目必须满足的最小信息集 */
export interface RecruitStandard {
  /** Layer 1: Identity — 真实项目名称 */
  title: string
  /** Layer 2: Evidence — 至少2项量化指标 */
  metrics: QuantifiedMetric[]
  /** Layer 3: Outcome — 结果导向表达，必须包含可验证数据 */
  impact: string
  /** Layer 4: Context — 项目背景说明 */
  description: string
  /** Layer 5: Validation — 真实技术栈，支撑结果 */
  techStack: Array<{ name: string; version: string }>
  /** 叙事完整字段（challenge + approach 供 Reader Mode 使用） */
  challenge: string
  approach: string
}

/** 校验结果 */
export interface ValidationResult {
  /** 是否通过接入标准 */
  valid: boolean
  /** 校验错误列表 */
  errors: string[]
  /** 警告列表（不阻止接入，但建议修正） */
  warnings: string[]
}

/** 项目接入报告 */
export interface ProjectOnboardingReport {
  /** 项目名称 */
  title: string
  /** 校验结果 */
  validation: ValidationResult
  /** 接入时间 ISO */
  timestamp: string
  /** 系统集成状态 */
  systemStatus: {
    totalProjects: number
    recruitModeStable: boolean
    decisionModelIntact: boolean
  }
}

/**
 * 量化检测 — value 中必须包含至少一个数字
 * 合法：1.5s, 96, +35%, 20万+, 1.2MB, 3个项目
 * 非法：优化, 提升, 改善
 */
const DIGIT_PATTERN = /\d/

/**
 * 结果导向检测 — impact 中必须包含数字或量化表达
 * 合法：首屏从3.5s降至1.5s, 询盘量增长35%, 月GMV 20万+
 * 非法：效率明显提升, 用户体验改善
 */
const RESULT_PATTERN = /\d|%|倍|万/

/** 禁止的模糊描述关键词 */
const VAGUE_PATTERNS = [
  /优化体验/,
  /提升效率/,
  /改善体验/,
  /明显提升/,
  /显著改善/,
  /大幅提高/,
]

/** 校验规则定义 */
export interface ValidationRule {
  id: string
  layer: string
  check: (standard: RecruitStandard) => string | null
}

/** 默认校验规则集 — 基于 Recruit Mode IA 五层架构 */
export const RECRUIT_VALIDATION_RULES: ValidationRule[] = [
  {
    id: 'R-ID-001',
    layer: 'Identity',
    check: (s) => !s.title.trim() ? 'Title 不能为空' : null,
  },
  {
    id: 'R-EV-001',
    layer: 'Evidence',
    check: (s) => s.metrics.length < 2 ? 'Metrics 至少需要 2 项量化指标' : null,
  },
  {
    id: 'R-EV-002',
    layer: 'Evidence',
    check: (s) => {
      const nonQuantified = s.metrics
        .map((m, i) => ({ idx: i, metric: m }))
        .filter(({ metric }) => !DIGIT_PATTERN.test(metric.value))
      if (nonQuantified.length === 0) return null
      return `Metrics[${nonQuantified.map(({ idx }) => idx).join(', ')}] 的 value 缺少量化数据`
    },
  },
  {
    id: 'R-EV-003',
    layer: 'Evidence',
    check: (s) => {
      const emptyLabels = s.metrics
        .map((m, i) => ({ idx: i, metric: m }))
        .filter(({ metric }) => !metric.label.trim())
      if (emptyLabels.length === 0) return null
      return `Metrics[${emptyLabels.map(({ idx }) => idx).join(', ')}] 的 label 不能为空`
    },
  },
  {
    id: 'R-OC-001',
    layer: 'Outcome',
    check: (s) => !s.impact.trim() ? 'Impact 不能为空' : null,
  },
  {
    id: 'R-OC-002',
    layer: 'Outcome',
    check: (s) => {
      if (RESULT_PATTERN.test(s.impact)) return null
      return 'Impact 必须包含可验证的量化结果（数字/%/倍/万）'
    },
  },
  {
    id: 'R-OC-003',
    layer: 'Outcome',
    check: (s) => {
      const matched = VAGUE_PATTERNS.find(p => p.test(s.impact))
      if (!matched) return null
      return `Impact 包含模糊描述"${matched.source}"，请替换为量化表达`
    },
  },
  {
    id: 'R-CT-001',
    layer: 'Context',
    check: (s) => !s.description.trim() ? 'Description 不能为空' : null,
  },
  {
    id: 'R-VA-001',
    layer: 'Validation',
    check: (s) => s.techStack.length === 0 ? 'Tech Stack 不能为空' : null,
  },
  {
    id: 'R-NA-001',
    layer: 'Narrative',
    check: (s) => !s.challenge.trim() ? 'Challenge 不能为空（Reader Mode 需要）' : null,
  },
  {
    id: 'R-NA-002',
    layer: 'Narrative',
    check: (s) => !s.approach.trim() ? 'Approach 不能为空（Reader Mode 需要）' : null,
  },
]