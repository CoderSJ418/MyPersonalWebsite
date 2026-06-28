/**
 * 字体渐进式加载优化
 * 解决 FOIT (Flash of Invisible Text) 问题
 * 使用 Google Fonts 加载策略
 */

/**
 * 添加字体加载样式
 * 在字体加载期间使用系统字体，加载完成后切换到 Web 字体
 */
export const addFontLoadingStyles = (): void => {
  const style = document.createElement('style')
  style.textContent = `
    /* 字体加载期间的样式 */
    .font-loading {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    }
    
    .font-loading::before {
      content: 'Loading fonts...';
      display: none;
    }
    
    /* 字体加载完成后 */
    .fonts-loaded .font-loading {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    
    /* 字体加载失败的降级处理 */
    @font-face {
      font-family: 'Inter';
      src: local('Inter'), local('Inter-Regular');
      font-display: swap;
    }
  `
  document.head.appendChild(style)
}

/**
 * 预加载关键字体
 */
export const preloadCriticalFonts = (): void => {
  // Google Fonts 已经在 index.html 中预加载
  // 这里可以添加额外的优化逻辑
  
  // 标记开始加载
  document.documentElement.classList.add('font-loading')
}

/**
 * 检查字体是否已加载
 */
const checkFontsLoaded = (): boolean => {
  // 检查 Google Fonts 是否加载完成
  if (document.fonts) {
    try {
      return document.fonts.check('16px Inter')
    } catch (_e) {
      // 如果无法检查字体，假设字体已加载
      return true
    }
  }
  return true
}

/**
 * 监听字体加载
 */
export const onFontLoaded = (callback: () => void): void => {
  if (checkFontsLoaded()) {
    callback()
    return
  }

  // 监听 Web 字体加载完成事件
  document.addEventListener('DOMContentLoaded', () => {
    if (checkFontsLoaded()) {
      callback()
    }
  })
  
  // 使用 requestAnimationFrame 作为后备
  const checkWithTimeout = () => {
    if (checkFontsLoaded()) {
      callback()
    } else {
      setTimeout(checkWithTimeout, 100)
    }
  }
  
  requestAnimationFrame(checkWithTimeout)
}

/**
 * 加载所有字体
 * 由于使用 Google Fonts，这个函数主要是为了兼容性
 */
export const loadAllFonts = async (): Promise<void> => {
  // 等待字体加载
  return new Promise((resolve) => {
    onFontLoaded(() => {
      // 标记字体加载完成
      document.documentElement.classList.add('fonts-loaded')
      document.documentElement.classList.remove('font-loading')
      
      // 触发字体加载完成事件
      window.dispatchEvent(new CustomEvent('fonts:loaded', { detail: { successful: true, failed: 0 } }))
      
      console.log('All fonts loaded successfully')
      resolve()
    })
  })
}

/**
 * 字体加载状态
 */
export const getFontStatus = (): 'loading' | 'loaded' => {
  return document.documentElement.classList.contains('fonts-loaded') ? 'loaded' : 'loading'
}