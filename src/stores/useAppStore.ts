import { defineStore } from 'pinia'
import { ref, onUnmounted } from 'vue'
import type { Theme, Language } from '@/types/app'

/**
 * 节流函数 - 优化高频事件处理
 */
function throttle<T extends (...args: any[]) => any>(fn: T, delay: number): T {
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

export const useAppStore = defineStore('app', () => {
  const theme = ref<Theme>('light')
  const language = ref<Language>('zh')
  const loading = ref(false)
  const menuOpen = ref(false)
  const scrollToTop = ref(false)

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) {
      theme.value = savedTheme
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme.value = 'dark'
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme.value === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  const setLoading = (isLoading: boolean) => {
    loading.value = isLoading
  }

  const toggleMenu = () => {
    menuOpen.value = !menuOpen.value
  }

  const closeMenu = () => {
    menuOpen.value = false
  }

  // 使用节流函数优化 scroll 事件处理
  const throttledHandleScroll = throttle(() => {
    scrollToTop.value = window.scrollY > 500
  }, 100) // 100ms 节流间隔

  initTheme()

  // 添加事件监听器
  window.addEventListener('scroll', throttledHandleScroll, { passive: true })

  // 清理事件监听器，防止内存泄漏
  onUnmounted(() => {
    window.removeEventListener('scroll', throttledHandleScroll)
  })

  return {
    theme,
    language,
    loading,
    menuOpen,
    scrollToTop,
    setTheme,
    toggleTheme,
    setLoading,
    toggleMenu,
    closeMenu
  }
})
