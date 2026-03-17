# MyPersonalWebsite - AI 项目理解指南

> **最后更新**: 2026年2月5日
> **用途**: 专为大语言模型设计，帮助快速理解项目结构和开发规范

---

## 📋 项目概述

**项目名称**: 佘杰的个人网站
**开发者**: 佘杰 - 前端开发工程师
**技术栈**: Vue 3 + TypeScript + Vite + Tailwind CSS

**核心功能**:
- 🏠 首页展示
- 👤 个人介绍（关于我）
- 💼 项目展示
- 📝 技术博客
- 🛠 技能展示
- 📞 联系方式

**页面路由**:
- `/` - 首页
- `/about` - 关于我
- `/projects` - 项目列表
- `/projects/:id` - 项目详情
- `/blog` - 博客列表
- `/blog/:id` - 博客详情
- `/skills` - 技能展示
- `/contact` - 联系方式

---

## 🏗️ 项目结构

```
MyPersonalWebsite/
├── src/                      # 源代码目录（核心）
│   ├── views/               # 页面组件（12个）
│   │   ├── Home.vue         # 首页
│   │   ├── About.vue        # 关于我
│   │   ├── Projects.vue     # 项目列表
│   │   ├── ProjectDetail.vue # 项目详情
│   │   ├── Blog.vue         # 博客列表
│   │   ├── BlogDetail.vue   # 博客详情
│   │   ├── Skills.vue       # 技能展示
│   │   ├── Contact.vue      # 联系方式
│   │   └── ...
│   ├── components/          # 公共组件
│   │   ├── atoms/          # 原子组件（按钮、输入框等基础UI）
│   │   ├── molecules/      # 分子组件（组合原子组件）
│   │   ├── organisms/      # 有机体组件（完整功能组件）
│   │   ├── templates/      # 模板组件（页面布局）
│   │   ├── ui/             # UI组件库
│   │   └── [功能目录]/      # 按功能分类的组件
│   ├── stores/             # Pinia 状态管理
│   │   ├── useAppStore.ts        # 应用状态（菜单、主题等）
│   │   ├── useProjectStore.ts    # 项目数据
│   │   ├── useBlogStore.ts       # 博客数据
│   │   ├── useSkillStore.ts      # 技能数据
│   │   ├── useThemeStore.ts      # 主题切换
│   │   └── ...
│   ├── router/             # Vue Router 配置
│   ├── api/                # API 接口
│   ├── utils/              # 工具函数
│   ├── types/              # TypeScript 类型定义
│   ├── styles/             # 全局样式
│   ├── assets/             # 静态资源
│   ├── App.vue             # 根组件
│   └── main.ts             # 入口文件
├── public/                 # 静态资源
│   ├── images/            # 图片
│   └── ...
├── package.json            # 项目依赖
├── vite.config.ts          # Vite 配置
├── tailwind.config.js      # Tailwind 配置
├── tsconfig.json           # TypeScript 配置
└── index.html              # HTML 入口
```

---

## 🎯 核心技术说明

### 1. 状态管理

使用 **Pinia** 进行状态管理，关键 Store：

```typescript
// 应用状态（菜单、主题等）
import { useAppStore } from '@/stores/useAppStore'

// 项目数据
import { useProjectStore } from '@/stores/useProjectStore'

// 博客数据
import { useBlogStore } from '@/stores/useBlogStore'

// 技能数据
import { useSkillStore } from '@/stores/useSkillStore'

// 主题切换
import { useThemeStore } from '@/stores/useThemeStore'
```

### 2. 路由配置

使用 **Vue Router 4**，路由定义在 `src/router/index.ts`

```typescript
// 路由示例
{
  path: '/projects/:id',
  name: 'ProjectDetail',
  component: () => import('@/views/ProjectDetail.vue'),
  props: true  // 启用 props 传递路由参数
}
```

### 3. 样式系统

使用 **Tailwind CSS** 原子化 CSS + 自定义设计系统：

```vue
<template>
  <div class="container mx-auto px-4 py-8">
    <!-- 使用 Tailwind 类名 -->
  </div>
</template>
```

### 4. 组件组织

采用 **原子设计** 方法论：

- **Atoms**: 最基础的 UI 组件（按钮、输入框、图标）
- **Molecules**: 组合原子组件（搜索框、卡片头部）
- **Organisms**: 完整功能组件（导航栏、侧边栏）
- **Templates**: 页面布局模板

### 5. 类型定义

TypeScript 类型定义在 `src/types/` 目录：

```typescript
// 示例：项目类型
interface Project {
  id: string
  title: string
  description: string
  techStack: string[]
  imageUrl: string
  githubUrl?: string
  demoUrl?: string
}
```

---

## 📝 开发规范

### 1. 组件命名

- **文件名**: PascalCase（如 `ProjectCard.vue`）
- **组件名**: PascalCase（如 `export default { name: 'ProjectCard' }`）
- **目录名**: kebab-case（如 `project-card/`）

### 2. 代码风格

- 使用 **TypeScript** 编写所有新代码
- 使用 **Composition API**（`<script setup>` 语法糖）
- 使用 **ESLint + Prettier** 进行代码检查和格式化

### 3. 导入顺序

```typescript
// 1. Vue 相关
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 2. 第三方库
import { gsap } from 'gsap'

// 3. 内部模块
import { useAppStore } from '@/stores/useAppStore'
import { ProjectCard } from '@/components/projects'
```

### 4. 组件通信

```vue
<script setup lang="ts">
// Props 定义
interface Props {
  title: string
  items: Project[]
}
const props = withDefaults(defineProps<Props>(), {
  items: () => []
})

// Emits 定义
const emit = defineEmits<{
  (e: 'click', id: string): void
  (e: 'change', value: string): void
}>()
</script>
```

---

## 🚀 常用命令

### 开发

```bash
npm run dev              # 启动开发服务器（端口 5173）
npm run build            # 构建生产版本
npm run preview          # 预览生产构建
```

### 代码质量

```bash
npm run lint             # ESLint 检查（自动修复）
npm run format           # Prettier 格式化
```

### 测试（如果需要）

```bash
npm run test             # 运行测试
npm run test:coverage    # 测试覆盖率
```

---

## 🔑 关键文件位置

| 功能 | 文件路径 |
|------|---------|
| 路由配置 | `src/router/index.ts` |
| 应用状态 | `src/stores/useAppStore.ts` |
| 项目数据 | `src/stores/useProjectStore.ts` |
| 博客数据 | `src/stores/useBlogStore.ts` |
| 技能数据 | `src/stores/useSkillStore.ts` |
| 主题切换 | `src/stores/useThemeStore.ts` |
| 全局样式 | `src/styles/` |
| 类型定义 | `src/types/` |
| 工具函数 | `src/utils/` |

---

## 🎨 UI 组件说明

### 常用组件

```typescript
// 原子组件
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Icon } from '@/components/ui/Icon'

// 功能组件
import { ProjectCard } from '@/components/projects'
import { BlogCard } from '@/components/blog'
import { SkillTag } from '@/components/skills'
```

### 设计系统

项目使用自定义设计系统，定义在：
- 颜色变量: `tailwind.config.js`
- 组件样式: `src/components/`

---

## ⚠️ 重要注意事项

1. **不要删除** `src/views/` 中的页面组件
2. **不要修改** `src/router/index.ts` 中的核心路由
3. **不要破坏** Pinia Store 的数据结构
4. **新增组件** 遵循原子设计原则
5. **修改样式** 优先使用 Tailwind 类名

---

## 📦 依赖说明

### 核心依赖

- `vue@3.4.15` - Vue 3 框架
- `vue-router@4.2.5` - 路由管理
- `pinia@2.1.7` - 状态管理
- `typescript@5.3.3` - TypeScript
- `vite@5.0.12` - 构建工具
- `tailwindcss@3.4.1` - CSS 框架
- `gsap@3.14.2` - 动画库
- `lucide-vue-next@0.312.0` - 图标库
- `axios@1.13.3` - HTTP 客户端
- `markdown-it@14.1.0` - Markdown 解析

---

## 🔍 快速查找代码

### 找页面
- 页面组件在 `src/views/` 目录

### 找组件
- UI 组件在 `src/components/ui/`
- 功能组件在 `src/components/[功能名]/`

### 找数据
- 状态数据在 `src/stores/`
- API 接口在 `src/api/`

### 找样式
- 全局样式在 `src/styles/`
- 组件样式在各自组件文件内

---

## 💡 开发提示

1. **新增页面**:
   - 在 `src/views/` 创建组件
   - 在 `src/router/index.ts` 添加路由
   - 在导航组件添加链接

2. **新增组件**:
   - 选择合适的层级
   - 使用 TypeScript 类型
   - 添加 Props 和 Emits

3. **修改数据**:
   - 修改对应 Store
   - 更新类型定义
   - 确保数据流清晰

4. **添加样式**:
   - 优先使用 Tailwind 类名
   - 复杂样式使用 `:style` 或 `class` 绑定
   - 保持样式一致性

---

## 📊 项目数据来源

### 项目数据
定义在 `src/stores/useProjectStore.ts`，包含项目列表信息

### 博客数据
定义在 `src/stores/useBlogStore.ts`，包含博客文章列表

### 技能数据
定义在 `src/stores/useSkillStore.ts`，包含技能分类和熟练度

### 个人信息
定义在 `src/stores/useAppStore.ts` 或 `src/views/About.vue`

---

## 🎯 开发目标

当 AI 协助开发时，确保：

1. ✅ 代码风格一致
2. ✅ TypeScript 类型完整
3. ✅ 组件复用性高
4. ✅ 性能优化良好
5. ✅ 响应式设计适配
6. ✅ 可访问性支持

---

**AI 提示**: 在修改代码前，先阅读相关文件，理解现有结构，然后遵循本指南进行开发。如果不确定，优先使用现有的组件和模式。