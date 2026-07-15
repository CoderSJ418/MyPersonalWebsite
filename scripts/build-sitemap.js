/**
 * 构建 Sitemap 和 RSS feed
 * 在构建时自动生成
 */

import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const baseUrl = 'https://my-personal-website-eta-murex.vercel.app'
const today = new Date().toISOString().split('T')[0]
const labEffects = JSON.parse(
  readFileSync(resolve(process.cwd(), 'src/assets/data/lab-effects.json'), 'utf-8')
)

const routes = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/about', priority: 0.9, changefreq: 'monthly' },
  { path: '/projects', priority: 0.9, changefreq: 'weekly' },
  { path: '/skills', priority: 0.8, changefreq: 'monthly' },
  { path: '/experience', priority: 0.8, changefreq: 'monthly' },
  { path: '/education', priority: 0.7, changefreq: 'monthly' },
  { path: '/blog', priority: 0.9, changefreq: 'weekly' },
  { path: '/contact', priority: 0.7, changefreq: 'monthly' },
  { path: '/lab', priority: 0.8, changefreq: 'monthly' },
  ...labEffects.map((effect) => ({
    path: `/lab/${effect.id}`,
    priority: 0.7,
    changefreq: 'monthly'
  }))
]

// ---- Sitemap ----

function generateSitemap() {
  const xml = ['<?xml version="1.0" encoding="UTF-8"?>']
  xml.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

  routes.forEach((route) => {
    xml.push('  <url>')
    xml.push(`    <loc>${baseUrl}${route.path}</loc>`)
    xml.push(`    <lastmod>${today}</lastmod>`)
    xml.push(`    <changefreq>${route.changefreq}</changefreq>`)
    xml.push(`    <priority>${route.priority}</priority>`)
    xml.push('  </url>')
  })

  xml.push('</urlset>')
  return xml.join('\n')
}

// ---- RSS ----

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function generateRss() {
  const blogIndex = resolve(process.cwd(), 'src/assets/data/blog-index.json')
  const posts = JSON.parse(readFileSync(blogIndex, 'utf-8'))

  const items = posts
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .map((post) => `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${baseUrl}/blog/${post.id}</link>
    <description>${escapeXml(post.excerpt)}</description>
    <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    <guid isPermaLink="true">${baseUrl}/blog/${post.id}</guid>
    <author>${post.author || '佘杰'}</author>
  </item>`)
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>佘杰 - 前端开发工程师</title>
    <link>${baseUrl}</link>
    <description>分享 Vue 3、TypeScript、前端工程化等技术文章</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`
}

// ---- Execute ----

const sitemapPath = resolve(process.cwd(), 'dist', 'sitemap.xml')
writeFileSync(sitemapPath, generateSitemap(), 'utf-8')
console.log(`Sitemap generated: ${sitemapPath}`)

const rssPath = resolve(process.cwd(), 'public', 'rss.xml')
writeFileSync(rssPath, generateRss(), 'utf-8')
console.log(`RSS feed generated: ${rssPath}`)
