<template>
  <SEOHead
    title="效果不存在"
    description="该交互效果不存在。"
    type="website"
    robots="noindex,nofollow"
  />
  <main
    class="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center"
  >
    <p class="text-sm font-semibold text-blue-600">404</p>
    <h1 class="mt-3 text-3xl font-bold text-slate-950">没有找到这个效果</h1>
    <p class="mt-3 text-slate-600">ID“{{ id }}”不在当前 12 个实验中。</p>
    <RouterLink to="/lab" class="mt-6 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white">
      返回交互实验室
    </RouterLink>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import SEOHead from '@/components/common/SEOHead.vue'

interface Props {
  id: string
}

defineProps<Props>()
</script>
