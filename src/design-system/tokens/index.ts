/**
 * 设计 Token 系统 - 统一导出
 * 按功能模块组织，便于维护和扩展
 */

export { animation } from './animation'
export { spacing } from './spacing'
export { typography } from './typography'
export { borderRadius } from './borderRadius'
export { shadow } from './shadow'
export { transition } from './transition'
export { zIndex } from './zIndex'

// 向后兼容：导出所有 Token
export * from './animation'
export * from './spacing'
export * from './typography'
export * from './borderRadius'
export * from './shadow'
export * from './transition'
export * from './zIndex'
