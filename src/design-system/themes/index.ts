/**
 * 设计主题系统
 * @description 提供多主题支持和主题切换功能
 */

import type { DesignTheme, ThemeCollection } from '../types/theme'

/**
 * 专业极简主题
 */
export const professionalMinimal: DesignTheme = {
  id: 'professional-minimal',
  name: '专业极简',
  description: '简洁专业的现代设计风格',
  trendYear: '2025',

  colors: {
    primary: '#6366F1',
    secondary: '#8B5CF6',
    accent: '#EC4899',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#1E293B',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    borderDark: '#CBD5E1'
  },

  fonts: {
    heading: {
      family: 'Inter',
      weight: '700',
      url: 'https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap'
    },
    body: {
      family: 'Inter',
      weight: '400',
      url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap'
    },
    code: {
      family: 'JetBrains Mono',
      weight: '400',
      url: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&display=swap'
    }
  },

  uiEffects: {
    backdropBlur: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    borderRadius: '0.75rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  }
}

/**
 * 深色专业主题
 */
export const darkProfessional: DesignTheme = {
  id: 'dark-professional',
  name: '深色专业',
  description: '深色主题，适合夜间使用',
  trendYear: '2025',

  colors: {
    primary: '#818CF8',
    secondary: '#A78BFA',
    accent: '#F472B6',
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    border: '#334155',
    borderLight: '#475569',
    borderDark: '#1E293B'
  },

  fonts: {
    heading: {
      family: 'Inter',
      weight: '700'
    },
    body: {
      family: 'Inter',
      weight: '400'
    },
    code: {
      family: 'JetBrains Mono',
      weight: '400'
    }
  },

  uiEffects: {
    backdropBlur: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
    borderRadius: '0.75rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  }
}

/**
 * 所有可用主题
 */
export const themes: ThemeCollection = {
  'professional-minimal': professionalMinimal,
  'dark-professional': darkProfessional
}

/**
 * 获取默认主题
 */
export function getDefaultTheme(): DesignTheme {
  return professionalMinimal
}

/**
 * 根据ID获取主题
 */
export function getTheme(id: string): DesignTheme | undefined {
  return themes[id]
}

/**
 * 获取所有主题列表
 */
export function getThemeList(): DesignTheme[] {
  return Object.values(themes)
}

// 导出类型
export type { DesignTheme, ThemeCollection } from '../types/theme'
