<template>
  <header class="mh" :class="{ 'mh--scrolled': isScrolled }">
    <nav class="mh__nav">
      <div class="mh__bar">
        <!-- Logo -->
        <RouterLink to="/" class="mh__logo">
          <span>佘杰</span>
        </RouterLink>

        <!-- 右侧操作按钮 -->
        <div class="mh__actions">
          <!-- 搜索按钮 -->
          <button class="mh__btn" aria-label="搜索" @click="openSearch">
            <Search class="mh__icon" />
          </button>

          <!-- 主题切换 -->
          <button class="mh__btn" aria-label="Toggle theme" @click="appStore.toggleTheme">
            <Sun v-if="appStore.theme === 'dark'" class="mh__icon mh__icon--sun" />
            <Moon v-else class="mh__icon" />
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
.mh {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-overlay-elevated);
  background: var(--us-bg-start);
  box-shadow: var(--us-depth-1);
  transition: box-shadow var(--us-duration-normal) var(--us-easing);
  will-change: transform;
  transform: translateZ(0);
}

.mh--scrolled {
  box-shadow: var(--us-depth-2);
}

.mh__nav {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.mh__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3.5rem;
}

.mh__logo {
  display: flex;
  align-items: center;
  gap: var(--us-space-2);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--us-accent);
  transition: opacity var(--us-duration-fast) var(--us-easing);
}

.mh__logo:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

.mh__actions {
  display: flex;
  align-items: center;
  gap: var(--us-space-2);
}

.mh__btn {
  min-height: 44px;
  min-width: 44px;
  padding: var(--us-space-2);
  border-radius: var(--radius-md, 0.375rem);
  border: none;
  background: transparent;
  transition: background var(--us-duration-fast) var(--us-easing);
}

.mh__btn:hover {
  background: var(--us-surface-hover);
  transform: translateY(-1px);
  box-shadow: var(--us-depth-1);
}

.mh__btn:active {
  transform: scale(0.95);
  box-shadow: none;
}

.mh__btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--us-accent-border);
}

.mh__icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--us-text-secondary);
}

.mh__icon--sun {
  color: #facc15;
}
</style>