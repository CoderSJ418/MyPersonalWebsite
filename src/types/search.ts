/**
 * 搜索相关类型定义
 */

export interface SearchResultItem {
  id: string
  type: 'project' | 'skill' | 'blog'
  title: string
  description: string
  url: string
  highlight?: {
    title: string
    description: string
  }
  metadata?: {
    tags?: string[]
    category?: string
    level?: number
    author?: string
    publishedAt?: string
  }
}

export interface SearchResults {
  projects: SearchResultItem[]
  skills: SearchResultItem[]
  blogs: SearchResultItem[]
  total: number
}

export interface SearchHistoryItem {
  query: string
  timestamp: number
}

export interface SearchState {
  isOpen: boolean
  query: string
  results: SearchResults
  history: SearchHistoryItem[]
  selectedIndex: number
  loading: boolean
}