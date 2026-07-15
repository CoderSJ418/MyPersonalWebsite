<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="searchStore.isOpen" class="sm" @click.self="searchStore.closeSearch">
        <!-- 遮罩层 -->
        <div class="sm__overlay" />

        <!-- 搜索框容器 -->
        <div
ref="dialogRef" role="dialog" aria-modal="true" aria-labelledby="search-modal-title" class="sm__dialog"
          @click.stop @keydown.tab="handleTab">
          <!-- 搜索输入框 -->
          <div class="sm__input-area">
            <Search class="sm__search-icon" />
            <input
id="search-modal-title" ref="searchInput" v-model="searchStore.query" type="text"
              placeholder="搜索博客文章..." aria-label="搜索博客文章" class="sm__input" @keydown="handleKeydown" />
            <div class="sm__hints">
              <kbd class="sm__kbd">
                <span class="sm__kbd-key">↑↓</span>
                选择
              </kbd>
              <kbd class="sm__kbd">
                <span class="sm__kbd-key">↵</span>
                跳转
              </kbd>
              <kbd class="sm__kbd">
                <span class="sm__kbd-key">ESC</span>
                关闭
              </kbd>
            </div>
          </div>

          <!-- 搜索结果 -->
          <div class="sm__results">
            <!-- 加载状态 -->
            <div v-if="searchStore.loading" class="sm__loading">
              <div class="sm__spinner"></div>
            </div>

            <!-- 无结果 -->
            <div v-else-if="hasNoResults" class="sm__empty">
              <SearchX class="sm__empty-icon" />
              <p class="sm__empty-title">未找到相关博客文章</p>
              <p class="sm__empty-subtitle">尝试其他关键词</p>
            </div>

            <!-- 显示搜索历史 -->
            <div v-else-if="!searchStore.query && searchStore.history.length > 0" class="sm__history">
              <div class="sm__history-header">
                <h3 class="sm__history-title">搜索历史</h3>
                <button class="sm__history-clear" @click="searchStore.clearHistory">
                  清除
                </button>
              </div>
              <div class="sm__history-tags">
                <button
v-for="(item, index) in searchStore.history" :key="index" class="sm__history-tag"
                  @click="searchFromHistory(item)">
                  {{ item.query }}
                </button>
              </div>
            </div>

            <!-- 搜索结果 -->
            <div v-else-if="hasResults" class="sm__result-list">
              <div
v-for="(item, index) in searchStore.results.items" :key="item.id" :class="[
                'sm__result',
                index === searchStore.selectedIndex ? 'sm__result--selected' : ''
              ]" @click="navigateTo(item.url)" @mouseenter="searchStore.selectedIndex = index">
                <div class="sm__result-body">
                  <div class="sm__result-content">
                    <h4 class="sm__result-title" v-html="sanitizeHtml(item.title)" />
                    <p class="sm__result-desc" v-html="sanitizeHtml(item.description || '')" />
                    <div class="sm__result-meta">
                      <span v-if="item.date">{{ formatDate(item.date, 'numeric') }}</span>
                    </div>
                  </div>
                  <ArrowUpRight class="sm__result-arrow" />
                </div>
              </div>
            </div>

            <!-- 空状态提示 -->
            <div v-else-if="!searchStore.query" class="sm__empty">
              <Search class="sm__empty-icon" />
              <p class="sm__empty-title">输入关键词开始搜索</p>
              <p class="sm__empty-subtitle">搜索技术博客文章</p>
            </div>
          </div>

          <!-- 底部快捷键提示 -->
          <div v-if="hasResults" class="sm__footer">
            <div class="sm__footer-hints">
              <span class="sm__footer-hint">
                <kbd class="sm__footer-kbd">↑</kbd>
                <kbd class="sm__footer-kbd">↓</kbd>
                导航
              </span>
              <span class="sm__footer-hint">
                <kbd class="sm__footer-kbd">Enter</kbd>
                跳转
              </span>
            </div>
            <span class="sm__footer-count">共 {{ searchStore.results.total }} 篇博客</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchStore } from '@/stores/useSearchStore'
import { useBlogStore } from '@/stores/useBlogStore'
import { Search, SearchX, ArrowUpRight } from 'lucide-vue-next'
import { formatDate } from '@/utils/format'
import { sanitizeHtml } from '@/utils/xss'

const router = useRouter()
const searchStore = useSearchStore()
const blogStore = useBlogStore()

const searchInput = ref<HTMLInputElement | null>(null)
const dialogRef = ref<HTMLElement | null>(null)

const handleTab = (e: KeyboardEvent) => {
  if (!dialogRef.value) return
  const focusableSelectors = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  const focusableElements = dialogRef.value.querySelectorAll<HTMLElement>(focusableSelectors)
  if (focusableElements.length === 0) return
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]
  if (e.shiftKey) {
    if (document.activeElement === firstElement) {
      e.preventDefault()
      lastElement.focus()
    }
  } else {
    if (document.activeElement === lastElement) {
      e.preventDefault()
      firstElement.focus()
    }
  }
}

const hasResults = computed(() => searchStore.results.total > 0)
const hasNoResults = computed(() => searchStore.query && searchStore.results.total === 0)

const searchFromHistory = (query: string) => {
  searchStore.query = query
}

const navigateTo = (url: string) => {
  searchStore.closeSearch()
  router.push(url)
}

const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault()
      searchStore.selectPrevious()
      break
    case 'ArrowDown':
      e.preventDefault()
      searchStore.selectNext()
      break
    case 'Enter':
      e.preventDefault()
      if (searchStore.selectedResult) {
        navigateTo(searchStore.selectedResult.url)
      }
      break
    case 'Escape':
      e.preventDefault()
      searchStore.closeSearch()
      break
  }
}

watch(
  () => searchStore.isOpen,
  async (isOpen) => {
    if (isOpen) {
      await nextTick()
      searchInput.value?.focus()
    }
  }
)

watch(
  () => searchStore.query,
  (newQuery) => {
    if (newQuery.trim()) {
      searchStore.performSearch(newQuery, blogStore.posts)
    } else {
      searchStore.results = { items: [], total: 0 }
    }
  }
)
</script>

<style scoped>
/* ===== 根容器 ===== */
.sm {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: var(--us-space-20) var(--us-space-4);
}

/* ===== 遮罩层 ===== */
.sm__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

/* ===== 对话框 ===== */
.sm__dialog {
  position: relative;
  width: 100%;
  max-width: 42rem;
  background: var(--us-material-solid);
  border-radius: var(--radius-xl, 1rem);
  box-shadow: var(--us-depth-3);
  overflow: hidden;
}

/* ===== 输入区 ===== */
.sm__input-area {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--us-border);
}

.sm__search-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-left: var(--us-space-4);
  color: var(--us-text-tertiary);
  flex-shrink: 0;
}

.sm__input {
  flex: 1;
  padding: var(--us-space-5) var(--us-space-4);
  font-size: 1.125rem;
  background: transparent;
  border: none;
  outline: none;
  color: var(--us-text-primary);
}

.sm__input:focus-visible {
  box-shadow: 0 0 0 2px var(--us-accent-border);
}

.sm__input::placeholder {
  color: var(--us-text-tertiary);
}

.sm__hints {
  display: none;
  align-items: center;
  gap: var(--us-space-2);
  padding-right: var(--us-space-4);
}

@media (min-width: 640px) {
  .sm__hints {
    display: flex;
  }
}

.sm__kbd {
  display: inline-flex;
  align-items: center;
  gap: var(--us-space-1);
  padding: var(--us-space-1) var(--us-space-2);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--us-text-tertiary);
  background: var(--us-surface);
  border-radius: var(--radius-md, 0.375rem);
}

.sm__kbd-key {
  font-size: 0.75rem;
}

/* ===== 结果区 ===== */
.sm__results {
  max-height: 60vh;
  overflow-y: auto;
}

.sm__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--us-space-12);
}

.sm__spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid var(--us-accent-border);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}



/* ===== 空状态 ===== */
.sm__empty {
  padding: var(--us-space-12);
  text-align: center;
}

.sm__empty-icon {
  width: 3rem;
  height: 3rem;
  margin: 0 auto 1rem;
  color: var(--us-text-tertiary);
}

.sm__empty-title {
  margin: 0 0 0.25rem;
  color: var(--us-text-secondary);
}

.sm__empty-subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: var(--us-text-tertiary);
}

/* ===== 搜索历史 ===== */
.sm__history {
  padding: var(--us-space-4);
}

.sm__history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--us-space-3);
}

.sm__history-title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--us-text-secondary);
}

.sm__history-clear {
  font-size: 0.75rem;
  color: var(--us-text-tertiary);
  background: none;
  border: none;
  transition: color var(--us-duration-fast) var(--us-easing);
}

.sm__history-clear:hover {
  color: var(--us-text-secondary);
}

.sm__history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--us-space-2);
}

.sm__history-tag {
  padding: var(--us-space-2) var(--us-space-3);
  font-size: 0.875rem;
  background: var(--us-surface);
  color: var(--us-text-secondary);
  border: none;
  border-radius: var(--radius-md, 0.375rem);
  transition: background var(--us-duration-fast) var(--us-easing);
}

.sm__history-tag:hover {
  background: var(--us-surface-hover);
}

/* ===== 结果列表 ===== */
.sm__result-list {
  padding: var(--us-space-4);
  display: flex;
  flex-direction: column;
  gap: var(--us-space-3);
}

.sm__result {
  padding: var(--us-space-4);
  border-radius: var(--radius-lg, 0.75rem);
  cursor: pointer;
  border: 1px solid transparent;
  transition:
    background var(--us-duration-fast) var(--us-easing),
    border-color var(--us-duration-fast) var(--us-easing);
}

.sm__result:hover {
  background: var(--us-surface-hover);
}

.sm__result--selected {
  background: var(--us-accent-subtle);
  border-color: var(--us-accent-border);
}

.sm__result-body {
  display: flex;
  align-items: flex-start;
  gap: var(--us-space-3);
}

.sm__result-content {
  flex: 1;
  min-width: 0;
}

.sm__result-title {
  margin: 0 0 0.25rem;
  font-weight: 500;
  color: var(--us-text-primary);
}

.sm__result-desc {
  margin: 0;
  font-size: 0.875rem;
  color: var(--us-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.sm__result-meta {
  display: flex;
  align-items: center;
  gap: var(--us-space-3);
  margin-top: var(--us-space-2);
  font-size: 0.75rem;
  color: var(--us-text-tertiary);
}

.sm__result-arrow {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--us-text-tertiary);
  flex-shrink: 0;
  margin-top: var(--us-space-1);
}

/* ===== 底部 ===== */
.sm__footer {
  padding: var(--us-space-3) var(--us-space-4);
  border-top: 1px solid var(--us-border);
  background: var(--us-surface);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--us-text-tertiary);
}

.sm__footer-hints {
  display: flex;
  align-items: center;
  gap: var(--us-space-4);
}

.sm__footer-hint {
  display: flex;
  align-items: center;
  gap: var(--us-space-1);
}

.sm__footer-kbd {
  padding: var(--us-space-1) var(--us-space-2);
  background: var(--us-surface-hover);
  border-radius: var(--radius-md, 0.375rem);
  font-size: 0.75rem;
}

.sm__footer-count {
  color: var(--us-text-tertiary);
}

/* ===== 动画 ===== */
.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--us-duration-fast) var(--us-easing);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .sm__dialog,
.modal-leave-active .sm__dialog {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.modal-enter-from .sm__dialog,
.modal-leave-to .sm__dialog {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
