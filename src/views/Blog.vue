<template>
  <main class="min-h-screen bg-white dark:bg-slate-900">
    <PageHero
      title="分享知识 · 记录成长" :subtitle="'分享 Vue 3、TypeScript、前端工程化等技术文章，记录开发过程中的思考和心得'"
      :stats="blogHeroStats"
    />

    <!-- 搜索和筛选区域 -->
    <section class="py-8 bg-white dark:bg-slate-900">
      <div class="container mx-auto px-4 sm:px-6">
        <!-- 搜索框 -->
        <div class="max-w-2xl mx-auto mb-6">
          <div class="relative flex items-center">
            <Search class="absolute left-3.5 w-5 h-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input
              v-model="blogStore.searchQuery"
              type="text"
              placeholder="搜索文章标题、内容或标签..."
              class="w-full pl-11 pr-10 py-3 text-base text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-all duration-300 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              @input="handleSearch"
            />
            <button
              v-if="blogStore.searchQuery"
              type="button"
              class="absolute right-3 flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              @click="clearSearch"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
          <div v-if="blogStore.searchQuery" class="mt-2 text-sm text-slate-400 dark:text-slate-500">
            找到 <span class="font-semibold text-indigo-600 dark:text-indigo-400">{{ blogStore.filteredPosts.length }}</span> 篇相关文章
          </div>
        </div>

        <!-- 标签筛选 -->
        <div v-if="blogStore.allTags.length > 0">
          <div class="flex flex-wrap gap-2 justify-center">
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium rounded-full transition-all duration-300"
              :class="blogStore.selectedTag === null
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600'"
              @click="handleTagClick(null)"
            >
              全部
            </button>
            <button
              v-for="tag in blogStore.allTags"
              :key="tag"
              type="button"
              class="px-4 py-2 text-sm font-medium rounded-full transition-all duration-300"
              :class="blogStore.selectedTag === tag
                ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600'"
              @click="handleTagClick(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 博客列表区域 -->
    <section class="py-8 pb-16 bg-white dark:bg-slate-900">
      <div class="container mx-auto px-4 sm:px-6">
        <BlogList
          :posts="blogStore.paginatedPosts"
          :current-page="blogStore.currentPage"
          :total-pages="blogStore.totalPages"
          :loading="blogStore.loading"
          :error="blogStore.error"
          :items-per-page="blogStore.itemsPerPage"
          @post-click="handlePostClick"
          @tag-click="handleTagClick"
          @page-change="handlePageChange"
          @retry="blogStore.loadPosts"
        />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/useBlogStore'
import { Search, X } from 'lucide-vue-next'
import BlogList from '@/components/blog/BlogList.vue'
import type { BlogPost } from '@/types/blog'

const router = useRouter()
const blogStore = useBlogStore()

const totalReadTime = computed(() => {
  return blogStore.posts.reduce((sum: number, post: { readTime: number }) => sum + post.readTime, 0)
})

const blogHeroStats = computed(() => [
  { number: String(blogStore.posts.length), label: '篇文章' },
  { number: String(blogStore.allTags.length), label: '个标签' },
  { number: `${totalReadTime.value} 分钟`, label: '分钟阅读' }
])

const handlePostClick = (post: BlogPost) => {
  router.push(`/blog/${post.id}`)
}

const handleTagClick = (tag: string | null) => {
  blogStore.filterByTag(tag)
}

const handleSearch = () => {
  blogStore.searchPosts(blogStore.searchQuery)
}

const clearSearch = () => {
  blogStore.searchPosts('')
}

const handlePageChange = (page: number) => {
  blogStore.setPage(page)
}

onMounted(() => {
  blogStore.loadPosts()
  document.title = '技术博客 - 佘杰'
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>
