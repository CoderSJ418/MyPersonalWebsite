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
          @click="handleCategoryClick(null)"
        >
          全部
        </button>
        <button
          v-for="category in categories"
          :key="category"
          class="tech-stack-filter__category-btn"
          :class="{ 'tech-stack-filter__category-btn--active': selectedCategory === category }"
          @click="handleCategoryClick(category)"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <div class="tech-stack-filter__section">
      <h3 class="tech-stack-filter__title">技术栈</h3>
      <div class="tech-stack-filter__tech-stacks">
        <button
          v-for="techStack in allTechStacks"
          :key="techStack"
          class="tech-stack-filter__tech-btn"
          :class="{ 'tech-stack-filter__tech-btn--active': selectedTechStacks.includes(techStack) }"
          @click="handleTechStackToggle(techStack)"
        >
          {{ techStack }}
        </button>
      </div>
    </div>

    <button
      v-if="selectedCategory || selectedTechStacks.length > 0"
      class="tech-stack-filter__clear"
      @click="clearFilters"
    >
      清除筛选
    </button>
  </div>
</template>

<style scoped>
.tech-stack-filter {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.tech-stack-filter__section {
  width: 100%;
}

.tech-stack-filter__title {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.tech-stack-filter__categories,
.tech-stack-filter__tech-stacks {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-stack-filter__category-btn,
.tech-stack-filter__tech-btn {
  padding: 0.5rem 1rem;
  background-color: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tech-stack-filter__category-btn:hover,
.tech-stack-filter__tech-btn:hover {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
  border-color: var(--color-primary);
}

.tech-stack-filter__category-btn--active,
.tech-stack-filter__tech-btn--active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.tech-stack-filter__category-btn--active:hover,
.tech-stack-filter__tech-btn--active:hover {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.tech-stack-filter__clear {
  padding: 0.5rem 1rem;
  background-color: transparent;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: flex-start;
}

.tech-stack-filter__clear:hover {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border-color: var(--color-primary);
}

/* 响应式 */
@media (max-width: 768px) {
  .tech-stack-filter {
    gap: 1.5rem;
  }

  .tech-stack-filter__title {
    font-size: 0.9375rem;
  }

  .tech-stack-filter__category-btn,
  .tech-stack-filter__tech-btn {
    font-size: 0.8125rem;
    padding: 0.4375rem 0.875rem;
  }

  .tech-stack-filter__clear {
    font-size: 0.8125rem;
    padding: 0.4375rem 0.875rem;
  }
}
</style>
