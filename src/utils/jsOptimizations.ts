/**
 * JavaScript 优化工具函数
 * 包含常用的性能优化和兼容性处理函数
 */

/**
 * 防抖函数 - 延迟执行，适用于搜索、resize 等场景
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
  immediate = false
): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return ((...args: Parameters<T>) => {
    const callNow = immediate && !timeoutId

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      timeoutId = null
      if (!immediate) {
        fn(...args)
      }
    }, delay)

    if (callNow) {
      fn(...args)
    }
  }) as T
}

/**
 * 节流函数 - 限制执行频率，适用于 scroll、mousemove 等高频事件
 */
export function throttle<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): T {
  let lastCall = 0
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return ((...args: Parameters<T>) => {
    const now = Date.now()

    if (now - lastCall >= delay) {
      lastCall = now
      fn(...args)
    } else if (!timeoutId) {
      timeoutId = setTimeout(
        () => {
          lastCall = Date.now()
          timeoutId = null
          fn(...args)
        },
        delay - (now - lastCall)
      )
    }
  }) as T
}

/**
 * requestAnimationFrame 节流 - 适用于动画场景
 */
export function rafThrottle<T extends (...args: unknown[]) => unknown>(fn: T): T {
  let rafId: number | null = null

  return ((...args: Parameters<T>) => {
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        fn(...args)
        rafId = null
      })
    }
  }) as T
}

/**
 * 批量处理函数 - 将多个操作合并为一次执行
 */
export function batch<T>(items: T[], processor: (item: T) => void, batchSize = 10) {
  return new Promise<void>((resolve) => {
    let index = 0

    const processBatch = () => {
      const batch = items.slice(index, index + batchSize)
      batch.forEach(processor)

      index += batchSize

      if (index < items.length) {
        // 使用 requestIdleCallback 避免阻塞主线程
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(processBatch, { timeout: 100 })
        } else {
          setTimeout(processBatch, 0)
        }
      } else {
        resolve()
      }
    }

    processBatch()
  })
}

/**
 * 懒加载检测 - 使用 Intersection Observer
 */
export function createLazyObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    rootMargin: '50px',
    threshold: 0.01,
    ...options
  }

  return new IntersectionObserver(callback, defaultOptions)
}

/**
 * 并行处理 Promise 数组 - 限制并发数
 */
export async function parallel<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  concurrency = 5
): Promise<R[]> {
  const results: R[] = []
  const executing: Promise<void>[] = []

  for (const item of items) {
    const promise = processor(item).then((result) => {
      results.push(result)
    })

    executing.push(promise)

    if (executing.length >= concurrency) {
      await Promise.race(executing)
      executing.splice(
        executing.findIndex((p) => p === promise),
        1
      )
    }
  }

  await Promise.all(executing)
  return results
}

/**
 * 缓存函数 - 缓存函数结果
 */
export function memoize<T extends (...args: unknown[]) => unknown>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

/**
 * 检测浏览器特性
 */
export const features = {
  // 检测 Intersection Observer 支持
  intersectionObserver: 'IntersectionObserver' in window,

  // 检测 Resize Observer 支持
  resizeObserver: 'ResizeObserver' in window,

  // 检测 requestIdleCallback 支持
  requestIdleCallback: 'requestIdleCallback' in window,

  // 检测 PerformanceNavigationTiming 支持
  performanceNavigationTiming: 'PerformanceNavigationTiming' in window,

  // 检测 Passive Event Listeners 支持
  passiveEvents: (() => {
    let supportsPassive = false
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get() {
          supportsPassive = true
          return true
        }
      })
      window.addEventListener('test', () => {}, opts)
      window.removeEventListener('test', () => {}, opts)
    } catch (e) {
      // 忽略错误
    }
    return supportsPassive
  })(),

  // 检测 Web Worker 支持
  webWorker: 'Worker' in window,

  // 检测 Service Worker 支持
  serviceWorker: 'serviceWorker' in navigator,

  // 检测 Blob 支持
  blob: 'Blob' in window && 'URL' in window,

  // 检测 Fetch API 支持
  fetch: 'fetch' in window,

  // 检测 sendBeacon 支持
  sendBeacon: 'sendBeacon' in navigator
}

/**
 * 获取被动事件监听器选项
 */
export function getPassiveOptions(): AddEventListenerOptions | boolean {
  return features.passiveEvents ? { passive: true } : false
}

/**
 * 安全执行函数 - 捕获错误
 */
export function safeExecute<T>(fn: () => T, fallback?: T): T | undefined {
  try {
    return fn()
  } catch (error) {
    console.error('Safe execute error:', error)
    return fallback
  }
}

/**
 * 异步安全执行函数
 */
export async function safeExecuteAsync<T>(
  fn: () => Promise<T>,
  fallback?: T
): Promise<T | undefined> {
  try {
    return await fn()
  } catch (error) {
    console.error('Safe execute async error:', error)
    return fallback
  }
}

/**
 * 空闲时执行任务
 */
export function whenIdle(callback: () => void, timeout = 2000) {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout })
  } else {
    setTimeout(callback, 1)
  }
}

/**
 * 清理事件监听器
 */
export function cleanupEventListeners(
  target: EventTarget,
  eventMap: Map<string, EventListenerOrEventListenerObject>
) {
  eventMap.forEach((listener, event) => {
    target.removeEventListener(event, listener)
  })
  eventMap.clear()
}

/**
 * 创建一次性事件监听器
 */
export function once(
  target: EventTarget,
  event: string,
  callback: EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions
) {
  const wrapper: EventListener = (e) => {
    callback(e)
    target.removeEventListener(event, wrapper, options)
  }

  target.addEventListener(event, wrapper, options)
}
