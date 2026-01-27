# Utils API 参考

本文档提供了 MyPersonalWebsite 项目中所有工具函数的详细 API 参考。

## 概述

Utils 目录包含各种工具函数，用于处理日志、性能监控、错误追踪、SEO 优化等通用功能。

## 可用的 Utils 模块

### logger.ts

日志工具模块，提供统一的日志记录功能。

**导入**
```typescript
import { logger } from '@/utils/logger'
```

**使用示例**
```typescript
// 基本日志
logger.info('Application started')
logger.warn('Deprecated API used')
logger.error('Failed to fetch data')

// 带上下文
logger.info('User action', { action: 'click', element: 'button' })

// 性能日志
logger.performance('renderTime', 150)
```

**API**
```typescript
interface Logger {
  // 信息日志
  info(message: string, context?: any): void
  
  // 警告日志
  warn(message: string, context?: any): void
  
  // 错误日志
  error(message: string, error?: Error, context?: any): void
  
  // 调试日志
  debug(message: string, context?: any): void
  
  // 性能日志
  performance(metric: string, value: number, unit?: string): void
  
  // 设置日志级别
  setLevel(level: 'debug' | 'info' | 'warn' | 'error'): void
}
```

**配置**
```typescript
// 设置日志级别
logger.setLevel('debug')

// 添加自定义处理器
logger.addHandler((level, message, context) => {
  // 自定义处理逻辑
})
```

---

### performance.ts

性能监控工具模块。

**导入**
```typescript
import { performanceMonitor } from '@/utils/performance'
```

**使用示例**
```typescript
// 测量函数执行时间
const result = await performanceMonitor.measure('fetchData', async () => {
  return await fetchData()
})

// 标记性能点
performanceMonitor.mark('page-start')
// ... 执行代码
performanceMonitor.mark('page-end')
const duration = performanceMonitor.measure('page-load', 'page-start', 'page-end')

// 获取性能指标
const metrics = performanceMonitor.getMetrics()
```

**API**
```typescript
interface PerformanceMonitor {
  // 测量函数执行时间
  measure<T>(name: string, fn: () => T): T
  
  // 测量异步函数执行时间
  measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T>
  
  // 标记性能点
  mark(name: string): void
  
  // 测量两个标记之间的时间
  measure(name: string, startMark: string, endMark: string): number
  
  // 获取所有性能指标
  getMetrics(): PerformanceMetrics
  
  // 清除性能标记
  clearMarks(): void
  
  // 重置性能监控
  reset(): void
}
```

---

### analytics.ts

分析工具模块，用于追踪用户行为和应用指标。

**导入**
```typescript
import { analytics } from '@/utils/analytics'
```

**使用示例**
```typescript
// 追踪页面浏览
analytics.trackPageView('/home')

// 追踪事件
analytics.trackEvent('button-click', {
  buttonId: 'submit',
  page: '/contact'
})

// 追踪用户属性
analytics.setUserProperties({
  plan: 'premium',
  signupDate: '2026-01-01'
})
```

**API**
```typescript
interface Analytics {
  // 追踪页面浏览
  trackPageView(path: string, properties?: any): void
  
  // 追踪事件
  trackEvent(eventName: string, properties?: any): void
  
  // 追踪错误
  trackError(error: Error, context?: any): void
  
  // 设置用户属性
  setUserProperties(properties: any): void
  
  // 识别用户
  identify(userId: string, traits?: any): void
  
  // 重置用户会话
  reset(): void
}
```

---

### errorTracking.ts

错误追踪工具模块。

**导入**
```typescript
import { errorTracker } from '@/utils/errorTracking'
```

**使用示例**
```typescript
// 捕获错误
try {
  // 可能出错的代码
} catch (error) {
  errorTracker.captureException(error)
}

// 捕获消息
errorTracker.captureMessage('Custom error message')

// 设置用户上下文
errorTracker.setUser({
  id: '123',
  email: 'user@example.com'
})
```

**API**
```typescript
interface ErrorTracker {
  // 捕获异常
  captureException(error: Error, context?: any): void
  
  // 捕获消息
  captureMessage(message: string, level?: 'info' | 'warning' | 'error'): void
  
  // 设置用户上下文
  setUser(user: User): void
  
  // 设置标签
  setTag(key: string, value: string): void
  
  // 设置额外上下文
  setContext(key: string, context: any): void
  
  // 添加面包屑
  addBreadcrumb(breadcrumb: Breadcrumb): void
}
```

---

### image.ts

图片处理工具模块。

**导入**
```typescript
import { imageUtils } from '@/utils/image'
```

**使用示例**
```typescript
// 优化图片 URL
const optimizedUrl = imageUtils.optimizeUrl('/images/photo.jpg', {
  width: 800,
  quality: 80,
  format: 'webp'
})

// 懒加载图片
imageUtils.lazyLoadImages()

// 检测 WebP 支持
const supportsWebP = await imageUtils.supportsWebP()
```

**API**
```typescript
interface ImageUtils {
  // 优化图片 URL
  optimizeUrl(url: string, options: ImageOptions): string
  
  // 懒加载图片
  lazyLoadImages(container?: HTMLElement): void
  
  // 检测 WebP 支持
  supportsWebP(): Promise<boolean>
  
  // 预加载图片
  preloadImage(url: string): Promise<HTMLImageElement>
  
  // 获取图片尺寸
  getImageDimensions(url: string): Promise<{ width: number; height: number }>
}
```

---

### seo.ts

SEO 优化工具模块。

**导入**
```typescript
import { seo } from '@/utils/seo'
```

**使用示例**
```typescript
// 设置页面标题
seo.setTitle('My Personal Website - Vue Developer')

// 设置页面描述
seo.setDescription('Portfolio of a Vue.js developer with 7 years of experience')

// 设置 Open Graph 标签
seo.setOpenGraph({
  title: 'My Personal Website',
  description: 'Portfolio website',
  image: '/og-image.jpg',
  url: 'https://mywebsite.com'
})

// 设置结构化数据
seo.setStructuredData({
  '@type': 'Person',
  name: 'She Jie',
  jobTitle: 'Frontend Developer'
})
```

**API**
```typescript
interface SEO {
  // 设置页面标题
  setTitle(title: string): void
  
  // 设置页面描述
  setDescription(description: string): void
  
  // 设置关键词
  setKeywords(keywords: string[]): void
  
  // 设置规范链接
  setCanonical(url: string): void
  
  // 设置 Open Graph 标签
  setOpenGraph(og: OpenGraphProps): void
  
  // 设置 Twitter 卡片
  setTwitterCard(card: TwitterCardProps): void
  
  // 设置结构化数据
  setStructuredData(data: any): void
  
  // 移除所有 SEO 标签
  clear(): void
}
```

---

### search.ts

搜索工具模块。

**导入**
```typescript
import { searchUtils } from '@/utils/search'
```

**使用示例**
```typescript
// 模糊搜索
const results = searchUtils.fuzzySearch(
  ['Vue.js', 'React', 'Angular'],
  'vue'
)

// 高亮匹配文本
const highlighted = searchUtils.highlight(
  'This is a Vue.js tutorial',
  ['Vue.js']
)

// 计算相似度
const similarity = searchUtils.calculateSimilarity(
  'Vue.js',
  'VueJS'
)
```

**API**
```typescript
interface SearchUtils {
  // 模糊搜索
  fuzzySearch<T>(items: T[], query: string, key?: string): T[]
  
  // 高亮匹配文本
  highlight(text: string, keywords: string[]): string
  
  // 计算相似度
  calculateSimilarity(str1: string, str2: string): number
  
  // 分词
  tokenize(text: string): string[]
  
  // 提取关键词
  extractKeywords(text: string, count?: number): string[]
}
```

---

### monitoring.ts

监控工具模块。

**导入**
```typescript
import { monitoring } from '@/utils/monitoring'
```

**使用示例**
```typescript
// 记录指标
monitoring.recordMetric('page-load-time', 1200)

// 记录事件
monitoring.recordEvent('user-signup', {
  method: 'email',
  source: 'homepage'
})

// 检查健康状态
const health = await monitoring.checkHealth()
```

**API**
```typescript
interface Monitoring {
  // 记录指标
  recordMetric(name: string, value: number, tags?: Record<string, string>): void
  
  // 记录事件
  recordEvent(name: string, properties?: any): void
  
  // 检查健康状态
  checkHealth(): Promise<HealthStatus>
  
  // 获取系统信息
  getSystemInfo(): SystemInfo
  
  // 获取性能指标
  getPerformanceMetrics(): PerformanceMetrics
}
```

---

### uptime.ts

正常运行时间监控工具模块。

**导入**
```typescript
import { uptime } from '@/utils/uptime'
```

**使用示例**
```typescript
// 检查服务状态
const status = await uptime.checkService('https://api.example.com')

// 获取历史数据
const history = await uptime.getHistory('api.example.com')

// 设置告警
uptime.setAlert('api.example.com', {
  threshold: 5000,
  callback: (status) => console.log('Alert:', status)
})
```

**API**
```typescript
interface Uptime {
  // 检查服务状态
  checkService(url: string): Promise<ServiceStatus>
  
  // 获取历史数据
  getHistory(service: string, period?: 'hour' | 'day' | 'week'): Promise<UptimeHistory[]>
  
  // 设置告警
  setAlert(service: string, config: AlertConfig): void
  
  // 移除告警
  removeAlert(service: string): void
  
  // 获取所有服务状态
  getAllServices(): Promise<ServiceStatus[]>
}
```

## 最佳实践

1. **统一使用工具函数**
```typescript
// 推荐
logger.info('User logged in')

// 不推荐
console.log('User logged in')
```

2. **错误处理**
```typescript
try {
  const result = await fetchData()
  logger.info('Data fetched successfully')
} catch (error) {
  errorTracker.captureException(error)
  logger.error('Failed to fetch data', error)
}
```

3. **性能监控**
```typescript
const result = await performanceMonitor.measureAsync('heavy-operation', async () => {
  return await performHeavyOperation()
})
```

## 相关资源

- [Vue 3 工具函数](https://vuejs.org/guide/reusability/composables.html#utility-functions)
- [Web Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [SEO 最佳实践](https://developers.google.com/search/docs)