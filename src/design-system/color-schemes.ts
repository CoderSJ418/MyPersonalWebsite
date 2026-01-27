/**
 * 配色方案定义 - 向后兼容入口
 *
 * 已按配色方案类型拆分为独立文件：
 * - types.ts - 配色方案类型定义
 * - monochromeBlue.ts - 单色系（蓝色）
 * - blueOrange.ts - 双色系（蓝+橙）
 * - blueCyanOrange.ts - 三色系（蓝+青+橙）
 * - gradient.ts - 渐变色
 *
 * 建议直接从 @/design-system/colorSchemes/[scheme] 导入
 */

// 重新导出所有模块，保持向后兼容
export * from './colorSchemes/index'
