/**
 * Service Worker - 离线支持和缓存策略
 * 用于提升网站性能和提供离线访问能力
 */

const CACHE_NAME = 'shejie-portfolio-v1'
const RUNTIME_CACHE = 'shejie-runtime-v1'

// 需要预缓存的静态资源
const PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/assets/index.css',
  '/assets/index.js',
  '/vite.svg'
]

// 需要缓存的 API 请求
const CACHEABLE_API_PATTERNS = [
  /^\/api\/projects/,
  /^\/api\/blog/
]

// 需要跳过缓存的 URL 模式
const SKIP_CACHE_PATTERNS = [
  /^\/api\/auth/,
  /^\/admin/
]

/**
 * 安装 Service Worker
 * 预缓存关键资源
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...')

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Precaching app shell')
      return cache.addAll(PRECACHE_URLS)
    })
  )

  // 立即激活新的 Service Worker
  self.skipWaiting()
})

/**
 * 激活 Service Worker
 * 清理旧缓存
 */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...')

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )

  // 立即控制所有客户端
  self.clients.claim()
})

/**
 * 拦截网络请求
 * 实现缓存策略
 */
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // 跳过非 HTTP 请求
  if (!url.protocol.startsWith('http')) {
    return
  }

  // 跳过需要跳过缓存的请求
  if (SKIP_CACHE_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
    return
  }

  // 处理导航请求 (页面请求)
  if (request.mode === 'navigate') {
    event.respondWith(
      handleNavigationRequest(request)
    )
    return
  }

  // 处理 API 请求
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      handleAPIRequest(request)
    )
    return
  }

  // 处理静态资源请求
  event.respondWith(
    handleStaticResourceRequest(request)
  )
})

/**
 * 处理导航请求 (Stale-While-Revalidate 策略)
 */
async function handleNavigationRequest(request) {
  const cache = await caches.open(RUNTIME_CACHE)
  const cachedResponse = await cache.match(request)

  if (cachedResponse) {
    // 后台更新缓存
    fetch(request).then((response) => {
      if (response.ok) {
        cache.put(request, response.clone())
      }
    })
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    // 网络失败，返回离线页面
    const offlineResponse = await cache.match('/offline.html')
    return offlineResponse || new Response('Offline', { status: 503 })
  }
}

/**
 * 处理 API 请求 (Network-First 策略)
 */
async function handleAPIRequest(request) {
  const url = new URL(request.url)

  // 检查是否是可缓存的 API
  const isCacheable = CACHEABLE_API_PATTERNS.some((pattern) => pattern.test(url.pathname))

  if (!isCacheable) {
    return fetch(request)
  }

  try {
    const networkResponse = await fetch(request)

    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    const cache = await caches.open(RUNTIME_CACHE)
    const cachedResponse = await cache.match(request)
    return cachedResponse || new Response(JSON.stringify({ error: 'Network error' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

/**
 * 处理静态资源请求 (Cache-First 策略)
 */
async function handleStaticResourceRequest(request) {
  const cache = await caches.open(CACHE_NAME)
  const cachedResponse = await cache.match(request)

  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    return new Response('Resource not found', { status: 404 })
  }
}

/**
 * 消息处理
 * 用于与主线程通信
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      )
    })
  }
})

/**
 * 后台同步 (可选)
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // 同步数据的逻辑
      Promise.resolve()
    )
  }
})

/**
 * 推送通知 (可选)
 */
self.addEventListener('push', (event) => {
  if (!event.data) {
    return
  }

  const data = event.data.json()
  const options = {
    body: data.body,
    icon: '/vite.svg',
    badge: '/badge.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})