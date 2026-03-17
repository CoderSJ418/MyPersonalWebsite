<template>
  <div class="pixel-tabs">
    <!-- 标签栏 -->
    <div class="pixel-tabs__nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="[
          'pixel-tabs__tab',
          { 'pixel-tabs__tab--active': activeTab === tab.id }
        ]"
        @click="handleTabChange(tab.id)"
      >
        <slot name="tab" :tab="tab" :active="activeTab === tab.id">
          {{ tab.label }}
        </slot>
      </button>
    </div>

    <!-- 内容区域 -->
    <div class="pixel-tabs__content">
      <slot :active-tab="activeTab">
        <div v-if="activeTab" class="pixel-tabs__panel">
          <slot :name="`panel-${activeTab}`">
            {{ findTab(activeTab)?.content }}
          </slot>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Tab {
  id: string
  label: string
  content?: string
}

interface Props {
  tabs: Tab[]
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const activeTab = computed({
  get: () => props.modelValue || props.tabs[0]?.id || '',
  set: (value) => {
    emit('update:modelValue', value)
  }
})

const findTab = (id: string) => props.tabs.find(tab => tab.id === id)

const handleTabChange = (tabId: string) => {
  activeTab.value = tabId
}
</script>

<style scoped>
.pixel-tabs {
  @apply w-full;
}

.pixel-tabs__nav {
  @apply flex gap-2 border-b-2 border-pixel-cyan mb-4;
}

.pixel-tabs__tab {
  @apply px-4 py-2 text-pixel-light bg-transparent border-b-2 border-transparent cursor-pointer transition-all duration-200;
  font-family: 'Press Start 2P', cursive;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  &:hover {
    @apply border-pixel-cyan text-pixel-cyan;
  }
  
  &.pixel-tabs__tab--active {
    @apply border-pixel-cyan text-pixel-cyan;
  }
}

.pixel-tabs__content {
  @apply min-h-32;
}

.pixel-tabs__panel {
  @apply animate-pixel-fade-in;
}

/* 像素淡入动画 */
@keyframes pixel-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-pixel-fade-in {
  animation: pixel-fade-in 0.3s ease-out;
}
</style>