/**
 * 字体组合定义
 * @description 包含多种字体组合，支持标题、正文、代码字体
 */

import type { FontCombination, FontCombinationCollection } from './types'

/**
 * 1. Inter + JetBrains Mono
 * 现代无衬线 + 等宽字体
 */
export const interJetBrainsCombo: FontCombination = {
  id: 'inter-jetbrains',
  name: 'Inter + JetBrains Mono',
  description: '现代无衬线 + 等宽字体',
  source: 'google',
  url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
  heading: {
    family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    weight: '700',
    size: '32px',
    lineHeight: '1.2'
  },
  body: {
    family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    weight: '400',
    size: '16px',
    lineHeight: '1.5'
  },
  code: {
    family: '"JetBrains Mono", "Fira Code", Consolas, Monaco, monospace',
    weight: '400',
    size: '14px',
    lineHeight: '1.6'
  }
}

/**
 * 2. Roboto + Fira Code
 * Google 字体系列
 */
export const robotoFiraCombo: FontCombination = {
  id: 'roboto-fira',
  name: 'Roboto + Fira Code',
  description: 'Google 字体系列',
  source: 'google',
  url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Fira+Code:wght@400;500&display=swap',
  heading: {
    family: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    weight: '700',
    size: '32px',
    lineHeight: '1.2'
  },
  body: {
    family: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    weight: '400',
    size: '16px',
    lineHeight: '1.5'
  },
  code: {
    family: '"Fira Code", "JetBrains Mono", Consolas, Monaco, monospace',
    weight: '400',
    size: '14px',
    lineHeight: '1.6'
  }
}

/**
 * 3. Noto Sans + Source Code Pro
 * 开源字体组合
 */
export const notoSourceCombo: FontCombination = {
  id: 'noto-source',
  name: 'Noto Sans + Source Code Pro',
  description: '开源字体组合',
  source: 'google',
  url: 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500;600&display=swap',
  heading: {
    family: '"Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    weight: '700',
    size: '32px',
    lineHeight: '1.2'
  },
  body: {
    family: '"Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    weight: '400',
    size: '16px',
    lineHeight: '1.5'
  },
  code: {
    family: '"Source Code Pro", "Fira Code", Consolas, Monaco, monospace',
    weight: '400',
    size: '14px',
    lineHeight: '1.6'
  }
}

/**
 * 4. System + Mono
 * 系统字体 + 等宽
 */
export const systemMonoCombo: FontCombination = {
  id: 'system-mono',
  name: 'System + Mono',
  description: '系统字体 + 等宽',
  source: 'system',
  heading: {
    family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    weight: '700',
    size: '32px',
    lineHeight: '1.2'
  },
  body: {
    family: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    weight: '400',
    size: '16px',
    lineHeight: '1.5'
  },
  code: {
    family: 'ui-monospace, "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
    weight: '400',
    size: '14px',
    lineHeight: '1.6'
  }
}

/**
 * 5. Outfit + Space Mono
 * 现代几何字体
 */
export const outfitSpaceCombo: FontCombination = {
  id: 'outfit-space',
  name: 'Outfit + Space Mono',
  description: '现代几何字体',
  source: 'google',
  url: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap',
  heading: {
    family: '"Outfit", system-ui, -apple-system, sans-serif',
    weight: '700',
    size: '32px',
    lineHeight: '1.1'
  },
  body: {
    family: '"Outfit", system-ui, -apple-system, sans-serif',
    weight: '400',
    size: '16px',
    lineHeight: '1.5'
  },
  code: {
    family: '"Space Mono", "Fira Code", Consolas, Monaco, monospace',
    weight: '400',
    size: '14px',
    lineHeight: '1.6'
  }
}

/**
 * 6. Poppins + IBM Plex Mono
 * 友好字体组合
 */
export const poppinsIBMPlexCombo: FontCombination = {
  id: 'poppins-ibmplex',
  name: 'Poppins + IBM Plex Mono',
  description: '友好字体组合',
  source: 'google',
  url: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap',
  heading: {
    family: '"Poppins", system-ui, -apple-system, sans-serif',
    weight: '700',
    size: '32px',
    lineHeight: '1.2'
  },
  body: {
    family: '"Poppins", system-ui, -apple-system, sans-serif',
    weight: '400',
    size: '16px',
    lineHeight: '1.5'
  },
  code: {
    family: '"IBM Plex Mono", "Fira Code", Consolas, Monaco, monospace',
    weight: '400',
    size: '14px',
    lineHeight: '1.6'
  }
}

/**
 * 7. Merriweather + Fira Code
 * 衬线 + 等宽（适合阅读）
 */
export const merriweatherFiraCombo: FontCombination = {
  id: 'merriweather-fira',
  name: 'Merriweather + Fira Code',
  description: '衬线 + 等宽（适合阅读）',
  source: 'google',
  url: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Fira+Code:wght@400;500&display=swap',
  heading: {
    family: '"Merriweather", Georgia, serif',
    weight: '700',
    size: '32px',
    lineHeight: '1.3'
  },
  body: {
    family: '"Merriweather", Georgia, serif',
    weight: '400',
    size: '16px',
    lineHeight: '1.8'
  },
  code: {
    family: '"Fira Code", "JetBrains Mono", Consolas, Monaco, monospace',
    weight: '400',
    size: '14px',
    lineHeight: '1.6'
  }
}

/**
 * 8. Work Sans + JetBrains Mono
 * 专业字体组合
 */
export const workSansJetBrainsCombo: FontCombination = {
  id: 'worksans-jetbrains',
  name: 'Work Sans + JetBrains Mono',
  description: '专业字体组合',
  source: 'google',
  url: 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap',
  heading: {
    family: '"Work Sans", system-ui, -apple-system, sans-serif',
    weight: '700',
    size: '32px',
    lineHeight: '1.2'
  },
  body: {
    family: '"Work Sans", system-ui, -apple-system, sans-serif',
    weight: '400',
    size: '16px',
    lineHeight: '1.5'
  },
  code: {
    family: '"JetBrains Mono", "Fira Code", Consolas, Monaco, monospace',
    weight: '400',
    size: '14px',
    lineHeight: '1.6'
  }
}

/**
 * 字体组合集合
 */
export const fontCombinations: FontCombinationCollection = {
  'inter-jetbrains': interJetBrainsCombo,
  'roboto-fira': robotoFiraCombo,
  'noto-source': notoSourceCombo,
  'system-mono': systemMonoCombo,
  'outfit-space': outfitSpaceCombo,
  'poppins-ibmplex': poppinsIBMPlexCombo,
  'merriweather-fira': merriweatherFiraCombo,
  'worksans-jetbrains': workSansJetBrainsCombo
}

/**
 * 字体组合列表
 */
export const fontCombinationList = Object.values(fontCombinations)

/**
 * 获取字体组合
 * @param id 字体组合 ID
 * @returns FontCombination | undefined
 */
export function getFontCombination(id: string): FontCombination | undefined {
  return fontCombinations[id]
}

/**
 * 获取默认字体组合
 * @returns FontCombination
 */
export function getDefaultFontCombination(): FontCombination {
  return interJetBrainsCombo
}

/**
 * 获取所有字体组合 ID
 * @returns string[]
 */
export function getFontCombinationIds(): string[] {
  return Object.keys(fontCombinations)
}

/**
 * 检查字体组合是否存在
 * @param id 字体组合 ID
 * @returns boolean
 */
export function hasFontCombination(id: string): boolean {
  return id in fontCombinations
}

/**
 * 获取 Google Fonts URL
 * @param id 字体组合 ID
 * @returns string | undefined
 */
export function getGoogleFontsUrl(id: string): string | undefined {
  const combo = getFontCombination(id)
  return combo?.source === 'google' ? combo.url : undefined
}

/**
 * 导出类型
 */
export type { FontCombination, FontCombinationCollection } from './types'
