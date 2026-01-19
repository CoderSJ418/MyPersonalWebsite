import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 移动端性能优化 Hook
 */
export function useMobilePerformance() {
  const isMobile = ref(false)
  const isLowEndDevice = ref(false)
  const prefersReducedMotion = ref(false)

  // 检测是否为移动设备
  const checkMobile = () => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
    isMobile.value = /android|ipad|iphone|ipod/i.test(userAgent) ||
                     (window as any).isMobile !== undefined
  }

  // 检测低端设备
  const checkLowEndDevice = () => {
    // 基于 CPU 核心数和内存
    const cores = navigator.hardwareConcurrency || 4
    const memory = (navigator as any).deviceMemory || 8

    // 少于 4 核或少于 4GB 内存视为低端设备
    isLowEndDevice.value = cores < 4 || memory < 4
  }

  // 检测用户是否偏好减少动画
  const checkReducedMotion = () => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.value = mediaQuery.matches

    // 监听变化
    mediaQuery.addEventListener('change', (e) => {
      prefersReducedMotion.value = e.matches
    })
  }

  // 获取适合的动画持续时间
  const getAnimationDuration = (normalDuration: number) => {
    if (prefersReducedMotion.value) return 0
    if (isLowEndDevice.value) return normalDuration * 0.5
    return normalDuration
  }

  // 获取适合的动画缓动函数
  const getAnimationEasing = () => {
    if (isLowEndDevice.value) return 'ease-out'
    return 'cubic-bezier(0.4, 0, 0.2, 1)'
  }

  // 节流函数
  const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean
    return function (this: any, ...args: Parameters<T>) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  }

  // 防抖函数
  const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: ReturnType<typeof setTimeout> | null = null
    return function (this: any, ...args: Parameters<T>) {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), wait)
    }
  }

  // 优化滚动事件
  const useOptimizedScroll = (callback: () => void, options?: { passive?: boolean }) => {
    const throttledCallback = throttle(callback, 100)

    onMounted(() => {
      window.addEventListener('scroll', throttledCallback, { passive: options?.passive ?? true })
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', throttledCallback)
    })

    return throttledCallback
  }

  // 优化 resize 事件
  const useOptimizedResize = (callback: () => void) => {
    const debouncedCallback = debounce(callback, 200)

    onMounted(() => {
      window.addEventListener('resize', debouncedCallback)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', debouncedCallback)
    })

    return debouncedCallback
  }

  // 预加载图片
  const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = src
      img.onload = () => resolve()
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    })
  }

  // 批量预加载图片
  const preloadImages = async (srcs: string[]): Promise<void> => {
    try {
      await Promise.all(srcs.map(src => preloadImage(src)))
    } catch (error) {
      console.error('Error preloading images:', error)
    }
  }

  onMounted(() => {
    checkMobile()
    checkLowEndDevice()
    checkReducedMotion()
  })

  return {
    isMobile,
    isLowEndDevice,
    prefersReducedMotion,
    getAnimationDuration,
    getAnimationEasing,
    throttle,
    debounce,
    useOptimizedScroll,
    useOptimizedResize,
    preloadImage,
    preloadImages
  }
}

/**
 * 移动端可视区域检测 Hook
 */
export function useMobileViewport() {
  const viewportWidth = ref(window.innerWidth)
  const viewportHeight = ref(window.innerHeight)
  const isPortrait = ref(window.innerHeight > window.innerWidth)

  const updateViewport = () => {
    viewportWidth.value = window.innerWidth
    viewportHeight.value = window.innerHeight
    isPortrait.value = window.innerHeight > window.innerWidth
  }

  onMounted(() => {
    window.addEventListener('resize', updateViewport)
    window.addEventListener('orientationchange', updateViewport)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateViewport)
    window.removeEventListener('orientationchange', updateViewport)
  })

  return {
    viewportWidth,
    viewportHeight,
    isPortrait
  }
}

/**
 * 移动端网络状态检测 Hook
 */
export function useMobileNetwork() {
  const isOnline = ref(navigator.onLine)
  const connectionType = ref('unknown')
  const effectiveType = ref<'slow-2g' | '2g' | '3g' | '4g'>('4g')

  const updateNetworkStatus = () => {
    isOnline.value = navigator.onLine

    // 获取网络连接信息
    const connection = (navigator as any).connection ||
                       (navigator as any).mozConnection ||
                       (navigator as any).webkitConnection

    if (connection) {
      connectionType.value = connection.type || 'unknown'
      effectiveType.value = connection.effectiveType || '4g'
    }
  }

  onMounted(() => {
    updateNetworkStatus()
    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)

    // 监听网络连接变化
    const connection = (navigator as any).connection
    if (connection) {
      connection.addEventListener('change', updateNetworkStatus)
    }
  })

  onUnmounted(() => {
    window.removeEventListener('online', updateNetworkStatus)
    window.removeEventListener('offline', updateNetworkStatus)

    const connection = (navigator as any).connection
    if (connection) {
      connection.removeEventListener('change', updateNetworkStatus)
    }
  })

  return {
    isOnline,
    connectionType,
    effectiveType,
    isSlowNetwork: () => ['slow-2g', '2g'].includes(effectiveType.value)
  }
}