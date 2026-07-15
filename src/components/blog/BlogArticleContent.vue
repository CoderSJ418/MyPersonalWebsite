<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { ChevronDown, ChevronUp } from 'lucide-vue-next'
import {
  extractHeadings,
  renderMarkdown,
  renderMarkdownSync,
  splitExpandableMarkdown
} from '@/utils/markdown'
import BlogMarkdown from './BlogMarkdown.vue'

interface Props {
  content?: string
  readTime?: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  contentClick: [event: MouseEvent]
  headingsChange: [headings: ReturnType<typeof extractHeadings>]
}>()

const renderedContent = ref('')
const isLoading = ref(true)
const isExpanded = ref(false)
let renderVersion = 0

const segments = computed(() => splitExpandableMarkdown(props.content ?? ''))

const renderVisibleContent = async () => {
  const version = ++renderVersion
  const visibleContent = isExpanded.value ? segments.value.full : segments.value.preview

  if (!visibleContent) {
    renderedContent.value = ''
    isLoading.value = true
    emit('headingsChange', [])
    return
  }

  isLoading.value = true
  try {
    const rendered = await renderMarkdown(visibleContent)
    if (version !== renderVersion) return
    renderedContent.value = rendered
  } catch {
    if (version !== renderVersion) return
    renderedContent.value = renderMarkdownSync(visibleContent)
  } finally {
    if (version === renderVersion) {
      isLoading.value = false
      emit('headingsChange', extractHeadings(visibleContent))
    }
  }
}

watch(
  () => props.content,
  () => {
    if (isExpanded.value) {
      isExpanded.value = false
    } else {
      void renderVisibleContent()
    }
  },
  { immediate: true }
)

watch(isExpanded, () => void renderVisibleContent())

const toggleExpanded = async (event: MouseEvent) => {
  const button = event.currentTarget instanceof HTMLElement ? event.currentTarget : null
  const previousTop = button?.getBoundingClientRect().top ?? 0
  const wasExpanded = isExpanded.value
  isExpanded.value = !isExpanded.value

  if (wasExpanded && button) {
    await nextTick()
    window.scrollBy({ top: button.getBoundingClientRect().top - previousTop })
  }
}
</script>

<template>
  <div class="min-w-0 max-w-[var(--measure-normal)] order-1">
    <BlogMarkdown
      :content="renderedContent"
      :is-loading="isLoading"
      @content-click="emit('contentClick', $event)"
    />

    <div
      v-if="segments.isExpandable && !isLoading"
      class="mt-10 border-t border-[var(--us-border)] pt-6"
    >
      <button
        type="button"
        class="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[var(--us-border)] bg-[var(--us-surface)] px-5 py-3 text-sm font-semibold text-[var(--us-accent)] transition hover:border-[var(--us-accent-border)] hover:bg-[var(--us-accent-subtle)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--us-accent)]"
        :aria-expanded="isExpanded"
        @click="toggleExpanded"
      >
        <ChevronUp v-if="isExpanded" :size="18" />
        <ChevronDown v-else :size="18" />
        {{
          isExpanded ? '收起到文章摘要' : `展开完整文章${readTime ? `（约 ${readTime} 分钟）` : ''}`
        }}
      </button>
      <p v-if="!isExpanded" class="mt-3 text-center text-xs text-[var(--us-text-tertiary)]">
        完整正文将在展开后解析，减少首次渲染负担。
      </p>
    </div>
  </div>
</template>
