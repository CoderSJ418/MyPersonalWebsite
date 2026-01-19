import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Theme, Language } from '@/types/app'

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

  const handleScroll = () => {
    scrollToTop.value = window.scrollY > 500
  }

  initTheme()
  window.addEventListener('scroll', handleScroll)

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
    closeMenu,
    handleScroll
  }
})