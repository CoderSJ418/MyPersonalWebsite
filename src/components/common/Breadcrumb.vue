<script setup lang="ts">
interface Props {
  items: Array<{ name: string; href?: string }>
}
defineProps<Props>()
</script>

<template>
  <nav aria-label="Breadcrumb" class="py-3">
    <ol class="flex items-center gap-2 text-sm">
      <li>
        <RouterLink
          to="/"
          class="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          首页
        </RouterLink>
      </li>
      <template v-for="(item, index) in items" :key="index">
        <li class="text-slate-400 dark:text-slate-600">/</li>
        <li v-if="item.href && index < items.length - 1">
          <RouterLink
            :to="item.href"
            class="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {{ item.name }}
          </RouterLink>
        </li>
        <li v-else class="text-slate-700 dark:text-slate-300 font-medium" aria-current="page">
          {{ item.name }}
        </li>
      </template>
    </ol>
  </nav>
</template>
