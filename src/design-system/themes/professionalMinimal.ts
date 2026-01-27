/**
 * 专业极简主题 (Professional Minimal)
 *
 * 基于 2025-2026 年顶级设计规范
 * 参考案例：Linear, Vercel, Stripe
 *
 * 设计哲学：
 * - 极简主义，清晰高效
 * - 统一的视觉语言
 * - 克制的动画
 * - 优秀的可读性
 *
 * 配色方案：
 * - Primary: Indigo-500 #6366F1
 * - Secondary: Violet-500 #8B5CF6
 * - Accent: Blue-500 #4A90E2
 * - Background: Slate-900 #0F172A
 * - Text: White #FFFFFF
 *
 * 动画效果：
 * - 只在交互时使用动画
 * - 持续时间：150-300ms
 * - 缓动函数：cubic-bezier(0.16, 1, 0.3, 1)
 *
 * 适用场景：
 * - 专业作品集
 * - SaaS 产品
 * - 技术博客
 */

import type { DesignTheme } from '../types/theme'

export const professionalMinimalTheme: DesignTheme = {
  id: 'professional-minimal',
  name: '专业极简',
  description: '极简主义，清晰高效，统一视觉语言，克制动画',
  trendYear: '2026',

  colors: {
    primary: '#6366F1', // Indigo-500
    secondary: '#8B5CF6', // Violet-500
    accent: '#4A90E2', // Blue-500
    background: '#0F172A', // Slate-900
    surface: '#1E293B', // Slate-800
    text: '#FFFFFF', // White
    textSecondary: '#94A3B8', // Slate-400
    textTertiary: '#64748B', // Slate-500
    border: 'rgba(255, 255, 255, 0.08)',
    borderLight: 'rgba(255, 255, 255, 0.12)',
    borderDark: 'rgba(255, 255, 255, 0.04)'
  },

  fonts: {
    heading: {
      family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      weight: '600',
      url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    },
    body: {
      family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      weight: '400',
      url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    },
    code: {
      family: '"JetBrains Mono", "Fira Code", Consolas, Monaco, monospace',
      weight: '400',
      url: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap'
    }
  },

  uiEffects: {
    backdropBlur: 'blur(0px)',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    hoverTransform: 'translateY(-2px)'
  },

  animations: {
    // 不使用持续动画，只在交互时使用
    gradient: 'none',
    glow: 'none',
    ripple: 'none',
    breathing: 'none',
    glitch: 'none'
  },

  texture: {
    type: 'none',
    intensity: 'light'
  }
}
