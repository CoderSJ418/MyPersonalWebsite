# Dev MCP 安装和使用指南

## 概述

Dev MCP 是一个强大的开发工具，可以帮助您更高效地调试和开发 MyPersonalWebsite 项目。

---

## 什么是 MCP？

**MCP (Model Context Protocol)** 是 Anthropic 推出的一个标准协议，用于让 AI 模型与外部工具和数据源进行交互。

**Dev MCP** 是专门为开发工作流程设计的 MCP 服务器，提供了：
- 文件系统访问
- 终端命令执行
- Git 操作
- 代码搜索
- 性能监控

---

## 安装 Dev MCP

### 前置条件

1. **Node.js**: >= 16.0.0
2. **npm**: >= 8.0.0
3. **iFlow CLI**: 已安装

### 安装步骤

#### 1. 创建 MCP 配置文件

在项目根目录创建 `.mcp.json` 文件：

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem"],
      "env": {
        "ALLOWED_DIRECTORIES": "E:/work/AI/MyPersonalWebsite"
      }
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "${BRAVE_API_KEY}"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

#### 2. 获取 API 密钥（可选）

**Brave Search API Key**:
1. 访问 https://brave.com/search/api/
2. 注册账号
3. 创建 API 密钥
4. 设置环境变量：
   ```bash
   set BRAVE_API_KEY=your_api_key_here
   ```

**GitHub Token**:
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token"
3. 选择权限（repo, workflow）
4. 生成 token
5. 设置环境变量：
   ```bash
   set GITHUB_TOKEN=your_token_here
   ```

#### 3. 验证安装

运行以下命令验证 MCP 服务器是否正确配置：

```bash
cd E:\work\AI\MyPersonalWebsite
npm list | grep @modelcontextprotocol
```

---

## 使用 Dev MCP

### 1. 文件系统访问

**功能**：读取、写入、搜索文件

**使用示例**：
```
用户：读取 src/components/common/Header.vue 文件
AI：[使用 filesystem MCP 读取文件]
```

**支持的命令**：
- 读取文件
- 写入文件
- 搜索文件内容
- 列出目录

### 2. 终端命令执行

**功能**：执行终端命令

**使用示例**：
```
用户：运行 npm run build
AI：[使用 filesystem MCP 执行命令]
```

**支持的命令**：
- npm 命令
- git 命令
- 系统命令

### 3. Git 操作

**功能**：Git 版本控制

**使用示例**：
```
用户：查看 git 状态
AI：[使用 filesystem MCP 执行 git status]
```

**支持的命令**：
- git status
- git log
- git diff
- git commit

### 4. 代码搜索

**功能**：搜索代码内容

**使用示例**：
```
用户：搜索所有包含 "useGSAPAnimations" 的文件
AI：[使用 filesystem MCP 搜索文件]
```

**支持的搜索**：
- 文件名搜索
- 内容搜索
- 正则表达式搜索

### 5. 网络搜索

**功能**：搜索网络资源

**使用示例**：
```
用户：搜索 Vue 3 性能优化最佳实践
AI：[使用 brave-search MCP 搜索]
```

**支持的搜索**：
- 技术文档
- 最佳实践
- 问题解决方案

---

## Dev MCP 在 MyPersonalWebsite 中的应用

### 场景 1：调试粒子动画

**用户**：粒子动画不明显，帮我调试

**AI**：
1. [使用 filesystem MCP 读取 ParticleBackground.vue]
2. [分析粒子配置参数]
3. [识别问题：透明度太低、粒子太小、速度太慢]
4. [使用 filesystem MCP 修改文件]
5. [验证修复效果]

### 场景 2：性能优化

**用户**：帮我分析网站性能

**AI**：
1. [使用 filesystem MCP 读取 vite.config.ts]
2. [分析构建配置]
3. [使用 brave-search MCP 搜索性能优化最佳实践]
4. [提供优化建议]
5. [使用 filesystem MCP 应用优化]

### 场景 3：代码审查

**用户**：帮我审查代码质量

**AI**：
1. [使用 filesystem MCP 搜索所有 .vue 和 .ts 文件]
2. [使用 filesystem MCP 读取文件内容]
3. [分析代码质量]
4. [识别潜在问题]
5. [提供改进建议]

### 场景 4：添加新功能

**用户**：帮我添加评论功能

**AI**：
1. [使用 brave-search MCP 搜索 Vue 3 评论系统最佳实践]
2. [选择合适的技术方案]
3. [使用 filesystem MCP 创建组件文件]
4. [使用 filesystem MCP 修改路由配置]
5. [使用 filesystem MCP 更新状态管理]
6. [测试功能]

---

## Dev MCP 最佳实践

### 1. 权限控制

**只读访问**：
```json
{
  "mcpServers": {
    "filesystem": {
      "env": {
        "ALLOWED_DIRECTORIES": "E:/work/AI/MyPersonalWebsite"
      }
    }
  }
}
```

**读写访问**：
```json
{
  "mcpServers": {
    "filesystem": {
      "env": {
        "ALLOWED_DIRECTORIES": "E:/work/AI/MyPersonalWebsite"
      }
    }
  }
}
```

### 2. 安全性

**不要暴露敏感信息**：
- 不要在配置文件中硬编码 API 密钥
- 使用环境变量 `${API_KEY}`
- 不要将 `.mcp.json` 提交到 Git

**添加到 .gitignore**：
```
.mcp.json
.env
```

### 3. 性能优化

**缓存搜索结果**：
- 使用文件系统缓存
- 避免重复搜索

**限制搜索范围**：
- 只搜索必要的目录
- 使用文件过滤器

---

## 常见问题

### 问题 1：MCP 服务器未启动

**症状**：AI 无法访问文件系统

**解决方案**：
1. 检查 `.mcp.json` 配置
2. 验证环境变量
3. 重启 iFlow CLI

### 问题 2：文件访问被拒绝

**症状**：`Error: Access denied`

**解决方案**：
1. 检查 `ALLOWED_DIRECTORIES` 配置
2. 确认目录路径正确
3. 检查文件权限

### 问题 3：API 密钥无效

**症状**：`Error: Invalid API key`

**解决方案**：
1. 重新生成 API 密钥
2. 更新环境变量
3. 重启服务

---

## 高级用法

### 1. 自定义 MCP 服务器

您可以创建自己的 MCP 服务器：

**示例**：创建项目管理 MCP

```javascript
// my-mcp-server.js
const { McpServer } = require('@modelcontextprotocol/sdk/server/index.js');

const server = new McpServer({
  name: 'project-manager',
  version: '1.0.0'
});

server.tool(
  'create-task',
  'Create a new task',
  {
    title: { type: 'string', description: 'Task title' },
    description: { type: 'string', description: 'Task description' }
  },
  async ({ title, description }) => {
    // 实现任务创建逻辑
    return {
      content: [{
        type: 'text',
        text: `Task "${title}" created successfully`
      }]
    };
  }
);
```

### 2. 集成到 CI/CD

**GitHub Actions 示例**：

```yaml
name: CI/CD

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
```

### 3. 监控和日志

**添加日志记录**：

```typescript
// src/utils/logger.ts
export const logger = {
  info: (message: string) => console.log(`[INFO] ${message}`),
  error: (message: string) => console.error(`[ERROR] ${message}`),
  warn: (message: string) => console.warn(`[WARN] ${message}`)
};
```

---

## 资源链接

### 官方文档
- MCP 官方文档：https://modelcontextprotocol.io/
- MCP GitHub：https://github.com/modelcontextprotocol/servers

### 社区资源
- MCP 服务器列表：https://github.com/modelcontextprotocol/servers
- MCP 示例：https://github.com/modelcontextprotocol/examples

### 相关工具
- iFlow CLI：https://github.com/iflow/cli
- Claude Desktop：https://claude.ai/download

---

## 总结

Dev MCP 是一个强大的开发工具，可以显著提升您的开发效率。通过正确配置和使用 Dev MCP，您可以：

✅ 更高效地调试代码
✅ 更快速地搜索和修改文件
✅ 更方便地执行终端命令
✅ 更智能地获取网络资源
✅ 更安全地管理权限

**下一步**：
1. 配置 `.mcp.json`
2. 获取必要的 API 密钥
3. 验证安装
4. 开始使用 Dev MCP

---

**最后更新**: 2026年1月19日
**版本**: 1.0.0