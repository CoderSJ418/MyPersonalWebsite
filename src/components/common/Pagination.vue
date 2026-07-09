<template>
  <nav class="pagination" aria-label="分页导航">
    <!-- 上一页按钮 -->
    <button
type="button"
      class="pagination__btn"
      :disabled="currentPage === 1"
      aria-label="上一页"
      @click="handlePrevPage">
      <ChevronLeft :size="18" />
    </button>

    <!-- 页码按钮 -->
    <div class="pagination__pages">
      <template v-for="page in visiblePages" :key="page">
        <!-- 省略号 -->
        <span v-if="page === '...'" class="pagination__ellipsis">...</span>
        <!-- 页码 -->
        <button
v-else type="button"
          class="pagination__page-btn"
          :class="{ 'pagination__page-btn--active': page === currentPage }"
          :aria-label="`第 ${page} 页`"
          :aria-current="page === currentPage ? 'page' : undefined"
          @click="handlePageClick(page as number)">
          {{ page }}
        </button>
      </template>
    </div>

    <!-- 下一页按钮 -->
    <button
type="button"
      class="pagination__btn"
      :disabled="currentPage === totalPages"
      aria-label="下一页"
      @click="handleNextPage">
      <ChevronRight :size="18" />
    </button>

    <!-- 页码信息 -->
    <div class="pagination__info">
      第 {{ currentPage }} / {{ totalPages }} 页
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { computed } from 'vue'

interface Props {
  currentPage: number
  totalPages: number
  maxVisible?: number
}

interface Emits {
  (e: 'page-change', page: number): void
}

const props = withDefaults(defineProps<Props>(), {
  maxVisible: 7
})

const emit = defineEmits<Emits>()

// 计算可见的页码
const visiblePages = computed<(number | '...')[]>(() => {
  const pages: (number | '...')[] = []
  const { currentPage, totalPages, maxVisible } = props

  if (totalPages <= maxVisible) {
    // 总页数小于最大可见数，显示所有页码
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // 总页数大于最大可见数，需要省略号
    const halfVisible = Math.floor(maxVisible / 2)

    if (currentPage <= halfVisible) {
      // 当前页在前半部分
      for (let i = 1; i <= maxVisible - 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(totalPages)
    } else if (currentPage >= totalPages - halfVisible) {
      // 当前页在后半部分
      pages.push(1)
      pages.push('...')
      for (let i = totalPages - maxVisible + 2; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 当前页在中间
      pages.push(1)
      pages.push('...')
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(totalPages)
    }
  }

  return pages
})

const handlePrevPage = () => {
  if (props.currentPage > 1) {
    emit('page-change', props.currentPage - 1)
  }
}

const handleNextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit('page-change', props.currentPage + 1)
  }
}

const handlePageClick = (page: number) => {
  if (page !== props.currentPage) {
    emit('page-change', page)
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--us-space-2);
}

.pagination__pages {
  display: flex;
  align-items: center;
  gap: var(--us-space-1);
}

.pagination__ellipsis {
  padding: var(--us-space-2) var(--us-space-3);
  color: var(--us-text-tertiary);
  font-size: var(--text-sm);
}

.pagination__btn,
.pagination__page-btn {
  min-width: 40px;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  font-weight: 500;
  background: var(--us-surface);
  color: var(--us-text-secondary);
  border: 1px solid var(--us-border);
  transition:
    transform var(--us-duration-normal) var(--us-easing),
    box-shadow var(--us-duration-normal) var(--us-easing),
    background-color var(--us-duration-fast) var(--us-easing),
    color var(--us-duration-fast) var(--us-easing),
    border-color var(--us-duration-fast) var(--us-easing);
}

.pagination__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination__btn:hover:not(:disabled),
.pagination__page-btn:hover:not(.pagination__page-btn--active) {
  transform: translateY(-1px);
  box-shadow: var(--us-depth-2-hover);
  background: var(--us-surface-hover);
  color: var(--us-text-primary);
  border-color: var(--us-accent-border);
}

.pagination__page-btn--active {
  background: var(--us-accent-subtle);
  color: var(--us-accent);
  border-color: var(--us-accent-border);
  font-weight: 600;
}

.pagination__page-btn--active:hover {
  background: var(--us-accent-border);
  color: var(--us-accent);
  border-color: var(--us-accent);
}

.pagination__btn:active:not(:disabled),
.pagination__page-btn:active {
  transform: scale(0.95);
  box-shadow: var(--us-depth-1);
}

.pagination__btn:focus-visible,
.pagination__page-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--us-accent-border);
}

.pagination__info {
  display: none;
  font-size: var(--text-sm);
  color: var(--us-text-tertiary);
  margin-left: var(--us-space-4);
}

@media (min-width: 768px) {
  .pagination__btn,
  .pagination__page-btn {
    min-width: 44px;
    min-height: 44px;
  }

  .pagination__pages {
    gap: var(--us-space-2);
  }

  .pagination__info {
    display: block;
  }
}
</style>
