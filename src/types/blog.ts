export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  updatedAt: string
  tags: string[]
  readTime: number
  coverImage?: string
}

export interface BlogFilter {
  tag?: string
  searchQuery?: string
}