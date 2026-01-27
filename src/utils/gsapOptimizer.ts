/**
 * GSAP 动画性能优化器
 * 专门针对 MyPersonalWebsite 的动画系统进行性能优化
 */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { Draggable } from 'gsap/Draggable'

// 注册插件
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Draggable)

export interface AnimationConfig {
  duration?: number
  delay?: number
  ease?: string | gsap.EaseFunction
  stagger?: number | gsap.StaggerConfig
  repeat?: number
  yoyo?: boolean
  paused?: boolean
  immediateRender?: boolean
  onComplete?: () => void
  onUpdate?: () => void
  onStart?: () => void
}

export interface ScrollAnimationConfig extends AnimationConfig {
  trigger?: string | Element
  start?: string
  end?: string
  scrub?: number | boolean
  pin?: boolean | string
  pinSpacing?: boolean
  markers?: boolean
}

export interface PerformanceConfig {
  maxConcurrentAnimations?: number
  useTransform?: boolean
  useWillChange?: boolean
  gpuAcceleration?: boolean
  optimized?: boolean
}

export class GSAPOptimizer {
  private static instance: GSAPOptimizer
  private activeAnimations = new Set<gsap.core.Tween>()
  private maxConcurrentAnimations: number
  private performanceConfig: PerformanceConfig

  private constructor(config: Partial<PerformanceConfig> = {}) {
    this.maxConcurrentAnimations = config.maxConcurrentAnimations || 50
    this.performanceConfig = {
      useTransform: true,
      useWillChange: true,
      gpuAcceleration: true,
      optimized: true,
      ...config
    }
  }

  static getInstance(config?: Partial<PerformanceConfig>): GSAPOptimizer {
    if (!GSAPOptimizer.instance) {
      GSAPOptimizer.instance = new GSAPOptimizer(config)
    }
    return GSAPOptimizer.instance
  }

  /**
   * 创建优化的动画
   */
  createOptimizedAnimation(
    targets: gsap.TweenTarget,
    properties: gsap.TweenVars,
    config: AnimationConfig = {}
  ): gsap.core.Tween {
    // 检查并发动画数量
    if (this.activeAnimations.size >= this.maxConcurrentAnimations) {
      this.cleanupOldAnimations()
    }

    // 应用性能优化配置
    const optimizedProperties = this.applyPerformanceOptimizations(properties)
    
    // 创建动画
    const animation = gsap.to(targets, {
      ...optimizedProperties,
      ...config,
      duration: config.duration || 1,
      ease: config.ease || 'power2.out'
    })

    this.activeAnimations.add(animation)
    
    // 监听动画完成
    animation.eventCallback('onComplete', () => {
      this.activeAnimations.delete(animation)
    })

    return animation
  }

  /**
   * 创建滚动动画
   */
  createScrollAnimation(
    targets: gsap.TweenTarget,
    properties: gsap.TweenVars,
    config: ScrollAnimationConfig = {}
  ): gsap.core.Tween {
    const {
      trigger,
      start = 'top bottom',
      end = 'bottom top',
      scrub = 1,
      pin = false,
      pinSpacing = true,
      markers = false,
      ...animationConfig
    } = config

    return gsap.to(targets, {
      ...properties,
      scrollTrigger: {
        trigger,
        start,
        end,
        scrub,
        pin,
        pinSpacing,
        markers,
        onUpdate: (self) => {
          // 性能监控
          if (this.performanceConfig.optimized) {
            self.progress = Math.round(self.progress * 100) / 100
          }
        }
      },
      ...animationConfig
    })
  }

  /**
   * 应用性能优化
   */
  private applyPerformanceOptimizations(
    properties: gsap.TweenVars
  ): gsap.TweenVars {
    const optimized = { ...properties }

    // 使用 transform 代替 left/top
    if (this.performanceConfig.useTransform) {
      if (optimized.x || optimized.xPercent) {
        optimized.transformX = optimized.x || `${optimized.xPercent || 0}%`
        delete optimized.x
        delete optimized.xPercent
      }
      
      if (optimized.y || optimized.yPercent) {
        optimized.transformY = optimized.y || `${optimized.yPercent || 0}%`
        delete optimized.y
        delete optimized.yPercent
      }
      
      if (optimized.z || optimized.zPercent) {
        optimized.transformZ = optimized.z || `${optimized.zPercent || 0}%`
        delete optimized.z
        delete optimized.zPercent
      }
    }

    // GPU 加速
    if (this.performanceConfig.gpuAcceleration) {
      if (!optimized.willChange) {
        optimized.willChange = 'transform, opacity'
      }
      
      if (!optimized.transform) {
        optimized.transform = 'translateZ(0)'
      }
    }

    // 移除不必要的属性
    const removeProps = ['left', 'top', 'right', 'bottom', 'margin']
    removeProps.forEach(prop => {
      if (optimized[prop]) {
        delete optimized[prop]
      }
    })

    return optimized
  }

  /**
   * 创建虚拟滚动动画
   */
  createVirtualScrollAnimation(
    items: Element[],
    animationFn: (item: Element, index: number) => gsap.core.Tween
  ): gsap.core.Tween[] {
    const animations: gsap.core.Tween[] = []
    
    items.forEach((item, index) => {
      if (index < this.maxConcurrentAnimations) {
        const animation = animationFn(item, index)
        animations.push(animation)
      }
    })

    return animations
  }

  /**
   * 批量创建动画
   */
  createBatchAnimations(
    targets: gsap.TweenTarget[],
    properties: gsap.TweenVars,
    config: AnimationConfig = {}
  ): gsap.core.Tween[] {
    const animations: gsap.core.Tween[] = []
    
    targets.forEach((target, index) => {
      const staggerConfig = {
        ...config,
        delay: (config.delay || 0) + (index * (config.stagger || 0.1))
      }
      
      const animation = this.createOptimizedAnimation(target, properties, staggerConfig)
      animations.push(animation)
    })

    return animations
  }

  /**
   * 优化滚动触发器
   */
  optimizeScrollTrigger(trigger: gsap.core.Tween): void {
    const scrollTrigger = trigger.scrollTrigger
    
    if (scrollTrigger) {
      // 减少更新频率
      scrollTrigger.update = () => {
        if (scrollTrigger.isActive) {
          scrollTrigger.progress = Math.round(scrollTrigger.progress * 100) / 100
        }
      }
      
      // 优化缩放
      if (scrollTrigger.scrub) {
        scrollTrigger.scrub = Math.min(scrollTrigger.scrub, 2)
      }
    }
  }

  /**
   * 清理旧动画
   */
  private cleanupOldAnimations(): void {
    const animationsToDelete = Array.from(this.activeAnimations)
      .slice(0, Math.floor(this.maxConcurrentAnimations * 0.2))
    
    animationsToDelete.forEach(anim => {
      anim.kill()
      this.activeAnimations.delete(anim)
    })
  }

  /**
   * 停止所有动画
   */
  killAllAnimations(): void {
    this.activeAnimations.forEach(anim => anim.kill())
    this.activeAnimations.clear()
  }

  /**
   * 获取活跃动画数量
   */
  getActiveAnimationCount(): number {
    return this.activeAnimations.size
  }

  /**
   * 监控性能
   */
  monitorPerformance(): PerformanceObserver | null {
    if (!performance || !PerformanceObserver) return null

    return new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          const duration = entry.duration
          if (duration > 100) {
            console.warn(`Performance warning: Animation took ${duration}ms`)
          }
        }
      }
    })
  }
}

// 全局优化器实例
export const gsapOptimizer = GSAPOptimizer.getInstance({
  maxConcurrentAnimations: 30,
  useTransform: true,
  useWillChange: true,
  gpuAcceleration: true,
  optimized: true
})

// Vue 组合式函数：动画管理
export function useGSAPAnimation() {
  const animations = ref<gsap.core.Tween[]>([])

  const createAnimation = (
    targets: gsap.TweenTarget,
    properties: gsap.TweenVars,
    config: AnimationConfig = {}
  ) => {
    const animation = gsapOptimizer.createOptimizedAnimation(targets, properties, config)
    animations.value.push(animation)
    return animation
  }

  const createScrollAnimation = (
    targets: gsap.TweenTarget,
    properties: gsap.TweenVars,
    config: ScrollAnimationConfig = {}
  ) => {
    const animation = gsapOptimizer.createScrollAnimation(targets, properties, config)
    animations.value.push(animation)
    return animation
  }

  const killAll = () => {
    gsapOptimizer.killAllAnimations()
    animations.value = []
  }

  const cleanup = () => {
    killAll()
  }

  onUnmounted(cleanup)

  return {
    createAnimation,
    createScrollAnimation,
    killAll,
    cleanup,
    animations
  }
}

// 导出类型
export type { AnimationConfig, ScrollAnimationConfig, PerformanceConfig }