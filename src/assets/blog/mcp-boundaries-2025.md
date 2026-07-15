---
title: MCP 工程化入门：协议解决连接，产品仍要解决信任
date: '2025-04-15'
updatedAt: '2026-07-15'
author: 佘杰
tags:
  - MCP
  - AI Agent
  - 安全边界
category: AI 工程
readTime: 10
coverImage: /images/projects/blog-2.svg
excerpt: 从 Host、Client、Server、Tools、Resources 与 Prompts 的职责出发理解 MCP，并用权限、输入校验、用户确认和审计规则约束真实工具连接。
---

> 本文是 2026 年回看 2025 年 MCP 生态快速普及后的工程笔记。MCP 让 AI 应用连接工具更标准，但“能连接”从来不等于“可以信任”。

Model Context Protocol（MCP）为 AI 应用与外部系统之间提供了标准协议。它统一了能力发现、工具调用和上下文读取的交互方式，使一个工具服务不必为每个 AI 客户端单独开发适配层。

最容易产生的误解，是把 MCP 当作“Agent 插件市场”。协议只定义通信方式，工具是否安全、数据是否可信、用户是否授权仍由产品和服务实现负责。

## 先记住四层结构

```text
Host
  用户正在使用的 AI 应用，管理权限和体验

Client
  Host 内与某个 MCP Server 建立连接的协议客户端

Server
  暴露 Tools、Resources、Prompts 等能力

外部系统
  文件、数据库、浏览器、GitHub、业务 API
```

不要把 Server 默认视为可信。它可能来自本地、企业内部或第三方，每个来源需要不同权限策略。

## Tools、Resources、Prompts 不应混用

### Tools

表示可以执行的动作，例如查询部署、创建草稿。工具可能产生副作用，因此需要严格 Schema、权限与确认。

### Resources

表示可以读取的上下文，例如项目规范、数据库 schema、只读报告。优先把稳定资料暴露为 Resource，而不是设计一个“读取任意路径”的万能工具。

### Prompts

表示可复用的工作流入口或模板。Prompt 可以改善使用体验，但它不是权限边界，不能依靠一句系统提示阻止危险工具调用。

## 一个好工具应该足够窄

不推荐：

```text
run_command(command: string)
```

更合适：

```text
get_deployment(project_id, deployment_id)
create_preview(project_id, commit_sha)
promote_preview(project_id, deployment_id, confirmation_token)
```

窄工具能限制输入、定义幂等性并记录明确审计事件。万能命令把全部安全问题转移给模型提示词，实际无法可靠控制。

## 权限应该分三次判断

1. **连接时**：是否信任这个 Server，允许暴露哪些能力；
2. **调用时**：当前用户与任务是否有权使用该工具；
3. **执行前**：高风险参数和实际影响是否需要再次确认。

例如“GitHub 已登录”只证明连接存在，不等于允许 Agent 合并任意仓库的 PR。

## 返回值也可能是不可信输入

工具返回的网页、Issue 或文档可能包含提示注入文本。Host 不应把外部内容提升为系统指令，也不应让一段检索结果自动扩大可用工具权限。

处理原则：

- 标记内容来源；
- 区分数据与指令；
- 限制返回大小；
- 对结构化字段再次校验；
- 高风险决策引用可验证证据；
- 不把密钥和隐私信息传给无关 Server。

## 本地 MCP 服务的最小设计

```text
能力：读取项目规范
输入：固定资源 URI
权限：只读
范围：当前工作区
输出：UTF-8 文本 + 版本摘要
失败：资源不存在 / 超出工作区 / 编码错误
审计：记录资源标识，不记录正文
```

这比暴露 `read_file(path)` 更安全，也更容易让多个 Agent 得到一致上下文。

## 上线前测试什么

- Server 不可用时 Host 能继续工作；
- 非法参数在执行前被拒绝；
- 路径和资源不能逃出授权范围；
- 只读工具不能通过组合调用产生写入；
- 用户取消确认后不发生副作用；
- 恶意 Resource 内容不能调用额外工具；
- 超时、重复请求和断线重连不会重复执行；
- 日志中没有 Token、Cookie 和原始敏感内容。

## 什么时候值得用 MCP

当多个 AI 客户端需要复用同一套能力，或工具需要标准化发现与授权时，MCP 很有价值。如果只有一个固定页面调用一个固定 API，普通类型化函数可能更简单。

协议减少适配成本，不能替代领域 API 设计。MCP 工程的质量最终仍取决于：工具是否足够窄、权限是否明确、失败是否可恢复。

## 参考资料

- [Model Context Protocol Introduction](https://modelcontextprotocol.io/docs/getting-started/intro)
- [MCP Architecture](https://modelcontextprotocol.io/docs/learn/architecture)
- [MCP Specification](https://modelcontextprotocol.io/specification/latest)
