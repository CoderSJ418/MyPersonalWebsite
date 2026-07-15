<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { List, ChevronDown } from 'lucide-vue-next'

interface Heading {
  level: number
  text: string
  id: string
}

interface Props {
  headings: Heading[]
}

const props = defineProps<Props>()

const activeHeading = ref<string>('')
const isMobileExpanded = ref(false)

const activeHeadingText = computed(() => {
  const heading = props.headings.find((h) => h.id === activeHeading.value)
  return heading?.text ?? ''
})

const toggleMobile = () => {
  isMobileExpanded.value = !isMobileExpanded.value
}

// 监听滚动，高亮当前章节
const handleScroll = () => {
  const headingElements = props.headings
    .map((h) => document.getElementById(h.id))
    .filter((el): el is HTMLElement => el !== null)

  if (headingElements.length === 0) {
    return
  }

  // 使用"最后滚过阈值点的标题"算法
  // 阈值设为视口顶部偏下 80px（导航栏高度），确保标题可见时才高亮
  const threshold = 100
  let activeId = ''

  for (const el of headingElements) {
    const rect = el.getBoundingClientRect()
    // 如果标题顶部在阈值之上，说明已经滚过了这个标题
    if (rect.top <= threshold) {
      activeId = el.id
    } else {
      // 标题在阈值之下，停止遍历（标题按文档顺序排列）
      break
    }
  }

  // 如果没有标题滚过阈值，高亮第一个
  if (!activeId && headingElements.length > 0) {
    activeId = headingElements[0].id
  }

  if (activeId) {
    activeHeading.value = activeId
  }
}

// 点击目录项，滚动到对应章节
const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const offset = 80 // 顶部导航栏高度
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth'
    })
  }
  // 移动端点击后收起
  isMobileExpanded.value = false
}

// 根据标题级别计算缩进
const getIndent = (level: number) => {
  return (level - 2) * 1.5 // H2 不缩进，H3 缩进 1.5rem，H4 缩进 3rem
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  // 初始化时执行一次
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="table-of-contents" :class="{ 'table-of-contents--mobile-expanded': isMobileExpanded }">
    <!-- 移动端折叠头部 -->
    <button class="table-of-contents__mobile-toggle" aria-label="展开目录" @click="toggleMobile">
      <List :size="18" />
      <span class="table-of-contents__mobile-title">目录</span>
      <span v-if="activeHeadingText && !isMobileExpanded" class="table-of-contents__current-section">
        {{ activeHeadingText }}
      </span>
      <ChevronDown
:size="16" class="table-of-contents__chevron"
        :class="{ 'table-of-contents__chevron--expanded': isMobileExpanded }" />
    </button>

    <!-- 目录内容 -->
    <div class="table-of-contents__body">
      <h3 class="table-of-contents__title">目录</h3>
      <nav class="table-of-contents__nav" aria-label="文章目录">
        <ul class="table-of-contents__list">
          <li
v-for="heading in headings" :key="heading.id" class="table-of-contents__item"
            :class="{ 'table-of-contents__item--active': activeHeading === heading.id }"
            :style="{ paddingLeft: `${getIndent(heading.level)}rem` }">
            <a
:href="`#${heading.id}`" class="table-of-contents__link"
              :class="{ 'table-of-contents__link--active': activeHeading === heading.id }"
              @click.prevent="scrollToHeading(heading.id)">
              {{ heading.text }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.table-of-contents {
  position: sticky;
  top: 6rem;
  width: 100%;
  padding: var(--us-space-5);
  background-color: var(--us-surface-hover);
  border: 1px solid var(--us-border);
  border-left: none;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--us-border) transparent;
}

.table-of-contents::-webkit-scrollbar {
  width: 4px;
}

.table-of-contents::-webkit-scrollbar-track {
  background: transparent;
}

.table-of-contents::-webkit-scrollbar-thumb {
  background-color: var(--us-border);
  border-radius: var(--radius-sm);
}

.table-of-contents::-webkit-scrollbar-thumb:hover {
  background-color: var(--us-text-tertiary);
}

/* 移动端折叠按钮 - 桌面端隐藏 */
.table-of-contents__mobile-toggle {
  display: none;
}

.table-of-contents__title {
  margin: 0 0 var(--us-space-4) 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--us-text-primary);
  padding-bottom: var(--us-space-3);
  border-bottom: 1px solid var(--us-border);
}

.table-of-contents__nav {
  position: relative;
}

.table-of-contents__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.table-of-contents__item {
  margin: var(--us-space-2) 0;
}

.table-of-contents__link {
  display: block;
  padding: var(--us-space-2) var(--us-space-3);
  font-size: 0.875rem;
  color: var(--us-text-secondary);
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: color, background-color, opacity var(--us-duration-normal) var(--us-easing);
}

.table-of-contents__link:hover {
  color: var(--us-text-primary);
  background-color: var(--us-surface);
}

.table-of-contents__link--active {
  color: var(--us-accent);
  background-color: var(--us-accent-subtle);
  font-weight: 500;
}

.table-of-contents__item--active {
  position: relative;
}

.table-of-contents__item--active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background-color: var(--us-accent);
  border-radius: 0 2px 2px 0;
}

/* 响应式 - 移动端折叠目录 */
@media (max-width: 768px) {
  .table-of-contents {
    position: static;
    max-height: none;
    margin-bottom: var(--us-space-8);
    padding: 0;
    border: 1px solid var(--us-border);
    border-left: none;
    border-radius: var(--radius-lg);
    overflow: hidden;
    scrollbar-width: none;
  }

  .table-of-contents::-webkit-scrollbar {
    display: none;
  }

  /* 显示折叠按钮 */
  .table-of-contents__mobile-toggle {
    display: flex;
    align-items: center;
    gap: var(--us-space-2);
    width: 100%;
    padding: var(--us-space-4) var(--us-space-4);
    background: none;
    border: none;
    color: var(--us-text-primary);
    font-size: 0.9375rem;
    font-weight: 600;
    text-align: left;
  }

  .table-of-contents__mobile-title {
    flex-shrink: 0;
  }

  .table-of-contents__current-section {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--us-text-secondary);
    font-weight: 400;
    font-size: 0.8125rem;
  }

  .table-of-contents__chevron {
    flex-shrink: 0;
    margin-left: auto;
    transition: transform var(--us-duration-normal) var(--us-easing);
  }

  .table-of-contents__chevron--expanded {
    transform: rotate(180deg);
  }

  /* 目录内容默认收起 */
  .table-of-contents__body {
    max-height: 0;
    overflow: hidden;
    transition: max-height var(--us-duration-normal) var(--us-easing);
  }

  /* 展开状态 */
  .table-of-contents--mobile-expanded .table-of-contents__body {
    max-height: 60vh;
    overflow-y: auto;
  }

  .table-of-contents--mobile-expanded {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  .table-of-contents__title {
    display: none;
  }

  .table-of-contents__nav {
    padding: 0 1rem 1rem;
  }

  .table-of-contents__link {
    font-size: 0.8125rem;
    padding: var(--us-space-2) var(--us-space-2);
  }
}
</style>