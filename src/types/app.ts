export type Theme = 'light' | 'dark'
export type Language = 'zh' | 'en'

export interface AppState {
  theme: Theme
  language: Language
  loading: boolean
  menuOpen: boolean
  scrollToTop: boolean
}

export interface RouteMeta {
  title: string
  description?: string
}