<script setup lang="ts">
import type { LabEffect } from '@/config/labRegistry'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
  effect: LabEffect
}>()

const goToEffect = () => {
  router.push(`/lab/${props.effect.id}`)
}

const categoryLabels: Record<string, string> = {
  background: '背景',
  card: '卡片',
  button: '按钮',
  text: '文字',
  animation: '动画',
  layout: '布局',
  data: '数据',
}

// 从效果 tag 提取主色作为缩略图背景
const accentColor = '#2563EB'
</script>

<template>
  <div
    class="lab-effect-card"
    tabindex="0"
    role="link"
    @click="goToEffect"
    @keydown.enter="goToEffect"
    @keydown.space.prevent="goToEffect"
  >
    <div class="lab-effect-card-preview" :style="{ background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}30)` }">
      <span class="lab-effect-card-icon">&#x2B1B;</span>
    </div>
    <div class="lab-effect-card-body">
      <h3 class="lab-effect-card-title">{{ effect.name }}</h3>
      <p class="lab-effect-card-desc">{{ effect.description }}</p>
      <div class="lab-effect-card-tags">
        <span class="lab-effect-card-category">{{ categoryLabels[effect.category] }}</span>
        <span v-for="tag in effect.tags.slice(0, 3)" :key="tag" class="lab-effect-card-tag">{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lab-effect-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.lab-effect-card:hover {
  border-color: #2563EB;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
}
.lab-effect-card-preview {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lab-effect-card-icon {
  font-size: 32px;
  opacity: 0.3;
}
.lab-effect-card-body {
  padding: 16px;
}
.lab-effect-card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px;
}
.lab-effect-card-desc {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 12px;
  line-height: 1.5;
}
.lab-effect-card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.lab-effect-card-category {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: #2563EB;
  color: white;
  font-weight: 500;
}
.lab-effect-card-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: #f1f5f9;
  color: #64748b;
}
</style>
