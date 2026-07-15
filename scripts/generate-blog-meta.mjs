/**
 * generate-blog-meta.mjs
 *
 * Build-time script: reads all .md files from src/assets/blog/,
 * extracts frontmatter via gray-matter, and outputs a lightweight
 * blog-meta.json (metadata only, no content) to src/assets/data/.
 *
 * Usage: node scripts/generate-blog-meta.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = resolve(__dirname, '..')

const BLOG_DIR = resolve(ROOT, 'src/assets/blog')
const OUTPUT_FILE = resolve(ROOT, 'src/assets/data/blog-meta.json')

function generateBlogMeta() {
  // Read all .md files
  const files = readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.md'))
    .sort((a, b) => {
      const numA = parseInt(a, 10)
      const numB = parseInt(b, 10)
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB
      return a.localeCompare(b)
    })

  if (files.length === 0) {
    console.warn('[generate-blog-meta] No .md files found in', BLOG_DIR)
    return
  }

  const posts = []

  for (const file of files) {
    const filepath = resolve(BLOG_DIR, file)
    const raw = readFileSync(filepath, 'utf-8')
    const { data } = matter(raw)

    const id = String(data.id ?? file.replace(/\.md$/, ''))

    posts.push({
      id,
      title: data.title ?? `Blog Post ${id}`,
      excerpt: data.excerpt ?? '',
      author: data.author ?? '佘杰',
      publishedAt: data.date ?? new Date().toISOString().slice(0, 10),
      updatedAt: data.updatedAt ?? data.date ?? new Date().toISOString().slice(0, 10),
      tags: data.tags ?? [],
      readTime: data.readTime ?? 5,
      coverImage: data.coverImage ?? '/images/blog/default.svg',
      category: data.category ?? '',
    })
  }

  // Sort by publishedAt descending
  posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  // Ensure output directory exists
  mkdirSync(dirname(OUTPUT_FILE), { recursive: true })

  // Write JSON
  writeFileSync(OUTPUT_FILE, JSON.stringify(posts, null, 2) + '\n', 'utf-8')

  console.log(`[generate-blog-meta] Generated ${posts.length} posts → ${OUTPUT_FILE}`)
  console.log(`[generate-blog-meta] File size: ${(Buffer.byteLength(JSON.stringify(posts), 'utf-8') / 1024).toFixed(1)} KB`)
}

generateBlogMeta()