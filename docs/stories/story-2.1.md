# Story 2.1: 作品展示列表页

**Epic**: Epic 2: 作品集模块
**Story ID**: 2.1
**状态**: ContextReadyDraft
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

**作为** 访客/潜在雇主，
**我希望** 浏览项目作品集，查看作品封面、标题、技术栈、简短描述，并支持按技术栈筛选，
**以便** 了解我的技术能力和项目经验。

---

## ✅ 验收标准

### 功能验收标准

- [ ] **SC-1**: 作品列表展示
  - 以卡片形式展示作品
  - 每个作品卡片包含：封面图、标题、技术栈标签、简短描述
  - 响应式布局：桌面端 3 列，平板端 2 列，移动端 1 列
  - 卡片间距：16px（桌面端），12px（移动端）
  - 卡片圆角：8px
  - 卡片阴影：hover 时增强阴影效果

- [ ] **SC-2**: 作品封面图
  - 显示作品封面图（占位图或实际图片）
  - 封面图尺寸：16:9 比例
  - 封面图自适应（最大宽度 100%）
  - 封面图加载失败时显示占位图
  - 封面图懒加载（Intersection Observer API）

- [ ] **SC-3**: 作品标题
  - 显示作品标题（H3 标签）
  - 标题字体大小：18px（桌面端），16px（移动端）
  - 标题最多显示 2 行，超出显示省略号
  - 标题颜色符合主题系统

- [ ] **SC-4**: 技术栈标签
  - 显示作品使用的技术栈标签
  - 标签包含技术名称和版本号（如：Vue 3.4+、TypeScript 5.3+）
  - 标签样式：圆角 4px，背景色符合主题系统
  - 标签最多显示 5 个，超出显示 "+N"
  - 标签支持点击筛选（可选）

- [ ] **SC-5**: 作品描述
  - 显示作品简短描述
  - 描述最多显示 3 行，超出显示省略号
  - 描述字体大小：14px
  - 描述颜色符合主题系统

- [ ] **SC-6**: 技术栈筛选
  - 提供技术栈筛选下拉菜单或标签云
  - 支持多选筛选
  - 筛选后作品列表实时更新
  - 筛选结果数量提示（如："显示 3 个作品"）
  - 支持清除筛选条件

- [ ] **SC-7**: 作品卡片交互
  - 卡片 hover 时显示"查看详情"按钮
  - 点击卡片跳转到作品详情页
  - 卡片过渡动画（0.3s ease-in-out）
  - 卡片点击反馈（轻微缩放效果）

- [ ] **SC-8**: 空状态
  - 无作品时显示空状态提示
  - 空状态包含图标和提示文字
  - 空状态样式符合主题系统

- [ ] **SC-9**: 加载状态
  - 初始加载时显示骨架屏或加载动画
  - 加载失败时显示错误提示
  - 支持重新加载

- [ ] **SC-10**: 分页或无限滚动
  - 支持分页加载（每页 6 个作品）
  - 或支持无限滚动（Intersection Observer API）
  - 分页器样式符合主题系统

### 性能验收标准

- [ ] **PC-1**: 作品列表页加载时间 ≤500ms（首次加载）
- [ ] **PC-2**: 作品卡片渲染时间 ≤100ms（每个卡片）
- [ ] **PC-3**: 筛选响应时间 ≤200ms
- [ ] **PC-4**: 图片懒加载触发延迟 ≤50ms
- [ ] **PC-5**: 页面滚动流畅（帧率 ≥60fps）
- [ ] **PC-6**: 内存占用 ≤30MB（加载完成后）

### 质量验收标准

- [ ] **QC-1**: 单元测试覆盖率 ≥80%
- [ ] **QC-2**: 所有组件通过 ESLint 检查
- [ ] **QC-3**: 所有组件通过 TypeScript 类型检查
- [ ] **QC-4**: 组件代码符合 Prettier 格式规范
- [ ] **QC-5**: 作品卡片渲染正确性测试通过
- [ ] **QC-6**: 筛选功能测试通过

### 可访问性验收标准

- [ ] **AC-1**: 作品卡片支持键盘导航（Tab 键）
- [ ] **AC-2**: 所有链接和按钮有清晰的 Focus 状态
- [ ] **AC-3**: 图片有 alt 属性
- [ ] **AC-4**: 作品卡片有适当的 ARIA 标签
- [ ] **AC-5**: 颜色对比度符合 WCAG AA 标准（4.5:1）
- [ ] **AC-6**: 筛选器支持键盘操作

---

## 📦 任务列表

### Task 2.1.1: 创建 Project 数据结构
**预估工时**: 1 小时
**状态**: Pending

**Subtasks**:
- [ ] 2.1.1.1: 创建 `src/types/project.ts` 类型定义文件
- [ ] 2.1.1.2: 定义 Project 接口
- [ ] 2.1.1.3: 定义 TechStack 接口
- [ ] 2.1.1.4: 创建作品数据文件 `src/assets/data/projects.json`
- [ ] 2.1.1.5: 添加示例作品数据（至少 6 个）

**技术要点**:
- TypeScript 类型定义
- 数据结构设计

**数据结构示例**:
```typescript
// src/types/project.ts
export interface TechStack {
  name: string
  version: string
  icon?: string
}

export interface Project {
  id: string
  title: string
  description: string
  coverImage: string
  techStack: TechStack[]
  category: string
  featured: boolean
  demoUrl?: string
  githubUrl?: string
  createdAt: string
  updatedAt: string
}
```

---

### Task 2.1.2: 创建 useProjectStore
**预估工时**: 1-2 小时
**状态**: Pending

**Subtasks**:
- [ ] 2.1.2.1: 创建 `src/stores/useProjectStore.ts` 文件
- [ ] 2.1.2.2: 定义 State（projects, loading, error, selectedTechStacks）
- [ ] 2.1.2.3: 实现 Getters（filteredProjects, allTechStacks, featuredProjects）
- [ ] 2.1.2.4: 实现 Actions（loadProjects, filterByTechStack, clearFilters）
- [ ] 2.1.2.5: 添加 TypeScript 类型定义
- [ ] 2.1.2.6: 编写 Store 单元测试

**技术要点**:
- 使用 Pinia 2.1.7
- 状态管理
- 筛选逻辑

---

### Task 2.1.3: 创建 ProjectCard 组件
**预估工时**: 2-3 小时
**状态**: Pending

**Subtasks**:
- [ ] 2.1.3.1: 创建 `src/components/portfolio/ProjectCard.vue` 组件文件
- [ ] 2.1.3.2: 定义组件 Props 接口（Project 类型）
- [ ] 2.1.3.3: 实现作品封面图显示
- [ ] 2.1.3.4: 实现作品标题显示
- [ ] 2.1.3.5: 实现技术栈标签显示
- [ ] 2.1.3.6: 实现作品描述显示
- [ ] 2.1.3.7: 实现卡片 hover 效果
- [ ] 2.1.3.8: 实现点击跳转功能
- [ ] 2.1.3.9: 添加主题系统支持
- [ ] 2.1.3.10: 编写组件单元测试

**技术要点**:
- 使用 Vue 3 Composition API
- 使用 Tailwind CSS 布局
- 响应式设计
- 主题系统支持

---

### Task 2.1.4: 创建 ProjectList 组件
**预估工时**: 2-3 小时
**状态**: Pending

**Subtasks**:
- [ ] 2.1.4.1: 创建 `src/components/portfolio/ProjectList.vue` 组件文件
- [ ] 2.1.4.2: 实现作品卡片网格布局
- [ ] 2.1.4.3: 实现响应式布局（桌面端 3 列，平板端 2 列，移动端 1 列）
- [ ] 2.1.4.4: 实现加载状态显示
- [ ] 2.1.4.5: 实现空状态显示
- [ ] 2.1.4.6: 实现分页或无限滚动
- [ ] 2.1.4.7: 添加主题系统支持
- [ ] 2.1.4.8: 编写组件单元测试

**技术要点**:
- 使用 CSS Grid 布局
- 响应式设计
- 虚拟滚动（可选）
- 主题系统支持

---

### Task 2.1.5: 创建 TechStackFilter 组件
**预估工时**: 1-2 小时
**状态**: Pending

**Subtasks**:
- [ ] 2.1.5.1: 创建 `src/components/portfolio/TechStackFilter.vue` 组件文件
- [ ] 2.1.5.2: 实现技术栈标签云显示
- [ ] 2.1.5.3: 实现多选筛选功能
- [ ] 2.1.5.4: 实现清除筛选功能
- [ ] 2.1.5.5: 实现筛选结果数量提示
- [ ] 2.1.5.6: 添加主题系统支持
- [ ] 2.1.5.7: 编写组件单元测试

**技术要点**:
- 多选逻辑
- 筛选结果更新
- 响应式设计
- 主题系统支持

---

### Task 2.1.6: 创建 Portfolio 页面
**预估工时**: 1-2 小时
**状态**: Pending

**Subtasks**:
- [ ] 2.1.6.1: 创建 `src/views/Portfolio.vue` 页面文件
- [ ] 2.1.6.2: 集成 TechStackFilter 组件
- [ ] 2.1.6.3: 集成 ProjectList 组件
- [ ] 2.1.6.4: 连接 useProjectStore
- [ ] 2.1.6.5: 实现页面标题和描述（SEO 优化）
- [ ] 2.1.6.6: 添加页面过渡动画（可选）
- [ ] 2.1.6.7: 编写页面 E2E 测试

**技术要点**:
- 使用 Vue Router 4.2.5
- SEO 优化：meta 标签、Open Graph
- 页面过渡：Vue Transition

---

### Task 2.1.7: 配置路由
**预估工时**: 0.5 小时
**状态**: Pending

**Subtasks**:
- [ ] 2.1.7.1: 在 `src/router/index.ts` 中添加 Portfolio 路由
- [ ] 2.1.7.2: 配置路由元信息（title, description）
- [ ] 2.1.7.3: 测试路由跳转功能

**路由配置示例**:
```typescript
{
  path: '/portfolio',
  name: 'Portfolio',
  component: () => import('@/views/Portfolio.vue'),
  meta: {
    title: '作品集 - 佘杰的前端技术分享',
    description: '前端项目作品集展示'
  }
}
```

---

### Task 2.1.8: 性能优化
**预估工时**: 1-2 小时
**状态**: Pending

**Subtasks**:
- [ ] 2.1.8.1: 实现组件懒加载（路由级懒加载）
- [ ] 2.1.8.2: 实现图片懒加载（Intersection Observer API）
- [ ] 2.1.8.3: 优化作品卡片渲染性能
- [ ] 2.1.8.4: 优化筛选性能（防抖、缓存）
- [ ] 2.1.8.5: 使用 Chrome DevTools Performance 分析性能
- [ ] 2.1.8.6: 验证性能指标达标

**性能目标**:
- 作品列表页加载时间 ≤500ms
- 作品卡片渲染时间 ≤100ms
- 筛选响应时间 ≤200ms
- 滚动帧率 ≥60fps

---

### Task 2.1.9: 编写测试
**预估工时**: 2-3 小时
**状态**: Pending

**Subtasks**:
- [ ] 2.1.9.1: 编写 ProjectCard 组件单元测试
- [ ] 2.1.9.2: 编写 ProjectList 组件单元测试
- [ ] 2.1.9.3: 编写 TechStackFilter 组件单元测试
- [ ] 2.1.9.4: 编写 useProjectStore 单元测试
- [ ] 2.1.9.5: 编写 Portfolio 页面 E2E 测试（Playwright）
- [ ] 2.1.9.6: 运行测试并验证覆盖率 ≥80%
- [ ] 2.1.9.7: 修复测试失败的问题

**测试框架**:
- 单元测试：Vitest
- E2E 测试：Playwright

---

### Task 2.1.10: 代码审查和优化
**预估工时**: 1 小时
**状态**: Pending

**Subtasks**:
- [ ] 2.1.10.1: 运行 ESLint 检查并修复问题
- [ ] 2.1.10.2: 运行 Prettier 格式化代码
- [ ] 2.1.10.3: 运行 TypeScript 类型检查
- [ ] 2.1.10.4: 代码审查（自我审查或同行审查）
- [ ] 2.1.10.5: 优化代码质量和可读性
- [ ] 2.1.10.6: 添加必要的注释

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

- **前置依赖**: Story 1.1（博客文章列表展示）
- **后续依赖**: Story 2.2（作品详情页）

### 关键决策

1. **数据存储**: 使用 JSON 文件存储作品数据，便于管理和更新
2. **筛选实现**: 使用 Pinia Store 管理筛选状态，实现响应式筛选
3. **图片懒加载**: 使用 Intersection Observer API 实现图片懒加载
4. **主题系统**: 所有组件支持主题系统（colorScheme, uiStyle），使用 CSS 变量和动态 Class
5. **响应式布局**: 使用 CSS Grid 实现响应式布局

### 性能优化策略

1. **代码分割**: 路由级懒加载，减少首屏加载大小
2. **图片懒加载**: 使用 Intersection Observer API，减少初始加载时间
3. **筛选优化**: 使用防抖和缓存，优化筛选性能
4. **虚拟滚动**: 如果作品很多，考虑使用虚拟滚动

### 测试策略

1. **单元测试**: 覆盖所有组件和 Store，覆盖率 ≥80%
2. **E2E 测试**: 测试关键流程（作品加载、筛选、跳转）
3. **性能测试**: 使用 Lighthouse 验证性能指标
4. **筛选功能测试**: 验证各种筛选场景

### 可访问性

1. **键盘导航**: 所有交互元素支持键盘操作
2. **Focus 状态**: 清晰的 Focus 样式
3. **ARIA 标签**: 语义化 HTML，必要的 ARIA 标签
4. **颜色对比度**: 符合 WCAG AA 标准
5. **图片 alt 属性**: 所有图片都有 alt 属性

### 潜在风险

| 风险 | 影响 | 概率 | 缓解措施 |
|------|------|------|---------|
| 图片加载性能问题 | 中 | 中 | 使用懒加载，WebP 格式 |
| 筛选性能问题 | 中 | 低 | 使用防抖和缓存 |
| 响应式布局问题 | 低 | 低 | 提前测试，修复 bug |
| 性能指标不达标 | 高 | 中 | 早期性能基准测试，持续优化 |
| 测试覆盖率不足 | 中 | 中 | 编写完整测试用例，定期检查 |
| 主题系统兼容性 | 低 | 低 | 提前设计主题系统架构 |

### 参考资料

- [Vue 3 官方文档](https://vuejs.org/)
- [Pinia 官方文档](https://pinia.vuejs.org/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [Web Vitals](https://web.dev/vitals/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 📊 进度跟踪

### 总体进度

| 任务 | 状态 | 完成度 |
|------|------|--------|
| Task 2.1.1: 创建 Project 数据结构 | Pending | 0% |
| Task 2.1.2: 创建 useProjectStore | Pending | 0% |
| Task 2.1.3: 创建 ProjectCard 组件 | Pending | 0% |
| Task 2.1.4: 创建 ProjectList 组件 | Pending | 0% |
| Task 2.1.5: 创建 TechStackFilter 组件 | Pending | 0% |
| Task 2.1.6: 创建 Portfolio 页面 | Pending | 0% |
| Task 2.1.7: 配置路由 | Pending | 0% |
| Task 2.1.8: 性能优化 | Pending | 0% |
| Task 2.1.9: 编写测试 | Pending | 0% |
| Task 2.1.10: 代码审查和优化 | Pending | 0% |
| **总体** | **In Progress** | **0%** |

### 验收标准完成情况

| 类别 | 总数 | 已完成 | 完成率 |
|------|------|--------|--------|
| 功能验收标准 | 10 | 0 | 0% |
| 性能验收标准 | 6 | 0 | 0% |
| 质量验收标准 | 6 | 0 | 0% |
| 可访问性验收标准 | 6 | 0 | 0% |
| **总计** | **28** | **0** | **0%** |

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

## 🤖 Dev Agent Record

### Context Reference

- **Story Context XML**: [story-2.1-context.xml](./story-2.1-context.xml)
- **Generated At**: 2026年1月22日
- **Context Includes**:
  - PRD 文档（产品需求、性能指标、数据结构）
  - 解决方案架构文档（技术栈选择、架构决策）
  - Epics 文档（Story 2.1 验收标准）
  - 现有代码（useBlogStore、BlogList 组件）
  - 依赖信息（Vue、TypeScript、Pinia）
  - 接口定义（Project 类型）
  - 约束条件（技术栈、性能、可访问性）
  - 测试标准（Vitest、Playwright、覆盖率）

### Agent Model Used

BMAD Story Context Workflow v1.0

### Debug Log References

无（Story 尚未开始开发）

### Completion Notes List

无（Story 尚未开始开发）

### File List

待开发（Story 尚未开始开发）

---

**Story 文档结束**

**下一步**: 运行 dev-story 工作流，开始 Story 2.1 的开发

**当前状态**: Story 文档已创建，等待开始开发