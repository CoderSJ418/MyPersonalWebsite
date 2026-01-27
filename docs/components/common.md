# 通用组件文档

本文档提供了 MyPersonalWebsite 项目中所有通用 UI 组件的使用文档。

## 概述

通用组件是可以在多个页面和场景中复用的 UI 组件，包括导航栏、页脚、按钮、卡片等基础组件。

## 组件列表

### Header 组件

响应式导航栏组件，支持桌面端和移动端自适应。

**路径**: `src/components/common/Header.vue`

**使用示例**
```vue
<template>
  <Header />
</template>

<script setup lang="ts">
import Header from '@/components/common/Header.vue'
</script>
```

**Props**
```typescript
interface HeaderProps {
  // Logo 文本
  logoText?: string
  
  // 导航链接
  navLinks?: NavLink[]
  
  // 社交媒体链接
  socialLinks?: SocialLink[]
  
  // 是否显示搜索框
  showSearch?: boolean
}
```

**Events**
```typescript
interface HeaderEmits {
  // 导航链接点击
  (e: 'nav-click', link: NavLink): void
  
  // 搜索查询
  (e: 'search', query: string): void
}
```

**Slots**
```typescript
interface HeaderSlots {
  // Logo 区域
  logo?: () => VNode
  
  // 导航区域
  nav?: () => VNode
  
  // 操作区域
  actions?: () => VNode
}
```

**特性**
- 响应式设计，支持桌面端和移动端
- 暗黑模式切换
- 移动端抽屉菜单
- 滚动时自动隐藏/显示

---

### Footer 组件

页脚组件，显示版权信息、链接和社交媒体图标。

**路径**: `src/components/common/Footer.vue`

**使用示例**
```vue
<template>
  <Footer />
</template>

<script setup lang="ts">
import Footer from '@/components/common/Footer.vue'
</script>
```

**Props**
```typescript
interface FooterProps {
  // 版权文本
  copyright?: string
  
  // 快速链接
  quickLinks?: QuickLink[]
  
  // 社交媒体链接
  socialLinks?: SocialLink[]
  
  // 联系信息
  contactInfo?: ContactInfo
}
```

**Slots**
```typescript
interface FooterSlots {
  // 左侧内容
  left?: () => VNode
  
  // 中间内容
  center?: () => VNode
  
  // 右侧内容
  right?: () => VNode
}
```

---

### Button 组件

通用按钮组件，支持多种样式和状态。

**路径**: `src/components/common/Button.vue`

**使用示例**
```vue
<template>
  <Button variant="primary" size="large" @click="handleClick">
    Click Me
  </Button>
</template>

<script setup lang="ts">
import Button from '@/components/common/Button.vue'

const handleClick = () => {
  console.log('Button clicked')
}
</script>
```

**Props**
```typescript
interface ButtonProps {
  // 按钮变体
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  
  // 按钮大小
  size?: 'small' | 'medium' | 'large'
  
  // 是否禁用
  disabled?: boolean
  
  // 是否加载中
  loading?: boolean
  
  // 按钮类型
  type?: 'button' | 'submit' | 'reset'
  
  // 图标
  icon?: string
}
```

**Events**
```typescript
interface ButtonEmits {
  (e: 'click', event: MouseEvent): void
}
```

**Slots**
```typescript
interface ButtonSlots {
  // 默认内容
  default?: () => VNode
  
  // 加载状态内容
  loading?: () => VNode
}
```

---

### Card 组件

卡片组件，用于展示内容块。

**路径**: `src/components/common/Card.vue`

**使用示例**
```vue
<template>
  <Card :hoverable="true">
    <template #header>
      <h3>Card Title</h3>
    </template>
    <p>Card content goes here...</p>
    <template #footer>
      <Button>Action</Button>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/common/Card.vue'
import Button from '@/components/common/Button.vue'
</script>
```

**Props**
```typescript
interface CardProps {
  // 是否可悬停
  hoverable?: boolean
  
  // 是否有阴影
  shadow?: boolean
  
  // 边框样式
  bordered?: boolean
  
  // 内边距
  padding?: 'none' | 'small' | 'medium' | 'large'
}
```

**Slots**
```typescript
interface CardSlots {
  // 卡片头部
  header?: () => VNode
  
  // 默认内容
  default?: () => VNode
  
  // 卡片底部
  footer?: () => VNode
}
```

---

### Modal 组件

模态框组件，用于弹出对话框。

**路径**: `src/components/common/Modal.vue`

**使用示例**
```vue
<template>
  <Button @click="showModal = true">Open Modal</Button>
  <Modal v-model:visible="showModal" title="Modal Title">
    <p>Modal content</p>
    <template #footer>
      <Button @click="showModal = false">Close</Button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Modal from '@/components/common/Modal.vue'
import Button from '@/components/common/Button.vue'

const showModal = ref(false)
</script>
```

**Props**
```typescript
interface ModalProps {
  // 是否可见
  visible?: boolean
  
  // 标题
  title?: string
  
  // 宽度
  width?: string | number
  
  // 是否可关闭
  closable?: boolean
  
  // 是否显示遮罩
  maskClosable?: boolean
  
  // 是否居中
  centered?: boolean
}
```

**Events**
```typescript
interface ModalEmits {
  (e: 'update:visible', visible: boolean): void
  (e: 'ok'): void
  (e: 'cancel'): void
}
```

---

### Loading 组件

加载状态组件，显示加载动画。

**路径**: `src/components/common/Loading.vue`

**使用示例**
```vue
<template>
  <Loading :loading="isLoading" text="Loading data...">
    <div v-if="!isLoading">
      Content loaded
    </div>
  </Loading>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Loading from '@/components/common/Loading.vue'

const isLoading = ref(true)
</script>
```

**Props**
```typescript
interface LoadingProps {
  // 是否加载中
  loading?: boolean
  
  // 加载文本
  text?: string
  
  // 加载大小
  size?: 'small' | 'medium' | 'large'
  
  // 是否全屏
  fullscreen?: boolean
}
```

---

### Empty 组件

空状态组件，用于显示无数据状态。

**路径**: `src/components/common/Empty.vue`

**使用示例**
```vue
<template>
  <Empty 
    description="No data found"
    image="/images/empty.png"
  >
    <template #action>
      <Button @click="fetchData">Retry</Button>
    </template>
  </Empty>
</template>

<script setup lang="ts">
import Empty from '@/components/common/Empty.vue'
import Button from '@/components/common/Button.vue'

const fetchData = () => {
  // 重新加载数据
}
</script>
```

**Props**
```typescript
interface EmptyProps {
  // 描述文本
  description?: string
  
  // 图片 URL
  image?: string
  
  // 图片样式
  imageStyle?: Record<string, any>
}
```

**Slots**
```typescript
interface EmptySlots {
  // 图片
  image?: () => VNode
  
  // 描述
  description?: () => VNode
  
  // 操作按钮
  action?: () => VNode
}
```

## 最佳实践

1. **使用 TypeScript 类型**
```typescript
interface Props {
  variant: 'primary' | 'secondary'
  size: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium'
})
```

2. **使用 Composition API**
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>
```

3. **组件命名**
```typescript
// 推荐
import MyButton from '@/components/common/Button.vue'

// 不推荐
import button from '@/components/common/Button.vue'
```

4. **事件命名**
```typescript
// 推荐
emit('update:modelValue', value)
emit('click', event)

// 不推荐
emit('change', value)
emit('onClick', event)
```

## 相关资源

- [Vue 3 组件](https://vuejs.org/guide/essentials/component-basics.html)
- [Vue 3 Props](https://vuejs.org/guide/components/props.html)
- [Vue 3 Events](https://vuejs.org/guide/components/events.html)
- [Vue 3 Slots](https://vuejs.org/guide/components/slots.html)