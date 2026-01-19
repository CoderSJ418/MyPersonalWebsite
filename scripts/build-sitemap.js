/**
 * 构建 Sitemap 脚本
 * 在构建时自动生成 sitemap.xml
 */

import { writeFileSync } from 'fs'
import { resolve } from 'path'

const baseUrl = 'https://shejie.dev'
const today = new Date().toISOString().split('T')[0]

// 网站路由配置
const routes = [
  {
    path: '/',
    priority: 1.0,
    changefreq: 'weekly'
  },
  {
    path: '/projects',
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    path: '/skills',
    priority: 0.8,
    changefreq: 'monthly'
  },
  {
    path: '/blog',
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    path: '/contact',
    priority: 0.7,
    changefreq: 'monthly'
  }
]

// 生成 XML
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

// 写入文件
function writeSitemap() {
  const sitemapContent = generateSitemap()
  const outputPath = resolve(process.cwd(), 'dist', 'sitemap.xml')

  writeFileSync(outputPath, sitemapContent, 'utf-8')
  console.log(`✅ Sitemap generated: ${outputPath}`)
}

// 执行
writeSitemap()