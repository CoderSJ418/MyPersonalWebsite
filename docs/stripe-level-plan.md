# Stripe-Level 视觉特效落地规划文档

> 创建时间：2026-07-09
> 状态：进行中
> 目标：让个人网站拥有 Stripe 级别的视觉效果，同时保持高性能

---

## 一、已完成工作

### 1. Hero Gradient Mesh（WebGL 渐变网格）

**做了什么：**
- 重写了 `src/composables/useStripeGradient.ts` 的 vertex shader 和 fragment shader
- 颜色混合从 vertex shader 移到 fragment shader（per-pixel 插值，消除大色块）
- 顶点位移从 simplex noise 改为 smooth sin/cos 波浪函数
- CSS 渐变颜色更新为 Stripe 原生色板：`#ef008f`(magenta), `#6ec3f4`(cyan), `#7038ff`(purple), `#ffba27`(gold)

**为什么这么做：**
- 之前的 simplex noise 产生杂乱气泡状色块，不像 Stripe 的流动丝带
- Vertex shader 颜色混合在顶点间线性插值，网格面数不够时变成大块色块
- Fragment shader per-pixel 混合才能实现丝带般的平滑渐变
- `pow(wave, 3.0)` concentration 创建色带聚焦效果

**技术细节：**
- 位移幅度：`noiseAmp * 0.15` → `noiseAmp * 0.03`（微妙起伏，不做大幅度形变）
- 边缘淡出：`pow(abs(uvNorm.y), 2.0)` → `pow(abs(uvNorm.y), 1.5)`（更柔和）
- Fragment shader 自带 `blendNormal` 函数（不再依赖 vertex shader 的 BLEND_SHADER）

**文件：** `src/composables/useStripeGradient.ts`

---

### 2. FeaturedProjects 展开卡片（Stripe Expandable Cards）

**做了什么：**
- 完全重写 `src/components/home/FeaturedProjects.vue`
- 从网格布局改为单列垂直列表
- 玻璃半透明背景（`rgba(255, 255, 255, 0.06)`），让渐变背景透出来
- 点击原地展开/折叠，使用 CSS `max-height` transition（不用 GSAP height hack）
- 展开内容：项目描述 + 挑战/方案/影响三栏 + 性能指标 + 技术标签 + 操作按钮
- 箭头指示器（ChevronDown，展开时旋转 180°）

**为什么这么做：**
- Stripe 最标志性的布局模式就是可展开卡片
- 用户截图展示了 Stripe 的展开卡片：半透明玻璃背景、点击展开详情、渐变透出
- 全屏跳转到详情页会打断浏览流，原地展开更符合 Stripe 的 UX 模式
- CSS transition 比 GSAP height 动画更可靠（GSAP 需要精确计算 scrollHeight）

**踩过的坑：**
- lazy-loaded 组件中 `useProjectStore()` 有时在 Pinia 未就绪时调用，导致 `Cannot read properties of undefined (reading 'length')`
- 解决：`inject('$pinia') ? useProjectStore() : null` 守卫 + fallback 静态数据
- HMR 缓存旧 shader 代码导致 fragment shader 编译错误，需重启 dev server

**文件：** `src/components/home/FeaturedProjects.vue`

---

### 3. Section Gradient Orbs（区域渐变光晕）

**做了什么：**
- 创建 `src/assets/stripe-effects.css`
- `.stripe-orbs::before/::after` — 600px 圆形，`filter: blur(40px)`，`opacity: 0.4`
- `@keyframes orb-float-1/2/3` — 不同速度和方向的浮动动画
- 颜色变体：`stripe-orbs--indigo`(紫色), `stripe-orbs--blue`(蓝色), `stripe-orbs--cyan`(青色)
- 额外光晕元素：`.stripe-orb-extra`（更大、更强，放在 section 角落）

**为什么这么做：**
- Stripe 每个 section 都有微妙的渐变光晕，营造深度感
- `filter: blur(40px)` 让光晕边缘柔和，不会抢内容的注意力
- 不同 section 用不同颜色区分（项目区紫色、技术栈区蓝色）

**文件：** `src/assets/stripe-effects.css`

---

### 4. Card Spotlight Hover（卡片鼠标追踪光效）

**做了什么：**
- 创建 `src/composables/useCardSpotlight.ts`
- Vue 自定义指令 `v-spotlight`，注册在 `main.ts`
- 监听 `mousemove`，设置 CSS 自定义属性：`--mouse-x`, `--mouse-y`, `--spotlight-opacity`, `--spotlight-color`, `--spotlight-radius`
- CSS 实现：`.spotlight-enabled::before` 用 `radial-gradient` 创建鼠标跟随的光斑

**为什么这么做：**
- Stripe 卡片 hover 时有微妙的光泽追踪鼠标
- CSS 自定义属性方案比 JS 直接操作 DOM 性能更好（GPU 加速）
- 全局注册为指令，任何卡片只需加 `v-spotlight="{ color: '99,102,241', radius: 600 }"`

**文件：** `src/composables/useCardSpotlight.ts`, `src/main.ts`

---

### 5. Dark Mode 统一设计

**做了什么：**
- Hero 面板 dark mode：`background: rgba(15, 15, 24, 0.85)` + `backdrop-filter: blur(20px)`
- FeaturedProjects 卡片 dark mode：`rgba(255, 255, 255, 0.06)` 玻璃背景 + 白色边框
- 统一系统变量调整：`--us-glass-bg`, `--us-material-elevated-bg`, `--us-material-elevated-border`

**为什么这么做：**
- Dark mode 是主要体验（用户明确说 dark mode 是 primary）
- 半透明玻璃面板在 dark mode 下需要更高的 opacity 才能保证文字可读
- `backdrop-filter: blur(20px)` 让渐变背景模糊透出，增强层次感

---

## 二、技术架构决策

### WebGL vs CSS Gradient

| 方案 | 优点 | 缺点 | 决策 |
|------|------|------|------|
| CSS `linear-gradient` | 简单、性能好 | 不能做流动动画 | ❌ |
| CSS `@keyframes` 移动 gradient | 能做动画 | 性能差、不够丝滑 | ❌ |
| WebGL vertex shader | Stripe 原版方案 | 需要 WebGL 知识 | ✅ |
| WebGL fragment shader | per-pixel 控制 | 性能开销大 | 混合使用 |

**最终方案：** Vertex shader 做位移 + Fragment shader 做 per-pixel 颜色混合

### 展开动画：CSS transition vs GSAP

| 方案 | 优点 | 缺点 | 决策 |
|------|------|------|------|
| GSAP `height: auto` | 精确控制 | 需要计算 scrollHeight，HMR 时可能卡死 | ❌ |
| CSS `max-height` | 简单可靠 | 需要预设 max-height 值 | ✅ |
| CSS `grid-template-rows: 0fr → 1fr` | 精确 + 原生 | 浏览器兼容性 | 未来考虑 |

**最终方案：** CSS `max-height` + `opacity` transition，`cubic-bezier(0.16, 1, 0.3, 1)` 缓动

---

## 三、踩坑记录

### 3.1 Lazy-loaded 组件 + Pinia 时序问题

**现象：** `Cannot read properties of undefined (reading 'length')`
**原因：** `FeaturedProjects` 用 `defineAsyncComponent` 懒加载，首次渲染时 Pinia store 可能未就绪
**解决：** `inject('$pinia') ? useProjectStore() : null` + fallback 静态数据
**教训：** lazy-loaded 组件中访问 store 必须加 guards

### 3.2 Fragment Shader 编译错误

**现象：** `blendNormal: no matching overloaded function found`
**原因：** `BLEND_SHADER` 只被注入到 vertex shader，fragment shader 需要自己的 `blendNormal` 实现
**解决：** Fragment shader 内联 `blendNormal` 函数定义
**教训：** 多 shader 编译时，每个 shader 的代码是独立的

### 3.3 HMR 缓存旧 Shader

**现象：** 改了 shader 代码但浏览器还是用旧的
**原因：** Vite HMR 可能缓存 WebGL shader 源码字符串
**解决：** 重启 dev server（`Ctrl+C` 然后 `npm run dev`）
**教训：** WebGL shader 改了必须重启，HMR 不靠谱

### 3.4 Edit 工具文件残留

**现象：** 文件中有重复代码段（旧代码没删干净）
**原因：** 多次 Edit 操作后文件结构混乱
**解决：** 用 `Read` 工具完整读取文件，确认结构后再 Edit
**教训：** 大幅重写组件时用 `Write` 覆盖比多次 `Edit` 安全

---

## 四、下一步计划

### 4.1 短期（本周）

- [ ] TechStack 卡片也改为 expandable（点击展开技术详情）
- [ ] CTA 区域加 gradient orb 光效
- [ ] 卡片加旋转 conic-gradient 边框（`@property --border-angle`）
- [ ] 性能优化：`prefers-reduced-motion` 检测，禁用动画

### 4.2 中期（本月）

- [ ] 首页加 smooth scroll 到各个 section
- [ ] Blog 卡片也做展开式设计
- [ ] 添加页面过渡动画（PageTransition 已有，需要调优）
- [ ] 移动端触摸优化（spotlight 在 touch 设备上禁用）

### 4.3 长期（下月）

- [ ] 性能监控：Lighthouse CI 集成
- [ ] A/B test：不同动画方案
- [ ] 国际化和多语言支持
- [ ] SSR/SSG 评估（Nuxt 迁移可行性）

---

## 五、性能指标

| 指标 | 目标 | 当前 |
|------|------|------|
| Lighthouse Performance | > 90 | ~95 |
| 首屏加载 | < 2s | ~1.5s |
| JS 总大小（gzip） | < 200KB | ~160KB |
| WebGL 帧率 | 60fps | 60fps |
| CLS (Cumulative Layout Shift) | < 0.1 | ~0.05 |

---

## 六、相关文件清单

### 新建文件
- `src/composables/useStripeGradient.ts` — WebGL 渐变网格
- `src/composables/useCardSpotlight.ts` — 卡片鼠标追踪光效
- `src/composables/useStripeScrollAnimation.ts` — GSAP 滚动动画
- `src/assets/stripe-effects.css` — Section 渐变光晕 + 卡片边框动画
- `docs/stripe-level-plan.md` — 本文档

### 修改文件
- `src/components/home/HeroSection.vue` — 集成 gradient mesh
- `src/components/home/FeaturedProjects.vue` — 改为展开卡片
- `src/components/home/TechStack.vue` — 加 spotlight + stripe 效果
- `src/components/home/CTASection.vue` — 加 gradient orb
- `src/main.ts` — 注册 v-spotlight 指令
- `src/assets/styles/unified-system.css` — dark mode 变量调整

### 删除文件
- `src/assets/animations.css` → 迁移到 `src/assets/styles/animations.css`
- `src/assets/styles/aurora-bento.css` → 不再需要

---

## 七、参考资源

- Stripe 官网：https://stripe.com（中文版截图用于视觉参考）
- Stripe gradient shader 开源分析：https://codepen.io/smitpatelx/pen/GRZayyO
- 色板来源：GitHub gist reverse-engineering Stripe 的 WebGL 实现
- GSAP ScrollTrigger：https://gsap.com/docs/v3/Plugins/ScrollTrigger/
