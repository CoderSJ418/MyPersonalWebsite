<template>
  <div class="pt-24 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="container mx-auto px-4 py-12">
      <div v-if="post" class="max-w-4xl mx-auto">
        <button
          class="mb-8 flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          @click="$router.back()"
        >
          <ArrowLeft class="w-5 h-5 mr-2" />
          返回
        </button>

        <article class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {{ post.title }}
          </h1>

          <div class="flex items-center gap-4 mb-8">
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(post.publishedAt) }}</span>
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ post.readTime }} 分钟阅读</span>
          </div>

          <div class="flex flex-wrap gap-2 mb-8">
            <span
              v-for="tag in post.tags"
              :key="tag"
              class="px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full"
            >
              {{ tag }}
            </span>
          </div>

          <div class="prose dark:prose-invert max-w-none">
            <p class="text-gray-600 dark:text-gray-400 mb-4">{{ post.excerpt }}</p>
            <p class="text-gray-600 dark:text-gray-400">{{ post.content }}</p>
          </div>
        </article>
      </div>
      <div v-else class="text-center text-gray-600 dark:text-gray-400">
        文章未找到
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBlogStore } from '@/stores/useBlogStore'
import { ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const blogStore = useBlogStore()

const post = computed(() => blogStore.getPostById(route.params.id as string))

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  blogStore.loadPosts()
})
</script>