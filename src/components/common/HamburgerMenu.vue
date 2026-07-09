<template>
  <div class="hm">
    <!-- 汉堡菜单按钮 -->
    <button class="hm__trigger" aria-label="Toggle menu" :aria-expanded="isOpen" @click="toggleMenu">
      <Transition name="hamburger" mode="out-in">
        <Menu v-if="!isOpen" class="hm__trigger-icon" />
        <X v-else class="hm__trigger-icon" />
      </Transition>
    </button>

    <!-- 遮罩层 -->
    <Transition name="fade">
      <div v-if="isOpen" class="hm__overlay" aria-hidden="true" @click="closeMenu" />
    </Transition>

    <!-- 移动端菜单 -->
    <Transition name="slide">
      <div v-if="isOpen" class="hm__panel" role="dialog" aria-modal="true" aria-label="Navigation menu">
        <!-- 菜单头部 -->
        <div class="hm__header">
          <span class="hm__title">菜单</span>
          <button class="hm__close" aria-label="Close menu" @click="closeMenu">
            <X class="hm__close-icon" />
          </button>
        </div>

        <!-- 菜单内容 -->
        <nav class="hm__nav">
          <ul class="hm__list">
            <li v-for="item in navItems" :key="item.path">
              <RouterLink :to="item.path" class="hm__link" active-class="hm__link--active" @click="closeMenu">
                <component :is="item.icon" class="hm__link-icon" />
                <span>{{ item.name }}</span>
              </RouterLink>
            </li>
          </ul>

          <!-- 分隔线 -->
          <div class="hm__divider" />

          <!-- 主题切换 -->
          <button class="hm__action" aria-label="切换主题" @click="toggleTheme">
            <Sun v-if="theme === 'dark'" class="hm__action-icon hm__action-icon--sun" />
            <Moon v-else class="hm__action-icon" />
            <span>{{ theme === 'dark' ? '浅色模式' : '深色模式' }}</span>
          </button>

          <!-- 搜索按钮 -->
          <button class="hm__action" aria-label="搜索" @click="openSearch">
            <Search class="hm__action-icon" />
            <span>搜索</span>
          </button>
        </nav>

        <!-- 菜单底部 -->
        <div class="hm__footer">
          <div class="hm__socials">
            <a
:href="contactStore.contact.social.github" target="_blank" rel="noopener noreferrer" class="hm__social"
              aria-label="GitHub">
              <Github class="hm__social-icon" />
            </a>
            <a
:href="contactStore.contact.social.linkedin" target="_blank" rel="noopener noreferrer" class="hm__social"
              aria-label="LinkedIn">
              <Linkedin class="hm__social-icon" />
            </a>
            <a :href="'mailto:' + contactStore.contact.email" class="hm__social" aria-label="Email">
              <Mail class="hm__social-icon" />
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/useAppStore'
import { useSearchStore } from '@/stores/useSearchStore'
import { useContactInfoStore } from '@/stores/useContactInfoStore'
import {
  Menu,
  X,
  Home,
  Briefcase,
  BookOpen,
  Sun,
  Moon,
  Search,
  Github,
  Linkedin,
  Mail
} from 'lucide-vue-next'

const appStore = useAppStore()
const searchStore = useSearchStore()
const contactStore = useContactInfoStore()

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
  { name: '博客', path: '/blog', icon: BookOpen }
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
.hm {
  position: relative;
}

/* ===== 触发按钮 ===== */
.hm__trigger {
  min-height: 44px;
  min-width: 44px;
  padding: var(--us-space-2);
  border-radius: var(--radius-md, 0.375rem);
  border: none;
  background: transparent;
  transition: background var(--us-duration-fast) var(--us-easing);
}

.hm__trigger:hover {
  background: var(--us-surface-hover);
  transform: translateY(-1px);
}

.hm__trigger:active {
  transform: scale(0.95);
}

.hm__trigger:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--us-accent-border);
}

.hm__trigger-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--us-text-primary);
}

/* ===== 遮罩层 ===== */
.hm__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: var(--z-overlay);
}

@media (min-width: 768px) {
  .hm__overlay {
    display: none;
  }
}

/* ===== 面板 ===== */
.hm__panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 18rem;
  max-width: 80vw;
  background: var(--us-material-solid);
  box-shadow: var(--us-depth-3);
  z-index: var(--z-overlay-elevated);
  overflow-y: auto;
}

@media (min-width: 768px) {
  .hm__panel {
    display: none;
  }
}

/* ===== 头部 ===== */
.hm__header {
  position: sticky;
  top: 0;
  background: var(--us-material-solid);
  border-bottom: 1px solid var(--us-border);
  padding: var(--us-space-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hm__title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--us-text-primary);
}

.hm__close {
  min-height: 44px;
  min-width: 44px;
  padding: var(--us-space-2);
  border-radius: var(--radius-md, 0.375rem);
  border: none;
  background: transparent;
  transition: background var(--us-duration-fast) var(--us-easing);
}

.hm__close:hover {
  background: var(--us-surface-hover);
  transform: translateY(-1px);
}

.hm__close:active {
  transform: scale(0.95);
}

.hm__close:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--us-accent-border);
}

.hm__close-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--us-text-primary);
}

/* ===== 导航 ===== */
.hm__nav {
  padding: var(--us-space-6) var(--us-space-4);
}

.hm__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--us-space-2);
}

.hm__link {
  display: flex;
  align-items: center;
  gap: var(--us-space-3);
  padding: var(--us-space-3) var(--us-space-4);
  border-radius: var(--radius-md, 0.375rem);
  color: var(--us-text-secondary);
  transition:
    background var(--us-duration-fast) var(--us-easing),
    color var(--us-duration-fast) var(--us-easing);
}

.hm__link:hover {
  background: var(--us-accent-subtle);
  color: var(--us-accent);
  transform: translateY(-1px);
}

.hm__link:active {
  transform: scale(0.95);
}

.hm__link--active {
  background: var(--us-accent-subtle);
  color: var(--us-accent);
  font-weight: 600;
}

.hm__link-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

/* ===== 分隔线 ===== */
.hm__divider {
  margin: var(--us-space-6) 0;
  border-top: 1px solid var(--us-border);
}

/* ===== 操作按钮 ===== */
.hm__action {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--us-space-3);
  padding: var(--us-space-3) var(--us-space-4);
  border-radius: var(--radius-md, 0.375rem);
  border: none;
  background: transparent;
  color: var(--us-text-secondary);
  transition:
    background var(--us-duration-fast) var(--us-easing),
    color var(--us-duration-fast) var(--us-easing);
}

.hm__action:hover {
  background: var(--us-surface-hover);
  transform: translateY(-1px);
}

.hm__action:active {
  transform: scale(0.95);
}

.hm__action-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.hm__action-icon--sun {
  color: #facc15;
}

/* ===== 底部 ===== */
.hm__footer {
  position: sticky;
  bottom: 0;
  background: var(--us-material-solid);
  border-top: 1px solid var(--us-border);
  padding: var(--us-space-4);
}

.hm__socials {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--us-space-6);
}

.hm__social {
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--us-text-tertiary);
  transition: color var(--us-duration-fast) var(--us-easing);
}

.hm__social:hover {
  color: var(--us-accent);
}

.hm__social-icon {
  width: 1.5rem;
  height: 1.5rem;
}

/* ===== 动画 ===== */
.hamburger-enter-active,
.hamburger-leave-active {
  transition: transform var(--us-duration-fast) var(--us-easing);
}

.hamburger-enter-from,
.hamburger-leave-to {
  transform: rotate(-90deg);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--us-duration-normal) var(--us-easing);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform var(--us-duration-normal) var(--us-easing);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>