/**
 * Recruit Decision Engine v2.0 — System Lock Manifest
 *
 * 本文件声明系统锁定状态，所有标记为 LOCKED 的结构不可被后续自动修改。
 * 修改锁定项必须通过 Recruit Standard 校验流程。
 *
 * LOCKED SINCE: 2026-07-01
 * MODE: PRODUCTION
 */

// ─── IA 结构锁定 ──────────────────────────────────────

/** Recruit Mode 五层 IA — LOCKED */
export const RECRUIT_IA_LAYERS = [
  { layer: 'Identity', element: 'h1.pn__title', locked: true },
  { layer: 'Evidence', element: 'div.pn__metrics', locked: true },
  { layer: 'Outcome', element: 'div.pn__story (Impact only)', locked: true },
  { layer: 'Context', element: 'p.pn__desc', locked: true },
  { layer: 'Validation', element: 'div.pn__tech + closure line', locked: true },
] as const

/** Recruit Mode CSS 视觉权重 — LOCKED */
export const RECRUIT_CSS_LOCKS = [
  { rule: '.pn--recruit .pn__story-item:nth-child(-n+2)', behavior: 'display:none', locked: true },
  { rule: '.pn--recruit .pn__metric-label', behavior: '0.6875rem/tertiary', locked: true },
  { rule: '.pn--recruit .pn__desc', behavior: '0.8125rem/opacity:0.75', locked: true },
  { rule: '.pn--recruit .pn__tech', behavior: 'max-height:2rem/overflow:hidden', locked: true },
  { rule: '.pn--recruit::after', behavior: '1px solid line', locked: true },
] as const

// ─── 数据规范锁定 ──────────────────────────────────────

/** Metrics 规范 — LOCKED */
export const METRICS_STANDARD = {
  minCount: 2,
  maxCount: 4,
  valueMustContainDigit: true,
  labelMustBeNonEmpty: true,
  locked: true,
} as const

/** Impact 规范 — LOCKED */
export const IMPACT_STANDARD = {
  mustContainQuantifiedResult: true,
  maxCharacterCount: 60,
  forbiddenPatterns: ['优化体验', '提升效率', '改善体验', '明显提升', '显著改善', '大幅提高'],
  locked: true,
} as const

/** Tech Stack 规范 — LOCKED */
export const TECHSTACK_STANDARD = {
  mustBeNonEmpty: true,
  mustSupportResults: true,
  locked: true,
} as const

// ─── 校验规则锁定 ──────────────────────────────────────

/** 校验规则版本 — LOCKED */
export const VALIDATION_VERSION = '2.0.0-locked' as const

/** 校验规则数量 — LOCKED */
export const VALIDATION_RULE_COUNT = 11 as const

// ─── 系统状态 ──────────────────────────────────────────

export const SYSTEM_STATE = {
  mode: 'PRODUCTION' as const,
  iaState: 'LOCKED' as const,
  dataState: 'VALIDATED' as const,
  extensionState: 'CONTROLLED' as const,
  lockedSince: '2026-07-01',
  engineVersion: '2.0.0',
} as const

// ─── 防误修改检测 ──────────────────────────────────────

/**
 * 检测 IA 结构是否被意外修改
 * 用于构建时 hook 和运行时自检
 */
export function getIaFingerprint(): string {
  const layers = RECRUIT_IA_LAYERS.map((l) => `${l.layer}:${l.element}`).join('|')
  const css = RECRUIT_CSS_LOCKS.map((c) => `${c.rule}:${c.behavior}`).join('|')
  return `IA:${layers}|CSS:${css}|V:${VALIDATION_VERSION}`
}