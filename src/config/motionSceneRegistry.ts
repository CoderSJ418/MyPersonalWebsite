import { defineAsyncComponent } from 'vue'

import sceneData from '@/assets/data/motion-scenes.json'
import type { LabParam, LabParams, LabValue } from '@/types/lab'
import type {
  MotionRendererKind,
  MotionSceneMetadata,
  MotionSceneRuntime
} from '@/types/motionScene'

const rendererComponent = {
  three: defineAsyncComponent(() => import('@/components/lab/renderers/ThreeSceneRenderer.vue')),
  canvas: defineAsyncComponent(() => import('@/components/lab/renderers/CanvasSceneRenderer.vue')),
  shader: defineAsyncComponent(() => import('@/components/lab/renderers/ShaderSceneRenderer.vue')),
  dom: defineAsyncComponent(() => import('@/components/lab/renderers/DomSceneRenderer.vue'))
}

const rendererParams: Record<MotionRendererKind, LabParam[]> = {
  three: [
    { key: 'speed', label: '场景速度', type: 'range', min: 0.1, max: 1.2, step: 0.05, defaultValue: 0.4 },
    { key: 'depth', label: '空间深度', type: 'range', min: 0.3, max: 1.8, step: 0.05, defaultValue: 1 },
    { key: 'pointerStrength', label: '指针视差', type: 'range', min: 0, max: 0.8, step: 0.02, defaultValue: 0.3 }
  ],
  canvas: [
    { key: 'density', label: '元素密度', type: 'range', min: 12, max: 96, step: 2, defaultValue: 48 },
    { key: 'speed', label: '运动速度', type: 'range', min: 0.1, max: 1.4, step: 0.05, defaultValue: 0.6 },
    { key: 'pointerStrength', label: '指针影响', type: 'range', min: 0, max: 1, step: 0.05, defaultValue: 0.5 }
  ],
  shader: [
    { key: 'speed', label: '流动速度', type: 'range', min: 0.1, max: 1.2, step: 0.05, defaultValue: 0.4 },
    { key: 'intensity', label: '视觉强度', type: 'range', min: 0.2, max: 1.2, step: 0.05, defaultValue: 0.75 },
    { key: 'scale', label: '场尺度', type: 'range', min: 0.6, max: 1.8, step: 0.05, defaultValue: 1 }
  ],
  dom: [
    { key: 'speed', label: '动效速度', type: 'range', min: 0.1, max: 1.2, step: 0.05, defaultValue: 0.5 },
    { key: 'depth', label: '层级深度', type: 'range', min: 0.1, max: 1.2, step: 0.05, defaultValue: 0.5 },
    { key: 'intensity', label: '动效强度', type: 'range', min: 0.2, max: 1.2, step: 0.05, defaultValue: 0.7 }
  ]
}

const normalizeRenderer = (value: string): MotionRendererKind => {
  if (value === 'three' || value === 'canvas' || value === 'shader' || value === 'dom') {
    return value
  }
  return 'dom'
}

const normalizeValue = (value: string | number | boolean): LabValue => value

const metadata: MotionSceneMetadata[] = sceneData.map((scene) => ({
  id: scene.id,
  recipeIds: [...scene.recipeIds],
  title: scene.title,
  subtitle: scene.subtitle,
  renderer: normalizeRenderer(scene.renderer),
  variant: scene.variant,
  eyebrow: scene.eyebrow,
  labels: [...scene.labels],
  preset: scene.preset.map((item) => ({ key: item.key, value: normalizeValue(item.value) }))
}))

const loadRendererSource = async (renderer: MotionRendererKind) => {
  if (renderer === 'three') {
    return (await import('@/components/lab/renderers/ThreeSceneRenderer.vue?raw')).default
  }
  if (renderer === 'canvas') {
    return (await import('@/components/lab/renderers/CanvasSceneRenderer.vue?raw')).default
  }
  if (renderer === 'shader') {
    return (await import('@/components/lab/renderers/ShaderSceneRenderer.vue?raw')).default
  }
  return (await import('@/components/lab/renderers/DomSceneRenderer.vue?raw')).default
}

export const motionSceneRegistry: MotionSceneRuntime[] = metadata.map((scene) => ({
  ...scene,
  component: rendererComponent[scene.renderer],
  params: rendererParams[scene.renderer].map((param) => ({ ...param })),
  loadSource: () => loadRendererSource(scene.renderer),
  createUsage: (params: LabParams) => {
    const paramsText = JSON.stringify(params)
    return [
      '<script setup lang="ts">',
      "import MotionScenePreview from '@/components/lab/MotionScenePreview.vue'",
      "import { findMotionScene } from '@/config/motionSceneRegistry'",
      `const scene = findMotionScene('${scene.id}')`,
      '</script>',
      '',
      '<template>',
      `  <MotionScenePreview v-if="scene" :scene="scene" :params='${paramsText}' force-live />`,
      '</template>'
    ].join('\n')
  }
}))

export const featuredMotionScenes = motionSceneRegistry

export const findMotionScene = (sceneId: string) =>
  motionSceneRegistry.find((scene) => scene.id === sceneId)

export const findSceneForRecipe = (recipeId: string) =>
  motionSceneRegistry.find((scene) => scene.recipeIds.includes(recipeId))

export const createMotionSceneParams = (scene: MotionSceneRuntime): LabParams => {
  const params: LabParams = {}
  for (const param of scene.params) {
    const preset = scene.preset.find((item) => item.key === param.key)
    params[param.key] = preset?.value ?? param.defaultValue
  }
  return params
}
