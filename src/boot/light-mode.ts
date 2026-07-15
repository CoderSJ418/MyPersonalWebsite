const LEGACY_THEME_KEYS = ['theme', 'theme-state'] as const

/**
 * Removes persisted multi-theme state before the first Vue render.
 */
export function enforceLightMode(): void {
  const root = document.documentElement
  root.classList.remove('dark', 'light')
  root.removeAttribute('data-theme')
  root.style.colorScheme = 'light'

  try {
    LEGACY_THEME_KEYS.forEach(key => localStorage.removeItem(key))

    const preferences = localStorage.getItem('app_preferences')
    if (!preferences) return

    const parsed: unknown = JSON.parse(preferences)
    if (typeof parsed !== 'object' || parsed === null) return

    const remaining = Object.fromEntries(
      Object.entries(parsed).filter(([key]) => key !== 'theme')
    )
    localStorage.setItem('app_preferences', JSON.stringify(remaining))
  } catch {
    // Storage can be unavailable in privacy-restricted contexts.
  }
}
