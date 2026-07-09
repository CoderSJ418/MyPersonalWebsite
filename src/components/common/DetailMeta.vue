<script setup lang="ts">
/**
 * DetailMeta — 详情页通用元数据行组件
 *
 * 职责：
 * - icon + label + value 模式渲染元数据
 * - 适配日期/阅读时间/分类/年份/作者等
 * - 支持居中/左对齐布局
 * - BEM `dm` 前缀，新CSS变量体系，深色模式
 *
 * 设计灵感：
 * - Stripe: 元数据用text-tertiary + icon微弱色
 * - Apple: 元数据间距韵律 gap: 1.25rem
 */

import { Calendar, Clock, User, Tag, Layers, Hash } from 'lucide-vue-next'
import { type Component } from 'vue'

export interface MetaItem {
  /** 图标类型，预设映射 */
  icon?: 'calendar' | 'clock' | 'user' | 'tag' | 'layers' | 'hash'
  /** 显示文本（直接展示，无需label:value格式） */
  value: string
  /** 可选的datetime属性（用于<time>标签） */
  datetime?: string
}

interface Props {
  /** 元数据项列表 */
  items: MetaItem[]
  /** 对齐方式 */
  align?: 'center' | 'left'
}

withDefaults(defineProps<Props>(), {
  align: 'center'
})

/** 图标映射表 */
const iconMap: Record<string, Component> = {
  calendar: Calendar,
  clock: Clock,
  user: User,
  tag: Tag,
  layers: Layers,
  hash: Hash
}

/** 获取图标组件 */
const getIcon = (iconType?: string): Component | null => {
  if (!iconType) return null
  return iconMap[iconType] || null
}
</script>

<template>
  <div class="dm" :class="`dm--${align}`">
    <div v-for="(item, index) in items" :key="index" class="dm__item">
      <component :is="getIcon(item.icon)" v-if="getIcon(item.icon)" :size="15" class="dm__icon" />
      <time v-if="item.datetime" :datetime="item.datetime" class="dm__value">
        {{ item.value }}
      </time>
      <span v-else class="dm__value">{{ item.value }}</span>
    </div>
  </div>
</template>

<style scoped>
/* ===== 元数据行 ===== */
.dm {
  display: flex;
  align-items: center;
  gap: var(--us-space-5);
  flex-wrap: wrap;
  font-size: 0.875rem;
  color: var(--us-text-tertiary);
}

.dm--center {
  justify-content: center;
}

.dm--left {
  justify-content: flex-start;
}

/* ===== 单个元数据项 ===== */
.dm__item {
  display: inline-flex;
  align-items: center;
  gap: var(--us-space-2);
}

.dm__icon {
  flex-shrink: 0;
  opacity: 0.7;
}

.dm__value {
  line-height: var(--leading-none);
}

/* ===== 响应式 ===== */
@media (max-width: 640px) {
  .dm--center {
    flex-direction: column;
    gap: var(--us-space-3);
  }
}
</style>