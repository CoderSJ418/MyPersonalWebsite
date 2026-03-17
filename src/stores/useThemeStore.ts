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
   * @description 根据 isDark 状态设置 data-theme 属性，让 CSS 文件处理颜色变量
   */
  const applyTheme = () => {
    const theme = getTheme(state.value.currentTheme)
    if (!theme) return

    const root = document.documentElement

    // 关键修复：根据 isDark 状态设置正确的 data-theme 值
    // CSS 文件中使用 [data-theme="dark"] 和 [data-theme="light"] 选择器
    // 来控制深色/浅色模式的颜色变量
    const themeMode = state.value.isDark ? 'dark' : 'light'
    root.setAttribute('data-theme', themeMode)

    // 同时设置 class 以兼容 Tailwind 的 darkMode: 'class' 配置
    if (state.value.isDark) {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }

    // 只设置字体变量，不覆盖颜色变量
    // 颜色变量由 CSS 文件中的 [data-theme="dark/light"] 选择器控制
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
