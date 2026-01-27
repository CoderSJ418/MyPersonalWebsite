# 像素风格组件库使用指南

## 快速开始

### 1. 安装组件库

```bash
# 组件库已集成在项目中，无需额外安装
```

### 2. 导入组件

#### 方式一：按需导入
```typescript
import { PixelButton, PixelCard } from '@/components/pixel'

export default {
  components: {
    PixelButton,
    PixelCard
  }
}
```

#### 方式二：全局注册
```typescript
// main.ts
import { createApp } from 'vue'
import * as pixelComponents from '@/components/pixel'

const app = createApp(App)

// 注册所有像素组件
Object.entries(pixelComponents).forEach(([name, component]) => {
  app.component(name, component)
})

app.mount('#app')
```

#### 方式三：在组件中局部注册
```vue
<template>
  <PixelButton>按钮</PixelButton>
</template>

<script setup lang="ts">
import { PixelButton } from '@/components/pixel'
</script>
```

## 组件使用示例

### 按钮组件

```vue
<template>
  <!-- 默认按钮 -->
  <PixelButton>默认按钮</PixelButton>
  
  <!-- 主要按钮 -->
  <PixelButton variant="primary">主要按钮</PixelButton>
  
  <!-- 轮廓按钮 -->
  <PixelButton variant="outline">轮廓按钮</PixelButton>
  
  <!-- 幽灵按钮 -->
  <PixelButton variant="ghost">幽灵按钮</PixelButton>
  
  <!-- 大按钮 -->
  <PixelButton size="large">大按钮</PixelButton>
  
  <!-- 小按钮 -->
  <PixelButton size="small">小按钮</PixelButton>
  
  <!-- 禁用状态 -->
  <PixelButton disabled>禁用按钮</PixelButton>
  
  <!-- 加载状态 -->
  <PixelButton loading>加载中</PixelButton>
  
  <!-- 带图标的按钮 -->
  <PixelButton icon>
    <template #icon>
      <svg>...</svg>
    </template>
    带图标按钮
  </PixelButton>
</template>
```

### 卡片组件

```vue
<template>
  <!-- 默认卡片 -->
  <PixelCard title="卡片标题">
    <p>卡片内容</p>
  </PixelCard>
  
  <!-- 渐变卡片 -->
  <PixelCard variant="gradient" title="渐变卡片">
    <p>这是渐变风格的卡片</p>
  </PixelCard>
  
  <!-- 轮廓卡片 -->
  <PixelCard variant="outline" title="轮廓卡片">
    <p>这是轮廓风格的卡片</p>
  </PixelCard>
  
  <!-- 填充卡片 -->
  <PixelCard variant="filled" title="填充卡片">
    <p>这是填充风格的卡片</p>
  </PixelCard>
  
  <!-- 自定义内容 -->
  <PixelCard>
    <template #header>
      <h3>自定义头部</h3>
    </template>
    <p>自定义内容</p>
    <template #footer>
      <p>自定义底部</p>
    </template>
  </PixelCard>
</template>
```

### 输入框组件

```vue
<template>
  <!-- 默认输入框 -->
  <PixelInput 
    v-model="inputValue" 
    placeholder="请输入内容"
    label="输入标签"
  />
  
  <!-- 轮廓输入框 -->
  <PixelInput 
    v-model="outlineValue" 
    placeholder="轮廓输入框"
    variant="outline"
    label="轮廓标签"
  />
  
  <!-- 填充输入框 -->
  <PixelInput 
    v-model="filledValue" 
    placeholder="填充输入框"
    variant="filled"
    label="填充标签"
  />
  
  <!-- 错误状态 -->
  <PixelInput 
    v-model="errorValue" 
    placeholder="错误输入框"
    error="请输入有效内容"
    label="错误标签"
  />
  
  <!-- 禁用状态 -->
  <PixelInput 
    v-model="disabledValue" 
    placeholder="禁用输入框"
    disabled
    label="禁用标签"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PixelInput } from '@/components/pixel'

const inputValue = ref('')
const outlineValue = ref('')
const filledValue = ref('')
const errorValue = ref('')
const disabledValue = ref('')
</script>
```

### 标签页组件

```vue
<template>
  <PixelTabs 
    v-model="activeTab" 
    :tabs="tabs"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PixelTabs } from '@/components/pixel'

const activeTab = ref('tab1')

const tabs = [
  { id: 'tab1', label: '选项 1' },
  { id: 'tab2', label: '选项 2' },
  { id: 'tab3', label: '选项 3' }
]
</script>
```

### 代码块组件

```vue
<template>
  <!-- 基础代码块 -->
  <PixelCodeBlock 
    code="console.log('Hello, World!');"
    language="javascript"
  />
  
  <!-- 可复制代码块 -->
  <PixelCodeBlock 
    code="console.log('Hello, World!');"
    language="javascript"
    copyable
  />
  
  <!-- 自定义代码 -->
  <PixelCodeBlock 
    :code="code"
    language="python"
    copyable
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PixelCodeBlock } from '@/components/pixel'

const code = ref(`def hello():
    print("Hello, World!")
    return True`)
</script>
```

### 导航栏组件

```vue
<template>
  <PixelNavbar 
    :menu-items="menuItems"
    v-model="activeNav"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PixelNavbar } from '@/components/pixel'

const activeNav = ref('home')

const menuItems = [
  { id: 'home', label: '首页' },
  { id: 'about', label: '关于' },
  { id: 'services', label: '服务' },
  { id: 'contact', label: '联系' }
]
</script>
```

### 标签和徽章

```vue
<template>
  <!-- 标签 -->
  <PixelTag variant="default">默认标签</PixelTag>
  <PixelTag variant="primary">主要标签</PixelTag>
  <PixelTag variant="secondary">次要标签</PixelTag>
  <PixelTag variant="outline">轮廓标签</PixelTag>
  <PixelTag variant="ghost">幽灵标签</PixelTag>
  
  <!-- 可点击标签 -->
  <PixelTag variant="primary" clickable @click="handleClick">
    可点击标签
  </PixelTag>
  
  <!-- 徽章 -->
  <PixelBadge variant="default">10</PixelBadge>
  <PixelBadge variant="primary">20</PixelBadge>
  <PixelBadge variant="secondary">30</PixelBadge>
  <PixelBadge variant="outline">40</PixelBadge>
  <PixelBadge variant="ghost">50</PixelBadge>
  
  <!-- 点状徽章 -->
  <PixelBadge variant="primary" dot />
</template>

<script setup lang="ts">
import { PixelTag, PixelBadge } from '@/components/pixel'

const handleClick = () => {
  console.log('标签被点击')
}
</script>
```

## 组件属性详解

### PixelButton 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| tag | string | 'button' | 按钮标签 |
| type | string | 'button' | 按钮类型 |
| variant | string | 'default' | 按钮变体 |
| size | string | 'medium' | 按钮大小 |
| loading | boolean | false | 加载状态 |
| disabled | boolean | false | 禁用状态 |
| icon | boolean | false | 是否有图标 |
| iconColor | string | 'current' | 图标颜色 |

### PixelCard 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | string | 'default' | 卡片变体 |
| title | string | '' | 卡片标题 |

### PixelInput 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| modelValue | string | '' | 输入值 |
| type | string | 'text' | 输入类型 |
| label | string | '' | 标签文本 |
| placeholder | string | '' | 占位符 |
| helperText | string | '' | 辅助文本 |
| error | string | '' | 错误信息 |
| disabled | boolean | false | 禁用状态 |
| readonly | boolean | false | 只读状态 |
| required | boolean | false | 必填状态 |
| variant | string | 'default' | 输入框变体 |
| id | string | '' | 输入框ID |

### PixelTabs 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| tabs | Array | [] | 标签数据 |
| modelValue | string | '' | 活动标签 |

### PixelCodeBlock 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| code | string | '' | 代码内容 |
| language | string | '' | 代码语言 |
| copyable | boolean | true | 是否可复制 |

### PixelNavbar 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| menuItems | Array | [] | 菜单项 |
| modelValue | string | '' | 活动菜单项 |

### PixelTag 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | string | 'default' | 标签变体 |
| size | string | 'medium' | 标签大小 |
| clickable | boolean | false | 是否可点击 |

### PixelBadge 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | string | 'default' | 徽章变体 |
| size | string | 'medium' | 徽章大小 |
| dot | boolean | false | 点状徽章 |

## 事件

### PixelButton 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| click | - | 点击事件 |

### PixelTag 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| click | - | 点击事件 |

## 响应式设计

所有组件都支持响应式设计：

```css
/* 移动端适配 */
@media (max-width: 768px) {
  .pixel-component {
    /* 移动端样式 */
  }
}

/* 小屏幕适配 */
@media (max-width: 480px) {
  .pixel-component {
    /* 小屏幕样式 */
  }
}
```

## 主题定制

### 修改颜色

```css
/* 修改主题颜色 */
:root {
  --pixel-cyan: #your-color;
  --pixel-purple: #your-color;
  --pixel-dark: #your-color;
  --pixel-light: #your-color;
  --pixel-gray: #your-color;
}
```

### 修改字体

```css
.pixel-component {
  font-family: 'Your Font', sans-serif;
}
```

### 修改尺寸

```css
.pixel-component {
  font-size: var(--pixel-font-size);
  padding: var(--pixel-spacing);
}
```

## 性能优化

### 组件懒加载

```typescript
import { defineAsyncComponent } from 'vue'

const PixelButton = defineAsyncComponent(() => 
  import('@/components/pixel/PixelButton.vue')
)
```

### 虚拟滚动

```vue
<template>
  <div class="virtual-scroll">
    <PixelGrid variant="columns">
      <div v-for="item in items" :key="item.id">
        {{ item.name }}
      </div>
    </PixelGrid>
  </div>
</template>
```

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 常见问题

### Q: 如何修改组件样式？
A: 可以通过CSS变量、类名或内联样式来修改组件样式。

### Q: 组件支持哪些事件？
A: 每个组件支持特定的事件，详见上面的事件表格。

### Q: 如何实现表单验证？
A: 可以结合Vue的表单验证库或使用组件的error属性。

### Q: 组件支持国际化吗？
A: 组件支持通过props传递国际化文本。

## 更新日志

### v1.0.0 (2024-01-24)
- 初始版本发布
- 15个核心组件
- 基础样式和动画
- 响应式设计