import type { LabEffectId, LabParams, LabValue } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'

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
  effectId: LabEffectId
  preset: PromptRecipePreset[]
  visualDirection: string
  motionDirection: string
}

export interface PromptRecipeStudioModel {
  recipe: PromptRecipe
  scene: MotionSceneRuntime
  params: LabParams
}
