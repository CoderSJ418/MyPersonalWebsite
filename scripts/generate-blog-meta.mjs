/**
 * Generate and validate the metadata index for Markdown blog posts.
 * Use --check in CI to verify the committed index without modifying files.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const BLOG_DIR = resolve(ROOT, 'src/assets/blog')
const OUTPUT_FILE = resolve(ROOT, 'src/assets/data/blog-meta.json')
const CHECK_ONLY = process.argv.includes('--check')
const REQUIRED_YEARS = ['2024', '2025', '2026']
const MIN_POSTS_PER_YEAR = 6
const MIN_BODY_LENGTH = 800
const PLACEHOLDER_PATTERNS = ['由于内容较长，此处为简化版本', '实际内容为从', 'TODO']

const files = readdirSync(BLOG_DIR)
  .filter((file) => file.endsWith('.md'))
  .sort((a, b) => a.localeCompare(b, 'zh-CN', { numeric: true }))

const failures = []
const posts = files.map((file) => {
  const raw = readFileSync(resolve(BLOG_DIR, file), 'utf-8')
  const { data, content } = matter(raw)
  const id = String(data.id ?? file.replace(/\.md$/, ''))
  const requiredFields = [
    'title',
    'date',
    'updatedAt',
    'author',
    'tags',
    'readTime',
    'category',
    'excerpt'
  ]

  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === '') failures.push(`${file}: 缺少 ${field}`)
  }
  if (!Array.isArray(data.tags) || data.tags.length < 2)
    failures.push(`${file}: tags 至少需要 2 项`)
  if (!Number.isInteger(data.readTime) || data.readTime < 1)
    failures.push(`${file}: readTime 必须是正整数`)
  if (String(data.excerpt ?? '').trim().length < 40) failures.push(`${file}: excerpt 少于 40 字符`)
  if (content.trim().length < MIN_BODY_LENGTH)
    failures.push(`${file}: 正文少于 ${MIN_BODY_LENGTH} 字符`)
  for (const pattern of PLACEHOLDER_PATTERNS) {
    if (content.includes(pattern)) failures.push(`${file}: 包含占位文本“${pattern}”`)
  }

  const publishedAt = String(data.date ?? '')
  const updatedAt = String(data.updatedAt ?? data.date ?? '')
  if (Number.isNaN(Date.parse(publishedAt))) failures.push(`${file}: date 不是有效日期`)
  if (Number.isNaN(Date.parse(updatedAt))) failures.push(`${file}: updatedAt 不是有效日期`)

  return {
    id,
    title: String(data.title ?? `Blog Post ${id}`),
    excerpt: String(data.excerpt ?? ''),
    author: String(data.author ?? '佘杰'),
    publishedAt,
    updatedAt,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readTime: Number(data.readTime ?? 5),
    coverImage: String(data.coverImage ?? '/images/blog/default.svg'),
    category: String(data.category ?? '')
  }
})

const duplicateValues = (values) => values.filter((value, index) => values.indexOf(value) !== index)
for (const id of new Set(duplicateValues(posts.map((post) => post.id))))
  failures.push(`重复 id: ${id}`)
for (const title of new Set(duplicateValues(posts.map((post) => post.title))))
  failures.push(`重复标题: ${title}`)
for (const year of REQUIRED_YEARS) {
  const count = posts.filter((post) => post.publishedAt.startsWith(year)).length
  if (count < MIN_POSTS_PER_YEAR)
    failures.push(`${year} 年仅 ${count} 篇，至少需要 ${MIN_POSTS_PER_YEAR} 篇`)
}

if (failures.length > 0) {
  console.error(`[blog-content] 校验失败（${failures.length} 项）`)
  failures.forEach((failure) => console.error(`- ${failure}`))
  process.exit(1)
}

posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
const output = `${JSON.stringify(posts, null, 2)}\n`

if (CHECK_ONLY) {
  const current = existsSync(OUTPUT_FILE) ? readFileSync(OUTPUT_FILE, 'utf-8') : ''
  if (current !== output) {
    console.error('[blog-content] blog-meta.json 已过期，请运行 npm run content:generate')
    process.exit(1)
  }
  console.log(`[blog-content] ${posts.length} 篇文章通过校验，元数据已同步`)
} else {
  mkdirSync(dirname(OUTPUT_FILE), { recursive: true })
  writeFileSync(OUTPUT_FILE, output, 'utf-8')
  console.log(`[blog-content] 已生成 ${posts.length} 篇文章元数据 → ${OUTPUT_FILE}`)
}
