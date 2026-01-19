<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm transition-all duration-300"
    :class="{ 'shadow-md': isScrolled }"
  >
    <nav class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16 md:h-20">
        <!-- Logo -->
        <RouterLink
          to="/"
          class="text-xl md:text-2xl font-bold text-primary-600 dark:text-primary-400 hover:opacity-80 transition-opacity"
        >
          佘杰
        </RouterLink>

        <!-- 桌面端导航 -->
        <div class="hidden md:flex items-center space-x-6 lg:space-x-8">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-mobile-fast py-2"
            active-class="text-primary-600 dark:text-primary-400 font-semibold"
          >
            {{ item.name }}
          </RouterLink>
        </div>

        <!-- 右侧操作按钮 -->
        <div class="flex items-center gap-2 md:gap-4">
          <!-- 搜索按钮 - 桌面端 -->
          <button
            class="hidden sm:flex items-center gap-2 min-h-touch px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-mobile-fast focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="搜索"
            @click="openSearch"
          >
            <Search class="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span class="text-sm text-gray-500 dark:text-gray-400 hidden lg:inline">搜索</span>
            <kbd class="hidden xl:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium text-gray-400 bg-gray-200 dark:bg-gray-700 rounded">
              <span class="text-xs">⌘K</span>
            </kbd>
          </button>

          <!-- 搜索按钮 - 移动端 -->
          <button
            class="sm:hidden min-h-touch min-w-touch p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-mobile-fast focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="搜索"
            @click="openSearch"
          >
            <Search class="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          <!-- 主题切换 -->
          <button
            class="min-h-touch min-w-touch p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-mobile-fast focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Toggle theme"
            @click="appStore.toggleTheme"
          >
            <Sun v-if="appStore.theme === 'dark'" class="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
            <Moon v-else class="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
          </button>

          <!-- 汉堡菜单 - 移动端 -->
          <HamburgerMenu />
        </div>
      </div>
    </nav>

    <!-- 搜索模态框 -->
    <SearchModal />
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/useAppStore'
import { useSearchStore } from '@/stores/useSearchStore'
import SearchModal from '@/components/common/SearchModal.vue'
import HamburgerMenu from '@/components/common/HamburgerMenu.vue'
import { Sun, Moon, Search } from 'lucide-vue-next'

const appStore = useAppStore()
const searchStore = useSearchStore()
const isScrolled = ref(false)

const navItems = [
  { name: '首页', path: '/' },
  { name: '项目', path: '/projects' },
  { name: '技能', path: '/skills' },
  { name: '博客', path: '/blog' },
  { name: '联系', path: '/contact' }
]

// 打开搜索
const openSearch = () => {
  searchStore.openSearch()
}

// 处理滚动
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

// 处理全局快捷键
const handleGlobalKeydown = (e: KeyboardEvent) => {
  // Ctrl+K 或 Cmd+K 打开搜索
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    searchStore.openSearch()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<style scoped>
/* 优化移动端滚动性能 */
header {
  will-change: transform;
  transform: translateZ(0);
}
</style>