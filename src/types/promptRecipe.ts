import type { LabEffect, LabParams, LabValue } from '@/types/lab'

export interface PromptRecipePreset {
  key: string
  value: LabValue
}

export interface PromptRecipe {
  id: string
  title: string
  category: string
  summary: string
  tags: string[]
  sourcePattern: string
  sourceUrl: string
  effectId: string
  preset: PromptRecipePreset[]
  visualDirection: string
  motionDirection: string
}

export interface PromptRecipeStudioModel {
  recipe: PromptRecipe
  effect: LabEffect
  params: LabParams
}
