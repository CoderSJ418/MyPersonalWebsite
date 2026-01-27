# Story 1.1: 博客文章列表展示

**Epic**: Epic 1: 核心功能实现  
**Story ID**: 1.1  
**状态**: Draft  
**创建日期**: 2026年1月22日  
**作者**: BMAD Scrum Master (Bob)  
**负责人**: BMAD Developer  
**优先级**: P0  
**预估工作量**: 1-2 天  
**实际工作量**: 待记录  
**开始日期**: 待定  
**完成日期**: 待定

---

## 📋 用户故事

**作为** 前端开发者，  
**我希望** 看到一个按时间倒序排列的文章列表，包含标题、摘要、发布时间、分类和标签，  
**以便** 快速浏览最新的技术文章。

---

## ✅ 验收标准

### 功能验收标准

- [ ] **SC-1**: 文章列表按发布时间倒序排列（最新文章在顶部）
- [ ] **SC-2**: 每篇文章卡片显示以下信息：
  - 文章标题
  - 文章摘要（截取前 150 字符）
  - 发布时间（格式：YYYY-MM-DD）
  - 文章分类（如：Vue3、TypeScript、工程化、设计等）
  - 文章标签（如：提示词工程、性能优化、调试技巧等）
  - 阅读时长（分钟）
- [ ] **SC-3**: 支持分页加载功能
  - 每页显示 10 篇文章
  - 显示当前页码和总页数
  - 提供"上一页"、"下一页"按钮
  - 支持点击页码直接跳转
- [ ] **SC-4**: 虚拟列表优化
  - 当文章数量 ≥50 篇时自动启用虚拟滚动
  - 只渲染可见区域的文章卡片
  - 滚动流畅，无卡顿
- [ ] **SC-5**: 响应式布局
  - 桌面端（≥1024px）：3 列网格布局
  - 平板端（768px-1023px）：2 列网格布局
  - 移动端（<768px）：1 列布局
- [ ] **SC-6**: 文章卡片交互
  - 鼠标悬停时显示悬浮效果（阴影加深、轻微上移）
  - 点击卡片跳转到文章详情页
  - 点击标签跳转到标签筛选页面
  - 点击分类跳转到分类筛选页面
- [ ] **SC-7**: 加载状态
  - 初始加载时显示骨架屏或加载动画
  - 分页切换时显示加载状态
  - 加载失败时显示错误提示

### 性能验收标准

- [ ] **PC-1**: 列表加载时间 ≤300ms（首次加载 10 篇文章）
- [ ] **PC-2**: 分页切换响应时间 ≤100ms
- [ ] **PC-3**: 虚拟列表滚动帧率 ≥60fps
- [ ] **PC-4**: 图片懒加载触发延迟 ≤50ms（如果有封面图）
- [ ] **PC-5**: 内存占用 ≤50MB（加载 100 篇文章后）

### 质量验收标准

- [ ] **QC-1**: 单元测试覆盖率 ≥80%
- [ ] **QC-2**: 所有组件通过 ESLint 检查
- [ ] **QC-3**: 所有组件通过 TypeScript 类型检查
- [ ] **QC-4**: 组件代码符合 Prettier 格式规范

### 可访问性验收标准

- [ ] **AC-1**: 文章卡片支持键盘导航（Tab 键）
- [ ] **AC-2**: 所有链接和按钮有清晰的 Focus 状态
- [ ] **AC-3**: 图片有 alt 属性（如果有封面图）
- [ ] **AC-4**: 颜色对比度符合 WCAG AA 标准（4.5:1）

---

## 📦 任务列表

### Task 1.1.1: 创建 BlogList 组件
**预估工时**: 2-3 小时  
**状态**: Pending

**Subtasks**:
- [ ] 1.1.1.1: 创建 `src/components/blog/BlogList.vue` 组件文件
- [ ] 1.1.1.2: 定义组件 Props 接口（posts, currentPage, totalPages 等）
- [ ] 1.1.1.3: 实现基础布局结构（Grid 布局）
- [ ] 1.1.1.4: 集成 BlogCard 组件（复用或新建）
- [ ] 1.1.1.5: 实现响应式布局（Tailwind CSS）
- [ ] 1.1.1.6: 添加加载状态和错误状态
- [ ] 1.1.1.7: 编写组件单元测试

**技术要点**:
- 使用 Vue 3 Composition API
- 使用 Tailwind CSS Grid 布局
- 响应式断点：`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

---

### Task 1.1.2: 创建 BlogCard 组件
**预估工时**: 2-3 小时  
**状态**: Pending

**Subtasks**:
- [ ] 1.1.2.1: 创建 `src/components/blog/BlogCard.vue` 组件文件
- [ ] 1.1.2.2: 定义组件 Props 接口（BlogPost 类型）
- [ ] 1.1.2.3: 实现卡片布局（标题、摘要、元数据、标签）
- [ ] 1.1.2.4: 实现悬浮效果（CSS hover 或 GSAP 动画）
- [ ] 1.1.2.5: 实现点击事件（跳转到详情页）
- [ ] 1.1.2.6: 实现标签和分类点击事件
- [ ] 1.1.2.7: 添加主题系统支持（CSS 变量 + 动态 Class）
- [ ] 1.1.2.8: 编写组件单元测试

**技术要点**:
- 使用 TypeScript 定义 Props 类型
- 支持主题系统（colorScheme, uiStyle）
- 使用 Lucide Vue Next 图标（如果有图标）

---

### Task 1.1.3: 实现 useBlogStore
**预估工时**: 2-3 小时  
**状态**: Pending

**Subtasks**:
- [ ] 1.1.3.1: 创建 `src/stores/useBlogStore.ts` 文件
- [ ] 1.1.3.2: 定义 BlogPost 类型接口
- [ ] 1.1.3.3: 定义 State（posts, currentPost, pagination 等）
- [ ] 1.1.3.4: 实现 loadPosts() Action（从 JSON 文件加载）
- [ ] 1.1.3.5: 实现 loadPost(id) Action（加载单篇文章）
- [ ] 1.1.3.6: 实现分页逻辑（currentPage, totalPages, itemsPerPage）
- [ ] 1.1.3.7: 实现排序逻辑（按发布时间倒序）
- [ ] 1.1.3.8: 添加 TypeScript 类型定义
- [ ] 1.1.3.9: 编写 Store 单元测试

**技术要点**:
- 使用 Pinia 2.1.7
- 使用 TypeScript 严格模式
- 数据来源：`src/assets/data/blog-index.json` 或 API

**数据结构示例**:
```typescript
interface BlogPost {
  id: string
  title: string
  summary: string
  content: string
  category: string
  tags: string[]
  publishDate: string
  readingTime: number
  codeVersion?: {
    vue?: string
    typescript?: string
    [key: string]: string | undefined
  }
}
```

---

### Task 1.1.4: 实现分页组件
**预估工时**: 1-2 小时  
**状态**: Pending

**Subtasks**:
- [ ] 1.1.4.1: 创建 `src/components/common/Pagination.vue` 组件文件
- [ ] 1.1.4.2: 定义组件 Props 接口（currentPage, totalPages, onPageChange）
- [ ] 1.1.4.3: 实现分页按钮布局（上一页、页码、下一页）
- [ ] 1.1.4.4: 实现页码点击事件
- [ ] 1.1.4.5: 实现禁用状态（第一页禁用"上一页"，最后一页禁用"下一页"）
- [ ] 1.1.4.6: 添加主题系统支持
- [ ] 1.1.4.7: 编写组件单元测试

**技术要点**:
- 使用 Vue 3 Composition API
- 支持主题系统
- 响应式设计

---

### Task 1.1.5: 实现虚拟列表优化
**预估工时**: 2-3 小时  
**状态**: Pending

**Subtasks**:
- [ ] 1.1.5.1: 安装虚拟滚动库（vue-virtual-scroller 或 vue-virtual-list）
- [ ] 1.1.5.2: 配置虚拟列表组件
- [ ] 1.1.5.3: 实现虚拟列表逻辑（只渲染可见区域）
- [ ] 1.1.5.4: 添加条件判断（≥50 篇时启用）
- [ ] 1.1.5.5: 优化滚动性能（防抖、节流）
- [ ] 1.1.5.6: 编写虚拟列表单元测试

**技术要点**:
- 使用 vue-virtual-scroller 或 vue-virtual-list
- 条件启用：`posts.length >= 50`
- 性能优化：buffer、item-size

---

### Task 1.1.6: 创建博客数据文件
**预估工时**: 1 小时  
**状态**: Pending

**Subtasks**:
- [ ] 1.1.6.1: 创建 `src/assets/data/blog-index.json` 文件
- [ ] 1.1.6.2: 准备 10-20 篇示例博客文章数据
- [ ] 1.1.6.3: 验证数据格式符合 BlogPost 接口
- [ ] 1.1.6.4: 添加更多测试数据（≥50 篇，用于测试虚拟列表）

**数据示例**:
```json
[
  {
    "id": "blog-001",
    "title": "Vue 3 Composition API 最佳实践",
    "summary": "深入探讨 Vue 3 Composition API 的使用技巧和最佳实践，包括代码组织、复用性和类型安全...",
    "content": "...",
    "category": "Vue3",
    "tags": ["Composition API", "TypeScript", "最佳实践"],
    "publishDate": "2026-01-20",
    "readingTime": 8,
    "codeVersion": {
      "vue": "3.4.15",
      "typescript": "5.3.3"
    }
  }
]
```

---

### Task 1.1.7: 创建 Blog 页面
**预估工时**: 1-2 小时  
**状态**: Pending

**Subtasks**:
- [ ] 1.1.7.1: 创建 `src/views/Blog.vue` 页面文件
- [ ] 1.1.7.2: 集成 BlogList 组件
- [ ] 1.1.7.3: 集成 Pagination 组件
- [ ] 1.1.7.4: 连接 useBlogStore
- [ ] 1.1.7.5: 实现页面标题和描述（SEO 优化）
- [ ] 1.1.7.6: 添加页面过渡动画（可选）
- [ ] 1.1.7.7: 编写页面 E2E 测试

**技术要点**:
- 使用 Vue Router 4.2.5
- SEO 优化：meta 标签、Open Graph
- 页面过渡：Vue Transition

---

### Task 1.1.8: 配置路由
**预估工时**: 0.5 小时  
**状态**: Pending

**Subtasks**:
- [ ] 1.1.8.1: 在 `src/router/index.ts` 中添加 Blog 路由
- [ ] 1.1.8.2: 配置路由元信息（title, description）
- [ ] 1.1.8.3: 测试路由跳转功能

**路由配置示例**:
```typescript
{
  path: '/blog',
  name: 'Blog',
  component: () => import('@/views/Blog.vue'),
  meta: {
    title: '技术博客 - 佘杰的前端技术分享',
    description: '分享 Vue3、TypeScript、前端工程化等技术文章'
  }
}
```

---

### Task 1.1.9: 性能优化
**预估工时**: 1-2 小时  
**状态**: Pending

**Subtasks**:
- [ ] 1.1.9.1: 实现组件懒加载（路由级懒加载）
- [ ] 1.1.9.2: 优化图片加载（WebP 格式、懒加载）
- [ ] 1.1.9.3: 优化渲染性能（使用 v-memo、key）
- [ ] 1.1.9.4: 优化数据加载（使用缓存）
- [ ] 1.1.9.5: 使用 Chrome DevTools Performance 分析性能
- [ ] 1.1.9.6: 验证性能指标达标

**性能目标**:
- 列表加载时间 ≤300ms
- 分页切换响应时间 ≤100ms
- 滚动帧率 ≥60fps

---

### Task 1.1.10: 编写测试
**预估工时**: 2-3 小时  
**状态**: Pending

**Subtasks**:
- [ ] 1.1.10.1: 编写 BlogList 组件单元测试
- [ ] 1.1.10.2: 编写 BlogCard 组件单元测试
- [ ] 1.1.10.3: 编写 Pagination 组件单元测试
- [ ] 1.1.10.4: 编写 useBlogStore 单元测试
- [ ] 1.1.10.5: 编写 Blog 页面 E2E 测试（Playwright）
- [ ] 1.1.10.6: 运行测试并验证覆盖率 ≥80%
- [ ] 1.1.10.7: 修复测试失败的问题

**测试框架**:
- 单元测试：Vitest
- E2E 测试：Playwright

---

### Task 1.1.11: 代码审查和优化
**预估工时**: 1 小时  
**状态**: Pending

**Subtasks**:
- [ ] 1.1.11.1: 运行 ESLint 检查并修复问题
- [ ] 1.1.11.2: 运行 Prettier 格式化代码
- [ ] 1.1.11.3: 运行 TypeScript 类型检查
- [ ] 1.1.11.4: 代码审查（自我审查或同行审查）
- [ ] 1.1.11.5: 优化代码质量和可读性
- [ ] 1.1.11.6: 添加必要的注释

---

## 💻 开发备注

### 技术栈版本

- **Vue**: 3.4.15
- **TypeScript**: 5.3.3
- **Pinia**: 2.1.7
- **Vue Router**: 4.2.5
- **Tailwind CSS**: 3.4.1
- **GSAP**: 3.14.2（可选，用于动画）
- **Lucide Vue Next**: 0.312.0（可选，用于图标）

### 依赖关系

- **前置依赖**: 无
- **后续依赖**: Story 1.2（博客文章详情页）、Story 1.3（博客分类与标签筛选）、Story 1.4（博客文章搜索功能）

### 关键决策

1. **数据存储**: 使用 JSON 文件存储博客数据（`src/assets/data/blog-index.json`），便于版本控制和内容管理
2. **虚拟列表**: 使用 vue-virtual-scroller 库，性能优秀，API 简洁
3. **分页逻辑**: 在 Store 中实现分页逻辑，便于复用和管理
4. **主题系统**: 所有组件支持主题系统（colorScheme, uiStyle），使用 CSS 变量和动态 Class

### 性能优化策略

1. **代码分割**: 路由级懒加载，减少首屏加载大小
2. **虚拟列表**: ≥50 篇时启用虚拟滚动，只渲染可见区域
3. **图片优化**: 使用 WebP 格式，懒加载
4. **缓存优化**: 使用浏览器缓存，减少重复加载
5. **渲染优化**: 使用 v-memo、key 优化渲染性能

### 测试策略

1. **单元测试**: 覆盖所有组件和 Store，覆盖率 ≥80%
2. **E2E 测试**: 测试关键流程（列表加载、分页切换、点击跳转）
3. **性能测试**: 使用 Lighthouse 验证性能指标

### 可访问性

1. **键盘导航**: 所有交互元素支持键盘操作
2. **Focus 状态**: 清晰的 Focus 样式
3. **ARIA 标签**: 语义化 HTML，必要的 ARIA 标签
4. **颜色对比度**: 符合 WCAG AA 标准

### 潜在风险

| 风险 | 影响 | 概率 | 缓解措施 |
|------|------|------|---------|
| 虚拟列表兼容性问题 | 中 | 低 | 提前测试，准备降级方案 |
| 性能指标不达标 | 高 | 中 | 早期性能基准测试，持续优化 |
| 测试覆盖率不足 | 中 | 中 | 编写完整测试用例，定期检查 |
| 主题系统兼容性 | 低 | 低 | 提前设计主题系统架构 |

### 参考资料

- [Vue 3 官方文档](https://vuejs.org/)
- [Pinia 官方文档](https://pinia.vuejs.org/)
- [vue-virtual-scroller 文档](https://github.com/Akryum/vue-virtual-scroller)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [Web Vitals](https://web.dev/vitals/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 📊 进度跟踪

### 总体进度

| 任务 | 状态 | 完成度 |
|------|------|--------|
| Task 1.1.1: 创建 BlogList 组件 | Pending | 0% |
| Task 1.1.2: 创建 BlogCard 组件 | Pending | 0% |
| Task 1.1.3: 实现 useBlogStore | Pending | 0% |
| Task 1.1.4: 实现分页组件 | Pending | 0% |
| Task 1.1.5: 实现虚拟列表优化 | Pending | 0% |
| Task 1.1.6: 创建博客数据文件 | Pending | 0% |
| Task 1.1.7: 创建 Blog 页面 | Pending | 0% |
| Task 1.1.8: 配置路由 | Pending | 0% |
| Task 1.1.9: 性能优化 | Pending | 0% |
| Task 1.1.10: 编写测试 | Pending | 0% |
| Task 1.1.11: 代码审查和优化 | Pending | 0% |
| **总体** | **In Progress** | **0%** |

### 验收标准完成情况

| 类别 | 总数 | 已完成 | 完成率 |
|------|------|--------|--------|
| 功能验收标准 | 7 | 0 | 0% |
| 性能验收标准 | 5 | 0 | 0% |
| 质量验收标准 | 4 | 0 | 0% |
| 可访问性验收标准 | 4 | 0 | 0% |
| **总计** | **20** | **0** | **0%** |

---

## 📝 变更记录

| 版本 | 日期 | 变更内容 | 变更人 |
|------|------|----------|--------|
| v1.0.0 | 2026-01-22 | 初始版本 | Bob (BMAD Scrum Master) |

---

## 📎 相关文档

- [PRD.md](../PRD.md) - 产品需求文档
- [Epics.md](../Epics.md) - Epic 列表
- [solution-architecture.md](../solution-architecture.md) - 解决方案架构文档
- [ui-design-system.md](../ui-design-system.md) - UI 设计系统规范
- [BMAD 开发方法论](../../../bmad/docs/iflow-instructions.md) - BMAD 方法论说明

---

**Story 文档结束**

**下一步**: 运行 story-context 工作流，为 Story 1.1 生成上下文信息

**当前状态**: Story 文档已创建，等待开发开始