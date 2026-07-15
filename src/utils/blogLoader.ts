import type { BlogPost, BlogPostMeta } from '@/types/blog'
import { logger } from '@/utils/logger'

// Buffer polyfill for gray-matter (browser doesn't have Node.js Buffer)
// Kept as static import — small footprint, must be set before gray-matter runs
import { Buffer } from 'buffer'
  ; (globalThis as Record<string, unknown>).Buffer = Buffer

/**
 * Blog post loader — Two-Level Loading Architecture
 *
 * Level 1 (sync): Static blog-meta.json (~2KB) — metadata only, no content
 *   → Blog list page renders instantly, no loading state needed
 *
 * Level 2 (async): Individual .md files loaded on demand
 *   → Detail page loads only the specific post's content
 *   → gray-matter dynamically imported only in this path (saves ~87KB from list page)
 *
 * ID mapping rule: filename = id (1.md → id="1", 10.md → id="10")
 */

// ── Level 1: Static metadata index (build-time generated) ──
import blogMetaRaw from '@/assets/data/blog-meta.json'

// Cast JSON to typed array — blog-meta.json is generated at build time
const blogMeta: BlogPostMeta[] = blogMetaRaw as BlogPostMeta[]

// ── Level 2: Lazy glob for on-demand content loading ──
const blogModules = import.meta.glob('../assets/blog/*.md', {
  eager: false,
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>

// ── Dynamic import for gray-matter (only loaded on detail page — saves ~87KB) ──
let matterFn: typeof import('gray-matter')['default'] | null = null

async function getMatter() {
  if (matterFn) return matterFn
  const mod = await import('gray-matter')
  matterFn = mod.default
  return matterFn
}

// ── Filename → id mapping (computed at build time, no content loaded) ──
interface BlogMapEntry {
  id: string
  filepath: string
}

const blogFileMap: BlogMapEntry[] = Object.keys(blogModules).map((filepath) => {
  const filename = filepath.split('/').pop() ?? ''
  const id = filename.replace(/\.md$/, '')
  return { id, filepath }
})

// ── Dev mode: console diagnostics ──
if (import.meta.env.DEV) {
  logger.debug(`[blogLoader] Static meta: ${blogMeta.length} posts, lazy glob: ${blogFileMap.length} modules`)
  if (blogMeta.length === 0) {
    logger.warn('[blogLoader] WARNING: blog-meta.json is empty — run: node scripts/generate-blog-meta.mjs')
  }
}

// ── Content cache: stores posts with full content loaded ──
const contentCache = new Map<string, BlogPost>()

/**
 * Level 1: Load all blog post metadata (SYNC — instant)
 * Returns BlogPost[] with content=undefined (metadata only)
 */
export function loadBlogPosts(): BlogPost[] {
  return blogMeta.map((meta) => {
    // If we have cached content, return the full post
    const cached = contentCache.get(meta.id)
    if (cached) return cached
    // Otherwise return metadata-only post (content is undefined)
    return { ...meta, content: undefined } as BlogPost
  })
}

/**
 * Level 2: Load a single blog post's full content (ASYNC)
 * Loads only the specific .md chunk, parses with gray-matter.
 */
export async function loadBlogPost(id: string): Promise<BlogPost | null> {
  // Check content cache first
  const cached = contentCache.get(id)
  if (cached) return cached

  // Check if metadata exists for this id
  const meta = blogMeta.find((m) => m.id === id)
  if (!meta) {
    if (import.meta.env.DEV) {
      logger.warn(`[blogLoader] No metadata for id="${id}"`)
    }
    return null
  }

  // Find the specific .md file
  const entry = blogFileMap.find((e) => e.id === id)
  if (!entry) {
    if (import.meta.env.DEV) {
      logger.warn(`[blogLoader] No file mapping for id="${id}"`)
    }
    // Return metadata-only post as fallback
    return { ...meta, content: undefined } as BlogPost
  }

  const loader = blogModules[entry.filepath]
  if (!loader) return null

  try {
    const raw = await loader()
    const matter = await getMatter()
    const { data, content } = matter(raw)
    const post: BlogPost = {
      ...meta,
      content,
      // Override with any data from the .md file that might differ
      title: data.title ?? meta.title,
      excerpt: data.excerpt ?? meta.excerpt,
      author: data.author ?? meta.author,
      publishedAt: data.date ?? meta.publishedAt,
      updatedAt: data.updatedAt ?? data.date ?? meta.updatedAt,
      tags: data.tags ?? meta.tags,
      readTime: data.readTime ?? meta.readTime,
      coverImage: data.coverImage ?? meta.coverImage,
      category: data.category ?? meta.category,
    }

    // Cache the full post
    contentCache.set(id, post)
    return post
  } catch (err) {
    logger.error(`[blogLoader] Error loading post ${id}:`, err)
    return null
  }
}

/**
 * Load content for a post that already has metadata
 * Used by BlogDetail to load content after metadata is displayed
 */
export async function loadPostContent(id: string): Promise<string | null> {
  // Check cache first
  const cached = contentCache.get(id)
  if (cached?.content) return cached.content

  const entry = blogFileMap.find((e) => e.id === id)
  if (!entry) return null

  const loader = blogModules[entry.filepath]
  if (!loader) return null

  try {
    const raw = await loader()
    const matter = await getMatter()
    const { content } = matter(raw)

    // Update cache with content
    const meta = blogMeta.find((m) => m.id === id)
    if (meta) {
      const post: BlogPost = { ...meta, content }
      contentCache.set(id, post)
    }

    return content
  } catch (err) {
    logger.error(`[blogLoader] Error loading content for post ${id}:`, err)
    return null
  }
}