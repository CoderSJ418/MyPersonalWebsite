# MyPersonalWebsite 调试指南

## 概述

本指南帮助您诊断和解决 MyPersonalWebsite 项目中可能遇到的问题。

---

## 常见问题诊断

### 问题 1：粒子动画不明显

**症状**：首页背景看不到粒子动画

**原因分析**：
1. Canvas 透明度太低
2. 粒子太小
3. 粒子速度太慢
4. 颜色对比度不够

**解决方案**：
1. **刷新浏览器**：按 `Ctrl+Shift+R`（Windows）或 `Cmd+Shift+R`（Mac）强制刷新
2. **清除缓存**：
   - 打开浏览器开发者工具（F12）
   - 右键点击刷新按钮
   - 选择"清空缓存并硬性重新加载"
3. **检查控制台**：
   - 打开浏览器开发者工具（F12）
   - 查看 Console 标签
   - 查找错误信息

**验证修复**：
- 粒子大小：2-6像素（之前1-4像素）
- 粒子速度：1.0像素/帧（之前0.5像素/帧）
- Canvas 透明度：0.8（亮色） / 0.6（暗色）（之前0.6/0.3）
- 粒子颜色：rgba(59, 130, 246, 0.4-0.8)（之前0.3-0.8）

### 问题 2：搜索功能不工作

**症状**：按 Ctrl+K 没有反应

**原因分析**：
1. 依赖未安装
2. 组件未正确导入
3. 事件监听器未注册

**解决方案**：
1. **检查依赖**：
   ```bash
   cd E:\work\AI\MyPersonalWebsite
   npm list | grep pinia
   ```
   如果没有 Pinia，运行：
   ```bash
   npm install pinia
   ```

2. **检查控制台错误**：
   - 打开浏览器开发者工具（F12）
   - 查看 Console 标签
   - 查找红色错误信息

3. **重启开发服务器**：
   ```bash
   # 停止服务器（Ctrl+C）
   npm run dev
   ```

### 问题 3：动画效果不流畅

**症状**：动画卡顿或掉帧

**原因分析**：
1. 浏览器性能问题
2. 硬件加速未启用
3. 动画太多

**解决方案**：
1. **启用硬件加速**：
   - 打开浏览器开发者工具（F12）
   - 查看 Performance 标签
   - 检查 GPU 加速状态

2. **减少动画数量**：
   - 检查 `src/components/common/ParticleBackground.vue`
   - 修改粒子数量（从80改为40）

3. **检查性能监控**：
   - 打开浏览器开发者工具（F12）
   - 查看 Performance 标签
   - 录制性能分析

### 问题 4：移动端显示异常

**症状**：移动端布局错乱

**原因分析**：
1. 响应式断点配置错误
2. 视口设置错误
3. CSS 冲突

**解决方案**：
1. **检查视口设置**：
   - 打开 `index.html`
   - 确认有以下 meta 标签：
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

2. **使用设备模拟器**：
   - 打开浏览器开发者工具（F12）
   - 点击设备模拟器图标（Ctrl+Shift+M）
   - 测试不同设备尺寸

3. **检查 Tailwind 断点**：
   - 打开 `tailwind.config.js`
   - 确认移动端断点配置正确

---

## 浏览器控制台检查

### 打开控制台
- **Chrome/Edge**: 按 F12 或 Ctrl+Shift+I
- **Firefox**: 按 F12 或 Ctrl+Shift+I
- **Safari**: 按 Cmd+Option+I（Mac）

### 检查常见错误

#### 1. 404 错误
**症状**：`Failed to load resource: the server responded with a status of 404`

**原因**：文件路径错误或文件不存在

**解决方案**：
- 检查文件路径是否正确
- 确认文件是否存在

#### 2. 语法错误
**症状**：`Uncaught SyntaxError: Unexpected token`

**原因**：JavaScript/TypeScript 语法错误

**解决方案**：
- 检查代码语法
- 查看 TypeScript 编译错误

#### 3. 类型错误
**症状**：`Type 'xxx' is not assignable to type 'yyy'`

**原因**：TypeScript 类型不匹配

**解决方案**：
- 修正类型定义
- 使用类型断言

#### 4. 组件未注册
**症状**：`Failed to resolve component: xxx`

**原因**：组件未正确导入或注册

**解决方案**：
- 检查组件导入路径
- 确认组件已注册

---

## 性能检查

### 使用 Lighthouse

**步骤**：
1. 打开浏览器开发者工具（F12）
2. 切换到 Lighthouse 标签
3. 点击 "Analyze page load"
4. 等待分析完成

**关注指标**：
- **Performance**: 目标 > 90
- **Accessibility**: 目标 > 90
- **Best Practices**: 目标 > 90
- **SEO**: 目标 > 90

### 使用性能监控

**查看 Core Web Vitals**：
1. 打开浏览器开发者工具（F12）
2. 切换到 Performance 标签
3. 点击录制按钮（圆点）
4. 刷新页面
5. 停止录制
6. 查看性能指标

**关键指标**：
- **LCP (Largest Contentful Paint)**: 目标 < 2.5s
- **FID (First Input Delay)**: 目标 < 100ms
- **CLS (Cumulative Layout Shift)**: 目标 < 0.1

---

## 网络检查

### 检查资源加载

**步骤**：
1. 打开浏览器开发者工具（F12）
2. 切换到 Network 标签
3. 刷新页面
4. 查看资源加载情况

**关注事项**：
- 加载时间过长的资源
- 失败的请求（红色）
- 404 错误
- 缓存策略

### 检查 Service Worker

**步骤**：
1. 打开浏览器开发者工具（F12）
2. 切换到 Application 标签
3. 左侧选择 Service Workers
4. 查看状态

**正常状态**：
- Status: `activated` 或 `activating`
- Running: `Yes`

---

## 调试技巧

### 1. 使用 console.log

在代码中添加日志：
```typescript
console.log('粒子数量:', particles.length)
console.log('Canvas 尺寸:', canvas.width, canvas.height)
console.log('鼠标位置:', mouse.x, mouse.y)
```

### 2. 使用 debugger

在代码中添加断点：
```typescript
debugger // 代码会在这里暂停
```

### 3. 使用 Vue DevTools

**安装 Vue DevTools**：
- Chrome: https://chrome.google.com/webstore/detail/vuejs-devtools/
- Firefox: https://addons.mozilla.org/firefox/addon/vue-js-devtools/

**使用 Vue DevTools**：
1. 打开浏览器开发者工具（F12）
2. 切换到 Vue 标签
3. 查看组件树、状态、事件

### 4. 使用 TypeScript 类型检查

**运行类型检查**：
```bash
cd E:\work\AI\MyPersonalWebsite
npx vue-tsc --noEmit
```

---

## 常见错误代码

### ENOENT
**错误**：`Error: ENOENT: no such file or directory`

**原因**：文件或目录不存在

**解决方案**：
- 检查文件路径
- 确认文件存在

### EADDRINUSE
**错误**：`Error: listen EADDRINUSE: address already in use`

**原因**：端口已被占用

**解决方案**：
```bash
# 查找占用端口的进程
netstat -ano | findstr :5173

# 结束进程
taskkill /PID <进程ID> /F
```

### MODULE_NOT_FOUND
**错误**：`Error: Cannot find module 'xxx'`

**原因**：依赖未安装

**解决方案**：
```bash
npm install
```

---

## 环境检查

### 检查 Node.js 版本
```bash
node --version
# 目标：>= 16.0.0
```

### 检查 npm 版本
```bash
npm --version
# 目标：>= 8.0.0
```

### 检查依赖安装
```bash
cd E:\work\AI\MyPersonalWebsite
npm list --depth=0
```

### 检查环境变量
```bash
echo $NODE_ENV
# 应该为 development 或 production
```

---

## 构建调试

### 开发构建
```bash
cd E:\work\AI\MyPersonalWebsite
npm run dev
```

### 生产构建
```bash
cd E:\work\AI\MyPersonalWebsite
npm run build
```

### 预览生产构建
```bash
cd E:\work\AI\MyPersonalWebsite
npm run preview
```

### 代码检查
```bash
cd E:\work\AI\MyPersonalWebsite
npm run lint
```

### 代码格式化
```bash
cd E:\work\AI\MyPersonalWebsite
npm run format
```

---

## 获取帮助

### 查看文档
- **项目总结**: `docs/PROJECT_SUMMARY.md`
- **快速开始**: `docs/QUICK_START.md`
- **完成报告**: `FINAL_COMPLETION_REPORT.md`
- **实现验证**: `docs/implementation-verification-report.md`

### 查看源代码
- **组件**: `src/components/`
- **Composables**: `src/composables/`
- **工具函数**: `src/utils/`
- **类型定义**: `src/types/`

### 查看配置
- **Vite 配置**: `vite.config.ts`
- **Tailwind 配置**: `tailwind.config.js`
- **TypeScript 配置**: `tsconfig.json`
- **ESLint 配置**: `.eslintrc.cjs`

---

## 联系方式

如果问题仍未解决，请：
1. 记录错误信息
2. 记录复现步骤
3. 记录浏览器信息
4. 记录控制台输出

---

**最后更新**: 2026年1月19日
**版本**: 1.0.0