import type { App } from 'vue'
import { initFonts } from './fonts'
import { registerServiceWorker } from './service-worker'

/**
 * 初始化应用
 * 字体加载非阻塞 — 优先渲染，字体就绪后自动切换
 */
export async function initializeApp(_app: App): Promise<void> {
  initFonts()

  // Service Worker 延迟注册
  registerServiceWorker()
}

// 导出子模块
export { initFonts } from './fonts'
export { registerServiceWorker } from './service-worker'
