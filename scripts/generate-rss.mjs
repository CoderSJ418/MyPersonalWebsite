import fs from 'fs'
import path from 'path'

const OUTPUT_FILE = path.resolve('public/rss.xml')

const BASE_URL = process.env.VITE_SITE_URL || 'https://shejie.github.io'
const SITE_NAME = '佘杰 - 前端开发工程师'
const SITE_DESCRIPTION = '分享 Vue 3、TypeScript、前端工程化等技术文章'

const indexPath = path.resolve('src/assets/data/blog-index.json')
const posts = JSON.parse(fs.readFileSync(indexPath, 'utf-8'))

const items = posts
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  .map((post) => `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${BASE_URL}/blog/${post.id}</link>
    <description>${escapeXml(post.excerpt)}</description>
    <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    <guid isPermaLink="true">${BASE_URL}/blog/${post.id}</guid>
    <author>${post.author || '佘杰'}</author>
    ${post.tags.map((tag) => `    <category>${escapeXml(tag)}</category>`).join('\n')}
  </item>`)
  .join('\n')

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${BASE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

fs.writeFileSync(OUTPUT_FILE, rss, 'utf-8')
console.log(`RSS feed generated: ${OUTPUT_FILE} (${posts.length} posts)`)

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
