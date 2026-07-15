import type { BlogPost } from '@/types/blog'

export const createBlogPost = (
  id: string,
  title: string,
  publishedAt: string,
  tags: string[] = ['vue'],
  category = 'frontend'
): BlogPost => ({
  id,
  title,
  excerpt: `${title} excerpt`,
  author: 'Tester',
  publishedAt,
  updatedAt: publishedAt,
  tags,
  readTime: 3,
  category
})
