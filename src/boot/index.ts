/**
 * 应用初始化模块
 * 
 * 将 main.ts 中的初始化逻辑拆分到独立模块
 * - fonts.ts: 字体加载
 * - monitoring.ts: 监控系统
 * - service-worker.ts: Service Worker 注册
 */
import type { App } from 'vue'
import { initFonts } from './fonts'
import { initMonitoring } from './monitoring'
import { registerServiceWorker } from './service-worker'

/**
 * 初始化应用
 * 字体加载改为非阻塞 — 优先渲染，字体就绪后自动切换
 */
export async function initializeApp(app: App): Promise<void> {
  // 字体加载不阻塞渲染 — 使用 font-display: swap 策略
  // 先显示系统字体，Web 字体就绪后自动切换
  initFonts()

  // 非关键路径：并行初始化
  Promise.all([
    initMonitoring(app),
    // Service Worker 延迟注册
    new Promise<void>((resolve) => {
      registerServiceWorker()
      resolve()
    })
  ]).catch((error) => {
    console.error('[Boot] Initialization error:', error)
  })
}

// 导出子模块
export { initFonts } from './fonts'
export { initMonitoring } from './monitoring'
export { registerServiceWorker } from './service-worker'
