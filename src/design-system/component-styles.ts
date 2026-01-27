/**
 * 组件风格定义 - 向后兼容入口
 *
 * 已按组件风格类型拆分为独立文件：
 * - types.ts - 组件风格类型定义
 * - flat.ts - 扁平化
 * - shadow.ts - 微阴影
 * - threeD.ts - 3D效果
 * - glass.ts - 玻璃效果
 *
 * 建议直接从 @/design-system/componentStyles/[style] 导入
 */

// 重新导出所有模块，保持向后兼容
export * from './componentStyles/index'
