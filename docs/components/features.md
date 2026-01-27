# 功能组件文档

本文档提供了 MyPersonalWebsite 项目中所有功能性组件的使用文档。

## 概述

功能组件是提供特定功能的组件，如监控仪表板、性能仪表板、搜索组件等。

## 组件列表

### MonitoringDashboard 组件

监控仪表板组件，实时显示应用监控数据。

**路径**: `src/components/MonitoringDashboard.vue`

**使用示例**
```vue
<template>
  <MonitoringDashboard />
</template>

<script setup lang="ts">
import MonitoringDashboard from '@/components/MonitoringDashboard.vue'
</script>
```

**功能**
- 实时性能指标
- 错误追踪
- 用户行为分析
- 系统健康状态
- 资源使用情况

**Props**
```typescript
interface MonitoringDashboardProps {
  // 刷新间隔（毫秒）
  refreshInterval?: number
  
  // 是否自动刷新
  autoRefresh?: boolean
  
  // 显示的指标
  metrics?: MetricType[]
}
```

**Events**
```typescript
interface MonitoringDashboardEmits {
  // 指标更新
  (e: 'metrics-update', metrics: Metrics): void
  
  // 警告触发
  (e: 'alert', alert: Alert): void
}
```

**子组件**
- `MetricsCard` - 指标卡片
- `ErrorChart` - 错误图表
- `PerformanceChart` - 性能图表
- `HealthIndicator` - 健康指示器

---

### PerformanceDashboard 组件

性能仪表板组件，显示应用性能数据。

**路径**: `src/components/PerformanceDashboard.vue`

**使用示例**
```vue
<template>
  <PerformanceDashboard />
</template>

<script setup lang="ts">
import PerformanceDashboard from '@/components/PerformanceDashboard.vue'
</script>
```

**功能**
- Core Web Vitals
- 页面加载时间
- 资源加载性能
- 渲染性能
- 内存使用情况

**Props**
```typescript
interface PerformanceDashboardProps {
  // 时间范围
  timeRange?: 'hour' | 'day' | 'week' | 'month'
  
  // 是否显示详细信息
  showDetails?: boolean
}
```

**子组件**
- `CoreWebVitals` - 核心 Web 指标
- `PerformanceMetrics` - 性能指标
- `ResourceLoading` - 资源加载
- `RenderingPerformance` - 渲染性能

---

### SearchBar 组件

搜索栏组件，提供全局搜索功能。

**路径**: `src/components/common/SearchBar.vue`

**使用示例**
```vue
<template>
  <SearchBar 
    placeholder="Search..."
    @search="handleSearch"
  />
</template>

<script setup lang="ts">
import SearchBar from '@/components/common/SearchBar.vue'

const handleSearch = (query: string) => {
  console.log('Search:', query)
}
</script>
```

**Props**
```typescript
interface SearchBarProps {
  // 占位符文本
  placeholder?: string
  
  // 初始值
  modelValue?: string
  
  // 是否显示历史记录
  showHistory?: boolean
  
  // 搜索类型
  searchType?: 'all' | 'projects' | 'blog' | 'skills'
}
```

**Events**
```typescript
interface SearchBarEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'search', query: string): void
  (e: 'clear'): void
}
```

**特性**
- 实时搜索建议
- 搜索历史
- 键盘快捷键
- 模糊匹配

---

### ThemeToggle 组件

主题切换组件，用于切换亮暗主题。

**路径**: `src/components/common/ThemeToggle.vue`

**使用示例**
```vue
<template>
  <ThemeToggle />
</template>

<script setup lang="ts">
import ThemeToggle from '@/components/common/ThemeToggle.vue'
</script>
```

**Props**
```typescript
interface ThemeToggleProps {
  // 主题模式
  modelValue?: 'light' | 'dark' | 'auto'
}
```

**Events**
```typescript
interface ThemeToggleEmits {
  (e: 'update:modelValue', value: 'light' | 'dark' | 'auto'): void
}
```

**特性**
- 亮暗主题切换
- 自动跟随系统
- 平滑过渡动画
- 持久化存储

---

### LanguageSelector 组件

语言选择器组件，用于切换应用语言。

**路径**: `src/components/common/LanguageSelector.vue`

**使用示例**
```vue
<template>
  <LanguageSelector 
    :languages="languages"
    @change="handleLanguageChange"
  />
</template>

<script setup lang="ts">
import LanguageSelector from '@/components/common/LanguageSelector.vue'

const languages = [
  { code: 'zh-CN', name: '简体中文' },
  { code: 'en-US', name: 'English' }
]

const handleLanguageChange = (lang: string) => {
  console.log('Language changed:', lang)
}
</script>
```

**Props**
```typescript
interface LanguageSelectorProps {
  // 可用语言列表
  languages: Language[]
  
  // 当前语言
  modelValue?: string
}
```

**Events**
```typescript
interface LanguageSelectorEmits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', language: string): void
}
```

---

### BackToTop 组件

返回顶部组件，点击后滚动到页面顶部。

**路径**: `src/components/common/BackToTop.vue`

**使用示例**
```vue
<template>
  <BackToTop 
    :threshold="300"
    :smooth="true"
  />
</template>

<script setup lang="ts">
import BackToTop from '@/components/common/BackToTop.vue'
</script>
```

**Props**
```typescript
interface BackToTopProps {
  // 显示阈值（像素）
  threshold?: number
  
  // 是否平滑滚动
  smooth?: boolean
  
  // 按钮样式
  style?: Record<string, any>
}
```

**特性**
- 自动显示/隐藏
- 平滑滚动
- 自定义样式
- 键盘支持

---

### Pagination 组件

分页组件，用于分页导航。

**路径**: `src/components/common/Pagination.vue`

**使用示例**
```vue
<template>
  <Pagination 
    :current-page="currentPage"
    :total-pages="totalPages"
    @page-change="handlePageChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Pagination from '@/components/common/Pagination.vue'

const currentPage = ref(1)
const totalPages = ref(10)

const handlePageChange = (page: number) => {
  currentPage.value = page
}
</script>
```

**Props**
```typescript
interface PaginationProps {
  // 当前页码
  currentPage: number
  
  // 总页数
  totalPages: number
  
  // 每页显示的页码数
  pageSize?: number
  
  // 是否显示上一页/下一页
  showPrevNext?: boolean
  
  // 是否显示首页/末页
  showFirstLast?: boolean
}
```

**Events**
```typescript
interface PaginationEmits {
  (e: 'page-change', page: number): void
}
```

---

### Toast 组件

消息提示组件，用于显示通知消息。

**路径**: `src/components/common/Toast.vue`

**使用示例**
```vue
<template>
  <Button @click="showToast">Show Toast</Button>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

const showToast = () => {
  showToast({
    message: 'Operation successful',
    type: 'success',
    duration: 3000
  })
}
</script>
```

**Props**
```typescript
interface ToastProps {
  // 消息内容
  message: string
  
  // 消息类型
  type?: 'success' | 'error' | 'warning' | 'info'
  
  // 显示时长（毫秒）
  duration?: number
  
  // 是否可关闭
  closable?: boolean
  
  // 位置
  position?: 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}
```

**特性**
- 多种消息类型
- 自动消失
- 手动关闭
- 堆叠显示

---

### Skeleton 组件

骨架屏组件，用于加载占位。

**路径**: `src/components/common/Skeleton.vue`

**使用示例**
```vue
<template>
  <Skeleton :loading="isLoading" count="3">
    <div v-if="!isLoading">
      <!-- 实际内容 -->
    </div>
  </Skeleton>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Skeleton from '@/components/common/Skeleton.vue'

const isLoading = ref(true)
</script>
```

**Props**
```typescript
interface SkeletonProps {
  // 是否加载中
  loading?: boolean
  
  // 骨架屏数量
  count?: number
  
  // 骨架屏类型
  type?: 'text' | 'image' | 'card' | 'custom'
  
  // 自定义样式
  style?: Record<string, any>
}
```

**特性**
- 多种骨架屏类型
- 自定义样式
- 平滑过渡
- 响应式设计

## 最佳实践

1. **功能组件应该专注于单一功能**
```vue
<!-- 推荐 -->
<SearchBar @search="handleSearch" />

<!-- 不推荐 -->
<SearchAndFilterAndSortBar />
```

2. **使用 Composables 管理状态**
```typescript
import { useToast } from '@/composables/useToast'

const { showToast, hideToast } = useToast()
```

3. **提供清晰的 API**
```typescript
interface Props {
  // 必需的 props
  requiredProp: string
  
  // 可选的 props
  optionalProp?: string
  
  // 带默认值的 props
  propWithDefault: string = 'default'
}
```

4. **事件命名规范**
```typescript
// 推荐
emit('update:modelValue', value)
emit('click', event)
emit('submit', data)

// 不推荐
emit('onChange', value)
emit('onClick', event)
emit('onSubmit', data)
```

## 相关资源

- [Vue 3 组件](https://vuejs.org/guide/essentials/component-basics.html)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [VueUse](https://vueuse.org/)