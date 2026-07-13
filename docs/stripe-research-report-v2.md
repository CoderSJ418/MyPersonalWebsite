# Stripe 官网技术调研报告

> 调研日期: 2026-07-12
> 调研人: 海鸥
> 目标: 还原 Stripe 级 Hero 效果 + 了解全站技术栈

---

## 一、Hero 区域 — 核心效果

### 1.1 效果名称

Stripe 官方叫 **"Mesh Gradient"** 或 **"Lava Lamp Gradient"**（Codrops 教程标题）。
它看起来像是彩色的熔岩灯在流动——**不是 3D ribbon**。

### 1.2 视觉效果描述

| 特征 | 描述 |
|------|------|
| 背景 | 深色（接近黑色，有微妙的蓝紫色调） |
| 主体 | 大面积彩色渐变区域，像液态的彩色云团在流动 |
| 颜色 | 蓝 → 紫 → 品红 → 粉的渐变过渡 |
| 运动 | 噪声驱动的有机流动，不是正弦波 |
| 丝带感 | `pow(noise, 4.)` 让平滑噪声变成锐利的彩色条带 |
| 边缘 | 顶部有暗角（darken top）效果 |
| 交互 | 鼠标悬停可以手动"推动"噪声 |

### 1.3 技术实现

**关键发现：Stripe 用的是 Flat 2D Plane + 顶点噪声位移，不是 3D 管状体。**

#### 技术栈
- **原生 WebGL**（不用 Three.js 做 hero gradient）
- **MiniGL** — Stripe 自己封装的极简 WebGL 封装
- **Simplex 3D Noise**（Ashima Arts / Ian McEwan）
- **glsl-blend**（Jamie Owen）— 混合模式库

#### 实现原理

```
Flat PlaneGeometry (2D 平面网格)
  │
  ├── 顶点着色器:
  │   ├── tilt (前后倾斜) = resolution.y / 2.0 * uvNorm.y
  │   ├── incline (左右角度) = resolution.x * uvNorm.x / 2.0 * incline
  │   ├── noise (噪声位移) = snoise(...) * noiseAmp (320!)
  │   │   └── noise *= 1.0 - pow(abs(uvNorm.y), 2.0)  // 边缘衰减
  │   │   └── noise = max(0.0, noise)                  // 只向上凸
  │   └── 颜色计算（在顶点着色器中完成！）
  │       ├── baseColor
  │       ├── waveLayer 0: pow(smoothstep(floor, ceil, snoise), 4.) → 丝带效果
  │       ├── waveLayer 1: 同上，不同频率/速度/种子
  │       └── waveLayer 2: 同上
  │
  └── 片段着色器:
      └── 直接输出 v_color（颜色已经在顶点算好了）
      └── 可选: darken_top 暗角效果
```

#### 关键参数

| 参数 | 值 | 说明 |
|------|-----|------|
| `noiseAmp` | 320 | 噪声振幅——巨大的 Y 轴位移制造立体感 |
| `seed` | 5 | 噪声种子 |
| `freqX` | 14e-5 | X 方向噪声频率 |
| `freqY` | 29e-5 | Y 方向噪声频率 |
| `noiseSpeed` | 5e-6 | 全局噪声速度（极慢！） |
| `incline` | sin(angle)/cos(angle) | 平面倾斜角度 |
| `offsetTop/Bottom` | -0.5 | 倾斜偏移 |
| `shadow_power` | 5 (移动端) / 6 (桌面端) | 暗角指数 |
| `density` | [0.06, 0.16] | 平面网格密度 |

#### Wave Layer 默认配置

```javascript
// Layer 0 — 最慢最宽
{ noiseFreq: [2.0, 3.0], noiseSpeed: 11.3, noiseFlow: 6.8, noiseSeed: 15, noiseCeil: 0.63 }
// Layer 1 — 中等
{ noiseFreq: [2.3, 3.3], noiseSpeed: 11.6, noiseFlow: 7.1, noiseSeed: 25, noiseCeil: 0.70 }
// Layer 2 — 最快最窄
{ noiseFreq: [2.6, 3.6], noiseSpeed: 11.9, noiseFlow: 7.4, noiseSeed: 35, noiseCeil: 0.77 }
```

#### 颜色方案

从 CSS 变量读取：`--gradient-color-1` ~ `--gradient-color-4`
- 默认 Stripe 色：`#1a56db` (蓝) → `#5b5af7` (紫) → `#9333ea` (品红) → `#ec4899` (粉)
- 通过 [whatamesh.vercel.app](https://whatamesh.vercel.app/) 可生成自定义颜色

#### 为什么 `pow(noise, 4.)` 能制造丝带效果？

Simplex noise 输出 -1..1 的平滑渐变。`/ 2.0 + 0.5` 映射到 0..1 后，大部分值接近 0.5。`pow(0.5, 4) = 0.0625`——只有接近 1 的区域才有显著颜色。这创造了**尖锐的边界**，看起来像丝带/云带。

---

## 二、其他页面效果

### 2.1 Stripe Globe（地球页面）

| 特征 | 描述 |
|------|------|
| 技术 | **Three.js** + 原生 WebGL |
| 内容 | 1:4000 万比例的交互式 3D 地球 |
| 细节 | 国家边界、实时 Stripe 覆盖点（发光）、弧线连接 |
| 动画 | 页面加载时旋转 → 滚动时驱动旋转 |
| 自定义 shader | fragment shader 实现弧线动画和发光点 |
| 性能优化 | **关闭抗锯齿** (`antialias: false`) 提升性能 |
| 性能优化 | `setDrawRange` 逐步显示弧线 |
| 滚动驱动 | 使用 `requestAnimationFrame` + scroll throttle |
| 交互 | 鼠标可拖拽旋转 |

**技术栈**: Three.js + GLSL shaders + Canvas getImageData + lodash throttle

### 2.2 Connect 页面动画

| 特征 | 描述 |
|------|------|
| 动画技术 | **Web Animations API**（优先）+ requestAnimationFrame（精细控制） |
| 滚动触发 | **Intersection Observer API**（替代 scroll event） |
| 键盘动画 | Web Animations API 的 `element.animate()` |
| 缓动 | `cubic-bezier(.2, 1, .2, 1)` |
| 减少动画 | `prefers-reduced-motion` media query |
| 代码体积 | Express 动画整套约 5KB |

### 2.3 通用动画原则（来自 Stripe 官方博客）

```
优先级排序:
1. CSS @keyframes — 性能最好，声明式
2. Web Animations API — 接近 CSS 性能，JS 控制
3. requestAnimationFrame — 最灵活，但最复杂
4. SVG — 适合矢量图形动画
5. Canvas/WebGL — 适合复杂粒子/3D 效果
6. 图片序列 — 最后 resort
```

---

## 三、Stripe 全站技术栈推测

| 层级 | 技术 | 来源/理由 |
|------|------|----------|
| **框架** | React + Next.js | Stripe 是 Vercel 大客户，大量 Stripe 示例代码使用 Next.js |
| **托管** | Vercel | Stripe 和 Vercel 深度合作 |
| **Hero 渐变** | 原生 WebGL + MiniGL | whatamesh 源码、gist 验证 |
| **3D 效果** | Three.js | Stripe Globe 博客确认 |
| **滚动动画** | Intersection Observer + Web Animations API | Connect 博客确认 |
| **平滑滚动** | 可能使用自定义实现 | 没有明确提到 Lenis |
| **样式** | CSS Modules / CSS-in-JS | Stripe 使用自己的设计系统 |
| **字体** | Sohne（自定义字体） | 从 stripe.com HTML 中确认 |

---

## 四、本项目 Hero 现状分析

### 4.1 当前问题

| 问题 | 当前状态 |
|------|----------|
| `RibbonMesh.vue` | 使用 **TubeGeometry + 3D 丝带** — 完全错误的技术路线 |
| `ShaderGradient.vue` | 使用 **PlaneGeometry + FBM 噪声** — 更接近但不是 Stripe 效果 |
| `useStripeGradient.ts` | 使用 **whatamesh 库** — 在 D3D11 沙箱中静默失败（全透明黑） |
| 文字叠加 | mix-blend-mode: screen — 方向正确但背景需要匹配 |

### 4.2 正确的实现路线

**方案 A：直接用 whatamesh 库**
- 优点：100% 还原 Stripe 效果
- 缺点：MiniGL 在 D3D11 环境下可能静默失败
- 修复方向：排查 whatamesh init 失败原因（可能是 CSS 变量未就绪）

**方案 B：原生 WebGL 重写（推荐）**
- 优点：完全可控，不依赖 MiniGL 封装
- 缺点：需要实现 MiniGL 的所有功能（uniform、attribute、blend 等）
- 参考：gist jordienr/64bcf75f8b08641f205bd6a1a0d4ce1d 的完整源码

**方案 C：Three.js + ShaderMaterial**
- 优点：Three.js 处理 WebGL 样板代码
- 缺点：需要自己写 attribute setup（position, uv, uvNorm）
- 当前 `ShaderGradient.vue` 就是这条路线，但 shader 逻辑不对

### 4.3 推荐方案

**方案 B（原生 WebGL）——但需要解决几个关键问题：**

1. **attribute 名称冲突**: `uv` 和 `uvNorm` 在 WebGL 中是 attribute，不是 varying
2. **blend 函数**: Stripe 的 `blendNormal` 带 opacity 参数，需要 overload
3. **struct uniform**: whatamesh 使用 struct uniform（`u_global`, `u_vertDeform`）——原生 WebGL 需要展开
4. **`resolution` uniform**: 必须是 `vec3`（vertex shader 用了 `.x`, `.y`, `.z`）

---

## 五、参考资料

| 资源 | 链接 | 说明 |
|------|------|------|
| whatamesh 源码（gist） | https://gist.github.com/jordienr/64bcf75f8b08641f205bd6a1a0d4ce1d | Stripe 效果的完整 JS 实现 |
| whatamesh npm | https://github.com/jordienr/whatamesh | 打包版 |
| whatamesh 演示 | https://whatamesh.vercel.app/ | 在线颜色生成器 |
| Codrops 教程 | https://tympanus.net/codrops/2022/09/26/how-to-recreate-stripes-lava-lamp-gradient-with-three-js | "Lava Lamp" 实现 |
| Stripe Globe 博客 | https://stripe.com/blog/globe | Three.js + WebGL 技术细节 |
| Stripe Connect 博客 | https://stripe.com/blog/connect-front-end-experience | 动画技术选型 |
| Ashima Noise | https://github.com/ashima/webgl-noise | Simplex noise GLSL |
| glsl-blend | https://github.com/jamieowen/glsl-blend | 混合模式函数 |

---

## 六、下一步行动

1. **决定技术路线**: 方案 A (whatamesh) vs B (原生 WebGL) vs C (Three.js)
2. **修复 `useStripeGradient.ts`**: 如果选 B，基于 gist 源码重写
3. **确认颜色方案**: 使用 Stripe 默认色还是自定义
4. **文字叠加**: 确保 mix-blend-mode 在深色背景上正确工作
5. **响应式**: density 参数需要根据屏幕尺寸调整
6. **性能**: 移动端降低 density 和 shadow_power

---

*本文档基于搜索调研和源码分析，所有技术细节均来自可验证的公开来源。*
