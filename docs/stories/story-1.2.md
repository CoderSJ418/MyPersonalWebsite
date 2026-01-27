# Story 1.2: 博客文章详情页

**Epic**: Epic 1: 核心功能实现
**Story ID**: 1.2
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

**作为** 读者，
**我希望** 看到完整的文章内容，包括标题、作者、发布时间、分类、标签、正文和相关文章推荐，
**以便** 深入了解技术细节。

---

## ✅ 验收标准

### 功能验收标准

- [ ] **SC-1**: 文章完整信息展示
  - 文章标题（H1）
  - 作者信息
  - 发布时间（格式：YYYY-MM-DD）
  - 文章分类（如：Vue3、TypeScript、工程化、设计等）
  - 文章标签（如：提示词工程、性能优化、调试技巧等）
  - 阅读时长（分钟）
  - 阅读次数（可选）

- [ ] **SC-2**: 文章正文内容展示
  - 支持 Markdown 渲染（标题、段落、列表、引用、代码块、链接、图片等）
  - 段落排版优化（行高 1.5，字号 16px）
  - 响应式字体大小（移动端 14px，桌面端 16px）
  - 图片自适应显示（最大宽度 100%）
  - 引用块样式优化

- [ ] **SC-3**: 代码块语法高亮
  - 支持多种语言高亮（Vue3、TypeScript、JavaScript、CSS、HTML、JSON 等）
  - 显示代码语言标签
  - 显示代码行号（可选）
  - 代码块样式优化（背景色、字体、间距）
  - 代码块支持一键复制功能
  - 复制成功提示

- [ ] **SC-4**: 代码版本标注
  - 在代码块上方标注代码对应的库版本（如：Vue 3.4.15, TypeScript 5.3.3）
  - 版本信息从文章数据中读取
  - 版本信息与代码块关联显示

- [ ] **SC-5**: 目录导航（TOC）
  - 自动生成文章目录（基于 Markdown 标题）
  - 目录固定在右侧（桌面端）或顶部（移动端）
  - 点击目录项跳转到对应章节
  - 滚动时高亮当前章节
  - 目录支持收起/展开（移动端）

- [ ] **SC-6**: 相关文章推荐
  - 基于分类推荐相关文章（同一分类，排除当前文章）
  - 推荐数量：3-5 篇
  - 显示文章标题、摘要、发布时间
  - 点击推荐文章跳转到详情页

- [ ] **SC-7**: 上一篇/下一篇导航
  - 显示上一篇文章链接（标题 + 发布时间）
  - 显示下一篇文章链接（标题 + 发布时间）
  - 如果是第一篇，隐藏"上一篇"
  - 如果是最后一篇，隐藏"下一篇"
  - 点击链接跳转到对应文章详情页

- [ ] **SC-8**: 返回列表按钮
  - 显示"返回博客列表"按钮
  - 点击按钮跳转到博客列表页
  - 按钮样式符合主题系统

- [ ] **SC-9**: 分享功能（可选）
  - 支持分享到社交媒体（Twitter、LinkedIn、微信等）
  - 支持复制文章链接
  - 分享成功提示

- [ ] **SC-10**: 加载状态
  - 初始加载时显示骨架屏或加载动画
  - 加载失败时显示错误提示
  - 文章不存在时显示 404 提示

- [ ] **SC-11**: Context7 官方文档引用
  - 在文章中嵌入 Context7 官方文档链接
  - 支持点击链接跳转到官方文档
  - 链接样式优化（图标 + 文字）

### 性能验收标准

- [ ] **PC-1**: 文章详情页加载时间 ≤500ms（首次加载）
- [ ] **PC-2**: Markdown 渲染时间 ≤200ms
- [ ] **PC-3**: 代码高亮渲染时间 ≤100ms
- [ ] **PC-4**: 目录生成时间 ≤50ms
- [ ] **PC-5**: 页面滚动流畅（帧率 ≥60fps）
- [ ] **PC-6**: 内存占用 ≤30MB（加载完成后）

### 质量验收标准

- [ ] **QC-1**: 单元测试覆盖率 ≥80%
- [ ] **QC-2**: 所有组件通过 ESLint 检查
- [ ] **QC-3**: 所有组件通过 TypeScript 类型检查
- [ ] **QC-4**: 组件代码符合 Prettier 格式规范
- [ ] **QC-5**: Markdown 渲染正确性测试通过
- [ ] **QC-6**: 代码高亮功能测试通过

### 可访问性验收标准

- [ ] **AC-1**: 文章内容支持键盘导航（Tab 键）
- [ ] **AC-2**: 所有链接和按钮有清晰的 Focus 状态
- [ ] **AC-3**: 图片有 alt 属性
- [ ] **AC-4**: 代码块有适当的 ARIA 标签
- [ ] **AC-5**: 颜色对比度符合 WCAG AA 标准（4.5:1）
- [ ] **AC-6**: 目录导航支持键盘操作

---

## 📦 任务列表

### Task 1.2.1: 创建 BlogDetail 组件
**预估工时**: 2-3 小时
**状态**: Pending

**Subtasks**:
- [ ] 1.2.1.1: 创建 `src/components/blog/BlogDetail.vue` 组件文件
- [ ] 1.2.1.2: 定义组件 Props 接口（BlogPost 类型）
- [ ] 1.2.1.3: 实现文章头部布局（标题、作者、发布时间、分类、标签）
- [ ] 1.2.1.4: 实现文章正文内容区域
- [ ] 1.2.1.5: 实现相关文章推荐区域
- [ ] 1.2.1.6: 实现上一篇/下一篇导航
- [ ] 1.2.1.7: 实现返回列表按钮
- [ ] 1.2.1.8: 添加加载状态和错误状态
- [ ] 1.2.1.9: 添加主题系统支持（CSS 变量 + 动态 Class）
- [ ] 1.2.1.10: 编写组件单元测试

**技术要点**:
- 使用 Vue 3 Composition API
- 使用 Tailwind CSS 布局
- 响应式设计（移动优先）
- 支持主题系统（colorScheme, uiStyle）

---

### Task 1.2.2: 实现 Markdown 渲染
**预估工时**: 2-3 小时
**状态**: Pending

**Subtasks**:
- [ ] 1.2.2.1: 安装 Markdown 渲染库（markdown-it 或 remark）
- [ ] 1.2.2.2: 配置 Markdown 渲染器（支持 GFM、表格、任务列表等）
- [ ] 1.2.2.3: 创建 `src/utils/markdown.ts` 工具文件
- [ ] 1.2.2.4: 实现 Markdown 渲染函数
- [ ] 1.2.2.5: 实现 Markdown 插件（代码块、链接、图片等）
- [ ] 1.2.2.6: 优化 Markdown 渲染性能（缓存、懒加载）
- [ ] 1.2.2.7: 编写 Markdown 渲染单元测试

**技术要点**:
- 使用 markdown-it 或 remark
- 支持 CommonMark 和 GFM
- 插件系统（markdown-it-anchor、markdown-it-table-of-contents）
- 性能优化

**数据示例**:
```typescript
// src/utils/markdown.ts
import MarkdownIt from 'markdown-it'
import anchor from 'markdown-it-anchor'
import toc from 'markdown-it-table-of-contents'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

md.use(anchor, {
  permalink: anchor.permalink.linkInsideHeader({
    symbol: '#',
    placement: 'before'
  })
})

md.use(toc, {
  includeLevel: [2, 3, 4],
  containerClass: 'table-of-contents'
})

export function renderMarkdown(content: string): string {
  return md.render(content)
}
```

---

### Task 1.2.3: 实现代码高亮
**预估工时**: 2-3 小时
**状态**: Pending

**Subtasks**:
- [ ] 1.2.3.1: 安装代码高亮库（highlight.js 或 shiki）
- [ ] 1.2.3.2: 配置代码高亮主题（支持亮色和暗色主题）
- [ ] 1.2.3.3: 创建 `src/utils/highlight.ts` 工具文件
- [ ] 1.2.3.4: 实现代码高亮函数
- [ ] 1.2.3.5: 集成到 Markdown 渲染器
- [ ] 1.2.3.6: 实现代码语言标签显示
- [ ] 1.2.3.7: 实现代码行号显示（可选）
- [ ] 1.2.3.8: 编写代码高亮单元测试

**技术要点**:
- 使用 highlight.js 或 shiki
- 支持多种语言（Vue3、TypeScript、JavaScript、CSS、HTML、JSON 等）
- 支持亮色和暗色主题
- 性能优化

**数据示例**:
```typescript
// src/utils/highlight.ts
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import 'highlight.js/styles/github-dark.css'

export function highlightCode(code: string, language: string): string {
  return hljs.highlight(code, { language }).value
}
```

---

### Task 1.2.4: 实现代码版本标注
**预估工时**: 1-2 小时
**状态**: Pending

**Subtasks**:
- [ ] 1.2.4.1: 在 BlogPost 接口中添加 codeVersion 字段
- [ ] 1.2.4.2: 创建 `src/components/blog/CodeBlock.vue` 组件
- [ ] 1.2.4.3: 实现代码版本标签显示
- [ ] 1.2.4.4: 实现代码版本与代码块关联
- [ ] 1.2.4.5: 编写组件单元测试

**技术要点**:
- 代码版本信息从文章数据中读取
- 版本信息显示在代码块上方
- 版本信息样式优化

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

### Task 1.2.5: 实现代码复制功能
**预估工时**: 1-2 小时
**状态**: Pending

**Subtasks**:
- [ ] 1.2.5.1: 在 CodeBlock 组件中添加复制按钮
- [ ] 1.2.5.2: 实现点击复制功能（使用 Clipboard API）
- [ ] 1.2.5.3: 实现复制成功提示（Toast 或 Tooltip）
- [ ] 1.2.5.4: 添加复制按钮样式（图标 + 悬停效果）
- [ ] 1.2.5.5: 编写组件单元测试

**技术要点**:
- 使用 Clipboard API
- 复制成功提示
- 按钮样式优化

---

### Task 1.2.6: 实现目录导航（TOC）
**预估工时**: 2-3 小时
**状态**: Pending

**Subtasks**:
- [ ] 1.2.6.1: 创建 `src/components/blog/TableOfContents.vue` 组件
- [ ] 1.2.6.2: 实现目录自动生成（基于 Markdown 标题）
- [ ] 1.2.6.3: 实现目录项点击跳转功能
- [ ] 1.2.6.4: 实现滚动时高亮当前章节
- [ ] 1.2.6.5: 实现目录响应式布局（桌面端右侧，移动端顶部）
- [ ] 1.2.6.6: 实现目录收起/展开功能（移动端）
- [ ] 1.2.6.7: 添加主题系统支持
- [ ] 1.2.6.8: 编写组件单元测试

**技术要点**:
- 使用 markdown-it-anchor 和 markdown-it-table-of-contents
- 使用 Intersection Observer API 监听滚动
- 响应式布局
- 主题系统支持

---

### Task 1.2.7: 实现相关文章推荐
**预估工时**: 1-2 小时
**状态**: Pending

**Subtasks**:
- [ ] 1.2.7.1: 创建 `src/components/blog/RelatedPosts.vue` 组件
- [ ] 1.2.7.2: 实现相关文章筛选逻辑（基于分类）
- [ ] 1.2.7.3: 实现相关文章展示（标题、摘要、发布时间）
- [ ] 1.2.7.4: 实现点击跳转功能
- [ ] 1.2.7.5: 添加主题系统支持
- [ ] 1.2.7.6: 编写组件单元测试

**技术要点**:
- 基于分类筛选相关文章
- 排除当前文章
- 推荐数量：3-5 篇
- 响应式布局

---

### Task 1.2.8: 实现上一篇/下一篇导航
**预估工时**: 1-2 小时
**状态**: Pending

**Subtasks**:
- [ ] 1.2.8.1: 创建 `src/components/blog/PostNavigation.vue` 组件
- [ ] 1.2.8.2: 实现上一篇文章链接
- [ ] 1.2.8.3: 实现下一篇文章链接
- [ ] 1.2.8.4: 实现边界处理（第一篇/最后一篇）
- [ ] 1.2.8.5: 添加主题系统支持
- [ ] 1.2.8.6: 编写组件单元测试

**技术要点**:
- 从 useBlogStore 获取上一篇文章和下一篇文章
- 边界处理
- 响应式布局

---

### Task 1.2.9: 更新 useBlogStore
**预估工时**: 1-2 小时
**状态**: Pending

**Subtasks**:
- [ ] 1.2.9.1: 在 useBlogStore 中添加 loadPost(id) Action
- [ ] 1.2.9.2: 实现获取上一篇文章的逻辑
- [ ] 1.2.9.3: 实现获取下一篇文章的逻辑
- [ ] 1.2.9.4: 实现获取相关文章的逻辑
- [ ] 1.2.9.5: 添加 TypeScript 类型定义
- [ ] 1.2.9.6: 编写 Store 单元测试

**技术要点**:
- 使用 Pinia 2.1.7
- 文章加载逻辑
- 相关文章筛选逻辑

---

### Task 1.2.10: 创建 BlogDetail 页面
**预估工时**: 1-2 小时
**状态**: Pending

**Subtasks**:
- [ ] 1.2.10.1: 创建 `src/views/BlogDetail.vue` 页面文件
- [ ] 1.2.10.2: 集成 BlogDetail 组件
- [ ] 1.2.10.3: 连接 useBlogStore
- [ ] 1.2.10.4: 实现页面标题和描述（SEO 优化）
- [ ] 1.2.10.5: 添加页面过渡动画（可选）
- [ ] 1.2.10.6: 编写页面 E2E 测试

**技术要点**:
- 使用 Vue Router 4.2.5
- SEO 优化：meta 标签、Open Graph
- 页面过渡：Vue Transition

---

### Task 1.2.11: 配置路由
**预估工时**: 0.5 小时
**状态**: Pending

**Subtasks**:
- [ ] 1.2.11.1: 在 `src/router/index.ts` 中添加 BlogDetail 路由
- [ ] 1.2.11.2: 配置路由参数（文章 ID）
- [ ] 1.2.11.3: 配置路由元信息（title, description）
- [ ] 1.2.11.4: 测试路由跳转功能

**路由配置示例**:
```typescript
{
  path: '/blog/:id',
  name: 'BlogDetail',
  component: () => import('@/views/BlogDetail.vue'),
  meta: {
    title: '文章详情 - 佘杰的前端技术分享',
    description: '前端技术文章详情'
  }
}
```

---

### Task 1.2.12: 性能优化
**预估工时**: 1-2 小时
**状态**: Pending

**Subtasks**:
- [ ] 1.2.12.1: 实现组件懒加载（路由级懒加载）
- [ ] 1.2.12.2: 优化 Markdown 渲染性能（缓存、懒加载）
- [ ] 1.2.12.3: 优化代码高亮渲染性能
- [ ] 1.2.12.4: 优化图片加载（WebP 格式、懒加载）
- [ ] 1.2.12.5: 使用 Chrome DevTools Performance 分析性能
- [ ] 1.2.12.6: 验证性能指标达标

**性能目标**:
- 文章详情页加载时间 ≤500ms
- Markdown 渲染时间 ≤200ms
- 代码高亮渲染时间 ≤100ms
- 滚动帧率 ≥60fps

---

### Task 1.2.13: 编写测试
**预估工时**: 2-3 小时
**状态**: Pending

**Subtasks**:
- [ ] 1.2.13.1: 编写 BlogDetail 组件单元测试
- [ ] 1.2.13.2: 编写 CodeBlock 组件单元测试
- [ ] 1.2.13.3: 编写 TableOfContents 组件单元测试
- [ ] 1.2.13.4: 编写 RelatedPosts 组件单元测试
- [ ] 1.2.13.5: 编写 PostNavigation 组件单元测试
- [ ] 1.2.13.6: 编写 Markdown 渲染单元测试
- [ ] 1.2.13.7: 编写 useBlogStore 单元测试
- [ ] 1.2.13.8: 编写 BlogDetail 页面 E2E 测试（Playwright）
- [ ] 1.2.13.9: 运行测试并验证覆盖率 ≥80%
- [ ] 1.2.13.10: 修复测试失败的问题

**测试框架**:
- 单元测试：Vitest
- E2E 测试：Playwright

---

### Task 1.2.14: 代码审查和优化
**预估工时**: 1 小时
**状态**: Pending

**Subtasks**:
- [ ] 1.2.14.1: 运行 ESLint 检查并修复问题
- [ ] 1.2.14.2: 运行 Prettier 格式化代码
- [ ] 1.2.14.3: 运行 TypeScript 类型检查
- [ ] 1.2.14.4: 代码审查（自我审查或同行审查）
- [ ] 1.2.14.5: 优化代码质量和可读性
- [ ] 1.2.14.6: 添加必要的注释

---

## 💻 开发备注

### 技术栈版本

- **Vue**: 3.4.15
- **TypeScript**: 5.3.3
- **Pinia**: 2.1.7
- **Vue Router**: 4.2.5
- **Tailwind CSS**: 3.4.1
- **markdown-it**: ^14.0.0（或 remark ^15.0.0）
- **highlight.js**: ^11.9.0（或 shiki ^1.0.0）
- **GSAP**: 3.14.2（可选，用于动画）
- **Lucide Vue Next**: 0.312.0（可选，用于图标）

### 依赖关系

- **前置依赖**: Story 1.1（博客文章列表展示）
- **后续依赖**: Story 1.3（博客分类与标签筛选）、Story 1.4（博客文章搜索功能）

### 关键决策

1. **Markdown 渲染**: 使用 markdown-it 库，支持 CommonMark 和 GFM，插件丰富，性能优秀
2. **代码高亮**: 使用 highlight.js 库，支持多种语言和主题，性能优秀
3. **目录生成**: 使用 markdown-it-anchor 和 markdown-it-table-of-contents 插件
4. **代码版本标注**: 在 BlogPost 接口中添加 codeVersion 字段，从文章数据中读取
5. **主题系统**: 所有组件支持主题系统（colorScheme, uiStyle），使用 CSS 变量和动态 Class

### 性能优化策略

1. **代码分割**: 路由级懒加载，减少首屏加载大小
2. **Markdown 渲染优化**: 使用缓存，避免重复渲染
3. **代码高亮优化**: 使用 Web Worker 或异步渲染，避免阻塞主线程
4. **图片优化**: 使用 WebP 格式，懒加载
5. **虚拟滚动**: 如果文章很长，考虑使用虚拟滚动

### 测试策略

1. **单元测试**: 覆盖所有组件和 Store，覆盖率 ≥80%
2. **E2E 测试**: 测试关键流程（文章加载、目录导航、代码复制、上一篇/下一篇）
3. **性能测试**: 使用 Lighthouse 验证性能指标
4. **Markdown 渲染测试**: 验证各种 Markdown 语法正确渲染
5. **代码高亮测试**: 验证各种语言正确高亮

### 可访问性

1. **键盘导航**: 所有交互元素支持键盘操作
2. **Focus 状态**: 清晰的 Focus 样式
3. **ARIA 标签**: 语义化 HTML，必要的 ARIA 标签
4. **颜色对比度**: 符合 WCAG AA 标准
5. **代码块 ARIA 标签**: 为代码块添加适当的 ARIA 标签

### 潜在风险

| 风险 | 影响 | 概率 | 缓解措施 |
|------|------|------|---------|
| Markdown 渲染性能问题 | 中 | 中 | 使用缓存，懒加载，Web Worker |
| 代码高亮性能问题 | 中 | 低 | 使用异步渲染，Web Worker |
| 目录生成不准确 | 低 | 低 | 提前测试，修复 bug |
| 性能指标不达标 | 高 | 中 | 早期性能基准测试，持续优化 |
| 测试覆盖率不足 | 中 | 中 | 编写完整测试用例，定期检查 |
| 主题系统兼容性 | 低 | 低 | 提前设计主题系统架构 |

### 参考资料

- [Vue 3 官方文档](https://vuejs.org/)
- [Pinia 官方文档](https://pinia.vuejs.org/)
- [markdown-it 文档](https://github.com/markdown-it/markdown-it)
- [highlight.js 文档](https://highlightjs.org/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [Web Vitals](https://web.dev/vitals/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 📊 进度跟踪

### 总体进度

| 任务 | 状态 | 完成度 |
|------|------|--------|
| Task 1.2.1: 创建 BlogDetail 组件 | Pending | 0% |
| Task 1.2.2: 实现 Markdown 渲染 | Pending | 0% |
| Task 1.2.3: 实现代码高亮 | Pending | 0% |
| Task 1.2.4: 实现代码版本标注 | Pending | 0% |
| Task 1.2.5: 实现代码复制功能 | Pending | 0% |
| Task 1.2.6: 实现目录导航（TOC） | Pending | 0% |
| Task 1.2.7: 实现相关文章推荐 | Pending | 0% |
| Task 1.2.8: 实现上一篇/下一篇导航 | Pending | 0% |
| Task 1.2.9: 更新 useBlogStore | Pending | 0% |
| Task 1.2.10: 创建 BlogDetail 页面 | Pending | 0% |
| Task 1.2.11: 配置路由 | Pending | 0% |
| Task 1.2.12: 性能优化 | Pending | 0% |
| Task 1.2.13: 编写测试 | Pending | 0% |
| Task 1.2.14: 代码审查和优化 | Pending | 0% |
| **总体** | **In Progress** | **0%** |

### 验收标准完成情况

| 类别 | 总数 | 已完成 | 完成率 |
|------|------|--------|--------|
| 功能验收标准 | 11 | 0 | 0% |
| 性能验收标准 | 6 | 0 | 0% |
| 质量验收标准 | 6 | 0 | 0% |
| 可访问性验收标准 | 6 | 0 | 0% |
| **总计** | **29** | **0** | **0%** |

---

## 📝 变更记录

| 版本 | 日期 | 变更内容 | 变更人 |
|------|------|----------|--------|
| v1.0.0 | 2026-01-22 | 初始版本 | Bob (BMAD Scrum Master) |

---

## 📎 相关文档

- [PRD.md](../PRD.md) - 产品需求文档
- [Epics.md](../Epics.md) - Epic 列表
- [story-1.1.md](./story-1.1.md) - Story 1.1: 博客文章列表展示
- [story-1.1-context.xml](./story-1.1-context.xml) - Story 1.1 上下文
- [solution-architecture.md](../solution-architecture.md) - 解决方案架构文档
- [ui-design-system.md](../ui-design-system.md) - UI 设计系统规范
- [BMAD 开发方法论](../../../bmad/docs/iflow-instructions.md) - BMAD 方法论说明

---

## 🤖 Dev Agent Record

### Context Reference

- **Story Context XML**: [story-1.2-context.xml](./story-1.2-context.xml)
- **Generated At**: 2026年1月22日
- **Context Includes**:
  - PRD 文档（产品需求、性能指标、数据结构）
  - 解决方案架构文档（技术栈选择、架构决策）
  - Epics 文档（Story 1.2 验收标准）
  - Story 1.1 文档（useBlogStore 数据结构）
  - 现有代码（useBlogStore、BlogList 组件）
  - 依赖信息（Vue、TypeScript、Pinia、markdown-it、highlight.js）
  - 接口定义（BlogPost 类型）
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

**下一步**: 运行 dev-story 工作流，开始 Story 1.2 的开发

**当前状态**: Story 文档和上下文已创建，等待开发开始