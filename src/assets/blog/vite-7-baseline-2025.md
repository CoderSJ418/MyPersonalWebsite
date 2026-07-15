---
title: Vite 7 与 Baseline：构建目标终于开始表达真实浏览器能力
date: '2025-06-24'
updatedAt: '2026-07-15'
author: 佘杰
tags:
  - Vite 7
  - Baseline
  - 浏览器兼容
category: 构建工程
readTime: 9
coverImage: /images/projects/blog-3.svg
excerpt: 解析 Vite 7 的 Node 要求和 baseline-widely-available 默认目标，并给出从业务浏览器矩阵反推构建目标、polyfill 与降级策略的方法。
---

> 本文是 2026 年回看 Vite 7 的迁移笔记。默认构建目标的变化看似只是配置更新，实际提醒我们：浏览器兼容应从业务用户出发，而不是永久复制一串版本号。

Vite 7 在 2025 年 6 月发布，提高了 Node.js 要求，并将默认浏览器目标调整为 `baseline-widely-available`。这让构建器可以用 Web Platform Baseline 描述一组已经广泛可用的能力，而不是长期维护手写浏览器版本列表。

## Baseline 解决的是共同语言

“支持现代浏览器”无法验证；“Chrome 90+”又会随时间失去业务意义。Baseline 用能力在主要浏览器中的可用时间建立共同定义。

`widely available` 不代表覆盖所有设备。它更适合没有特殊旧浏览器要求的新项目。企业系统、嵌入式 WebView 或特定地区用户仍然需要自定义目标。

## 构建目标不能替代运行时降级

Vite 的 `build.target` 控制语法转换范围，但不会自动补齐所有 Web API：

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'baseline-widely-available',
  },
})
```

这可以决定是否转换某些 JavaScript 语法，却不会自动为 `ResizeObserver`、View Transition 或其他运行时能力注入 polyfill。

兼容策略仍然有三层：

1. 构建目标处理语法；
2. 能力检测处理 Web API；
3. 产品降级保证核心任务可完成。

## Node 要求为什么会成为部署问题

工具链提高最低 Node 版本后，本地升级可能正常，CI 和 Vercel 构建却失败。需要同时检查：

- `.nvmrc` 或版本管理器配置；
- package.json engines；
- CI 镜像；
- 云平台项目设置；
- 本地全局 CLI 实际使用的 Node；
- `vue-tsc`、测试框架与插件兼容版本。

版本组合应该进入仓库文档，不要只存在某台开发机上。

## 从用户数据反推目标

合理流程是：

```text
真实访问环境
  → 产品最低支持范围
  → 关键能力缺口
  → build.target
  → polyfill / 渐进增强
  → 跨浏览器验收
```

如果还没有真实数据，可以先采用项目明确声明的浏览器基线，并把收集兼容数据列为发布后任务。不能因为数据缺失就默认支持所有旧环境，也不能直接放弃移动端。

## 升级 Vite 7 的验证矩阵

### 工具层

- Node 与包管理器版本；
- Vue 插件、TypeScript、`vue-tsc`；
- Vitest、Playwright、压缩与分析插件；
- 自定义 Vite 插件钩子。

### 产物层

- 初始 JavaScript 和最大异步 chunk；
- CSS 拆分与加载顺序；
- 动态 import 是否仍按路由分块；
- source map 与环境变量；
- Sitemap、RSS 等构建后脚本。

### 运行层

- 首页首次加载；
- 动态路由直接刷新；
- 表单、复制、搜索和筛选；
- 目标移动端和浏览器；
- reduced-motion 与触摸降级。

## 不该如何使用 Baseline

- 不把它写成“所有浏览器都支持”；
- 不因为默认值变化就删除项目兼容文档；
- 不用构建成功证明 Web API 可用；
- 不给装饰动画加载大型 polyfill；
- 不忽略低端设备的性能问题。

Baseline 让默认值更有依据，但最终支持范围仍是产品决策。Vite 7 最值得学习的是：工具默认值应该表达一个可解释的能力集合，而项目要明确什么时候接受默认、什么时候覆盖它。

## 参考资料

- [Announcing Vite 7](https://vite.dev/blog/announcing-vite7)
- [Vite Build Options](https://vite.dev/config/build-options)
- [Web Platform Baseline](https://web.dev/baseline)
