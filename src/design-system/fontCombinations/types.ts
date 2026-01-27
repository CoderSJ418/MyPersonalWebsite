/**
 * 字体组合类型定义
 * @description 定义字体组合相关的类型和接口
 */

/**
 * 字体配置
 */
export interface FontConfig {
  /** 字体家族 */
  family: string
  /** 字体粗细 */
  weight: string
  /** 字体大小（可选） */
  size?: string
  /** 字体行高（可选） */
  lineHeight?: string
  /** 字体字间距（可选） */
  letterSpacing?: string
}

/**
 * 字体组合
 */
export interface FontCombination {
  /** 组合 ID */
  id: string
  /** 组合名称 */
  name: string
  /** 组合描述 */
  description: string
  /** 标题字体 */
  heading: FontConfig
  /** 正文字体 */
  body: FontConfig
  /** 代码字体 */
  code: FontConfig
  /** 字体来源（Google Fonts、系统字体等） */
  source?: 'google' | 'system' | 'custom'
  /** 字体 URL（如果是 Google Fonts） */
  url?: string
}

/**
 * 字体组合集合
 */
export type FontCombinationCollection = Record<string, FontCombination>

/**
 * 字体主题
 */
export interface FontTheme {
  /** 当前字体组合 */
  combination: string
  /** 是否启用自定义字体 */
  customEnabled: boolean
  /** 自定义字体配置 */
  customFonts?: {
    heading?: FontConfig
    body?: FontConfig
    code?: FontConfig
  }
}

/**
 * 字体加载状态
 */
export interface FontLoadStatus {
  /** 是否已加载 */
  loaded: boolean
  /** 加载中的字体 */
  loading: string[]
  /** 加载失败的字体 */
  failed: string[]
}
