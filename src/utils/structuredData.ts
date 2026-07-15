import type { BlogPost } from '@/types/blog'
import type { Project } from '@/types/project'
import type { LabEffect, LabEffectMetadata } from '@/types/lab'

/**
 * Generate JSON-LD structured data for the Person schema
 * Used on the home page
 */
export function personStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: '佘杰',
    jobTitle: '前端开发工程师',
    url: typeof window !== 'undefined' ? window.location.origin : '',
    sameAs: [
      'https://github.com/shejie',
      'https://linkedin.com/in/shejie',
      'https://twitter.com/shejie',
    ],
    knowsAbout: ['Vue.js', 'TypeScript', '前端工程化', '性能优化', 'Vite', 'Pinia'],
  }
}

/**
 * Generate JSON-LD structured data for a BlogPosting schema
 */
export function blogPostStructuredData(post: BlogPost) {
  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/blog/${post.id}`
    : ''

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    url,
    image: post.coverImage ? `${typeof window !== 'undefined' ? window.location.origin : ''}${post.coverImage}` : undefined,
    keywords: post.tags.join(', '),
    articleSection: post.category,
    inLanguage: 'zh-CN',
  }
}

/**
 * Generate JSON-LD structured data for a Project schema
 */
export function projectStructuredData(project: Project) {
  const url = typeof window !== 'undefined'
    ? `${window.location.origin}/projects/${project.id}`
    : ''

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    url,
    dateCreated: project.createdAt,
    dateModified: project.updatedAt,
    author: {
      '@type': 'Person',
      name: '佘杰',
    },
    about: project.techStack.map((t) => t.name).join(', '),
    inLanguage: 'zh-CN',
  }
}

/**
 * Generate JSON-LD structured data for BreadcrumbList
 */
export function breadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: typeof window !== 'undefined' ? `${window.location.origin}${item.url}` : item.url,
    })),
  }
}

export function labCollectionStructuredData(effects: LabEffectMetadata[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '交互实验室',
    description: '12 个可调参数、可复制源码的 Vue 交互效果。',
    hasPart: effects.map(effect => ({
      '@type': 'SoftwareSourceCode',
      name: effect.name,
      url: `/lab/${effect.id}`,
      programmingLanguage: 'Vue',
      license: 'https://opensource.org/license/mit',
    })),
  }
}

export function labEffectStructuredData(effect: LabEffect) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: effect.name,
    description: effect.description,
    url: `/lab/${effect.id}`,
    programmingLanguage: 'Vue',
    runtimePlatform: 'Web Browser',
    license: 'https://opensource.org/license/mit',
  }
}
