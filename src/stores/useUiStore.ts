import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * UI Store
 * 管理 UI 相关的状态，如主题、导航、模态框等
 */
export const useUiStore = defineStore('ui', () => {
  // ==================== 状态 ====================

  /**
   * 当前主题
   */
  const theme = ref<'light' | 'dark' | 'auto'>('auto')

  /**
   * 导航栏是否固定
   */
  const isNavFixed = ref<boolean>(true)

  /**
   * 移动端菜单是否打开
   */
  const isMobileMenuOpen = ref<boolean>(false)

  /**
   * 搜索框是否打开
   */
  const isSearchOpen = ref<boolean>(false)

  /**
   * 加载状态
   */
  const isLoading = ref<boolean>(false)

  /**
   * Toast 消息列表
   */
  const toasts = ref<
    Array<{
      id: string
      message: string
      type: 'success' | 'error' | 'warning' | 'info'
      duration: number
      timestamp: number
    }>
  >([])

  /**
   * 模态框状态
   */
  const modals = ref<
    Record<
      string,
      {
        isOpen: boolean
        data?: any
      }
    >
  >({})

  /**
   * 面包屑导航
   */
  const breadcrumbs = ref<
    Array<{
      text: string
      path: string
      disabled?: boolean
    }>
  >([])

  /**
   * 侧边栏是否打开
   */
  const isSidebarOpen = ref<boolean>(false)

  /**
   * 当前断点
   */
  const breakpoint = ref<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>('lg')

  /**
   * 是否全屏模式
   */
  const isFullscreen = ref<boolean>(false)

  // ==================== 计算属性 ====================

  /**
   * 实际应用的主题
   */
  const appliedTheme = computed(() => {
    if (theme.value === 'auto') {
      // 根据系统偏好自动选择
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }
    return theme.value
  })

  /**
   * 是否是暗色模式
   */
  const isDark = computed(() => appliedTheme.value === 'dark')

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
  const hasOpenModals = computed(() =>
    Object.values(modals.value).some((m) => m.isOpen)
  )

  // ==================== 方法 ====================

  /**
   * 设置主题
   */
  function setTheme(newTheme: 'light' | 'dark' | 'auto') {
    theme.value = newTheme
    saveToLocalStorage()
  }

  /**
   * 切换主题
   */
  function toggleTheme() {
    if (theme.value === 'light') {
      setTheme('dark')
    } else if (theme.value === 'dark') {
      setTheme('auto')
    } else {
      setTheme('light')
    }
  }

  /**
   * 设置导航栏固定状态
   */
  function setNavFixed(fixed: boolean) {
    isNavFixed.value = fixed
  }

  /**
   * 切换移动端菜单
   */
  function toggleMobileMenu() {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }

  /**
   * 打开移动端菜单
   */
  function openMobileMenu() {
    isMobileMenuOpen.value = true
  }

  /**
   * 关闭移动端菜单
   */
  function closeMobileMenu() {
    isMobileMenuOpen.value = false
  }

  /**
   * 切换搜索框
   */
  function toggleSearch() {
    isSearchOpen.value = !isSearchOpen.value
  }

  /**
   * 打开搜索框
   */
  function openSearch() {
    isSearchOpen.value = true
  }

  /**
   * 关闭搜索框
   */
  function closeSearch() {
    isSearchOpen.value = false
  }

  /**
   * 设置加载状态
   */
  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  /**
   * 显示 Toast 消息
   */
  function showToast(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    duration: number = 3000
  ) {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const toast = {
      id,
      message,
      type,
      duration,
      timestamp: Date.now(),
    }
    toasts.value.push(toast)

    // 自动移除
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  /**
   * 移除 Toast 消息
   */
  function removeToast(id: string) {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  /**
   * 清除所有 Toast 消息
   */
  function clearToasts() {
    toasts.value = []
  }

  /**
   * 打开模态框
   */
  function openModal(name: string, data?: any) {
    modals.value[name] = {
      isOpen: true,
      data,
    }
  }

  /**
   * 关闭模态框
   */
  function closeModal(name: string) {
    if (modals.value[name]) {
      modals.value[name].isOpen = false
      modals.value[name].data = undefined
    }
  }

  /**
   * 切换模态框
   */
  function toggleModal(name: string, data?: any) {
    if (modals.value[name]?.isOpen) {
      closeModal(name)
    } else {
      openModal(name, data)
    }
  }

  /**
   * 设置面包屑导航
   */
  function setBreadcrumbs(breadcrumbs: Array<{ text: string; path: string; disabled?: boolean }>) {
    breadcrumbs.value = breadcrumbs
  }

  /**
   * 添加面包屑
   */
  function addBreadcrumb(item: { text: string; path: string; disabled?: boolean }) {
    breadcrumbs.value.push(item)
  }

  /**
   * 移除面包屑
   */
  function removeBreadcrumb(index: number) {
    breadcrumbs.value.splice(index, 1)
  }

  /**
   * 清除面包屑
   */
  function clearBreadcrumbs() {
    breadcrumbs.value = []
  }

  /**
   * 切换侧边栏
   */
  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  /**
   * 打开侧边栏
   */
  function openSidebar() {
    isSidebarOpen.value = true
  }

  /**
   * 关闭侧边栏
   */
  function closeSidebar() {
    isSidebarOpen.value = false
  }

  /**
   * 设置断点
   */
  function setBreakpoint(newBreakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl') {
    breakpoint.value = newBreakpoint
  }

  /**
   * 切换全屏模式
   */
  function toggleFullscreen() {
    if (isFullscreen.value) {
      exitFullscreen()
    } else {
      enterFullscreen()
    }
  }

  /**
   * 进入全屏模式
   */
  function enterFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((error) => {
        console.error('Failed to enter fullscreen:', error)
      })
      isFullscreen.value = true
    }
  }

  /**
   * 退出全屏模式
   */
  function exitFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((error) => {
        console.error('Failed to exit fullscreen:', error)
      })
      isFullscreen.value = false
    }
  }

  /**
   * 重置所有 UI 状态
   */
  function reset() {
    theme.value = 'auto'
    isNavFixed.value = true
    isMobileMenuOpen.value = false
    isSearchOpen.value = false
    isLoading.value = false
    toasts.value = []
    modals.value = {}
    breadcrumbs.value = []
    isSidebarOpen.value = false
    isFullscreen.value = false
    saveToLocalStorage()
  }

  // ==================== 私有方法 ====================

  /**
   * 保存到本地存储
   */
  function saveToLocalStorage() {
    try {
      const data = {
        theme: theme.value,
        isNavFixed: isNavFixed.value,
      }
      localStorage.setItem('ui_preferences', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save UI preferences:', error)
    }
  }

  /**
   * 从本地存储加载
   */
  function loadFromLocalStorage() {
    try {
      const data = localStorage.getItem('ui_preferences')
      if (data) {
        const parsed = JSON.parse(data)
        if (parsed.theme) theme.value = parsed.theme
        if (typeof parsed.isNavFixed === 'boolean') isNavFixed.value = parsed.isNavFixed
      }
    } catch (error) {
      console.error('Failed to load UI preferences:', error)
    }
  }

  // ==================== 初始化 ====================

  // 从本地存储加载用户偏好
  loadFromLocalStorage()

  // 监听全屏变化
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })

  // 返回接口
  return {
    // 状态
    theme,
    isNavFixed,
    isMobileMenuOpen,
    isSearchOpen,
    isLoading,
    toasts,
    modals,
    breadcrumbs,
    isSidebarOpen,
    breakpoint,
    isFullscreen,

    // 计算属性
    appliedTheme,
    isDark,
    isMobile,
    hasToasts,
    hasOpenModals,

    // 方法 - 主题
    setTheme,
    toggleTheme,

    // 方法 - 导航
    setNavFixed,

    // 方法 - 移动端菜单
    toggleMobileMenu,
    openMobileMenu,
    closeMobileMenu,

    // 方法 - 搜索
    toggleSearch,
    openSearch,
    closeSearch,

    // 方法 - 加载状态
    setLoading,

    // 方法 - Toast
    showToast,
    removeToast,
    clearToasts,

    // 方法 - 模态框
    openModal,
    closeModal,
    toggleModal,

    // 方法 - 面包屑
    setBreadcrumbs,
    addBreadcrumb,
    removeBreadcrumb,
    clearBreadcrumbs,

    // 方法 - 侧边栏
    toggleSidebar,
    openSidebar,
    closeSidebar,

    // 方法 - 断点
    setBreakpoint,

    // 方法 - 全屏
    toggleFullscreen,
    enterFullscreen,
    exitFullscreen,

    // 方法 - 重置
    reset,
  }
})