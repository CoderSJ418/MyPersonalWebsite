import matter from 'gray-matter'
import type { BlogPost } from '@/types/blog'

/**
 * Blog post loader using Vite's import.meta.glob
 * Each .md file has YAML frontmatter + markdown body
 */
const blogModules = import.meta.glob('@/assets/blog/*.md', { query: '?raw', import: 'default' })

let cachedPosts: BlogPost[] | null = null

export async function loadBlogPosts(): Promise<BlogPost[]> {
  if (cachedPosts) {
    return cachedPosts
  }

  const posts: BlogPost[] = []

  for (const [filepath, loader] of Object.entries(blogModules)) {
    const raw = await loader() as string
    const { data, content } = matter(raw)

    // Extract ID from filename (e.g., "1-vue-3-composition-api-.md" → "1")
    const filename = filepath.split('/').pop() || ''
    const id = filename.split('-')[0]

    posts.push({
      id: String(data.id ?? id),
      title: data.title,
      excerpt: data.excerpt ?? '',
      content,
      author: data.author ?? '佘杰',
      publishedAt: data.date,
      updatedAt: data.updatedAt ?? data.date,
      tags: data.tags ?? [],
      readTime: data.readTime ?? 5,
      coverImage: data.coverImage ?? '/images/blog/default.svg',
      featured: data.featured ?? false,
      category: data.category ?? '',
    } as BlogPost)
  }

  cachedPosts = posts
  return posts
}

/**
 * Load a single blog post by ID
 */
export async function loadBlogPost(id: string): Promise<BlogPost | null> {
  const posts = await loadBlogPosts()
  return posts.find((p) => p.id === id) ?? null
}
