# iFlow CLI 能力参考文档

> **来源**：https://platform.iflow.cn/cli
> **更新日期**：2026-02-28
> **用途**：为 AI 提供完整的 iFlow CLI 能力参考，解决"不知道自己有什么能力"的问题

---

## 一、核心交互方式（4 种）

| 方式 | 语法 | 示例 |
|------|------|------|
| 自然语言 | 直接对话 | `帮我分析这个项目` |
| 斜杠命令 | `/command` | `/init`, `/help`, `/clear` |
| 文件引用 | `@路径` | `@src/App.tsx`, `@docs/` |
| Agent调用 | `$agent-type 任务` | `$code-reviewer 审查代码` |

---

## 二、斜杠命令完整列表

### 系统管理（8个）
| 命令 | 功能 |
|------|------|
| `/about` | 显示系统信息（版本、OS、模型） |
| `/auth` | 配置身份验证 |
| `/theme` | 自定义外观主题 |
| `/model` | 切换 AI 模型 |
| `/editor` | 配置外部编辑器 |
| `/privacy` | 显示隐私信息 |
| `/language` | 切换语言（zh-CN/en-US） |
| `/update` | 检查并更新 CLI |

### 会话控制（8个）
| 命令 | 功能 |
|------|------|
| `/chat` | 对话管理（保存/恢复/删除） |
| `/clear` | 清屏并重置对话历史 |
| `/compress` | AI 压缩对话历史为摘要 |
| `/memory` | 与 CLI 记忆系统交互 |
| `/restore` | 恢复到之前的检查点 |
| `/resume` | 恢复之前的会话 |
| `/quit` | 退出 CLI |
| `/cleanup-history` | 清理对话历史 |

### 工具集成（4个）
| 命令 | 功能 |
|------|------|
| `/ide` | 发现和连接 IDE 服务器 |
| `/mcp` | 管理 MCP 服务器和工具 |
| `/tools` | **列出所有可用内置工具** |
| `/extensions` | 显示当前活动的扩展 |

### 开发辅助（7个）
| 命令 | 功能 |
|------|------|
| `/init` | 分析项目并创建配置文件 |
| `/setup-github` | 配置 GitHub Actions |
| `/directory` | 管理工作空间目录 |
| `/export` | 导出对话历史 |
| `/copy` | 复制最后响应到剪贴板 |
| `/demo` | 启动演示模式 |
| `/qa` | 基于知识库的问答助手 |

### 监控调试（5个）
| 命令 | 功能 |
|------|------|
| `/stats` | 查看会话使用统计 |
| `/log` | 显示日志位置 |
| `/bug` | 提交错误报告 |
| `/help` | 打开帮助对话框 |
| `/docs` | 在浏览器中打开文档 |

### 扩展系统（4个）
| 命令 | 功能 |
|------|------|
| `/agents` | 管理个人、项目和内置代理 |
| `/commands` | 管理自定义命令 |
| `/vim` | 切换 vim 模式 |
| `/terminal-setup` | 配置终端多行输入 |

---

## 三、内置工具（白名单）

### 信息读取类（16个）
```
read_file, read, cat, head, tail      # 文件读取
list_directory, ls, dir, pwd          # 目录浏览
search_file_content, grep, find, glob # 搜索查找
git_status, git_log, git_diff         # Git 查询
```

### 任务管理类（6个）
```
todo_write, todo_read, todo_update    # 任务管理
exit_plan_mode, task                   # 流程控制
web_search                             # 网络搜索
```

### 文件编辑类（2个）
```
edit, write_file                       # 文件修改
```

### 查看实时工具列表
```
/tools    # 动态列出当前会话所有可用工具
```

---

## 四、执行模式（4 种）

| 模式 | 说明 | 适用场景 |
|------|------|----------|
| `yolo` | 默认允许所有操作 | 熟练用户、信任环境 |
| `plan` | 先规划，确认后执行 | 复杂任务、需要审慎 |
| `default` | 所有操作需确认 | 安全优先 |
| `autoEdit` | 文件操作自动执行 | 频繁文件编辑 |

**切换方式**：`shift + tab`

**配置方式**：
```json
// .iflow/settings.json
{
  "approvalMode": "smart"  // 启用智能审核模式
}
```

---

## 五、智能模式（三层审核架构）

```
用户请求 → 白名单检查 → 黑名单检查 → AI审核 → 执行决策
             (<1ms)       (<50ms)      (<5s)
```

- **白名单**：安全工具直接执行
- **黑名单**：检测系统破坏、权限提升、数据窃取、网络攻击、资源耗尽
- **AI审核**：上下文感知的智能分析

---

## 六、扩展系统（4 大方式）

### 1. MCP Servers（外部工具服务）
```json
// .iflow/settings.json
{
  "mcpServers": {
    "playwright": { "command": "npx", "args": ["-y", "@playwright/mcp@latest"] },
    "memory": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-memory"] },
    "context7": { "command": "npx", "args": ["-y", "@upstash/context7-mcp"] }
  }
}
```

### 2. Sub Agents（专业代理）
```
$general-purpose  # 通用代理，可修改文件
$explore          # 只读探索代理
$plan             # 计划模式专用代理
$code-reviewer    # 代码审查（需安装）
$frontend-dev     # 前端开发（需安装）
```

### 3. Commands（自定义斜杠命令）
位置：`.iflow/slash-commands/*.md`

### 4. Hooks（事件驱动钩子）
```json
{
  "hooks": {
    "PreToolUse": [...],      // 工具执行前
    "PostToolUse": [...],     // 工具执行后
    "SetUpEnvironment": [...], // 会话开始时
    "Stop": [...],             // 主会话结束
    "SubagentStop": [...],     // 子代理结束
    "SessionStart": [...],     // 会话启动
    "SessionEnd": [...],       // 会话结束
    "UserPromptSubmit": [...], // 用户提交前
    "Notification": [...]      // 通知处理
  }
}
```

---

## 七、配置层级（5 层优先级）

```
命令行参数 > 环境变量(IFLOW_*) > 系统配置 > 项目配置 > 用户配置 > 默认值
   (最高)                                                         (最低)
```

| 配置位置 | 路径 | 作用域 |
|----------|------|--------|
| 用户配置 | `~/.iflow/settings.json` | 所有项目 |
| 项目配置 | `./.iflow/settings.json` | 当前项目 |
| 环境变量 | `IFLOW_apiKey`, `IFLOW_modelName`... | 当前会话 |

---

## 八、记忆系统（3 级分级）

```
~/.iflow/IFLOW.md          → 全局级（个人偏好、通用规范）
/project/IFLOW.md          → 项目级（项目架构、团队规范）
/project/src/IFLOW.md      → 子目录级（模块特定规则）
```

### 记忆命令
```
/memory show     # 显示当前记忆内容
/memory add "内容" # 添加记忆
/memory refresh  # 重新加载所有记忆文件
/memory list     # 列出记忆文件列表
```

### 模块化导入
```markdown
# 主 IFLOW.md 文件
@./shared/coding-standards.md
@./project-specific/architecture.md
```

---

## 九、常用操作速查

### 项目初始化
```
/init                    # 分析项目结构
@src/ 分析这个目录       # 引入目录上下文
```

### 代码探索
```
$explore 找到所有处理错误的代码  # 只读探索
/search_file_content "pattern"  # 搜索内容
/glob "**/*.ts"                 # 查找文件
```

### 文件操作
```
@src/App.tsx 分析这个文件  # 引入文件
edit 文件路径              # 编辑文件
write_file 文件路径        # 写入文件
```

### 调试诊断
```
/stats          # 查看统计
/log            # 查看日志位置
/bug "描述"     # 提交 bug 报告
```

---

## 十、能力边界说明

### iFlow 原生能力
- 文件读写、目录浏览、内容搜索
- Shell 命令执行
- 任务管理、计划模式
- 网络搜索、Web 获取
- 记忆系统

### MCP 扩展能力
- `playwright`: 浏览器自动化
- `memory`: 知识图谱存储
- `context7`: 实时文档查询
- `chrome-devtools`: 浏览器调试

### 能力来源确认
1. **原生能力**：执行 `/tools` 查看
2. **MCP 能力**：执行 `/mcp list` 查看
3. **官方文档**：https://platform.iflow.cn/cli

---

**重要提醒**：
- 遇到不确定的能力，执行 `/tools` 获取实时列表
- 不要从其他 CLI（如 Gemini CLI）推断 iFlow 能力
- 每个项目的 MCP 配置可能不同，需要检查 `.iflow/settings.json`
