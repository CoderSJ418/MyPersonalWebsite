# 部署指南

本文档提供了 MyPersonalWebsite 项目的部署指南。

## 目录

- [构建准备](#构建准备)
- [部署到 Vercel](#部署到-vercel)
- [部署到 Netlify](#部署到-netlify)
- [部署到 GitHub Pages](#部署到-github-pages)
- [部署到自己的服务器](#部署到自己的服务器)
- [环境变量](#环境变量)
- [CI/CD](#cicd)
- [监控和日志](#监控和日志)

## 构建准备

### 1. 安装依赖

```bash
npm install
```

### 2. 环境变量配置

创建 `.env.production` 文件：

```env
# 应用配置
VITE_APP_TITLE=My Personal Website
VITE_APP_URL=https://yourwebsite.com

# API 配置
VITE_API_URL=https://api.example.com
VITE_API_KEY=your-api-key

# 分析配置
VITE_GA_ID=your-google-analytics-id
VITE_SENTRY_DSN=your-sentry-dsn

# 其他配置
VITE_APP_ENV=production
```

### 3. 构建项目

```bash
npm run build
```

构建产物将输出到 `dist/` 目录。

### 4. 本地预览

```bash
npm run preview
```

## 部署到 Vercel

### 方法 1: 通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel

# 生产环境部署
vercel --prod
```

### 方法 2: 通过 GitHub 集成

1. 将代码推送到 GitHub
2. 访问 [vercel.com](https://vercel.com)
3. 点击 "New Project"
4. 选择您的 GitHub 仓库
5. 配置项目设置：
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. 添加环境变量
7. 点击 "Deploy"

### Vercel 配置文件

创建 `vercel.json`：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "env": {
    "VITE_APP_ENV": "production"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 部署到 Netlify

### 方法 1: 通过 Netlify CLI

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 初始化
netlify init

# 部署
netlify deploy --prod
```

### 方法 2: 通过 GitHub 集成

1. 将代码推送到 GitHub
2. 访问 [netlify.com](https://netlify.com)
3. 点击 "Add new site" -> "Import an existing project"
4. 选择您的 GitHub 仓库
5. 配置构建设置：
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. 添加环境变量
7. 点击 "Deploy site"

### Netlify 配置文件

创建 `netlify.toml`：

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"

[context.production.environment]
  VITE_APP_ENV = "production"
```

## 部署到 GitHub Pages

### 1. 配置 Vite

修改 `vite.config.ts`：

```typescript
export default defineConfig({
  base: '/your-repo-name/', // 替换为您的仓库名
  // ... 其他配置
})
```

### 2. 创建部署脚本

创建 `scripts/deploy.sh`：

```bash
#!/bin/bash

# 构建项目
npm run build

# 切换到 gh-pages 分支
git checkout gh-pages || git checkout -b gh-pages

# 复制构建产物
rm -rf *
cp -r dist/* .

# 提交更改
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# 切换回主分支
git checkout main
```

### 3. 自动部署（GitHub Actions）

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_APP_ENV: production

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 4. 启用 GitHub Pages

1. 访问仓库的 Settings -> Pages
2. 选择 `gh-pages` 分支
3. 点击 Save

## 部署到自己的服务器

### 1. 使用 Nginx

**安装 Nginx**

```bash
sudo apt-get update
sudo apt-get install nginx
```

**配置 Nginx**

创建 `/etc/nginx/sites-available/mywebsite`：

```nginx
server {
    listen 80;
    server_name yourwebsite.com www.yourwebsite.com;

    root /var/www/mywebsite/dist;
    index index.html;

    # 启用 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # SPA 路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 安全头
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

**启用配置**

```bash
sudo ln -s /etc/nginx/sites-available/mywebsite /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 2. 使用 Docker

**创建 Dockerfile**

```dockerfile
# 构建阶段
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**构建和运行**

```bash
# 构建镜像
docker build -t my-website .

# 运行容器
docker run -d -p 80:80 --name my-website my-website
```

### 3. 使用 PM2

**安装 PM2**

```bash
npm install -g pm2
```

**创建 ecosystem.config.js**

```javascript
module.exports = {
  apps: [{
    name: 'my-website',
    script: 'serve',
    args: '-s dist -l 3000',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

**启动应用**

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 环境变量

### Vercel 环境变量

1. 访问项目 Settings -> Environment Variables
2. 添加以下变量：
   - `VITE_API_URL`
   - `VITE_API_KEY`
   - `VITE_GA_ID`
   - `VITE_SENTRY_DSN`

### Netlify 环境变量

1. 访问 Site settings -> Environment variables
2. 添加以下变量：
   - `VITE_API_URL`
   - `VITE_API_KEY`
   - `VITE_GA_ID`
   - `VITE_SENTRY_DSN`

### 服务器环境变量

创建 `.env` 文件：

```bash
VITE_API_URL=https://api.example.com
VITE_API_KEY=your-api-key
VITE_GA_ID=your-google-analytics-id
VITE_SENTRY_DSN=your-sentry-dsn
```

## CI/CD

### GitHub Actions 工作流

创建 `.github/workflows/ci-cd.yml`：

```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test

      - name: Run lint
        run: npm run lint

      - name: Build
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_APP_ENV: production

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 监控和日志

### 集成 Sentry

**安装 Sentry**

```bash
npm install @sentry/vue
```

**配置 Sentry**

```typescript
import * as Sentry from '@sentry/vue'

Sentry.init({
  app,
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_APP_ENV,
  tracesSampleRate: 0.2
})
```

### 集成 Google Analytics

```typescript
import { createApp } from 'vue'
import VueGtag from 'vue-gtag'

const app = createApp(App)

app.use(VueGtag, {
  config: { id: import.meta.env.VITE_GA_ID }
})
```

### 日志监控

使用项目内置的日志工具：

```typescript
import { logger } from '@/utils/logger'

// 记录错误
logger.error('API Error', error)

// 记录性能
logger.performance('page-load', 1200)
```

## 最佳实践

1. **使用 HTTPS**
   - 配置 SSL 证书
   - 强制 HTTPS 重定向

2. **启用缓存**
   - 静态资源长期缓存
   - 使用 CDN

3. **压缩资源**
   - 启用 gzip 压缩
   - 使用 Brotli 压缩

4. **监控性能**
   - 使用 Lighthouse
   - 设置性能预算

5. **定期备份**
   - 备份数据库
   - 备份配置文件

## 相关资源

- [Vercel 文档](https://vercel.com/docs)
- [Netlify 文档](https://docs.netlify.com/)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [Nginx 文档](https://nginx.org/en/docs/)
- [Docker 文档](https://docs.docker.com/)