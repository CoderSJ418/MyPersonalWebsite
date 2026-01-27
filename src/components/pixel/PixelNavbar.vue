<template>
  <nav class="pixel-navbar">
    <!-- 桌面导航 -->
    <div class="pixel-navbar__desktop">
      <div class="pixel-navbar__brand">
        <slot name="brand">
          <h1 class="pixel-navbar__title">Pixel Studio</h1>
        </slot>
      </div>
      
      <div class="pixel-navbar__menu">
        <button
          v-for="item in menuItems"
          :key="item.id"
          :class="[
            'pixel-navbar__item',
            { 'pixel-navbar__item--active': activeItem === item.id }
          ]"
          @click="handleItemClick(item.id)"
        >
          <slot name="item" :item="item">
            {{ item.label }}
          </slot>
        </button>
      </div>
      
      <div class="pixel-navbar__actions">
        <slot name="actions" />
      </div>
    </div>

    <!-- 移动端汉堡菜单 -->
    <div class="pixel-navbar__mobile" @click="toggleMenu">
      <PixelIcon name="menu" />
    </div>
    
    <!-- 移动端菜单 -->
    <div v-if="isMenuOpen" class="pixel-navbar__mobile-menu">
      <div class="pixel-navbar__mobile-content">
        <button
          v-for="item in menuItems"
          :key="item.id"
          :class="[
            'pixel-navbar__mobile-item',
            { 'pixel-navbar__mobile-item--active': activeItem === item.id }
          ]"
          @click="handleItemClick(item.id); toggleMenu()"
        >
          {{ item.label }}
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PixelIcon from './PixelIcon.vue'

interface MenuItem {
  id: string
  label: string
  href?: string
}

interface Props {
  menuItems: MenuItem[]
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const isMenuOpen = ref(false)
const activeItem = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleItemClick = (itemId: string) => {
  activeItem.value = itemId
}
</script>

<style scoped>
.pixel-navbar {
  @apply w-full bg-pixel-dark border-b-2 border-pixel-cyan;
  position: relative;
  z-index: 50;
  
  /* 桌面导航 */
  .pixel-navbar__desktop {
    @apply hidden lg:flex items-center justify-between px-6 py-4;
  }
  
  /* 移动端导航 */
  .pixel-navbar__mobile {
    @apply lg:hidden flex items-center justify-center w-12 h-12 bg-pixel-cyan text-pixel-dark;
    cursor: pointer;
    font-size: 20px;
  }
  
  /* 移动端菜单 */
  .pixel-navbar__mobile-menu {
    @apply lg:hidden fixed inset-0 bg-pixel-dark bg-opacity-95 z-40;
    display: none;
  }
  
  .pixel-navbar__mobile-content {
    @apply flex flex-col items-center justify-center h-full space-y-4;
  }
  
  .pixel-navbar__mobile-item {
    @apply px-4 py-2 text-pixel-cyan text-xl font-medium border-b-2 border-transparent;
    font-family: 'Press Start 2P', cursive;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    
    &:hover {
      @apply border-pixel-cyan;
    }
    
    &.pixel-navbar__mobile-item--active {
      @apply border-pixel-cyan text-pixel-cyan;
    }
  }
  
  /* 品牌区域 */
  .pixel-navbar__brand {
    @apply flex items-center;
  }
  
  .pixel-navbar__title {
    @apply text-2xl font-bold text-pixel-cyan;
    font-family: 'Press Start 2P', cursive;
  }
  
  /* 菜单区域 */
  .pixel-navbar__menu {
    @apply flex items-center space-x-6;
  }
  
  .pixel-navbar__item {
    @apply px-4 py-2 text-pixel-light text-sm font-medium border-b-2 border-transparent transition-colors duration-200;
    font-family: 'Press Start 2P', cursive;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    
    &:hover {
      @apply border-pixel-cyan text-pixel-cyan;
    }
    
    &.pixel-navbar__item--active {
      @apply border-pixel-cyan text-pixel-cyan;
    }
  }
  
  /* 操作区域 */
  .pixel-navbar__actions {
    @apply flex items-center space-x-4;
  }
  
  /* 动画效果 */
  .pixel-navbar__mobile-menu {
    animation: pixel-fade-in 0.3s ease-out;
  }
}

/* 像素淡入动画 */
@keyframes pixel-fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .pixel-navbar {
    @apply border-2;
  }
}

/* 减少运动支持 */
@media (prefers-reduced-motion: reduce) {
  .pixel-navbar {
    transition: none;
  }
}
</style>