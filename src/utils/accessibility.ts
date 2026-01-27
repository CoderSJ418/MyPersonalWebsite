/**
 * 可访问性优化工具
 * 提供无障碍设计相关的工具函数和配置
 */

/**
 * 应用可访问性优化
 */
export function applyAccessibilityOptimizations() {
  // 减少运动偏好
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (prefersReducedMotion.matches) {
    document.documentElement.classList.add('reduced-motion')
  }

  // 监听减少运动偏好变化
  prefersReducedMotion.addEventListener('change', (e) => {
    if (e.matches) {
      document.documentElement.classList.add('reduced-motion')
    } else {
      document.documentElement.classList.remove('reduced-motion')
    }
  })

  // 高对比度模式
  const prefersHighContrast = window.matchMedia('(prefers-contrast: high)')
  if (prefersHighContrast.matches) {
    document.documentElement.classList.add('high-contrast')
  }

  // 监听高对比度模式变化
  prefersHighContrast.addEventListener('change', (e) => {
    if (e.matches) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  })

  // 添加键盘导航指示器
  let hasKeyboardNav = false

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      hasKeyboardNav = true
      document.documentElement.classList.add('keyboard-nav')
    }
  }

  const handleMouseDown = () => {
    if (hasKeyboardNav) {
      document.documentElement.classList.remove('keyboard-nav')
      hasKeyboardNav = false
    }
  }

  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('mousedown', handleMouseDown)

  // 添加跳转链接
  const skipLink = document.createElement('a')
  skipLink.href = '#main-content'
  skipLink.className = 'skip-link sr-only'
  skipLink.textContent = '跳转到主内容'
  document.body.insertBefore(skipLink, document.body.firstChild)

  // 确保跳转链接在焦点时显示
  skipLink.addEventListener('focus', () => {
    skipLink.classList.remove('sr-only')
  })

  skipLink.addEventListener('blur', () => {
    skipLink.classList.add('sr-only')
  })

  // 添加焦点指示器样式
  const style = document.createElement('style')
  style.textContent = `
    .focus-ring:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    .keyboard-nav .btn:focus,
    .keyboard-nav .input:focus,
    .keyboard-nav .select:focus,
    .keyboard-nav .textarea:focus {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }

    .reduced-motion * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  `
  document.head.appendChild(style)
}

/**
 * 检查可访问性状态
 */
export function checkAccessibilityStatus(): {
  prefersReducedMotion: boolean
  prefersHighContrast: boolean
  prefersColorScheme: 'light' | 'dark'
  keyboardNavigation: boolean
} {
  return {
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
    prefersColorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    keyboardNavigation: document.documentElement.classList.contains('keyboard-nav')
  }
}

/**
 * 获取可访问性建议
 */
export function getAccessibilityRecommendations(): string[] {
  const recommendations: string[] = []
  const status = checkAccessibilityStatus()

  if (status.prefersReducedMotion) {
    recommendations.push('用户启用了减少运动偏好，所有动画已优化')
  }

  if (status.prefersHighContrast) {
    recommendations.push('检测到高对比度模式，界面已优化')
  }

  if (!status.keyboardNavigation) {
    recommendations.push('建议使用键盘导航以获得最佳可访问性体验')
  }

  return recommendations
}

/**
 * 验证组件可访问性
 */
export function validateComponentAccessibility(element: Element): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // 检查焦点指示器
  const focusableElements = element.querySelectorAll('button, [tabindex]:not([tabindex="-1"])')
  focusableElements.forEach((el) => {
    const hasFocusIndicator = window.getComputedStyle(el).outlineWidth !== '0px'
    if (!hasFocusIndicator && !el.classList.contains('no-focus')) {
      warnings.push(`元素 ${el.tagName} 缺少焦点指示器`)
    }
  })

  // 检查标签
  const inputs = element.querySelectorAll('input, textarea, select')
  inputs.forEach((input) => {
    const hasLabel = !!input.getAttribute('aria-label') || !!input.getAttribute('aria-labelledby')
    if (!hasLabel) {
      warnings.push(`输入 ${input.tagName} 缺少标签`)
    }
  })

  // 检查图片
  const images = element.querySelectorAll('img')
  images.forEach((img) => {
    if (!img.getAttribute('alt')) {
      warnings.push(`图片 ${img.src} 缺少 alt 属性`)
    }
  })

  // 检查对比度
  const textElements = element.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a')
  textElements.forEach((el) => {
    const computedStyle = window.getComputedStyle(el)
    const color = computedStyle.color
    const backgroundColor = computedStyle.backgroundColor
    const contrast = calculateContrast(color, backgroundColor)
    
    if (contrast < 4.5) {
      errors.push(`文本对比度不足: ${el.textContent?.substring(0, 20)}...`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * 计算颜色对比度
 */
function calculateContrast(color1: string, color2: string): number {
  // 简化的对比度计算，实际应用中建议使用专业库
  const luminance1 = getLuminance(color1)
  const luminance2 = getLuminance(color2)
  const brightest = Math.max(luminance1, luminance2)
  const darkest = Math.min(luminance1, luminance2)
  return (brightest + 0.05) / (darkest + 0.05)
}

/**
 * 获取颜色亮度
 */
function getLuminance(color: string): number {
  // 简化的亮度计算
  if (color.startsWith('#')) {
    const hex = color.substring(1)
    const r = parseInt(hex.substr(0, 2), 16) / 255
    const g = parseInt(hex.substr(2, 2), 16) / 255
    const b = parseInt(hex.substr(4, 2), 16) / 255
    return (r + g + b) / 3
  }
  return 0.5
}

/**
 * 为组件添加可访问性属性
 */
export function addAccessibilityAttributes(
  element: HTMLElement,
  attributes: Record<string, string>
): void {
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })
}

/**
 * 创建可访问的模态框
 */
export function createAccessibleModal(
  title: string,
  content: string,
  options: {
    onClose?: () => void
    onConfirm?: () => void
    confirmText?: string
    cancelText?: string
  } = {}
): void {
  const modal = document.createElement('div')
  modal.className = 'accessible-modal'
  modal.setAttribute('role', 'dialog')
  modal.setAttribute('aria-modal', 'true')
  modal.setAttribute('aria-labelledby', 'modal-title')
  modal.setAttribute('aria-describedby', 'modal-content')

  modal.innerHTML = `
    <div class="modal-overlay" role="presentation"></div>
    <div class="modal-content" role="document">
      <div class="modal-header">
        <h2 id="modal-title">${title}</h2>
        <button class="modal-close" aria-label="关闭" aria-describedby="modal-title">
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div id="modal-content" class="modal-body">
        <p>${content}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn--secondary modal-cancel">${options.cancelText || '取消'}</button>
        <button class="btn btn--primary modal-confirm">${options.confirmText || '确认'}</button>
      </div>
    </div>
  `

  document.body.appendChild(modal)

  // 焦点管理
  const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
  const firstFocusable = focusableElements[0] as HTMLElement
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement

  firstFocusable?.focus()

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal(modal)
      options.onClose?.()
    }
  }

  const handleTab = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstFocusable) {
        lastFocusable?.focus()
        e.preventDefault()
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        firstFocusable?.focus()
        e.preventDefault()
      }
    }
  }

  modal.addEventListener('keydown', handleEscape)
  modal.addEventListener('keydown', handleTab)

  // 事件监听
  modal.querySelector('.modal-close')?.addEventListener('click', () => {
    closeModal(modal)
    options.onClose?.()
  })

  modal.querySelector('.modal-cancel')?.addEventListener('click', () => {
    closeModal(modal)
    options.onClose?.()
  })

  modal.querySelector('.modal-confirm')?.addEventListener('click', () => {
    closeModal(modal)
    options.onConfirm?.()
  })

  modal.querySelector('.modal-overlay')?.addEventListener('click', () => {
    closeModal(modal)
    options.onClose?.()
  })

  function closeModal(modalElement: HTMLElement) {
    modalElement.remove()
    document.removeEventListener('keydown', handleEscape)
    document.removeEventListener('keydown', handleTab)
  }
}

/**
 * 验证整个页面的可访问性
 */
export function validatePageAccessibility(): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // 检查标题层级
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
  let currentLevel = 1
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName[1])
    if (level > currentLevel + 1) {
      errors.push(`标题层级跳跃: ${heading.tagName} 后跟 ${headings[headings.indexOf(heading) + 1]?.tagName}`)
    }
    currentLevel = level
  })

  // 检查链接文本
  const links = document.querySelectorAll('a')
  links.forEach((link) => {
    const text = link.textContent?.trim()
    if (text && text.length < 3) {
      warnings.push(`链接文本过短: ${text}`)
    }
  })

  // 检查表单标签
  const forms = document.querySelectorAll('form')
  forms.forEach((form) => {
    const inputs = form.querySelectorAll('input, textarea, select')
    inputs.forEach((input) => {
      if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
        warnings.push(`表单元素 ${input.tagName} 缺少标签`)
      }
    })
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}