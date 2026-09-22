import { describe, expect, it } from 'vitest'

import {
  createMotionSceneParams,
  findSceneForRecipe,
  motionSceneRegistry
} from '@/config/motionSceneRegistry'
import {
  buildPromptRecipeSceneText,
  createPromptRecipeSceneParams,
  promptRecipeRegistry,
  resolvePromptRecipeScene
} from '@/config/promptRecipeRegistry'

describe('Motion Scene renderer registry', () => {
  it('publishes 12 diverse scenes across four renderer kinds', () => {
    expect(motionSceneRegistry).toHaveLength(12)

    const counts = new Map<string, number>()
    for (const scene of motionSceneRegistry) {
      counts.set(scene.renderer, (counts.get(scene.renderer) ?? 0) + 1)
      expect(scene.params).toHaveLength(3)
      expect(scene.recipeIds.length).toBeGreaterThan(0)
      const params = createMotionSceneParams(scene)
      expect(Object.keys(params)).toHaveLength(3)
      expect(scene.createUsage(params)).toContain(`findMotionScene('${scene.id}')`)
    }

    expect(counts.get('three')).toBe(3)
    expect(counts.get('canvas')).toBe(3)
    expect(counts.get('shader')).toBe(3)
    expect(counts.get('dom')).toBe(3)
  })

  it('maps every recipe exactly once to a renderer scene', () => {
    const mappedIds = motionSceneRegistry.flatMap((scene) => scene.recipeIds)
    expect(mappedIds).toHaveLength(64)
    expect(new Set(mappedIds).size).toBe(64)

    for (const recipe of promptRecipeRegistry) {
      const scene = findSceneForRecipe(recipe.id)
      expect(scene).toBeDefined()
      expect(resolvePromptRecipeScene(recipe)?.id).toBe(scene?.id)
    }
  })

  it('generates scene-specific Chinese prompts from current parameters', () => {
    const recipe = promptRecipeRegistry.find((item) => item.id === 'ms-recipe-05')
    expect(recipe).toBeDefined()
    if (!recipe) return

    const scene = resolvePromptRecipeScene(recipe)
    expect(scene?.renderer).toBe('three')
    if (!scene) return

    const params = createPromptRecipeSceneParams(recipe, scene)
    params.depth = 1.55
    const prompt = buildPromptRecipeSceneText(recipe, scene, params)

    expect(prompt).toContain('Renderer：THREE')
    expect(prompt).toContain('空间深度：1.55')
    expect(prompt).toContain('不用同一种效果覆盖所有内容')
  })
})
