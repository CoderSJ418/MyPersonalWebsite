<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm transition-all duration-300"
    :class="{ 'shadow-md': isScrolled }"
  >
    <nav class="container mx-auto px-4">
      <div class="flex items-center justify-between h-14">
        <!-- Logo -->
        <RouterLink
          to="/"
          class="flex items-center gap-2 text-xl font-bold text-primary-600 dark:text-primary-400 hover:opacity-80 transition-opacity"
        >
          <span class="mobile-xl">佘杰</span>
        </RouterLink>

        <!-- 右侧操作按钮 -->
        <div class="flex items-center gap-2">
          <!-- 搜索按钮 -->
          <button
            class="min-h-touch min-w-touch p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-mobile-fast focus:outline-none focus:ring-2 focus:ring-primary-500"
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
            <Sun v-if="appStore.theme === 'dark'" class="w-5 h-5 text-yellow-400" />
            <Moon v-else class="w-5 h-5 text-gray-600" />
          </button>

          <!-- 汉堡菜单 -->
          <HamburgerMenu />
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/useAppStore'
import { useSearchStore } from '@/stores/useSearchStore'
import HamburgerMenu from '@/components/common/HamburgerMenu.vue'
import { Sun, Moon, Search } from 'lucide-vue-next'

const appStore = useAppStore()
const searchStore = useSearchStore()
const isScrolled = ref(false)

const openSearch = () => {
  searchStore.openSearch()
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* 优化移动端滚动性能 */
header {
  will-change: transform;
  transform: translateZ(0);
}
</style>