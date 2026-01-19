<template>
  <div class="pt-20 md:pt-24 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="container mx-auto px-4 py-8 md:py-12">
      <h1
        ref="titleRef"
        class="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8 md:mb-12"
      >
        技术博客
      </h1>

      <div
        ref="containerRef"
        class="max-w-4xl mx-auto space-y-6 md:space-y-8"
      >
        <article
          v-for="(post, index) in blogStore.posts"
          :key="post.id"
          class="blog-post bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer active:scale-95"
          :data-index="index"
          @click="$router.push(`/blog/${post.id}`)"
        >
          <div class="p-4 md:p-6">
            <div class="flex items-center gap-2 md:gap-4 mb-3 md:mb-4">
              <span class="text-xs md:text-sm text-gray-500 dark:text-gray-400">{{ formatDate(post.publishedAt) }}</span>
              <span class="text-xs md:text-sm text-gray-500 dark:text-gray-400">{{ post.readTime }} 分钟阅读</span>
            </div>
            <h2 class="text-lg md:text-2xl font-bold text-gray-900 dark:text-white mb-2 md:mb-4">
              {{ post.title }}
            </h2>
            <p class="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-3 md:mb-4 line-clamp-2 md:line-clamp-3">
              {{ post.excerpt }}
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="px-2 md:px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full text-xs md:text-sm"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBlogStore } from '@/stores/useBlogStore'
import { useGSAPAnimations } from '@/composables/useGSAPAnimations'

const blogStore = useBlogStore()
const titleRef = ref<HTMLElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

const { fadeInUp, staggerIn } = useGSAPAnimations()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  blogStore.loadPosts()

  // 标题动画
  if (titleRef.value) {
    fadeInUp(titleRef.value, { duration: 0.8 })
  }

  // 博客文章逐个出现动画
  if (containerRef.value) {
    const posts = containerRef.value.querySelectorAll('.blog-post')
    staggerIn(posts, { duration: 0.6, delay: 0.2 })
  }
})
</script>