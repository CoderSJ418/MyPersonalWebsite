export type Language = 'zh' | 'en'

export interface AppState {
  language: Language
  loading: boolean
  menuOpen: boolean
  scrollToTop: boolean
}

export interface RouteMeta {
  title: string
  description?: string
}
