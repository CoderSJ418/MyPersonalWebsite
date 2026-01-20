# MCP 服务器配置指南

## 概述
本文档指导如何配置 MyPersonalWebsite 项目所需的 MCP 服务器环境变量。

## 需要配置的环境变量

### 1. GITHUB_TOKEN
用于 GitHub 集成，包括仓库管理、PR 分析和代码审查。

**获取方式**:
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 选择权限：
   - `repo` (完整仓库访问权限)
   - `read:org` (读取组织信息)
   - `user:email` (读取用户邮箱)
4. 点击 "Generate token"
5. 复制生成的 token（只显示一次，请妥善保存）

**配置方法**:
```powershell
# Windows PowerShell
$env:GITHUB_TOKEN = "your_github_token_here"

# 验证配置
echo $env:GITHUB_TOKEN
```

### 2. FIGMA_ACCESS_TOKEN
用于 Figma 集成，支持设计到代码的工作流和组件提取。

**获取方式**:
1. 访问 https://www.figma.com/developers/api
2. 登录 Figma 账户
3. 点击 "Generate new personal access token"
4. 输入描述（如 "MyPersonalWebsite Automation"）
5. 点击 "Generate personal access token"
6. 复制生成的 token

**配置方法**:
```powershell
# Windows PowerShell
$env:FIGMA_ACCESS_TOKEN = "your_figma_token_here"

# 验证配置
echo $env:FIGMA_ACCESS_TOKEN
```

## 永久配置环境变量

### Windows 系统环境变量
1. 右键点击 "此电脑" → "属性"
2. 点击 "高级系统设置"
3. 点击 "环境变量"
4. 在"用户变量"中点击"新建"
5. 变量名：`GITHUB_TOKEN`，变量值：你的 GitHub token
6. 重复步骤 4-5，添加 `FIGMA_ACCESS_TOKEN`
7. 点击"确定"保存

### 使用 .env 文件（推荐）
在项目根目录创建 `.env` 文件：

```env
GITHUB_TOKEN=your_github_token_here
FIGMA_ACCESS_TOKEN=your_figma_token_here
```

然后在 `package.json` 中添加启动脚本：

```json
{
  "scripts": {
    "dev": "dotenv-cli -- vite",
    "build": "dotenv-cli -- vite build"
  }
}
```

安装 dotenv-cli：
```bash
npm install -D dotenv-cli
```

## 验证配置

创建验证脚本 `E:\work\AI\MyPersonalWebsite\scripts\verify-mcp.js`:

```javascript
/**
 * MCP 服务器配置验证脚本
 * 
 * 功能：验证 MCP 服务器环境变量是否正确配置
 */

console.log('🔍 验证 MCP 服务器配置...\n');

// 检查 GITHUB_TOKEN
const githubToken = process.env.GITHUB_TOKEN;
if (githubToken) {
  console.log('✅ GITHUB_TOKEN: 已配置');
  console.log(`   长度: ${githubToken.length} 字符`);
  console.log(`   前缀: ${githubToken.substring(0, 7)}...`);
} else {
  console.log('❌ GITHUB_TOKEN: 未配置');
  console.log('   请按照 MCP-SETUP-GUIDE.md 中的说明配置');
}

console.log();

// 检查 FIGMA_ACCESS_TOKEN
const figmaToken = process.env.FIGMA_ACCESS_TOKEN;
if (figmaToken) {
  console.log('✅ FIGMA_ACCESS_TOKEN: 已配置');
  console.log(`   长度: ${figmaToken.length} 字符`);
  console.log(`   前缀: ${figmaToken.substring(0, 7)}...`);
} else {
  console.log('❌ FIGMA_ACCESS_TOKEN: 未配置');
  console.log('   请按照 MCP-SETUP-GUIDE.md 中的说明配置');
}

console.log();

// 总结
if (githubToken && figmaToken) {
  console.log('🎉 所有 MCP 服务器配置完成！');
} else {
  console.log('⚠️  部分配置缺失，请补充配置后重试');
  process.exit(1);
}
```

运行验证：
```bash
node scripts/verify-mcp.js
```

## 测试 MCP 服务器连接

### 测试 GitHub MCP
```bash
npx -y @modelcontextprotocol/server-github --help
```

### 测试 Figma MCP
```bash
npx -y @modelcontextprotocol/server-figma --help
```

### 测试 Filesystem MCP
```bash
npx -y @modelcontextprotocol/server-filesystem --help
```

## 故障排查

### 问题 1: 环境变量未生效
**解决方案**:
- 重启终端窗口
- 检查环境变量名称是否正确（区分大小写）
- 确认没有多余的空格

### 问题 2: Token 无效
**解决方案**:
- 重新生成 token
- 检查 token 是否完整复制
- 确认 token 权限设置正确

### 问题 3: MCP 服务器连接失败
**解决方案**:
- 检查网络连接
- 验证 token 是否有效
- 查看 MCP 服务器日志

## 安全建议

1. **不要提交 .env 文件到 Git**
   - 确保 `.gitignore` 包含 `.env`
   
2. **定期更新 Token**
   - 建议每 90 天更新一次
   - 使用 GitHub 时启用 SSO

3. **限制 Token 权限**
   - 只授予必要的权限
   - 为不同项目使用不同的 token

4. **使用 Token 作用域**
   - GitHub 支持设置 token 过期时间
   - Figma 支持限制访问范围

## 下一步

配置完成后，继续执行：
```bash
npm install js-yaml
node scripts/automation-controller.js "添加一个测试组件"
```

---

**文档版本**: 1.0.0  
**创建日期**: 2026-01-20  
**作者**: iFlow CLI Automation Team