# 开发环境设置指南

本文档将指导您设置 MyPersonalWebsite 项目的本地开发环境。

## 前置要求

在开始之前，请确保您的系统已安装以下软件：

- **Node.js**: 版本 >= 18.0.0
- **npm**: 版本 >= 9.0.0（随 Node.js 安装）
- **Git**: 版本 >= 2.30.0
- **编辑器**: 推荐 VS Code

## 安装步骤

### 1. 克隆仓库

```bash
git clone https://github.com/yourusername/MyPersonalWebsite.git
cd MyPersonalWebsite
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制环境变量示例文件：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，配置您的环境变量：

```env
# 应用配置
VITE_APP_TITLE=My Personal Website
VITE_APP_URL=http://localhost:5173

# API 配置
VITE_API_URL=https://api.example.com
VITE_API_KEY=your-api-key

# 分析配置
VITE_GA_ID=your-google-analytics-id
VITE_SENTRY_DSN=your-sentry-dsn

# 其他配置
VITE_APP_ENV=development
```

### 4. 启动开发服务器

```bash
npm run dev
```

开发服务器将在 `http://localhost:5173` 启动。

### 5. 验证安装

打开浏览器访问 `http://localhost:5173`，您应该能看到网站首页。

## 开发工具

### VS Code 扩展

推荐安装以下 VS Code 扩展：

- **Volar** - Vue 3 语言支持
- **TypeScript Vue Plugin (Volar)** - TypeScript 支持
- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **Tailwind CSS IntelliSense** - Tailwind CSS 智能提示
- **GitLens** - Git 增强
- **Auto Rename Tag** - 自动重命名标签
- **Path Intellisense** - 路径智能提示

### VS Code 配置

创建 `.vscode/settings.json`：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "volar.takeOverMode.enabled": true,
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## 可用命令

### 开发

```bash
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run preview          # 预览生产构建
```

### 代码质量

```bash
npm run lint             # 运行 ESLint 检查
npm run format           # 运行 Prettier 格式化
npm run type-check       # 运行 TypeScript 类型检查
```

### 测试

```bash
npm run test             # 运行单元测试
npm run test:watch       # 监听模式运行测试
npm run test:coverage    # 生成测试覆盖率报告
npm run test:e2e         # 运行 E2E 测试
```

### 性能

```bash
npm run analyze          # 分析打包体积
npm run lighthouse       # 运行 Lighthouse 审计
```

### 其他

```bash
npm run verify-mcp       # 验证 MCP 集成
npm run automation       # 运行自动化脚本
```

## 项目结构

```
MyPersonalWebsite/
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # 组件
│   ├── composables/     # Composables
│   ├── config/          # 配置文件
│   ├── router/          # 路由配置
│   ├── stores/          # Pinia stores
│   ├── types/           # TypeScript 类型
│   ├── utils/           # 工具函数
│   ├── views/           # 页面组件
│   ├── App.vue          # 根组件
│   └── main.ts          # 入口文件
├── public/              # 公共资源
├── tests/               # 测试文件
├── docs/                # 文档
├── .env.*               # 环境变量
├── package.json         # 项目配置
├── vite.config.ts       # Vite 配置
├── tsconfig.json        # TypeScript 配置
└── tailwind.config.js   # Tailwind 配置
```

## 常见问题

### 依赖安装失败

```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 端口被占用

修改 `vite.config.ts` 中的端口：

```typescript
export default defineConfig({
  server: {
    port: 3000 // 修改为其他端口
  }
})
```

### TypeScript 错误

```bash
# 重新生成 TypeScript 配置
npm run type-check

# 清除 TypeScript 缓存
rm -rf node_modules/.vite
```

### 样式不生效

```bash
# 重新生成 Tailwind CSS
npm run build

# 检查 tailwind.config.js 配置
```

## 开发技巧

### 热模块替换（HMR）

Vite 提供快速的热模块替换，修改代码后浏览器会自动更新。

### 调试

使用 VS Code 的调试功能：

1. 创建 `.vscode/launch.json`：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

2. 设置断点并按 F5 启动调试。

### 环境变量

在代码中使用环境变量：

```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

### 组件开发

使用 Vue DevTools 进行组件调试：

1. 安装 Vue DevTools 浏览器扩展
2. 打开浏览器开发者工具
3. 切换到 Vue 面板

## 性能优化

### 代码分割

使用动态导入进行代码分割：

```typescript
const ProjectDetail = defineAsyncComponent(
  () => import('@/views/ProjectDetail.vue')
)
```

### 图片优化

使用 Vite 的图片优化功能：

```typescript
import optimizedImage from '@/assets/image.jpg?w=800&format=webp'
```

### 懒加载

使用 Vue 的懒加载功能：

```typescript
const routes = [
  {
    path: '/projects/:id',
    component: () => import('@/views/ProjectDetail.vue')
  }
]
```

## 部署

### 构建

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

### 预览

```bash
npm run preview
```

### 部署到 Vercel

```bash
npm install -g vercel
vercel
```

### 部署到 Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 获取帮助

如果遇到问题：

- 查看项目文档：`docs/`
- 搜索 Issues：[GitHub Issues](https://github.com/yourusername/MyPersonalWebsite/issues)
- 提问：创建新的 Issue

## 下一步

- 阅读 [代码规范](coding-standards.md)
- 了解 [测试指南](testing.md)
- 查看 [部署指南](deployment.md)