<template>
  <div
    ref="rootRef"
    class="relative h-full min-h-64 overflow-hidden"
    :aria-label="`实时场景：${scene.title}`"
  >
    <Suspense v-if="shouldRenderLive">
      <component
        :is="scene.component"
        :scene="scene"
        :params="resolvedParams"
      />
      <template #fallback>
        <MotionSceneFallback :scene="scene" />
      </template>
    </Suspense>
    <MotionSceneFallback v-else :scene="scene" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

import MotionSceneFallback from '@/components/lab/renderers/MotionSceneFallback.vue'
import { createMotionSceneParams } from '@/config/motionSceneRegistry'
import { useMobilePerformance } from '@/composables/useMobilePerformance'
import type { LabParams } from '@/types/lab'
import type { MotionSceneRuntime } from '@/types/motionScene'

interface Props {
  scene: MotionSceneRuntime
  params?: LabParams
  forceLive?: boolean
}

const props = withDefaults(defineProps<Props>(), { forceLive: false, params: () => ({}) })
const rootRef = ref<HTMLElement | null>(null)
const visible = ref(false)
const { isMobile, isLowEndDevice, prefersReducedMotion } = useMobilePerformance()
let observer: IntersectionObserver | null = null

const resolvedParams = computed(() => ({
  ...createMotionSceneParams(props.scene),
  ...props.params
}))

const shouldRenderLive = computed(
  () =>
    visible.value &&
    !prefersReducedMotion.value &&
    !isLowEndDevice.value &&
    (props.forceLive || !isMobile.value)
)

onMounted(() => {
  if (!rootRef.value || !('IntersectionObserver' in window)) {
    visible.value = true
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      visible.value = entries.some((entry) => entry.isIntersecting)
    },
    { rootMargin: '160px 0px', threshold: 0.04 }
  )
  observer.observe(rootRef.value)
})

onUnmounted(() => observer?.disconnect())
</script>
