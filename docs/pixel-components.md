# 像素风格组件库文档

## 概述

像素风格组件库提供了一套完整的复古像素风格组件，用于构建具有复古科技感的用户界面。这些组件遵循像素艺术美学，同时保持现代Web开发的最佳实践。

## 组件列表

### 1. PixelButton - 像素按钮
```vue
<PixelButton variant="primary" size="large">
  点击我
</PixelButton>
```

### 2. PixelCard - 像素卡片
```vue
<PixelCard variant="gradient" title="卡片标题">
  <p>卡片内容</p>
</PixelCard>
```

### 3. PixelCodeBlock - 像素代码块
```vue
<PixelCodeBlock 
  code="console.log('Hello World')" 
  language="javascript"
  copyable
/>
```

### 4. PixelNavbar - 像素导航栏
```vue
<PixelNavbar 
  :menu-items="menuItems"
  v-model="activeItem"
/>
```

### 5. PixelInput - 像素输入框
```vue
<PixelInput 
  v-model="inputValue"
  placeholder="请输入内容"
  label="输入标签"
/>
```

### 6. PixelTag - 像素标签
```vue
<PixelTag variant="primary" size="large" clickable>
  可点击标签
</PixelTag>
```

### 7. PixelTabs - 像素标签页
```vue
<PixelTabs 
  :tabs="tabs"
  v-model="activeTab"
/>
```

### 8. PixelLayout - 像素布局
```vue
<PixelLayout variant="card">
  <div>内容区域</div>
</PixelLayout>
```

### 9. PixelGrid - 像素网格
```vue
<PixelGrid variant="cards">
  <div>卡片1</div>
  <div>卡片2</div>
</PixelGrid>
```

### 10. PixelSpacing - 像素间距
```vue
<PixelSpacing size="lg" />
```

### 11. PixelHeading - 像素标题
```vue
<PixelHeading level="1" pixelFont>
  大标题
</PixelHeading>
```

### 12. PixelList - 像素列表
```vue
<PixelList type="ul">
  <li>列表项1</li>
  <li>列表项2</li>
</PixelList>
```

### 13. PixelDivider - 像素分隔线
```vue
<PixelDivider variant="dashed">
  或者内容
</PixelDivider>
```

### 14. PixelIcon - 像素图标
```vue
<PixelIcon size="large" color="cyan" />
```

### 15. PixelBadge - 像素徽章
```vue
<PixelBadge variant="primary" size="large">
  100
</PixelBadge>
```

## 样式变量

### 颜色系统
```css
--pixel-cyan: #00FFFF;
--pixel-purple: #FF00FF;
--pixel-dark: #121212;
--pixel-light: #F8F8F8;
--pixel-gray: #888888;
```

### 字体系统
```css
--pixel-font-heading: 'Press Start 2P', cursive;
--pixel-font-body: 'JetBrains Mono', monospace;
```

### 尺寸系统
```css
--pixel-spacing-xs: 0.5rem;
--pixel-spacing-sm: 1rem;
--pixel-spacing-md: 1.5rem;
--pixel-spacing-lg: 2rem;
--pixel-spacing-xl: 3rem;
```

## 使用指南

### 1. 导入组件
```typescript
import { PixelButton, PixelCard } from '@/components/pixel'
```

### 2. 全局注册
```typescript
import { createApp } from 'vue'
import { 
  PixelButton, 
  PixelCard, 
  PixelCodeBlock,
  // ... 其他组件
} from '@/components/pixel'

const app = createApp(App)
app.component('PixelButton', PixelButton)
app.component('PixelCard', PixelCard)
// ... 其他组件
```

### 3. 全局导入
```typescript
// 在 main.ts 中
import * as pixelComponents from '@/components/pixel'

const app = createApp(App)
Object.entries(pixelComponents).forEach(([name, component]) => {
  app.component(name, component)
})
```

## 响应式设计

所有组件都支持响应式设计，在不同屏幕尺寸下自动调整：

- **桌面**: 完整功能和样式
- **平板**: 适配的布局和间距
- **手机**: 简化的交互和布局

## 可访问性

组件遵循WCAG 2.1 AA标准：

- 高对比度支持
- 键盘导航支持
- 屏幕阅读器支持
- 减少运动支持

## 动画效果

### 悬停效果
- 按钮: 缩放 105%
- 卡片: 缩放 105% + 阴影
- 标签: 缩放 105%

### 点击效果
- 按钮: 缩放 95%
- 卡片: 缩放 95%

### 加载动画
- 脉冲动画
- 旋转动画

## 性能优化

- 组件懒加载
- CSS优化
- 图片优化
- 字体优化

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 更新日志

### v1.0.0 (2024-01-24)
- 初始版本发布
- 15个核心组件
- 基础样式和动画
- 响应式设计