import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Theme } from '@/types/app'

/**
 * Toast 消息类型
 */
interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration: number
  timestamp: number
}

/**
 * 模态框状态
 */
interface ModalState {
  isOpen: boolean
  data?: unknown
}

/**
 * 面包屑项
 */
interface BreadcrumbItem {
  text: string
  path: string
  disabled?: boolean
}

/**
 * 节流函数 - 优化高频事件处理
 */
function throttle<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): T {
  let lastCall = 0
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return ((...args: Parameters<T>) => {
    const now = Date.now()

    if (now - lastCall >= delay) {
      lastCall = now
      fn(...args)
    } else if (!timeoutId) {
      timeoutId = setTimeout(
        () => {
          lastCall = Date.now()
          timeoutId = null
          fn(...args)
        },
        delay - (now - lastCall)
      )
    }
  }) as T
}

/**
 * 应用状态 Store
 * 整合了原有的 useAppStore 和 useUiStore
 */
export const useAppStore = defineStore('app', () => {
  // ==================== 核心状态 ====================

  /**
   * 当前主题 (light/dark)
   */
  const theme = ref<Theme>('light')

  /**
   * 语言设置
   */
  const language = ref<'zh' | 'en'>('zh')

  /**
   * 全局加载状态
   */
  const loading = ref(false)

  /**
   * 移动端菜单是否打开
   */
  const menuOpen = ref(false)

  /**
   * 是否显示回到顶部按钮
   */
  const scrollToTop = ref(false)

  // ==================== UI 扩展状态 ====================

  /**
   * 导航栏是否固定
   */
  const isNavFixed = ref(true)

  /**
   * 搜索框是否打开
   */
  const isSearchOpen = ref(false)

  /**
   * 侧边栏是否打开
   */
  const isSidebarOpen = ref(false)

  /**
   * 当前断点
   */
  const breakpoint = ref<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>('lg')

  /**
   * 是否全屏模式
   */
  const isFullscreen = ref(false)

  /**
   * Toast 消息列表
   */
  const toasts = ref<Toast[]>([])

  /**
   * 模态框状态
   */
  const modals = ref<Record<string, ModalState>>({})

  /**
   * 面包屑导航
   */
  const breadcrumbs = ref<BreadcrumbItem[]>([])

  // ==================== 私有变量 ====================

  let scrollHandler: (() => void) | null = null
  let fullscreenHandler: (() => void) | null = null

  // ==================== 计算属性 ====================

  /**
   * 是否是暗色模式
   */
  const isDark = computed(() => theme.value === 'dark')

  /**
   * 是否是移动端
   */
  const isMobile = computed(() => breakpoint.value === 'xs' || breakpoint.value === 'sm')

  /**
   * 是否有未关闭的 Toast
   */
  const hasToasts = computed(() => toasts.value.length > 0)

  /**
   * 是否有打开的模态框
   */
  const hasOpenModals = computed(() => Object.values(modals.value).some((m) => m.isOpen))

  // ==================== 主题方法 ====================

  /**
   * 初始化主题
   */
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) {
      theme.value = savedTheme
      applyThemeToDom(savedTheme)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme.value = 'dark'
      applyThemeToDom('dark')
    }
  }

  /**
   * 应用主题到 DOM
   */
  const applyThemeToDom = (newTheme: Theme) => {
    const root = document.documentElement
    root.setAttribute('data-theme', newTheme)
    if (newTheme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
  }

  /**
   * 设置主题
   */
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    applyThemeToDom(newTheme)
    localStorage.setItem('theme', newTheme)
    savePreferences()
  }

  /**
   * 切换主题
   */
  const toggleTheme = () => {
    const newTheme = theme.value === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  // ==================== 菜单方法 ====================

  const toggleMenu = () => {
    menuOpen.value = !menuOpen.value
  }

  const closeMenu = () => {
    menuOpen.value = false
  }

  const openMenu = () => {
    menuOpen.value = true
  }

  // ==================== 加载状态方法 ====================

  const setLoading = (isLoading: boolean) => {
    loading.value = isLoading
  }

  // ==================== 搜索方法 ====================

  const toggleSearch = () => {
    isSearchOpen.value = !isSearchOpen.value
  }

  const openSearch = () => {
    isSearchOpen.value = true
  }

  const closeSearch = () => {
    isSearchOpen.value = false
  }

  // ==================== 侧边栏方法 ====================

  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  const openSidebar = () => {
    isSidebarOpen.value = true
  }

  const closeSidebar = () => {
    isSidebarOpen.value = false
  }

  // ==================== Toast 方法 ====================

  const showToast = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    duration: number = 3000
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const toast: Toast = {
      id,
      message,
      type,
      duration,
      timestamp: Date.now(),
    }
    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }

    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearToasts = () => {
    toasts.value = []
  }

  // ==================== 模态框方法 ====================

  const openModal = (name: string, data?: unknown) => {
    modals.value[name] = { isOpen: true, data }
  }

  const closeModal = (name: string) => {
    if (modals.value[name]) {
      modals.value[name].isOpen = false
      modals.value[name].data = undefined
    }
  }

  const toggleModal = (name: string, data?: unknown) => {
    if (modals.value[name]?.isOpen) {
      closeModal(name)
    } else {
      openModal(name, data)
    }
  }

  // ==================== 面包屑方法 ====================

  const setBreadcrumbs = (items: BreadcrumbItem[]) => {
    breadcrumbs.value = items
  }

  const clearBreadcrumbs = () => {
    breadcrumbs.value = []
  }

  // ==================== 断点方法 ====================

  const setBreakpoint = (newBreakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl') => {
    breakpoint.value = newBreakpoint
  }

  // ==================== 全屏方法 ====================

  const toggleFullscreen = () => {
    if (isFullscreen.value) {
      exitFullscreen()
    } else {
      enterFullscreen()
    }
  }

  const enterFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error)
      isFullscreen.value = true
    }
  }

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(console.error)
      isFullscreen.value = false
    }
  }

  // ==================== 滚动监听 ====================

  const initScrollListener = () => {
    if (scrollHandler) return

    scrollHandler = throttle(() => {
      scrollToTop.value = window.scrollY > 500
    }, 100)

    window.addEventListener('scroll', scrollHandler, { passive: true })
  }

  const removeScrollListener = () => {
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler)
      scrollHandler = null
    }
  }

  // ==================== 全屏监听 ====================

  const initFullscreenListener = () => {
    if (fullscreenHandler) return

    fullscreenHandler = () => {
      isFullscreen.value = !!document.fullscreenElement
    }

    document.addEventListener('fullscreenchange', fullscreenHandler)
  }

  const removeFullscreenListener = () => {
    if (fullscreenHandler) {
      document.removeEventListener('fullscreenchange', fullscreenHandler)
      fullscreenHandler = null
    }
  }

  // ==================== 存储方法 ====================

  const savePreferences = () => {
    try {
      const data = {
        theme: theme.value,
        isNavFixed: isNavFixed.value,
      }
      localStorage.setItem('app_preferences', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save app preferences:', error)
    }
  }

  const loadPreferences = () => {
    try {
      const data = localStorage.getItem('app_preferences')
      if (data) {
        const parsed = JSON.parse(data)
        if (parsed.theme) theme.value = parsed.theme
        if (typeof parsed.isNavFixed === 'boolean') isNavFixed.value = parsed.isNavFixed
      }
    } catch (error) {
      console.error('Failed to load app preferences:', error)
    }
  }

  // ==================== 重置和清理 ====================

  const reset = () => {
    theme.value = 'light'
    language.value = 'zh'
    loading.value = false
    menuOpen.value = false
    scrollToTop.value = false
    isNavFixed.value = true
    isSearchOpen.value = false
    isSidebarOpen.value = false
    isFullscreen.value = false
    toasts.value = []
    modals.value = {}
    breadcrumbs.value = []
    savePreferences()
  }

  /**
   * 清理所有事件监听器（在应用卸载时调用）
   */
  const dispose = () => {
    removeScrollListener()
    removeFullscreenListener()
  }

  // ==================== 初始化 ====================

  const initialize = () => {
    loadPreferences()
    initTheme()
    initScrollListener()
    initFullscreenListener()
  }

  return {
    // 核心状态
    theme,
    language,
    loading,
    menuOpen,
    scrollToTop,

    // UI 扩展状态
    isNavFixed,
    isSearchOpen,
    isSidebarOpen,
    breakpoint,
    isFullscreen,
    toasts,
    modals,
    breadcrumbs,

    // 计算属性
    isDark,
    isMobile,
    hasToasts,
    hasOpenModals,

    // 主题方法
    setTheme,
    toggleTheme,

    // 菜单方法
    toggleMenu,
    closeMenu,
    openMenu,

    // 加载状态
    setLoading,

    // 搜索方法
    toggleSearch,
    openSearch,
    closeSearch,

    // 侧边栏方法
    toggleSidebar,
    openSidebar,
    closeSidebar,

    // Toast 方法
    showToast,
    removeToast,
    clearToasts,

    // 模态框方法
    openModal,
    closeModal,
    toggleModal,

    // 面包屑方法
    setBreadcrumbs,
    clearBreadcrumbs,

    // 断点方法
    setBreakpoint,

    // 全屏方法
    toggleFullscreen,
    enterFullscreen,
    exitFullscreen,

    // 生命周期
    initialize,
    dispose,
    reset,
  }
})