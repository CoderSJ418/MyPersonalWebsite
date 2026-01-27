/**
 * 主题类型定义
 */

export interface Theme {
  id: string
  name: string
  description: string
  colors: {
    background: string
    surface: string
    card: string
    text: {
      primary: string
      secondary: string
      tertiary: string
    }
    accent: string
  }
  effects: {
    glass: boolean
    shadow: boolean
    gradient: boolean
  }
  spacing: {
    compact: boolean
    generous: boolean
  }
}
