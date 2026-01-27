<template>
  <header
    class="header"
    :class="{ 'header--scrolled': isScrolled }"
  >
    <nav class="container mx-auto px-4 sm:px-6">
      <div class="header__content">
        <!-- Logo -->
        <RouterLink
          to="/"
          class="header__logo"
        >
          <div class="logo-text">佘杰</div>
          <div class="logo-dot"></div>
        </RouterLink>

        <!-- 桌面端导航 -->
        <div class="header__nav">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="header__nav-link"
            :class="{ 'header__nav-link--active': isActiveRoute(item.path) }"
          >
            {{ item.name }}
          </RouterLink>
        </div>

        <!-- 右侧操作按钮 -->
        <div class="header__actions">
          <!-- 搜索按钮 -->
          <button
            class="header__action-btn"
            aria-label="搜索"
            @click="openSearch"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <!-- 主题切换 -->
          <button
            class="header__action-btn header__action-btn--theme"
            aria-label="Toggle theme"
            @click="toggleTheme"
          >
            <Sun v-if="isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h.01M12 7h.01" />
            </Sun>
            <Moon v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </Moon>
          </button>

          <!-- 汉堡菜单 - 移动端 -->
          <button
            class="header__action-btn header__menu-btn"
            aria-label="Menu"
            @click="toggleMenu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <!-- 移动端菜单 -->
    <div 
      class="header__mobile-menu"
      :class="{ 'header__mobile-menu--open': isMenuOpen }"
    >
      <div class="mobile-menu__content">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="mobile-menu__link"
          :class="{ 'mobile-menu__link--active': isActiveRoute(item.path) }"
          @click="closeMenu"
        >
          {{ item.name }}
        </RouterLink>
        
        <div class="mobile-menu__actions">
          <button
            class="mobile-menu__btn"
            @click="openSearch"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            搜索
          </button>
          
          <button
            class="mobile-menu__btn"
            @click="toggleTheme"
          >
            <Sun v-if="isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h.01M12 7h.01" />
            </Sun>
            <Moon v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </Moon>
            {{ isDark ? '亮色' : '深色' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 搜索模态框 -->
    <SearchModal />
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/useAppStore'
import { useSearchStore } from '@/stores/useSearchStore'
import SearchModal from '@/components/common/SearchModal.vue'
import { Sun, Moon } from 'lucide-vue-next'

const route = useRoute()
const appStore = useAppStore()
const searchStore = useSearchStore()
const isScrolled = ref(false)
const isMenuOpen = ref(false)

const navItems = [
  { name: '首页', path: '/' },
  { name: '项目', path: '/projects' },
  { name: '技能', path: '/skills' },
  {name: '博客', path: '/blog' },
  { name: '联系', path: '/contact' }
]

const isDark = computed(() => appStore.theme === 'dark')

const isActiveRoute = (path: string) => {
  return route.path === path || (path !== '/' && route.path.startsWith(path))
}

// 打开搜索
const openSearch = () => {
  searchStore.openSearch()
}

// 切换主题
const toggleTheme = () => {
  appStore.toggleTheme()
}

// 切换菜单
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// 关闭菜单
const closeMenu = () => {
  isMenuOpen.value = false
}

// 处理滚动
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

// 处理全局快捷键
const handleGlobalKeydown = (e: KeyboardEvent) => {
  // Ctrl+K 或 Cmd+K 打开搜索
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    searchStore.openSearch()
  }
  
  // ESC 关闭菜单
  if (e.key === 'Escape') {
    isMenuOpen.value = false
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
/* 导航栏 */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-subtle);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark .header {
  background: rgba(15, 23, 42, 0.8);
}

.header--scrolled {
  box-shadow: var(--shadow-base);
  background: rgba(255, 255, 255, 0.95);
  dark:background(rgba(15, 23, 42, 0.95));
}

.header__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4.5rem;
}

/* Logo */
.header__logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.header__logo:hover {
  transform: translateY(-2px);
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.logo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary-500);
  box-shadow: 0 0 10px var(--primary-500);
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

/* 桌面端导航 */
.header__nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header__nav-link {
  position: relative;
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.header__nav-link:hover {
  background: var(--primary-50);
  dark:background(var(--primary-950));
  color: var(--primary-600);
  dark:color(var(--primary-400));
}

.header__nav-link--active {
  background: var(--gradient-primary);
  color: white;
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

/* 操作按钮 */
.header__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header__action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  background: transparent;
  border: 1px solid var(--border-default);
  border-radius: 0.75rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.header__action-btn:hover {
  background: var(--primary-50);
  dark:background(var(--primary-950));
  color: var(--primary-600);
  dark:color(var(--primary-400));
  border-color: var(--primary-300);
  dark:border(var(--primary-700));
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.header__action-btn--theme {
  background: var(--surface-2);
}

.header__action-btn--theme:hover {
  background: var(--primary-100);
  dark:background(var(--primary-900));
}

.header__menu-btn {
  display: none;
}

/* 移动端菜单 */
.header__mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 0;
  overflow: hidden;
  background: white;
  dark:background(var(--surface-1));
  border-bottom: 1px solid var(--border-default);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-lg);
}

.header__mobile-menu--open {
  max-height: 400px;
  padding: 1rem;
}

.mobile-menu__content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-menu__link {
  display: block;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.mobile-menu__link:hover {
  background: var(--primary-50);
  dark:background(var(--primary-950));
  color: var(--primary-600);
  dark:color(var(--primary-400));
}

.mobile-menu__link--active {
  background: var(--gradient-primary);
  color: white;
  font-weight: 600;
}

.mobile-menu__actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-subtle);
}

.mobile-menu__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--surface-2);
  border: 1px solid var(--border-default);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-menu__btn:hover {
  background: var(--primary-50);
  dark:background(var(--primary-950));
  color: var(--primary-600);
  dark:color(var(--primary-400));
  border-color: var(--primary-300);
  dark:border(var(--primary-700));
}

/* 响应式 */
@media (max-width: 768px) {
  .header__nav {
    display: none;
  }
  
  .header__menu-btn {
    display: flex;
  }
}

/* GPU加速 */
.header {
  will-change: transform;
  transform: translateZ(0);
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .header,
  .header__logo,
  .header__nav-link,
  .header__action-btn,
  .mobile-menu__link,
  .mobile-menu__btn {
    transition-duration: 0.01ms !important;
  }
  
  .logo-dot {
    animation-duration: 0.01ms !important;
  }
}
</style>