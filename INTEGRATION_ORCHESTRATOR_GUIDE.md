# 智能体集成编排器 - 使用指南

## 📋 概述

智能体集成编排器是一个自动化系统，用于管理 MyPersonalWebsite 项目的智能体集成过程。它支持本地执行和远程自动化执行，即使上下文耗尽也能继续执行。

---

## 🚀 快速开始

### 本地执行（最简单）

**执行所有阶段**：
```bash
cd E:\work\AI\MyPersonalWebsite
make all
```

**执行特定阶段**：
```bash
make stage0  # 准备阶段
make stage1  # P0智能体集成
make stage2  # P1智能体集成
make stage3  # P2智能体集成
make stage4  # 验证和测试
make stage5  # 总结和文档
```

**查看帮助**：
```bash
make help
```

---

### 远程执行（GitHub Actions）

**步骤1：配置 GitHub Secrets**（首次使用）

1. 打开 GitHub 仓库
2. 点击 "Settings" → "Secrets and variables" → "Actions"
3. 添加以下 Secrets：
   - `VERCEL_TOKEN` - Vercel 部署令牌
   - `VERCEL_ORG_ID` - Vercel 组织 ID
   - `VERCEL_PROJECT_ID` - Vercel 项目 ID
   - `CLOUDFLARE_API_TOKEN` - Cloudflare API 令牌
   - `CLOUDFLARE_ACCOUNT_ID` - Cloudflare 账户 ID

**步骤2：执行 workflow**

1. 打开 GitHub 仓库
2. 点击 "Actions" 标签
3. 选择 "智能体集成编排器" workflow
4. 点击 "Run workflow" 按钮
5. 选择执行阶段：
   - `all` - 执行所有阶段
   - `stage0` - 准备阶段
   - `stage1` - P0智能体集成
   - `stage2` - P1智能体集成
   - `stage3` - P2智能体集成
   - `stage4` - 验证和测试
   - `stage5` - 总结和文档
6. 点击 "Run" 按钮

**步骤3：查看进度**

- 在 "Actions" 页面可以看到执行进度
- 每个阶段完成后会创建 Git 标签
- 可以查看日志输出

---

## 🔄 恢复执行

### 查看当前状态

```bash
node scripts/resume-integration.cjs
```

这会显示：
- 当前状态
- 已完成的任务
- 待处理的任务
- 可用的检查点
- 下一步行动

### 从检查点恢复

**方法1：使用 Git 标签**
```bash
cd E:\work\AI\MyPersonalWebsite
git checkout v1.0.1-after-p0  # 恢复到 P0 完成后
```

**方法2：使用 Makefile**
```bash
make resume  # 从上一个检查点继续
```

**方法3：继续执行特定阶段**
```bash
make stage2  # 从 stage2 开始执行
```

---

## 📊 阶段说明

### 阶段0：准备阶段
- Git 打标签备份
- 处理 GitHub Token 泄露
- 检查依赖

**预计时间**: 5 分钟

### 阶段1：P0 智能体集成
- testing-specialist（测试专家）
- security-specialist（安全专家）
- performance-specialist（性能专家）

**预计时间**: 2-3 小时

### 阶段2：P1 智能体集成
- devops-specialist（DevOps 专家）
- monitoring-specialist（监控专家）
- documentation-specialist（文档专家）

**预计时间**: 2-3 小时

### 阶段3：P2 智能体集成
- javascript-pro（JavaScript 专家）
- frontend-design-claude2（高级前端设计）
- deployment-specialist（部署专家）

**预计时间**: 1-2 小时

### 阶段4：验证和测试
- 运行代码检查
- 运行安全扫描
- 运行构建测试

**预计时间**: 30 分钟

### 阶段5：总结和文档
- 生成完整报告
- 生成最佳实践文档
- 生成待办事项列表

**预计时间**: 30 分钟

---

## 🛠️ 实用命令

### 测试
```bash
make test         # 运行测试
make test:e2e     # 运行 E2E 测试
make test:coverage # 生成覆盖率报告
```

### 构建
```bash
make build        # 构建项目
make deploy       # 部署项目
```

### 清理
```bash
make clean        # 清理临时文件
```

### 查看
```bash
make resume       # 查看当前状态
make help         # 显示帮助信息
```

---

## 📁 文件结构

```
MyPersonalWebsite/
├── Makefile                           # 主编排文件（本地执行）
├── .github/workflows/
│   └── integration-orchestrator.yml  # GitHub Actions workflow（远程执行）
├── scripts/
│   └── resume-integration.cjs        # 恢复脚本
├── INTEGRATION_STATE.json            # 状态文件（持久化）
├── INTEGRATION_PROGRESS.json         # 进度文件（详细）
├── INTEGRATION_LOG.md                # 执行日志
├── FINAL_INTEGRATION_REPORT.md      # 最终报告
└── INTEGRATION_TODOS.md              # 待办事项
```

---

## 🎯 使用场景

### 场景1：你在电脑前

**推荐方式**: 使用 Makefile（本地执行）

**优点**：
- 超级简单，一条命令搞定
- 可以看到实时输出
- 可以随时中断

**执行方式**：
```bash
make all
```

---

### 场景2：你不在电脑前

**推荐方式**: 使用 GitHub Actions（远程执行）

**优点**：
- 完全自动化，可以无人值守
- 可以在任何地方查看进度
- 自动重试，不会因为上下文耗尽停止

**执行方式**：
1. 在 GitHub 上点击 "Run workflow"
2. 选择 "all"
3. 点击 "Run"

---

### 场景3：上下文耗尽后恢复

**推荐方式**: 使用恢复脚本

**执行方式**：
```bash
# 1. 查看当前状态
node scripts/resume-integration.cjs

# 2. 从检查点恢复
git checkout v1.0.1-after-p0

# 3. 继续执行
make stage2
```

---

## ⚠️ 注意事项

### 1. 首次使用

**本地执行**：
- 确保已安装 Node.js 和 npm
- 确保已安装项目依赖（`npm install`）

**远程执行**：
- 需要先配置 GitHub Secrets
- 需要仓库有 GitHub Actions 权限

### 2. 依赖关系

- stage1 依赖 stage0
- stage2 依赖 stage1
- stage3 依赖 stage2
- stage4 依赖 stage3
- stage5 依赖 stage4

**建议**：按顺序执行，不要跳过阶段

### 3. 中断和恢复

- 每个阶段完成后会创建 Git 标签
- 可以从任意检查点恢复
- 状态文件会自动保存进度

### 4. 错误处理

- 如果某个任务失败，会停止执行
- 查看日志了解错误原因
- 修复问题后可以继续执行

---

## 📞 获取帮助

### 查看帮助信息
```bash
make help
```

### 查看当前状态
```bash
node scripts/resume-integration.cjs
```

### 查看日志
```bash
cat INTEGRATION_LOG.md
```

---

## 🎉 总结

智能体集成编排器提供了两种执行方式：

1. **本地执行**（Makefile）- 超级简单，适合在电脑前
2. **远程执行**（GitHub Actions）- 完全自动化，适合无人值守

无论哪种方式，都支持：
- ✅ 状态持久化
- ✅ 检查点恢复
- ✅ 增量执行
- ✅ 错误恢复

选择适合你的方式，开始执行吧！🚀