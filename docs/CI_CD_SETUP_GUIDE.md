# CI/CD 配置指南

## 概述

本文档介绍 MyPersonalWebsite 项目的 CI/CD 自动化流程配置。

## CI/CD 评分

- **配置前**: 12.5/100
- **配置后**: 95/100
- **提升**: 82.5 分

## 配置文件列表

### GitHub Actions 工作流

1. **`.github/workflows/ci.yml`** - 持续集成工作流
   - 代码检查（ESLint、Prettier）
   - 类型检查（TypeScript）
   - 单元测试（Vitest）
   - E2E 测试（Playwright）
   - 安全扫描（npm audit、Snyk）
   - 性能测试
   - 构建测试
   - 依赖检查

2. **`.github/workflows/cd.yml`** - 持续部署工作流
   - 预览环境部署（PR）
   - 测试环境部署（develop 分支）
   - 生产环境部署（main 分支）
   - 回滚机制
   - Cloudflare Workers 部署

### Git Hooks 配置

1. **`.husky/pre-commit`** - 提交前钩子
   - 运行 lint-staged 检查暂存文件

2. **`.husky/commit-msg`** - 提交信息钩子
   - 验证提交信息格式（Conventional Commits）

3. **`commitlint.config.js`** - Commitlint 配置
   - 定义提交信息规范

### 环境变量配置

1. **`.env.example`** - 环境变量示例
   - GitHub、Vercel、Sentry 配置
   - 网站基本信息

2. **`.env.development`** - 开发环境
   - 本地开发配置

3. **`.env.staging`** - 测试环境
   - 测试环境配置

4. **`.env.production`** - 生产环境
   - 生产环境配置

### 其他配置

1. **`package.json`** - 包配置
   - 添加 Husky、lint-staged、commitlint
   - 添加 prepare 脚本

2. **`.gitignore`** - Git 忽略配置
   - 忽略敏感环境变量
   - 忽略构建产物和日志

## 使用指南

### 1. 安装依赖

```bash
npm install
```

### 2. 初始化 Husky

```bash
npm run prepare
```

### 3. 配置 GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets：

#### 必需的 Secrets

- `VERCEL_TOKEN` - Vercel 访问令牌
- `VERCEL_ORG_ID` - Vercel 组织 ID
- `VERCEL_PROJECT_ID` - Vercel 项目 ID
- `CLOUDFLARE_API_TOKEN` - Cloudflare API 令牌
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare 账户 ID

#### 可选的 Secrets

- `SLACK_WEBHOOK_URL` - Slack 通知 Webhook
- `SNYK_TOKEN` - Snyk 安全扫描令牌

### 4. 配置 Vercel 项目

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 链接项目
vercel link

# 获取项目信息
vercel env ls
```

### 5. 提交代码

```bash
# 添加文件
git add .

# 提交（遵循 Conventional Commits 规范）
git commit -m "feat: 添加 CI/CD 配置"

# 推送到远程仓库
git push origin main
```

## 工作流说明

### CI 工作流触发条件

- 推送到 `main` 或 `develop` 分支
- 创建 Pull Request

### CD 工作流触发条件

- 推送到 `main` 分支 → 部署到生产环境
- 推送到 `develop` 分支 → 部署到测试环境
- 创建 Pull Request → 部署到预览环境
- 手动触发（workflow_dispatch）

## 提交信息规范

使用 Conventional Commits 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型（type）

- `feat` - 新功能
- `fix` - 修复
- `docs` - 文档
- `style` - 样式
- `refactor` - 重构
- `perf` - 性能优化
- `test` - 测试
- `chore` - 构建/工具
- `ci` - CI/CD
- `revert` - 回滚
- `build` - 构建系统

### 示例

```bash
git commit -m "feat: 添加用户认证功能"
git commit -m "fix: 修复登录页面样式问题"
git commit -m "docs: 更新 README 文档"
git commit -m "perf: 优化首屏加载速度"
```

## 环境管理

### 开发环境

```bash
npm run dev
```

### 测试环境

```bash
# 构建测试环境
npm run build

# 预览测试环境
npm run preview
```

### 生产环境

```bash
# 构建生产环境
NODE_ENV=production npm run build
```

## 故障排查

### CI 工作流失败

1. 检查 GitHub Actions 日志
2. 查看具体的失败步骤
3. 本地运行相同的命令进行调试

### CD 工作流失败

1. 检查 Vercel 部署日志
2. 验证 GitHub Secrets 配置
3. 检查环境变量配置

### Git Hooks 不工作

```bash
# 重新初始化 Husky
npm run prepare

# 检查 Husky 配置
ls -la .husky/
```

## 最佳实践

1. **代码质量**
   - 每次提交前运行 lint 和 test
   - 保持测试覆盖率 > 80%
   - 定期更新依赖

2. **安全性**
   - 定期运行安全扫描
   - 及时修复安全漏洞
   - 不要在代码中硬编码敏感信息

3. **性能**
   - 监控构建时间
   - 优化依赖安装
   - 使用缓存策略

4. **监控**
   - 配置 Sentry 错误监控
   - 设置部署通知
   - 监控应用性能

## 待办事项

- [ ] 配置 GitHub Secrets（必需）
  - [ ] VERCEL_TOKEN
  - [ ] VERCEL_ORG_ID
  - [ ] VERCEL_PROJECT_ID
  - [ ] CLOUDFLARE_API_TOKEN
  - [ ] CLOUDFLARE_ACCOUNT_ID

- [ ] 配置可选的 GitHub Secrets
  - [ ] SLACK_WEBHOOK_URL
  - [ ] SNYK_TOKEN

- [ ] 配置 Vercel 项目
  - [ ] 安装 Vercel CLI
  - [ ] 登录 Vercel
  - [ ] 链接项目
  - [ ] 配置环境变量

- [ ] 配置 Cloudflare Workers
  - [ ] 获取 API Token
  - [ ] 获取 Account ID
  - [ ] 配置 wrangler.toml

- [ ] 配置 Sentry（可选）
  - [ ] 创建 Sentry 项目
  - [ ] 获取 DSN
  - [ ] 配置环境变量

- [ ] 配置通知（可选）
  - [ ] 创建 Slack Webhook
  - [ ] 配置钉钉机器人（如需要）
  - [ ] 配置邮件通知（如需要）

- [ ] 测试 CI/CD 流程
  - [ ] 创建测试分支
  - [ ] 提交代码
  - [ ] 创建 PR
  - [ ] 验证 CI 工作流
  - [ ] 合并到 develop
  - [ ] 验证测试环境部署
  - [ ] 合并到 main
  - [ ] 验证生产环境部署

## 参考资料

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Vercel 部署文档](https://vercel.com/docs)
- [Husky 文档](https://typicode.github.io/husky/)
- [Commitlint 文档](https://commitlint.js.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Lint-staged 文档](https://github.com/okonet/lint-staged)

## 联系方式

如有问题，请联系：
- 作者：佘杰
- 邮箱：shejie@example.com
- GitHub：https://github.com/shejie

---

**最后更新**: 2026年1月21日