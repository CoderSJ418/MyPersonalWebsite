<script setup lang="ts">
import { computed } from 'vue'
import { useProjectStore } from '@/stores/useProjectStore'

const projectStore = useProjectStore()

const categories = computed(() => projectStore.categories)
const allTechStacks = computed(() => projectStore.allTechStacks)
const selectedCategory = computed(() => projectStore.selectedCategory)
const selectedTechStacks = computed(() => projectStore.selectedTechStacks)

const handleCategoryClick = (category: string | null) => {
  projectStore.filterByCategory(category)
}

const handleTechStackToggle = (techStack: string) => {
  const currentIndex = selectedTechStacks.value.indexOf(techStack)
  if (currentIndex === -1) {
    // 添加技术栈
    projectStore.filterByTechStack([...selectedTechStacks.value, techStack])
  } else {
    // 移除技术栈
    projectStore.filterByTechStack(
      selectedTechStacks.value.filter((_, index) => index !== currentIndex)
    )
  }
}

const clearFilters = () => {
  projectStore.filterByCategory(null)
  projectStore.filterByTechStack([])
}
</script>

<template>
  <div class="tech-stack-filter">
    <div class="tech-stack-filter__section">
      <h3 class="tech-stack-filter__title">分类</h3>
      <div class="tech-stack-filter__categories">
        <button
class="tech-stack-filter__category-btn"
          :class="{ 'tech-stack-filter__category-btn--active': selectedCategory === null }"
          @click="handleCategoryClick(null)">
          全部
        </button>
        <button
v-for="category in categories" :key="category" class="tech-stack-filter__category-btn"
          :class="{ 'tech-stack-filter__category-btn--active': selectedCategory === category }"
          @click="handleCategoryClick(category)">
          {{ category }}
        </button>
      </div>
    </div>

    <div class="tech-stack-filter__section">
      <h3 class="tech-stack-filter__title">技术栈</h3>
      <div class="tech-stack-filter__tech-stacks">
        <button
v-for="techStack in allTechStacks" :key="techStack" class="tech-stack-filter__tech-btn"
          :class="{ 'tech-stack-filter__tech-btn--active': selectedTechStacks.includes(techStack) }"
          @click="handleTechStackToggle(techStack)">
          {{ techStack }}
        </button>
      </div>
    </div>

    <button
v-if="selectedCategory || selectedTechStacks.length > 0" class="tech-stack-filter__clear"
      @click="clearFilters">
      清除筛选
    </button>
  </div>
</template>

<style scoped>
.tech-stack-filter {
  display: flex;
  flex-direction: column;
  gap: var(--us-space-6);
}

@media (min-width: 768px) {
  .tech-stack-filter {
    gap: var(--us-space-8);
  }
}

.tech-stack-filter__section {
  width: 100%;
}

.tech-stack-filter__title {
  margin: 0 0 var(--us-space-4) 0;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--us-text-primary);
}

@media (min-width: 768px) {
  .tech-stack-filter__title {
    font-size: 1rem;
  }
}

.tech-stack-filter__categories,
.tech-stack-filter__tech-stacks {
  display: flex;
  flex-wrap: wrap;
  gap: var(--us-space-2);
}

.tech-stack-filter__category-btn,
.tech-stack-filter__tech-btn {
  padding: var(--us-space-2) var(--us-space-4);
  background-color: var(--us-surface);
  color: var(--us-text-secondary);
  font-size: 0.8125rem;
  font-weight: 500;
  border: 1px solid var(--us-border);
  border-radius: var(--radius-md);
  transition: color, background-color, border-color, opacity var(--us-duration-fast) var(--us-easing);
}

@media (min-width: 768px) {

  .tech-stack-filter__category-btn,
  .tech-stack-filter__tech-btn {
    padding: var(--us-space-2) var(--us-space-4);
    font-size: 0.875rem;
  }
}

.tech-stack-filter__tech-btn:hover {
  background-color: var(--us-surface-hover);
  color: var(--us-text-primary);
  border-color: var(--us-accent);
}

.tech-stack-filter__category-btn--active,
.tech-stack-filter__tech-btn--active {
  background-color: var(--us-accent-subtle);
  color: var(--us-accent);
  border-color: var(--us-accent-border);
}

.tech-stack-filter__category-btn--active:hover,
.tech-stack-filter__tech-btn--active:hover {
  background-color: var(--us-accent-border);
  color: var(--us-accent);
  border-color: var(--us-accent);
}

.tech-stack-filter__clear {
  padding: var(--us-space-2) var(--us-space-4);
  background-color: transparent;
  color: var(--us-text-secondary);
  font-size: 0.8125rem;
  font-weight: 500;
  border: 1px solid var(--us-border);
  border-radius: var(--radius-md);
  transition: color, background-color, border-color, opacity var(--us-duration-fast) var(--us-easing);
}

@media (min-width: 768px) {
  .tech-stack-filter__clear {
    padding: var(--us-space-2) var(--us-space-4);
    font-size: 0.875rem;
  }
}

.tech-stack-filter__clear:hover {
  background-color: var(--us-surface);
  color: var(--us-text-primary);
  border-color: var(--us-accent);
}
</style>
