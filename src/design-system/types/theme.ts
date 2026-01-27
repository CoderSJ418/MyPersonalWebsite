/**
 * 设计主题类型定义
 * @description 基于 2025-2026 年 UI 设计趋势的完整主题系统
 */

/**
 * 字体配置
 */
export interface FontConfig {
  family: string
  weight: string
  url?: string
}

/**
 * 颜色配置
 */
export interface ColorConfig {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textSecondary: string
  textTertiary: string
  border: string
  borderLight: string
  borderDark: string
}

/**
 * UI 效果配置
 */
export interface UIEffects {
  backdropBlur?: string
  boxShadow?: string
  borderRadius?: string
  border?: string
  transition?: string
  hoverTransform?: string
}

/**
 * 动画配置
 */
export interface AnimationConfig {
  gradient?: string
  glow?: string
  ripple?: string
  breathing?: string
  glitch?: string
}

/**
 * 材质配置
 */
export interface TextureConfig {
  type?: 'glass' | 'metal' | 'paper' | 'fabric' | 'none'
  intensity?: 'light' | 'medium' | 'heavy'
}

/**
 * 设计主题接口
 */
export interface DesignTheme {
  id: string
  name: string
  description: string
  trendYear: '2025' | '2026'

  colors: ColorConfig

  fonts: {
    heading: FontConfig
    body: FontConfig
    code: FontConfig
  }

  uiEffects: UIEffects

  animations?: AnimationConfig

  texture?: TextureConfig
}

/**
 * 主题集合类型
 */
export type ThemeCollection = Record<string, DesignTheme>

/**
 * 主题列表类型
 */
export type ThemeList = DesignTheme[]
