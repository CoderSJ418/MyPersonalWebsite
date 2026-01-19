# 快速启动指南

## 🚀 快速开始

### 1. 安装依赖

```bash
cd E:\work\AI\MyPersonalWebsite
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

服务器将在 `http://localhost:5173` 启动。

### 3. 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 4. 预览生产版本

```bash
npm run preview
```

---

## 📂 项目结构

```
MyPersonalWebsite/
├── public/                    # 静态资源
├── src/
│   ├── assets/               # 资源文件
│   │   ├── data/            # 本地数据
│   │   └── styles/          # 全局样式
│   ├── components/          # 组件
│   │   ├── common/          # 通用组件
│   │   ├── home/            # 首页组件
│   │   ├── projects/        # 项目组件
│   │   ├── skills/          # 技能组件
│   │   ├── blog/            # 博客组件
│   │   └── contact/         # 联系组件
│   ├── stores/              # 状态管理
│   ├── router/              # 路由
│   ├── types/               # 类型定义
│   ├── views/               # 页面
│   ├── App.vue              # 根组件
│   └── main.ts              # 入口文件
├── docs/                    # 文档
├── index.html
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 🎨 自定义配置

### 修改个人信息

编辑以下文件：

1. **首页Hero区域**: `src/components/home/HeroSection.vue`
2. **技术栈**: `src/components/home/TechStack.vue`
3. **项目数据**: `src/assets/data/projects.json`
4. **技能数据**: `src/assets/data/skills.json`
5. **博客数据**: `src/assets/data/blog-index.json`

### 修改主题颜色

编辑 `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        // ... 修改颜色值
        900: '#1e3a8a'
      }
    }
  }
}
```

### 修改联系方式

编辑 `src/views/Contact.vue`:

```vue
<a href="mailto:your.email@example.com">
  your.email@example.com
</a>

<a href="https://github.com/your-github">
  https://github.com/your-github
</a>

<a href="https://linkedin.com/in/your-linkedin">
  https://linkedin.com/in/your-linkedin
</a>
```

---

## 📝 常用命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 代码检查
npm run lint

# 代码格式化
npm run format
```

---

## 🚢 部署

### Vercel

1. 安装Vercel CLI:
```bash
npm install -g vercel
```

2. 部署:
```bash
vercel
```

### Netlify

1. 安装Netlify CLI:
```bash
npm install -g netlify-cli
```

2. 构建:
```bash
npm run build
```

3. 部署:
```bash
netlify deploy --prod --dir=dist
```

### GitHub Pages

1. 构建:
```bash
npm run build
```

2. 推送到GitHub

3. 在GitHub仓库设置中启用GitHub Pages，选择 `dist` 目录作为源

---

## 📚 文档

- **需求分析**: `docs/requirements-analysis.md`
- **技术架构**: `docs/technical-architecture.md`
- **UX设计**: `docs/ux-design.md`
- **技术实现**: `docs/technical-implementation.md`
- **开发日志**: `docs/development-log.md`
- **项目总结**: `docs/project-summary.md`

---

## 🐛 常见问题

### 1. 依赖安装失败

清理缓存并重新安装:
```bash
rm -rf node_modules package-lock.json
npm install
```

### 2. 构建失败

检查TypeScript错误:
```bash
npm run build
```

### 3. 样式不生效

确保已安装Tailwind CSS依赖:
```bash
npm install -D tailwindcss postcss autoprefixer
```

### 4. 路由不工作

确保在 `main.ts` 中已注册路由:
```typescript
import router from './router'
app.use(router)
```

---

## 💡 提示

1. **开发时**: 使用 `npm run dev` 启动开发服务器，支持热更新
2. **构建前**: 运行 `npm run lint` 检查代码质量
3. **部署前**: 运行 `npm run build` 构建生产版本
4. **预览**: 使用 `npm run preview` 预览生产版本

---

## 🎯 下一步

1. ✅ 修改个人信息
2. ✅ 添加真实项目数据
3. ✅ 添加真实技能数据
4. ✅ 添加真实博客文章
5. ✅ 自定义主题颜色
6. ✅ 部署到生产环境

---

**快速启动指南结束**

**祝您使用愉快！🎉**