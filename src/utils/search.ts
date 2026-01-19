/**
 * 搜索工具函数
 * 提供搜索索引构建、搜索算法实现、高亮处理等功能
 */

import type { Project } from '@/types/project'
import type { Skill } from '@/types/skill'
import type { BlogPost } from '@/types/blog'
import type { SearchResultItem, SearchResults } from '@/types/search'

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * 高亮匹配关键词
 */
export function highlightText(text: string, query: string): string {
  if (!query || !text) return text

  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-700 px-0.5 rounded font-semibold">$1</mark>')
}

/**
 * 转义正则表达式特殊字符
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * 计算搜索相关性分数
 */
function calculateRelevanceScore(
  item: { title: string; description: string; tags?: string[] },
  query: string
): number {
  const lowerQuery = query.toLowerCase()
  const lowerTitle = item.title.toLowerCase()
  const lowerDescription = item.description.toLowerCase()
  let score = 0

  // 标题完全匹配
  if (lowerTitle === lowerQuery) score += 100
  // 标题包含查询
  else if (lowerTitle.includes(lowerQuery)) score += 50

  // 描述包含查询
  if (lowerDescription.includes(lowerQuery)) score += 20

  // 标签包含查询
  if (item.tags) {
    const tagMatch = item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    if (tagMatch) score += 30
  }

  return score
}

/**
 * 搜索项目
 */
function searchProjects(projects: Project[], query: string): SearchResultItem[] {
  if (!query.trim()) return []

  const lowerQuery = query.toLowerCase()
  return projects
    .map(project => ({
      id: project.id,
      type: 'project' as const,
      title: project.title,
      description: project.description,
      url: `/projects/${project.id}`,
      metadata: {
        tags: project.tags
      }
    }))
    .filter(item =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.metadata?.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
    .map(item => ({
      ...item,
      highlight: {
        title: highlightText(item.title, query),
        description: highlightText(item.description, query)
      }
    }))
    .sort((a, b) => calculateRelevanceScore(b, query) - calculateRelevanceScore(a, query))
}

/**
 * 搜索技能
 */
function searchSkills(skills: Skill[], query: string): SearchResultItem[] {
  if (!query.trim()) return []

  const lowerQuery = query.toLowerCase()
  return skills
    .map(skill => ({
      id: skill.id,
      type: 'skill' as const,
      title: skill.name,
      description: skill.description || `${skill.category} - ${skill.level}级`,
      url: `/skills#${skill.id}`,
      metadata: {
        category: skill.category,
        level: skill.level
      }
    }))
    .filter(item =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.metadata?.category?.toLowerCase().includes(lowerQuery)
    )
    .map(item => ({
      ...item,
      highlight: {
        title: highlightText(item.title, query),
        description: highlightText(item.description, query)
      }
    }))
    .sort((a, b) => calculateRelevanceScore(b, query) - calculateRelevanceScore(a, query))
}

/**
 * 搜索博客
 */
function searchBlogs(posts: BlogPost[], query: string): SearchResultItem[] {
  if (!query.trim()) return []

  const lowerQuery = query.toLowerCase()
  return posts
    .map(post => ({
      id: post.id,
      type: 'blog' as const,
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.id}`,
      metadata: {
        tags: post.tags,
        author: post.author,
        publishedAt: post.publishedAt
      }
    }))
    .filter(item =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.metadata?.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
    .map(item => ({
      ...item,
      highlight: {
        title: highlightText(item.title, query),
        description: highlightText(item.description, query)
      }
    }))
    .sort((a, b) => calculateRelevanceScore(b, query) - calculateRelevanceScore(a, query))
}

/**
 * 全局搜索
 */
export function globalSearch(
  projects: Project[],
  skills: Skill[],
  posts: BlogPost[],
  query: string
): SearchResults {
  return {
    projects: searchProjects(projects, query),
    skills: searchSkills(skills, query),
    blogs: searchBlogs(posts, query),
    total: 0 // 将在调用后计算
  }
}

/**
 * 获取搜索结果总数
 */
export function getSearchResultsTotal(results: SearchResults): number {
  return results.projects.length + results.skills.length + results.blogs.length
}

/**
 * 扁平化搜索结果（用于键盘导航）
 */
export function flattenSearchResults(results: SearchResults): SearchResultItem[] {
  return [...results.projects, ...results.skills, ...results.blogs]
}
