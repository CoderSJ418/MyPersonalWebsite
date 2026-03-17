/**
 * 字体初始化模块
 */
import { logger } from '@/utils/logger'
import { loadAllFonts, preloadCriticalFonts, addFontLoadingStyles } from '@/utils/fontLoader'

/**
 * 初始化字体系统
 */
export async function initFonts(): Promise<void> {
  // 预加载关键字体
  preloadCriticalFonts()

  // 添加字体加载样式
  addFontLoadingStyles()

  try {
    await loadAllFonts()
    document.documentElement.classList.add('fonts-loaded')
    logger.info('All fonts loaded successfully')
  } catch (error) {
    console.error('Failed to load fonts:', error)
    // 即使字体加载失败，也要继续应用
    document.documentElement.classList.add('fonts-loaded')
  }
}
