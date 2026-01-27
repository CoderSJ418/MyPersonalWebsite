export interface TechStack {
  name: string
  version: string
  icon?: string
}

export interface Project {
  id: string
  title: string
  description: string
  coverImage: string
  techStack: TechStack[]
  category: string
  featured: boolean
  demoUrl?: string
  githubUrl?: string
  createdAt: string
  updatedAt: string
}

export interface ProjectFilter {
  category?: string
  searchQuery?: string
  techStacks?: string[]
}

export interface ProjectDetail extends Project {
  // 项目背景
  background: string
  goals: string[]

  // 实现功能
  features: string[]

  // 核心技术亮点
  techHighlights: {
    architecture?: string
    keyImplementations?: string[]
    performanceOptimizations?: string[]
    solution?: string
  }

  // 项目成果
  results: {
    performance?: string
    business?: string
    feedback?: string
    highlights?: string[]
  }

  // 项目截图
  screenshots: string[]

  // 相关资源
  resources?: {
    docs?: string[]
    articles?: string[]
  }
}

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

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface SocialLink {
  platform: string
  url: string
  icon: string
  label: string
}

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

export interface WorkExperience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate?: string
  current: boolean
  description: string
  achievements: string[]
  technologies: string[]
}

export interface Education {
  id: string
  school: string
  degree: string
  major: string
  startDate: string
  endDate: string
  gpa?: string
  description?: string
  achievements?: string[]
}

export interface Skill {
  id: string
  name: string
  category: string
  level: number
  yearsOfExperience: number
  description?: string
  projects?: string[]
}
