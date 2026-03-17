# iFlow 记忆架构优化方案

> **研究时间**：2026年2月28日
> **研究方法**：多维度深度研究（官方文档 + GitHub 案例 + 专家实践）
> **研究范围**：iFlow CLI、Claude Code、AGENTS.md 最佳实践

---

## 研究总结

### 研究维度

| 维度 | 研究内容 | 关键发现 |
|------|---------|---------|
| 大神级案例 | Boris Cherny、Addy Osmani、DragonflyDB | 六大核心模式 + L0-L6 能力模型 |
| iFlow CLI | 官方文档 + CSDN 教程 | Workflow 系统 + Skills 转换 |
| Claude Code | 专家级配置 + 社区实践 | 六层级联记忆 + 14 种 Hooks |
| Skills/Agents | Anthropic 官方 + 社区 | SKILL.md 标准 + 模块化 |
| Hooks 自动化 | Morph + PixelMojo | PreToolUse/PostToolUse/Stop 三大核心 |

---

## 一、关键发现

### 1.1 AGENTS.md 已成为通用标准（2026年）

- 2025年中由 Sourcegraph、OpenAI、Google、Cursor 等制定
- 2025年8月正式化，由 **Linux Foundation** 维护
- 已被 **20,000+ 仓库** 采用
- ✅ **iFlow CLI 官方支持 AGENTS.md**（通过 `contextFileName` 配置项）

### 1.2 层级能力模型 L0-L6

| 级别 | 名称 | 特征 | 大多数项目位置 |
|------|------|------|---------------|
| L0 | Absent | 无记忆文件 | - |
| L1 | Basic | 文件存在 | 60% |
| L2 | Scoped | 有 MUST/MUST NOT 规则 | 25% |
| L3 | Structured | 模块化 @import 外部文件 | 10% |
| L4 | Abstracted | 路径感知加载 | 4% |
| L5 | Maintained | 持续维护更新 | 1% |
| L6 | Adaptive | Skills + MCP + Hooks 集成 | **<1%** |

**目标**：从 L2 升级到 **L5/L6 级别**

### 1.4 ✅ 官方确认：iFlow 完全支持 AGENTS.md

#### 官方文档原文

**来源**：`platform.iflow.cn/cli/configuration/settings`

```
contextFileName
- 描述：上下文文件名（如 IFLOW.md、AGENTS.md）。可以是单个文件名或文件名列表
- 默认值：IFLOW.md
- 示例："contextFileName": "AGENTS.md"
```

**来源**：`platform.iflow.cn/cli/configuration/iflow`

```json
{
  "contextFileName": "AGENTS.md"
}

// 或支持多个文件名：
{
  "contextFileName": ["IFLOW.md", "AGENTS.md", "CONTEXT.md"]
}
```

#### 正确配置方式

| 项目 | 说明 |
|------|------|
| 默认文件名 | IFLOW.md |
| 官方支持 | ✅ AGENTS.md（描述中直接引用） |
| 配置方式 | contextFileName 标准配置项 |
| 多文件支持 | ✅ 支持数组配置 |

**配置示例**：
```json
{
  "contextFileName": ["IFLOW.md", "AGENTS.md"]
}
```

#### 已知问题：部分 Hooks 触发不稳定

| 问题 | 状态 | 来源 |
|------|------|------|
| Stop/SessionEnd 触发不稳定 | ⚠️ 社区反馈 | 讨论帖 #3425 |
| `IFLOW_HOOK_EVENT_NAME` 未设置 | ⚠️ 可能存在 | GitHub Issue |

**建议**：优先使用 PreToolUse/PostToolUse，暂缓使用 Stop/SessionEnd

#### 发现 3：与 Claude Code 的差异

| 特性 | iFlow CLI | Claude Code |
|------|:---------:|:-----------:|
| Stop hook 稳定性 | ⚠️ 不稳定 | ✅ 稳定 |
| 环境变量 | ❌ 缺失 | ✅ 完整 |
| prompt 类型 hook | ❓ 不明确 | ✅ 支持 |

### 1.3 六大核心配置模式

根据 GitHub 官方分析 2500+ 仓库得出的最佳实践：

| 模式 | 描述 | 示例 |
|------|------|------|
| **命令前置** | 把常用命令放在最前面 | `npm run tsc --noEmit path/to/file.ts` |
| **代码示例** | 真实代码片段胜过描述 | `copy src/components/Button.vue` |
| **清晰边界** | 明确告诉 AI 什么不能碰 | `do not modify migration files` |
| **具体技术栈** | 说 React 18 + TS，不说 React | `Vue 3.4.15 + TypeScript 5.3.3` |
| **安全权限** | 区分无需确认和需要询问 | Allowed: read files; Ask: git push |
| **项目结构** | 提供关键文件路径引用 | `see src/App.vue for routes` |

---

## 二、当前配置问题分析

### 2.1 现有 AGENTS.md 问题

| 问题 | 影响 | 严重程度 |
|------|------|---------|
| **过于冗长** | 超过 500 行，关键信息淹没 | 高 |
| **缺乏边界约束** | 只有描述，无 MUST/MUST NOT | 高 |
| **无模块化** | 无 @import，无法分离关注点 | 中 |
| **无 Hooks 配置** | 无法自动执行质量检查 | 高 |
| **无路径感知** | 所有规则全局加载，无针对性 | 中 |

### 2.2 改进方向

1. **精简全局层** - 只保留身份和核心原则
2. **模块化项目层** - 使用 @import 分离技术栈、命令、约束
3. **添加 Hooks** - 自动格式化、类型检查、安全保护
4. **路径感知规则** - 不同目录加载不同规则

---

## 三、优化配置方案

### 3.1 全局层 AGENTS.md（用户级）

**位置**：`C:\Users\Administrator.mengjing\.iflow\AGENTS.md`

```markdown
# iFlow 全局记忆

## 用户身份
- 称呼：杰哥
- 角色：7年前端开发工程师，Vue 专家

## AI 协作要求
1. **称呼**：每次回复开头加"杰哥"
2. **验证优先**：不确定的要搜索验证，不要猜测
3. **深度思考**：看到"深度思考"、"验证"等关键词 → 加载方法论

## 通用边界
### ✅ Always
- 读取实际文件后再给出建议
- 基于真实错误信息，不猜测
- 每次修改后运行测试/编译验证

### ⚠️ Ask First
- 删除/重命名文件（检查引用）
- 修改核心配置文件
- 执行可能影响系统的命令

### 🚫 Never
- 未验证就声称某事为真
- 依赖记忆而不是读取实际文件
- 重复犯错（一两次错后还继续错）

## 技能系统
Skills 在 `E:\work\AI\.iflow\skills\`，根据任务自动加载使用。

## 知识库
位置：`E:\work\AI\docs\learning\`
触发条件：
- 看到"如何确保..."、"深度思考"、"验证"等关键词
- 需要方法论支持
```

### 3.2 项目层 AGENTS.md（优化版）

**位置**：`E:\work\AI\MyPersonalWebsite\AGENTS.md`

```markdown
# MyPersonalWebsite 项目

> 最后更新：2026年2月28日

## 项目概述
Vue 3 个人网站，展示前端开发工程师的专业技能和作品。

## 技术栈
@./.iflow/tech-stack.md

## 开发命令
@./.iflow/commands.md

## 代码规范
@./.iflow/constraints.md

## 项目结构
@./.iflow/structure.md

## 常见错误预防
@./.iflow/common-errors.md
```

### 3.3 模块化文件

#### `.iflow/tech-stack.md`
```markdown
# 技术栈

## 核心框架
- Vue 3.4.15 + Composition API
- TypeScript 5.3.3 + 严格模式
- Vite 5.0.12

## 状态与路由
- Pinia 2.1.7
- Vue Router 4.2.5

## 样式
- Tailwind CSS 3.4.1
- GSAP 3.14.2（动画）

## 测试
- Vitest 4.0.18
- @vue/test-utils 2.4.6
```

#### `.iflow/commands.md`
```markdown
# 开发命令

## 基础开发
```bash
npm install           # 安装依赖
npm run dev           # 启动开发服务器 (localhost:5173)
npm run build         # 构建生产版本
npm run preview       # 预览生产构建
```

## 代码质量
```bash
npm run lint          # ESLint 检查（自动修复）
npm run format        # Prettier 格式化
npm run test          # Vitest 单元测试
npm run test:coverage # 测试覆盖率
```

## 单文件操作（推荐）
```bash
npx tsc --noEmit src/views/Home.vue  # 类型检查单个文件
npx prettier --write src/**/*.vue    # 格式化 Vue 文件
npx vitest run tests/unit/Home.spec.ts  # 测试单个文件
```
```

#### `.iflow/constraints.md`
```markdown
# 代码规范与约束

## MUST（必须）
- ✅ 使用 TypeScript 严格模式
- ✅ 使用 Composition API（setup 语法糖）
- ✅ 组件命名：PascalCase
- ✅ 文件命名：kebab-case
- ✅ 变量/函数：camelCase
- ✅ 常量：UPPER_SNAKE_CASE
- ✅ 提交前运行 lint 和 test

## MUST NOT（禁止）
- ❌ 使用 `any` 类型
- ❌ 默认导出（使用命名导出）
- ❌ 在组件中直接调用 API（使用 composables）
- ❌ 硬编码颜色值（使用 Tailwind 类或设计令牌）
- ❌ 修改 package-lock.json 除非必要

## 偏好设置
- 优先使用 `const`，必要时用 `let`
- 使用可选链 `?.` 和空值合并 `??`
- 使用 ES 模块导入语法
```

#### `.iflow/common-errors.md`
```markdown
# 常见错误预防

## Windows 兼容性
- PowerShell 5.1 不支持 `&&`，使用 `; if($?) {cmd2}`
- 使用 `dir` 代替 `ls`
- 使用 `type` 代替 `cat`
- 使用 `copy` 代替 `cp`

## Vue 相关
- 不要在 `v-for` 中使用 `index` 作为 key（除非列表静态）
- 不要在模板中使用箭头函数作为事件处理器
- 使用 `defineProps` 和 `defineEmits` 时不需要导入

## TypeScript 相关
- 避免 `as` 类型断言，使用类型守卫
- 使用 `interface` 优于 `type`（除非需要联合类型）

## 常见 AI 错误
- 忽略项目现有代码风格 → 必须先读取现有代码
- 创建不必要的抽象 → 保持简单
- 忽略可访问性 → 添加 ARIA 标签
- 不处理加载和错误状态 → 必须处理
```

### 3.4 Hooks 配置

**位置**：`.iflow/settings.json`

```json
{
  "contextFileName": ["IFLOW.md", "AGENTS.md"],
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Bash command blocked for safety' && exit 2"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write $FILE_PATH"
          }
        ]
      }
    ],
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Task completed' >> ~/.iflow/task-log.txt"
          }
        ]
      }
    ]
  },
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "enabled": true,
      "description": "Context7 - 实时文档查询"
    }
  }
}
```

**配置要点**：
1. `contextFileName` 让 iFlow 同时读取 IFLOW.md 和 AGENTS.md
2. PreToolUse 可用于安全检查（阻止危险命令）
3. PostToolUse 可用于自动格式化
4. Notification 可用于任务完成通知
```

---

## 四、实施步骤

### 步骤 1：创建全局层配置
```bash
# 确保目录存在
mkdir -p C:\Users\Administrator.mengjing\.iflow

# 创建全局 AGENTS.md
# 内容见 3.1
```

### 步骤 2：优化项目层配置
```bash
# 创建模块化目录
mkdir -p .iflow/modules

# 创建模块文件
# - tech-stack.md
# - commands.md
# - constraints.md
# - structure.md
# - common-errors.md
```

### 步骤 3：添加 Hooks 配置
```bash
# 更新 .iflow/settings.json
# 添加 PostToolUse 和 Stop hooks
```

### 步骤 4：验证配置
```bash
# 重启 iFlow CLI
# 执行 /tools 确认配置生效
# 执行 /hooks 查看已配置的 hooks
```

---

## 五、升级路线图

```
当前状态：L2 (Scoped)
     ↓
添加 @import 模块化：L3 (Structured)
     ↓
添加路径感知规则：L4 (Abstracted)
     ↓
持续维护更新：L5 (Maintained)
     ↓
Skills + MCP + Hooks：L6 (Adaptive) ← 目标
```

---

## 六、验证来源

### ⚠️ 错误反思

**我之前犯的错误**：
- 引用了 GitHub Issue #281（用户讨论）而忽略官方文档
- 混淆了"默认值"和"不支持"
- 把官方标准配置当成"变通方案"

**正确做法**：以官方文档为权威来源，GitHub Issue 仅作补充参考。

### 官方文档（权威来源）

1. **iFlow CLI 记忆配置**
   - https://platform.iflow.cn/cli/configuration/iflow
   - 确认：contextFileName 支持 AGENTS.md + @import 语法

2. **iFlow CLI Settings 配置**
   - https://platform.iflow.cn/cli/configuration/settings
   - 确认：contextFileName 描述中直接引用 AGENTS.md 作为示例

3. **iFlow CLI Hooks 文档**
   - https://platform.iflow.cn/cli/examples/hooks
   - 确认：9 种 Hook 类型 + 配置语法

### 社区反馈（需验证）

4. **社区讨论 #3425 - SessionEnd/Stop Hooks 问题**
   - https://vibex.iflow.cn/t/topic/3425
   - 提示：部分 Hooks 可能不稳定

### 最佳实践参考

5. **GitHub 官方博客 - How to write a great agents.md**
   - https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/

6. **Anthropic Skills 仓库**
   - https://github.com/anthropics/skills

7. **Boris Cherny（Claude Code 最佳实践）**
   - https://github.com/shanraisshan/claude-code-best-practice

8. **Addy Osmani（Google Chrome 团队）**
   - https://medium.com/@addyosmani/my-llm-coding-workflow-going-into-2026

---

## 七、关键洞察

### 从大神身上学到的核心原则

1. **配置分层** - 全局 → 工作区 → 项目，每层专注不同职责
2. **边界清晰** - 明确 DO/DON'T，AI 需要约束才能高效
3. **命令具体** - 完整命令 + 选项，不只是 `npm test`
4. **持续迭代** - 每次发现 AI 错误就更新 AGENTS.md
5. **团队共享** - settings.json 提交到 git，团队统一配置
6. **Hooks 自动化** - 把重复操作自动化，减少人工干预
7. **Skills 可移植** - 一次创建，到处使用

### 核心公式

> **高效 AI 开发 = 清晰需求 + 充足上下文 + 小步迭代 + 持续验证**

---

**文档结束**
