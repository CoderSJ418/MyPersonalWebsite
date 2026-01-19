<template>
  <Teleport to="head">
    <!-- 基础 Meta 标签 -->
    <meta v-if="config.title" :content="fullTitle" property="og:title" />
    <meta v-if="config.description" :content="config.description" name="description" />
    <meta v-if="config.description" :content="config.description" property="og:description" />
    <meta v-if="config.keywords" :content="config.keywords" name="keywords" />
    <meta v-if="config.url" :content="config.url" property="og:url" />
    <meta v-if="config.url" :href="config.url" rel="canonical" />

    <!-- Open Graph 标签 -->
    <meta :content="config.type || 'website'" property="og:type" />
    <meta :content="siteName" property="og:site_name" />
    <meta v-if="config.image" :content="config.image" property="og:image" />
    <meta v-if="config.image" :content="config.title" property="og:image:alt" />
    <meta v-if="config.locale" :content="config.locale" property="og:locale" />

    <!-- Twitter Card 标签 -->
    <meta content="summary_large_image" name="twitter:card" />
    <meta v-if="config.title" :content="fullTitle" name="twitter:title" />
    <meta v-if="config.description" :content="config.description" name="twitter:description" />
    <meta v-if="config.image" :content="config.image" name="twitter:image" />
    <meta v-if="config.author" :content="config.author" name="twitter:creator" />

    <!-- 额外的 SEO 标签 -->
    <meta v-if="config.author" :content="config.author" name="author" />
    <meta v-if="config.publishDate" :content="config.publishDate" property="article:published_time" />
    <meta v-if="config.modifiedDate" :content="config.modifiedDate" property="article:modified_time" />
    <meta v-if="config.category" :content="config.category" property="article:section" />
    <meta v-for="tag in config.tags" :key="tag" :content="tag" property="article:tag" />

    <!-- 结构化数据 -->
    <script v-if="structuredData" type="application/ld+json">{{ structuredData }}</script>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { SEOConfig } from '@/utils/seo'

interface Props {
  title: string
  description: string
  keywords?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  author?: string
  publishDate?: string
  modifiedDate?: string
  category?: string
  tags?: string[]
  locale?: string
  structuredData?: Record<string, any>
  siteName?: string
  titleSuffix?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'website',
  author: '佘杰',
  siteName: '佘杰 - 前端开发工程师',
  titleSuffix: ' - 佘杰',
  locale: 'zh_CN',
  tags: () => []
})

const route = useRoute()

// 计算完整标题
const fullTitle = computed(() => {
  return `${props.title}${props.titleSuffix}`
})

// 计算当前 URL
const currentUrl = computed(() => {
  if (props.url) return props.url
  return `${window.location.origin}${route.fullPath}`
})

// 更新页面标题
const updatePageTitle = () => {
  document.title = fullTitle.value
}

// 监听标题变化
watch(() => props.title, updatePageTitle, { immediate: true })

// 组件挂载时更新
onMounted(() => {
  updatePageTitle()
})

// 导出配置供外部使用
const config = computed<SEOConfig>(() => ({
  title: props.title,
  description: props.description,
  keywords: props.keywords,
  image: props.image,
  url: currentUrl.value,
  type: props.type,
  author: props.author,
  publishDate: props.publishDate,
  modifiedDate: props.modifiedDate,
  category: props.category,
  tags: props.tags,
  locale: props.locale
}))

// 暴露配置给父组件
defineExpose({
  config
})
</script>