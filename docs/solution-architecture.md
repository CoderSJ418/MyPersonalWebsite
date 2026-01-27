# MyPersonalWebsite 解决方案架构文档

**文档版本**: v1.0.0
**创建日期**: 2026年1月22日
**作者**: BMAD Architect (Winston)
**状态**: 规划阶段
**项目等级**: Level 3

---

## 📋 执行摘要

本文档为 MyPersonalWebsite 项目提供完整的解决方案架构设计，基于 PRD 和 Epics 分析，结合 BMAD 方法论和最佳实践，定义了系统的整体架构、技术决策、组件设计和实现策略。

**核心架构原则**：
- **需求驱动架构**：以 PRD 和 Epics 为核心，先明确边界再设计
- **组件化设计**：高度可复用的组件体系，支持主题系统
- **性能优先**：代码分割、懒加载、虚拟列表、缓存优化
- **工程化**：自动化工具链、代码规范、CI/CD、MCP 集成
- **可维护性**：清晰的代码结构、完整的文档、错误日志系统
- **可扩展性**：模块化设计、插件化架构、主题系统

**技术栈版本锁定**：
- **前端框架**：Vue 3.4.15 (Composition API)
- **类型系统**：TypeScript 5.3.3
- **构建工具**：Vite 5.0.12
- **状态管理**：Pinia 2.1.7
- **路由管理**：Vue Router 4.2.5
- **样式方案**：Tailwind CSS 3.4.1
- **动画库**：GSAP 3.14.2
- **图标库**：Lucide Vue Next 0.312.0
- **测试框架**：Vitest + Playwright

**项目规模**：
- **Epics 总数**：4 个（核心功能、主题系统、性能优化、测试与质量保证）
- **Stories 总数**：21-28 个
- **预估周期**：3-5 周
- **MVP 周期**：2-4 周

---

## 一、系统概述

### 1.1 项目定位

MyPersonalWebsite 是一个基于 Vue 3 + Pinia + Vite 技术栈开发的个人博客与前端技术作品集一体化网站，核心价值在于：

1. **面向同行开发者**：提供可复用的技术实践参考（Vue3 实践方案、UI 风格设计思路、调色板功能实现逻辑）
2. **面向潜在雇主**：展示综合能力（技术栈熟练度、项目落地能力、UI/UX 审美及工程化思维）
3. **面向普通读者**：提供有价值的前端技术内容，支持个性化风格定制

### 1.2 角色定位

以「AI 提示词工程专家 + UI/UX 设计师 + 前端工程化实践者」三维视角定位项目，核心面向同行开发者输出可复用的技术方案。

### 1.3 核心目标

- **展示核心技术能力**：重点落地 AI 提示词工程、UI/UX 设计、前端工程化三大能力
- **沉淀个人品牌**：通过技术博客分享经验，以作品集呈现项目案例
- **提供优质交互体验**：基于 UI-UX-Pro-Max 设计原则，打造简洁、流畅、可定制的用户体验

### 1.4 系统边界

**包含范围**：
- 博客模块（文章列表、详情、分类、搜索、后台管理）
- 作品集模块（作品展示、详情、筛选、排序）
- 个人介绍模块（经历、技术栈、联系方式）
- 调色板功能（配色方案、UI 风格、字体组合、交互面板）
- 性能优化（代码分割、懒加载、虚拟列表、缓存）
- 测试体系（单元测试、集成测试、性能测试）
- 错误日志与调试系统

**不包含范围**：
- 用户注册/登录系统
- 数据库后端（采用静态数据或 Headless CMS）
- 支付系统
- 实时聊天功能
- AI 内容生成（MVP 后迭代）

---

## 二、架构决策记录（ADRs）

### ADR-001: 技术栈选择

**状态**: 已接受
**日期**: 2026-1-22
**决策者**: BMAD Architect (Winston)

#### 上下文
项目需要选择一个现代化、高性能、可维护的前端技术栈，用于构建个人博客和作品集网站。

#### 决策
选择 Vue 3 + TypeScript + Vite + Pinia + Tailwind CSS 作为核心技术栈。

#### 理由
1. **Vue 3.4.15**：
   - 用户是 Vue 专家，展示 Vue 3 深度应用能力
   - Composition API 提供更好的代码组织和复用
   - 性能优化：更快的虚拟 DOM、更小的包体积
   - TypeScript 支持完善

2. **TypeScript 5.3.3**：
   - 类型安全：减少运行时错误
   - 代码提示：提高开发效率
   - 重构支持：大型项目维护
   - 展示专业素养

3. **Vite 5.0.12**：
   - 极快的开发服务器启动速度
   - HMR（热模块替换）速度快
   - 原生 ES 模块支持
   - 优化的生产构建

4. **Pinia 2.1.7**：
   - Vue 3 官方推荐的状态管理库
   - 更简洁的 API 设计
   - TypeScript 支持完善
   - 无 mutations，更符合直觉

5. **Tailwind CSS 3.4.1**：
   - 快速开发：原子化 CSS 类
   - 响应式设计：移动端优先
   - 自定义主题：品牌一致性
   - 生产优化：自动清除未使用的样式

#### 后果
**正面影响**：
- 开发效率高
- 性能优秀
- 代码可维护性强
- 社区支持强大

**负面影响**：
- 学习曲线（Vue 3 Composition API）
- Tailwind CSS 类名可能较多
- 需要配置 TypeScript 严格模式

#### 替代方案
- React + Next.js：不选择，因为用户是 Vue 专家
- Vue 2 + Vuex：不选择，Vue 2 已停止维护
- Webpack：不选择，Vite 更快更现代
- CSS Modules：不选择，Tailwind CSS 更高效

---

### ADR-002: 数据存储策略

**状态**: 已接受
**日期**: 2026-1-22
**决策者**: BMAD Architect (Winston)

#### 上下文
项目需要存储博客文章、作品集、个人介绍等静态数据，以及用户主题偏好等动态数据。

#### 决策
采用「JSON 文件 + localStorage」混合存储策略：
- **静态数据**：JSON 文件存储（或集成 Headless CMS 如 Notion、Contentful）
- **动态数据**：localStorage 存储用户主题偏好

#### 理由
1. **JSON 文件存储静态数据**：
   - 简单直接，无需后端
   - 易于版本控制
   - 便于内容管理和更新
   - 可选集成 Headless CMS 提升管理体验

2. **localStorage 存储用户偏好**：
   - 无需后端，纯前端实现
   - 数据持久化，刷新页面后保持
   - 隐私友好，不收集敏感信息
   - 性能优秀，读写速度快

#### 后果
**正面影响**：
- 部署简单，支持静态站点托管
- 无需数据库，降低复杂度
- 隐私保护，符合伦理规范
- 性能优秀

**负面影响**：
- 需要手动管理 JSON 文件（除非集成 CMS）
- localStorage 有容量限制（5-10MB）
- 无法实现复杂的查询功能

#### 替代方案
- **数据库后端**：不选择，增加复杂度，MVP 阶段不需要
- **IndexedDB**：不选择，对于简单数据来说过于复杂
- **Cookie**：不选择，不适合存储大量数据

---

### ADR-003: 主题系统架构

**状态**: 已接受
**日期**: 2026-1-22
**决策者**: BMAD Architect (Winston)

#### 上下文
项目需要实现调色板功能，支持配色方案、UI 风格、字体组合的切换，提供个性化定制体验。

#### 决策
采用「CSS 变量 + 动态 Class + Pinia 状态管理」架构实现主题系统。

#### 理由
1. **CSS 变量管理配色**：
   - 动态修改配色方案，无需重新编译
   - 性能优秀，切换快速
   - 易于扩展新配色方案
   - 支持暗黑模式

2. **动态 Class 管理 UI 风格**：
   - 通过 Class 切换不同 UI 风格
   - 与 Tailwind CSS 深度集成
   - 支持多种风格组合
   - 易于维护和扩展

3. **Pinia 状态管理主题状态**：
   - 统一管理主题状态
   - 与 localStorage 持久化联动
   - 支持主题切换动画
   - 便于调试和监控

#### 实现方案
```typescript
// stores/useThemeStore.ts
export const useThemeStore = defineStore('theme', {
  state: () => ({
    colorScheme: 'professional-minimal' as ColorScheme,
    uiStyle: 'glass-morphism' as UIStyle,
    fontCombo: 'inter-jetbrains' as FontCombo,
    darkMode: false
  }),
  actions: {
    setColorScheme(scheme: ColorScheme) {
      this.colorScheme = scheme
      document.documentElement.setAttribute('data-color-scheme', scheme)
      localStorage.setItem('colorScheme', scheme)
    },
    setUIStyle(style: UIStyle) {
      this.uiStyle = style
      document.documentElement.setAttribute('data-ui-style', style)
      localStorage.setItem('uiStyle', style)
    },
    setFontCombo(combo: FontCombo) {
      this.fontCombo = combo
      document.documentElement.setAttribute('data-font-combo', combo)
      localStorage.setItem('fontCombo', combo)
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      document.documentElement.setAttribute('data-theme', this.darkMode ? 'dark' : 'light')
      localStorage.setItem('darkMode', String(this.darkMode))
    }
  }
})
```

#### 后果
**正面影响**：
- 主题切换快速流畅（≤100ms）
- 易于扩展新主题和风格
- 代码可维护性强
- 与 UI-UX-Pro-Max 深度集成

**负面影响**：
- 需要定义大量的 CSS 变量
- 需要维护多个主题配置
- 可能增加 CSS 文件大小

#### 替代方案
- **预编译主题**：不选择，灵活性差，切换慢
- **CSS-in-JS**：不选择，性能较差，与 Tailwind CSS 不兼容
- **单独的 CSS 文件**：不选择，维护困难，切换慢

---

### ADR-004: 性能优化策略

**状态**: 已接受
**日期**: 2026-1-22
**决策者**: BMAD Architect (Winston)

#### 上下文
项目需要达到 Lighthouse ≥90 分的性能目标，确保首屏加载时间 ≤2s，交互响应时间 ≤100ms。

#### 决策
采用「代码分割 + 懒加载 + 虚拟列表 + 缓存优化」综合性能优化策略。

#### 理由
1. **代码分割**：
   - 按路由分割代码，减少首屏加载大小
   - 按功能分割第三方库，优化加载顺序
   - Vite 自动代码分割，配置简单

2. **懒加载**：
   - 路由懒加载，按需加载页面
   - 组件懒加载，延迟加载非核心组件
   - 图片懒加载，优化图片加载体验

3. **虚拟列表**：
   - 长列表（≥50 项）使用虚拟滚动
   - 只渲染可见区域，减少 DOM 节点
   - 保证滚动流畅（帧率 ≥60fps）

4. **缓存优化**：
   - 浏览器缓存策略，利用 HTTP 缓存
   - CDN 缓存，加速静态资源加载
   - Service Worker 缓存（可选），离线支持

#### 实现方案
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-vendor': ['lucide-vue-next', 'gsap'],
          'markdown': ['markdown-it', 'highlight.js']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})

// router/index.ts
const routes = [
  {
    path: '/',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/blog',
    component: () => import('@/views/Blog.vue')
  }
]
```

#### 后果
**正面影响**：
- 首屏加载时间 ≤2s
- Lighthouse 评分 ≥90 分
- 交互响应时间 ≤100ms
- 滚动流畅（帧率 ≥60fps）

**负面影响**：
- 需要额外的配置和优化工作
- 虚拟列表可能增加代码复杂度
- 缓存策略需要精心设计

#### 替代方案
- **SSR（服务端渲染）**：不选择，增加复杂度，MVP 阶段不需要
- **SSG（静态生成）**：不选择，内容动态性要求高
- **预加载所有资源**：不选择，首屏加载慢

---

### ADR-005: 错误日志与调试系统

**状态**: 已接受
**日期**: 2026-1-22
**决策者**: BMAD Architect (Winston)

#### 上下文
项目需要建立完善的错误日志和调试系统，快速定位和修复问题，提高开发效率和系统稳定性。

#### 决策
采用「Sentry 精简版 + MCP 工具联动 + Context7 文档校验」错误日志与调试系统。

#### 理由
1. **Sentry 精简版**：
   - 轻量级前端错误日志库
   - 收集运行时错误、性能异常、用户操作异常
   - 日志包含时间、设备、错误类型、堆栈信息
   - 支持浏览器和 Node.js

2. **MCP 工具联动**：
   - 实时监控报错，联动日志库提取堆栈信息
   - 结合 Context7 拉取的官方文档及代码示例，定位异常原因
   - 提供针对性修复方案
   - 自动校验修复效果

3. **Context7 文档校验**：
   - 校验代码与版本的一致性
   - 抵御恶意提示攻击
   - 规避 LLM 幻觉
   - 确保逻辑闭环

#### 实现方案
```typescript
// utils/logger.ts
import * as Sentry from '@sentry/vue'

export const initLogger = (app: App) => {
  Sentry.init({
    app,
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    beforeSend(event, hint) {
      // MCP 工具联动
      if (window.mcp) {
        window.mcp.sendErrorToMCP(event, hint)
      }
      return event
    }
  })
}

export const logError = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, { extra: context })
  console.error('[Error]', error, context)
}

export const logPerformance = (metric: string, value: number) => {
  Sentry.captureMessage(`Performance: ${metric}`, {
    level: 'info',
    extra: { metric, value }
  })
}
```

#### 调试全流程
1. **报错捕获**：MCP 工具实时监控报错，联动日志库提取堆栈信息
2. **根源分析**：结合 Context7 拉取的官方文档及代码示例，定位异常原因
3. **修复执行**：提供针对性修复方案（如替换为对应版本 API、修正提示词语义）
4. **回归验证**：MCP 工具自动校验修复效果，结合 Context7 文档二次确认
5. **沉淀复盘**：将报错-定位-修复全流程记录至知识库

#### 后果
**正面影响**：
- 快速定位和修复错误
- 提高开发效率
- 系统稳定性提升
- 知识库积累

**负面影响**：
- 需要集成 Sentry，增加依赖
- 需要配置 MCP 工具联动
- 可能产生额外的日志数据

#### 替代方案
- **console.log**：不选择，不够专业，无法收集生产环境错误
- **自定义日志系统**：不选择，重复造轮子，功能不完善
- **仅依赖浏览器 DevTools**：不选择，无法收集生产环境错误

---

### ADR-006: 搜索算法设计

**状态**: 已接受
**日期**: 2026-1-22
**决策者**: BMAD Architect (Winston)

#### 上下文
项目需要实现博客文章搜索功能，要求搜索准确率 ≥95%，搜索响应时间 ≤100ms。

#### 决策
采用「关键词模糊匹配 + 标签权重排序」搜索算法。

#### 理由
1. **关键词模糊匹配**：
   - 支持部分匹配，提高搜索灵活性
   - 不区分大小写，提升用户体验
   - 支持中文分词（可选）

2. **标签权重排序**：
   - 标签匹配的文章权重更高
   - 提升搜索结果的相关性
   - 优化用户体验

#### 实现方案
```typescript
// utils/search.ts
interface SearchScore {
  post: BlogPost
  score: number
}

export const searchPosts = (
  posts: BlogPost[],
  query: string
): BlogPost[] => {
  if (!query.trim()) return posts

  const keywords = query.toLowerCase().split(/\s+/)
  const scoredPosts: SearchScore[] = []

  for (const post of posts) {
    let score = 0
    const titleLower = post.title.toLowerCase()
    const summaryLower = post.summary.toLowerCase()
    const tagsLower = post.tags.map(t => t.toLowerCase())

    // 标题匹配（权重最高）
    for (const keyword of keywords) {
      if (titleLower.includes(keyword)) {
        score += 10
      }
    }

    // 摘要匹配（权重中等）
    for (const keyword of keywords) {
      if (summaryLower.includes(keyword)) {
        score += 5
      }
    }

    // 标签匹配（权重高）
    for (const keyword of keywords) {
      for (const tag of tagsLower) {
        if (tag.includes(keyword)) {
          score += 8
        }
      }
    }

    if (score > 0) {
      scoredPosts.push({ post, score })
    }
  }

  // 按分数降序排序
  scoredPosts.sort((a, b) => b.score - a.score)

  return scoredPosts.map(item => item.post)
}
```

#### 后果
**正面影响**：
- 搜索准确率 ≥95%
- 搜索响应时间 ≤100ms
- 用户体验优秀

**负面影响**：
- 需要实现搜索算法
- 需要优化搜索性能

#### 替代方案
- **精确匹配**：不选择，灵活性差
- **第三方搜索库**：不选择，增加依赖，性能不一定更好
- **服务端搜索**：不选择，增加复杂度，MVP 阶段不需要

---

### ADR-007: 测试策略

**状态**: 已接受
**日期**: 2026-1-22
**决策者**: BMAD Architect (Winston)

#### 上下文
项目需要建立完整的测试体系，确保代码质量和系统稳定性，单元测试覆盖率 ≥80%。

#### 决策
采用「Vitest 单元测试 + Playwright E2E 测试 + Lighthouse 性能测试」综合测试策略。

#### 理由
1. **Vitest 单元测试**：
   - Vue 3 官方推荐
   - 与 Vite 深度集成
   - 快速启动，并行执行
   - 支持 TypeScript

2. **Playwright E2E 测试**：
   - 跨浏览器支持
   - 自动化测试关键流程
   - 浏览器截图对比
   - 支持并行执行

3. **Lighthouse 性能测试**：
   - Google 官方性能评估工具
   - 自动化性能审计
   - 性能指标监控
   - 性能回归检测

#### 实现方案
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80
    }
  }
})

// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ]
})
```

#### 后果
**正面影响**：
- 单元测试覆盖率 ≥80%
- 关键流程端到端测试通过
- Lighthouse 评分 ≥90 分
- 代码质量提升

**负面影响**：
- 需要编写测试用例
- 增加开发时间
- 需要维护测试代码

#### 替代方案
- **仅单元测试**：不选择，无法覆盖端到端流程
- **仅 E2E 测试**：不选择，无法覆盖单元测试
- **手动测试**：不选择，效率低，不可靠

---

## 三、组件架构设计

### 3.1 组件层次结构

```
App.vue
├── Header.vue (通用)
│   ├── Logo.vue
│   ├── Navigation.vue
│   ├── ThemeToggle.vue
│   └── MobileMenu.vue
├── RouterView
│   ├── Home.vue
│   │   ├── HeroSection.vue
│   │   ├── TechStack.vue
│   │   └── FeaturedProjects.vue
│   ├── Projects.vue
│   │   ├── ProjectFilter.vue
│   │   ├── ProjectSort.vue
│   │   └── ProjectCard.vue
│   ├── ProjectDetail.vue
│   │   ├── ProjectInfo.vue
│   │   ├── ProjectGallery.vue
│   │   └── ProjectTechStack.vue
│   ├── Skills.vue
│   │   ├── SkillCategory.vue
│   │   ├── SkillBar.vue
│   │   └── SkillRadar.vue
│   ├── Blog.vue
│   │   ├── BlogFilter.vue
│   │   ├── BlogSearch.vue
│   │   └── BlogCard.vue
│   ├── BlogDetail.vue
│   │   ├── BlogContent.vue
│   │   ├── BlogTOC.vue
│   │   └── BlogRelated.vue
│   ├── About.vue
│   │   ├── ProfileSection.vue
│   │   ├── ExperienceSection.vue
│   │   └── ContactSection.vue
│   └── NotFound.vue
├── ThemePanel.vue (调色板交互面板)
│   ├── ColorSchemeSelector.vue
│   ├── UIStyleSelector.vue
│   ├── FontComboSelector.vue
│   └── ThemePreview.vue
└── Footer.vue (通用)
    ├── SocialLinks.vue
    ├── QuickLinks.vue
    └── Copyright.vue
```

### 3.2 组件设计原则

**单一职责**：每个组件只负责一个功能
**可复用性**：通用组件可在多处使用
**可组合性**：组件可以组合成复杂 UI
**Props 验证**：使用 TypeScript 类型验证
**事件通信**：使用 emit 进行父子通信
**插槽设计**：使用 slot 增强灵活性
**主题支持**：所有组件支持主题系统

### 3.3 核心组件设计

#### 3.3.1 Header.vue

**功能**：
- 导航菜单
- Logo 展示
- 主题切换
- 移动端菜单

**Props**：
```typescript
interface HeaderProps {
  logo?: string
  showThemeToggle?: boolean
  showMobileMenu?: boolean
}
```

**Events**：
```typescript
interface HeaderEmits {
  (e: 'theme-change', theme: 'light' | 'dark'): void
  (e: 'mobile-menu-toggle'): void
}
```

**主题支持**：
```vue
<template>
  <header
    class="header"
    :class="[
      `header--${uiStyle}`,
      `header--${colorScheme}`,
      { 'header--dark': darkMode }
    ]"
  >
    <!-- 内容 -->
  </header>
</template>
```

#### 3.3.2 ProjectCard.vue

**功能**：
- 项目信息展示
- 悬浮效果
- 点击跳转

**Props**：
```typescript
interface TechStackItem {
  name: string
  version: string
}

interface Project {
  id: string
  title: string
  description: string
  coverImage: string
  techStack: TechStackItem[]
  demoUrl?: string
  sourceUrl?: string
  featured: boolean
  completionDate: string
}

interface ProjectCardProps {
  project: Project
  showTags?: boolean
  lazy?: boolean
}
```

**主题支持**：
```vue
<template>
  <article
    class="project-card"
    :class="[
      `project-card--${uiStyle}`,
      `project-card--${colorScheme}`
    ]"
  >
    <!-- 内容 -->
  </article>
</template>
```

#### 3.3.3 BlogCard.vue

**功能**：
- 博客文章信息展示
- 悬浮效果
- 点击跳转

**Props**：
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

interface BlogCardProps {
  post: BlogPost
  showTags?: boolean
  lazy?: boolean
}
```

**主题支持**：
```vue
<template>
  <article
    class="blog-card"
    :class="[
      `blog-card--${uiStyle}`,
      `blog-card--${colorScheme}`
    ]"
  >
    <!-- 内容 -->
  </article>
</template>
```

#### 3.3.4 ThemePanel.vue

**功能**：
- 配色方案选择
- UI 风格选择
- 字体组合选择
- 实时预览

**Props**：
```typescript
interface ThemePanelProps {
  position?: 'fixed' | 'absolute'
  defaultOpen?: boolean
}
```

**Events**：
```typescript
interface ThemePanelEmits {
  (e: 'close'): void
}
```

**主题支持**：
```vue
<template>
  <aside
    class="theme-panel"
    :class="[
      `theme-panel--${uiStyle}`,
      { 'theme-panel--open': isOpen }
    ]"
  >
    <!-- 内容 -->
  </aside>
</template>
```

---

## 四、数据流设计

### 4.1 数据流架构

采用「单向数据流」架构，数据从 Store 流向组件，用户操作通过 Actions 更新 Store。

```
User Interaction
    ↓
Component Event
    ↓
Store Action
    ↓
State Update
    ↓
Component Re-render
```

### 4.2 Store 模块设计

#### 4.2.1 useAppStore

**功能**：应用全局状态

**State**：
```typescript
interface AppState {
  theme: ThemeState
  loading: boolean
  menuOpen: boolean
}

interface ThemeState {
  colorScheme: ColorScheme
  uiStyle: UIStyle
  fontCombo: FontCombo
  darkMode: boolean
}
```

**Actions**：
```typescript
actions: {
  initTheme(): void
  setColorScheme(scheme: ColorScheme): void
  setUIStyle(style: UIStyle): void
  setFontCombo(combo: FontCombo): void
  toggleDarkMode(): void
  setLoading(loading: boolean): void
  toggleMenu(): void
}
```

#### 4.2.2 useProjectStore

**功能**：项目数据管理

**State**：
```typescript
interface ProjectState {
  projects: Project[]
  filteredProjects: Project[]
  selectedCategory: string | null
  sortBy: 'date' | 'complexity' | 'name'
  searchQuery: string
}
```

**Actions**：
```typescript
actions: {
  loadProjects(): Promise<void>
  filterByCategory(category: string): void
  sortByDate(): void
  sortByComplexity(): void
  sortByName(): void
  searchProjects(query: string): void
  getProjectById(id: string): Project | undefined
}
```

#### 4.2.3 useBlogStore

**功能**：博客数据管理

**State**：
```typescript
interface BlogState {
  posts: BlogPost[]
  currentPost: BlogPost | null
  selectedCategory: string | null
  selectedTags: string[]
  searchQuery: string
}
```

**Actions**：
```typescript
actions: {
  loadPosts(): Promise<void>
  loadPost(id: string): Promise<void>
  filterByCategory(category: string): void
  filterByTags(tags: string[]): void
  searchPosts(query: string): void
  getPostById(id: string): BlogPost | undefined
}
```

#### 4.2.4 useSkillStore

**功能**：技能数据管理

**State**：
```typescript
interface SkillState {
  skills: Skill[]
  categories: string[]
}

interface Skill {
  name: string
  level: number
  category: string
  version?: string
}
```

**Actions**：
```typescript
actions: {
  loadSkills(): Promise<void>
  getSkillsByCategory(category: string): Skill[]
}
```

### 4.3 数据持久化策略

**localStorage**：
- 主题设置（colorScheme、uiStyle、fontCombo、darkMode）
- 用户偏好

**SessionStorage**：
- 临时状态
- 表单数据

**内存**：
- 项目数据
- 技能数据
- 博客数据

---

## 五、状态管理设计

### 5.1 Pinia 状态管理架构

采用 Pinia 作为状态管理库，模块化设计，每个功能模块一个 Store。

```
stores/
├── index.ts          # Pinia 实例
├── useAppStore.ts    # 应用状态
├── useProjectStore.ts # 项目数据
├── useBlogStore.ts   # 博客数据
├── useSkillStore.ts  # 技能数据
└── types/            # 类型定义
    ├── theme.ts
    ├── project.ts
    ├── blog.ts
    └── skill.ts
```

### 5.2 状态管理最佳实践

**单一职责**：每个 Store 只负责一个功能模块
**TypeScript 类型安全**：所有 State 和 Actions 都有类型定义
**模块化设计**：Store 可以按功能拆分
**DevTools 支持**：支持 Vue DevTools 调试
**持久化**：关键状态持久化到 localStorage

### 5.3 状态更新流程

```
Component
    ↓
Dispatch Action
    ↓
Store Action
    ↓
Update State
    ↓
Component Re-render
    ↓
Update UI
```

---

## 六、性能策略

### 6.1 性能目标

| 指标 | 目标值 | 说明 |
|-----|-------|------|
| Lighthouse 评分 | ≥90 分 | 综合性能评分 |
| 首屏加载时间 (LCP) | ≤1.8s | 最大内容绘制 |
| 首次内容绘制 (FCP) | ≤1.2s | 首次内容可见 |
| 累积布局偏移 (CLS) | ≤0.1 | 布局稳定性 |
| 交互到下一次绘制 (INP) | ≤200ms | 交互响应速度 |
| 风格切换响应时间 | ≤100ms | 主题切换 |
| 页面跳转响应时间 | ≤100ms | 路由切换 |
| 文章搜索加载 | ≤300ms | 搜索结果 |
| 图片懒加载延迟 | ≤50ms | 图片加载 |

### 6.2 代码分割策略

**路由级代码分割**：
```typescript
const routes = [
  {
    path: '/',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/projects',
    component: () => import('@/views/Projects.vue')
  }
]
```

**组件级代码分割**：
```typescript
const HeavyComponent = defineAsyncComponent(() =>
  import('@/components/HeavyComponent.vue')
)
```

**第三方库代码分割**：
```typescript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vue-vendor': ['vue', 'vue-router', 'pinia'],
        'ui-vendor': ['lucide-vue-next', 'gsap'],
        'markdown': ['markdown-it', 'highlight.js']
      }
    }
  }
}
```

### 6.3 懒加载策略

**图片懒加载**：
```vue
<img
  :src="project.coverImage"
  :alt="project.title"
  loading="lazy"
  decoding="async"
/>
```

**组件懒加载**：
```typescript
const { observe, unobserve } = useIntersectionObserver(
  target,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      // 加载组件
    }
  }
)
```

### 6.4 虚拟列表策略

**长列表虚拟滚动**：
```vue
<VirtualList
  :items="items"
  :item-size="120"
  :buffer="5"
>
  <template #default="{ item }">
    <ProjectCard :project="item" />
  </template>
</VirtualList>
```

### 6.5 缓存策略

**浏览器缓存**：
```javascript
// vercel.json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**Service Worker 缓存**（可选）：
```javascript
// sw.js
const CACHE_NAME = 'my-website-v1'
const urlsToCache = ['/']

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  )
})
```

---

## 七、可扩展性设计

### 7.1 插件化架构

**Vite 插件**：
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    vue(),
    // 自定义插件
    customPlugin({
      // 配置
    })
  ]
})
```

### 7.2 主题系统扩展

**新增配色方案**：
```typescript
// config/color-schemes.ts
export const colorSchemes: Record<string, ColorSchemeConfig> = {
  'professional-minimal': {
    primary: '#6366F1',
    secondary: '#8B5CF6',
    accent: '#F59E0B',
    // ...
  },
  // 新增配色方案
  'new-scheme': {
    primary: '#...',
    secondary: '#...',
    accent: '#...',
    // ...
  }
}
```

**新增 UI 风格**：
```typescript
// config/ui-styles.ts
export const uiStyles: Record<string, UIStyleConfig> = {
  'glass-morphism': {
    // 配置
  },
  // 新增 UI 风格
  'new-style': {
    // 配置
  }
}
```

### 7.3 国际化扩展（可选）

**vue-i18n 配置**：
```typescript
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'zh',
  fallbackLocale: 'en',
  messages: {
    zh: {
      home: '首页',
      projects: '项目'
    },
    en: {
      home: 'Home',
      projects: 'Projects'
    }
  }
})
```

---

## 八、安全性设计

### 8.1 XSS 防护

**Vue 自动转义**：
- Vue 自动转义 HTML
- 使用 `v-html` 时要谨慎

**内容安全策略（CSP）**：
```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
/>
```

### 8.2 HTTPS

**强制 HTTPS**：
```typescript
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
  location.replace(`https:${location.href.substring(location.protocol.length)}`)
}
```

### 8.3 伦理约束

**AI 生成内容标注**：
- AI 生成内容需标注来源
- 避免虚假信息传播

**数据隐私保护**：
- 不收集敏感信息
- localStorage 仅存储用户偏好

**对抗性提示防御**：
- 结合 Context7 文档校验
- 过滤诱导生成违规代码的提示指令

---

## 九、部署策略

### 9.1 构建优化

**Vite 生产构建**：
```bash
npm run build
```

**构建输出**：
```
dist/
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [hash].png
└── index.html
```

### 9.2 部署方案

**静态站点托管**：
- Vercel（推荐）
- Netlify
- Cloudflare Pages

**Vercel 部署**：
```bash
npm install -g vercel
vercel
```

**vercel.json 配置**：
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### 9.3 CI/CD 流程

**GitHub Actions**：
```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 十、监控与分析

### 10.1 性能监控

**Web Vitals 集成**：
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

**Lighthouse CI**：
```bash
npm install -g @lhci/cli
lhci autorun
```

### 10.2 错误监控

**Sentry 集成**：
```typescript
import * as Sentry from '@sentry/vue'

Sentry.init({
  app,
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
})
```

---

## 十一、测试策略

### 11.1 单元测试

**Vitest 配置**：
```typescript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80
    }
  }
})
```

### 11.2 E2E 测试

**Playwright 配置**：
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ]
})
```

### 11.3 性能测试

**Lighthouse 定期审计**：
```bash
npm run lighthouse
```

---

## 十二、项目结构

### 12.1 目录结构

```
MyPersonalWebsite/
├── public/                    # 静态资源
│   ├── favicon.ico
│   ├── logo.png
│   └── images/               # 图片资源
├── src/
│   ├── assets/               # 资源文件
│   │   ├── styles/          # 全局样式
│   │   │   ├── main.css
│   │   │   ├── design-tokens.css
│   │   │   └── themes.css
│   │   └── data/            # 本地数据
│   │       ├── projects.json
│   │       ├── skills.json
│   │       └── blog-index.json
│   ├── components/          # 组件
│   │   ├── common/          # 通用组件
│   │   │   ├── Header.vue
│   │   │   ├── Footer.vue
│   │   │   └── Button.vue
│   │   ├── home/            # 首页组件
│   │   │   ├── HeroSection.vue
│   │   │   ├── TechStack.vue
│   │   │   └── FeaturedProjects.vue
│   │   ├── projects/        # 项目组件
│   │   │   ├── ProjectCard.vue
│   │   │   ├── ProjectFilter.vue
│   │   │   └── ProjectDetail.vue
│   │   ├── skills/          # 技能组件
│   │   │   ├── SkillBar.vue
│   │   │   └── SkillRadar.vue
│   │   ├── blog/            # 博客组件
│   │   │   ├── BlogCard.vue
│   │   │   ├── BlogList.vue
│   │   │   └── BlogDetail.vue
│   │   ├── theme/           # 主题组件
│   │   │   ├── ThemePanel.vue
│   │   │   ├── ColorSchemeSelector.vue
│   │   │   └── UIStyleSelector.vue
│   │   └── contact/         # 联系组件
│   │       ├── ContactForm.vue
│   │       └── SocialLinks.vue
│   ├── composables/         # 组合式函数
│   │   ├── useTheme.ts
│   │   ├── useScroll.ts
│   │   └── useIntersectionObserver.ts
│   ├── stores/              # 状态管理
│   │   ├── index.ts
│   │   ├── useAppStore.ts
│   │   ├── useProjectStore.ts
│   │   ├── useBlogStore.ts
│   │   └── useSkillStore.ts
│   ├── router/              # 路由
│   │   └── index.ts
│   ├── views/               # 页面
│   │   ├── Home.vue
│   │   ├── Projects.vue
│   │   ├── ProjectDetail.vue
│   │   ├── Skills.vue
│   │   ├── Blog.vue
│   │   ├── BlogDetail.vue
│   │   ├── About.vue
│   │   └── NotFound.vue
│   ├── types/               # 类型定义
│   │   ├── theme.ts
│   │   ├── project.ts
│   │   ├── blog.ts
│   │   └── skill.ts
│   ├── utils/               # 工具函数
│   │   ├── format.ts
│   │   ├── validate.ts
│   │   ├── search.ts
│   │   ├── logger.ts
│   │   └── seo.ts
│   ├── config/              # 配置文件
│   │   ├── color-schemes.ts
│   │   ├── ui-styles.ts
│   │   └── font-combos.ts
│   ├── App.vue              # 根组件
│   └── main.ts              # 入口文件
├── tests/                   # 测试
│   ├── unit/               # 单元测试
│   └── e2e/                # E2E 测试
├── docs/                    # 文档
│   ├── PRD.md
│   ├── Epics.md
│   ├── solution-architecture.md
│   └── ...
├── scripts/                 # 脚本
│   ├── build-sitemap.js
│   └── generate-performance-report.js
├── .eslintrc.cjs           # ESLint 配置
├── .prettierrc.json        # Prettier 配置
├── .gitignore              # Git 忽略文件
├── index.html              # HTML 模板
├── package.json            # 项目依赖
├── tsconfig.json           # TypeScript 配置
├── tsconfig.node.json      # Node TypeScript 配置
├── vite.config.ts          # Vite 配置
├── tailwind.config.js      # Tailwind 配置
├── postcss.config.js       # PostCSS 配置
├── vitest.config.ts        # Vitest 配置
└── playwright.config.ts    # Playwright 配置
```

---

## 十三、下一步行动

### 13.1 立即行动（Phase 4: Implementation）

1. **创建项目基础结构**（1 天）
   - 初始化项目（已完成）
   - 配置 Vite、TypeScript、Tailwind CSS（已完成）
   - 配置 ESLint、Prettier、Husky（已完成）
   - 创建目录结构

2. **实现核心组件**（2-3 天）
   - Header、Footer
   - 路由配置
   - 状态管理（Pinia Stores）
   - 主题系统基础

3. **实现页面功能**（3-5 天）
   - 首页
   - 项目页
   - 项目详情页
   - 技能页
   - 博客页
   - 博客详情页
   - 关于页

4. **实现调色板功能**（2-3 天）
   - 配色方案切换
   - UI 风格切换
   - 字体组合切换
   - 主题交互面板

5. **性能优化**（2-3 天）
   - 代码分割
   - 懒加载
   - 虚拟列表
   - 缓存优化

6. **测试与部署**（2-3 天）
   - 单元测试
   - E2E 测试
   - 性能测试
   - 部署上线

### 13.2 后续行动（迭代阶段）

1. **AI 内容生成**（迭代功能）
   - AI 辅助创作
   - 提示词模板
   - 风格适配

2. **暗黑模式**（迭代功能）
   - 暗黑模式切换
   - 系统主题检测
   - 配色联动

3. **阅读统计**（迭代功能）
   - 阅读量统计
   - 数据可视化
   - 隐私保护

---

## 十四、附录

### 14.1 参考文档

- [PRD.md](./PRD.md) - 产品需求文档
- [Epics.md](./Epics.md) - Epic 列表
- [technical-architecture.md](./technical-architecture.md) - 技术架构文档
- [ui-design-system.md](./ui-design-system.md) - UI 设计系统规范
- [BMAD 方法论](../../bmad/docs/iflow-instructions.md) - BMAD 开发方法论

### 14.2 工具链

- **开发工具**：VSCode
- **浏览器**：Chrome DevTools
- **包管理器**：npm
- **版本控制**：Git
- **CI/CD**：GitHub Actions
- **部署**：Vercel

### 14.3 变更记录

| 版本 | 日期 | 变更内容 | 变更人 |
|------|------|----------|--------|
| v1.0.0 | 2026-01-22 | 初始版本，完整的解决方案架构文档 | Winston (BMAD Architect) |

---

**解决方案架构设计结束**

**下一步**：开始 Phase 4: Implementation - Story-based 开发流程实施

**当前状态**：Phase 3 Solutioning 已完成

**待办事项**：
- [ ] 运行 3-solutioning 工作流（已完成）
- [ ] 生成 solution-architecture.md（已完成）
- [ ] 开始 Phase 4: Implementation