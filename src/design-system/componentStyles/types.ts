/**
 * UI 风格类型定义
 * @description 定义 UI 风格相关的类型和接口
 */

/**
 * 组件样式定义
 */
export interface ComponentStyle {
  /** 样式 ID */
  id: string
  /** 样式名称 */
  name: string
  /** 样式描述 */
  description: string
  /** 卡片样式 */
  card: CardStyle
  /** 按钮样式 */
  button: ButtonStyle
  /** 输入框样式 */
  input?: InputStyle
  /** 面板样式 */
  panel?: PanelStyle
  /** 导航栏样式 */
  navbar?: NavbarStyle
}

/**
 * 卡片样式
 */
export interface CardStyle {
  /** 背景色 */
  background?: string
  /** 边框 */
  border?: string
  /** 圆角 */
  borderRadius?: string
  /** 阴影 */
  boxShadow?: string
  /** 背景模糊效果 */
  backdropFilter?: string
  /** 变换 */
  transform?: string
  /** 溢出处理 */
  overflow?: string
}

/**
 * 按钮样式
 */
export interface ButtonStyle {
  /** 背景色 */
  background?: string
  /** 文字颜色 */
  color?: string
  /** 边框 */
  border?: string
  /** 圆角 */
  borderRadius?: string
  /** 阴影 */
  boxShadow?: string
  /** 背景模糊效果 */
  backdropFilter?: string
  /** 字体粗细 */
  fontWeight?: string
  /** 变换 */
  transform?: string
}

/**
 * 输入框样式
 */
export interface InputStyle {
  /** 背景色 */
  background?: string
  /** 边框 */
  border?: string
  /** 圆角 */
  borderRadius?: string
  /** 阴影 */
  boxShadow?: string
  /** 聚焦时的边框颜色 */
  focusBorderColor?: string
}

/**
 * 面板样式
 */
export interface PanelStyle {
  /** 背景色 */
  background?: string
  /** 边框 */
  border?: string
  /** 圆角 */
  borderRadius?: string
  /** 阴影 */
  boxShadow?: string
  /** 背景模糊效果 */
  backdropFilter?: string
}

/**
 * 导航栏样式
 */
export interface NavbarStyle {
  /** 背景色 */
  background?: string
  /** 边框 */
  border?: string
  /** 阴影 */
  boxShadow?: string
  /** 背景模糊效果 */
  backdropFilter?: string
}

/**
 * UI 风格集合
 */
export type ComponentStyleCollection = Record<string, ComponentStyle>

/**
 * UI 风格选项
 */
export interface ComponentStyleOptions {
  /** 是否支持悬停效果 */
  supportsHover?: boolean
  /** 是否支持动画 */
  supportsAnimation?: boolean
  /** 是否支持响应式 */
  supportsResponsive?: boolean
}
