<template>
  <SEOHead
    :title="scene ? `${scene.title} 效果复刻` : '效果不存在'"
    :description="scene?.subtitle ?? '没有找到这个 MotionSites 效果复刻。'"
    type="website"
    :robots="scene ? 'index,follow' : 'noindex,nofollow'"
  />
  <MotionSceneStudio v-if="scene" :scene="scene" />
  <section v-else class="mx-auto max-w-3xl px-6 py-32 text-center">
    <h1 class="text-3xl font-bold text-slate-950">没有找到这个效果</h1>
    <RouterLink to="/lab" class="mt-6 inline-flex min-h-11 items-center text-blue-600 hover:underline">返回交互实验室</RouterLink>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import SEOHead from '@/components/common/SEOHead.vue'
import MotionSceneStudio from '@/components/lab/MotionSceneStudio.vue'
import { findMotionScene } from '@/config/motionSceneRegistry'

const props=defineProps<{id:string}>()
const scene=computed(()=>findMotionScene(props.id))
onMounted(()=>window.scrollTo({top:0}))
</script>
