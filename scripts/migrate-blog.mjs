import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const rootDir = process.cwd()
const blogDir = path.join(rootDir, 'src/assets/blog')
const indexPath = path.join(rootDir, 'src/assets/data/blog-index.json')

if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true })
}

const posts = JSON.parse(fs.readFileSync(indexPath, 'utf-8'))
console.log(`Migrating ${posts.length} posts...`)

posts.forEach((post) => {
  const { content, ...meta } = post

  const frontmatter = {
    title: meta.title,
    date: meta.publishedAt,
    updatedAt: meta.updatedAt || meta.publishedAt,
    author: meta.author || '佘杰',
    tags: meta.tags,
    category: meta.category,
    readTime: meta.readTime,
    coverImage: meta.coverImage,
    featured: meta.featured,
    excerpt: meta.excerpt,
  }

  const fileContent = matter.stringify(content.trim(), frontmatter)
  const filename = `${post.id}.md`
  const filepath = path.join(blogDir, filename)

  fs.writeFileSync(filepath, fileContent, 'utf-8')
  console.log(`  ${filename} → ${meta.title}`)
})

// Create index file mapping id → filename
const indexContent = posts.map((post) => ({
  id: post.id,
  title: post.title,
  file: `${post.id}.md`,
}))

fs.writeFileSync(
  path.join(blogDir, 'index.json'),
  JSON.stringify(indexContent, null, 2),
  'utf-8'
)

console.log(`\nDone! Migrated ${posts.length} posts to src/assets/blog/`)
