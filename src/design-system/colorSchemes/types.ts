/**
 * 配色方案类型定义
 * @description 定义配色方案相关的类型和接口
 */

/**
 * 颜色值
 */
export type ColorValue = string

/**
 * 颜色调色板
 */
export interface ColorPalette {
  /** 主色 */
  primary: ColorValue
  /** 次色 */
  secondary: ColorValue
  /** 强调色 */
  accent: ColorValue
  /** 背景色 */
  background: ColorValue
  /** 文本色 */
  text: ColorValue
}

/**
 * 配色方案
 */
export interface ColorScheme {
  /** 方案 ID */
  id: string
  /** 方案名称 */
  name: string
  /** 方案描述 */
  description: string
  /** 颜色调色板 */
  colors: ColorPalette
  /** 是否为渐变色 */
  isGradient?: boolean
  /** 渐变定义（如果是渐变色） */
  gradient?: {
    /** 渐变类型 */
    type: 'linear' | 'radial'
    /** 渐变方向（线性渐变） */
    direction?: string
    /** 渐变颜色 */
    colors: ColorValue[]
  }
}

/**
 * 扩展颜色调色板（包含更多颜色）
 */
export interface ExtendedColorPalette extends ColorPalette {
  /** 表面色 */
  surface: ColorValue
  /** 卡片色 */
  card: ColorValue
  /** 边框色 */
  border: ColorValue
  /** 次级文本色 */
  textSecondary: ColorValue
  /** 三级文本色 */
  textTertiary: ColorValue
  /** 成功色 */
  success: ColorValue
  /** 警告色 */
  warning: ColorValue
  /** 错误色 */
  error: ColorValue
  /** 信息色 */
  info: ColorValue
}

/**
 * 配色方案集合
 */
export type ColorSchemeCollection = Record<string, ColorScheme>

/**
 * 配色方案选项
 */
export interface ColorSchemeOptions {
  /** 是否支持暗黑模式 */
  supportsDarkMode?: boolean
  /** 是否支持渐变 */
  supportsGradient?: boolean
  /** 是否支持自定义颜色 */
  supportsCustomColors?: boolean
}
