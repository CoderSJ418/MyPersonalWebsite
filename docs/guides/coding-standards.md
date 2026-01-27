# 代码规范

本文档定义了 MyPersonalWebsite 项目的代码规范和最佳实践。

## 目录

- [TypeScript 规范](#typescript-规范)
- [Vue 规范](#vue-规范)
- [CSS/Tailwind 规范](#csstailwind-规范)
- [Git 规范](#git-规范)
- [命名规范](#命名规范)
- [注释规范](#注释规范)
- [性能规范](#性能规范)

## TypeScript 规范

### 类型定义

**使用 `interface` 定义对象类型**

```typescript
// ✅ 推荐
interface User {
  id: string
  name: string
  email: string
}

// ❌ 不推荐
type User = {
  id: string
  name: string
  email: string
}
```

**使用 `type` 定义联合类型**

```typescript
// ✅ 推荐
type Status = 'pending' | 'active' | 'inactive'
type ID = string | number

// ❌ 不推荐
interface Status {
  pending: string
  active: string
  inactive: string
}
```

### 函数定义

**显式声明返回类型**

```typescript
// ✅ 推荐
function add(a: number, b: number): number {
  return a + b
}

// ❌ 不推荐
function add(a: number, b: number) {
  return a + b
}
```

**使用箭头函数**

```typescript
// ✅ 推荐
const multiply = (a: number, b: number): number => {
  return a * b
}

// ❌ 不推荐
function multiply(a: number, b: number): number {
  return a * b
}
```

### 泛型

**使用有意义的泛型名称**

```typescript
// ✅ 推荐
function first<T>(array: T[]): T | undefined {
  return array[0]
}

// ❌ 不推荐
function first<T>(arr: T[]): T | undefined {
  return arr[0]
}
```

### 避免使用 `any`

```typescript
// ✅ 推荐
function process(data: unknown) {
  if (typeof data === 'string') {
    console.log(data.toUpperCase())
  }
}

// ❌ 不推荐
function process(data: any) {
  console.log(data.toUpperCase())
}
```

## Vue 规范

### 组件定义

**使用 `<script setup>` 语法**

```vue
<!-- ✅ 推荐 -->
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<!-- ❌ 不推荐 -->
<script lang="ts">
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return { count }
  }
}
</script>
```

### Props 定义

**使用 TypeScript 接口定义 Props**

```vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})
</script>
```

### Emits 定义

**使用 `defineEmits` 定义事件**

```vue
<script setup lang="ts">
interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'submit', data: FormData): void
}

const emit = defineEmits<Emits>()
</script>
```

### 组件命名

**使用 PascalCase 命名组件**

```typescript
// ✅ 推荐
import UserProfile from '@/components/UserProfile.vue'
import ButtonSubmit from '@/components/ButtonSubmit.vue'

// ❌ 不推荐
import userProfile from '@/components/UserProfile.vue'
import button_submit from '@/components/ButtonSubmit.vue'
```

### 模板

**使用 kebab-case 绑定事件**

```vue
<!-- ✅ 推荐 -->
<template>
  <button @click="handleClick">Click</button>
</template>

<!-- ❌ 不推荐 -->
<template>
  <button v-on:click="handleClick">Click</button>
</template>
```

**使用 `v-model` 进行双向绑定**

```vue
<!-- ✅ 推荐 -->
<template>
  <input v-model="username" />
</template>

<!-- ❌ 不推荐 -->
<template>
  <input :value="username" @input="username = $event.target.value" />
</template>
```

## CSS/Tailwind 规范

### Tailwind 类名

**优先使用 Tailwind 类名**

```vue
<!-- ✅ 推荐 -->
<template>
  <div class="flex items-center justify-between p-4 bg-white rounded-lg shadow">
    <h1 class="text-xl font-bold text-gray-900">Title</h1>
  </div>
</template>

<!-- ❌ 不推荐 -->
<template>
  <div class="container">
    <h1 class="title">Title</h1>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}
</style>
```

### 响应式设计

**使用移动优先策略**

```vue
<!-- ✅ 推荐 -->
<template>
  <div class="p-4 md:p-8 lg:p-12">
    Content
  </div>
</template>

<!-- ❌ 不推荐 -->
<template>
  <div class="p-12 lg:p-8 md:p-4">
    Content
  </div>
</template>
```

### 避免内联样式

```vue
<!-- ✅ 推荐 -->
<template>
  <div class="bg-blue-500 text-white p-4">
    Content
  </div>
</template>

<!-- ❌ 不推荐 -->
<template>
  <div style="background-color: #3b82f6; color: white; padding: 1rem;">
    Content
  </div>
</template>
```

## Git 规范

### Commit 信息

使用 Conventional Commits 规范：

```bash
# 格式
<type>(<scope>): <subject>

<body>

<footer>
```

**类型（type）**

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具相关
- `perf`: 性能优化
- `ci`: CI/CD 相关

**示例**

```bash
# 新功能
git commit -m "feat(user): add user authentication"

# Bug 修复
git commit -m "fix(navigation): resolve mobile menu issue"

# 文档更新
git commit -m "docs(readme): update installation instructions"

# 重构
git commit -m "refactor(components): simplify button component"

# 测试
git commit -m "test(utils): add unit tests for logger"
```

### 分支命名

```bash
# 功能分支
feature/user-authentication

# Bug 修复分支
fix/navigation-mobile-issue

# 文档分支
docs/api-documentation

# 重构分支
refactor-component-structure
```

## 命名规范

### 文件命名

**组件文件使用 PascalCase**

```
✅ UserProfile.vue
✅ ButtonSubmit.vue
❌ userProfile.vue
❌ button-submit.vue
```

**工具文件使用 camelCase**

```
✅ logger.ts
✅ performanceMonitor.ts
❌ Logger.ts
❌ performance-monitor.ts
```

**类型文件使用 kebab-case**

```
✅ user-types.ts
✅ api-types.ts
❌ userTypes.ts
❌ api_types.ts
```

### 变量命名

**使用 camelCase**

```typescript
// ✅ 推荐
const userName = 'John'
const isLoggedIn = true
const getUserById = (id: string) => {}

// ❌ 不推荐
const user_name = 'John'
const is_logged_in = true
const get_user_by_id = (id: string) => {}
```

### 常量命名

**使用 UPPER_SNAKE_CASE**

```typescript
// ✅ 推荐
const API_BASE_URL = 'https://api.example.com'
const MAX_RETRY_COUNT = 3

// ❌ 不推荐
const apiBaseUrl = 'https://api.example.com'
const max_retry_count = 3
```

### 类命名

**使用 PascalCase**

```typescript
// ✅ 推荐
class UserService {}
class HttpClient {}

// ❌ 不推荐
class userService {}
class http_client {}
```

## 注释规范

### JSDoc 注释

**为函数添加 JSDoc 注释**

```typescript
/**
 * 计算两个数的和
 * @param a - 第一个数
 * @param b - 第二个数
 * @returns 两个数的和
 */
function add(a: number, b: number): number {
  return a + b
}
```

**为接口添加注释**

```typescript
/**
 * 用户信息接口
 */
interface User {
  /** 用户 ID */
  id: string
  
  /** 用户名 */
  name: string
  
  /** 用户邮箱 */
  email: string
}
```

### 单行注释

**使用 `//` 进行单行注释**

```typescript
// 初始化计数器
const count = 0

// 检查用户权限
if (hasPermission) {
  // 执行操作
}
```

### 多行注释

**使用 `/* */` 进行多行注释**

```typescript
/*
 * 这是一个多行注释
 * 用于解释复杂的逻辑
 */
function complexFunction() {
  // ...
}
```

## 性能规范

### 组件懒加载

**使用动态导入进行组件懒加载**

```typescript
// ✅ 推荐
const ProjectDetail = defineAsyncComponent(
  () => import('@/views/ProjectDetail.vue')
)

// ❌ 不推荐
import ProjectDetail from '@/views/ProjectDetail.vue'
```

### 计算属性

**使用计算属性缓存复杂计算**

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'

const items = ref([])

// ✅ 推荐
const filteredItems = computed(() => {
  return items.value.filter(item => item.active)
})

// ❌ 不推荐
const filteredItems = items.value.filter(item => item.active)
</script>
```

### 事件监听器

**在组件卸载时移除事件监听器**

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const handleResize = () => {
  // ...
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
```

## 工具配置

### ESLint

项目使用 ESLint 进行代码检查，配置文件：`.eslintrc.cjs`

```bash
# 运行 ESLint
npm run lint

# 自动修复
npm run lint -- --fix
```

### Prettier

项目使用 Prettier 进行代码格式化，配置文件：`.prettierrc.json`

```bash
# 运行 Prettier
npm run format
```

### TypeScript

项目使用 TypeScript 进行类型检查，配置文件：`tsconfig.json`

```bash
# 运行类型检查
npm run type-check
```

## 相关资源

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [Vue 3 风格指南](https://vuejs.org/style-guide/)
- [Tailwind CSS 最佳实践](https://tailwindcss.com/docs/configuration)
- [Conventional Commits](https://www.conventionalcommits.org/)