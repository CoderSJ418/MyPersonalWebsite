---
globs: *
alwaysApply: true
---

# 项目约束规则

## 项目概览

- **类型**: 个人作品集/博客网站（纯前端 SPA）
- **技术栈**: Vue 3 + TypeScript 5 + Vite 5 + Pinia + Vue Router 4 + Tailwind CSS 3 + GSAP 3
- **语言**: 中文（zh-CN），界面文案和注释均使用中文
- **规模**: ~120 源文件，11 页面视图，18 通用组件，16 composables，11 Pinia Store

## L0 硬约束（违反即报错，不可跳过）

### 1. 类型安全
- **禁止 `any` 类型**：ESLint 已配置 `@typescript-eslint/no-explicit-any: error`
- **禁止 `as` 类型断言**：使用类型守卫代替
- **禁止 `@ts-ignore` / `@ts-expect-error`**：必须修复根本原因
- **禁止非空断言 `!`**：使用可选链 `?.` 或空值合并 `??`
- **Props/Emits 必须使用 interface 定义**：禁止 inline 类型或数组形式

### 2. 组件规范
- **单文件组件 < 200 行**：超过必须拆分为子组件，每个子组件职责单一
- **禁止 `querySelector` / `addEventListener`**：使用 Vue 声明式 API（ref / @click 事件委托）
- **组件顺序**：template → script setup lang="ts" → style scoped
- **异步操作必须清理**：onUnmounted 中取消定时器/事件监听/异步回调

### 3. 最小变更原则
- **每次替换 < 50 行**：超过必须拆分为多步操作
- **禁止整文件重写**：除非文件 < 30 行
- **禁止"顺手"修改**：未在任务中声明的代码不可触碰

### 4. 修改后必须验证
- **必须运行**：`npx tsc --noEmit && npm run lint`
- **类型检查或 lint 失败**：立即回退修改，不可继续下一任务

### 5. 引用前必须确认存在
- **函数/组件/类型**：引用前通过 grep_search 或 read_file 确认真实存在
- **import 路径**：写入前验证文件存在
- **不确定时必须询问用户**：使用 task_ask_question

## L1 软约束（优先遵循，记录技术债可豁免）

### 6. 样式优先级
- **优先使用 Tailwind 类名**：CSS 变量仅用于设计系统 tokens（`design-system/tokens/`）
- **组件样式使用 style scoped**：避免全局污染
- **:deep() 超过 10 个时**：抽取为 `styles/` 下独立 SCSS 模块

### 7. 逻辑复用
- **超过 2 个组件使用的逻辑**：必须提取为 composable（`composables/use{Feature}.ts`）
- **超过 3 处使用的常量**：必须提取为常量文件
- **通用工具函数**：统一放 `utils/`（如 formatDate → `utils/format.ts`）

### 8. 目录归属
- 组件 → `components/{domain}/`
- 逻辑 → `composables/use{Feature}.ts`
- 工具 → `utils/{category}.ts`
- 类型 → `types/{domain}.ts`
- Store → `stores/use{Domain}Store.ts`

## 代码风格

| 规则            | 值                          |
| --------------- | --------------------------- |
| 分号            | 不使用（semi: false）       |
| 引号            | 单引号（singleQuote: true） |
| 缩进            | 2 空格                      |
| 行宽            | 最大 100 字符               |
| 尾逗号          | 不使用                      |
| 换行符          | LF                          |
| Vue 组件命名    | PascalCase                  |
| Composable 命名 | use 前缀 + camelCase        |
| Store 命名      | use 前缀 + Store 后缀       |

## 导入顺序（强制）

1. Vue 核心库（vue, vue-router, pinia）
2. 第三方库（lodash, gsap, lucide-vue-next）
3. @/ 别名导入（按目录：api → components → composables → stores → types → utils）
4. 相对路径导入（./, ../）
5. 样式导入

每组之间空一行。

## 关键架构模式

- **状态管理**: Pinia Composition API 风格，`defineStore('name', () => {...})`
- **路由**: createWebHistory + 懒加载 + NProgress + PageTransition
- **数据**: JSON 静态数据 + Markdown 博客 + dompurify 消毒
- **设计系统**: 单一亮色 + `#2563EB` 主色 + Tailwind/设计 Token 语义化颜色；禁止新增 dark mode 分支
- **动画**: GSAP + ScrollTrigger + Tailwind 自定义动画
- **博客渲染**: markdown-it + highlight.js（异步）+ dompurify

## 验证命令

```bash
# 类型检查（修改后必须运行）
npx tsc --noEmit

# lint 检查（修改后必须运行）
npm run lint

# 格式化
npm run format

# 测试
npm run test:run

# 构建验证
npm run build
```

## 常用命令

- `npm run dev` — 开发服务器（端口 5173）
- `npm run build` — 生产构建 + sitemap
- `npm run lint` — ESLint 检查并自动修复
- `npm run format` — Prettier 格式化
- `npm run test:run` — 单次测试
- `npm run analyze` — 打包体积分析
