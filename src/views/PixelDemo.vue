<template>
  <div class="pixel-demo">
    <PixelNavbar 
      v-model="activeNav"
      :menu-items="menuItems"
    />
    
    <div class="pixel-demo-content">
      <PixelHeading level="1" pixel-font class="pixel-demo-title">
        像素风格组件演示
      </PixelHeading>
      
      <PixelLayout variant="card" class="pixel-demo-section">
        <PixelHeading level="2">按钮组件</PixelHeading>
        <div class="pixel-demo-buttons">
          <PixelButton variant="default">默认按钮</PixelButton>
          <PixelButton variant="primary">主要按钮</PixelButton>
          <PixelButton variant="outline">轮廓按钮</PixelButton>
          <PixelButton variant="ghost">幽灵按钮</PixelButton>
        </div>
        <div class="pixel-demo-buttons">
          <PixelButton variant="default" size="small">小按钮</PixelButton>
          <PixelButton variant="primary" size="small">小主要按钮</PixelButton>
          <PixelButton variant="outline" size="small">小轮廓按钮</PixelButton>
        </div>
      </PixelLayout>

      <PixelLayout variant="card" class="pixel-demo-section">
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
      </PixelLayout>

      <PixelLayout variant="card" class="pixel-demo-section">
        <PixelHeading level="2">输入框组件</PixelHeading>
        <div class="pixel-demo-form">
          <PixelInput v-model="input1" placeholder="默认输入框" label="用户名" />
          <PixelInput v-model="input2" placeholder="轮廓输入框" label="邮箱" variant="outline" />
          <PixelInput v-model="input3" placeholder="填充输入框" label="密码" variant="filled" />
        </div>
      </PixelLayout>

      <PixelLayout variant="card" class="pixel-demo-section">
        <PixelHeading level="2">标签和徽章</PixelHeading>
        <div class="pixel-demo-tags">
          <PixelTag variant="default">默认标签</PixelTag>
          <PixelTag variant="primary">主要标签</PixelTag>
          <PixelTag variant="secondary">次要标签</PixelTag>
          <PixelTag variant="outline">轮廓标签</PixelTag>
          <PixelTag variant="ghost">幽灵标签</PixelTag>
        </div>
        <div class="pixel-demo-tags">
          <PixelBadge variant="default">10</PixelBadge>
          <PixelBadge variant="primary">20</PixelBadge>
          <PixelBadge variant="secondary">30</PixelBadge>
          <PixelBadge variant="outline">40</PixelBadge>
          <PixelBadge variant="ghost">50</PixelBadge>
        </div>
      </PixelLayout>

      <PixelLayout variant="card" class="pixel-demo-section">
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
      </PixelLayout>

      <PixelLayout variant="card" class="pixel-demo-section">
        <PixelHeading level="2">代码块</PixelHeading>
        <PixelCodeBlock 
          code="console.log('Hello, World!');"
          language="javascript"
          copyable
        />
      </PixelLayout>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  PixelNavbar,
  PixelHeading,
  PixelLayout,
  PixelGrid,
  PixelButton,
  PixelCard,
  PixelInput,
  PixelTag,
  PixelBadge,
  PixelList,
  PixelDivider,
  PixelCodeBlock
} from '@/components/pixel'

const activeNav = ref('demo')
const input1 = ref('')
const input2 = ref('')
const input3 = ref('')

const menuItems = [
  { id: 'home', label: '首页' },
  { id: 'demo', label: '演示' },
  { id: 'about', label: '关于' }
]
</script>

<style scoped>
.pixel-demo {
  min-height: 100vh;
  background: linear-gradient(135deg, #121212 0%, #1a1a1a 100%);
}

.pixel-demo-content {
  @apply container mx-auto px-4 py-8;
}

.pixel-demo-title {
  @apply text-center mb-8;
}

.pixel-demo-section {
  @apply mb-8;
}

.pixel-demo-buttons {
  @apply flex flex-wrap gap-4 mb-4;
}

.pixel-demo-form {
  @apply max-w-md;
}

.pixel-demo-tags {
  @apply flex flex-wrap gap-2 mb-4;
}
</style>