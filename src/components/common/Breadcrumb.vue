<script setup lang="ts">
/**
 * Breadcrumb — 面包屑导航组件
 *
 * 职责：
 * - 语义化HTML + Schema.org结构化数据
 * - SVG chevron分隔符
 * - 响应式：移动端截断中间项，仅显示首页+…+当前页
 * - 暗色模式 + prefers-reduced-motion
 * - 使用 --us-* CSS变量体系
 */

import { computed, ref, onMounted, onUnmounted } from 'vue'

export interface BreadcrumbItem {
  text: string
  path: string
  disabled?: boolean
}

interface Props {
  items: BreadcrumbItem[]
}

const props = defineProps<Props>()

// 响应式断点检测（640px = sm断点）
const isMobile = ref(false)
let mediaQuery: MediaQueryList | null = null

const handleBreakpoint = (e: MediaQueryListEvent | MediaQueryList) => {
  isMobile.value = e.matches
}

onMounted(() => {
  mediaQuery = window.matchMedia('(max-width: 640px)')
  isMobile.value = mediaQuery.matches
  mediaQuery.addEventListener('change', handleBreakpoint)
})

onUnmounted(() => {
  mediaQuery?.removeEventListener('change', handleBreakpoint)
})

/**
 * 移动端截断逻辑：
 * - 桌面端 或 总项数 ≤ 2：全部显示
 * - 移动端 且 总项数 > 2：首页 + … + 当前页
 */
const displayItems = computed(() => {
  const all = props.items
  if (!isMobile.value || all.length <= 2) {
    return all.map((item, i) => ({ ...item, isLast: i === all.length - 1, isTruncated: false }))
  }
  return [
    { ...all[0], isLast: false, isTruncated: false },
    { text: '…', path: '', disabled: true, isLast: false, isTruncated: true },
    { ...all[all.length - 1], isLast: true, isTruncated: false },
  ]
})
</script>

<template>
  <nav class="bc" aria-label="Breadcrumb">
    <ol class="bc__list" itemscope itemtype="https://schema.org/BreadcrumbList">
      <li
v-for="(item, index) in displayItems" :key="index" class="bc__item"
        :class="{ 'bc__item--current': item.isLast && !item.isTruncated }" itemprop="itemListElement" itemscope
        itemtype="https://schema.org/ListItem">
        <!-- 省略号（移动端截断） -->
        <span v-if="item.isTruncated" class="bc__ellipsis" aria-hidden="true">…</span>

        <!-- 当前页（无链接） -->
        <span v-else-if="item.isLast" class="bc__text" aria-current="page" itemprop="name">
          {{ item.text }}
        </span>

        <!-- 可点击链接 -->
        <router-link v-else :to="item.path" class="bc__link" itemprop="item">
          <span itemprop="name">{{ item.text }}</span>
        </router-link>

        <!-- Schema.org position -->
        <meta v-if="!item.isTruncated" itemprop="position" :content="String(index + 1)" />

        <!-- 分隔符（不在最后一项后显示） -->
        <svg
v-if="!item.isLast" class="bc__sep" width="12" height="12" viewBox="0 0 12 12" fill="none"
          aria-hidden="true">
          <path
d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
/* ===== 面包屑容器 ===== */
.bc {
  margin-bottom: var(--us-space-3);
}

.bc__list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  list-style: none;
  margin: 0;
  padding: 0;
}

/* ===== 面包屑项 ===== */
.bc__item {
  display: inline-flex;
  align-items: center;
}

/* ===== 链接 ===== */
.bc__link {
  font-size: var(--text-xs);
  color: var(--us-text-secondary);
  text-decoration: none;
  transition: color var(--us-duration-fast) var(--us-easing);
  white-space: nowrap;
}

.bc__link:hover {
  color: var(--us-accent);
}

.bc__link:focus-visible {
  outline: 2px solid var(--us-accent);
  outline-offset: 2px;
  border-radius: 2px;
}

/* ===== 当前页文本 ===== */
.bc__text {
  font-size: var(--text-xs);
  color: var(--us-text-primary);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

/* ===== 省略号 ===== */
.bc__ellipsis {
  font-size: var(--text-xs);
  color: var(--us-text-secondary);
  user-select: none;
  margin: 0 var(--us-space-1);
}

/* ===== 分隔符 ===== */
.bc__sep {
  color: var(--us-text-secondary);
  flex-shrink: 0;
  margin: 0 var(--us-space-2);
  opacity: 0.5;
}

/* ===== prefers-reduced-motion ===== */
@media (prefers-reduced-motion: reduce) {
  .bc__link {
    transition: none;
  }
}
</style>