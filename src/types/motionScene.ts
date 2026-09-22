import type { Component } from 'vue'

import type { LabParam, LabParams, LabValue } from '@/types/lab'

export type MotionRendererKind = 'three' | 'canvas' | 'shader' | 'dom'

export interface MotionScenePreset {
  key: string
  value: LabValue
}

export interface MotionSceneMetadata {
  id: string
  recipeIds: string[]
  title: string
  subtitle: string
  renderer: MotionRendererKind
  variant: string
  eyebrow: string
  labels: string[]
  preset: MotionScenePreset[]
}

export interface MotionSceneRuntime extends MotionSceneMetadata {
  component: Component
  params: LabParam[]
  loadSource: () => Promise<string>
  createUsage: (params: LabParams) => string
}
