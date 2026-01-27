<template>
  <div class="pixel-components-demo">
    <PixelHeading level="1" pixel-font>像素风格组件库演示</PixelHeading>
    
    <PixelLayout variant="card">
      <!-- 按钮演示 -->
      <section class="demo-section">
        <PixelHeading level="2">按钮组件</PixelHeading>
        <div class="demo-buttons">
          <PixelButton variant="default" size="small">小按钮</PixelButton>
          <PixelButton variant="primary" size="small">主要按钮</PixelButton>
          <PixelButton variant="outline" size="small">轮廓按钮</PixelButton>
          <PixelButton variant="ghost" size="small">幽灵按钮</PixelButton>
        </div>
        <div class="demo-buttons">
          <PixelButton variant="default">默认按钮</PixelButton>
          <PixelButton variant="primary">主要按钮</PixelButton>
          <PixelButton variant="outline">轮廓按钮</PixelButton>
          <PixelButton variant="ghost">幽灵按钮</PixelButton>
        </div>
        <div class="demo-buttons">
          <PixelButton variant="default" size="large">大按钮</PixelButton>
          <PixelButton variant="primary" size="large">主要按钮</PixelButton>
          <PixelButton variant="outline" size="large">轮廓按钮</PixelButton>
          <PixelButton variant="ghost" size="large">幽灵按钮</PixelButton>
        </div>
      </section>

      <!-- 卡片演示 -->
      <section class="demo-section">
        <PixelHeading level="2">卡片组件</PixelHeading>
        <PixelGrid variant="cards">
          <PixelCard variant="gradient" title="渐变卡片">
            <p>这是渐变风格的卡片</p>
          </PixelCard>
          <PixelCard variant="outline" title="轮廓卡片">
            <p>这是轮廓风格的卡片</p>
          </PixelCard>
          <PixelCard variant="filled" title="填充卡片">
            <p>这是填充风格的卡片</p>
          </PixelCard>
        </PixelGrid>
      </section>

      <!-- 输入框演示 -->
      <section class="demo-section">
        <PixelHeading level="2">输入框组件</PixelHeading>
        <div class="demo-form">
          <PixelInput v-model="input1" placeholder="默认输入框" label="用户名" />
          <PixelInput v-model="input2" placeholder="轮廓输入框" label="邮箱" variant="outline" />
          <PixelInput v-model="input3" placeholder="填充输入框" label="密码" variant="filled" />
        </div>
      </section>

      <!-- 标签页演示 -->
      <section class="demo-section">
        <PixelHeading level="2">标签页组件</PixelHeading>
        <PixelTabs v-model="activeTab" :tabs="tabs" />
        <div class="demo-content">
          <p>{{ activeTabContent }}</p>
        </div>
      </section>

      <!-- 代码块演示 -->
      <section class="demo-section">
        <PixelHeading level="2">代码块组件</PixelHeading>
        <PixelCodeBlock 
          code="console.log('Hello, World!');"
          language="javascript"
          copyable
        />
      </section>

      <!-- 导航栏演示 -->
      <section class="demo-section">
        <PixelHeading level="2">导航栏组件</PixelHeading>
        <PixelNavbar 
          v-model="activeNav"
          :menu-items="navItems"
        />
      </section>

      <!-- 标签和徽章演示 -->
      <section class="demo-section">
        <PixelHeading level="2">标签和徽章</PixelHeading>
        <div class="demo-tags">
          <PixelTag variant="default">默认标签</PixelTag>
          <PixelTag variant="primary">主要标签</PixelTag>
          <PixelTag variant="secondary">次要标签</PixelTag>
          <PixelTag variant="outline">轮廓标签</PixelTag>
          <PixelTag variant="ghost">幽灵标签</PixelTag>
        </div>
        <div class="demo-tags">
          <PixelBadge variant="default">10</PixelBadge>
          <PixelBadge variant="primary">20</PixelBadge>
          <PixelBadge variant="secondary">30</PixelBadge>
          <PixelBadge variant="outline">40</PixelBadge>
          <PixelBadge variant="ghost">50</PixelBadge>
        </div>
      </section>

      <!-- 列表和分隔线演示 -->
      <section class="demo-section">
        <PixelHeading level="2">列表和分隔线</PixelHeading>
        <PixelList type="ul">
          <li>列表项 1</li>
          <li>列表项 2</li>
          <li>列表项 3</li>
        </PixelList>
        <PixelDivider />
        <PixelList type="ol">
          <li>有序列表项 1</li>
          <li>有序列表项 2</li>
          <li>有序列表项 3</li>
        </PixelList>
      </section>
    </PixelLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  PixelButton,
  PixelCard,
  PixelCodeBlock,
  PixelNavbar,
  PixelInput,
  PixelTag,
  PixelTabs,
  PixelLayout,
  PixelGrid,
  PixelHeading,
  PixelList,
  PixelDivider,
  PixelBadge
} from '@/components/pixel'

const input1 = ref('')
const input2 = ref('')
const input3 = ref('')
const activeTab = ref('tab1')
const activeNav = ref('home')

const tabs = [
  { id: 'tab1', label: '选项 1' },
  { id: 'tab2', label: '选项 2' },
  { id: 'tab3', label: '选项 3' }
]

const navItems = [
  { id: 'home', label: '首页' },
  { id: 'about', label: '关于' },
  { id: 'contact', label: '联系' }
]

const activeTabContent = computed(() => {
  const tab = tabs.find(t => t.id === activeTab.value)
  return tab ? `这是 ${tab.label} 的内容` : '请选择一个选项'
})
</script>

<style scoped>
.pixel-components-demo {
  @apply p-6;
}

.demo-section {
  @apply mb-8;
}

.demo-buttons {
  @apply flex flex-wrap gap-4 mb-4;
}

.demo-form {
  @apply max-w-md;
}

.demo-content {
  @apply mt-4 p-4 bg-pixel-dark border-2 border-pixel-cyan;
}

.demo-tags {
  @apply flex flex-wrap gap-2 mb-4;
}
</style>