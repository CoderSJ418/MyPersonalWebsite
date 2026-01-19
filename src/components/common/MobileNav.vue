<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 pb-safe-bottom md:hidden"
    role="navigation"
    aria-label="Bottom navigation"
  >
    <div class="flex items-center justify-around px-2 py-2">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="flex flex-col items-center justify-center min-h-[56px] min-w-[56px] px-2 py-1 rounded-lg transition-all duration-mobile-fast"
        :class="isActive(item.path) ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'"
        :aria-label="item.name"
        :aria-current="isActive(item.path) ? 'page' : undefined"
      >
        <component
          :is="item.icon"
          class="w-6 h-6 transition-transform duration-mobile-fast"
          :class="isActive(item.path) ? 'scale-110' : 'scale-100'"
        />
        <span class="text-[10px] mt-1 font-medium">{{ item.name }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Home, Briefcase, Award, BookOpen, Mail } from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  { name: '首页', path: '/', icon: Home },
  { name: '项目', path: '/projects', icon: Briefcase },
  { name: '技能', path: '/skills', icon: Award },
  { name: '博客', path: '/blog', icon: BookOpen },
  { name: '联系', path: '/contact', icon: Mail }
]

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

<style scoped>
/* 触摸反馈 */
nav a:active {
  transform: scale(0.95);
}

/* 添加安全区域支持 */
@supports (padding: max(0px)) {
  nav {
    padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
  }
}
</style>