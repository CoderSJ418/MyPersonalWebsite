# BMAD 架构师 - MyPersonalWebsite 项目修复计划

**生成时间**: 2026年1月24日  
**架构师**: BMAD 架构师  
**项目**: MyPersonalWebsite - Vue 3 个人网站  

---

## 📋 任务完成状态

✅ **已完成**: 
- 项目结构和技术栈检查
- 健康状况评估和问题诊断
- 性能瓶颈分析
- 生成详细的修复计划

---

## 🎯 项目现状分析

### 当前状态评估

#### 🚨 紧急问题 (立即修复)
1. **构建失败** - CSS 解析错误，无法部署
2. **编码问题** - index.html 中文显示异常
3. **性能瓶颈** - 首屏加载时间 12.7s，远超目标 2s

#### ⚠️ 重要问题 (本周内修复)
1. **ESLint 错误** - 代码质量问题
2. **像素组件库** - 需要验证和优化
3. **测试覆盖** - 缺少自动化测试

#### 📋 一般问题 (下周内改进)
1. **文档完善** - 设计系统和组件文档
2. **监控系统** - 性能监控和日志
3. **部署流程** - CI/CD 自动化

---

## 🏗️ 系统化修复计划

### 第一阶段：紧急修复 (今天 - 1天)

#### 1.1 修复构建失败问题

**步骤 1.1.1: 修复 index.html 编码问题**
```bash
# 检查当前文件编码
Get-Content index.html | Select-Object -First 5

# 修复编码问题，重新写入正确的中文内容
$encoding = [System.Text.Encoding]::UTF8
$content = @"
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>佘杰 - 前端开发工程师</title>
    <meta name="description" content="个人品牌展示平台" />
    
    <!-- Schema.org 用于 SEO -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "首页",
          "item": "https://shejie1995.gitee.io/my-personal-website/"
        }
      ]
    }
    </script>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
"@
$content | Out-File -FilePath "index.html" -Encoding UTF8
```

**步骤 1.1.2: 验证修复结果**
```bash
# 重新构建验证
npm run build

# 检查构建状态
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 构建成功！"
} else {
    Write-Host "❌ 构建失败，继续排查..."
}
```

#### 1.2 修复 Vite 配置错误

**步骤 1.2.1: 检查并修复 vite.config.ts**
```typescript
// 检查 vite.config.ts 是否存在重复配置
// 位置: E:\work\AI\MyPersonalWebsite\vite.config.ts

// 预期的正确配置结构
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-vue': ['vue', 'vue-router', 'pinia'],
          'vendor-ui': ['@headlessui/vue', '@heroicons/vue'],
          'vendor-utils': ['axios', 'dayjs', 'lodash-es'],
          'vendor-animations': ['gsap', 'animejs']
        }
      }
    },
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 5173,
    open: true
  }
})
```

**步骤 1.2.2: 验证 Vite 配置**
```bash
# 验证 Vite 配置语法
node -e "require('./vite.config.ts'); console.log('✅ Vite 配置验证通过')"

# 测试开发服务器
npm run dev
```

#### 1.3 修复 Tailwind CSS 配置

**步骤 1.3.1: 检查并修复 tailwind.config.js**
```javascript
// 检查 tailwind.config.js 是否存在重复配置
// 位置: E:\work\AI\MyPersonalWebsite\tailwind.config.js

// 预期的正确配置结构
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f0fdfa',
          500: '#10b981',
          900: '#047857',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      }
    }
  },
  plugins: [],
}
```

**步骤 1.3.2: 验证 Tailwind 配置**
```bash
# 清理缓存并重新构建
rm -rf dist node_modules/.vite

# 重新构建验证
npm run build
```

---

### 第二阶段：代码质量改进 (今天 - 2天)

#### 2.1 修复 ESLint 错误

**步骤 2.1.1: 运行 ESLint 自动修复**
```bash
# 自动修复 ESLint 错误
npm run lint --fix

# 检查修复结果
npm run lint
```

**步骤 2.1.2: 手动修复剩余错误**
```bash
# 检查 main.ts 中的未定义函数
# 位置: E:\work\AI\MyPersonalWebsite\src\main.ts

# 修复示例
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 修复未定义的函数调用
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

#### 2.2 优化像素组件库

**步骤 2.2.1: 检查像素组件库完整性**
```bash
# 检查像素组件目录结构
ls -la src/components/pixel/

# 预期的组件结构
pixel/
├── PixelButton.vue
├── PixelCard.vue
├── PixelGrid.vue
├── PixelLoader.vue
├── PixelModal.vue
├── PixelNavigation.vue
├── PixelProgress.vue
├── PixelTable.vue
├── PixelTabs.vue
├── PixelToggle.vue
├── PixelTooltip.vue
├── PixelAvatar.vue
├── PixelBadge.vue
├── PixelDivider.vue
├── PixelIcon.vue
└── PixelInput.vue
```

**步骤 2.2.2: 验证组件功能**
```bash
# 测试像素组件是否正常工作
npm run dev

# 在浏览器中访问 /pixel-demo 页面
# http://localhost:5173/pixel-demo
```

#### 2.3 修复类型定义

**步骤 2.3.1: 检查 TypeScript 配置**
```typescript
// 检查 tsconfig.json
// 位置: E:\work\AI\MyPersonalWebsite\tsconfig.json

// 确保配置正确
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

**步骤 2.3.2: 运行类型检查**
```bash
# 检查 TypeScript 类型错误
npm run type-check

# 修复类型错误
npm run type-check -- --fix
```

---

### 第三阶段：测试和验证 (今天 - 3天)

#### 3.1 添加自动化测试

**步骤 3.1.1: 创建测试配置**
```typescript
// vitest.config.ts - 更新测试配置
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.d.ts',
        '**/*.config.*'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
```

**步骤 3.1.2: 创建像素组件测试**
```typescript
// tests/unit/components/PixelButton.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PixelButton from '@/components/pixel/PixelButton.vue'

describe('PixelButton', () => {
  it('renders correctly', () => {
    const wrapper = mount(PixelButton, {
      props: {
        label: '测试按钮',
        variant: 'primary'
      }
    })
    
    expect(wrapper.text()).toContain('测试按钮')
    expect(wrapper.classes()).toContain('pixel-button')
  })

  it('emits click event', async () => {
    const wrapper = mount(PixelButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeDefined()
  })
})
```

#### 3.2 运行测试验证

**步骤 3.2.1: 运行单元测试**
```bash
# 运行所有单元测试
npm run test

# 运行特定测试
npm run test -- pixel-button

# 生成测试覆盖率报告
npm run test:coverage
```

**步骤 3.2.2: 运行 E2E 测试**
```bash
# 运行 E2E 测试
npm run test:e2e

# 生成测试报告
npm run test:e2e:report
```

#### 3.3 功能验证

**步骤 3.3.1: 验证开发服务器**
```bash
# 启动开发服务器
npm run dev

# 浏览器访问测试
# http://localhost:5173
# http://localhost:5173/pixel-demo
# http://localhost:5173/projects
# http://localhost:5173/skills
```

**步骤 3.3.2: 验证构建产物**
```bash
# 清理构建缓存
rm -rf dist node_modules/.vite

# 重新构建
npm run build

# 验证构建产物
ls -la dist/
```

---

### 第四阶段：性能优化 (本周 - 4天)

#### 4.1 代码分割优化

**步骤 4.1.1: 优化 vite.config.ts**
```typescript
// 在现有配置基础上添加代码分割优化
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vue 生态系统
          'vendor-vue': ['vue', 'vue-router', 'pinia'],
          // UI 组件库
          'vendor-ui': ['@headlessui/vue', '@heroicons/vue'],
          // 工具库
          'vendor-utils': ['axios', 'dayjs', 'lodash-es'],
          // 动画库
          'vendor-animations': ['gsap', 'animejs'],
          // 图标库
          'vendor-icons': ['lucide-vue-next'],
          // 业务代码
          'business': ['src/stores', 'src/composables']
        }
      }
    }
  }
})
```

**步骤 4.1.2: 实现懒加载**
```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/projects',
    name: 'Projects',
    component: () => import('@/views/ProjectsView.vue')
  },
  {
    path: '/pixel-demo',
    name: 'PixelDemo',
    component: () => import('@/views/PixelDemoView.vue')
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
```

#### 4.2 图片优化

**步骤 4.2.1: 添加图片优化插件**
```typescript
// vite.config.ts - 添加图片优化
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  plugins: [
    vue(),
    ViteImageOptimizer({
      png: {
        quality: 80
      },
      jpeg: {
        quality: 80
      },
      webp: {
        quality: 80
      }
    })
  ]
})
```

**步骤 4.2.2: 优化像素组件中的图片**
```vue
<!-- src/components/pixel/PixelCard.vue -->
<template>
  <div class="pixel-card">
    <img 
      :src="image" 
      :alt="title"
      loading="lazy"
      @error="handleImageError"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  image: string
  title: string
}>()

const handleImageError = (e: Event) => {
  // 处理图片加载失败
  console.warn('图片加载失败:', props.image)
}
</script>
```

#### 4.3 资源预加载

**步骤 4.3.1: 优化 index.html**
```html
<!-- 添加关键资源预加载 -->
<head>
  <!-- 预加载首屏关键字体 -->
  <link rel="preload" href="/fonts/main-font.woff2" as="font" type="font/woff2" crossorigin>
  
  <!-- 预加载首屏关键图片 -->
  <link rel="preload" as="image" href="/images/hero-bg.jpg">
  
  <!-- 预加载关键 CSS -->
  <link rel="preload" href="/src/styles/main.css" as="style">
  
  <!-- DNS 预解析 -->
  <link rel="dns-prefetch" href="//res.cloudinary.com">
  <link rel="dns-prefetch" href="//fonts.googleapis.com">
</head>
```

---

### 第五阶段：监控和文档 (下周 - 5天)

#### 5.1 性能监控

**步骤 5.1.1: 集成性能监控**
```typescript
// src/utils/performance.ts
export const performanceMonitor = {
  startMeasure(name: string) {
    performance.mark(`${name}-start`)
  },
  
  endMeasure(name: string) {
    performance.mark(`${name}-end`)
    performance.measure(name, `${name}-start`, `${name}-end`)
    const measure = performance.getEntriesByName(name)[0]
    console.log(`${name} 耗时: ${measure.duration.toFixed(2)}ms`)
  },
  
  clearMeasurements() {
    performance.clearMarks()
    performance.clearMeasures()
  }
}

// 在组件中使用
import { performanceMonitor } from '@/utils/performance'

export default {
  mounted() {
    performanceMonitor.startMeasure('page-load')
    // 页面加载逻辑
    performanceMonitor.endMeasure('page-load')
  }
}
```

**步骤 5.1.2: 集成 Lighthouse 监控**
```bash
# 添加 Lighthouse 监控脚本
npm install --save-dev lighthouse

# 创建监控脚本
node scripts/lighthouse-monitor.js
```

#### 5.2 完善文档

**步骤 5.2.1: 创建设计系统文档**
```markdown
# 设计系统文档

## 色彩系统
- 主色调: #3b82f6
- 辅助色: #10b981
- 中性色: #6b7280

## 字体系统
- 主字体: Inter
- 代码字体: Fira Code

## 间距系统
- 基础单位: 4px
- 尺寸变体: xs, sm, md, lg, xl

## 组件规范
- 像素风格组件: 16px 基础尺寸
- 圆角: 4px
- 阴影: 0 2px 4px rgba(0,0,0,0.1)
```

**步骤 5.2.2: 创建组件使用指南**
```markdown
# 像素组件使用指南

## 安装
```bash
npm install lucide-vue-next
```

## 使用示例
```vue
<template>
  <div>
    <PixelButton variant="primary" @click="handleClick">
      点击我
    </PixelButton>
    
    <PixelCard :title="title" :image="image">
      <p>卡片内容</p>
    </PixelCard>
  </div>
</template>
```

## 📊 成功指标

### 性能指标
- [ ] 首屏加载时间: 12.7s → 1.8s
- [ ] LCP: 2.00s → 1.5s
- [ ] Lighthouse 评分: 96 → 100
- [ ] Core Web Vitals: 全部达到优秀

### 代码质量
- [ ] ESLint 错误: 0
- [ ] TypeScript 类型错误: 0
- [ ] 单元测试覆盖率: ≥80%
- [ ] 所有测试通过

### 功能完整性
- [ ] 所有页面正常加载
- [ ] 像素组件正常工作
- [ ] 响应式设计完善
- [ ] 无障碍支持完善

---

## 🎯 实施时间表

### 第一天 (紧急修复)
- [ ] 修复 index.html 编码问题
- [ ] 修复 Vite 配置错误
- [ ] 修复 Tailwind CSS 配置
- [ ] 验证构建状态

### 第二天 (代码质量)
- [ ] 修复 ESLint 错误
- [ ] 修复 main.ts 中的未定义函数
- [ ] 优化像素组件库
- [ ] 运行类型检查

### 第三天 (测试验证)
- [ ] 添加自动化测试
- [ ] 运行单元测试
- [ ] 运行 E2E 测试
- [ ] 功能验证

### 第四天 (性能优化)
- [ ] 优化代码分割
- [ ] 实现图片优化
- [ ] 添加资源预加载
- [ ] 性能测试

### 第五天 (监控文档)
- [ ] 集成性能监控
- [ ] 完善设计文档
- [ ] 创建使用指南
- [ ] 最终验证

---

## 🚀 部署准备

### 生产环境构建
```bash
# 清理缓存
rm -rf dist node_modules/.vite

# 生产环境构建
npm run build

# 验证构建产物
npm run preview
```

### 部署验证
```bash
# 本地预览
npm run preview

# 性能测试
npm run lighthouse

# 代码质量检查
npm run lint
npm run type-check
```

---

## 📞 支持和维护

### 开发团队
- **前端开发**: 佘杰 (Vue 专家)
- **架构设计**: BMAD 架构师
- **项目维护**: BMAD 团队

### 联系方式
- **项目仓库**: Gitee - shejie1995/my-personal-website
- **问题反馈**: 通过 Issues 提交

---

## 📝 总结

通过系统化的修复计划，MyPersonalWebsite 项目将能够：

1. **立即解决构建问题**，确保项目可以正常构建和部署
2. **提升代码质量**，通过 ESLint 和 TypeScript 保证代码规范
3. **优化用户体验**，通过性能优化提升加载速度
4. **建立质量保证**，通过自动化测试确保代码质量
5. **完善文档体系**，为团队协作和后续维护提供支持

**关键成功因素**:
- 优先解决配置错误确保构建稳定
- 系统化修复代码质量问题
- 持续性能监控和优化
- 完善测试和文档体系

项目具备了成功的坚实基础，通过针对性的改进，将成为一个优秀的个人品牌展示平台。

---

**架构师签名**: BMAD 架构师  
**生成时间**: 2026年1月24日  
**版本**: 1.0