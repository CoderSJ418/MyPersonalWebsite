/**
 * 设计 Token 系统 - 向后兼容入口
 *
 * 已按功能模块拆分为独立文件：
 * - animation.ts - 动画配置
 * - spacing.ts - 间距配置
 * - typography.ts - 排版配置
 * - borderRadius.ts - 圆角配置
 * - shadow.ts - 阴影配置
 * - transition.ts - 过渡配置
 * - zIndex.ts - 层级配置
 *
 * 建议直接从 @/design-system/tokens/[module] 导入
 */

// 重新导出所有模块，保持向后兼容
export * from './tokens'
