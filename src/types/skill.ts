export interface Skill {
  id: string
  name: string
  level: number
  category: string
  description?: string
  years?: number
}

export interface SkillCategory {
  name: string
  skills: Skill[]
}

export interface SkillRadarData {
  name: string
  value: number
}