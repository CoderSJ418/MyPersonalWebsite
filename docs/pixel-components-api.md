# 像素风格组件库 API 文档

## 概述

像素风格组件库提供了一套完整的复古像素风格组件，用于构建具有复古科技感的用户界面。本文档详细介绍了所有组件的API接口、属性、事件和使用方法。

## 快速开始

### 安装

组件库已集成在项目中，无需额外安装。

### 导入

```typescript
// 方式一：按需导入
import { PixelButton, PixelCard } from '@/components/pixel'

// 方式二：全局注册
import * as pixelComponents from '@/components/pixel'
const app = createApp(App)
Object.entries(pixelComponents).forEach(([name, component]) => {
  app.component(name, component)
})

// 方式三：局部注册
export default {
  components: {
    PixelButton,
    PixelCard
  }
}
```

## 组件 API

### 1. PixelButton

#### 属性

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
| aria-label | string | '' | ARIA标签 |

#### 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| click | - | 点击事件 |

#### 插槽

| 插槽 | 说明 |
|------|------|
| default | 按钮文本 |
| icon | 自定义图标 |

#### 示例

```vue
<template>
  <!-- 默认按钮 -->
  <PixelButton>默认按钮</PixelButton>
  
  <!-- 主要按钮 -->
  <PixelButton variant="primary">主要按钮</PixelButton>
  
  <!-- 带图标的按钮 -->
  <PixelButton icon>
    <template #icon>
      <svg>...</svg>
    </template>
    带图标按钮
  </PixelButton>
  
  <!-- 加载状态 -->
  <PixelButton loading>加载中</PixelButton>
</template>
```

### 2. PixelCard

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | string | 'default' | 卡片变体 |
| title | string | '' | 卡片标题 |

#### 插槽

| 插槽 | 说明 |
|------|------|
| header | 卡片头部 |
| default | 卡片内容 |
| footer | 卡片底部 |

#### 示例

```vue
<template>
  <!-- 默认卡片 -->
  <PixelCard title="卡片标题">
    <p>卡片内容</p>
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

### 3. PixelInput

#### 属性

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
| aria-label | string | '' | ARIA标签 |

#### 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| update:modelValue | value: string | 输入值更新 |

#### 示例

```vue
<template>
  <PixelInput 
    v-model="inputValue" 
    placeholder="请输入内容"
    label="输入标签"
    variant="outline"
    error="请输入有效内容"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
const inputValue = ref('')
</script>
```

### 4. PixelTabs

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| tabs | Array | [] | 标签数据 |
| modelValue | string | '' | 活动标签 |
| aria-label | string | '' | ARIA标签 |

#### 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| update:modelValue | value: string | 活动标签更新 |

#### 插槽

| 插槽 | 说明 |
|------|------|
| tab | 自定义标签 |
| default | 默认内容 |
| panel-* | 标签页内容 |

#### 示例

```vue
<template>
  <PixelTabs 
    v-model="activeTab" 
    :tabs="tabs"
  >
    <template #panel-tab1>
      <p>这是选项 1 的内容</p>
    </template>
    <template #panel-tab2>
      <p>这是选项 2 的内容</p>
    </template>
  </PixelTabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const activeTab = ref('tab1')
const tabs = [
  { id: 'tab1', label: '选项 1' },
  { id: 'tab2', label: '选项 2' }
]
</script>
```

### 5. PixelCodeBlock

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| code | string | '' | 代码内容 |
| language | string | '' | 代码语言 |
| copyable | boolean | true | 是否可复制 |
| aria-label | string | '' | ARIA标签 |

#### 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| copy | - | 复制成功 |

#### 示例

```vue
<template>
  <PixelCodeBlock 
    code="console.log('Hello, World!');"
    language="javascript"
    copyable
  />
</template>
```

### 6. PixelTag

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | string | 'default' | 标签变体 |
| size | string | 'medium' | 标签大小 |
| clickable | boolean | false | 是否可点击 |
| aria-label | string | '' | ARIA标签 |

#### 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| click | - | 点击事件 |

#### 插槽

| 插槽 | 说明 |
|------|------|
| default | 标签文本 |

#### 示例

```vue
<template>
  <PixelTag variant="primary" clickable @click="handleClick">
    可点击标签
  </PixelTag>
</template>

<script setup lang="ts">
const handleClick = () => {
  console.log('标签被点击')
}
</script>
```

### 7. PixelBadge

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | string | 'default' | 徽章变体 |
| size | string | 'medium' | 徽章大小 |
| dot | boolean | false | 点状徽章 |
| aria-label | string | '' | ARIA标签 |

#### 插槽

| 插槽 | 说明 |
|------|------|
| default | 徽章内容 |

#### 示例

```vue
<template>
  <PixelBadge variant="primary" size="large">
    100
  </PixelBadge>
  
  <!-- 点状徽章 -->
  <PixelBadge variant="primary" dot />
</template>
```

### 8. PixelHeading

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| level | number | 1 | 标题级别 |
| tag | string | 'h1' | HTML标签 |
| pixelFont | boolean | false | 是否使用像素字体 |
| aria-label | string | '' | ARIA标签 |

#### 插槽

| 插槽 | 说明 |
|------|------|
| default | 标题文本 |

#### 示例

```vue
<template>
  <PixelHeading level="1" pixelFont>
    大标题
  </PixelHeading>
  
  <PixelHeading level="2">
    二级标题
  </PixelHeading>
</template>
```

### 9. PixelList

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| type | string | 'ul' | 列表类型 |
| aria-label | string | '' | ARIA标签 |

#### 插槽

| 插槽 | 说明 |
|------|------|
| default | 列表项 |

#### 示例

```vue
<template>
  <PixelList type="ul">
    <li>列表项 1</li>
    <li>列表项 2</li>
    <li>列表项 3</li>
  </PixelList>
  
  <PixelList type="ol">
    <li>有序列表项 1</li>
    <li>有序列表项 2</li>
  </PixelList>
</template>
```

### 10. PixelDivider

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | string | 'default' | 分隔线样式 |
| aria-label | string | '' | ARIA标签 |

#### 插槽

| 插槽 | 说明 |
|------|------|
| default | 分隔线内容 |

#### 示例

```vue
<template>
  <PixelDivider />
  
  <!-- 带内容的分隔线 -->
  <PixelDivider>
    或者内容
  </PixelDivider>
  
  <!-- 虚线分隔线 -->
  <PixelDivider variant="dashed" />
</template>
```

### 11. PixelLayout

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | string | 'default' | 布局变体 |
| aria-label | string | '' | ARIA标签 |

#### 插槽

| 插槽 | 说明 |
|------|------|
| default | 布局内容 |

#### 示例

```vue
<template>
  <PixelLayout variant="card">
    <div>卡片布局内容</div>
  </PixelLayout>
  
  <PixelLayout variant="panel">
    <div>面板布局内容</div>
  </PixelLayout>
</template>
```

### 12. PixelGrid

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | string | 'default' | 网格变体 |
| columns | number | 3 | 列数 |
| rows | number | 1 | 行数 |
| aria-label | string | '' | ARIA标签 |

#### 插槽

| 插槽 | 说明 |
|------|------|
| default | 网格项 |

#### 示例

```vue
<template>
  <PixelGrid variant="cards">
    <div>卡片1</div>
    <div>卡片2</div>
    <div>卡片3</div>
  </PixelGrid>
  
  <PixelGrid variant="columns" :columns="4">
    <div>列项1</div>
    <div>列项2</div>
    <div>列项3</div>
  </PixelGrid>
</template>
```

### 13. PixelSpacing

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| size | string | 'md' | 间距大小 |

#### 示例

```vue
<template>
  <PixelSpacing size="lg" />
  
  <PixelSpacing size="xl" />
</template>
```

### 14. PixelIcon

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| size | string | 'medium' | 图标大小 |
| color | string | 'current' | 图标颜色 |
| rotate | boolean | false | 是否旋转 |
| strokeWidth | number | 2 | 线条宽度 |
| strokeLinecap | string | 'round' | 线条端点 |
| strokeLinejoin | string | 'round' | 线条连接 |
| aria-label | string | '' | ARIA标签 |

#### 插槽

| 插槽 | 说明 |
|------|------|
| default | 图标内容 |

#### 示例

```vue
<template>
  <PixelIcon size="large" color="cyan" />
  
  <!-- 旋转图标 -->
  <PixelIcon rotate>
    <svg>...</svg>
  </PixelIcon>
</template>
```

### 15. PixelNavbar

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| menuItems | Array | [] | 菜单项 |
| modelValue | string | '' | 活动菜单项 |
| aria-label | string | '' | ARIA标签 |

#### 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| update:modelValue | value: string | 活动菜单项更新 |

#### 插槽

| 插槽 | 说明 |
|------|------|
| brand | 品牌区域 |
| menu | 菜单区域 |
| actions | 操作区域 |
| default | 默认内容 |

#### 示例

```vue
<template>
  <PixelNavbar 
    :menu-items="menuItems"
    v-model="activeNav"
  >
    <template #brand>
      <h1>品牌名称</h1>
    </template>
    <template #actions>
      <button>操作</button>
    </template>
  </PixelNavbar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const activeNav = ref('home')
const menuItems = [
  { id: 'home', label: '首页' },
  { id: 'about', label: '关于' },
  { id: 'contact', label: '联系' }
]
</script>
```

## CSS 变量

### 颜色变量

```css
:root {
  /* 主要颜色 */
  --pixel-cyan: #00FFFF;
  --pixel-purple: #FF00FF;
  
  /* 中性颜色 */
  --pixel-dark: #121212;
  --pixel-light: #F8F8F8;
  --pixel-gray: #888888;
  
  /* 透明度 */
  --pixel-opacity-light: rgba(248, 248, 248, 0.1);
  --pixel-opacity-medium: rgba(248, 248, 248, 0.2);
  --pixel-opacity-strong: rgba(248, 248, 248, 0.3);
}
```

### 字体变量

```css
:root {
  /* 像素字体 */
  --pixel-font-heading: 'Press Start 2P', cursive;
  --pixel-font-body: 'JetBrains Mono', monospace;
  
  /* 字体大小 */
  --pixel-font-size-xs: 10px;
  --pixel-font-size-sm: 12px;
  --pixel-font-size-md: 14px;
  --pixel-font-size-lg: 16px;
  --pixel-font-size-xl: 18px;
  --pixel-font-size-2xl: 20px;
  
  /* 行高 */
  --pixel-line-height-tight: 1.2;
  --pixel-line-height-normal: 1.5;
  --pixel-line-height-relaxed: 1.8;
}
```

### 尺寸变量

```css
:root {
  /* 间距 */
  --pixel-spacing-xs: 0.5rem;
  --pixel-spacing-sm: 1rem;
  --pixel-spacing-md: 1.5rem;
  --pixel-spacing-lg: 2rem;
  --pixel-spacing-xl: 3rem;
  --pixel-spacing-2xl: 4rem;
  
  /* 圆角 */
  --pixel-radius-sm: 4px;
  --pixel-radius-md: 8px;
  --pixel-radius-lg: 12px;
  --pixel-radius-xl: 16px;
  --pixel-radius-full: 9999px;
  
  /* 阴影 */
  --pixel-shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --pixel-shadow-md: 0 4px 8px rgba(0, 0, 0, 0.15);
  --pixel-shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.2);
  --pixel-shadow-xl: 0 16px 32px rgba(0, 0, 0, 0.25);
}
```

## 响应式设计

### 断点

```css
/* 小屏幕 */
@media (max-width: 480px) {
  .pixel-component {
    /* 小屏幕样式 */
  }
}

/* 中等屏幕 */
@media (max-width: 768px) {
  .pixel-component {
    /* 中等屏幕样式 */
  }
}

/* 大屏幕 */
@media (max-width: 1024px) {
  .pixel-component {
    /* 大屏幕样式 */
  }
}

/* 超大屏幕 */
@media (min-width: 1280px) {
  .pixel-component {
    /* 超大屏幕样式 */
  }
}
```

### 响应式工具类

```css
/* 响应式间距 */
.pixel-spacing {
  /* 响应式实现 */
}

/* 响应式网格 */
.pixel-grid {
  /* 响应式网格实现 */
}
```

## 可访问性

### ARIA 属性

所有组件都支持以下 ARIA 属性：

- `aria-label`: 元素标签
- `aria-describedby`: 描述元素
- `aria-expanded`: 展开状态
- `aria-selected`: 选择状态
- `aria-hidden`: 隐藏状态

### 键盘导航

所有交互组件都支持键盘导航：

- `Tab`: 导航到下一个元素
- `Enter`: 触发点击/选择
- `Space`: 触发点击/选择
- `Escape`: 关闭/取消
- `Arrow keys`: 在列表中导航

### 屏幕阅读器

所有组件都优化了屏幕阅读器支持：

- 语义化HTML结构
- 适当的标签和描述
- 动态内容更新通知
- 错误状态提示

## 性能优化

### 组件懒加载

```vue
<template>
  <Suspense>
    <template #default>
      <PixelButton>按钮</PixelButton>
    </template>
    <template #fallback>
      <div>加载中...</div>
    </template>
  </Suspense>
</template>
```

### 虚拟滚动

```vue
<template>
  <PixelGrid variant="columns">
    <div v-for="item in items" :key="item.id">
      {{ item.name }}
    </div>
  </PixelGrid>
</template>
```

### 缓存策略

- CSS和JS缓存
- 字体缓存
- 图片缓存
- 组件缓存

## 浏览器兼容性

| 浏览器 | 版本 | 支持 |
|--------|------|------|
| Chrome | 90+ | ✅ |
| Firefox | 88+ | ✅ |
| Safari | 14+ | ✅ |
| Edge | 90+ | ✅ |
| IE | 11+ | ⚠️ |

## 更新日志

### v1.0.0 (2024-01-24)

- 初始版本发布
- 15个核心组件
- 基础样式和动画
- 响应式设计
- 可访问性支持

## 许可证

MIT License