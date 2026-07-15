---
title: TypeScript 5.8 模块系统笔记：别再用“能编译”判断 ESM 配置
date: '2025-02-28'
updatedAt: '2026-07-15'
author: 佘杰
tags:
  - TypeScript 5.8
  - ESM
  - Node.js
category: TypeScript
readTime: 9
coverImage: /images/projects/blog-2.svg
excerpt: 以 NodeNext、条件导出、verbatimModuleSyntax 和 erasableSyntaxOnly 为线索，建立浏览器应用、Node 脚本与库项目各自清晰的 TypeScript 模块边界。
---

> 本文是 2026 年回看 TypeScript 5.8 的工程笔记。ESM 问题难处理，不是因为配置项太多，而是开发环境、构建器、Node 与发布包可能采用不同的模块解释规则。

TypeScript 5.8 继续完善 Node 模块模式，并增加 `erasableSyntaxOnly` 等选项。对 Vue + Vite 项目来说，最重要的不是复制一份推荐 `tsconfig`，而是先回答代码最终由谁执行。

## 先区分三种工程

### 浏览器应用

源码由 Vite 解析和打包，TypeScript 主要负责类型检查。通常使用适合 bundler 的模块解析，不需要模仿 Node 的每一条文件扩展名规则。

### Node 脚本

例如 Sitemap、RSS 和内容生成器。它们可能被 Node 直接执行，必须遵守项目 `type`、文件扩展名和当前 Node 版本的真实行为。

### 发布给别人使用的库

库需要同时考虑 package exports、声明文件和消费者的解析环境。它是三者中最严格的场景，不能用“本仓库 Vite 能打包”证明发布正确。

## 为什么 `NodeNext` 会随版本变化

`node16`、`node18`、`nodenext` 等模式模拟对应 Node 的模块规则。`nodenext` 会跟随最新稳定 Node 行为演进，因此升级 TypeScript 后可能得到新的检查结果。

应用项目如果只需要 Vite 打包，可以使用：

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "verbatimModuleSyntax": true
  }
}
```

Node 直接运行的脚本则应采用与运行时相符的 Node 模式，而不是为了消除错误随意切换。

## `verbatimModuleSyntax` 让导入意图更清楚

```ts
import type { BlogPost } from './types.js'
import { loadPost } from './loader.js'
```

类型导入会在产物中被移除，值导入会被保留。显式 `import type` 能避免某个只用于类型的依赖意外进入运行时，也让循环依赖更容易审查。

## `erasableSyntaxOnly` 的价值

当运行时只删除类型、不转换 TypeScript 特有语法时，枚举、namespace 和参数属性等需要额外转换的语法可能造成兼容问题。`erasableSyntaxOnly` 可以限制代码只使用容易擦除的类型语法。

它适合希望让源码直接交给轻量运行时或 Node 类型擦除能力的项目。普通 Vite 应用不必为了“更现代”强制开启，但可以借它检查代码是否依赖重型 TypeScript 运行时转换。

## 条件导出是库的真实入口

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  }
}
```

类型检查使用哪个声明文件、Node 加载哪个 JavaScript 文件、Vite 是否选择浏览器条件，都由 package exports 参与决定。调试依赖问题时应检查实际解析结果，不要只看 `main` 字段。

## 常见失败模式

- Vite 开发正常，Node 构建脚本找不到扩展名；
- 测试环境使用 CommonJS，应用使用 ESM；
- `import type` 缺失导致运行时循环依赖；
- 库声明文件指向不存在的路径；
- 为解决一个工具报错，同时降级 TypeScript、Vite 和插件，最后不知道根因；
- 本地 Node 与部署 Node 版本不同。

## 排查顺序

1. 确认失败代码由浏览器、构建器还是 Node 执行；
2. 记录 Node、TypeScript 和工具版本；
3. 检查最近的 package.json `type` 与 exports；
4. 使用最小文件复现导入；
5. 查看解析追踪，不凭经验猜目标文件；
6. 只调整一个配置假设；
7. 同时验证 typecheck、build、测试和直接 Node 脚本。

模块配置没有“全项目通用最佳答案”。最可靠的做法是让每一类代码的执行者明确，并用独立 tsconfig 或清晰目录隔离边界。

## 参考资料

- [Announcing TypeScript 5.8](https://devblogs.microsoft.com/typescript/announcing-typescript-5-8/)
- [TypeScript Modules Reference](https://www.typescriptlang.org/docs/handbook/modules/reference.html)
- [Node.js Packages](https://nodejs.org/api/packages.html)
