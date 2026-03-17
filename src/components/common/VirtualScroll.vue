<template>
  <div ref="containerRef" class="virtual-scroll-container">
    <div class="virtual-scroll-spacer" :style="{ height: totalHeight + 'px' }" />
    <div class="virtual-scroll-content" :style="{ transform: `translateY(${scrollTop}px)` }">
      <div
        v-for="item in visibleItems"
        :key="item.key"
        :style="{ height: itemHeight + 'px' }"
        class="virtual-scroll-item"
      >
        <slot :item="item.data" :index="item.index" :is-visible="item.isVisible" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

interface VirtualScrollItem<T = unknown> {
  key: string | number
  data: T
  index: number
  height: number
  isVisible: boolean
}

interface Props {
  items: VirtualScrollItem[]
  itemHeight: number
  bufferSize?: number
  overscan?: number
  containerHeight?: number
  onScroll?: (scrollTop: number) => void
  onVisibleChange?: (visibleItems: VirtualScrollItem[]) => void
}

const props = withDefaults(defineProps<Props>(), {
  bufferSize: 5,
  overscan: 10,
  containerHeight: 0,
  onScroll: () => {},
  onVisibleChange: () => {}
})

const emit = defineEmits<{
  scroll: [scrollTop: number]
  visibleChange: [visibleItems: VirtualScrollItem[]]
}>()

const containerRef = ref<HTMLElement>()
const scrollTop = ref(0)
const totalHeight = computed(() => props.items.length * props.itemHeight)

// 计算可见项目
const visibleItems = computed(() => {
  const containerHeight = props.containerHeight || containerRef.value?.clientHeight || window.innerHeight
  const start = Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.bufferSize)
  const end = Math.min(
    props.items.length - 1,
    Math.floor((scrollTop.value + containerHeight) / props.itemHeight) + props.bufferSize
  )

  return props.items.slice(start, end + 1).map((item) => ({
    ...item,
    isVisible: item.index >= start && item.index <= end
  }))
})

// 处理滚动
const handleScroll = () => {
  if (!containerRef.value) return

  scrollTop.value = containerRef.value.scrollTop
  emit('scroll', scrollTop.value)
  emit('visibleChange', visibleItems.value)
  
  // 通知父组件滚动
  props.onScroll(scrollTop.value)
  props.onVisibleChange(visibleItems.value)
}

// 滚动到指定位置
const scrollTo = (index: number, smooth = false) => {
  if (!containerRef.value) return

  const targetScrollTop = index * props.itemHeight
  if (smooth) {
    containerRef.value.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    })
  } else {
    containerRef.value.scrollTop = targetScrollTop
  }
}

// 滚动到顶部
const scrollToTop = (smooth = false) => {
  scrollTo(0, smooth)
}

// 滚动到底部
const scrollToBottom = (smooth = false) => {
  if (!containerRef.value) return

  const maxScrollTop = totalHeight.value - containerRef.value.clientHeight
  if (smooth) {
    containerRef.value.scrollTo({
      top: maxScrollTop,
      behavior: 'smooth'
    })
  } else {
    containerRef.value.scrollTop = maxScrollTop
  }
}

// 滚动到项目
const scrollToItem = (item: VirtualScrollItem, smooth = false) => {
  scrollTo(item.index, smooth)
}

// 重置滚动位置
const resetScroll = () => {
  if (containerRef.value) {
    containerRef.value.scrollTop = 0
  }
}

// 更新容器高度
const updateContainerHeight = () => {
  if (containerRef.value) {
    // 强制重新计算
    containerRef.value.style.height = props.containerHeight ? `${props.containerHeight}px` : 'auto'
  }
}

// 监听项目变化
watch(
  () => props.items,
  () => {
    nextTick(() => {
      updateContainerHeight()
    })
  },
  { deep: true }
)

// 监听容器高度变化
watch(
  () => props.containerHeight,
  () => {
    updateContainerHeight()
  }
)

// 监听滚动位置变化
watch(
  scrollTop,
  () => {
    handleScroll()
  }
)

// 组件挂载
onMounted(() => {
  if (containerRef.value) {
    containerRef.value.addEventListener('scroll', handleScroll, { passive: true })
    updateContainerHeight()
  }
})

// 组件卸载
onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('scroll', handleScroll)
  }
})

// 暴露方法给父组件
defineExpose({
  scrollTo,
  scrollToTop,
  scrollToBottom,
  scrollToItem,
  resetScroll,
  updateContainerHeight,
  getVisibleItems: () => visibleItems.value,
  getScrollTop: () => scrollTop.value,
  getTotalHeight: () => totalHeight.value
})
</script>

<style scoped>
.virtual-scroll-container {
  position: relative;
  overflow: auto;
  will-change: scroll-position;
  contain: layout style paint;
}

.virtual-scroll-container::-webkit-scrollbar {
  width: 8px;
}

.virtual-scroll-container::-webkit-scrollbar-track {
  background: transparent;
}

.virtual-scroll-container::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.3);
  border-radius: 4px;
}

.virtual-scroll-container::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.5);
}

.virtual-scroll-spacer {
  position: relative;
  contain: strict;
}

.virtual-scroll-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  will-change: transform;
  contain: layout style paint;
}

.virtual-scroll-item {
  position: relative;
  contain: layout style paint;
  overflow: hidden;
}
</style>