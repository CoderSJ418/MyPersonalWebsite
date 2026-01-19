/**
 * SEO 工具函数
 * 用于生成和管理 SEO 相关的标签和结构化数据
 */

export interface SEOConfig {
  title: string
  description: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  author?: string
  publishDate?: string
  modifiedDate?: string
  category?: string
  tags?: string[]
}

export interface StructuredData {
  '@context': string
  '@type': string
  [key: string]: any
}

/**
 * 更新页面标题
 */
export const setPageTitle = (title: string, suffix = ' - 佘杰') => {
  document.title = `${title}${suffix}`
}

/**
 * 更新 Meta 描述
 */
export const setMetaDescription = (description: string) => {
  let metaTag = document.querySelector('meta[name="description"]') as HTMLMetaElement
  if (!metaTag) {
    metaTag = document.createElement('meta')
    metaTag.name = 'description'
    document.head.appendChild(metaTag)
  }
  metaTag.content = description
}

/**
 * 更新 Meta 关键词
 */
export const setMetaKeywords = (keywords: string) => {
  let metaTag = document.querySelector('meta[name="keywords"]') as HTMLMetaElement
  if (!metaTag) {
    metaTag = document.createElement('meta')
    metaTag.name = 'keywords'
    document.head.appendChild(metaTag)
  }
  metaTag.content = keywords
}

/**
 * 更新 Canonical URL
 */
export const setCanonicalUrl = (url: string) => {
  let linkTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
  if (!linkTag) {
    linkTag = document.createElement('link')
    linkTag.rel = 'canonical'
    document.head.appendChild(linkTag)
  }
  linkTag.href = url
}

/**
 * 更新 Open Graph 标签
 */
export const setOpenGraph = (config: SEOConfig) => {
  const ogTags = [
    { property: 'og:title', content: config.title },
    { property: 'og:description', content: config.description },
    { property: 'og:type', content: config.type || 'website' },
    { property: 'og:url', content: config.url || window.location.href }
  ]

  if (config.image) {
    ogTags.push({ property: 'og:image', content: config.image })
    ogTags.push({ property: 'og:image:alt', content: config.title })
  }

  if (config.author) {
    ogTags.push({ property: 'og:site_name', content: config.author })
  }

  ogTags.forEach((tag) => {
    let metaTag = document.querySelector(`meta[property="${tag.property}"]`) as HTMLMetaElement
    if (!metaTag) {
      metaTag = document.createElement('meta')
      metaTag.setAttribute('property', tag.property)
      document.head.appendChild(metaTag)
    }
    metaTag.content = tag.content
  })
}

/**
 * 更新 Twitter Card 标签
 */
export const setTwitterCard = (config: SEOConfig) => {
  const twitterTags = [
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: config.title },
    { name: 'twitter:description', content: config.description }
  ]

  if (config.image) {
    twitterTags.push({ name: 'twitter:image', content: config.image })
  }

  twitterTags.forEach((tag) => {
    let metaTag = document.querySelector(`meta[name="${tag.name}"]`) as HTMLMetaElement
    if (!metaTag) {
      metaTag = document.createElement('meta')
      metaTag.name = tag.name
      document.head.appendChild(metaTag)
    }
    metaTag.content = tag.content
  })
}

/**
 * 生成 Person 结构化数据
 */
export const generatePersonData = (person: {
  name: string
  jobTitle: string
  url: string
  image?: string
  email?: string
  sameAs?: string[]
}): StructuredData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.jobTitle,
    url: person.url,
    image: person.image,
    email: person.email,
    sameAs: person.sameAs || [],
    knowsAbout: ['Vue.js', 'JavaScript', 'TypeScript', 'Frontend Development', 'Web Development']
  }
}

/**
 * 生成 WebSite 结构化数据
 */
export const generateWebsiteData = (website: {
  name: string
  url: string
  description: string
  author?: string
}): StructuredData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: website.name,
    url: website.url,
    description: website.description,
    author: website.author,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${website.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  }
}

/**
 * 生成 Article 结构化数据
 */
export const generateArticleData = (article: {
  headline: string
  image?: string
  author: string
  publishDate: string
  modifiedDate?: string
  description: string
  url: string
  category?: string
  tags?: string[]
}): StructuredData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    image: article.image,
    author: {
      '@type': 'Person',
      name: article.author
    },
    datePublished: article.publishDate,
    dateModified: article.modifiedDate || article.publishDate,
    description: article.description,
    url: article.url,
    articleSection: article.category,
    keywords: article.tags?.join(', ')
  }
}

/**
 * 生成 BreadcrumbList 结构化数据
 */
export const generateBreadcrumbData = (items: Array<{ name: string; url: string }>): StructuredData => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}

/**
 * 插入结构化数据到页面
 */
export const insertStructuredData = (data: StructuredData) => {
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.text = JSON.stringify(data)
  document.head.appendChild(script)
}

/**
 * 移除所有结构化数据
 */
export const removeStructuredData = () => {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]')
  scripts.forEach((script) => script.remove())
}

/**
 * 综合设置 SEO
 */
export const setSEO = (config: SEOConfig) => {
  setPageTitle(config.title)
  setMetaDescription(config.description)

  if (config.keywords) {
    setMetaKeywords(config.keywords)
  }

  if (config.url) {
    setCanonicalUrl(config.url)
  }

  setOpenGraph(config)
  setTwitterCard(config)
}

/**
 * 生成完整的 SEO 配置
 */
export const createSEOConfig = (
  title: string,
  description: string,
  options?: Partial<SEOConfig>
): SEOConfig => {
  return {
    title,
    description,
    url: window.location.href,
    type: 'website',
    author: '佘杰',
    ...options
  }
}

/**
 * 预加载关键资源
 */
export const preloadResource = (href: string, as: 'script' | 'style' | 'font' | 'image') => {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = href
  link.as = as

  if (as === 'font') {
    link.crossOrigin = 'anonymous'
  }

  document.head.appendChild(link)
}

/**
 * 预连接到外部域名
 */
export const preconnectTo = (href: string) => {
  const link = document.createElement('link')
  link.rel = 'preconnect'
  link.href = href
  document.head.appendChild(link)
}

/**
 * DNS 预解析
 */
export const dnsPrefetch = (href: string) => {
  const link = document.createElement('link')
  link.rel = 'dns-prefetch'
  link.href = href
  document.head.appendChild(link)
}

/**
 * 生成 sitemap XML
 */
export const generateSitemapXML = (urls: Array<{ url: string; lastmod?: string; changefreq?: string; priority?: number }>) => {
  const xml = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']

  urls.forEach((item) => {
    xml.push('  <url>')
    xml.push(`    <loc>${item.url}</loc>`)
    if (item.lastmod) xml.push(`    <lastmod>${item.lastmod}</lastmod>`)
    if (item.changefreq) xml.push(`    <changefreq>${item.changefreq}</changefreq>`)
    if (item.priority) xml.push(`    <priority>${item.priority}</priority>`)
    xml.push('  </url>')
  })

  xml.push('</urlset>')
  return xml.join('\n')
}

/**
 * 生成 robots.txt 内容
 */
export const generateRobotsTxt = (sitemapUrl: string, disallow: string[] = []) => {
  const lines = ['User-agent: *']

  if (disallow.length > 0) {
    disallow.forEach((path) => {
      lines.push(`Disallow: ${path}`)
    })
  }

  lines.push('')
  lines.push(`Sitemap: ${sitemapUrl}`)
  lines.push('')
  lines.push('# Allow search engines to crawl the site')
  lines.push('Disallow:')

  return lines.join('\n')
}
