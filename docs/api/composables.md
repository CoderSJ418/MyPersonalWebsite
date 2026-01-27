# Composables API 参考

本文档提供了 MyPersonalWebsite 项目中所有可组合函数（Composables）的详细 API 参考。

## 概述

Composables 是 Vue 3 Composition API 的核心概念，用于将可复用的状态逻辑提取到独立的函数中。本项目使用 Composables 来管理动画、性能、服务工作者等跨组件逻辑。

## 可用的 Composables

### useScrollAnimations

滚动动画 Composable，用于实现元素进入视口时的动画效果。

**导入**
```typescript
import { useScrollAnimations } from '@/composables/useScrollAnimations'
```

**使用示例**
```typescript
const { observeElement, unobserveElement, cleanup } = useScrollAnimations()

// 观察元素
const element = ref<HTMLElement>()
observeElement(element.value, {
  animationClass: 'fade-in-up',
  threshold: 0.1
})

// 清理
onUnmounted(() => {
  cleanup()
})
```

**API**
- `observeElement(element, options)` - 开始观察元素
  - `element: HTMLElement` - 要观察的 DOM 元素
  - `options: ScrollAnimationOptions` - 动画选项
- `unobserveElement(element)` - 停止观察元素
- `cleanup()` - 清理所有观察器

**类型定义**
```typescript
interface ScrollAnimationOptions {
  animationClass?: string
  threshold?: number
  rootMargin?: string
  once?: boolean
}
```

---

### useGSAPAnimations

GSAP 动画 Composable，提供高性能的动画控制。

**导入**
```typescript
import { useGSAPAnimations } from '@/composables/useGSAPAnimations'
```

**使用示例**
```typescript
const { gsap, timeline, animateElement } = useGSAPAnimations()

// 简单动画
animateElement(element.value, {
  opacity: 0,
  y: 50,
  duration: 0.8
})

// 时间线动画
const tl = timeline()
tl.to(element1.value, { x: 100 })
  .to(element2.value, { y: -50 })
```

**API**
- `gsap` - GSAP 核心对象
- `timeline(options)` - 创建动画时间线
- `animateElement(element, props)` - 对元素应用动画
- `clearAnimations()` - 清除所有动画

**类型定义**
```typescript
interface GSAPAnimationProps {
  [key: string]: any
}
```

---

### usePerformance

性能监控 Composable，用于追踪应用性能指标。

**导入**
```typescript
import { usePerformance } from '@/composables/usePerformance'
```

**使用示例**
```typescript
const { 
  measureRenderTime, 
  measureInteractionTime,
  getMetrics 
} = usePerformance()

// 测量渲染时间
measureRenderTime('page-load', async () => {
  await loadPageData()
})

// 获取性能指标
const metrics = getMetrics()
console.log(metrics.renderTime)
```

**API**
- `measureRenderTime(name, fn)` - 测量渲染时间
- `measureInteractionTime(name, fn)` - 测量交互时间
- `getMetrics()` - 获取所有性能指标
- `resetMetrics()` - 重置性能指标

**类型定义**
```typescript
interface PerformanceMetrics {
  renderTime: number
  interactionTime: number
  memoryUsage: number
  fps: number
}
```

---

### useMobilePerformance

移动端性能优化 Composable。

**导入**
```typescript
import { useMobilePerformance } from '@/composables/useMobilePerformance'
```

**使用示例**
```typescript
const { 
  isMobile,
  optimizeImages,
  lazyLoad 
} = useMobilePerformance()

if (isMobile()) {
  optimizeImages()
  lazyLoad()
}
```

**API**
- `isMobile()` - 检测是否为移动设备
- `optimizeImages()` - 优化移动端图片
- `lazyLoad()` - 启用懒加载
- `reduceAnimations()` - 减少动画效果

---

### useServiceWorker

Service Worker 管理 Composable。

**导入**
```typescript
import { useServiceWorker } from '@/composables/useServiceWorker'
```

**使用示例**
```typescript
const { 
  register, 
  update, 
  getRegistration 
} = useServiceWorker()

// 注册 Service Worker
register('/sw.js')

// 检查更新
const registration = getRegistration()
if (registration) {
  update(registration)
}
```

**API**
- `register(scriptURL)` - 注册 Service Worker
- `update(registration)` - 更新 Service Worker
- `getRegistration()` - 获取当前注册
- `unregister()` - 注销 Service Worker

**类型定义**
```typescript
interface ServiceWorkerRegistration {
  installing: ServiceWorker | null
  waiting: ServiceWorker | null
  active: ServiceWorker | null
}
```

---

### useTouchGestures

触摸手势 Composable，用于移动端交互。

**导入**
```typescript
import { useTouchGestures } from '@/composables/useTouchGestures'
```

**使用示例**
```typescript
const { 
  onSwipe, 
  onPinch, 
  onRotate 
} = useTouchGestures()

onSwipe(element.value, {
  onLeft: () => console.log('Swipe left'),
  onRight: () => console.log('Swipe right')
})
```

**API**
- `onSwipe(element, handlers)` - 滑动手势
- `onPinch(element, handler)` - 缩放手势
- `onRotate(element, handler)` - 旋转手势
- `cleanup()` - 清理所有手势监听器

**类型定义**
```typescript
interface SwipeHandlers {
  onLeft?: () => void
  onRight?: () => void
  onUp?: () => void
  onDown?: () => void
}
```

## 最佳实践

1. **在组件卸载时清理**
```typescript
onUnmounted(() => {
  cleanup()
})
```

2. **使用 TypeScript 类型**
```typescript
const options: ScrollAnimationOptions = {
  animationClass: 'fade-in',
  threshold: 0.2
}
```

3. **性能优化**
- 避免在循环中创建 Composables
- 使用 `once` 选项减少重复计算
- 合理使用 `cleanup()` 释放资源

## 相关资源

- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [VueUse](https://vueuse.org/) - Vue Composition 工具集
- [GSAP 文档](https://greensock.com/docs/)