/**
 * 字体渐进式加载优化
 * 解决 FOIT (Flash of Invisible Text) 问题
 */

interface FontConfig {
  family: string
  weight: number
  display?: 'swap' | 'fallback' | 'optional'
}

const DEFAULT_FONT_DISPLAY = 'swap'

/**
 * 加载单个字体
 */
const loadFont = async (config: FontConfig): Promise<boolean> => {
  try {
    const { family, weight, display = DEFAULT_FONT_DISPLAY } = config
    
    // 检查字体是否已加载
    if (document.fonts.check(`16px ${family}`)) {
      return true
    }

    // 创建字体加载器
    const fontFace = new FontFace(family, `url(/fonts/${family}-${weight}.woff2)`, {
      weight,
      display,
      style: 'normal'
    })

    // 加载字体
    await fontFace.load()
    document.fonts.add(fontFace)

    // 触发字体加载事件
    window.dispatchEvent(new CustomEvent('font:loaded', { detail: { family, weight } }))
    
    return true
  } catch (error) {
    console.warn(`Failed to load font ${config.family}:`, error)
    return false
  }
}

/**
 * 加载所有字体
 */
export const loadAllFonts = async (): Promise<void> => {
  const fonts = [
    { family: 'Press Start 2P', weight: 400, display: 'swap' },
    { family: 'Inter', weight: 400, display: 'swap' },
    { family: 'Inter', weight: 500, display: 'swap' },
    { family: 'Inter', weight: 600, display: 'swap' },
    { family: 'Inter', weight: 700, display: 'swap' },
    { family: 'JetBrains Mono', weight: 400, display: 'swap' },
    { family: 'JetBrains Mono', weight: 500, display: 'swap' },
    { family: 'JetBrains Mono', weight: 600, display: 'swap' }
  ]

  // 并行加载字体
  const results = await Promise.allSettled(
    fonts.map(config => loadFont(config))
  )

  // 统计加载结果
  const successful = results.filter(result => result.status === 'fulfilled' && result.value).length
  const failed = results.filter(result => result.status === 'rejected' || !result.value).length

  console.log(`Font loading completed: ${successful} successful, ${failed} failed`)

  // 触发字体加载完成事件
  window.dispatchEvent(new CustomEvent('fonts:loaded', { detail: { successful, failed } }))
}

/**
 * 监听字体加载事件
 */
export const onFontLoaded = (callback: (event: CustomEvent) => void): void => {
  window.addEventListener('font:loaded', callback)
}

export const onFontsLoaded = (callback: (event: CustomEvent) => void): void => {
  window.addEventListener('fonts:loaded', callback)
}

/**
 * 移除字体加载监听器
 */
export const offFontLoaded = (callback: (event: CustomEvent) => void): void => {
  window.removeEventListener('font:loaded', callback)
}

export const offFontsLoaded = (callback: (event: CustomEvent) => void): void => {
  window.removeEventListener('fonts:loaded', callback)
}

/**
 * 预加载关键字体
 */
export const preloadCriticalFonts = (): void => {
  const criticalFonts = [
    { family: 'Press Start 2P', weight: 400 },
    { family: 'Inter', weight: 400 }
  ]

  criticalFonts.forEach(config => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'font'
    link.type = 'font/woff2'
    link.crossOrigin = 'anonymous'
    link.href = `/fonts/${config.family}-${config.weight}.woff2`
    document.head.appendChild(link)
  })
}

/**
 * 添加字体加载样式
 */
export const addFontLoadingStyles = (): void => {
  const style = document.createElement('style')
  style.textContent = `
    /* 防止 FOIT */
    @font-face {
      font-family: 'Press Start 2P';
      font-display: swap;
    }
    
    @font-face {
      font-family: 'Inter';
      font-display: swap;
    }
    
    @font-face {
      font-family: 'JetBrains Mono';
      font-display: swap;
    }
    
    /* 为关键元素添加字体加载指示器 */
    .font-loading {
      opacity: 0.5;
      transition: opacity 0.2s ease-in-out;
    }
    
    .font-loading::before {
      content: 'Loading fonts...';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #888888;
    }
    
    /* 字体加载完成后移除指示器 */
    .fonts-loaded .font-loading {
      opacity: 1;
    }
  `
  document.head.appendChild(style)
}