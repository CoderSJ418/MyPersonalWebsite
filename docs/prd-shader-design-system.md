# PRD — Shader-Driven Design System

> 版本：v0.1 | 状态：待评审 | 作者：海鸥

---

## 1. 需求概述

### 1.1 背景

当前 Hero 区域使用 whatamesh 库生成 Stripe 风格的 WebGL 渐变，但存在以下问题：
- 丝带效果不明显，呈现为模糊的色块（blob）
- 无法自定义 fragment shader，颜色计算在顶点着色器中完成
- 组件样式与 shader 背景无视觉关联，风格割裂

### 1.2 目标

1. **丝带成形**：实现窄的、独立的丝带（ribbon），有清晰的边界和白色间隙
2. **风格统一**：shader 输出的颜色 = 组件使用的颜色，所有元素使用同一个色板
3. **左侧白底**：canvas 左侧 ~50% 为纯白背景，丝带从右侧延伸
4. **工程可行**：在现有 Vue 3 + TypeScript + Tailwind 项目中落地

### 1.3 非目标

- 不引入新的 3D 库（Three.js 等）
- 不改变项目现有架构（Vue 3 + Pinia + GSAP + Tailwind）
- 不替换现有组件，只在设计系统层面统一

---

## 2. 技术选型

### 2.1 候选方案对比

| 方案 | 丝带效果 | 风格统一 | 工程成本 | 许可 | 结论 |
|------|---------|---------|---------|------|------|
| whatamesh（当前） | 不达标（blob） | 无 | 低 | MIT | 放弃 |
| @firecms/neat | 有 ribbon shape | 仅背景 | 中 | MIT+CC | 排除 |
| v1mal shaders | 有丝带着色器 | 仅背景 | 中 | MIT | 素材来源 |
| 自定义 raw WebGL | 完全控制 | 完全控制 | 高 | — | **选定** |

### 2.2 选定方案：自定义 Raw WebGL

**核心理由：**
1. 只有自定义 fragment shader 才能实现真正的 per-pixel 丝带效果
2. 只有完全控制 shader 和组件，才能做到颜色统一
3. 项目已有 WebGL 基础（whatamesh 的经验可复用）
4. 不引入任何新依赖

**技术路径：**
- 全屏四边形（fullscreen quad）+ 自定义 vertex/fragment shader
- Fragment shader 中实现 simplex 3D noise + smoothstep + pow(4) 锐化
- 3 个 wave layer 叠加产生丝带
- CSS mask-image 裁剪左侧白底

---

## 3. 设计系统

### 3.1 共享色板（Shader Palette）

```
丝带主色：
  紫色  #7B4EED  — Layer 0（宽丝带）
  粉红  #F03880  — Layer 1（中丝带）
  蓝色  #0052FF  — Layer 2（细丝带）

组件 accent：
  主色  #7B4EED  （紫色，与 shader Layer 0 统一）
  辅色  #F03880  （粉红，与 shader Layer 1 统一）
  第三  #0052FF  （蓝色，与 shader Layer 2 统一）

玻璃拟态：
  背景  rgba(255,255,255,0.06)
  边框  rgba(255,255,255,0.12)
  悬浮  rgba(255,255,255,0.12)
  模糊  blur(16px)
```

### 3.2 设计原则

1. **Shader 是唯一的视觉来源** — shader 用什么色，组件就用什么色
2. **一个 accent 色** — 紫色 #7B4EED 作为唯一 accent，不用蓝色也不再用 indigo
3. **玻璃拟态统一** — 半透明背景 + 细边框 + 微模糊 = 所有卡片的默认材质
4. **字体层级** — Hero 名：96px/700/-0.04em；副标题：22px/500；描述：17px/400

### 3.3 视觉层次

```
Layer 0: WebGL shader 背景（丝带）
Layer 1: CSS mask 裁剪（左侧白底）
Layer 2: Hero 文字内容
Layer 3: 页面其他组件（卡片、按钮等）
```

---

## 4. 实现计划

### Phase 1：设计 Token 层

| 任务 | 文件 | 说明 |
|------|------|------|
| 4.1 创建 shaderPalette.ts | `src/design-system/tokens/shaderPalette.ts` | 共享色板、ribbonLayers 配置、noiseScale、glass 材质 |
| 4.2 更新 unified-system.css | `src/assets/styles/unified-system.css` | 将 accent 从 #2563EB（blue-600）改为 #7B4EED（紫色） |
| 4.3 更新 main.css 色板 | `src/assets/styles/main.css` | Stripe CSS vars 改用新色板 |

### Phase 2：Shader 层

| 任务 | 文件 | 说明 |
|------|------|------|
| 4.4 重写 useStripeGradient | `src/composables/useStripeGradient.ts` | 完全自定义 raw WebGL，不用 whatamesh |
| 4.5 Vertex shader | 内嵌在 composable 中 | 全屏四边形，传递 vUv |
| 4.6 Fragment shader | 内嵌在 composable 中 | simplex 3D noise + 3 wave layers + pow(4) 锐化 |
| 4.7 丝带参数 | 从 shaderPalette.ts 导入 | ribbonLayers 配置驱动 shader uniforms |
| 4.8 CSS mask | HeroSection.vue | `mask-image: linear-gradient(to right, transparent 0%, transparent 42%, #000 58%)` |
| 4.9 白底背景 | HeroSection.vue | `.hero` background: #FFFFFF |

### Phase 3：组件层

| 任务 | 文件 | 说明 |
|------|------|------|
| 4.10 创建 GlassCard | `src/components/ui/GlassCard.vue` | 半透明毛玻璃卡片，从 uiPalette.glass 取色 |
| 4.11 创建 GradientBadge | `src/components/ui/GradientBadge.vue` | 渐变标签，使用 accent gradient |
| 4.12 创建 GradientInput | `src/components/ui/GradientInput.vue` | 渐变边框输入框 |
| 4.13 更新 CTA.vue | `src/components/ui/CTA.vue` | accent 色从 blue 改为 purple |
| 4.14 更新 HeroSection.vue | `src/components/home/HeroSection.vue` | 集成新 shader + 可能的 GlassCard 示例 |

### Phase 4：页面层

| 任务 | 文件 | 说明 |
|------|------|------|
| 4.15 更新 FeaturedProjects | `src/components/home/FeaturedProjects.vue` | 卡片使用 glass 材质 + 紫色 accent |
| 4.16 更新 TechStack | `src/components/home/TechStack.vue` | 图标背景、底部 bar 用紫色系 |
| 4.17 全局 accent 扫描 | 所有组件 | 搜索硬编码的 #2563EB / blue-600，替换为紫色 |

---

## 5. Fragment Shader 规格

```glsl
precision highp float;

varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_time;

// simplex 3D noise（Ashima Arts 实现）
// [完整 snoise 函数]

// 丝带锐化函数
float ribbon(float noiseVal, float lo, float hi) {
  return pow(smoothstep(lo, hi, noiseVal), 4.0);
}

void main() {
  vec2 uv = vUv;
  float t = u_time;

  // 噪声坐标：resolution * uv * noiseScale
  vec2 baseCoord = u_resolution * uv * vec2(0.00014, 0.00029);

  // 基底色 = 白色
  vec3 color = vec3(1.0, 1.0, 1.0);

  // Layer 0 — 紫色宽丝带
  float n0 = snoise(vec3(baseCoord.x * 3.0 + t * 4.0, baseCoord.y * 4.0, t * 6.0 + 7.0));
  color = mix(color, vec3(0.48, 0.30, 0.93), ribbon(n0, 0.42, 0.50));

  // Layer 1 — 粉红中丝带
  float n1 = snoise(vec3(baseCoord.x * 4.0 + t * 4.5, baseCoord.y * 5.0, t * 6.5 + 17.0));
  color = mix(color, vec3(0.94, 0.22, 0.50), ribbon(n1, 0.52, 0.60));

  // Layer 2 — 蓝色细丝带
  float n2 = snoise(vec3(baseCoord.x * 5.0 + t * 5.0, baseCoord.y * 6.0, t * 7.0 + 27.0));
  color = mix(color, vec3(0.00, 0.32, 1.00), ribbon(n2, 0.62, 0.70));

  gl_FragColor = vec4(color, 1.0);
}
```

**关键参数：**
- `noiseScale` = (0.00014, 0.00029) — 控制丝带宽度
- `ribbon(noise, floor, ceil)` — smoothstep 范围决定丝带宽度，pow(4) 决定边缘锐度
- `noiseFreq` = (3~5, 4~6) — 每层递增，产生大小交错的丝带
- `noiseSpeed` = (6.0, 6.5, 7.0) — 各层速度略有差异，产生视差流动
- CSS mask: `linear-gradient(to right, transparent 0%, transparent 42%, #000 58%)` — 左侧 42% 透明（白底），右侧显示丝带

---

## 6. 风险评估

| 风险 | 概率 | 影响 | 缓解 |
|------|------|------|------|
| Raw WebGL 在部分浏览器不兼容 | 低 | 中 | WebGL 1.0 支持率 >97% |
| Fragment shader 性能（per-pixel noise） | 中 | 低 | 降低噪声迭代次数，移动端降级 |
| 与现有 whatamesh 代码冲突 | 中 | 低 | 完全替换，不留残留 |
| accent 色变更影响其他页面 | 中 | 中 | 全局搜索替换，逐页检查 |
| 丝带方向/宽度需要调参 | 高 | 低 | 参数集中在 shaderPalette.ts，调参只需改一个文件 |

---

## 7. 验收标准

### 7.1 Shader 验收

- [ ] 左侧 42% 为纯白背景（#FFFFFF）
- [ ] 右侧可见 3 层独立丝带，层间有白色间隙
- 丝带方向：从左上到右下倾斜
- [ ] 丝带动画流畅（60fps）
- [ ] 丝带颜色：紫 #7B4EED、粉 #F03880、蓝 #0052FF
- [ ] 非丝带区域为纯白，无灰色/暗色残留

### 7.2 风格统一验收

- [ ] 所有组件 accent 色为 #7B4EED（紫色）
- [ ] 卡片使用半透明玻璃材质（rgba(255,255,255,0.06) + border + blur）
- [ ] 按钮、标签、输入框的渐变/边框颜色来自 shaderPalette
- [ ] 深色模式下文字在 shader 丝带上清晰可读
- [ ] 全站无硬编码的旧 accent 色（#2563EB / blue-600）

### 7.3 工程质量验收

- [ ] `npm run lint` 通过
- [ ] `npm run build` 通过
- [ ] `npm run test` 通过
- [ ] 移动端（375px）丝带效果正常
- [ ] `prefers-reduced-motion` 下 shader 暂停

---

## 8. 执行顺序

```
Phase 1（Token） → Phase 2（Shader） → Phase 3（组件） → Phase 4（页面）
```

每 Phase 完成后评审一次，确认后再进入下一 Phase。

---

## 9. 待决策项

1. **丝带方向**：左上→右下（当前方案）还是 右上→左下？
2. **丝带宽度**：当前的 noiseScale 参数需要实际渲染确认，可能需要调参
3. **是否保留 whatamesh 代码**：完全删除还是保留作为 fallback？
4. **组件风格**：全部玻璃拟态（dark glass）还是部分 solid 卡片？
