/**
 * 双色系（蓝+橙）配色方案
 * 主色：蓝色，强调色：橙色，对比强烈，视觉冲击力大
 */

import type { ColorScheme } from './types'

export const blueOrange: ColorScheme = {
  id: 'blue-orange',
  name: '双色系（蓝+橙）',
  description: '主色：蓝色，强调色：橙色，对比强烈，视觉冲击力大',
  colors: {
    primary: '#3B82F6',
    secondary: '#60A5FA',
    accent: '#F97316',
    background: '#FFFFFF',
    text: '#0F172A'
  },
  isGradient: false
}
