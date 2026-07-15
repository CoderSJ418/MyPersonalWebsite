import type { Component } from 'vue'

export type LabEffectId =
  | 'aurora'
  | 'grid-pattern'
  | 'dot-pattern'
  | 'noise-texture'
  | 'meteors'
  | 'spotlight'
  | 'tilt-card'
  | 'magic-card'
  | 'shine-border'
  | 'shimmer-button'
  | 'number-ticker'
  | 'marquee'

export type LabCategory = 'background' | 'card' | 'button' | 'data' | 'layout'
export type LabLanguage = 'vue'
export type LabValue = string | number
export type LabParams = Record<string, LabValue>
export type LabImplementationOrigin = 'original' | 'clean-room' | 'mit-adaptation'

export interface LabSelectOption {
  label: string
  value: string
}

export interface LabParam {
  key: string
  label: string
  type: 'range' | 'color' | 'select'
  defaultValue: LabValue
  min?: number
  max?: number
  step?: number
  options?: LabSelectOption[]
}

export interface LabCompatibility {
  browsers: string
  fallback: string
}

export interface LabPreview {
  src: string
  alt: string
}

export interface LabUsageLocation {
  label: string
  path: string
}

export interface LabEffectMetadata {
  id: LabEffectId
  name: string
  description: string
  category: LabCategory
  tags: string[]
  params: LabParam[]
  compatibility: LabCompatibility
  preview: LabPreview
  useCases: string[]
  avoidWhen: string[]
  pairings: LabEffectId[]
  stack: string[]
  implementationNotes: string[]
  performanceNotes: string[]
  accessibilityNotes: string[]
  usedIn: LabUsageLocation[]
  dependencies: string[]
  license: 'MIT'
  sourceUrl: string | null
  implementationOrigin: LabImplementationOrigin
}

export interface LabEffect extends LabEffectMetadata {
  component: Component
  language: LabLanguage
  loadSource: () => Promise<string>
  createUsage: (params: LabParams) => string
}

export interface LabRuntimeDefinition {
  component: Component
  loadSource: () => Promise<string>
  createUsage: (params: LabParams) => string
}
