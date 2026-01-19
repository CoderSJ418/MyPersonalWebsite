# 图片资源说明

本目录包含网站所需的所有图片资源。

## 目录结构

```
public/
└── images/
    ├── projects/          # 项目截图
    │   ├── project1.jpg   # Vue 3 企业级管理系统
    │   ├── project2.jpg   # React 18 电商后台
    │   ├── project3.jpg   # Next.js 14 博客平台
    │   ├── project4.jpg   # 微信小程序商城
    │   ├── project5.jpg   # 数据可视化大屏
    │   ├── project6.jpg   # 在线协作白板
    │   ├── project7.jpg   # AI智能客服系统
    │   └── project8.jpg   # 低代码平台
    ├── avatar.png         # 个人头像 (200x200, <50KB)
    ├── profile.jpg        # 个人照片 (800x800, <300KB)
    ├── work.jpg           # 工作场景照片 (1200x800, <200KB)
    └── og-image.png       # Open Graph 图片 (1200x630, <200KB)
```

## 图片要求

### 项目截图 (project1.jpg ~ project8.jpg)
- **尺寸**：1200x800 像素
- **格式**：JPG 或 PNG
- **大小**：<200KB（优化后）
- **内容**：项目的主要界面截图
- **建议**：使用真实的项目截图，展示关键功能

### 个人头像 (avatar.png)
- **尺寸**：200x200 像素
- **格式**：PNG（支持透明背景）
- **大小**：<50KB
- **内容**：个人头像

### 个人照片 (profile.jpg)
- **尺寸**：800x800 像素
- **格式**：JPG
- **大小**：<300KB
- **内容**：个人照片

### 工作场景照片 (work.jpg)
- **尺寸**：1200x800 像素
- **格式**：JPG
- **大小**：<200KB
- **内容**：工作场景照片

### Open Graph 图片 (og-image.png)
- **尺寸**：1200x630 像素
- **格式**：PNG
- **大小**：<200KB
- **内容**：网站预览图，包含网站名称和简介

## 图片优化建议

1. **使用工具优化图片**：
   - TinyPNG (https://tinypng.com/)
   - Squoosh (https://squoosh.app/)
   - ImageOptim (https://imageoptim.com/)

2. **使用合适的格式**：
   - 照片：JPG
   - 图标、透明背景：PNG
   - 矢量图：SVG

3. **压缩图片**：
   - 保持视觉质量的前提下，尽可能减小文件大小
   - 使用渐进式 JPG 和交错式 PNG

4. **使用 WebP 格式（可选）**：
   - WebP 格式比 JPG/PNG 小 25-35%
   - 支持透明背景
   - 现代浏览器都支持

## 占位符

如果暂时没有真实图片，可以使用以下占位符服务：

- Placeholder.com (https://placeholder.com/)
- Placehold.co (https://placehold.co/)
- Lorem Picsum (https://picsum.photos/)

示例：
```
https://placehold.co/1200x800/3b82f6/ffffff?text=Vue+3+企业级管理系统
```

## 注意事项

1. 确保图片文件名与 `projects.json` 中的 `image` 字段匹配
2. 图片路径应该是绝对路径，以 `/images/` 开头
3. 优化图片大小以提高网站加载速度
4. 使用 alt 属性提供图片描述
5. 确保图片在不同设备上都能正常显示

## 更新日期

2024-01-19