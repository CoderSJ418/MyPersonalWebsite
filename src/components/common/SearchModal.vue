<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="searchStore.isOpen"
        class="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4"
        @click.self="searchStore.closeSearch"
      >
        <!-- 遮罩层 -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        <!-- 搜索框容器 -->
        <div
          class="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
          @click.stop
        >
          <!-- 搜索输入框 -->
          <div class="flex items-center border-b border-gray-200 dark:border-gray-700">
            <Search class="w-6 h-6 text-gray-400 ml-4 flex-shrink-0" />
            <input
              ref="searchInput"
              v-model="searchStore.query"
              type="text"
              placeholder="搜索项目、技能、博客..."
              class="flex-1 px-4 py-5 text-lg bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
              @keydown="handleKeydown"
            />
            <div class="flex items-center gap-2 pr-4">
              <kbd class="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 rounded">
                <span class="text-xs">↑↓</span>
                选择
              </kbd>
              <kbd class="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 rounded">
                <span class="text-xs">↵</span>
                跳转
              </kbd>
              <kbd class="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 rounded">
                <span class="text-xs">ESC</span>
                关闭
              </kbd>
            </div>
          </div>

          <!-- 搜索结果 -->
          <div class="max-h-[60vh] overflow-y-auto">
            <!-- 加载状态 -->
            <div v-if="searchStore.loading" class="flex items-center justify-center py-12">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>

            <!-- 无结果 -->
            <div v-else-if="hasNoResults" class="py-12 text-center">
              <div class="text-gray-400 mb-2">
                <SearchX class="w-12 h-12 mx-auto mb-4" />
              </div>
              <p class="text-gray-500 dark:text-gray-400">未找到相关结果</p>
            </div>

            <!-- 显示搜索历史 -->
            <div v-else-if="!searchStore.query && searchStore.history.length > 0" class="p-4">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">搜索历史</h3>
                <button
                  class="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  @click="searchStore.clearHistory"
                >
                  清除
                </button>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="(item, index) in searchStore.history"
                  :key="index"
                  class="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  @click="searchFromHistory(item.query)"
                >
                  {{ item.query }}
                </button>
              </div>
            </div>

            <!-- 搜索结果 -->
            <div v-else-if="hasResults" class="p-4 space-y-6">
              <!-- 项目结果 -->
              <div v-if="searchStore.results.projects.length > 0">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                  <FolderKanban class="w-4 h-4" />
                  项目 ({{ searchStore.results.projects.length }})
                </h3>
                <div class="space-y-2">
                  <div
                    v-for="(item, index) in searchStore.results.projects"
                    :key="item.id"
                    :class="[
                      'p-3 rounded-lg cursor-pointer transition-all',
                      isSelected(item) ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    ]"
                    @click="navigateTo(item.url)"
                    @mouseenter="selectItem(item)"
                  >
                    <div class="flex items-start gap-3">
                      <div class="flex-1 min-w-0">
                        <h4 class="font-medium text-gray-900 dark:text-gray-100 mb-1" v-html="item.highlight?.title || item.title" />
                        <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2" v-html="item.highlight?.description || item.description" />
                        <div v-if="item.metadata?.tags" class="flex flex-wrap gap-1 mt-2">
                          <span
                            v-for="tag in item.metadata.tags.slice(0, 3)"
                            :key="tag"
                            class="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                          >
                            {{ tag }}
                          </span>
                        </div>
                      </div>
                      <ArrowUpRight class="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- 技能结果 -->
              <div v-if="searchStore.results.skills.length > 0">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                  <Zap class="w-4 h-4" />
                  技能 ({{ searchStore.results.skills.length }})
                </h3>
                <div class="space-y-2">
                  <div
                    v-for="(item, index) in searchStore.results.skills"
                    :key="item.id"
                    :class="[
                      'p-3 rounded-lg cursor-pointer transition-all',
                      isSelected(item) ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    ]"
                    @click="navigateTo(item.url)"
                    @mouseenter="selectItem(item)"
                  >
                    <div class="flex items-start gap-3">
                      <div class="flex-1 min-w-0">
                        <h4 class="font-medium text-gray-900 dark:text-gray-100 mb-1" v-html="item.highlight?.title || item.title" />
                        <p class="text-sm text-gray-600 dark:text-gray-400" v-html="item.highlight?.description || item.description" />
                      </div>
                      <ArrowUpRight class="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- 博客结果 -->
              <div v-if="searchStore.results.blogs.length > 0">
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                  <FileText class="w-4 h-4" />
                  博客 ({{ searchStore.results.blogs.length }})
                </h3>
                <div class="space-y-2">
                  <div
                    v-for="(item, index) in searchStore.results.blogs"
                    :key="item.id"
                    :class="[
                      'p-3 rounded-lg cursor-pointer transition-all',
                      isSelected(item) ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    ]"
                    @click="navigateTo(item.url)"
                    @mouseenter="selectItem(item)"
                  >
                    <div class="flex items-start gap-3">
                      <div class="flex-1 min-w-0">
                        <h4 class="font-medium text-gray-900 dark:text-gray-100 mb-1" v-html="item.highlight?.title || item.title" />
                        <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2" v-html="item.highlight?.description || item.description" />
                        <div class="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <span>{{ item.metadata?.author }}</span>
                          <span>•</span>
                          <span>{{ formatDate(item.metadata?.publishedAt) }}</span>
                        </div>
                      </div>
                      <ArrowUpRight class="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 空状态提示 -->
            <div v-else-if="!searchStore.query" class="py-12 text-center">
              <div class="text-gray-400 mb-2">
                <Search class="w-12 h-12 mx-auto mb-4" />
              </div>
              <p class="text-gray-500 dark:text-gray-400 mb-2">输入关键词开始搜索</p>
              <p class="text-sm text-gray-400 dark:text-gray-500">支持搜索项目、技能、博客</p>
            </div>
          </div>

          <!-- 底部快捷键提示 -->
          <div v-if="hasResults" class="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div class="flex items-center gap-4">
                <span class="flex items-center gap-1">
                  <kbd class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↑</kbd>
                  <kbd class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↓</kbd>
                  导航
                </span>
                <span class="flex items-center gap-1">
                  <kbd class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Enter</kbd>
                  跳转
                </span>
              </div>
              <span>共 {{ searchStore.results.total }} 个结果</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchStore } from '@/stores/useSearchStore'
import { useProjectStore } from '@/stores/useProjectStore'
import { useSkillStore } from '@/stores/useSkillStore'
import { useBlogStore } from '@/stores/useBlogStore'
import { flattenSearchResults } from '@/utils/search'
import {
  Search,
  SearchX,
  ArrowUpRight,
  FolderKanban,
  Zap,
  FileText
} from 'lucide-vue-next'

const router = useRouter()
const searchStore = useSearchStore()
const projectStore = useProjectStore()
const skillStore = useSkillStore()
const blogStore = useBlogStore()

const searchInput = ref<HTMLInputElement | null>(null)

// 计算属性
const hasResults = computed(() => searchStore.results.total > 0)
const hasNoResults = computed(() => searchStore.query && searchStore.results.total === 0)

// 格式化日期
const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })
}

// 判断是否选中
const isSelected = (item: any) => {
  return searchStore.selectedResult?.id === item.id
}

// 选择项目
const selectItem = (item: any) => {
  const flatResults = flattenSearchResults(searchStore.results)
  const index = flatResults.findIndex(r => r.id === item.id)
  if (index !== -1) {
    searchStore.selectedIndex = index
  }
}

// 从历史记录搜索
const searchFromHistory = (query: string) => {
  searchStore.query = query
}

// 导航到结果
const navigateTo = (url: string) => {
  searchStore.closeSearch()
  router.push(url)
}

// 处理键盘事件
const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault()
      searchStore.selectPrevious()
      break
    case 'ArrowDown':
      e.preventDefault()
      searchStore.selectNext()
      break
    case 'Enter':
      e.preventDefault()
      if (searchStore.selectedResult) {
        navigateTo(searchStore.selectedResult.url)
      }
      break
    case 'Escape':
      e.preventDefault()
      searchStore.closeSearch()
      break
  }
}

// 监听搜索框打开，自动聚焦
watch(() => searchStore.isOpen, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    searchInput.value?.focus()
  }
})

// 监听查询变化，执行搜索
watch(() => searchStore.query, (newQuery) => {
  if (newQuery.trim()) {
    searchStore.performSearch(
      newQuery,
      projectStore.projects,
      skillStore.skills,
      blogStore.posts
    )
  } else {
    searchStore.results = {
      projects: [],
      skills: [],
      blogs: [],
      total: 0
    }
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: translateY(-20px);
  opacity: 0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>