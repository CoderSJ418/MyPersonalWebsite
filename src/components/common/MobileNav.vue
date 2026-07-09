<template>
  <nav class="mn" role="navigation" aria-label="Bottom navigation">
    <div class="mn__list">
      <RouterLink
v-for="item in navItems" :key="item.path" :to="item.path" class="mn__item"
        :class="isActive(item.path) ? 'mn__item--active' : ''" :aria-label="item.name"
        :aria-current="isActive(item.path) ? 'page' : undefined">
        <component :is="item.icon" class="mn__icon" />
        <span class="mn__label">{{ item.name }}</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Home, Briefcase, BookOpen } from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  { name: '首页', path: '/', icon: Home },
  { name: '项目', path: '/projects', icon: Briefcase },
  { name: '博客', path: '/blog', icon: BookOpen }
]

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

<style scoped>
.mn {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: var(--z-overlay-elevated);
  background: var(--us-material-solid);
  border-top: 1px solid var(--us-border);
}

@media (min-width: 768px) {
  .mn {
    display: none;
  }
}

.mn__list {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: var(--us-space-2) var(--us-space-2);
}

.mn__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 56px;
  min-width: 56px;
  padding: var(--us-space-1) var(--us-space-2);
  border-radius: var(--radius-lg);
  color: var(--us-text-tertiary);
  transition: color var(--us-duration-fast) var(--us-easing);
}

.mn__item--active {
  color: var(--us-accent);
}

.mn__item:active {
  transform: scale(0.95);
}

.mn__icon {
  width: 1.5rem;
  height: 1.5rem;
  transition: transform var(--us-duration-fast) var(--us-easing);
}

.mn__item--active .mn__icon {
  transform: scale(1.1);
}

.mn__label {
  font-size: var(--text-xs);
  margin-top: var(--us-space-1);
  font-weight: 500;
}

/* 安全区域支持 */
@supports (padding: max(0px)) {
  .mn {
    padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
  }
}
</style>