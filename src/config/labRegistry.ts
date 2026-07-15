import { defineAsyncComponent, type Component } from 'vue'

import metadataJson from '@/assets/data/lab-effects.json'
import LabDemoLoadError from '@/components/lab/LabDemoLoadError.vue'
import LabDemoLoading from '@/components/lab/LabDemoLoading.vue'
import type { LabEffect, LabEffectId, LabRuntimeDefinition } from '@/types/lab'
import { parseLabMetadata } from '@/utils/labMetadata'
import { createLabUsage } from '@/utils/labUsage'

interface DemoModule {
  default: Component
}

interface SourceModule {
  default: string
}

const asyncDemo = (loader: () => Promise<DemoModule>): Component =>
  defineAsyncComponent({
    loader,
    loadingComponent: LabDemoLoading,
    errorComponent: LabDemoLoadError,
    delay: 120,
    timeout: 8000,
    onError(_error, retry, fail, attempts) {
      if (attempts <= 2) retry()
      else fail()
    }
  })

const rawSource = (loader: () => Promise<SourceModule>) => async (): Promise<string> =>
  (await loader()).default

const runtime = (
  componentName: string,
  componentLoader: () => Promise<DemoModule>,
  sourceLoader: () => Promise<SourceModule>
): LabRuntimeDefinition => ({
  component: asyncDemo(componentLoader),
  loadSource: rawSource(sourceLoader),
  createUsage: (params) => createLabUsage(componentName, params)
})

const runtimeById: Record<LabEffectId, LabRuntimeDefinition> = {
  aurora: runtime(
    'AuroraDemo',
    () => import('@/views/Lab/demos/AuroraDemo.vue'),
    () => import('@/views/Lab/demos/AuroraDemo.vue?raw')
  ),
  'grid-pattern': runtime(
    'GridPatternDemo',
    () => import('@/views/Lab/demos/GridPatternDemo.vue'),
    () => import('@/views/Lab/demos/GridPatternDemo.vue?raw')
  ),
  'dot-pattern': runtime(
    'DotPatternDemo',
    () => import('@/views/Lab/demos/DotPatternDemo.vue'),
    () => import('@/views/Lab/demos/DotPatternDemo.vue?raw')
  ),
  'noise-texture': runtime(
    'NoiseTextureDemo',
    () => import('@/views/Lab/demos/NoiseTextureDemo.vue'),
    () => import('@/views/Lab/demos/NoiseTextureDemo.vue?raw')
  ),
  meteors: runtime(
    'MeteorsDemo',
    () => import('@/views/Lab/demos/MeteorsDemo.vue'),
    () => import('@/views/Lab/demos/MeteorsDemo.vue?raw')
  ),
  spotlight: runtime(
    'SpotlightDemo',
    () => import('@/views/Lab/demos/SpotlightDemo.vue'),
    () => import('@/views/Lab/demos/SpotlightDemo.vue?raw')
  ),
  'tilt-card': runtime(
    'TiltCardDemo',
    () => import('@/views/Lab/demos/TiltCardDemo.vue'),
    () => import('@/views/Lab/demos/TiltCardDemo.vue?raw')
  ),
  'magic-card': runtime(
    'MagicCardDemo',
    () => import('@/views/Lab/demos/MagicCardDemo.vue'),
    () => import('@/views/Lab/demos/MagicCardDemo.vue?raw')
  ),
  'shine-border': runtime(
    'ShineBorderDemo',
    () => import('@/views/Lab/demos/ShineBorderDemo.vue'),
    () => import('@/views/Lab/demos/ShineBorderDemo.vue?raw')
  ),
  'shimmer-button': runtime(
    'ShimmerButtonDemo',
    () => import('@/views/Lab/demos/ShimmerButtonDemo.vue'),
    () => import('@/views/Lab/demos/ShimmerButtonDemo.vue?raw')
  ),
  'number-ticker': runtime(
    'NumberTickerDemo',
    () => import('@/views/Lab/demos/NumberTickerDemo.vue'),
    () => import('@/views/Lab/demos/NumberTickerDemo.vue?raw')
  ),
  marquee: runtime(
    'MarqueeDemo',
    () => import('@/views/Lab/demos/MarqueeDemo.vue'),
    () => import('@/views/Lab/demos/MarqueeDemo.vue?raw')
  )
}

const metadata = parseLabMetadata(metadataJson)

export const labRegistry: LabEffect[] = metadata.map((effect) => ({
  ...effect,
  ...runtimeById[effect.id],
  language: 'vue'
}))

export const findLabEffect = (id: string): LabEffect | undefined =>
  labRegistry.find((effect) => effect.id === id)
