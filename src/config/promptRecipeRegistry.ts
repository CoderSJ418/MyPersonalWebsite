import recipeData from '@/assets/data/lab-prompt-recipes.json'
import { findLabEffect } from '@/config/labRegistry'
import { createMotionSceneParams, findSceneForRecipe } from '@/config/motionSceneRegistry'
import type { LabEffect, LabParams } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'
import type { PromptRecipe } from '@/types/promptRecipe'

export const promptRecipeRegistry: PromptRecipe[] = recipeData.map((recipe) => ({
  id: recipe.id,
  title: recipe.title,
  category: recipe.category,
  summary: recipe.summary,
  tags: [...recipe.tags],
  sourcePattern: recipe.sourcePattern,
  sourceUrl: recipe.sourceUrl,
  effectId: findLabEffect(recipe.effectId)?.id ?? 'aurora',
  preset: recipe.preset.map((preset) => ({ key: preset.key, value: preset.value })),
  visualDirection: recipe.visualDirection,
  motionDirection: recipe.motionDirection
}))

export const promptRecipeCategories = [
  '全部',
  ...new Set(promptRecipeRegistry.map((recipe) => recipe.category))
]

export const findPromptRecipe = (id: string): PromptRecipe | undefined =>
  promptRecipeRegistry.find((recipe) => recipe.id === id)

export const resolvePromptRecipeEffect = (recipe: PromptRecipe): LabEffect | undefined =>
  findLabEffect(recipe.effectId)

export const createPromptRecipeParams = (
  recipe: PromptRecipe,
  effect: LabEffect
): LabParams => {
  const params: LabParams = {}
  for (const param of effect.params) {
    const preset = recipe.preset.find((item) => item.key === param.key)
    params[param.key] = preset?.value ?? param.defaultValue
  }
  return params
}

const parameterSummary = (effect: LabEffect, params: LabParams) =>
  effect.params
    .map((param) => `- ${param.label}：${params[param.key] ?? param.defaultValue}`)
    .join('\n')

export const buildPromptRecipeText = (
  recipe: PromptRecipe,
  effect: LabEffect,
  params: LabParams
) => {
  const paramsText = parameterSummary(effect, params)
  const tuningSection = paramsText
    ? `\n\n当前预览参数：\n${paramsText}`
    : '\n\n当前预览使用该引擎的稳定默认参数。'

  return [
    `请为 AI Native 前端工程师作品集实现「${recipe.title}」。`,
    `目标：${recipe.summary}`,
    `视觉方向：${recipe.visualDirection}`,
    `动态方向：${recipe.motionDirection}${tuningSection}`,
    '技术要求：',
    '- 使用 Vue 3 + TypeScript + Tailwind CSS；只有时间线或滚动协调确有必要时使用 GSAP。',
    '- 标题、导航、正文和关键状态必须保留为真实可编辑 DOM，不把文字烘焙进图片、视频或 Canvas。',
    '- 保持单一亮色模式，以 #2563EB 为主色，避免通用紫色渐变式 AI 视觉。',
    '- 支持键盘焦点、语义化 HTML、稳定布局和清晰对比度。',
    '- 尊重 prefers-reduced-motion；触屏或低性能设备减少持续动画与指针跟踪。',
    '- 每个运动元素必须表达状态、空间、流程或交互，不添加没有产品意义的循环装饰。',
    `实现基线：当前预览由「${effect.name}」引擎驱动，可继续调整参数并复用其真实 Vue 实现。`,
    `灵感索引：MotionSites 公开案例「${recipe.sourcePattern}」。只借鉴视觉结构与动效方法，不复制付费 Prompt 原文或受保护实现。`
  ].join('\n\n')
}

export const resolvePromptRecipeScene = (recipe: PromptRecipe): MotionSceneRuntime | undefined =>
  findSceneForRecipe(recipe.id)

export const createPromptRecipeSceneParams = (
  recipe: PromptRecipe,
  scene: MotionSceneRuntime
): LabParams => {
  void recipe
  return createMotionSceneParams(scene)
}

export const buildPromptRecipeSceneText = (
  recipe: PromptRecipe,
  scene: MotionSceneRuntime,
  params: LabParams
) => {
  const paramsText = scene.params
    .map((param) => `- ${param.label}：${params[param.key] ?? param.defaultValue}`)
    .join('\n')

  return [
    `请为 AI Native 前端工程师作品集实现「${recipe.title}」。`,
    `目标：${recipe.summary}`,
    `视觉方向：${recipe.visualDirection}`,
    `动态方向：${recipe.motionDirection}`,
    `Renderer：${scene.renderer.toUpperCase()} / ${scene.title} / ${scene.variant}`,
    `当前场景参数：\n${paramsText}`,
    '实现要求：',
    '- 使用 Vue 3 + TypeScript。Three.js 仅用于真实 3D 场景；Canvas、GLSL 与 DOM Motion 按场景职责选择，不用同一种效果覆盖所有内容。',
    '- 所有标题、说明和关键状态保留真实 DOM；Canvas/WebGL 只承担视觉和空间层。',
    '- 单一亮色视觉，以 #2563EB 为主色；保持招聘者可以快速理解内容。',
    '- 指针交互仅在支持 hover 的设备启用；低性能、触屏与 prefers-reduced-motion 必须有稳定降级。',
    '- 运动必须表达空间、流程、数据或交互含义，不添加纯装饰循环。',
    `实现基线：当前页面直接运行「${scene.title}」Renderer，可在 Studio 内实时调参数并查看其真实实现源码。`,
    `灵感索引：MotionSites 公开案例「${recipe.sourcePattern}」。只借鉴视觉结构和交互方法，不复制其付费 Prompt 或受保护实现。`
  ].join('\n\n')
}
