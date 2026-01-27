# 贡献指南

感谢您对 MyPersonalWebsite 项目的关注！我们欢迎任何形式的贡献。

## 🤝 如何贡献

### 报告 Bug

如果您发现了 Bug，请：

1. 检查 [Issues](https://github.com/yourusername/MyPersonalWebsite/issues) 是否已有相同问题
2. 如果没有，创建新的 Issue，包含：
   - 清晰的标题和描述
   - 复现步骤
   - 预期行为
   - 实际行为
   - 截图或录屏（如果适用）
   - 环境信息（操作系统、浏览器、Node.js 版本等）

### 提出新功能

如果您有新功能建议，请：

1. 检查 [Issues](https://github.com/yourusername/MyPersonalWebsite/issues) 是否已有相同建议
2. 如果没有，创建新的 Issue，包含：
   - 功能描述
   - 使用场景
   - 可能的实现方案
   - 示例或原型（如果有）

### 提交代码

如果您想提交代码，请遵循以下步骤：

#### 1. Fork 项目

点击 GitHub 页面右上角的 Fork 按钮，将项目 Fork 到您的账号下。

#### 2. 克隆仓库

```bash
git clone https://github.com/yourusername/MyPersonalWebsite.git
cd MyPersonalWebsite
```

#### 3. 创建分支

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

分支命名规范：
- `feature/` - 新功能
- `fix/` - Bug 修复
- `docs/` - 文档更新
- `refactor/` - 代码重构
- `test/` - 测试相关
- `chore/` - 构建/工具相关

#### 4. 安装依赖

```bash
npm install
```

#### 5. 开发和测试

```bash
# 启动开发服务器
npm run dev

# 运行测试
npm run test

# 运行代码检查
npm run lint

# 运行代码格式化
npm run format
```

#### 6. 提交代码

使用 Conventional Commits 规范：

```bash
# 功能
git commit -m "feat: add user authentication"

# Bug 修复
git commit -m "fix: resolve navigation issue on mobile devices"

# 文档
git commit -m "docs: update API documentation"

# 重构
git commit -m "refactor: simplify component structure"

# 测试
git commit -m "test: add unit tests for utils"

# 构建/工具
git commit -m "chore: update dependencies"
```

#### 7. 推送到您的 Fork

```bash
git push origin feature/your-feature-name
```

#### 8. 创建 Pull Request

1. 访问您的 Fork 页面
2. 点击 "New Pull Request"
3. 选择您的分支
4. 填写 PR 描述：
   - 清晰的标题
   - 详细描述修改内容
   - 关联的 Issue（如果有）
   - 截图或演示（如果适用）
   - 测试说明

## 📝 代码规范

### TypeScript

- 使用 TypeScript 严格模式
- 为所有函数添加类型注解
- 使用 `interface` 而不是 `type`（除非需要联合类型）
- 避免使用 `any`，使用 `unknown` 代替

### Vue

- 使用 Composition API 和 `<script setup>`
- 组件命名使用 PascalCase
- Props 使用 TypeScript 接口定义
- 使用 `defineEmits` 和 `defineProps`

### 样式

- 使用 Tailwind CSS
- 避免内联样式
- 使用语义化的类名
- 响应式设计优先

### Git

- 使用 Conventional Commits 规范
- 每次提交只做一件事
- 提交信息清晰明确
- 避免提交敏感信息

## 🧪 测试

### 单元测试

使用 Vitest 进行单元测试：

```typescript
import { describe, it, expect } from 'vitest'
import { add } from '@/utils/math'

describe('add', () => {
  it('should add two numbers', () => {
    expect(add(1, 2)).toBe(3)
  })
})
```

### E2E 测试

使用 Playwright 进行端到端测试：

```typescript
import { test, expect } from '@playwright/test'

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('Welcome')
})
```

## 📚 文档

- 保持文档更新
- 使用清晰的标题和结构
- 提供代码示例
- 添加必要的注释

## 🎯 提交前检查清单

在提交 PR 之前，请确保：

- [ ] 代码通过所有测试
- [ ] 代码通过 ESLint 检查
- [ ] 代码已格式化
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 没有引入新的警告
- [ ] 在不同浏览器中测试过

## 📧 联系方式

如果您有任何问题，可以通过以下方式联系：

- GitHub Issues: [https://github.com/yourusername/MyPersonalWebsite/issues](https://github.com/yourusername/MyPersonalWebsite/issues)
- Email: your.email@example.com

## 📜 行为准则

- 尊重所有贡献者
- 保持友好和专业的态度
- 接受建设性的反馈
- 关注问题，而不是个人

感谢您的贡献！🎉