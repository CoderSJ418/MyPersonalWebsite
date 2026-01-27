/**
 * 配色方案定义
 * @description 现代顶级设计风格的配色方案，参考 Linear、Vercel、Stripe、Apple 等顶级设计语言
 */

import type { ColorScheme, ColorSchemeCollection } from './types'

/**
 * 1. Linear Purple - Linear 风格紫色
 * 参考 Linear 的标志性紫色渐变，现代、科技、充满活力
 */
export const linearPurpleScheme: ColorScheme = {
  id: 'linear-purple',
  name: 'Linear Purple',
  description: 'Linear 风格紫色，现代科技感',
  colors: {
    primary: '#5E6AD2', // Linear 主紫色
    secondary: '#8B5CF6', // 辅助紫色
    accent: '#EC4899', // 强调粉色
    background: '#0A0A0B', // 深色背景
    text: '#FFFFFF' // 白色文字
  },
  isGradient: true,
  gradient: {
    type: 'linear',
    direction: '135deg',
    colors: ['#5E6AD2', '#8B5CF6', '#EC4899']
  }
}

/**
 * 2. Vercel Black - Vercel 风格黑白
 * 参考 Vercel 的极简黑白设计，专业、高端、极致简洁
 */
export const vercelBlackScheme: ColorScheme = {
  id: 'vercel-black',
  name: 'Vercel Black',
  description: 'Vercel 风格黑白，极简专业',
  colors: {
    primary: '#000000', // 纯黑
    secondary: '#171717', // 深灰
    accent: '#FFFFFF', // 纯白
    background: '#FFFFFF', // 白色背景
    text: '#000000' // 黑色文字
  },
  isGradient: false
}

/**
 * 3. Stripe Indigo - Stripe 风格靛蓝
 * 参考 Stripe 的优雅靛蓝渐变，精致、优雅、高级
 */
export const stripeIndigoScheme: ColorScheme = {
  id: 'stripe-indigo',
  name: 'Stripe Indigo',
  description: 'Stripe 风格靛蓝，优雅高级',
  colors: {
    primary: '#635BFF', // Stripe 主靛蓝
    secondary: '#80E9FF', // 辅助青色
    accent: '#00D4FF', // 强调亮青
    background: '#F7F9FC', // 浅灰背景
    text: '#0A2540' // 深蓝文字
  },
  isGradient: true,
  gradient: {
    type: 'linear',
    direction: '90deg',
    colors: ['#635BFF', '#80E9FF', '#00D4FF']
  }
}

/**
 * 4. Apple Blue - Apple 风格蓝色
 * 参考 Apple 的经典蓝色，简洁、优雅、精致
 */
export const appleBlueScheme: ColorScheme = {
  id: 'apple-blue',
  name: 'Apple Blue',
  description: 'Apple 风格蓝色，简洁优雅',
  colors: {
    primary: '#007AFF', // Apple 标志性蓝色
    secondary: '#5856D6', // 辅助紫色
    accent: '#34C759', // 强调绿色
    background: '#F5F5F7', // Apple 浅灰背景
    text: '#1D1D1F' // 深灰文字
  },
  isGradient: true,
  gradient: {
    type: 'linear',
    direction: '135deg',
    colors: ['#007AFF', '#5856D6', '#34C759']
  }
}

/**
 * 配色方案集合
 * 精选顶级设计风格的配色方案
 */
export const colorSchemes: ColorSchemeCollection = {
  'linear-purple': linearPurpleScheme,
  'vercel-black': vercelBlackScheme,
  'stripe-indigo': stripeIndigoScheme,
  'apple-blue': appleBlueScheme
}

/**
 * 配色方案列表
 */
export const colorSchemeList = Object.values(colorSchemes)

/**
 * 获取配色方案
 * @param id 配色方案 ID
 * @returns ColorScheme | undefined
 */
export function getColorScheme(id: string): ColorScheme | undefined {
  return colorSchemes[id]
}

/**
 * 获取默认配色方案
 * @returns ColorScheme
 */
export function getDefaultColorScheme(): ColorScheme {
  return linearPurpleScheme
}

/**
 * 获取所有配色方案 ID
 * @returns string[]
 */
export function getColorSchemeIds(): string[] {
  return Object.keys(colorSchemes)
}

/**
 * 检查配色方案是否存在
 * @param id 配色方案 ID
 * @returns boolean
 */
export function hasColorScheme(id: string): boolean {
  return id in colorSchemes
}

/**
 * 导出类型
 */
export type { ColorScheme, ColorSchemeCollection } from './types'
