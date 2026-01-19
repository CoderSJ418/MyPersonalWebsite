export interface Project {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  link?: string
  github?: string
  featured?: boolean
  createdAt: string
  updatedAt: string
}

export interface ProjectFilter {
  category?: string
  searchQuery?: string
}

export interface ProjectDetail extends Project {
  content: string
  techStack: string[]
  challenges: string[]
  solutions: string[]
  results: string[]
  screenshots: string[]
}