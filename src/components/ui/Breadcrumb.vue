<template>
  <nav
    ref="breadcrumbRef"
    class="breadcrumb"
    :aria-label="label"
  >
    <ol class="breadcrumb__list">
      <li
        v-for="(item, index) in items"
        :key="item.label"
        class="breadcrumb__item"
      >
        <!-- 链接 -->
        <RouterLink
          v-if="item.href && index < items.length - 1"
          :to="item.href"
          class="breadcrumb__link"
          :aria-current="index === items.length - 1 ? 'page' : undefined"
        >
          <span v-if="item.icon" class="breadcrumb__icon" aria-hidden="true">
            <component :is="item.icon" />
          </span>
          <span class="breadcrumb__label">{{ item.label }}</span>
        </RouterLink>

        <!-- 当前页面 -->
        <span
          v-else
          class="breadcrumb__current"
          :aria-current="index === items.length - 1 ? 'page' : undefined"
        >
          <span v-if="item.icon" class="breadcrumb__icon" aria-hidden="true">
            <component :is="item.icon" />
          </span>
          <span class="breadcrumb__label">{{ item.label }}</span>
        </span>

        <!-- 分隔符 -->
        <span
          v-if="index < items.length - 1"
          class="breadcrumb__separator"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Component } from 'vue'

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: Component
}

interface Props {
  items: BreadcrumbItem[]
  label?: string
}

withDefaults(defineProps<Props>(), {
  label: '面包屑导航',
})

const breadcrumbRef = ref<HTMLElement | null>(null)

onMounted(() => {
  // 简单的淡入动画
  if (breadcrumbRef.value) {
    breadcrumbRef.value.style.opacity = '0'
    breadcrumbRef.value.style.transform = 'translateY(-10px)'
    
    requestAnimationFrame(() => {
      breadcrumbRef.value!.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
      breadcrumbRef.value!.style.opacity = '1'
      breadcrumbRef.value!.style.transform = 'translateY(0)'
    })
  }
})
</script>

<style scoped>
.breadcrumb {
  width: 100%;
  padding: 1rem 0;
  font-size: 0.875rem;
}

.breadcrumb__list {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.breadcrumb__item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.breadcrumb__link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
  border-radius: var(--radius-sm);
  padding: 0.25rem 0.5rem;
  margin: -0.25rem;
}

.breadcrumb__link:hover {
  color: var(--primary-600);
  background: var(--primary-50);
  text-decoration: none;
}

.breadcrumb__link:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}

.breadcrumb__current {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--text-primary);
  font-weight: 600;
  padding: 0.25rem 0.5rem;
}

.breadcrumb__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
}

.breadcrumb__icon svg {
  width: 100%;
  height: 100%;
}

.breadcrumb__separator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  color: var(--text-tertiary);
  margin: 0 0.25rem;
}

.breadcrumb__separator svg {
  width: 100%;
  height: 100%;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .breadcrumb {
    font-size: 0.8125rem;
    padding: 0.75rem 0;
  }
  
  .breadcrumb__link,
  .breadcrumb__current {
    padding: 0.125rem 0.375rem;
    margin: -0.125rem;
  }
}

/* 暗黑模式 */
@media (prefers-color-scheme: dark) {
  .breadcrumb__link:hover {
    color: var(--primary-400);
    background: var(--primary-950);
  }
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .breadcrumb__link,
  .breadcrumb__link:hover,
  .breadcrumb__link:focus-visible {
    transition-duration: 0.01ms !important;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: more) {
  .breadcrumb__link:hover {
    color: var(--primary-700);
    background: var(--surface-2);
    border: 1px solid var(--border-default);
  }
  
  .breadcrumb__current {
    border: 1px solid var(--border-default);
    border-radius: var(--radius-sm);
  }
}

/* 打印样式 */
@media print {
  .breadcrumb {
    display: none;
  }
}
</style>