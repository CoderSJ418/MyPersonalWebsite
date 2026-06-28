/**
 * 高性能字体优化器
 * 专门针对 MyPersonalWebsite 的字体系统进行优化
 */

export interface FontOptimizationConfig {
  preload?: boolean
  fontDisplay?: 'auto' | 'swap' | 'fallback' | 'optional'
  subsets?: string[]
  formats?: ('woff2' | 'woff' | 'truetype')[]
  fallbackFont?: string
  priority?: 'critical' | 'high' | 'normal' | 'low'
}

export interface FontFace {
  family: string
  src: string
  weight?: number | string
  style?: 'normal' | 'italic' | 'oblique'
  unicodeRange?: string
  fontDisplay?: 'auto' | 'swap' | 'fallback' | 'optional'
}

export class FontOptimizer {
  private static instance: FontOptimizer
  private fontFaces: Map<string, FontFace> = new Map()
  private loadedFonts: Set<string> = new Set()
  private loadingFonts: Set<string> = new Set()
  private config: FontOptimizationConfig

  private constructor(config: Partial<FontOptimizationConfig> = {}) {
    this.config = {
      preload: true,
      fontDisplay: 'swap',
      subsets: ['latin', 'latin-ext'],
      formats: ['woff2', 'woff'],
      fallbackFont: 'system-ui, -apple-system, sans-serif',
      priority: 'high',
      ...config
    }
  }

  static getInstance(config?: Partial<FontOptimizationConfig>): FontOptimizer {
    if (!FontOptimizer.instance) {
      FontOptimizer.instance = new FontOptimizer(config)
    }
    return FontOptimizer.instance
  }

  /**
   * 添加字体
   */
  addFont(fontFace: FontFace): void {
    const key = this.generateFontKey(fontFace)
    this.fontFaces.set(key, fontFace)
  }

  /**
   * 添加多个字体
   */
  addFonts(fontFaces: FontFace[]): void {
    fontFaces.forEach(fontFace => this.addFont(fontFace))
  }

  /**
   * 生成字体键
   */
  private generateFontKey(fontFace: FontFace): string {
    return `${fontFace.family}-${fontFace.weight || 'normal'}-${fontFace.style || 'normal'}
`
  }

  /**
   * 优化字体加载
   */
  optimizeFontLoading(): void {
    this.fontFaces.forEach((fontFace, key) => {
      if (!this.loadedFonts.has(key)) {
        this.loadFont(fontFace)
      }
    })
  }

  /**
   * 加载字体
   */
  private loadFont(fontFace: FontFace): void {
    const key = this.generateFontKey(fontFace)
    if (this.loadingFonts.has(key)) return

    this.loadingFonts.add(key)
    
    // 创建字体加载器
    const font = new FontFace(fontFace.family, fontFace.src, {
      weight: fontFace.weight,
      style: fontFace.style,
      unicodeRange: fontFace.unicodeRange,
      display: fontFace.fontDisplay || this.config.fontDisplay
    })

    font.load().then(() => {
      // 添加到文档字体集
      document.fonts.add(font)
      this.loadedFonts.add(key)
      this.loadingFonts.delete(key)
      
      // 触发字体加载完成事件
      this.emitFontLoaded(fontFace.family)
      
      // 应用字体到页面
      this.applyFontToElements(fontFace.family)
    }).catch(error => {
      console.warn(`Failed to load font: ${fontFace.family}`, error)
      this.loadingFonts.delete(key)
      this.emitFontFailed(fontFace.family, error)
    })
  }

  /**
   * 预加载关键字体
   */
  preloadCriticalFonts(): void {
    const criticalFonts = Array.from(this.fontFaces.values()).filter(
      fontFace => this.isCriticalFont(fontFace)
    )

    criticalFonts.forEach(fontFace => {
      this.preloadFont(fontFace)
    })
  }

  /**
   * 预加载字体
   */
  private preloadFont(fontFace: FontFace): void {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'font'
    link.type = 'font/woff2'
    link.crossOrigin = 'anonymous'
    link.href = fontFace.src
    
    // 添加字体加载完成回调
    link.onload = () => {
      this.loadedFonts.add(this.generateFontKey(fontFace))
      this.applyFontToElements(fontFace.family)
    }

    document.head.appendChild(link)
  }

  /**
   * 应用字体到元素
   */
  private applyFontToElements(family: string): void {
    const elements = document.querySelectorAll(`[data-font-family="${family}"]`)
    elements.forEach(element => {
      (element as HTMLElement).style.fontFamily = family
    })
  }

  /**
   * 检查是否为关键字体
   */
  private isCriticalFont(fontFace: FontFace): boolean {
    const criticalFamilies = ['Inter', 'Roboto', 'Source Sans Pro', 'system-ui']
    return criticalFamilies.some(critical => fontFace.family.includes(critical))
  }

  /**
   * 生成字体 CSS
   */
  generateFontCSS(): string {
    let css = ''
    
    this.fontFaces.forEach(fontFace => {
      const key = this.generateFontKey(fontFace)
      if (this.loadedFonts.has(key)) {
        css += `@font-face {
          font-family: "${fontFace.family}";
          src: ${fontFace.src};
          font-weight: ${fontFace.weight || 'normal'};
          font-style: ${fontFace.style || 'normal'};
          font-display: ${fontFace.fontDisplay || this.config.fontDisplay};
        }
`
      }
    })

    return css
  }

  /**
   * 生成字体预加载标签
   */
  generatePreloadTags(): string {
    let tags = ''
    
    this.fontFaces.forEach(fontFace => {
      if (this.isCriticalFont(fontFace)) {
        tags += `<link rel="preload" as="font" type="font/woff2" crossorigin href="${fontFace.src}">
`
      }
    })

    return tags
  }

  /**
   * 生成字体回退样式
   */
  generateFallbackStyles(): string {
    return `
      body {
        font-family: ${this.config.fallbackFont};
      }
      
      [data-font-family] {
        font-family: inherit;
        font-display: swap;
      }
      
      @supports (font-variation-settings: normal) {
        [data-font-family] {
          font-variation-settings: normal;
        }
      }
    `
  }

  /**
   * 监听字体加载事件
   */
  onFontLoaded(callback: (family: string) => void): () => void {
    const eventListener = (event: CustomEvent) => {
      if (event.detail.family === 'font-loaded') {
        callback(event.detail.family)
      }
    }

    document.addEventListener('font-loaded', eventListener as EventListener)
    
    return () => {
      document.removeEventListener('font-loaded', eventListener as EventListener)
    }
  }

  /**
   * 监听字体加载失败事件
   */
  onFontFailed(callback: (family: string, error: Error) => void): () => void {
    const eventListener = (event: CustomEvent) => {
      if (event.detail.family === 'font-failed') {
        callback(event.detail.family, event.detail.error)
      }
    }

    document.addEventListener('font-failed', eventListener as EventListener)
    
    return () => {
      document.removeEventListener('font-failed', eventListener as EventListener)
    }
  }

  /**
   * 发射字体加载完成事件
   */
  private emitFontLoaded(family: string): void {
    const event = new CustomEvent('font-loaded', {
      detail: { family }
    })
    document.dispatchEvent(event)
  }

  /**
   * 发射字体加载失败事件
   */
  private emitFontFailed(family: string, error: Error): void {
    const event = new CustomEvent('font-failed', {
      detail: { family, error }
    })
    document.dispatchEvent(event)
  }

  /**
   * 获取字体加载状态
   */
  getFontStatus(family: string): 'loading' | 'loaded' | 'failed' | 'not-started' {
    const fontFace = Array.from(this.fontFaces.values()).find(f => f.family === family)
    if (!fontFace) return 'not-started'

    const key = this.generateFontKey(fontFace)
    if (this.loadedFonts.has(key)) return 'loaded'
    if (this.loadingFonts.has(key)) return 'loading'
    return 'not-started'
  }

  /**
   * 获取所有字体状态
   */
  getAllFontStatus(): Record<string, string> {
    const status: Record<string, string> = {}

    this.fontFaces.forEach((fontFace, _key) => {
      status[fontFace.family] = this.getFontStatus(fontFace.family)
    })

    return status
  }

  /**
   * 清理字体加载
   */
  cleanup(): void {
    this.fontFaces.clear()
    this.loadedFonts.clear()
    this.loadingFonts.clear()
  }
}

// 全局字体优化器实例
export const fontOptimizer = FontOptimizer.getInstance({
  preload: true,
  fontDisplay: 'swap',
  priority: 'high'
})

// Vue 组合式函数：字体管理
export function useFontOptimization() {
  const fontStatus = ref(fontOptimizer.getAllFontStatus())

  const addFont = (fontFace: FontFace) => {
    fontOptimizer.addFont(fontFace)
  }

  const addFonts = (fontFaces: FontFace[]) => {
    fontOptimizer.addFonts(fontFaces)
  }

  const optimizeLoading = () => {
    fontOptimizer.optimizeFontLoading()
  }

  const preloadCritical = () => {
    fontOptimizer.preloadCriticalFonts()
  }

  const getStatus = (family: string) => {
    return fontOptimizer.getFontStatus(family)
  }

  // 监听字体加载状态变化
  const unsubscribe = fontOptimizer.onFontLoaded(() => {
    fontStatus.value = fontOptimizer.getAllFontStatus()
  })

  onUnmounted(unsubscribe)

  return {
    addFont,
    addFonts,
    optimizeLoading,
    preloadCritical,
    getStatus,
    fontStatus
  }
}

// 导出类型
export type { FontOptimizationConfig, FontFace }
