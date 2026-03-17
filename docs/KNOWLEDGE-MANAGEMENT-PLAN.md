# AI 工作区知识管理方案

> 最后更新：2026年2月28日
> 状态：经深度调研和批判性验证的最终版
> 数据来源：iFlow CLI 官方文档、Gemini CLI 文档、Memory MCP 官方文档

---

## 一、核心发现

### 1.1 iFlow CLI 原生能力（基于实际验证）

**数据来源：在 iFlow CLI 中执行 `/tools` 命令获取的实际工具列表**

```
iFlow CLI 原生工具（共 20 个）：
├── 文件操作（7个）
│   ├── Read File          # 读取单个文件
│   ├── Read Files         # 读取多个文件
│   ├── Write File         # 写入文件
│   ├── Edit               # 编辑文件
│   ├── Glob               # 查找文件
│   ├── list_directory     # 列出目录
│   └── Read Image         # 读取图片
├── 搜索与网络（3个）
│   ├── Search             # 搜索文件内容
│   ├── Web Search         # 网络搜索
│   └── Fetch              # 获取网页内容
├── 终端操作（1个）
│   └── Shell              # 执行终端命令
├── 记忆功能（1个）
│   └── save_memory        # 保存记忆到 IFLOW.md
├── 任务管理（5个）
│   ├── Plan               # 创建规划
│   ├── Read Plan          # 读取规划
│   ├── Exit Plan          # 退出规划
│   ├── task               # 执行子任务
│   └── Skill              # 调用技能
└── 其他（3个）
    ├── Ask Question       # 向用户提问
    ├── Read Command Output# 读取后台命令输出
    └── xml_escape         # XML 转义
```

### 1.2 关键区分：两种不同的"记忆"

| 特性 | iFlow 原生 save_memory | Memory MCP |
|------|------------------------|------------|
| **本质** | 文本追加到 Markdown 文件 | 结构化知识图谱 |
| **存储** | `~/.iflow/IFLOW.md` | `memory.jsonl` |
| **数据模型** | 纯文本 | 实体-关系-观察 |
| **查询能力** | ❌ 无（只能读全文） | ✅ `search_nodes`, `read_graph` |
| **关系支持** | ❌ 不支持 | ✅ `create_relations` |
| **工具数量** | 1 个（save_memory） | 10 个（完整 CRUD） |

**结论：两者功能不同，互补而非替代。**

---

## 二、Memory MCP 的工具清单

根据 NPM 官方文档，Memory MCP 提供以下工具：

```
Memory MCP 工具：
├── 写入操作
│   ├── create_entities      # 创建实体
│   ├── create_relations     # 创建关系
│   └── add_observations     # 添加观察
├── 读取操作
│   ├── read_graph           # 读取整个图谱
│   ├── search_nodes         # 搜索节点
│   └── open_nodes           # 打开特定节点
└── 删除操作
    ├── delete_entities      # 删除实体
    ├── delete_observations  # 删除观察
    └── delete_relations     # 删除关系
```

---

## 三、使用场景分析

### 3.1 iFlow 原生 save_memory 适用场景

```
✅ 适用：
- 用户偏好（如称呼"杰哥"）
- 简单的个人设置
- 跨项目的通用偏好
- 需要版本控制的个人配置

示例：
save_memory("用户称呼：杰哥")
→ 写入 ~/.iflow/IFLOW.md
```

### 3.2 Memory MCP 适用场景

```
✅ 适用：
- 项目间的关联关系（如"MyPersonalWebsite 使用 Vue3"）
- 技术概念的层级结构
- 需要查询的复杂知识网络
- AI 需要推理的关系型数据

示例：
create_entities([{name: "Vue3", entityType: "framework"}])
create_relations([{from: "MyPersonalWebsite", to: "Vue3", relationType: "uses"}])
→ 可查询：search_nodes("Vue") 返回所有相关项目
```

---

## 四、推荐的 MCP 配置

### 4.1 当前配置（来自 .iflow/settings.json）

```json
{
  "mcpServers": {
    "playwright": { "enabled": true },
    "desktop-commander": { "enabled": true },
    "memory": { "enabled": true },
    "chrome-devtools": { "enabled": true },
    "context7": { "enabled": true },
    "filesystem": { "enabled": true }
  }
}
```

### 4.2 与 iFlow 内置能力对比

| MCP 工具 | iFlow 原生对应 | 重叠程度 | 建议 |
|----------|----------------|----------|------|
| filesystem | Read File, Write File, Glob, list_directory, Search | **100%** | ❌ 可移除 |
| desktop-commander | Shell | **100%** | ❌ 可移除 |
| playwright | 无浏览器自动化工具 | **0%** | ✅ 保留 |
| memory | save_memory（功能不同，详见对比） | **0%** | ✅ 保留 |
| context7 | 无 | **0%** | ✅ 保留 |
| chrome-devtools | 无 | **0%** | ✅ 保留 |

### 4.3 推荐精简配置

```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "enabled": true,
      "description": "知识图谱 - 结构化记忆，支持实体关系查询"
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "enabled": true,
      "description": "文档查询 - 实时获取编程库最新文档"
    },
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"],
      "enabled": true,
      "description": "性能分析 - Chrome 开发者工具"
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"],
      "enabled": true,
      "description": "浏览器自动化 - E2E 测试"
    }
  }
}
```

---

## 五、知识分层管理方案

### 5.1 四层架构

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: 指令层（AGENTS.md / IFLOW.md）                     │
│ 工具：iFlow 原生支持                                         │
│ 用途：告诉 AI 如何工作（开发指令、偏好设置）                 │
│ 维护：开发者手动编辑                                         │
├─────────────────────────────────────────────────────────────┤
│ Layer 2: 决策层（docs/decisions/）                          │
│ 工具：Markdown + Git                                        │
│ 用途：记录架构决策（ADR 格式）                               │
│ 维护：重要变更时手动记录                                     │
├─────────────────────────────────────────────────────────────┤
│ Layer 3: 参考层（docs/learning/）                           │
│ 工具：Markdown + iFlow glob/search                          │
│ 用途：存储通用知识、最佳实践                                 │
│ 维护：按需更新，允许过时                                     │
├─────────────────────────────────────────────────────────────┤
│ Layer 4: 自动层（Memory MCP）                               │
│ 工具：create_entities, create_relations                     │
│ 用途：AI 自动记录的项目关联、技术关系                        │
│ 维护：AI 自动，开发者偶尔审查                                │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 各层使用指南

#### Layer 1：指令层
```
文件：AGENTS.md（项目级）/ ~/.iflow/IFLOW.md（全局级）
内容：
- 开发命令（npm run dev）
- 代码风格偏好
- 项目特定规则

示例：
# 项目配置
## 开发命令
- 开发: npm run dev
- 构建: npm run build
- 测试: npm run test

## 代码风格
- 使用 TypeScript 严格模式
- 组件采用 Composition API
```

#### Layer 2：决策层
```
文件：docs/decisions/ADR-001-技术选型.md
格式：ADR (Architecture Decision Record)

示例：
# ADR-001: 选择 Vue 3 作为前端框架

## 状态
已接受

## 背景
需要为个人网站选择前端框架...

## 决策
选择 Vue 3，原因如下：
1. 熟悉度高
2. Composition API 灵活
3. 生态完善

## 后果
- 需要学习 Vue 3 新特性
- 可以复用 Vue 2 经验
```

#### Layer 3：参考层
```
文件：docs/learning/experience-library.md
内容：
- 问题解决方案
- 最佳实践
- 经验教训

示例：
# 经验库

## 前端性能优化
- 图片懒加载
- 代码分割
- 缓存策略

## 常见问题解决
- Vue 3 响应式问题 → 使用 toRefs
- TypeScript 类型推断失败 → 显式类型注解
```

#### Layer 4：自动层（Memory MCP）
```
工具调用：
create_entities([
  {name: "MyPersonalWebsite", entityType: "project", 
   observations: ["Vue 3.4.15 个人网站", "使用 Tailwind CSS"]}
])

create_relations([
  {from: "MyPersonalWebsite", to: "Vue3", relationType: "uses"},
  {from: "MyPersonalWebsite", to: "TailwindCSS", relationType: "uses"}
])

查询：
search_nodes("Vue") → 返回所有使用 Vue 的项目
read_graph() → 查看完整知识图谱
```

---

## 六、实际操作建议

### 6.1 简单偏好 → 用 iFlow 原生 save_memory

```
场景：记录用户称呼
操作：save_memory("用户称呼：杰哥")
结果：写入 ~/.iflow/IFLOW.md
```

### 6.2 复杂关系 → 用 Memory MCP

```
场景：记录项目技术栈关系
操作：
  create_entities([...])
  create_relations([...])
结果：可查询的知识图谱
```

### 6.3 重要决策 → 用 Markdown 文档

```
场景：记录架构决策
操作：创建 docs/decisions/ADR-xxx.md
结果：Git 版本控制，人类可读
```

---

## 七、配置文件修改建议

移除冗余的 MCP 配置，精简为：

```json
{
  "mcpServers": {
    "memory": { "enabled": true },
    "context7": { "enabled": true },
    "chrome-devtools": { "enabled": true },
    "playwright": { "enabled": true }
  }
}
```

**移除理由**：
- `filesystem`：iFlow 已内置 read_file, write_file, glob 等
- `desktop-commander`：iFlow 已内置 run_shell_command

---

## 八、总结

| 问题 | 答案 |
|------|------|
| Memory MCP 是否必要？ | **必要**，它与 iFlow 原生 save_memory 功能不同 |
| filesystem/desktop-commander 是否必要？ | **不必要**，iFlow 已内置相同功能 |
| 如何管理知识？ | **四层架构**：指令层、决策层、参考层、自动层 |

---

## 九、快速决策工具

### 9.1 记忆工具选择流程图

```
                    ┌─────────────────────────────┐
                    │ 需要记录什么类型的信息？     │
                    └──────────────┬──────────────┘
                                   │
           ┌───────────────────────┼───────────────────────┐
           │                       │                       │
           ▼                       ▼                       ▼
    ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
    │ 简单偏好     │       │ 项目关联     │       │ 重要决策     │
    │ （如称呼）   │       │ 技术栈关系   │       │ 架构选择     │
    └──────┬───────┘       └──────┬───────┘       └──────┬───────┘
           │                       │                       │
           ▼                       ▼                       ▼
    ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
    │ save_memory  │       │ Memory MCP   │       │ Markdown     │
    │ (iFlow 原生) │       │ create_      │       │ ADR 格式     │
    │              │       │ entities     │       │              │
    └──────────────┘       └──────────────┘       └──────────────┘
```

### 9.2 具体示例对照

| 场景 | 使用工具 | 原因 |
|------|----------|------|
| 记录用户称呼"杰哥" | `save_memory` | 简单文本偏好 |
| 记录"MyPersonalWebsite 使用 Vue3" | `create_entities` + `create_relations` | 项目与技术的关系 |
| 记录选择 Vue3 的原因 | Markdown ADR | 需要版本控制和人类可读 |
| 记录代码风格偏好 | AGENTS.md | 指令层，每次对话加载 |

---

## 十、配置迁移指南

### 10.1 当前配置（需修改）

```json
// .iflow/settings.json 当前状态
{
  "mcpServers": {
    "playwright": { "enabled": true },
    "desktop-commander": { "enabled": true },  // ← 建议移除
    "memory": { "enabled": true },
    "chrome-devtools": { "enabled": true },
    "context7": { "enabled": true },
    "filesystem": { "enabled": true }  // ← 建议移除
  }
}
```

### 10.2 推荐配置

```json
// 精简后的 .iflow/settings.json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "enabled": true
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "enabled": true
    },
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"],
      "enabled": true
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"],
      "enabled": true
    }
  }
}
```

### 10.3 迁移步骤

```bash
# 1. 备份现有配置
copy .iflow\settings.json .iflow\settings.json.backup

# 2. 编辑配置文件
# 移除 "filesystem" 和 "desktop-commander" 条目

# 3. 重启 iFlow CLI 验证
iflow
> /mcp list  # 确认 MCP 服务器正常加载
```

---

## 十一、数据备份策略

### 11.1 Memory MCP 数据

```bash
# memory.jsonl 默认位置
# Windows: %USERPROFILE%\.mcp\memory.jsonl
# 或项目目录下的 memory.jsonl

# 备份建议：
# 方案 A：定期手动备份
copy memory.jsonl memory.jsonl.backup

# 方案 B：纳入 Git（如果数据不敏感）
# 在 .gitignore 中排除或包含：
# !memory.jsonl  # 取消排除
```

### 11.2 AGENTS.md 和文档数据

```bash
# 这些文件应该纳入 Git 版本控制
git add AGENTS.md
git add docs/
git commit -m "docs: 更新知识管理文档"
```

---

## 十二、三次批判性验证结果

| 验证轮次 | 视角 | 发现的问题 | 处理方式 |
|----------|------|------------|----------|
| **第一次** | 事实核查 | 核心事实正确，需确认 iFlow 与 Gemini CLI 兼容性 | 已在文档中说明来源 |
| **第二次** | 实用性 | Layer 4 缺少使用指南，"移除"建议过于绝对 | 已添加决策流程图，改为"可选" |
| **第三次** | 完整性 | 缺少迁移指南和备份策略 | 已添加第九、十、十一章 |

---

## 附录：调研来源

1. **iFlow CLI 原生工具列表**：在 iFlow CLI 中执行 `/tools` 命令获取（2026年2月28日验证）
2. iFlow CLI 官方文档：https://platform.iflow.cn/cli/configuration/iflow
3. Memory MCP 官方文档：https://www.npmjs.com/package/@modelcontextprotocol/server-memory
4. AGENTS.md 标准：https://agents.md/

**重要说明**：iFlow CLI 与 Gemini CLI 工具列表不同，本文档已基于实际验证修正。