/**
 * 项目相关类型定义
 */

/**
 * 技术栈项
 */
export interface TechStack {
  name: string
  version: string
  icon?: string
}

/**
 * 项目信息
 */
export interface Project {
  id: string
  title: string
  slug?: string
  description: string
  coverImage: string
  techStack: TechStack[]
  technologies?: string[]
  images?: string[]
  category: string
  featured: boolean
  demoUrl?: string
  liveUrl?: string
  githubUrl?: string
  order?: number
  createdAt: string
  updatedAt: string
}

/**
 * 项目过滤器
 */
export interface ProjectFilter {
  category?: string
  searchQuery?: string
  techStacks?: string[]
}

/**
 * 项目详情（扩展项目信息）
 */
export interface ProjectDetail extends Project {
  background: string
  goals: string[]
  features: string[]
  techHighlights: {
    architecture?: string
    keyImplementations?: string[]
    performanceOptimizations?: string[]
    solution?: string
  }
  results: {
    performance?: string
    business?: string
    feedback?: string
    highlights?: string[]
  }
  screenshots: string[]
  resources?: {
    docs?: string[]
    articles?: string[]
  }
}

/**
 * 联系信息
 */
export interface ContactInfo {
  name: string
  email: string
  phone: string
  location: string
  social: {
    github?: string
    linkedin?: string
    twitter?: string
    email?: string
  }
  availability: string
  responseTime: string
}

/**
 * 联系表单数据
 */
export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

/**
 * 社交链接
 */
export interface SocialLink {
  platform: string
  url: string
  icon: string
  label: string
}

/**
 * 个人信息
 */
export interface PersonalInfo {
  name: string
  title: string
  avatar: string
  bio: string
  location: string
  email: string
  phone?: string
  website?: string
  github?: string
  linkedin?: string
  twitter?: string
  yearsOfExperience: number
  languages: string[]
  interests: string[]
}

/**
 * 工作经历
 */
export interface WorkExperience {
  id: string
  company: string
  position: string
  location?: string
  startDate: string
  endDate?: string
  current: boolean
  description: string
  achievements: string[]
  technologies: string[]
}

/**
 * 教育背景
 */
export interface Education {
  id: string
  school: string
  institution?: string
  degree: string
  major: string
  field?: string
  startDate: string
  endDate: string
  gpa?: string
  description?: string
  achievements?: string[]
}

/**
 * 技能信息（统一版本）
 */
export interface Skill {
  id: string
  name: string
  category: string
  level: number
  years?: number
  yearsOfExperience?: number
  description?: string
  projects?: string[]
}

/**
 * 技能分类
 */
export interface SkillCategory {
  name: string
  skills: Skill[]
}

/**
 * 技能雷达数据
 */
export interface SkillRadarData {
  name: string
  value: number
}