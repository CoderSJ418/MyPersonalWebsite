<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

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

// 监听滚动，高亮当前章节
const handleScroll = () => {
  const headingElements = props.headings
    .map((h) => document.getElementById(h.id))
    .filter((el): el is HTMLElement => el !== null)

  if (headingElements.length === 0) {
    return
  }

  // 找到当前视口中的标题
  const viewportMiddle = window.innerHeight / 2
  let closestHeading: string | null = null
  let closestDistance = Infinity

  headingElements.forEach((el) => {
    const rect = el.getBoundingClientRect()
    const distance = Math.abs(rect.top - viewportMiddle)

    if (distance < closestDistance && rect.top > 0) {
      closestDistance = distance
      closestHeading = el.id
    }
  })

  // 如果没有找到，使用第一个可见的标题
  if (!closestHeading) {
    const firstVisible = headingElements.find((el) => el.getBoundingClientRect().top > 0)
    if (firstVisible) {
      closestHeading = firstVisible.id
    }
  }

  if (closestHeading) {
    activeHeading.value = closestHeading
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
  <div class="table-of-contents">
    <h3 class="table-of-contents__title">目录</h3>
    <nav class="table-of-contents__nav" aria-label="文章目录">
      <ul class="table-of-contents__list">
        <li
          v-for="heading in headings"
          :key="heading.id"
          class="table-of-contents__item"
          :class="{ 'table-of-contents__item--active': activeHeading === heading.id }"
          :style="{ paddingLeft: `${getIndent(heading.level)}rem` }"
        >
          <a
            :href="`#${heading.id}`"
            class="table-of-contents__link"
            :class="{ 'table-of-contents__link--active': activeHeading === heading.id }"
            @click.prevent="scrollToHeading(heading.id)"
          >
            {{ heading.text }}
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.table-of-contents {
  position: sticky;
  top: 6rem;
  width: 280px;
  min-width: 280px;
  padding: 1.5rem;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-left: 3px solid var(--accent-color);
  border-radius: 8px;
  max-height: calc(100vh - 8rem);
  overflow-y: auto;
}

.table-of-contents__title {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
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
  margin: 0.5rem 0;
}

.table-of-contents__link {
  display: block;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 4px;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1.5;
}

.table-of-contents__link:hover {
  color: var(--text-color);
  background-color: var(--background-color);
}

.table-of-contents__link--active {
  color: var(--accent-color);
  background-color: rgba(74, 144, 226, 0.1);
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
  background-color: var(--accent-color);
  border-radius: 0 2px 2px 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .table-of-contents {
    position: static;
    max-height: none;
    margin-bottom: 2rem;
  }
}

@media (max-width: 768px) {
  .table-of-contents {
    padding: 1rem;
  }

  .table-of-contents__title {
    font-size: 1rem;
  }

  .table-of-contents__link {
    font-size: 0.8125rem;
    padding: 0.375rem 0.5rem;
  }
}
</style>