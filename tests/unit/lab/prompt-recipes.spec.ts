import { describe, expect, it } from 'vitest'

import {
  buildPromptRecipeText,
  createPromptRecipeParams,
  promptRecipeRegistry,
  resolvePromptRecipeEffect
} from '@/config/promptRecipeRegistry'

describe('Prompt Recipe registry', () => {
  it('publishes 64 Chinese-first recipes with valid preview engines', () => {
    expect(promptRecipeRegistry).toHaveLength(64)
    expect(new Set(promptRecipeRegistry.map((recipe) => recipe.id)).size).toBe(64)

    for (const recipe of promptRecipeRegistry) {
      expect(recipe.title).toMatch(/[\u4e00-\u9fff]/)
      expect(recipe.category).toMatch(/[\u4e00-\u9fff]/)
      expect(recipe.summary).toMatch(/[\u4e00-\u9fff]/)
      expect(recipe.visualDirection).toMatch(/[\u4e00-\u9fff]/)
      expect(recipe.motionDirection).toMatch(/[\u4e00-\u9fff]/)

      const effect = resolvePromptRecipeEffect(recipe)
      expect(effect).toBeDefined()
      if (!effect) continue

      const paramKeys = new Set(effect.params.map((param) => param.key))
      for (const preset of recipe.preset) expect(paramKeys.has(preset.key)).toBe(true)
    }
  })

  it('builds a Chinese prompt and synchronizes current tuning values', () => {
    const recipe = promptRecipeRegistry[0]
    expect(recipe).toBeDefined()
    if (!recipe) return

    const effect = resolvePromptRecipeEffect(recipe)
    expect(effect).toBeDefined()
    if (!effect) return

    const params = createPromptRecipeParams(recipe, effect)
    params.speed = 0.9
    const prompt = buildPromptRecipeText(recipe, effect, params)

    expect(prompt).toContain('请为 AI Native 前端工程师作品集实现')
    expect(prompt).toContain('流动速度：0.9')
    expect(prompt).toContain('只借鉴视觉结构与动效方法')
    expect(prompt).not.toContain('Build a premium')
  })
})
