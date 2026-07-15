---
title: Structured Outputs：让 AI 返回值从“像 JSON”变成可验证接口
date: '2024-08-06'
updatedAt: '2026-07-15'
author: 佘杰
tags:
  - AI 工程
  - Structured Outputs
  - 类型安全
category: AI 工程
readTime: 10
coverImage: /images/projects/blog-system.svg
excerpt: 从 2024 年 Structured Outputs 的发布理解 AI 功能的接口设计：模型负责生成候选结果，Schema 负责约束结构，业务代码仍负责权限、事实和副作用验证。
---

> 本文是 2026 年回看 2024 年 AI 工程变化的笔记。真正重要的转折不是模型“更会聊天”，而是输出开始能够进入传统软件的类型、校验和测试体系。

过去把大模型接入前端时，经常要求它“只返回 JSON”。这只是自然语言约定：模型可能增加解释、漏掉字段、改变枚举值，甚至返回语法正确但业务无效的数据。

Structured Outputs 将输出约束到开发者提供的 JSON Schema。它降低了解析失败和字段漂移，但不等于结果天然可信。

## 三层边界必须分开

```text
Schema 合法
  ≠ 业务规则合法
  ≠ 事实正确
  ≠ 获得执行权限
```

例如模型生成一个部署计划：Schema 可以保证 `environment` 是 `preview | production`，却不能证明当前用户有生产权限，也不能证明目标项目存在。

因此合理架构是：

1. 模型按 Schema 生成候选数据；
2. 服务端验证结构与业务规则；
3. 前端把结果展示为待确认状态；
4. 用户确认后，受控执行层才产生副作用；
5. 记录输入版本、Schema 版本和执行结果。

## 从 TypeScript 类型开始设计

```ts
interface ArticlePlan {
  title: string
  audience: 'beginner' | 'intermediate' | 'advanced'
  sections: Array<{
    heading: string
    objective: string
  }>
  needsHumanReview: boolean
}
```

对应 Schema 应关闭额外字段，并明确必填项和枚举：

```json
{
  "type": "object",
  "additionalProperties": false,
  "required": ["title", "audience", "sections", "needsHumanReview"],
  "properties": {
    "title": { "type": "string" },
    "audience": {
      "type": "string",
      "enum": ["beginner", "intermediate", "advanced"]
    },
    "sections": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["heading", "objective"],
        "properties": {
          "heading": { "type": "string" },
          "objective": { "type": "string" }
        }
      }
    },
    "needsHumanReview": { "type": "boolean" }
  }
}
```

Schema 不应直接从一个巨大的页面状态生成。先定义最小任务接口，模型只返回完成下一步需要的数据。

## 前端不要直接信任类型声明

即使 SDK 提供 TypeScript 泛型，网络边界的值仍然来自外部。类型声明改善开发体验，但运行时应继续验证：

```ts
function isArticlePlan(value: unknown): value is ArticlePlan {
  if (!value || typeof value !== 'object') return false
  const plan = value as Record<string, unknown>
  return typeof plan.title === 'string'
    && Array.isArray(plan.sections)
    && typeof plan.needsHumanReview === 'boolean'
}
```

生产项目更适合使用成熟的 Schema 校验器，但原则不变：在进入 Store 或组件前完成一次边界验证，不把 `unknown` 扩散到界面内部。

## 失败状态也应进入设计

AI 接口至少需要这些状态：

- 生成中；
- 结构化结果成功；
- 模型拒绝回答；
- Schema 不匹配；
- 超时或网络失败；
- 业务校验失败；
- 等待人工确认；
- 执行成功或回滚。

只设计“成功后显示卡片”，会让真实环境中的错误无法恢复。

## 适合 Structured Outputs 的场景

- 表单草稿与配置建议；
- 内容大纲、标签与摘要；
- 工具调用参数；
- 数据提取和分类；
- 需要进入后续代码流程的中间结果。

不适合把长篇创作强行拆成巨大 Schema，也不应该用它替代数据库约束、权限系统和事实核验。

## 一份工程验收清单

- Schema 有版本号且可以回滚；
- 关闭未声明的额外字段；
- 枚举和长度限制尽可能明确；
- 运行时再次校验外部结果；
- 拒绝、超时与不匹配都有 UI；
- 高风险副作用必须人工确认；
- 测试包含缺字段、错枚举和空数组；
- 日志不记录敏感原文；
- 评估准确率时区分结构成功与任务成功。

Structured Outputs 的价值，是把概率性模型放进确定性软件边界。它解决结构，不解决事实和权限；认清这条边界，AI 功能才会从演示变成可维护产品。

## 参考资料

- [Introducing Structured Outputs in the API](https://openai.com/index/introducing-structured-outputs-in-the-api/)
- [JSON Schema](https://json-schema.org/learn/getting-started-step-by-step)
- [TypeScript: Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
