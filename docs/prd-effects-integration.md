# PRD — 效果集成方案：获奖站点效果 → 现有项目

> 版本：v0.1 | 状态：待评审 | 基于 Morphin / MagicUI / Aceternity UI 调研

---

## 1. 需求概述

### 1.1 背景

当前项目拥有完整的功能模块（60+ 组件），但视觉冲击力未达 Awwwards 级别。
参考站点（Morphin / MagicUI / Aceternity UI / Linear / Stripe）的差异化优势在于**效果层级**：
- 背景：WebGL shader 动态渐变、网格底纹、极光流动
- 卡片：3D tilt、追光、展开动画、毛玻璃
- 按钮：shine border、rainbow gradient、magnetic
- 文字：渐变、shimmer、滚动揭示
- 交互：光标跟随、blur fade、spring 动画

### 1.2 目标

将参考站的效果**组件化迁移**到项目中，与现有功能模块一一映射。
不改变项目架构，不引入新依赖，全部用 Vue 3 + GSAP + Tailwind 实现。

### 1.3 非目标

- 不引入 Framer Motion（已有 GSAP）
- 不引入新 npm 包（全部用现有依赖）
- 不改变路由/数据流/Store 架构
- 不重写已有功能组件（只增强视觉效果）

---

## 2. 效果映射总表

### 2.1 按模块映射

| 你的模块 | 文件路径 | 当前效果 | 目标效果 | 来源 | 工作量 |
|---------|---------|---------|---------|------|--------|
| **HeroSection** | `src/components/home/HeroSection.vue` | WebGL canvas + 三层文字混合 | Shader 丝带成形 + 脉冲 CTA | Morphin `shaders-hero-section` | 高 |
| **HeroSection** | 同上 | 纯色标题 | 渐变文字 + shimmer | MagicUI `animated-gradient-text` | 低 |
| **TechStack** | `src/components/home/TechStack.vue` | Spotlight + 底部 bar | 追光增强 + icon glow | Aceternity `pointer-spotlight` | 中 |
| **FeaturedProjects** | `src/components/home/FeaturedProjects.vue` | 可展开 narrative | 3D tilt + GSAP 展开编排 | Aceternity `tilt-card` | 中 |
| **CTA** | `src/components/ui/CTA.vue` | 5 种变体 + loading | Shine border + rainbow | MagicUI `shine-border` | 低 |
| **Header** | `src/components/common/Header.vue` | 滚动样式变化 | 玻璃拟态浮动导航 | Linear + Aceternity `floating-navbar` | 低 |
| **Footer** | `src/components/common/Footer.vue` | Spatial Dissolve | 增强 dissolve + glow | 已有，微调 | 低 |
| **BlogList** | `src/components/blog/BlogList.vue` | Timeline + 入场动画 | 滚动文字揭示 | Morphin `scroll-text-reveal` | 中 |
| **SearchModal** | `src/components/common/SearchModal.vue` | Teleport + 键盘导航 | Blur fade 进出 | MagicUI `blur-fade` | 低 |
| **全站** | 全局 | 纯色背景 | 网格底纹 | MagicUI `animated-grid-pattern` | 低 |
| **AboutSnapshot** | `src/components/home/AboutSnapshot.vue` | 技能标签 | 数字滚动计数 | MagicUI `number-ticker` | 中低 |
| **404** | `src/views/NotFound.vue` | 简单居中 | 粒子/星空背景 | MagicUI `particles` | 低 |
| **SocialLinks** | `src/components/contact/SocialLinks.vue` | 图标 + hover | 轨道环绕动画 | MagicUI `orbiting-circles` | 低 |
| **SkeletonLoader** | `src/components/common/SkeletonLoader.vue` | Shimmer 动画 | 增强 shimmer 效果 | Vercel / MagicUI | 低 |

### 2.2 效果来源清单

| 来源站 | 可复用效果 | 开源协议 | 适配工作量 |
|--------|-----------|---------|-----------|
| **Morphin** | shaders-hero, scroll-text-reveal, scroll-scramble | 付费（但原理公开） | 中-高 |
| **MagicUI** | 76 个组件（MIT 开源） | MIT | 低-中 |
| **Aceternity UI** | 30+ 效果组件 | MIT | 中 |
| **Linear.app** | 毛玻璃 + 暗色主题 + spring 动画 | 不开源 | 低（反向工程） |
| **Stripe** | Whatamesh shader 原理 | MIT | 中（已有基础） |

---

## 3. 分 Phase 实施计划

### Phase 0：设计 Token 层（先决条件）

| # | 任务 | 文件 | 说明 |
|---|------|------|------|
| 0.1 | 确认 shaderPalette.ts | `src/design-system/tokens/shaderPalette.ts` | 已有草稿，需确认色板 |
| 0.2 | 确认 accent 色变更 | `src/assets/styles/unified-system.css` | 蓝→紫（#2563EB → #7B4EED） |
| 0.3 | 确认 stripe CSS vars | `src/assets/styles/main.css` | 渐变变量改用新色板 |

**输出**：统一的 shader-to-component 色板，shader 用什么色，组件就用什么色。

### Phase 1：Hero 核心效果（P0）

| # | 任务 | 文件 | 说明 |
|---|------|------|------|
| 1.1 | 重写 fragment shader | `src/composables/useStripeGradient.ts` | 完全自定义 raw WebGL，per-pixel noise + pow(4) 锐化 |
| 1.2 | 丝带参数驱动 | 从 shaderPalette.ts 导入 ribbonLayers | 3 个 wave layer，独立颜色/频率/速度/种子 |
| 1.3 | CSS mask 白底 | `src/components/home/HeroSection.vue` | `mask-image: linear-gradient(to right, transparent 42%, #000 58%)` |
| 1.4 | 脉冲 CTA | `src/components/home/HeroSection.vue` | 参考 Morphin shaders-hero-section 的 pulse circle CTA |

**验收标准**：
- 左侧 42% 纯白背景（#FFFFFF）
- 右侧 3 层独立丝带，层间有白色间隙
- 丝带方向：左上 → 右下倾斜
- 丝带动画 60fps
- 非丝带区域纯白，无灰色/暗色残留

### Phase 2：卡片效果增强（P1）

| # | 任务 | 文件 | 说明 |
|---|------|------|------|
| 2.1 | TechStack 追光增强 | `src/components/home/TechStack.vue` | 优化 useCardSpotlight，光点更明显 |
| 2.2 | 项目卡片 tilt + 展开 | `src/components/home/FeaturedProjects.vue` | useCard3D + GSAP 编排展开动画 |
| 2.3 | 网格底纹组件 | 新建 `src/components/ui/GridPattern.vue` | SVG dot/grid pattern + CSS animation |

**验收标准**：
- TechStack 卡片鼠标移过有明显追光
- FeaturedProjects 卡片 3D 倾斜 + 光泽反射
- 页面有科技感网格底纹（非纯白背景）

### Phase 3：导航 + 弹窗 + 按钮（P2）

| # | 任务 | 文件 | 说明 |
|---|------|------|------|
| 3.1 | Header 玻璃拟态 | `src/components/common/Header.vue` | 滚动后 backdrop-filter: blur(20px) + 半透明背景 |
| 3.2 | CTA shine border | `src/components/ui/CTA.vue` | CSS @property + conic-gradient 旋转光泽 |
| 3.3 | SearchModal blur fade | `src/components/common/SearchModal.vue` | 进出动画加 blur + opacity |
| 3.4 | 滚动动画升级 | `src/composables/useScrollAnimations.ts` | blur-fade 变体（opacity + filter: blur） |

**验收标准**：
- 滚动后 Header 呈现毛玻璃效果
- Primary CTA 按钮 hover 时边框光泽流动
- SearchModal 进出有 blur 过渡
- 元素进入视口时从模糊到清晰

### Phase 4：锦上添花（P3）

| # | 任务 | 文件 | 说明 |
|---|------|------|------|
| 4.1 | NumberTicker | 新建 `src/components/ui/NumberTicker.vue` | 数字滚动动画 |
| 4.2 | OrbitingCircles | 新建 `src/components/ui/OrbitingCircles.vue` | 社交链接轨道动画 |
| 4.3 | 404 particles | `src/views/NotFound.vue` | 粒子星空背景 |
| 4.4 | Marquee | 新建 `src/components/ui/Marquee.vue` | 技术栈无限滚动 |

---

## 4. 技术约束

### 4.1 不引入新依赖

全部用现有技术栈：
- Vue 3 Composition API (`<script setup>`)
- GSAP (ScrollTrigger, 动画编排)
- Tailwind CSS (utility-first 样式)
- 原生 WebGL (shader 背景)
- SVG + CSS animation (图案/背景)

### 4.2 不改变架构

- 不修改路由配置
- 不修改 Store 数据流
- 不修改 composable 返回值类型
- 只改组件模板和样式，只改 composable 内部实现

### 4.3 性能约束

- 所有鼠标跟踪 composable 必须在触摸设备禁用（project-rules 5.1）
- Shader 在 `prefers-reduced-motion` 下暂停
- 动画在 `prefers-reduced-motion` 下降级为无动画
- Canvas 粒子数量移动端减半

### 4.4 暗色模式

每个新增效果必须同时支持 light / dark 模式（project-rules 4.3）。

---

## 5. 色板规范

### 5.1 丝带色板（Shader Palette）

```
紫色  #7B4EED  — Layer 0（宽丝带，主 accent）
粉红  #F03880  — Layer 1（中丝带，辅 accent）
蓝色  #0052FF  — Layer 2（细丝带，第三 accent）

基底  #FFFFFF  — 非丝带区域（左侧白底 + 丝带间白间隙）
```

### 5.2 组件 accent 色

```
主 accent  #7B4EED  （紫色，与 shader Layer 0 统一）
辅 accent  #F03880  （粉红，与 shader Layer 1 统一）
第三色    #0052FF  （蓝色，与 shader Layer 2 统一）
```

### 5.3 玻璃拟态

```
背景  rgba(255, 255, 255, 0.06)
边框  rgba(255, 255, 255, 0.12)
悬浮  rgba(255, 255, 255, 0.12)
模糊  blur(16px)
```

### 5.4 旧色清理

全局搜索并替换以下旧 accent 色：
- `#2563EB` (blue-600) → `#7B4EED` (purple)
- `rgba(37, 99, 235, *)` → `rgba(123, 78, 237, *)`
- `#3B82F6` (blue-500) → `#7B4EED` 或保留为 info 语义色

---

## 6. 验收标准

### 6.1 工程验收

- [ ] `npm run lint` 通过（0 errors）
- [ ] `npm run build` 通过
- [ ] `npm run test` 通过（≥70% coverage for new code）
- [ ] 移动端（375px）所有效果正常
- [ ] `prefers-reduced-motion` 下 shader 暂停、动画降级

### 6.2 视觉验收

- [ ] Hero 左侧 ~42% 纯白背景，右侧 3 层丝带成形
- [ ] 丝带颜色：紫 #7B4EED、粉 #F03880、蓝 #0052FF
- [ ] TechStack 卡片追光效果明显
- [ ] FeaturedProjects 卡片 3D 倾斜 + 光泽
- [ ] Header 滚动后毛玻璃效果
- [ ] CTA primary 按钮 shine border
- [ ] 全站无硬编码旧 accent 色（#2563EB / blue-600）
- [ ] 深色模式所有效果正常

---

## 7. 执行顺序

```
Phase 0（Token） → Phase 1（Hero） → Phase 2（卡片） → Phase 3（导航/弹窗） → Phase 4（锦上添花）
```

每 Phase 完成后评审一次。

---

## 8. 待决策项

1. **色板确认**：紫 #7B4EED / 粉 #F03880 / 蓝 #0052FF 是否定死？
2. **旧色替换范围**：全站替换 blue-600 为紫色，还是保留 blue 用于 info 语义场景？
3. **丝带方向**：左上 → 右下（当前方案）还是 右上 → 左下？
4. **白底宽度**：42% 还是 50%？
5. **组件材质**：全部玻璃拟态（dark glass）还是混合材质（卡片 solid，按钮 glass）？
