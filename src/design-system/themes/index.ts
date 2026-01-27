/**
 * 设计主题集合
 * @description 简化的主题系统，保留 1 个核心主题以提升用户体验
 */

import type { DesignTheme, ThemeCollection, ThemeList } from '../types/theme'
import { professionalMinimalTheme } from './professionalMinimal'

/**
 * 主题集合（简化版 - 1 个核心主题）
 */
export const themes: ThemeCollection = {
  'professional-minimal': professionalMinimalTheme // 专业极简（深色）
}

/**
 * 主题列表
 */
export const themeList: ThemeList = Object.values(themes)

/**
 * 获取主题
 * @param id 主题 ID
 * @returns DesignTheme | undefined
 */
export function getTheme(id: string): DesignTheme | undefined {
  return themes[id]
}

/**
 * 获取默认主题
 * @returns DesignTheme
 */
export function getDefaultTheme(): DesignTheme {
  return professionalMinimalTheme // 使用专业极简主题作为默认
}

/**
 * 获取所有主题 ID
 * @returns string[]
 */
export function getThemeIds(): string[] {
  return Object.keys(themes)
}

/**
 * 检查主题是否存在
 * @param id 主题 ID
 * @returns boolean
 */
export function hasTheme(id: string): boolean {
  return id in themes
}

/**
 * 导出类型
 */
export type { DesignTheme, ThemeCollection, ThemeList } from '../types/theme'
