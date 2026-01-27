/**
 * 三色系（蓝+青+橙）配色方案
 * 主色：蓝色，辅助色：青色，强调色：橙色，层次丰富，平衡感好
 */

import type { ColorScheme } from './types'

export const blueCyanOrange: ColorScheme = {
  id: 'blue-cyan-orange',
  name: '三色系（蓝+青+橙）',
  description: '主色：蓝色，辅助色：青色，强调色：橙色，层次丰富，平衡感好',
  colors: {
    primary: '#3B82F6',
    secondary: '#06B6D4',
    accent: '#F97316',
    background: '#FFFFFF',
    text: '#0F172A'
  },
  isGradient: false
}
