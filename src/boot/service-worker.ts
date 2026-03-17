/**
 * Service Worker 注册模块
 */
import { logger } from '@/utils/logger'
import { useServiceWorker } from '@/composables/useServiceWorker'

/**
 * 注册 Service Worker
 * 仅在生产环境启用
 */
export function registerServiceWorker(): void {
  if (!import.meta.env.PROD) {
    return
  }

  const registerSW = () => {
    const { register } = useServiceWorker()

    register('/sw.js')
      .then((registration) => {
        if (registration) {
          logger.info('[Service Worker] Registered successfully')

          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  logger.info('[Service Worker] New content is available; please refresh.')
                }
              })
            }
          })
        }
      })
      .catch((error) => {
        logger.error('[Service Worker] Registration failed:', error)
      })
  }

  // 优先使用 requestIdleCallback，降级到 setTimeout
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(registerSW, { timeout: 2000 })
  } else {
    setTimeout(registerSW, 1000)
  }
}
