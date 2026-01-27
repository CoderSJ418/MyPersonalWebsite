/**
 * UI 风格定义
 * @description 现代顶级设计风格的 UI 风格，参考 Linear、Vercel、Stripe、Apple 等顶级设计语言
 */

import type { ComponentStyle, ComponentStyleCollection } from './types'

/**
 * 1. Linear Glass - Linear 风格玻璃拟态
 * 参考 Linear 的标志性玻璃拟态，渐变背景 + 模糊效果 + 微妙光泽
 */
export const linearGlassStyle: ComponentStyle = {
  id: 'linear-glass',
  name: 'Linear Glass',
  description: 'Linear 风格玻璃拟态，现代科技感',
  card: {
    background: 'linear-gradient(135deg, rgba(94, 106, 210, 0.1), rgba(139, 92, 246, 0.05))',
    backdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '16px',
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `
  },
  button: {
    background: 'linear-gradient(135deg, rgba(94, 106, 210, 0.8), rgba(139, 92, 246, 0.8))',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    boxShadow: `
      0 4px 16px rgba(94, 106, 210, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `
  },
  input: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    focusBorderColor: 'rgba(94, 106, 210, 0.8)'
  },
  panel: {
    background: 'linear-gradient(135deg, rgba(94, 106, 210, 0.15), rgba(139, 92, 246, 0.08))',
    backdropFilter: 'blur(24px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    borderRadius: '20px',
    boxShadow: `
      0 12px 48px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.15)
    `
  },
  navbar: {
    background: 'rgba(10, 10, 11, 0.8)',
    backdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
  }
}

/**
 * 2. Apple Bento - Apple 风格 Bento Grid
 * 参考 Apple 的 Bento Grid 设计，简洁、精致、有层次
 */
export const appleBentoStyle: ComponentStyle = {
  id: 'apple-bento',
  name: 'Apple Bento',
  description: 'Apple 风格 Bento Grid，简洁精致',
  card: {
    background: 'var(--bg-card)',
    borderRadius: '20px',
    boxShadow: `
      0 2px 8px rgba(0, 0, 0, 0.04),
      0 1px 2px rgba(0, 0, 0, 0.02)
    `,
    border: '1px solid rgba(0, 0, 0, 0.04)'
  },
  button: {
    background: 'var(--primary-color)',
    borderRadius: '12px',
    fontWeight: '600',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  input: {
    background: 'var(--bg-surface)',
    border: '1px solid rgba(0, 0, 0, 0.08)',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
    focusBorderColor: 'var(--primary-color)',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  panel: {
    background: 'var(--bg-surface)',
    borderRadius: '24px',
    boxShadow: `
      0 4px 16px rgba(0, 0, 0, 0.06),
      0 2px 4px rgba(0, 0, 0, 0.04)
    `,
    border: '1px solid rgba(0, 0, 0, 0.06)'
  },
  navbar: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px) saturate(180%)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
    border: '1px solid rgba(0, 0, 0, 0.04)'
  }
}

/**
 * 3. Vercel Minimal - Vercel 风格极简主义
 * 参考 Vercel 的极简黑白设计，专业、高端、极致简洁
 */
export const vercelMinimalStyle: ComponentStyle = {
  id: 'vercel-minimal',
  name: 'Vercel Minimal',
  description: 'Vercel 风格极简主义，专业高端',
  card: {
    background: 'var(--bg-card)',
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(0, 0, 0, 0.06)'
  },
  button: {
    background: '#000000',
    color: '#FFFFFF',
    borderRadius: '6px',
    fontWeight: '500',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.15s ease'
  },
  input: {
    background: 'var(--bg-surface)',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '6px',
    boxShadow: 'none',
    focusBorderColor: '#000000',
    transition: 'all 0.15s ease'
  },
  panel: {
    background: 'var(--bg-surface)',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    border: '1px solid rgba(0, 0, 0, 0.06)'
  },
  navbar: {
    background: '#FFFFFF',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
    border: '1px solid rgba(0, 0, 0, 0.06)'
  }
}

/**
 * 4. Stripe Gradient - Stripe 风格优雅渐变
 * 参考 Stripe 的优雅渐变，精致、优雅、高级
 */
export const stripeGradientStyle: ComponentStyle = {
  id: 'stripe-gradient',
  name: 'Stripe Gradient',
  description: 'Stripe 风格优雅渐变，精致高级',
  card: {
    background: 'linear-gradient(135deg, rgba(99, 91, 255, 0.03), rgba(0, 212, 255, 0.03))',
    borderRadius: '16px',
    boxShadow: `
      0 4px 16px rgba(99, 91, 255, 0.08),
      0 2px 8px rgba(0, 0, 0, 0.04)
    `,
    border: '1px solid rgba(99, 91, 255, 0.1)'
  },
  button: {
    background: 'linear-gradient(135deg, #635BFF, #00D4FF)',
    borderRadius: '10px',
    fontWeight: '600',
    boxShadow: `
      0 4px 12px rgba(99, 91, 255, 0.25),
      0 2px 4px rgba(0, 0, 0, 0.08)
    `,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  input: {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9))',
    border: '1px solid rgba(99, 91, 255, 0.15)',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(99, 91, 255, 0.06)',
    focusBorderColor: '#635BFF',
    transition: 'all 0.2s ease'
  },
  panel: {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(247, 249, 252, 0.95))',
    borderRadius: '20px',
    boxShadow: `
      0 8px 24px rgba(99, 91, 255, 0.1),
      0 4px 12px rgba(0, 0, 0, 0.06)
    `,
    border: '1px solid rgba(99, 91, 255, 0.12)'
  },
  navbar: {
    background: 'rgba(247, 249, 252, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 2px 8px rgba(99, 91, 255, 0.08)',
    border: '1px solid rgba(99, 91, 255, 0.1)'
  }
}

/**
 * UI 风格集合
 * 精选顶级设计风格的 UI 风格
 */
export const componentStyles: ComponentStyleCollection = {
  'linear-glass': linearGlassStyle,
  'apple-bento': appleBentoStyle,
  'vercel-minimal': vercelMinimalStyle,
  'stripe-gradient': stripeGradientStyle
}

/**
 * UI 风格列表
 */
export const componentStyleList = Object.values(componentStyles)

/**
 * 获取 UI 风格
 * @param id UI 风格 ID
 * @returns ComponentStyle | undefined
 */
export function getComponentStyle(id: string): ComponentStyle | undefined {
  return componentStyles[id]
}

/**
 * 获取默认 UI 风格
 * @returns ComponentStyle
 */
export function getDefaultComponentStyle(): ComponentStyle {
  return linearGlassStyle
}

/**
 * 获取所有 UI 风格 ID
 * @returns string[]
 */
export function getComponentStyleIds(): string[] {
  return Object.keys(componentStyles)
}

/**
 * 检查 UI 风格是否存在
 * @param id UI 风格 ID
 * @returns boolean
 */
export function hasComponentStyle(id: string): boolean {
  return id in componentStyles
}

/**
 * 导出类型
 */
export type { ComponentStyle, ComponentStyleCollection } from './types'
