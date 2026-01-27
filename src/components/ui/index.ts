/**
 * UI 组件索引
 * 统一导出所有 UI 组件
 */

export { default as Button } from './Button.vue'
export { default as Card } from './Card.vue'
export { default as Input } from './Input.vue'
export { default as CTA } from './CTA.vue'
export { default as Breadcrumb } from './Breadcrumb.vue'
export { default as ErrorMessage } from './ErrorMessage.vue'

// 重新导出类型
export type { Props as ButtonProps } from './Button.vue'
export type { Props as CardProps } from './Card.vue'
export type { Props as InputProps } from './Input.vue'
export type { Props as CTAProps } from './CTA.vue'
export type { BreadcrumbItem, Props as BreadcrumbProps } from './Breadcrumb.vue'
export type { Props as ErrorMessageProps } from './ErrorMessage.vue'