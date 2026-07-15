import { beforeEach, describe, expect, it } from 'vitest'

import {
  createSEOConfig,
  dnsPrefetch,
  generateArticleData,
  generateBreadcrumbData,
  generatePersonData,
  generateRobotsTxt,
  generateSitemapXML,
  generateWebsiteData,
  insertStructuredData,
  preconnectTo,
  preloadResource,
  removeStructuredData,
  setSEO
} from '@/utils/seo'

describe('seo utilities', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
  })

  it('creates and updates the complete metadata contract', () => {
    const config = createSEOConfig('Lab', 'Description', {
      keywords: 'vue,lab',
      image: '/preview.webp',
      url: 'https://example.com/lab',
      author: 'Author',
      type: 'article'
    })
    setSEO(config)
    setSEO(config)
    expect(document.title).toContain('Lab')
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      'Description'
    )
    expect(document.querySelector('meta[name="keywords"]')).not.toBeNull()
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toContain(
      '/lab'
    )
    expect(document.querySelector('meta[property="og:image"]')).not.toBeNull()
    expect(document.querySelector('meta[name="twitter:image"]')).not.toBeNull()
  })

  it('generates structured data variants', () => {
    const person = generatePersonData({
      name: 'Tester',
      jobTitle: 'Engineer',
      url: 'https://example.com'
    })
    const website = generateWebsiteData({
      name: 'Site',
      url: 'https://example.com',
      description: 'Description'
    })
    const article = generateArticleData({
      headline: 'Post',
      author: 'Tester',
      publishDate: '2026-01-01',
      description: 'Description',
      url: 'https://example.com/post',
      tags: ['vue', 'test']
    })
    const breadcrumb = generateBreadcrumbData([{ name: 'Home', url: '/' }])
    expect(person['@type']).toBe('Person')
    expect(website['@type']).toBe('WebSite')
    expect(article.keywords).toBe('vue, test')
    expect(breadcrumb.itemListElement).toHaveLength(1)
    insertStructuredData(article)
    expect(document.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(1)
    removeStructuredData()
    expect(document.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(0)
  })

  it('generates crawler files and resource hints', () => {
    preloadResource('/font.woff2', 'font')
    preloadResource('/app.js', 'script')
    preconnectTo('https://cdn.example.com')
    dnsPrefetch('https://api.example.com')
    expect(document.querySelectorAll('link')).toHaveLength(4)
    expect(document.querySelector('link[rel="preload"]')?.getAttribute('crossorigin')).toBe(
      'anonymous'
    )

    const sitemap = generateSitemapXML([
      {
        url: 'https://example.com/',
        lastmod: '2026-07-14',
        changefreq: 'weekly',
        priority: 1
      },
      { url: 'https://example.com/blog' }
    ])
    expect(sitemap).toContain('<priority>1</priority>')
    expect(generateRobotsTxt('https://example.com/sitemap.xml', ['/lab'])).toContain(
      'Disallow: /lab'
    )
    expect(generateRobotsTxt('https://example.com/sitemap.xml')).toContain('Sitemap:')
  })
})
