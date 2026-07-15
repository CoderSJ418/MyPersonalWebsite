# 优化实施计划

> 创建日期: 2026-06-28
> 来源:  grill-with-docs 深度分析 + code review
> 状态: 规划完成，待执行

---

## 实施阶段划分

### 阶段一：视觉统一（Theme Unification）
- **1.1** FeaturedProjects.vue 内联 style → Tailwind `dark:` 全量迁移
- **1.2** TechStack.vue 内联 style → Tailwind `dark:` 迁移
- **1.3** 主题系统统一 — 消除所有 `var(--bg-*)` / `var(--text-*)` / `var(--color-*)` 依赖，全部改为 Tailwind utility
- **1.4** Education.vue / Experience.vue / About.vue 的 CSS 变量清理
- **1.5** 交互组件条件加载 — CustomCursor / PullToRefresh / VirtualScroll / ZoomableImage 桌面端加载，移动端跳过

### 阶段二：内容迁移（Content Migration）
- **2.1** 博客内容 → `.md` 文件 + YAML frontmatter（blog-index.json 拆分）
- **2.2** 项目/经历数据 → JSON 数据格式审查和清理
- **2.3** 安装 `@tailwindcss/typography` + BlogDetail.vue prose 改造
- **2.4** 搜索 UX 优化（已完成）
- **2.5** 联系表单 → Formspree 集成

### 阶段三：功能和 SEO（Features & SEO）
- **3.1** 创建真正的 ProjectDetail 组件（替代当前的 BlogDetail 借用）
- **3.2** JSON-LD 结构化数据 — Person schema
- **3.3** 面包屑导航
- **3.4** RSS feed 生成
- **3.5** SafeImage 强制图片 alt 文本

---

## 已完成项

- ✅ 搜索范围锁定博客 + UX 优化（SearchModal + useSearchStore 重构）
- ✅ useContactInfoStore missing ref import
- ✅ Contact.vue badge prop 绑定
- ✅ WorkExperience 类型对齐 JSON 数据结构
- ✅ CSS duration/transition 变量统一
- ✅ SafeImage loading="lazy"
- ✅ SocialLinks mailto 兼容
- ✅ Skills.vue SVG 路径修复

## 待实施项（8项）

| 阶段 | 项 | 优先级 |
|------|-----|--------|
| 一 | FeaturedProjects/TechStack Tailwind 迁移 | P1 |
| 一 | CSS 变量消除，纯 Tailwind dark: | P1 |
| 一 | 交互组件条件加载 | P2 |
| 二 | 博客 .md 文件迁移 | P1 |
| 二 | @tailwindcss/typography + prose | P2 |
| 二 | 联系表单 Formspree | P2 |
| 三 | ProjectDetail 真正组件 | P1 |
| 三 | SEO: JSON-LD + 面包屑 + RSS | P2 |
