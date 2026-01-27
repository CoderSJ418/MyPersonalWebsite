# 交互式效果增强架构设计文档

**项目名称：** MyPersonalWebsite 交互式效果增强
**创建日期：** 2026年1月22日
**版本：** v1.0
**负责人：** 佘杰

---

## 1. 架构概述

### 1.1 设计原则

- **组件化：** 每个交互效果独立成组件，易于复用和维护
- **性能优先：** 使用 requestAnimationFrame、对象池、虚拟滚动等技术
- **渐进增强：** 基础功能优先，高级效果可选
- **响应式：** 完美适配桌面端、平板、手机
- **可访问性：** 遵循 WCAG 2.1 AA 标准，支持 `prefers-reduced-motion`

### 1.2 技术架构

```
┌─────────────────────────────────────────────────────────┐
│                      视图层 (View)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ Custom   │  │ Particle  │  │ Scroll   │  │ Page     │ │
│  │ Cursor   │  │ Background│  │ Progress │  │ Transition│ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                   业务逻辑层 (Logic)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │useCursor │  │useParticle│ │useScroll  │ │usePage    │ │
│  │          │  │          │  │Progress  │ │Transition│ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                   动画引擎层 (Animation)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │   GSAP   │  │  Canvas  │  │   CSS    │              │
│  │   3.14   │  │   2D API │  │Transform │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                   工具层 (Utils)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Performance │  │  Accessibility │  │  Device     │ │
│  │  Monitor     │  │  Utils         │  │  Detection │ │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
```

---

## 2. 目录结构

```
src/
├── components/
│   ├── interactive/
│   │   ├── CustomCursor.vue          # 自定义光标组件
│   │   ├── ParticleBackground.vue    # 粒子背景组件
│   │   ├── ScrollProgressBar.vue    # 滚动进度条
│   │   ├── Card3D.vue                # 3D 卡片组件
│   │   ├── MagneticButton.vue        # 磁性按钮组件
│   │   └── PageTransition.vue        # 页面转场组件
│   └── ...
├── composables/
│   ├── useCursor.ts                  # 光标逻辑
│   ├── useParticleSystem.ts          # 粒子系统
│   ├── useScrollProgress.ts          # 滚动进度
│   ├── useCard3D.ts                  # 3D 卡片逻辑
│   ├── useMagneticButton.ts          # 磁性按钮逻辑
│   └── usePageTransition.ts          # 页面转场逻辑
├── utils/
│   ├── performance.ts                # 性能工具
│   ├── accessibility.ts              # 可访问性工具
│   └── deviceDetection.ts           # 设备检测
├── design-system/
│   └── tokens/
│       └── interactive.ts            # 交互式效果 tokens
└── stores/
    └── interactive.ts                # 交互式效果状态管理
```

---

## 3. 核心模块设计

### 3.1 自定义光标系统

#### 3.1.1 组件设计

**文件：** `src/components/interactive/CustomCursor.vue`

**功能：**
- 跟随鼠标移动
- 悬停变形
- 点击涟漪效果
- 样式切换

**Props：**
```typescript
interface CustomCursorProps {
  size?: number              // 光标大小
  color?: string             // 光标颜色
  hoverSize?: number         // 悬停时大小
  hoverColor?: string        // 悬停时颜色
  enableRipple?: boolean     // 是否启用涟漪效果
  style?: 'dot' | 'arrow' | 'cross'  // 光标样式
}
```

**Emits：**
```typescript
interface CustomCursorEmits {
  click: [event: MouseEvent]  // 点击事件
  hover: [element: Element]   // 悬停事件
}
```

#### 3.1.2 Composable 设计

**文件：** `src/composables/useCursor.ts`

**API：**
```typescript
interface CursorPosition {
  x: number
  y: number
}

interface UseCursorReturn {
  position: Ref<CursorPosition>
  isHovering: Ref<boolean>
  hoverElement: Ref<Element | null>
  updatePosition: (x: number, y: number) => void
  setHover: (element: Element | null) => void
  createRipple: (x: number, y: number) => void
}
```

**核心逻辑：**
```typescript
export function useCursor() {
  const position = ref({ x: 0, y: 0 })
  const isHovering = ref(false)
  const hoverElement = ref<Element | null>(null)
  const ripples = ref<HTMLElement[]>([])

  const updatePosition = (x: number, y: number) => {
    gsap.to(position.value, {
      x,
      y,
      duration: 0.2,
      ease: 'power2.out'
    })
  }

  const setHover = (element: Element | null) => {
    isHovering.value = !!element
    hoverElement.value = element
  }

  const createRipple = (x: number, y: number) => {
    const ripple = document.createElement('div')
    ripple.className = 'cursor-ripple'
    document.body.appendChild(ripple)

    gsap.fromTo(
      ripple,
      {
        width: 0,
        height: 0,
        opacity: 1
      },
      {
        width: 100,
        height: 100,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          ripple.remove()
        }
      }
    )
  }

  return {
    position,
    isHovering,
    hoverElement,
    updatePosition,
    setHover,
    createRipple
  }
}
```

#### 3.1.3 性能优化

- 使用 `requestAnimationFrame` 优化光标移动
- 移动端自动禁用
- 使用 CSS transform 优化渲染
- 避免频繁 DOM 操作

---

### 3.2 粒子背景系统

#### 3.2.1 组件设计

**文件：** `src/components/interactive/ParticleBackground.vue`

**功能：**
- 生成随机粒子
- 粒子连线
- 鼠标交互
- 主题适配

**Props：**
```typescript
interface ParticleBackgroundProps {
  particleCount?: number       // 粒子数量
  connectionDistance?: number  // 连线距离
  mouseInteraction?: 'repel' | 'attract' | 'none'  // 鼠标交互方式
  theme?: 'light' | 'dark'     // 主题
}
```

#### 3.2.2 Composable 设计

**文件：** `src/composables/useParticleSystem.ts`

**API：**
```typescript
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
}

interface UseParticleSystemReturn {
  canvas: Ref<HTMLCanvasElement | null>
  particles: Ref<Particle[]>
  init: () => void
  animate: () => void
  resize: () => void
  destroy: () => void
}
```

**核心逻辑：**
```typescript
export function useParticleSystem(config: ParticleBackgroundProps) {
  const canvas = ref<HTMLCanvasElement | null>(null)
  const particles = ref<Particle[]>([])
  let animationId: number | null = null

  const createParticle = (): Particle => {
    return {
      x: Math.random() * canvas.value!.width,
      y: Math.random() * canvas.value!.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      color: getThemeColor(config.theme)
    }
  }

  const init = () => {
    const ctx = canvas.value?.getContext('2d')
    if (!ctx) return

    // 创建粒子
    for (let i = 0; i < config.particleCount!; i++) {
      particles.value.push(createParticle())
    }

    animate()
  }

  const animate = () => {
    const ctx = canvas.value?.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height)

    // 更新和绘制粒子
    particles.value.forEach((particle, i) => {
      // 更新位置
      particle.x += particle.vx
      particle.y += particle.vy

      // 边界检测
      if (particle.x < 0 || particle.x > canvas.value!.width) {
        particle.vx *= -1
      }
      if (particle.y < 0 || particle.y > canvas.value!.height) {
        particle.vy *= -1
      }

      // 绘制粒子
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = particle.color
      ctx.fill()

      // 绘制连线
      for (let j = i + 1; j < particles.value.length; j++) {
        const other = particles.value[j]
        const dx = particle.x - other.x
        const dy = particle.y - other.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < config.connectionDistance!) {
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(other.x, other.y)
          ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / config.connectionDistance!})`
          ctx.stroke()
        }
      }
    })

    animationId = requestAnimationFrame(animate)
  }

  const destroy = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
  }

  return {
    canvas,
    particles,
    init,
    animate,
    resize,
    destroy
  }
}
```

#### 3.2.3 性能优化

- 对象池复用粒子
- 视口外粒子暂停计算
- 根据设备性能动态调整粒子数量
- 使用离屏 Canvas 优化渲染

---

### 3.3 滚动进度系统

#### 3.3.1 组件设计

**文件：** `src/components/interactive/ScrollProgressBar.vue`

**功能：**
- 显示滚动进度
- 平滑过渡
- 点击跳转

**Props：**
```typescript
interface ScrollProgressBarProps {
  height?: number             // 进度条高度
  color?: string              // 进度条颜色
  position?: 'top' | 'bottom' // 位置
  showPercentage?: boolean    // 是否显示百分比
}
```

#### 3.3.2 Composable 设计

**文件：** `src/composables/useScrollProgress.ts`

**API：**
```typescript
interface UseScrollProgressReturn {
  progress: Ref<number>
  percentage: Ref<number>
  scrollTo: (progress: number) => void
}
```

**核心逻辑：**
```typescript
export function useScrollProgress() {
  const progress = ref(0)
  const percentage = ref(0)

  const updateProgress = () => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const newProgress = scrollTop / docHeight

    gsap.to(progress.value, {
      value: newProgress,
      duration: 0.3,
      ease: 'power2.out'
    })

    percentage.value = Math.round(newProgress * 100)
  }

  const scrollTo = (targetProgress: number) => {
    const scrollTop = targetProgress * (document.documentElement.scrollHeight - window.innerHeight)

    gsap.to(window, {
      scrollTo: scrollTop,
      duration: 1,
      ease: 'power3.inOut'
    })
  }

  onMounted(() => {
    window.addEventListener('scroll', updateProgress)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', updateProgress)
  })

  return {
    progress,
    percentage,
    scrollTo
  }
}
```

---

### 3.4 3D 卡片系统

#### 3.4.1 组件设计

**文件：** `src/components/interactive/Card3D.vue`

**功能：**
- 3D 倾斜效果
- 光照效果
- 平滑过渡

**Props：**
```typescript
interface Card3DProps {
  maxTilt?: number            // 最大倾斜角度
  perspective?: number        // 透视距离
  scale?: number              // 缩放比例
  glare?: boolean             // 是否启用光照
}
```

#### 3.4.2 Composable 设计

**文件：** `src/composables/useCard3D.ts`

**API：**
```typescript
interface UseCard3DReturn {
  transform: Ref<string>
  glareStyle: Ref<CSSProperties>
  handleMouseMove: (event: MouseEvent) => void
  handleMouseLeave: () => void
}
```

**核心逻辑：**
```typescript
export function useCard3D(config: Card3DProps) {
  const transform = ref('')
  const glareStyle = ref<CSSProperties>({})

  const handleMouseMove = (event: MouseEvent) => {
    const card = event.currentTarget as HTMLElement
    const rect = card.getBoundingClientRect()

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseX = event.clientX - centerX
    const mouseY = event.clientY - centerY

    const rotateX = (mouseY / (rect.height / 2)) * config.maxTilt!
    const rotateY = -(mouseX / (rect.width / 2)) * config.maxTilt!

    transform.value = `
      perspective(${config.perspective}px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(${config.scale})
    `

    if (config.glare) {
      const glareX = (mouseX / rect.width) * 100
      const glareY = (mouseY / rect.height) * 100

      glareStyle.value = {
        background: `linear-gradient(${glareX}deg, rgba(255,255,255,0.3) 0%, transparent 100%)`,
        transform: `translate(${glareX}%, ${glareY}%)`
      }
    }
  }

  const handleMouseLeave = () => {
    transform.value = ''
    glareStyle.value = {}
  }

  return {
    transform,
    glareStyle,
    handleMouseMove,
    handleMouseLeave
  }
}
```

---

## 4. 状态管理

### 4.1 Store 设计

**文件：** `src/stores/interactive.ts`

```typescript
import { defineStore } from 'pinia'

export const useInteractiveStore = defineStore('interactive', () => {
  // 光标状态
  const cursorEnabled = ref(true)
  const cursorStyle = ref<'dot' | 'arrow' | 'cross'>('dot')

  // 粒子系统状态
  const particleEnabled = ref(true)
  const particleCount = ref(200)

  // 滚动进度状态
  const scrollProgressEnabled = ref(true)

  // 3D 卡片状态
  const card3DEnabled = ref(true)

  // 页面转场状态
  const pageTransitionEnabled = ref(true)
  const pageTransitionDuration = ref(0.5)

  // 磁性按钮状态
  const magneticButtonEnabled = ref(true)

  // 性能模式
  const performanceMode = ref<'high' | 'medium' | 'low'>('high')

  // 检测设备性能
  const detectPerformance = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    const isLowEnd = navigator.hardwareConcurrency < 4 || (navigator as any).deviceMemory < 4

    if (isMobile || isLowEnd) {
      performanceMode.value = 'low'
      particleCount.value = 50
      cursorEnabled.value = false
    }
  }

  return {
    cursorEnabled,
    cursorStyle,
    particleEnabled,
    particleCount,
    scrollProgressEnabled,
    card3DEnabled,
    pageTransitionEnabled,
    pageTransitionDuration,
    magneticButtonEnabled,
    performanceMode,
    detectPerformance
  }
})
```

---

## 5. 工具函数

### 5.1 性能监控

**文件：** `src/utils/performance.ts`

```typescript
export class PerformanceMonitor {
  private fps: number = 60
  private frameCount: number = 0
  private lastTime: number = performance.now()

  measureFPS() {
    this.frameCount++
    const currentTime = performance.now()

    if (currentTime - this.lastTime >= 1000) {
      this.fps = this.frameCount
      this.frameCount = 0
      this.lastTime = currentTime

      // 如果 FPS 低于 30，降低效果
      if (this.fps < 30) {
        this.reduceEffects()
      }
    }

    requestAnimationFrame(() => this.measureFPS())
  }

  private reduceEffects() {
    const store = useInteractiveStore()
    store.performanceMode = 'low'
    store.particleCount = 50
  }
}
```

### 5.2 可访问性检测

**文件：** `src/utils/accessibility.ts`

```typescript
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const prefersHighContrast = () => {
  return window.matchMedia('(prefers-contrast: high)').matches
}
```

### 5.3 设备检测

**文件：** `src/utils/deviceDetection.ts`

```typescript
export const isMobile = () => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

export const isTouch = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export const isLowEnd = () => {
  return navigator.hardwareConcurrency < 4 || (navigator as any).deviceMemory < 4
}
```

---

## 6. 设计系统集成

### 6.1 Interactive Tokens

**文件：** `src/design-system/tokens/interactive.ts`

```typescript
export const interactiveTokens = {
  cursor: {
    size: 20,
    hoverSize: 40,
    color: 'var(--color-primary)',
    hoverColor: 'var(--color-accent)'
  },
  particle: {
    count: {
      desktop: 200,
      tablet: 100,
      mobile: 50
    },
    size: {
      min: 1,
      max: 3
    },
    connectionDistance: 150
  },
  scrollProgress: {
    height: 3,
    color: 'var(--color-primary)'
  },
  card3D: {
    maxTilt: 15,
    perspective: 1000,
    scale: 1.05
  },
  pageTransition: {
    duration: 0.5,
    ease: 'power3.inOut'
  },
  magneticButton: {
    strength: 0.5,
    elasticity: 0.3
  }
}
```

---

## 7. 性能优化策略

### 7.1 渲染优化

- **CSS Transform：** 使用 transform 代替 top/left
- **GPU 加速：** 使用 will-change、transform3d
- **避免重绘：** 使用 opacity、transform 等不触发布局重绘的属性
- **虚拟滚动：** 大列表使用虚拟滚动

### 7.2 动画优化

- **requestAnimationFrame：** 所有动画使用 rAF
- **节流防抖：** 滚动、resize 事件使用节流
- **对象池：** 粒子系统使用对象池
- **懒加载：** 非可见区域动画延迟加载

### 7.3 内存优化

- **清理资源：** 组件卸载时清理动画、事件监听
- **避免内存泄漏：** 及时取消 rAF、removeEventListener
- **限制粒子数量：** 根据设备性能动态调整

---

## 8. 测试策略

### 8.1 单元测试

- 测试所有 composables 的核心逻辑
- 测试工具函数的正确性
- 测试状态管理的逻辑

### 8.2 组件测试

- 测试组件的渲染
- 测试组件的交互
- 测试组件的 Props 和 Emits

### 8.3 集成测试

- 测试多个组件协同工作
- 测试状态管理的集成
- 测试性能监控

### 8.4 E2E 测试

- 测试完整的用户流程
- 测试性能指标
- 测试可访问性

---

## 9. 部署策略

### 9.1 构建优化

- **代码分割：** 按路由分割代码
- **Tree Shaking：** 移除未使用的代码
- **压缩优化：** 使用 Terser 压缩代码
- **资源优化：** 压缩图片、字体

### 9.2 CDN 加速

- **静态资源：** 使用 CDN 加速
- **GSAP：** 使用 CDN 加载
- **字体：** 使用 Google Fonts CDN

### 9.3 缓存策略

- **长期缓存：** 静态资源长期缓存
- **版本控制：** 使用文件名 hash
- **Service Worker：** 离线缓存

---

**文档版本：** v1.0
**最后更新：** 2026年1月22日
**状态：** 待审核