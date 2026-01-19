<template>
  <div class="relative">
    <!-- 汉堡菜单按钮 -->
    <button
      class="min-h-touch min-w-touch p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-mobile-fast focus:outline-none focus:ring-2 focus:ring-primary-500"
      aria-label="Toggle menu"
      aria-expanded="isOpen"
      @click="toggleMenu"
    >
      <Transition name="hamburger" mode="out-in">
        <Menu v-if="!isOpen" class="w-6 h-6 text-gray-700 dark:text-gray-300" />
        <X v-else class="w-6 h-6 text-gray-700 dark:text-gray-300" />
      </Transition>
    </button>

    <!-- 遮罩层 -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
        aria-hidden="true"
        @click="closeMenu"
      />
    </Transition>

    <!-- 移动端菜单 -->
    <Transition name="slide">
      <div
        v-if="isOpen"
        class="fixed top-0 right-0 bottom-0 w-72 max-w-[80vw] bg-white dark:bg-gray-900 shadow-2xl z-50 md:hidden overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <!-- 菜单头部 -->
        <div class="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-4 flex items-center justify-between">
          <span class="text-lg font-bold text-gray-900 dark:text-white">菜单</span>
          <button
            class="min-h-touch min-w-touch p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close menu"
            @click="closeMenu"
          >
            <X class="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        <!-- 菜单内容 -->
        <nav class="px-4 py-6">
          <ul class="space-y-2">
            <li v-for="item in navItems" :key="item.path">
              <RouterLink
                :to="item.path"
                class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-mobile-fast"
                active-class="bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold"
                @click="closeMenu"
              >
                <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
                <span class="mobile-base">{{ item.name }}</span>
              </RouterLink>
            </li>
          </ul>

          <!-- 分隔线 -->
          <div class="my-6 border-t border-gray-200 dark:border-gray-700" />

          <!-- 主题切换 -->
          <button
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-mobile-fast"
            @click="toggleTheme"
          >
            <Sun v-if="theme === 'dark'" class="w-5 h-5 flex-shrink-0 text-yellow-400" />
            <Moon v-else class="w-5 h-5 flex-shrink-0 text-gray-600" />
            <span class="mobile-base">{{ theme === 'dark' ? '浅色模式' : '深色模式' }}</span>
          </button>

          <!-- 搜索按钮 -->
          <button
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-mobile-fast"
            @click="openSearch"
          >
            <Search class="w-5 h-5 flex-shrink-0" />
            <span class="mobile-base">搜索</span>
          </button>
        </nav>

        <!-- 菜单底部 -->
        <div class="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-4">
          <div class="flex items-center justify-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              class="min-h-touch min-w-touch flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label="GitHub"
            >
              <Github class="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              class="min-h-touch min-w-touch flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin class="w-6 h-6" />
            </a>
            <a
              href="mailto:your.email@example.com"
              class="min-h-touch min-w-touch flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              aria-label="Email"
            >
              <Mail class="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/useAppStore'
import { useSearchStore } from '@/stores/useSearchStore'
import { Menu, X, Home, Briefcase, Award, BookOpen, Mail, Sun, Moon, Search, Github, Linkedin } from 'lucide-vue-next'

const appStore = useAppStore()
const searchStore = useSearchStore()

const isOpen = computed({
  get: () => appStore.menuOpen,
  set: (value) => {
    if (value) {
      appStore.toggleMenu()
    } else {
      appStore.closeMenu()
    }
  }
})

const theme = computed(() => appStore.theme)

const navItems = [
  { name: '首页', path: '/', icon: Home },
  { name: '项目', path: '/projects', icon: Briefcase },
  { name: '技能', path: '/skills', icon: Award },
  { name: '博客', path: '/blog', icon: BookOpen },
  { name: '联系', path: '/contact', icon: Mail }
]

const toggleMenu = () => {
  appStore.toggleMenu()
}

const closeMenu = () => {
  appStore.closeMenu()
}

const toggleTheme = () => {
  appStore.toggleTheme()
}

const openSearch = () => {
  searchStore.openSearch()
  closeMenu()
}
</script>

<style scoped>
/* 汉堡菜单按钮动画 */
.hamburger-enter-active,
.hamburger-leave-active {
  transition: transform 0.2s ease;
}

.hamburger-enter-from,
.hamburger-leave-to {
  transform: rotate(-90deg);
  opacity: 0;
}

/* 遮罩层动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 菜单滑入动画 */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>