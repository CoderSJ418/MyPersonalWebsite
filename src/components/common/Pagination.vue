<template>
  <nav class="pagination flex items-center justify-center gap-2 md:gap-4" aria-label="分页导航">
    <!-- 上一页按钮 -->
    <button
      type="button"
      class="pagination__btn px-3 py-2 rounded-lg bg-bg-surface text-text-primary hover:bg-theme-primary hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-bg-surface disabled:hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-theme-primary"
      :disabled="currentPage === 1"
      aria-label="上一页"
      @click="handlePrevPage"
    >
      <ChevronLeft :size="20" />
    </button>

    <!-- 页码按钮 -->
    <div class="flex items-center gap-1 md:gap-2">
      <template v-for="page in visiblePages" :key="page">
        <!-- 省略号 -->
        <span v-if="page === '...'" class="px-3 py-2 text-text-tertiary" aria-hidden="true">
          ...
        </span>
        <!-- 页码 -->
        <button
          v-else
          type="button"
          class="pagination__page-btn w-10 h-10 md:w-12 md:h-12 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-theme-primary"
          :class="[
            page === currentPage
              ? 'bg-theme-primary text-white'
              : 'bg-bg-surface text-text-primary hover:bg-bg-hover'
          ]"
          :aria-label="`第 ${page} 页`"
          :aria-current="page === currentPage ? 'page' : undefined"
          @click="handlePageClick(page as number)"
        >
          {{ page }}
        </button>
      </template>
    </div>

    <!-- 下一页按钮 -->
    <button
      type="button"
      class="pagination__btn px-3 py-2 rounded-lg bg-bg-surface text-text-primary hover:bg-theme-primary hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-bg-surface disabled:hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-theme-primary"
      :disabled="currentPage === totalPages"
      aria-label="下一页"
      @click="handleNextPage"
    >
      <ChevronRight :size="20" />
    </button>

    <!-- 页码信息 -->
    <div class="hidden md:block text-sm text-text-tertiary ml-4">
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
.pagination__btn,
.pagination__page-btn {
  min-width: 40px;
  min-height: 40px;
}

@media (min-width: 768px) {
  .pagination__btn,
  .pagination__page-btn {
    min-width: 48px;
    min-height: 48px;
  }
}

.pagination__btn:focus,
.pagination__page-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
}

.pagination__page-btn:active {
  transform: scale(0.95);
}
</style>
