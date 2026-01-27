/**
 * 性能优化配置
 * @description 定义性能优化相关的配置和工具函数
 */

/**
 * 性能目标（MVP 阶段）
 */
export const PERFORMANCE_TARGETS = {
  // 首屏加载时间
  firstContentfulPaint: 1500, // ms
  largestContentfulPaint: 2500, // ms
  firstInputDelay: 300, // ms
  cumulativeLayoutShift: 0.15,
  timeToInteractive: 3500, // ms
  totalBlockingTime: 300, // ms

  // 资源加载
  maxBundleSize: 250, // KB
  maxChunkSize: 100, // KB
  imageOptimization: {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 85,
    formats: ['webp', 'avif', 'jpeg']
  },

  // 缓存策略
  cacheStrategy: {
    staticAssets: '1y', // 1 年
    html: '1h', // 1 小时
    api: '5m' // 5 分钟
  }
}

/**
 * 性能目标（迭代阶段）
 */
export const PERFORMANCE_TARGETS_ITERATION = {
  // 首屏加载时间
  firstContentfulPaint: 1200, // ms
  largestContentfulPaint: 2000, // ms
  firstInputDelay: 200, // ms
  cumulativeLayoutShift: 0.1,
  timeToInteractive: 3000, // ms
  totalBlockingTime: 200, // ms

  // 资源加载
  maxBundleSize: 200, // KB
  maxChunkSize: 80, // KB
  imageOptimization: {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 80,
    formats: ['webp', 'avif', 'jpeg']
  },

  // 缓存策略
  cacheStrategy: {
    staticAssets: '1y', // 1 年
    html: '1h', // 1 小时
    api: '5m' // 5 分钟
  }
}

/**
 * 预加载资源列表
 */
export const PRELOAD_RESOURCES = [
  // 核心库
  { type: 'script', href: '/assets/js/vue-core.js' },
  { type: 'script', href: '/assets/js/pinia.js' },
  { type: 'script', href: '/assets/js/vue-router.js' },

  // 关键样式
  { type: 'style', href: '/assets/css/main.css' },

  // 字体
  { type: 'font', href: '/assets/fonts/inter.woff2' },
  { type: 'font', href: '/assets/fonts/jetbrains-mono.woff2' }
]

/**
 * 预取资源列表
 */
export const PREFETCH_RESOURCES = [
  // 页面路由
  { type: 'script', href: '/assets/js/blog.js' },
  { type: 'script', href: '/assets/js/projects.js' },
  { type: 'script', href: '/assets/js/skills.js' },

  // 非核心库
  { type: 'script', href: '/assets/js/gsap.js' },
  { type: 'script', href: '/assets/js/vendor.js' }
]

/**
 * 图片优化配置
 */
export const IMAGE_OPTIMIZATION = {
  // 响应式断点
  breakpoints: [640, 768, 1024, 1280, 1536],

  // 懒加载配置
  lazyLoad: {
    rootMargin: '200px', // 提前 200px 加载
    threshold: 0.1 // 10% 可见时加载
  },

  // 占位符配置
  placeholder: {
    color: '#E5E7EB',
    blur: 20 // 模糊度
  },

  // 格式优先级
  formatPriority: ['avif', 'webp', 'jpeg', 'png']
}

/**
 * 缓存策略配置
 */
export const CACHE_STRATEGY = {
  // 静态资源（JS、CSS、字体等）
  static: {
    pattern: /\.(js|css|woff|woff2|ttf|eot)$/,
    maxAge: 31536000, // 1 年
    immutable: true
  },

  // 图片资源
  images: {
    pattern: /\.(jpg|jpeg|png|gif|webp|avif|svg)$/,
    maxAge: 2592000, // 30 天
    immutable: false
  },

  // HTML 文件
  html: {
    pattern: /\.html$/,
    maxAge: 3600, // 1 小时
    immutable: false
  },

  // API 请求
  api: {
    pattern: /\/api\//,
    maxAge: 300, // 5 分钟
    immutable: false
  }
}

/**
 * 代码分割策略
 */
export const CODE_SPLITTING_STRATEGY = {
  // 路由级别分割
  routes: true,

  // 组件级别分割
  components: {
    threshold: 10, // KB，大于此值自动分割
    include: ['BlogCard', 'ProjectCard', 'DesignSettings']
  },

  // 第三方库分割
  vendors: {
    vue: ['vue', '@vue/runtime-core'],
    router: ['vue-router'],
    state: ['pinia'],
    animation: ['gsap'],
    icons: ['lucide-vue-next'],
    utils: ['web-vitals', 'loglevel']
  }
}

/**
 * 懒加载配置
 */
export const LAZY_LOADING_CONFIG = {
  // 图片懒加载
  images: {
    enabled: true,
    rootMargin: '200px',
    threshold: 0.1
  },

  // 路由懒加载
  routes: {
    enabled: true,
    prefetch: true // 预取可能访问的路由
  },

  // 组件懒加载
  components: {
    enabled: true,
    threshold: 10 // KB
  }
}

/**
 * Service Worker 配置
 */
export const SERVICE_WORKER_CONFIG = {
  enabled: true,
  cacheName: 'my-personal-website-v1',
  precache: [
    '/',
    '/index.html',
    '/assets/css/main.css',
    '/assets/js/vue-core.js',
    '/assets/js/pinia.js',
    '/assets/js/vue-router.js'
  ],
  runtimeCache: [
    {
      urlPattern: /\.(jpg|jpeg|png|gif|webp|avif)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 2592000 // 30 天
        }
      }
    },
    {
      urlPattern: /\.(js|css)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-cache'
      }
    }
  ]
}

/**
 * 性能监控配置
 */
export const PERFORMANCE_MONITORING = {
  enabled: true,

  // Web Vitals 监控
  webVitals: {
    enabled: true,
    metrics: ['FCP', 'LCP', 'FID', 'CLS', 'TTFB', 'TBT'],
    reportThreshold: {
      FCP: 1800, // ms
      LCP: 2500, // ms
      FID: 100, // ms
      CLS: 0.1,
      TTFB: 800, // ms
      TBT: 300 // ms
    }
  },

  // 资源加载监控
  resourceTiming: {
    enabled: true,
    sampleRate: 0.1 // 10% 采样率
  },

  // 错误监控
  errorTracking: {
    enabled: true,
    sampleRate: 1.0 // 100% 采样率
  }
}

/**
 * 获取当前环境的性能目标
 */
export function getPerformanceTargets(): typeof PERFORMANCE_TARGETS {
  // 检查是否处于迭代阶段（通过环境变量或其他方式）
  const isIteration = import.meta.env.VITE_PERFORMANCE_MODE === 'iteration'

  return isIteration ? PERFORMANCE_TARGETS_ITERATION : PERFORMANCE_TARGETS
}

/**
 * 检查性能指标是否达标
 */
export function checkPerformanceMetrics(metrics: Record<string, number>): {
  passed: boolean
  details: Record<string, { actual: number; target: number; passed: boolean }>
} {
  const targets = getPerformanceTargets()
  const details: Record<string, { actual: number; target: number; passed: boolean }> = {}
  let passed = true

  // 检查 FCP
  if (metrics.fcp !== undefined) {
    const fcpPassed = metrics.fcp <= targets.firstContentfulPaint
    details.fcp = {
      actual: metrics.fcp,
      target: targets.firstContentfulPaint,
      passed: fcpPassed
    }
    passed = passed && fcpPassed
  }

  // 检查 LCP
  if (metrics.lcp !== undefined) {
    const lcpPassed = metrics.lcp <= targets.largestContentfulPaint
    details.lcp = {
      actual: metrics.lcp,
      target: targets.largestContentfulPaint,
      passed: lcpPassed
    }
    passed = passed && lcpPassed
  }

  // 检查 CLS
  if (metrics.cls !== undefined) {
    const clsPassed = metrics.cls <= targets.cumulativeLayoutShift
    details.cls = {
      actual: metrics.cls,
      target: targets.cumulativeLayoutShift,
      passed: clsPassed
    }
    passed = passed && clsPassed
  }

  // 检查 FID
  if (metrics.fid !== undefined) {
    const fidPassed = metrics.fid <= targets.firstInputDelay
    details.fid = {
      actual: metrics.fid,
      target: targets.firstInputDelay,
      passed: fidPassed
    }
    passed = passed && fidPassed
  }

  return { passed, details }
}

/**
 * 生成性能报告
 */
export function generatePerformanceReport(metrics: Record<string, number>): string {
  const { passed, details } = checkPerformanceMetrics(metrics)

  let report = '性能测试报告\n'
  report += '='.repeat(50) + '\n\n'

  report += `总体结果: ${passed ? '✅ 通过' : '❌ 未通过'}\n\n`

  report += '详细指标:\n'
  for (const [key, value] of Object.entries(details)) {
    const status = value.passed ? '✅' : '❌'
    report += `${status} ${key.toUpperCase()}: ${value.actual}ms (目标: ${value.target}ms)\n`
  }

  return report
}
