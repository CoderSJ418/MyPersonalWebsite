import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { themes, type DesignTheme, getDefaultTheme, getTheme } from '@/design-system/themes'

/**
 * 主题状态接口
 */
interface ThemeState {
  currentTheme: string
  isDark: boolean
}

export const useThemeStore = defineStore('theme', () => {
  // 当前选择的主题配置
  const state = ref<ThemeState>({
    currentTheme: 'professional-minimal', // 默认使用专业极简主题
    isDark: false // 默认关闭暗黑模式
  })

  // 字体加载状态
  const fontLoaded = ref<Set<string>>(new Set())
  const fontLoading = ref<Set<string>>(new Set())

  // 初始化标志
  const initialized = ref(false)

  // 调色板面板状态
  const isPaletteOpen = ref(false)

  /**
   * 从 localStorage 加载保存的偏好
   */
  const loadPreferences = () => {
    try {
      const saved = localStorage.getItem('theme-state')
      if (saved) {
        const parsed = JSON.parse(saved)

        // 验证并加载保存的配置
        if (getTheme(parsed.currentTheme)) {
          state.value.currentTheme = parsed.currentTheme
        }
        state.value.isDark = parsed.isDark || false
      }
    } catch (error) {
      console.error('加载主题偏好失败:', error)
    }

    applyTheme()
  }

  /**
   * 应用主题到 DOM
   */
  const applyTheme = () => {
    const theme = getTheme(state.value.currentTheme)
    if (!theme) return

    const root = document.documentElement

    // 设置主题
    root.setAttribute('data-theme', state.value.currentTheme)

    // 应用颜色变量 - 使用 design-tokens.css 的变量名
    root.style.setProperty('--primary-color', theme.colors.primary)
    root.style.setProperty('--secondary-color', theme.colors.secondary)
    root.style.setProperty('--accent-color', theme.colors.accent)

    // 背景色变量
    root.style.setProperty('--background-primary', theme.colors.background)
    root.style.setProperty('--background-secondary', theme.colors.surface)
    root.style.setProperty('--background-tertiary', theme.colors.background)
    root.style.setProperty('--background-card', theme.colors.surface)

    // 文字色变量
    root.style.setProperty('--text-primary', theme.colors.text)
    root.style.setProperty('--text-secondary', theme.colors.textSecondary)
    root.style.setProperty('--text-tertiary', theme.colors.textTertiary)

    // 边框色变量
    root.style.setProperty('--border-color', theme.colors.border)
    root.style.setProperty('--border-color-light', theme.colors.borderLight)
    root.style.setProperty('--border-color-dark', theme.colors.borderDark)

    // 应用字体变量
    root.style.setProperty('--font-display', theme.fonts.heading.family)
    root.style.setProperty('--font-body', theme.fonts.body.family)
    root.style.setProperty('--font-mono', theme.fonts.code.family)

    // 加载 Google Fonts
    loadGoogleFonts(theme)
  }

  /**
   * 加载 Google Fonts
   */
  const loadGoogleFonts = (theme: DesignTheme) => {
    const fontsToLoad = [theme.fonts.heading, theme.fonts.body, theme.fonts.code]

    fontsToLoad.forEach((font) => {
      if (!font.url) return

      const fontId = `${font.family.replace(/\s+/g, '-')}-${font.weight}`

      if (fontLoaded.value.has(fontId)) {
        return
      }

      if (fontLoading.value.has(fontId)) {
        return
      }

      fontLoading.value.add(fontId)

      const linkId = `google-fonts-${fontId}`
      let link = document.getElementById(linkId) as HTMLLinkElement

      if (!link) {
        link = document.createElement('link')
        link.id = linkId
        link.rel = 'stylesheet'
        link.href = font.url
        document.head.appendChild(link)

        link.onload = () => {
          fontLoaded.value.add(fontId)
          fontLoading.value.delete(fontId)
        }

        link.onerror = () => {
          console.error(`加载字体失败: ${font.family}`)
          fontLoading.value.delete(fontId)
        }
      }
    })
  }

  /**
   * 切换主题
   */
  const setTheme = (themeId: string) => {
    if (!getTheme(themeId)) return
    state.value.currentTheme = themeId
    savePreferences()
    applyTheme()
  }

  /**
   * 切换暗黑模式
   */
  const toggleDarkMode = () => {
    state.value.isDark = !state.value.isDark
    savePreferences()
    applyTheme()
  }

  /**
   * 保存偏好到 localStorage
   */
  const savePreferences = () => {
    try {
      localStorage.setItem('theme-state', JSON.stringify(state.value))
    } catch (error) {
      console.error('保存主题偏好失败:', error)
    }
  }

  /**
   * 重置为默认
   */
  const resetToDefault = () => {
    state.value.currentTheme = 'professional-minimal'
    state.value.isDark = false
    isPaletteOpen.value = false

    savePreferences()
    applyTheme()
  }

  /**
   * 打开调色板面板
   */
  const openPalette = () => {
    isPaletteOpen.value = true
  }

  /**
   * 关闭调色板面板
   */
  const closePalette = () => {
    isPaletteOpen.value = false
  }

  /**
   * 切换调色板面板
   */
  const togglePalette = () => {
    isPaletteOpen.value = !isPaletteOpen.value
  }

  /**
   * 获取当前主题对象
   */
  const currentTheme = computed(() => getTheme(state.value.currentTheme))

  /**
   * 获取所有可用的主题
   */
  const availableThemes = computed(() => {
    return Object.values(themes).map(theme => ({
      id: theme.id,
      name: theme.name,
      description: theme.description
    }))
  })

  // 监听变化并自动应用
  watch(
    () => state.value,
    () => {
      applyTheme()
    },
    { deep: true }
  )

  /**
   * 初始化主题 store
   * @description 在应用启动时调用，加载保存的偏好并应用主题
   */
  const initialize = () => {
    if (!initialized.value) {
      loadPreferences()
      initialized.value = true
    }
  }

  return {
    // 状态
    state,
    isDark: computed(() => state.value.isDark),
    isPaletteOpen,
    initialized,

    // 计算属性
    currentTheme,
    availableThemes,

    // 方法
    initialize,
    loadPreferences,
    applyTheme,
    setTheme,
    toggleDarkMode,
    openPalette,
    closePalette,
    togglePalette,
    resetToDefault
  }
})
