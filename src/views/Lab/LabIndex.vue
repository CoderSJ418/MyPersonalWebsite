<script setup lang="ts">
import { ref, computed } from 'vue'
import { labRegistry } from '@/config/labRegistry'
import SEOHead from '@/components/common/SEOHead.vue'
import LabEffectCard from '@/components/lab/LabEffectCard.vue'

const searchQuery = ref('')
const selectedCategory = ref<string | null>(null)

const categories = ['background', 'card', 'button', 'text', 'animation', 'layout', 'data']

const categoryLabels: Record<string, string> = {
  background: '背景',
  card: '卡片',
  button: '按钮',
  text: '文字',
  animation: '动画',
  layout: '布局',
  data: '数据',
}

const filteredEffects = computed(() => {
  return labRegistry.filter(effect => {
    const matchesSearch = !searchQuery.value ||
      effect.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      effect.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      effect.tags.some(t => t.toLowerCase().includes(searchQuery.value.toLowerCase()))

    const matchesCategory = !selectedCategory.value || effect.category === selectedCategory.value

    return matchesSearch && matchesCategory
  })
})

const clearSearch = () => {
  searchQuery.value = ''
  selectedCategory.value = null
}
</script>

<template>
  <SEOHead title="效果实验室" description="交互式前端效果演示 — Aurora、Spotlight、Marquee 等 20+ 效果" type="webpage" />
  <div class="lab-index">
    <div class="lab-index-header">
      <h1 class="lab-index-title">效果实验室</h1>
      <p class="lab-index-subtitle">交互式前端效果演示 — 点击卡片实时体验，调节参数理解原理</p>
      <div class="lab-index-search">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索效果..."
          class="lab-search-input"
        />
        <button v-if="searchQuery" class="lab-search-clear" type="button" @click="clearSearch">
          ✕
        </button>
      </div>
      <div class="lab-index-categories">
        <button
          v-for="cat in categories"
          :key="cat"
          class="lab-category-btn"
          :class="{ active: selectedCategory === cat }"
          @click="selectedCategory = selectedCategory === cat ? null : cat"
        >
          {{ categoryLabels[cat] }}
        </button>
      </div>
    </div>

    <div v-if="filteredEffects.length" class="lab-index-grid">
      <LabEffectCard v-for="effect in filteredEffects" :key="effect.id" :effect="effect" />
    </div>

    <div v-else class="lab-index-empty">
      <p>没有找到匹配的效果</p>
      <button class="lab-empty-clear" type="button" @click="clearSearch">清空搜索</button>
    </div>
  </div>
</template>

<style scoped>
.lab-index {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px;
}
.lab-index-header {
  margin-bottom: 32px;
}
.lab-index-title {
  font-size: 30px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px;
}
.lab-index-subtitle {
  font-size: 16px;
  color: #64748b;
  margin: 0 0 24px;
}
.lab-index-search {
  position: relative;
  margin-bottom: 16px;
}
.lab-search-input {
  width: 100%;
  max-width: 400px;
  padding: 10px 36px 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  box-sizing: border-box;
}
.lab-search-input:focus {
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
.lab-search-clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
}
.lab-index-categories {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.lab-category-btn {
  padding: 6px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  color: #64748b;
  background: white;
  cursor: pointer;
  transition: all 0.15s;
}
.lab-category-btn:hover {
  border-color: #2563EB;
  color: #2563EB;
}
.lab-category-btn.active {
  background: #2563EB;
  color: white;
  border-color: #2563EB;
}
.lab-index-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
.lab-index-empty {
  text-align: center;
  padding: 60px 24px;
  color: #94a3b8;
}
.lab-index-empty p {
  font-size: 16px;
  margin: 0 0 16px;
}
.lab-empty-clear {
  padding: 8px 20px;
  border: 1px solid #2563EB;
  border-radius: 6px;
  color: #2563EB;
  background: white;
  cursor: pointer;
  font-size: 14px;
}
.lab-empty-clear:hover {
  background: #eff6ff;
}
</style>
