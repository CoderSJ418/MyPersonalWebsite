# Phase 3 任务清单 — Hero 改造 + 材质统一

> **执行前确保 Phase 2 全部通过。先读 `docs/joycode/MASTER.md`。**

---

## Task 3.1 — Hero 极简确认

修改 `src/components/home/HeroSection.vue`。

### 要求

Hero 必须是一个**干净简洁**的静态布局，没有任何花哨效果。

### DOM 结构规格

```html
<!-- Hero 容器 -->
<section class="hero">
  <!-- 纯白背景，无任何渐变/shader/canvas -->

  <div class="hero-content">
    <!-- 大标题 -->
    <h1>你的名字</h1>
    <p>全栈开发者 / 创意工程师</p>

    <!-- 两个 CTA 按钮 -->
    <div class="hero-cta">
      <a href="/projects" class="btn-primary">查看作品</a>
      <a href="/lab" class="btn-secondary">效果实验室 →</a>
    </div>
  </div>

  <!-- Marquee 技术栈滚动条 -->
  <div class="hero-marquee">
    <div class="hero-marquee-track">
      <span>Vue 3</span><span>·</span>
      <span>TypeScript</span><span>·</span>
      <span>Tailwind CSS</span><span>·</span>
      <span>GSAP</span><span>·</span>
      <span>Pinia</span><span>·</span>
      <span>Vite</span><span>·</span>
      <!-- 重复一遍保证无缝滚动 -->
      <span>Vue 3</span><span>·</span>
      <span>TypeScript</span><span>·</span>
      <span>Tailwind CSS</span><span>·</span>
      <span>GSAP</span><span>·</span>
      <span>Pinia</span><span>·</span>
      <span>Vite</span><span>·</span>
    </div>
  </div>
</section>
```

### 样式要求

| 元素 | 样式 |
|------|------|
| 背景 | 纯白 `#FFFFFF` |
| 标题 | `text-5xl font-bold tracking-tight text-slate-900` |
| 副标题 | `text-lg text-slate-500` |
| 主按钮 | 蓝 `#2563EB` 渐变背景，白色文字 |
| 次按钮 | outline，蓝边框 |
| Marquee | 纯 CSS animation，`translateX` 从 0 到 -50% |
| 圆角 | `rounded-xl` |

### 确认检查

```bash
npm run lint
npm run build
```

浏览器验证：
1. `/` — Hero 纯白背景，无任何动态效果
2. DevTools → 确认无 `<canvas>`、无 WebGL context、无 CSS animation 在 Hero 区域
3. DevTools → 确认背景色是 `#FFFFFF`，不是渐变

---

## Task 3.2 — 材质统一

检查以下组件，确保卡片/按钮样式对齐 MagicUI 风格（白底 + 细边框 + 圆角 + 微阴影）：

| 文件 | 检查项 |
|------|--------|
| `src/components/projects/ProjectCard.vue` | 白底 `#FFFFFF`、边框 `#e2e8f0`、圆角 `rounded-xl` |
| `src/components/home/TechStack.vue` | 卡片白底、细边框 |
| `src/components/common/Footer.vue` | 无旧 shader 残留样式 |

**只改样式，不动逻辑。** 不改 HTML 结构，不改 JS。

```bash
npm run lint
```

---

## Task 3.3 — 旧色清理

全局搜索并清理以下旧 accent 色（来自旧 shaderPalette.ts）：

```
#7B4EED  (紫色)
#F03880  (粉红)
#0052FF  (蓝色)
```

执行：

```bash
grep -rn "#7B4EED\|#F03880\|#0052FF" src/
```

如果搜索结果全部在 `shaderPalette.ts` 或 `useStripeGradient.ts` 中（这些是保留文件），不做处理。
如果有在其他文件中，替换为 `#2563EB` 或 Tailwind 类。

**注意**：不要碰 `docs/` 目录下的调研文档（它们保留了历史色板作为参考）。

```bash
npm run lint
```

---

## Task 3.4 — 删除 shaderPalette.ts

1. 先在 `src/` 目录全局搜索确认无引用：
```bash
grep -rn "shaderPalette\|shaderPalette" src/
```

2. 如果搜索结果为空（只有文件本身），删除文件：
```bash
rm src/design-system/tokens/shaderPalette.ts
```

3. 验证文件已删除：
```bash
ls src/design-system/tokens/
```

```bash
npm run lint
npm run build
```

---

## Phase 3 完成检查清单

- [ ] Hero 纯白背景，无任何动态效果
- [ ] Hero 标题、副标题、CTA 按钮样式正确
- [ ] Hero Marquee 技术栈滚动条正常运行
- [ ] ProjectCard / TechStack / Footer 卡片样式统一
- [ ] 全局无旧 accent 色残留（除保留文件外）
- [ ] `shaderPalette.ts` 已删除
- [ ] `npm run lint` 0 errors
- [ ] `npm run build` 成功

**全部通过后，回报海鸥审核。进入 Phase 4。**
