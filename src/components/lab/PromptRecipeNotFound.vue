<template>
  <main class="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
    <p class="text-sm font-semibold text-blue-600">404</p>
    <h1 class="mt-3 text-3xl font-bold text-slate-950">没有找到这个动效配方</h1>
    <p class="mt-3 text-slate-600">ID“{{ id }}”不在当前 64 条 Prompt Recipe 中。</p>
    <RouterLink
      to="/lab#prompt-library"
      class="mt-6 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
    >
      返回 Prompt Library
    </RouterLink>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface Props {
  id: string
}

defineProps<Props>()
</script>
