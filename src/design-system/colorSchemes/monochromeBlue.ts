/**
 * 单色系（蓝色）配色方案
 * 只使用蓝色，通过明暗变化体现层次
 */

import type { ColorScheme } from './types'

export const monochromeBlue: ColorScheme = {
  id: 'monochrome-blue',
  name: '单色系（蓝色）',
  description: '只使用蓝色，通过明暗变化体现层次',
  colors: {
    primary: '#3B82F6',
    secondary: '#60A5FA',
    accent: '#93C5FD',
    background: '#FFFFFF',
    text: '#0F172A'
  },
  isGradient: false
}
