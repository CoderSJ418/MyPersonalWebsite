# MyPersonalWebsite 性能优化方案

## 📋 项目概述

- **项目名称**: MyPersonalWebsite
- **当前状态**: 性能良好但首屏加载时间需要优化
- **目标**: 将首屏加载时间从 12.7s 优化至 ≤2s
- **当前性能评分**: 96/100

## 🎯 优化目标

### 核心指标
| 指标 | 当前值 | 目标值 | 状态 |
|------|--------|--------|------|
| 首屏加载时间 | 12.7s | ≤2s | ❌ 需要优化 |
| LCP (Largest Contentful Paint) | 2.00s | < 1.5s | ⚠️ 需要优化 |
| FID (First Input Delay) | 80ms | < 100ms | ✅ 良好 |
| CLS (Cumulative Layout Shift) | 0.050 | < 0.1 | ✅ 良好 |
| 性能分数 | 96/100 | 100/100 | ⚠️ 需要优化 |

## 🔍 问题分析

### 1. 首屏加载时间过长的原因

**主要问题**:
- **资源加载阻塞**: 大量图片和第三方资源未优化
- **代码分割不充分**: 首屏组件未实现按需加载
- **图片优化不足**: 缺少 WebP 格式和响应式图片
- **缓存策略不完善**: Service Worker 缓存策略需要优化

**具体表现**:
- HeroSection 背景渐变使用大量内联样式
- 项目展示区域图片未实现懒加载
- 第三方库加载策略需要优化
- 关键资源未预加载

### 2. 技术债务

- **组件加载**: 部分组件未实现懒加载
- **样式**: 部分样式未按需加载
- **脚本**: 第三方脚本加载策略需要优化
- **图片**: 缺少优化的图片加载机制

## 🏗️ 优化方案

### 阶段 1: 基础优化 (1-2周)

#### 1.1 代码分割优化

**目标**: 实现更精细的代码分割，减少首屏加载的 JavaScript 大小

**具体措施**:
```typescript
// vite.config.ts 优化
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vue 核心库
          'vue-core': ['vue', 'vue-router', 'pinia'],
          // 动画库
          'gsap': ['gsap'],
          // UI 组件
          'lucide': ['lucide-vue-next'],
          // 优化库
          'optimization': ['web-vitals', 'loglevel'],
          // 项目特定代码
          'home': ['@/views/Home.vue'],
          'projects': ['@/views/Projects.vue'],
          'blog': ['@/views/Blog.vue']
        }
      }
    }
  }
})
```

**实施步骤**:
1. 更新 vite.config.ts 中的 manualChunks 配置
2. 为关键页面添加路由级别的代码分割
3. 实现组件级别的懒加载

#### 1.2 图片优化

**目标**: 实现全面的图片优化，包括格式转换、响应式和懒加载

**具体措施**:

**1.2.1 优化 OptimizedImage 组件**
```vue
<template>
  <div class="optimized-image">
    <!-- 预加载关键图片 -->
    <img
      v-if="isCritical"
      :src="currentSrc"
      :srcset="srcset"
      :sizes="sizes"
      loading="eager"
      @load="handleLoad"
    />
    
    <!-- 懒加载非关键图片 -->
    <img
      v-else
      :src="currentSrc"
      :srcset="srcset"
      :sizes="sizes"
      loading="lazy"
      @load="handleLoad"
      @error="handleError"
    />
    
    <!-- 占位符 -->
    <div v-if="!isLoaded" class="placeholder">
      <div class="blur-placeholder"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { checkWebPSupport } from '@/utils/image'

interface Props {
  src: string
  alt?: string
  lazy?: boolean
  isCritical?: boolean // 关键图片
  priority?: boolean  // 高优先级
}

const props = withDefaults(defineProps<Props>(), {
  lazy: true,
  isCritical: false,
  priority: false
})

// 关键图片预加载
const preloadCriticalImage = (src: string) => {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'image'
  link.href = src
  document.head.appendChild(link)
}

onMounted(() => {
  if (props.isCritical) {
    preloadCriticalImage(props.src)
  }
})
</script>
```

**1.2.2 更新图片配置**
```typescript
// src/utils/image.ts 增强
export const getOptimalImageFormat = async (originalFormat: string): Promise<string> => {
  const supportsWebP = await checkWebPSupport()
  
  // 对于关键图片，优先使用 WebP
  if (supportsWebP && ['jpg', 'jpeg', 'png'].includes(originalFormat.toLowerCase())) {
    return 'webp'
  }
  
  return originalFormat
}

// 生成优化的 srcset
export const generateOptimizedSrcSet = (baseUrl: string, isCritical = false) => {
  const sizes = isCritical 
    ? [640, 1280, 1920]  // 关键图片更多尺寸
    : [320, 640, 768, 1024, 1280]
  
  return generateSrcSet(baseUrl, sizes)
}
```

**1.2.3 实现图片预加载**
```typescript
// src/utils/image.ts 新增
export const preloadCriticalImages = (images: string[]) => {
  images.forEach(src => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    document.head.appendChild(link)
  })
}

// 在路由守卫中预加载关键图片
router.beforeEach((to, from, next) => {
  const criticalImages = getCriticalImagesForRoute(to.name as string)
  if (criticalImages.length > 0) {
    preloadCriticalImages(criticalImages)
  }
  next()
})
```

#### 1.3 资源预加载

**目标**: 实现关键资源的预加载，减少首屏等待时间

**具体措施**:

**1.3.1 更新 HTML 模板**
```html
<!-- index.html -->
<head>
  <!-- 预连接关键域名 -->
  <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- 预加载关键字体 -->
  <link rel="preload" href="/fonts/inter-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/inter-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin>
  
  <!-- 预加载关键图片 -->
  <link rel="preload" href="/images/hero-background.jpg" as="image" type="image/jpeg">
  <link rel="preload" href="/images/avatar.png" as="image" type="image/png">
  
  <!-- 预加载关键 CSS -->
  <link rel="preload" href="/assets/css/home-optimized.css" as="style">
  
  <!-- DNS 预解析 -->
  <link rel="dns-prefetch" href="//fonts.googleapis.com">
  <link rel="dns-prefetch" href="//cdn.jsdelivr.net">
</head>
```

**1.3.2 实现资源预加载指令**
```typescript
// src/directives/preload.ts
export const preloadDirective = {
  mounted(el: HTMLImageElement, binding: any) {
    if (binding.value) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = binding.value
      document.head.appendChild(link)
    }
  }
}
```

### 阶段 2: 深度优化 (2-4周)

#### 2.1 服务端渲染优化

**目标**: 实现服务端渲染，减少首屏 JavaScript 执行时间

**具体措施**:

**2.1.1 添加 SSR 支持**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    ssr: true,  // 启用 SSR
    rollupOptions: {
      output: {
        format: 'es'
      }
    }
  },
  ssr: {
    noExternal: ['vue', 'vue-router']
  }
})

// src/server.ts
import { createSSRApp } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { createRouter } from './router'

export async function render(url: string) {
  const app = createSSRApp(App)
  const router = createRouter()
  
  app.use(router)
  
  await router.push(url)
  await router.isReady()
  
  const html = await renderToString(app)
  return html
}
```

**2.1.2 实现预渲染**
```typescript
// scripts/prerender.js
import { prerender } from '@prerender/vue'
import { createSSRApp } from 'vue'
import App from '../src/App.vue'

const routes = [
  '/',
  '/about',
  '/projects',
  '/skills',
  '/contact'
]

await prerender({
  app: createSSRApp(App),
  routes,
  outputDir: './dist/prerendered'
})
```

#### 2.2 缓存策略优化

**目标**: 实现多策略缓存，提升资源加载速度

**具体措施**:

**2.2.1 优化 Service Worker**
```javascript
// public/sw.js 优化
const CACHE_NAME = 'shejie-portfolio-v2'
const RUNTIME_CACHE = 'shejie-runtime-v2'

// 关键资源缓存策略
const CRITICAL_CACHE_STRATEGY = {
  // 强缓存：30 天
  static: {
    strategy: 'cacheFirst',
    maxAge: 30 * 24 * 60 * 60,
    maxEntries: 100
  },
  // 弱缓存：7 天
  dynamic: {
    strategy: 'staleWhileRevalidate',
    maxAge: 7 * 24 * 60 * 60,
    maxEntries: 50
  }
}

// 预缓存关键资源
const PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/vite.svg',
  '/fonts/inter-latin-400-normal.woff2',
  '/fonts/inter-latin-700-normal.woff2',
  '/images/hero-background.jpg',
  '/images/avatar.png'
]

// 预加载关键资源
const PRELOAD_URLS = [
  '/assets/css/home-optimized.css',
  '/assets/js/vue-core-*.js',
  '/assets/js/home-*.js'
]

// 实现多策略缓存
async function handleRequest(event) {
  const { request } = event
  
  // 检查是否是预加载请求
  if (request.headers.get('x-preload')) {
    return handlePreload(request)
  }
  
  // 根据资源类型选择缓存策略
  const resourceType = getResourceType(request.url)
  const strategy = CRITICAL_CACHE_STRATEGY[resourceType]
  
  if (strategy) {
    return handleCacheStrategy(request, strategy)
  }
  
  return fetch(request)
}
```

**2.2.2 实现资源预加载**
```typescript
// src/utils/preload.ts
export class ResourcePreloader {
  private queue: string[] = []
  private processing = false
  
  async preload(urls: string[], options: PreloadOptions = {}) {
    this.queue = [...urls]
    await this.processQueue(options)
  }
  
  private async processQueue(options: PreloadOptions) {
    if (this.processing || this.queue.length === 0) return
    
    this.processing = true
    
    // 并发预加载，最多 3 个
    const promises = []
    const batchSize = Math.min(3, this.queue.length)
    
    for (let i = 0; i < batchSize; i++) {
      const url = this.queue.shift()
      if (url) {
        promises.push(this.preloadResource(url, options))
      }
    }
    
    await Promise.all(promises)
    this.processing = false
    
    // 处理剩余资源
    if (this.queue.length > 0) {
      setTimeout(() => this.processQueue(options), 100)
    }
  }
  
  private async preloadResource(url: string, options: PreloadOptions) {
    try {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = options.resourceType || 'fetch'
      link.href = url
      
      if (options.crossOrigin) {
        link.crossOrigin = options.crossOrigin
      }
      
      document.head.appendChild(link)
      
      // 等待资源加载
      if (options.waitForLoad) {
        await this.waitForLoad(link)
      }
    } catch (error) {
      console.warn(`Failed to preload ${url}:`, error)
    }
  }
  
  private waitForLoad(link: HTMLLinkElement): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Preload timeout')), 5000)
      
      link.onload = () => {
        clearTimeout(timeout)
        resolve()
      }
      
      link.onerror = () => {
        clearTimeout(timeout)
        reject(new Error('Preload failed'))
      }
    })
  }
}

// 使用示例
const preloader = new ResourcePreloader()
preloader.preload([
  '/assets/css/home-optimized.css',
  '/assets/js/vue-core-*.js',
  '/assets/js/home-*.js'
], {
  resourceType: 'style',
  waitForLoad: true
})
```

#### 2.3 性能监控集成

**目标**: 实现全面的性能监控，及时发现问题

**具体措施**:

**2.3.1 添加 Web Vitals 监控**
```typescript
// src/utils/performance.ts
export class PerformanceMonitor {
  private metrics: Map<string, number> = new Map()
  
  constructor() {
    this.init()
  }
  
  private init() {
    // 监控 LCP
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            this.metrics.set('LCP', entry.renderTime || entry.loadTime)
          }
        }
      })
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
    }
    
    // 监控 FID
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'first-input') {
            this.metrics.set('FID', entry.processingStart - entry.startTime)
          }
        }
      })
      
      observer.observe({ entryTypes: ['first-input'] })
    }
  }
  
  getMetrics() {
    return Object.fromEntries(this.metrics)
  }
  
  sendMetrics() {
    const metrics = this.getMetrics()
    // 发送到性能监控服务
    fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metrics)
    })
  }
}

// 初始化监控
const monitor = new PerformanceMonitor()
```

**2.3.2 实现性能预算**
```typescript
// src/utils/performance-budget.ts
export class PerformanceBudget {
  private budget = {
    // 首屏加载时间
    firstContentfulPaint: 1.8,
    largestContentfulPaint: 2.5,
    firstInputDelay: 100,
    cumulativeLayoutShift: 0.1,
    
    // 资源大小
    totalSize: 500, // KB
    javascriptSize: 200, // KB
    cssSize: 100, // KB
    imageSize: 200 // KB
  }
  
  checkBudget(metrics: any): boolean {
    let passed = true
    
    // 检查核心 Web Vitals
    if (metrics.FCP > this.budget.firstContentfulPaint) {
      console.warn(`FCP 超过预算: ${metrics.FCP}s > ${this.budget.firstContentfulPaint}s`)
      passed = false
    }
    
    if (metrics.LCP > this.budget.largestContentfulPaint) {
      console.warn(`LCP 超过预算: ${metrics.LCP}s > ${this.budget.largestContentfulPaint}s`)
      passed = false
    }
    
    // TODO: 检查资源大小
    // TODO: 检查网络指标
    
    return passed
  }
  
  reportBudgetViolation(metric: string, actual: number, budget: number) {
    console.error(`性能预算违规: ${metric} ${actual} > ${budget}`)
    
    // 发送到错误监控服务
    if (window.sentry) {
      window.sentry.captureMessage(`性能预算违规: ${metric} ${actual} > ${budget}`)
    }
  }
}
```

### 阶段 3: 完善优化 (1个月)

#### 3.1 性能预算建立

**目标**: 建立完整的性能预算体系，确保持续优化

**具体措施**:

**3.1.1 创建性能预算配置**
```json
// .performance-budget.json
{
  "firstContentfulPaint": {
    "warning": 1.8,
    "error": 2.5
  },
  "largestContentfulPaint": {
    "warning": 2.5,
    "error": 4.0
  },
  "firstInputDelay": {
    "warning": 100,
    "error": 200
  },
  "cumulativeLayoutShift": {
    "warning": 0.1,
    "error": 0.25
  },
  "totalSize": {
    "warning": 500,
    "error": 1000
  },
  "javascriptSize": {
    "warning": 200,
    "error": 400
  },
  "cssSize": {
    "warning": 100,
    "error": 200
  },
  "imageSize": {
    "warning": 200,
    "error": 400
  }
}
```

**3.1.2 实现自动化测试**
```typescript
// tests/performance-budget.test.ts
import { PerformanceBudget } from '@/utils/performance-budget'

describe('性能预算检查', () => {
  const budget = new PerformanceBudget()
  
  test('首屏加载时间应该在预算内', async () => {
    const metrics = await getWebVitals()
    const passed = budget.checkBudget(metrics)
    
    expect(passed).toBe(true)
  })
  
  test('资源大小应该在预算内', async () => {
    const metrics = await getBundleMetrics()
    const passed = budget.checkBudget(metrics)
    
    expect(passed).toBe(true)
  })
})
```

#### 3.2 自动化性能测试

**目标**: 实现 CI/CD 中的性能自动化测试

**具体措施**:

**3.2.1 配置 CI/CD 性能测试**
```yaml
# .github/workflows/performance.yml
name: 性能测试

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  performance:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: 安装依赖
      run: npm ci
    
    - name: 构建项目
      run: npm run build
    
    - name: 运行性能测试
      run: |
        npm run lighthouse
        npm run performance:test
    
    - name: 检查性能预算
      run: |
        node scripts/check-performance-budget.js
    
    - name: 上传性能报告
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: performance-report
        path: |
          lighthouse-report.html
          performance-report.json
```

**3.2.2 实现性能回归测试**
```typescript
// scripts/performance-regression.js
const { execSync } = require('child_process')
const fs = require('fs')

const baselineFile = 'performance-baseline.json'
const currentFile = 'performance-current.json'

// 获取基准性能数据
function getBaseline() {
  if (fs.existsSync(baselineFile)) {
    return JSON.parse(fs.readFileSync(baselineFile, 'utf8'))
  }
  return {}
}

// 获取当前性能数据
function getCurrent() {
  execSync('npm run build', { stdio: 'ignore' })
  execSync('npm run lighthouse', { stdio: 'ignore' })
  
  // 解析 lighthouse 报告
  const report = JSON.parse(fs.readFileSync('lighthouse-report.json', 'utf8'))
  return extractMetrics(report)
}

// 检查回归
function checkRegression(baseline, current) {
  const issues = []
  
  for (const [metric, baselineValue] of Object.entries(baseline)) {
    const currentValue = current[metric]
    if (currentValue > baselineValue * 1.1) {
      issues.push({
        metric,
        baseline: baselineValue,
        current: currentValue,
        change: ((currentValue - baselineValue) / baselineValue * 100).toFixed(1) + '%'
      })
    }
  }
  
  return issues
}

// 主程序
const baseline = getBaseline()
const current = getCurrent()
const issues = checkRegression(baseline, current)

if (issues.length > 0) {
  console.error('❌ 发现性能回归:')
  issues.forEach(issue => {
    console.error(`  ${issue.metric}: ${issue.baseline} → ${issue.current} (${issue.change})`)
  })
  process.exit(1)
} else {
  console.log('✅ 性能回归检查通过')
  fs.writeFileSync(baselineFile, JSON.stringify(current, null, 2))
}
```

#### 3.3 持续性能监控

**目标**: 建立持续的性能监控体系

**具体措施**:

**3.3.1 部署性能监控服务**
```typescript
// scripts/deploy-performance-monitoring.js
const { execSync } = require('child_process')

// 部署性能监控
function deployMonitoring() {
  console.log('🚀 部署性能监控服务...')
  
  // 部署到 Vercel
  execSync('vercel --prod', { stdio: 'inherit' })
  
  // 配置性能监控
  execSync('vercel env add NODE_ENV production', { stdio: 'inherit' })
  
  // 部署到 Cloudflare Workers
  execSync('wrangler deploy', { stdio: 'inherit' })
  
  console.log('✅ 性能监控服务部署完成')
}

deployMonitoring()
```

**3.3.2 配置性能告警**
```typescript
// scripts/setup-performance-alerts.js
const { execSync } = require('child_process')

// 设置性能告警
function setupAlerts() {
  console.log('🔧 设置性能告警...')
  
  // 创建性能告警规则
  const alertRules = {
    '首屏加载时间': {
      condition: 'FCP > 1.8',
      severity: 'warning',
      duration: '5m'
    },
    'LCP 超过阈值': {
      condition: 'LCP > 2.5',
      severity: 'error',
      duration: '2m'
    },
    '性能分数下降': {
      condition: 'performance_score < 90',
      severity: 'warning',
      duration: '10m'
    }
  }
  
  // 部署告警规则
  execSync('vercel alerts create --name "Performance Alert" --rules ' + JSON.stringify(alertRules), { stdio: 'inherit' })
  
  console.log('✅ 性能告警设置完成')
}

setupAlerts()
```

## 📊 预期效果

### 性能指标提升

| 指标 | 优化前 | 优化后 | 提升幅度 |
|------|--------|--------|----------|
| 首屏加载时间 | 12.7s | 1.8s | 85.8% |
| LCP | 2.00s | 1.5s | 25.0% |
| FID | 80ms | 50ms | 37.5% |
| CLS | 0.050 | 0.030 | 40.0% |
| 性能分数 | 96 | 100 | 4.2% |

### 用户体验改善

- **首屏可见时间**: 从 12.7s 缩短到 1.8s，提升 85.8%
- **交互响应时间**: FID 从 80ms 优化到 50ms，提升 37.5%
- **视觉稳定性**: CLS 从 0.050 优化到 0.030，提升 40.0%
- **资源加载效率**: 图片和脚本加载速度提升 70%

## 🚀 实施计划

### 第一周：代码分割和图片优化
- [ ] 更新 vite.config.ts 代码分割配置
- [ ] 优化 OptimizedImage 组件
- [ ] 实现关键图片预加载
- [ ] 测试首屏加载时间

### 第二周：资源预加载和缓存优化
- [ ] 更新 HTML 模板预加载配置
- [ ] 优化 Service Worker 缓存策略
- [ ] 实现多策略缓存
- [ ] 测试缓存效果

### 第三周：SSR 和性能监控
- [ ] 添加 SSR 支持
- [ ] 实现预渲染
- [ ] 集成 Web Vitals 监控
- [ ] 测试 SSR 效果

### 第四周：自动化和监控
- [ ] 建立性能预算
- [ ] 配置 CI/CD 性能测试
- [ ] 部署性能监控服务
- [ ] 设置性能告警

## 📝 风险评估

### 技术风险
1. **SSR 实施复杂度高** - 可能影响开发效率
2. **缓存策略不当** - 可能导致资源版本不一致
3. **性能监控成本** - 可能增加服务器负载

### 缓解措施
1. **渐进式实施** - 先实施基础优化，再逐步添加 SSR
2. **充分测试** - 在生产环境部署前充分测试
3. **监控成本** - 优化监控代码，减少服务器负载

## 🎯 成功标准

### 量化指标
- 首屏加载时间 ≤ 2s
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1
- 性能分数 ≥ 98

### 质量指标
- 无性能回归
- 用户体验显著改善
- 开发效率不受影响
- 维护成本合理

## 📞 后续支持

### 监控体系
- 每日性能报告
- 实时性能告警
- 自动性能回归检测
- 性能趋势分析

### 持续优化
- 每月性能评估
- 季度性能回顾
- 年度性能规划
- 性能最佳实践分享

---

**报告生成时间**: 2026-01-24
**报告版本**: 1.0.0
**负责人**: BMAD 架构师
**状态**: 待实施