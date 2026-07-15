---
title: Tailwind CSS v4：CSS-first 之后，配置应该放在哪里
date: '2025-01-22'
updatedAt: '2026-07-15'
author: 佘杰
tags:
  - Tailwind CSS
  - CSS
  - 设计系统
category: CSS 工程
readTime: 9
coverImage: /images/projects/blog-1.svg
excerpt: 从 Tailwind CSS v4 的 CSS-first 配置、自动内容检测和现代 CSS 能力出发，讨论已有 Vue 项目何时值得升级，以及如何避免同时维护两套 Token。
---

> 本文是 2026 年回看 Tailwind CSS v4 的迁移笔记。新版本很快，但已有项目是否升级，取决于它能否简化设计系统，而不是取决于发布宣传里的构建数字。

Tailwind CSS v4 在 2025 年 1 月发布。最明显的变化是配置中心从 JavaScript 文件转向 CSS，框架也更充分地利用级联层、自定义属性和 `color-mix()` 等现代 CSS 能力。

## CSS-first 改变了什么

一个最小入口可以从：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

变成：

```css
@import "tailwindcss";

@theme {
  --color-brand-500: oklch(0.62 0.2 255);
  --font-sans: "Inter", sans-serif;
  --radius-card: 1rem;
}
```

配置靠近 CSS 的好处，是设计 Token 可以直接成为标准自定义属性，组件与工具类共享同一来源。风险是：如果项目已经有一套 `design-tokens.css`，迁移时很容易再复制一套 `@theme` 值，形成两个真相源。

## 先决定 Token 的唯一权威

已有设计系统可以选其中一种策略：

1. `@theme` 是唯一来源，组件只消费生成的变量与工具类；
2. 既有 Token 文件是唯一来源，`@theme` 只建立引用关系；
3. 暂不迁移，继续使用 v3，直到重复 Token 能被消除。

最差方案是为了兼容旧组件，把相同颜色同时写在 Tailwind 配置、CSS 变量和组件局部样式里。

## 自动内容检测不是零配置魔法

v4 可以自动发现项目文件，减少 `content` 数组维护。但动态拼接类名的问题仍然存在：

```ts
// 构建器无法可靠发现完整类名
const colorClass = `text-${color}-600`

// 使用完整映射
const colorClasses = {
  blue: 'text-blue-600',
  emerald: 'text-emerald-600',
} as const
```

自动检测解决文件路径，不解决运行时字符串生成。组件 API 应把视觉变体映射到完整类名，并用联合类型限制取值。

## 为什么升级可能影响浏览器范围

v4 依赖更现代的 CSS 平台能力。升级前应确认项目的最低浏览器要求，不要只验证自己的最新版 Chrome。企业内网、旧 WebView 或特殊设备可能更适合继续使用 v3。

需要同时检查：

- `@property`、`color-mix()` 等能力范围；
- PostCSS 与 Vite 插件配置；
- 第三方组件是否依赖 v3 行为；
- 自定义 utilities 与插件迁移方式；
- 生产 CSS 顺序和重置样式差异。

## 一个可控的迁移顺序

1. 锁定当前页面截图与 CSS 体积基线；
2. 在独立分支运行官方升级工具；
3. 先让构建通过，不同时调整视觉；
4. 对照 Token，删除重复定义；
5. 检查动态类名、插件和 prose 样式；
6. 验证表单、Markdown、弹层和响应式页面；
7. 对比构建时间与产物，而不是相信理论收益；
8. 确认目标浏览器后再合并。

## 对组件化真正有帮助的变化

Tailwind 不应该让组件变成一长串不可理解的类名。稳定做法是：

- 布局和间距使用工具类；
- 品牌值来自命名 Token；
- 交互状态保留在组件内部；
- 业务组件不发明新的颜色体系；
- 重复的多类组合收敛到基础组件，而不是复制。

v4 的 CSS-first 能强化这个方向，但不会自动完成架构。升级是否成功，应以“删除了多少重复配置、组件是否更容易理解”衡量。

## 什么时候暂缓升级

- 当前 v3 稳定且没有配置痛点；
- 浏览器范围不满足要求；
- 项目存在大量未测试的自定义插件；
- 正在同时进行品牌改版；
- 没有时间完成全站视觉回归。

工具链升级不是产品功能。它应该降低未来成本，而不是制造一次无法解释的大规模样式变化。

## 参考资料

- [Tailwind CSS v4.0](https://tailwindcss.com/blog/tailwindcss-v4)
- [Tailwind CSS Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Tailwind CSS Theme Variables](https://tailwindcss.com/docs/theme)
