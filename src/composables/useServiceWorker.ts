/**
 * Service Worker 管理 Composable
 * 用于注册、更新和控制 Service Worker
 */

import { ref, onMounted, onUnmounted } from 'vue'
import { logger } from '@/utils/logger'

export interface ServiceWorkerStatus {
  isSupported: boolean
  isRegistered: boolean
  isActivated: boolean
  isControlling: boolean
  updateAvailable: boolean
  error: string | null
}

export function useServiceWorker() {
  const status = ref<ServiceWorkerStatus>({
    isSupported: false,
    isRegistered: false,
    isActivated: false,
    isControlling: false,
    updateAvailable: false,
    error: null
  })

  const registration = ref<ServiceWorkerRegistration | null>(null)
  const updateCallback = ref<((registration: ServiceWorkerRegistration) => void) | null>(null)

  /**
   * 检查 Service Worker 支持
   */
  const checkSupport = () => {
    status.value.isSupported = 'serviceWorker' in navigator && 'PushManager' in window
    return status.value.isSupported
  }

  /**
   * 注册 Service Worker
   */
  const register = async (scriptUrl = '/sw.js') => {
    if (!checkSupport()) {
      status.value.error = 'Service Worker 不被支持'
      logger.warn('[Service Worker] Not supported')
      return null
    }

    try {
      logger.info('[Service Worker] Registering...', scriptUrl)

      const reg = await navigator.serviceWorker.register(scriptUrl, {
        scope: '/'
      })

      registration.value = reg
      status.value.isRegistered = true

      logger.info('[Service Worker] Registered:', reg)

      // 监听更新
      reg.addEventListener('updatefound', handleUpdateFound)

      // 检查是否已经控制页面
      if (navigator.serviceWorker.controller) {
        status.value.isControlling = true
      }

      return reg
    } catch (error) {
      status.value.error = `注册失败: ${error}`
      logger.error('[Service Worker] Registration failed:', error)
      return null
    }
  }

  /**
   * 处理 Service Worker 更新
   */
  const handleUpdateFound = () => {
    if (!registration.value) return

    const newWorker = registration.value.installing

    if (!newWorker) return

    logger.info('[Service Worker] New worker installing')

    newWorker.addEventListener('statechange', () => {
      logger.debug('[Service Worker] State:', newWorker.state)

      switch (newWorker.state) {
        case 'installed':
          if (navigator.serviceWorker.controller) {
            // 有新的 Service Worker 可用
            logger.info('[Service Worker] Update available')
            status.value.updateAvailable = true

            // 调用更新回调
            if (updateCallback.value) {
              updateCallback.value(registration.value!)
            }
          } else {
            // 首次安装
            logger.info('[Service Worker] First install')
            status.value.isActivated = true
          }
          break

        case 'activated':
          status.value.isActivated = true
          logger.info('[Service Worker] Activated')
          break

        case 'redundant':
          logger.warn('[Service Worker] Redundant')
          break
      }
    })
  }

  /**
   * 跳过等待，立即激活新的 Service Worker
   */
  const skipWaiting = () => {
    if (!registration.value || !registration.value.waiting) {
      logger.warn('[Service Worker] No waiting worker to skip')
      return
    }

    logger.info('[Service Worker] Skipping waiting')
    registration.value.waiting.postMessage({ type: 'SKIP_WAITING' })
  }

  /**
   * 应用更新
   */
  const applyUpdate = () => {
    skipWaiting()
    window.location.reload()
  }

  /**
   * 清除缓存
   */
  const clearCache = async () => {
    if (!registration.value) {
      logger.warn('[Service Worker] No registration')
      return
    }

    logger.info('[Service Worker] Clearing cache')
    registration.value.active?.postMessage({ type: 'CLEAR_CACHE' })

    // 清除所有缓存
    const cacheNames = await caches.keys()
    await Promise.all(cacheNames.map((name) => caches.delete(name)))

    logger.info('[Service Worker] Cache cleared')
  }

  /**
   * 注销 Service Worker
   */
  const unregister = async () => {
    if (!registration.value) {
      logger.warn('[Service Worker] No registration to unregister')
      return
    }

    logger.info('[Service Worker] Unregistering')
    const success = await registration.value.unregister()

    if (success) {
      logger.info('[Service Worker] Unregistered successfully')
      status.value.isRegistered = false
      status.value.isActivated = false
      status.value.isControlling = false
    } else {
      logger.warn('[Service Worker] Unregister failed')
    }
  }

  /**
   * 设置更新回调
   */
  const onUpdate = (callback: (registration: ServiceWorkerRegistration) => void) => {
    updateCallback.value = callback

    // 如果已经有更新可用，立即调用回调
    if (status.value.updateAvailable && registration.value) {
      callback(registration.value)
    }
  }

  /**
   * 获取缓存大小 - 使用 Promise.all 并行处理优化性能
   */
  const getCacheSize = async () => {
    const cacheNames = await caches.keys()

    // 使用 Promise.all 并行处理所有缓存
    const cacheSizes = await Promise.all(
      cacheNames.map(async (name) => {
        const cache = await caches.open(name)
        const keys = await cache.keys()

        // 并行处理每个缓存中的所有请求
        const responseSizes = await Promise.all(
          keys.map(async (request) => {
            const response = await cache.match(request)
            if (response) {
              const blob = await response.blob()
              return blob.size
            }
            return 0
          })
        )

        return responseSizes.reduce((sum, size) => sum + size, 0)
      })
    )

    return cacheSizes.reduce((sum, size) => sum + size, 0)
  }

  /**
   * 格式化缓存大小
   */
  const formatCacheSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`
  }

  // 监听 Service Worker 控制变化
  const handleControllerChange = () => {
    logger.info('[Service Worker] Controller changed')
    status.value.isControlling = !!navigator.serviceWorker.controller
  }

  onMounted(() => {
    if (checkSupport()) {
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)
    }
  })

  onUnmounted(() => {
    if (checkSupport()) {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
    }
  })

  return {
    status,
    register,
    unregister,
    skipWaiting,
    applyUpdate,
    clearCache,
    onUpdate,
    getCacheSize,
    formatCacheSize
  }
}
