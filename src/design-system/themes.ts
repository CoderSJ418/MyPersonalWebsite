/**
 * 设计风格定义 - 向后兼容入口
 *
 * 简化的主题系统（3个核心主题）：
 * - types.ts - 主题类型定义
 * - index.ts - 主题集合和导出
 * - professionalMinimal.ts - 专业极简主题（深色）
 * - liquidGlass.ts - 液态玻璃主题（深色）
 * - lightClean.ts - 浅色清爽主题（浅色）
 *
 * 建议直接从 @/design-system/themes/[theme] 导入
 */

// 重新导出所有模块，保持向后兼容
export * from './themes/index'
