/**
 * Service Worker 管理 Composable
 * 用于注册、更新和控制 Service Worker
 */

import { ref, onMounted, onUnmounted } from 'vue'

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
      console.warn('[Service Worker] Not supported')
      return null
    }

    try {
      console.log('[Service Worker] Registering...', scriptUrl)

      const reg = await navigator.serviceWorker.register(scriptUrl, {
        scope: '/'
      })

      registration.value = reg
      status.value.isRegistered = true

      console.log('[Service Worker] Registered:', reg)

      // 监听更新
      reg.addEventListener('updatefound', handleUpdateFound)

      // 检查是否已经控制页面
      if (navigator.serviceWorker.controller) {
        status.value.isControlling = true
      }

      return reg
    } catch (error) {
      status.value.error = `注册失败: ${error}`
      console.error('[Service Worker] Registration failed:', error)
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

    console.log('[Service Worker] New worker installing')

    newWorker.addEventListener('statechange', () => {
      console.log('[Service Worker] State:', newWorker.state)

      switch (newWorker.state) {
        case 'installed':
          if (navigator.serviceWorker.controller) {
            // 有新的 Service Worker 可用
            console.log('[Service Worker] Update available')
            status.value.updateAvailable = true

            // 调用更新回调
            if (updateCallback.value) {
              updateCallback.value(registration.value!)
            }
          } else {
            // 首次安装
            console.log('[Service Worker] First install')
            status.value.isActivated = true
          }
          break

        case 'activated':
          status.value.isActivated = true
          console.log('[Service Worker] Activated')
          break

        case 'redundant':
          console.log('[Service Worker] Redundant')
          break
      }
    })
  }

  /**
   * 跳过等待，立即激活新的 Service Worker
   */
  const skipWaiting = () => {
    if (!registration.value || !registration.value.waiting) {
      console.warn('[Service Worker] No waiting worker to skip')
      return
    }

    console.log('[Service Worker] Skipping waiting')
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
      console.warn('[Service Worker] No registration')
      return
    }

    console.log('[Service Worker] Clearing cache')
    registration.value.active?.postMessage({ type: 'CLEAR_CACHE' })

    // 清除所有缓存
    const cacheNames = await caches.keys()
    await Promise.all(cacheNames.map((name) => caches.delete(name)))

    console.log('[Service Worker] Cache cleared')
  }

  /**
   * 注销 Service Worker
   */
  const unregister = async () => {
    if (!registration.value) {
      console.warn('[Service Worker] No registration to unregister')
      return
    }

    console.log('[Service Worker] Unregistering')
    const success = await registration.value.unregister()

    if (success) {
      console.log('[Service Worker] Unregistered successfully')
      status.value.isRegistered = false
      status.value.isActivated = false
      status.value.isControlling = false
    } else {
      console.warn('[Service Worker] Unregister failed')
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
   * 获取缓存大小
   */
  const getCacheSize = async () => {
    const cacheNames = await caches.keys()
    let totalSize = 0

    for (const name of cacheNames) {
      const cache = await caches.open(name)
      const keys = await cache.keys()

      for (const request of keys) {
        const response = await cache.match(request)
        if (response) {
          const blob = await response.blob()
          totalSize += blob.size
        }
      }
    }

    return totalSize
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
    console.log('[Service Worker] Controller changed')
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