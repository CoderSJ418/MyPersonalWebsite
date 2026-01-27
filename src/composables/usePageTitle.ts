/**
 * 动态页面标题管理
 * 自动根据路由和内容更新页面标题
 */

import { watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

interface PageTitleConfig {
  suffix?: string
  separator?: string
  maxTitleLength?: number
  truncateWithEllipsis?: boolean
}

const defaultConfig: PageTitleConfig = {
  suffix: '佘杰 - Vue 专家 · 前端架构师',
  separator: ' | ',
  maxTitleLength: 60,
  truncateWithEllipsis: true,
}

let currentConfig: PageTitleConfig = { ...defaultConfig }
let originalTitle = ''

/**
 * 设置页面标题配置
 */
export function setPageTitleConfig(config: Partial<PageTitleConfig>) {
  currentConfig = { ...currentConfig, ...config }
}

/**
 * 重置页面标题配置为默认值
 */
export function resetPageTitleConfig() {
  currentConfig = { ...defaultConfig }
}

/**
 * 格式化页面标题
 */
function formatTitle(title: string): string {
  const { suffix, separator, maxTitleLength, truncateWithEllipsis } = currentConfig
  
  // 如果标题太长，截断它
  let formattedTitle = title
  if (maxTitleLength && title.length > maxTitleLength) {
    formattedTitle = truncateWithEllipsis
      ? `${title.substring(0, maxTitleLength - 3)}...`
      : title.substring(0, maxTitleLength)
  }
  
  // 添加后缀
  if (suffix) {
    formattedTitle = `${formattedTitle}${separator}${suffix}`
  }
  
  return formattedTitle
}

/**
 * 设置页面标题
 */
export function setPageTitle(title: string): void {
  document.title = formatTitle(title)
}

/**
 * 恢复原始页面标题
 */
export function restoreOriginalTitle(): void {
  if (originalTitle) {
    document.title = originalTitle
  }
}

/**
 * 使用动态页面标题
 * 自动根据路由和内容更新页面标题
 */
export function usePageTitle(config?: Partial<PageTitleConfig>) {
  const route = useRoute()
  
  // 合并配置
  if (config) {
    setPageTitleConfig(config)
  }
  
  // 保存原始标题
  if (!originalTitle) {
    originalTitle = document.title
  }
  
  /**
   * 根据路由更新标题
   */
  function updateTitleFromRoute() {
    const metaTitle = route.meta.title as string | undefined
    const pageTitle = metaTitle || route.name as string || '页面'
    
    // 如果是首页，使用特殊标题
    if (route.path === '/') {
      setPageTitle('首页')
      return
    }
    
    // 否则使用路由标题
    setPageTitle(pageTitle)
  }
  
  /**
   * 设置自定义标题
   */
  function setTitle(title: string): void {
    setPageTitle(title)
  }
  
  /**
   * 根据内容动态生成标题
   */
  function generateTitleFromContent(content: {
    title?: string
    name?: string
    label?: string
    [key: string]: any
  }): void {
    const title =
      content.title ||
      content.name ||
      content.label ||
      route.meta.title as string | undefined ||
      '页面'
    
    setPageTitle(title)
  }
  
  /**
   * 清理函数
   */
  function cleanup() {
    restoreOriginalTitle()
    resetPageTitleConfig()
  }
  
  // 初始更新
  updateTitleFromRoute()
  
  // 监听路由变化
  const stopWatcher = watch(
    () => route.path,
    () => {
      updateTitleFromRoute()
    },
    { immediate: true }
  )
  
  // 组件卸载时清理
  onUnmounted(() => {
    stopWatcher()
    cleanup()
  })
  
  return {
    setTitle,
    generateTitleFromContent,
    updateTitleFromRoute,
    cleanup,
  }
}

/**
 * 页面标题工具函数
 */
export const pageTitleUtils = {
  /**
   * 设置页面标题配置
   */
  setConfig: setPageTitleConfig,
  
  /**
   * 重置页面标题配置
   */
  resetConfig: resetPageTitleConfig,
  
  /**
   * 设置页面标题
   */
  setTitle: setPageTitle,
  
  /**
   * 恢复原始页面标题
   */
  restoreOriginal: restoreOriginalTitle,
  
  /**
   * 格式化页面标题
   */
  format: formatTitle,
  
  /**
   * 获取当前页面标题
   */
  getCurrentTitle(): string {
    return document.title
  },
  
  /**
   * 重置为默认标题
   */
  resetToDefault(): void {
    setPageTitle('首页')
  },
}