/**
 * 博客相关类型定义
 */

/**
 * 博客文章
 */
export interface BlogPost {
  id: string
  title: string
  slug?: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  updatedAt: string
  tags: string[]
  readTime: number
  coverImage?: string
  category?: string
  codeVersion?: {
    vue?: string
    typescript?: string
    [key: string]: string | undefined
  }
}

/**
 * 博客过滤器
 */
export interface BlogFilter {
  tag?: string
  searchQuery?: string
  category?: string
}