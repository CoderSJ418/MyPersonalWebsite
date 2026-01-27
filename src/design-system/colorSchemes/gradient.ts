/**
 * 渐变色配色方案
 * 使用渐变色，视觉冲击力强，现代感强
 */

import type { ColorScheme } from './types'

export const gradient: ColorScheme = {
  id: 'gradient',
  name: '渐变色',
  description: '使用渐变色，视觉冲击力强，现代感强',
  colors: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    accent: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    background: '#FFFFFF',
    text: '#0F172A'
  },
  isGradient: true
}
