/**
 * 博客相关类型定义
 */

/**
 * 博客文章元数据（无content，用于列表页瞬间渲染）
 * 构建时从 .md frontmatter 提取，静态导入 blog-meta.json
 */
export interface BlogPostMeta {
  id: string
  title: string
  slug?: string
  excerpt: string
  author: string
  publishedAt: string
  updatedAt: string
  tags: string[]
  readTime: number
  coverImage?: string
  category?: string
}

/**
 * 博客文章完整数据（含content，仅详情页按需加载）
 */
export interface BlogPost extends BlogPostMeta {
  content?: string
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