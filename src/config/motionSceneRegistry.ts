import { defineAsyncComponent } from 'vue'

import sceneData from '@/assets/data/motion-scenes.json'
import type { LabParam, LabParams, LabValue } from '@/types/lab'
import type {
  MotionRendererKind,
  MotionSceneMetadata,
  MotionSceneRuntime
} from '@/types/motionScene'

const componentBySceneId = {
  'digital-epoch': defineAsyncComponent(() => import('@/views/Lab/motionsites/DigitalEpochDemo.vue')),
  'impressive-hero': defineAsyncComponent(() => import('@/views/Lab/motionsites/ImpressiveHeroDemo.vue')),
  'future-3d-portfolio': defineAsyncComponent(() => import('@/views/Lab/motionsites/Future3DPortfolioDemo.vue')),
  'nival-cyberspace': defineAsyncComponent(() => import('@/views/Lab/motionsites/NivalCyberspaceDemo.vue')),
  'cast-and-render': defineAsyncComponent(() => import('@/views/Lab/motionsites/CastAndRenderDemo.vue')),
  alethia: defineAsyncComponent(() => import('@/views/Lab/motionsites/AlethiaDemo.vue')),
  'particle-field': defineAsyncComponent(() => import('@/views/Lab/motionsites/ParticleFieldDemo.vue')),
  'react-vision': defineAsyncComponent(() => import('@/views/Lab/motionsites/ReactVisionDemo.vue')),
  codeveil: defineAsyncComponent(() => import('@/views/Lab/motionsites/CodeveilDemo.vue')),
  consentinel: defineAsyncComponent(() => import('@/views/Lab/motionsites/ConSentinelDemo.vue')),
  'orbit-stickers': defineAsyncComponent(() => import('@/views/Lab/motionsites/OrbitStickersDemo.vue')),
  'liquid-glass-agency': defineAsyncComponent(() => import('@/views/Lab/motionsites/LiquidGlassAgencyDemo.vue')),
  'playful-idea': defineAsyncComponent(() => import('@/views/Lab/motionsites/PlayfulIdeaDemo.vue')),
  'ancient-oath': defineAsyncComponent(() => import('@/views/Lab/motionsites/AncientOathDemo.vue')),
  'space-planet': defineAsyncComponent(() => import('@/views/Lab/motionsites/SpacePlanetDemo.vue')),
  'aetheris-voyage': defineAsyncComponent(() => import('@/views/Lab/motionsites/AetherisVoyageDemo.vue')),
  'frozen-cave': defineAsyncComponent(() => import('@/views/Lab/motionsites/FrozenCaveDemo.vue')),
  'heart-health-dashboard': defineAsyncComponent(() => import('@/views/Lab/motionsites/HeartHealthDashboardDemo.vue')),
  'digital-persona': defineAsyncComponent(() => import('@/views/Lab/motionsites/DigitalPersonaDemo.vue')),
  'cosmic-mapping': defineAsyncComponent(() => import('@/views/Lab/motionsites/CosmicMappingDemo.vue')),
  'future-machine': defineAsyncComponent(() => import('@/views/Lab/motionsites/FutureMachineDemo.vue')),
  'mind-ai': defineAsyncComponent(() => import('@/views/Lab/motionsites/MindAIDemo.vue')),
  'axle-journey': defineAsyncComponent(() => import('@/views/Lab/motionsites/AxleJourneyDemo.vue')),
  'bionova-biotech': defineAsyncComponent(() => import('@/views/Lab/motionsites/BionovaBiotechDemo.vue'))
} as const

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
  if (value === 'three' || value === 'canvas' || value === 'shader' || value === 'dom') return value
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
  referenceName: scene.referenceName,
  referenceCategory: scene.referenceCategory,
  referenceUrl: scene.referenceUrl,
  preset: scene.preset.map((item) => ({ key: item.key, value: normalizeValue(item.value) }))
}))

const sourceBySceneId = {
  'digital-epoch': () => import('@/views/Lab/motionsites/DigitalEpochDemo.vue?raw'),
  'impressive-hero': () => import('@/views/Lab/motionsites/ImpressiveHeroDemo.vue?raw'),
  'future-3d-portfolio': () => import('@/views/Lab/motionsites/Future3DPortfolioDemo.vue?raw'),
  'nival-cyberspace': () => import('@/views/Lab/motionsites/NivalCyberspaceDemo.vue?raw'),
  'cast-and-render': () => import('@/views/Lab/motionsites/CastAndRenderDemo.vue?raw'),
  alethia: () => import('@/views/Lab/motionsites/AlethiaDemo.vue?raw'),
  'particle-field': () => import('@/views/Lab/motionsites/ParticleFieldDemo.vue?raw'),
  'react-vision': () => import('@/views/Lab/motionsites/ReactVisionDemo.vue?raw'),
  codeveil: () => import('@/views/Lab/motionsites/CodeveilDemo.vue?raw'),
  consentinel: () => import('@/views/Lab/motionsites/ConSentinelDemo.vue?raw'),
  'orbit-stickers': () => import('@/views/Lab/motionsites/OrbitStickersDemo.vue?raw'),
  'liquid-glass-agency': () => import('@/views/Lab/motionsites/LiquidGlassAgencyDemo.vue?raw'),
  'playful-idea': () => import('@/views/Lab/motionsites/PlayfulIdeaDemo.vue?raw'),
  'ancient-oath': () => import('@/views/Lab/motionsites/AncientOathDemo.vue?raw'),
  'space-planet': () => import('@/views/Lab/motionsites/SpacePlanetDemo.vue?raw'),
  'aetheris-voyage': () => import('@/views/Lab/motionsites/AetherisVoyageDemo.vue?raw'),
  'frozen-cave': () => import('@/views/Lab/motionsites/FrozenCaveDemo.vue?raw'),
  'heart-health-dashboard': () => import('@/views/Lab/motionsites/HeartHealthDashboardDemo.vue?raw'),
  'digital-persona': () => import('@/views/Lab/motionsites/DigitalPersonaDemo.vue?raw'),
  'cosmic-mapping': () => import('@/views/Lab/motionsites/CosmicMappingDemo.vue?raw'),
  'future-machine': () => import('@/views/Lab/motionsites/FutureMachineDemo.vue?raw'),
  'mind-ai': () => import('@/views/Lab/motionsites/MindAIDemo.vue?raw'),
  'axle-journey': () => import('@/views/Lab/motionsites/AxleJourneyDemo.vue?raw'),
  'bionova-biotech': () => import('@/views/Lab/motionsites/BionovaBiotechDemo.vue?raw')
} as const

const loadSceneSource = async (sceneId: string) => {
  const loader = sourceBySceneId[sceneId as keyof typeof sourceBySceneId] ?? sourceBySceneId['digital-epoch']
  return (await loader()).default
}

export const motionSceneRegistry: MotionSceneRuntime[] = metadata.map((scene) => ({
  ...scene,
  component: componentBySceneId[scene.id as keyof typeof componentBySceneId] ?? componentBySceneId['digital-epoch'],
  params: rendererParams[scene.renderer].map((param) => ({ ...param })),
  loadSource: () => loadSceneSource(scene.id),
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
export const findMotionScene = (sceneId: string) => motionSceneRegistry.find((scene) => scene.id === sceneId)
export const findSceneForRecipe = (recipeId: string) => motionSceneRegistry.find((scene) => scene.recipeIds.includes(recipeId))

export const createMotionSceneParams = (scene: MotionSceneRuntime): LabParams => {
  const params: LabParams = {}
  for (const param of scene.params) {
    const preset = scene.preset.find((item) => item.key === param.key)
    params[param.key] = preset?.value ?? param.defaultValue
  }
  return params
}
