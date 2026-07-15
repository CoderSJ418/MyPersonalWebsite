# Stripe 官网 Hero 区域深度技术调研报告

> 调研日期: 2026-07-12
> 调研人: 海鸥
> 核心来源: whatamesh gist (jordienr)、oaluna gist、Stripe 官方博客、多个技术社区分析

---

## 一、Hero 视觉效果描述

### 1.1 视觉效果特征

| 特征 | 描述 |
|------|------|
| 视觉名称 | **Mesh Gradient** / **Lava Lamp Gradient** |
| 背景色 | 深色（接近黑色，带微妙蓝紫色调） |
| 主体 | 大面积彩色渐变区域，像液态彩色云团在流动 |
| 颜色 | 蓝 → 紫 → 品红 → 粉的渐变过渡 |
| 运动 | **噪声驱动的有机流动**，不是正弦波 |
| 丝带感 | `pow(noise, 4.)` 让平滑噪声变成锐利彩色条带 |
| 边缘 | 顶部有暗角（darken top）效果 |
| 交互 | 鼠标悬停可以手动"推动"噪声 |

### 1.2 与常见误区的对比

- **不是 3D ribbon** — 没有管状体、没有 TubeGeometry、没有 3D 丝带旋转
- **不是纯 CSS 渐变** — CSS `background: linear-gradient` 无法实现有机流动
- **不是 FBM 噪声** — Fractal Brownian Motion 会产生不同纹理
- **是 Flat 2D Plane + 顶点噪声位移** — 一个 2D 平面网格，顶点着色器中用 simplex 3D noise 做 Y 轴位移，制造 3D 立体感

---

## 二、技术实现——完整源码分析

### 2.1 技术栈总览

```
原生 WebGL (不用 Three.js)
  │
  ├── MiniGL — Stripe 自己封装的极简 WebGL 封装（~250 行）
  ├── Simplex 3D Noise GLSL (Ashima Arts / Ian McEwan)
  ├── glsl-blend (Jamie Owen) — 混合模式函数库
  └── Gradient class — 初始化、动画循环、uniform 管理
```

### 2.2 MiniGL 架构（源码级别）

MiniGL 是 Stripe 自制的 WebGL 微框架，包含 6 个核心类：

```javascript
class MiniGl {
  // 封装 WebGLRenderingContext
  // 提供: setSize, setOrthographicCamera, render
  commonUniforms: {
    projectionMatrix: mat4  // 正交投影矩阵
    modelViewMatrix: mat4   // 模型视图矩阵
    resolution: vec2        // canvas 尺寸
    aspectRatio: float      // 宽高比
  }
}

class Uniform {
  // 类型化 uniform 值: mat4, vec2, float, vec3, struct, array
  // struct 支持嵌套: u_vertDeform 内嵌 incline, noiseFreq, noiseAmp 等
}

class Attribute {
  // 类型化 attribute 缓冲区: FLOAT, UNSIGNED_SHORT
  // 支持 update/attach/use 生命周期
}

class Material {
  // 编译 vertex/fragment shader
  // 自动生成 uniform 声明（处理 struct 展开、excludeFrom 排除）
  // 管理 program linking
}

class PlaneGeometry {
  // 3 个 attribute: position(vec3), uv(vec2), uvNorm(vec2)
  // 1 个 index: UNSIGNED_SHORT
  // setTopology(xSegCount, ySegCount) — 设置网格密度
  // setSize(width, height, orientation) — 设置顶点位置
}

class Mesh {
  // draw() — context.drawElements(TRIANGLES)
  // remove() — 从渲染队列移除
}
```

### 2.3 PlaneGeometry 细节（最关键的数据结构）

```javascript
// setTopology — 建立网格拓扑
setTopology(xSegCount = 1, ySegCount = 1) {
  vertexCount = (xSegCount + 1) * (ySegCount + 1)
  quadCount = xSegCount * ySegCount * 2

  // uv: 0..1 范围，用于纹理采样（本场景不用纹理，但保留）
  uv.values[i] = t / xSegCount           // x: 0→1
  uv.values[i+1] = 1 - e / ySegCount     // y: 1→0

  // uvNorm: -1..1 范围（归一化坐标）
  uvNorm.values[i] = t / xSegCount * 2 - 1     // x: -1→1
  uvNorm.values[i+1] = 1 - e / ySegCount * 2   // y: 1→-1

  // Index buffer for TRIANGLES draw call
  // 每两个三角形构成一个 quad
}

// setSize — 设置实际顶点位置
setSize(width, height, orientation = "xz") {
  const startX = width / -2, startY = height / -2
  for each vertex:
    position[xyz_index_of(orientation[0])] = x
    position[xyz_index_of(orientation[1])] = -y
}
```

**关键 insight:** `uvNorm` 是 `-1..1` 范围，这是 vertex shader 中倾斜和噪声计算的基础。

### 2.4 Vertex Shader 完整解析

这是 Stripe 效果的核心。所有颜色计算在顶点着色器中完成。

```glsl
// ── 输入 ──────────────────────────────────
attribute vec4 position;      // 平面顶点位置
attribute vec2 uv;            // UV 坐标 0..1
attribute vec2 uvNorm;        // 归一化坐标 -1..1
uniform vec2 resolution;      // canvas 尺寸
uniform float u_time;         // 累计时间

// ── 全局噪声参数 ──────────────────────────
struct Global {
  vec2 noiseFreq;    // [14e-5, 29e-5]
  float noiseSpeed;  // 5e-6
}
uniform Global u_global;

// ── 顶点形变参数 ──────────────────────────
struct VertDeform {
  float incline;       // sin(angle)/cos(angle)
  float offsetTop;     // -0.5
  float offsetBottom;  // -0.5
  vec2 noiseFreq;      // [3, 4]
  float noiseAmp;      // 320
  float noiseSpeed;    // 10
  float noiseFlow;     // 3
  float noiseSeed;     // 5
}
uniform VertDeform u_vertDeform;

// ── Wave Layers 数组 ──────────────────────
struct WaveLayer {
  vec3 color;
  vec2 noiseFreq;
  float noiseSpeed;
  float noiseFlow;
  float noiseSeed;
  float noiseFloor;   // 0.1
  float noiseCeil;    // 0.63 + 0.07 * i
}
uniform WaveLayer u_waveLayers[4];

// ── 颜色控制 ──────────────────────────────
uniform vec4 u_active_colors;  // [1,1,1,1] — 哪些颜色层激活
uniform vec3 u_baseColor;      // 基础颜色 (sectionColors[0])

// ── 输出 ──────────────────────────────────
varying vec3 v_color;          // 计算好的颜色传给 fragment shader

void main() {
  float time = u_time * u_global.noiseSpeed;

  vec2 noiseCoord = resolution * uvNorm * u_global.noiseFreq;

  // ═══ 1. 平面倾斜（制造立体感）═══

  // 前后倾斜 — 顶部更低，底部更高（透视感）
  float tilt = resolution.y / 2.0 * uvNorm.y;

  // 左右角度
  float incline = resolution.x * uvNorm.x / 2.0 * u_vertDeform.incline;

  // 倾斜补偿偏移
  float offset = resolution.x / 2.0 * u_vertDeform.incline *
    mix(u_vertDeform.offsetBottom, u_vertDeform.offsetTop, uv.y);

  // ═══ 2. 顶点噪声位移（核心立体感来源）═══

  float noise = snoise(vec3(
    noiseCoord.x * u_vertDeform.noiseFreq.x + time * u_vertDeform.noiseFlow,
    noiseCoord.y * u_vertDeform.noiseFreq.y,
    time * u_vertDeform.noiseSpeed + u_vertDeform.noiseSeed
  )) * u_vertDeform.noiseAmp;

  // 边缘衰减 — 顶部和底部噪声消失
  noise *= 1.0 - pow(abs(uvNorm.y), 2.0);

  // 只向上凸 — 不做向下凹陷
  noise = max(0.0, noise);

  // 最终顶点位置
  vec3 pos = vec3(
    position.x,
    position.y + tilt + incline + noise - offset,
    position.z
  );

  // ═══ 3. 颜色计算（在顶点着色器中！）═══

  // 基础颜色层
  if (u_active_colors[0] == 1.0) {
    v_color = u_baseColor;
  }

  // Wave Layers — 3 层噪声驱动的颜色混合
  for (int i = 0; i < u_waveLayers_length; i++) {
    if (u_active_colors[i + 1] == 1.0) {
      WaveLayers layer = u_waveLayers[i];

      // smoothstep 制造丝带边界
      float noise = smoothstep(
        layer.noiseFloor,
        layer.noiseCeil,
        snoise(vec3(
          noiseCoord.x * layer.noiseFreq.x + time * layer.noiseFlow,
          noiseCoord.y * layer.noiseFreq.y,
          time * layer.noiseSpeed + layer.noiseSeed
        )) / 2.0 + 0.5   // simplex 输出 -1..1 → 映射到 0..1
      );

      // pow(noise, 4.) 是丝带效果的关键！
      // smoothstep 后大部分值接近 0 或 1
      // pow 后只有接近 1 的区域才有显著颜色 → 锐利边界
      v_color = blendNormal(v_color, layer.color, pow(noise, 4.0));
    }
  }

  // ═══ 4. 输出 ──────────────────────────

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

**三个关键技巧的解读：**

| 技巧 | 代码 | 效果 |
|------|------|------|
| `pow(noise, 4.)` | `smoothstep(floor, ceil, snoise(...)/2+0.5)` → `pow(..., 4.)` | 平滑噪声变成锐利丝带 |
| `noise *= 1.0 - pow(abs(uvNorm.y), 2.0)` | 边缘衰减 | 顶部底部噪声消失，只保留中间 |
| `noise = max(0.0, noise)` | 只向上凸 | 只制造向上隆起，不做向下凹陷 |

### 2.5 Fragment Shader 完整解析

```glsl
varying vec3 v_color;

void main() {
  vec3 color = v_color;

  // 暗角效果 — 顶部更暗
  if (u_darken_top == 1.0) {
    vec2 st = gl_FragCoord.xy / resolution.xy;  // 0..1
    color.g -= pow(st.y + sin(-12.0) * st.x, u_shadow_power) * 0.4;
  }

  gl_FragColor = vec4(color, 1.0);
}
```

`u_shadow_power` 的值：
- **桌面端: 6**
- **移动端: 5**（当 `width < 600` 时）

`sin(-12.0)` 是一个硬编码的 ~0.536 值，制造对角线方向的暗角。

### 2.6 Wave Layer 默认配置

| Layer | noiseFreq | noiseSpeed | noiseFlow | noiseSeed | noiseFloor | noiseCeil |
|-------|-----------|------------|-----------|-----------|------------|-----------|
| 0 (最慢最宽) | [2.0, 3.0] | 11.3 | 6.8 | 15 | 0.1 | 0.63 |
| 1 (中等) | [2.3, 3.3] | 11.6 | 7.1 | 25 | 0.1 | 0.70 |
| 2 (最快最窄) | [2.6, 3.6] | 11.9 | 7.4 | 35 | 0.1 | 0.77 |

> **注意**: 这里的 noiseSpeed/noiseFlow 是相对于 `u_time` 的乘数。在动画循环中：
> `time = u_time * u_global.noiseSpeed` (即 5e-6 * u_time)
> 然后在 wave layer 中：`snoise(... * 11.3 / 2.0 + 0.5)`
> 所以实际的噪声输入随时间增长的速度是极慢的。

### 2.7 动画循环

```javascript
animate(timestamp) {
  if (!this.shouldSkipFrame(timestamp) || this.isMouseDown) {
    // 限制帧间隔最大 1/15 秒，防止标签页切回来时跳跃
    this.t += Math.min(timestamp - this.last, 1000 / 15);
    this.last = timestamp;

    // 鼠标拖拽时手动推动噪声
    if (this.isMouseDown) {
      let speed = 160;
      if (this.isMetaKey) speed = -160;
      this.t += speed;
    }

    // 更新 time uniform
    this.mesh.material.uniforms.u_time.value = this.t;

    // 渲染
    this.minigl.render();
  }

  // 继续循环
  if (this.conf.playing || this.isMouseDown) {
    requestAnimationFrame(this.animate);
  }
}
```

**全局噪声速度 `5e-6` 意味着**：如果 `u_time` 每秒增加 1（假设 60fps），噪声坐标每秒只移动 `5e-6 * 60 = 0.0003` 像素。这是极慢的流动。

### 2.8 颜色读取

从 CSS 变量读取，带轮询回退机制：

```javascript
// CSS variables (在 <style> 中定义)
--gradient-color-1: #1a56db;   // 蓝
--gradient-color-2: #5b5af7;   // 紫
--gradient-color-3: #9333ea;   // 品红
--gradient-color-4: #ec4899;   // 粉

// JS 读取逻辑
waitForCssVars() {
  // 轮询 CSS 变量（每帧检查一次，最多 200 次）
  if (canvasStyle has --gradient-color-1 containing "#") {
    this.init();  // CSS vars 就绪，开始初始化
  } else if (retries > 200) {
    // 超时：使用硬编码默认色 [红, 品红, 绿, 蓝]
    this.sectionColors = [16711680, 16711935, 65280, 255]
    this.init();
  } else {
    requestAnimationFrame(() => this.waitForCssVars())
  }
}

initGradientColors() {
  // 从 CSS 读取 hex → 转为 0xRRGGBB 整数 → normalizeColor 转为 [0..1] RGB
  this.sectionColors = ['--gradient-color-1'..'--gradient-color-4'].map(prop => {
    hex = canvasStyle.getPropertyValue(prop).trim()
    return hex ? `0x${hex.substr(1)}` : null
  })
}
```

### 2.9 混合模式函数库（glsl-blend / Jamie Owen）

从 `glsl-blend` 移植，在 vertex shader 中计算颜色时使用：

```glsl
// Normal (带 opacity) — wave layers 使用的混合模式
vec3 blendNormal(vec3 base, vec3 blend) {
  return blend;   // 直接返回 blend 色
}
vec3 blendNormal(vec3 base, vec3 blend, float opacity) {
  return blendNormal(base, blend) * opacity + base * (1.0 - opacity);
}

// Screen — 用于 mix-blend-mode: screen 的文字叠加
float blendScreen(float base, float blend) {
  return 1.0 - ((1.0 - base) * (1.0 - blend));
}
```

---

## 三、与 Three.js 方案的对比

| 维度 | whatamesh (原生 WebGL) | Three.js 方案 |
|------|----------------------|---------------|
| **几何体** | `PlaneGeometry` (MiniGL) | `THREE.PlaneGeometry` |
| **Attribute 命名** | `position`, `uv`, `uvNorm` — MiniGL 内部管理，无冲突 | `uv`/`uvNorm` 与 Three.js 内置冲突 → 需改名为 `aUv`/`aUvNorm` |
| **Shader 管理** | MiniGL 自动生成 uniform 声明 + struct 展开 | 手写 ShaderMaterial + uniform 声明 |
| **渲染循环** | `requestAnimationFrame` 手动管理 | Three.js `requestAnimationFrame` + renderer.render |
| **混合模式** | 内嵌在 vertex shader 中 | 需要额外 import glsl-blend |
| **性能** | 最轻量，无 overhead | Three.js 有 ~30KB runtime overhead |
| **可控性** | 完全可控 | Three.js 抽象层可能引入行为差异 |
| **开发速度** | 需要自己实现所有 WebGL 样板 | 快速原型，但需要 workaround |

### 3.1 Three.js 方案的可行路径

如果选择 Three.js，需要做以下修改使现有 `ShaderGradient.vue` 可用：

1. **Attribute 重命名**: `geometry.setAttribute('uvNorm', ...)` → `geometry.setAttribute('aUvNorm', ...)`，shader 中同步修改
2. **Struct uniform 展开**: Three.js ShaderMaterial 不支持 GLSL struct → 把 `u_global.noiseFreq` 拆成 `u_noiseFreqX`, `u_noiseFreqY`
3. **Blend 函数内联**: 把 `blendNormal`/`blendScreen` 的 GLSL 代码直接嵌入 shader
4. **Shader 逻辑替换**: 把 FBM/分形噪声替换为 simplex 3D noise + pow(noise, 4.) + wave layers

---

## 四、Stripe 全站技术栈（综合推断）

### 4.1 框架层

| 层级 | 技术 | 证据 |
|------|------|------|
| **框架** | React + Next.js | Stripe 是 Vercel 大客户，大量 Stripe 示例代码使用 Next.js |
| **Hero 渐变** | 原生 WebGL + MiniGL | whatamesh 源码完整验证 |
| **3D 效果** | Three.js | Stripe Globe 博客确认 |
| **动画** | Web Animations API + Intersection Observer | Stripe Connect 博客确认 |
| **字体** | Sohne（自定义字体） | 从 stripe.com HTML 中确认 |

### 4.2 Stripe Globe 页面技术细节

| 特征 | 实现 |
|------|------|
| **3D 地球** | Three.js + `SphereGeometry` |
| **弧线** | 自定义 `ShaderMaterial` — fragment shader 实现弧线动画和发光点 |
| **交互** | 鼠标拖拽旋转 |
| **滚动驱动** | `requestAnimationFrame` + scroll throttle |
| **性能优化** | `antialias: false`、`setDrawRange` 逐步显示 |
| **实时数据** | Canvas `getImageData` 读取国家像素数据 |

### 4.3 Stripe Connect 页面动画技术

| 技术 | 用途 | 证据来源 |
|------|------|----------|
| **Web Animations API** | 键盘动画、Express 卡片动画 | stripe.com/blog/connect-front-end-experience |
| **Intersection Observer** | 滚动触发动画替代 scroll event | 同上 |
| **缓动函数** | `cubic-bezier(.2, 1, .2, 1)` | 同上 |
| **减少动画** | `prefers-reduced-motion` media query | 同上 |
| **代码体积** | 整套 Express 动画约 5KB | 同上 |

### 4.4 Stripe 动画优先级原则

```
1. CSS @keyframes — 性能最好，声明式
2. Web Animations API — 接近 CSS 性能，JS 控制
3. requestAnimationFrame — 最灵活，但最复杂
4. SVG — 适合矢量图形动画
5. Canvas/WebGL — 适合复杂粒子/3D 效果
6. 图片序列 — 最后 resort
```

---

## 五、关键算法解析

### 5.1 为什么 `pow(noise, 4.)` 能制造丝带效果？

```
Simplex 3D noise 输出范围: -1..1
映射到 0..1: noise / 2.0 + 0.5

smoothstep(0.1, 0.63, mapped_noise) 将大部分值推向 0 或 1

pow(result, 4.0):
  result = 0.5  →  pow(0.5, 4) = 0.0625  → 几乎无色
  result = 0.8  →  pow(0.8, 4) = 0.4096  → 弱色
  result = 0.95 →  pow(0.95, 4) = 0.8145  → 强色
  result = 0.99 →  pow(0.99, 4) = 0.9606  → 极强色

→ 只有噪声值接近 1 的区域才有显著颜色 → 尖锐的彩色条带边界
```

### 5.2 为什么噪声振幅是 320？

```javascript
// noise = snoise(...) * 320
// snoise 输出 ~ -1..1
// 所以噪声位移范围: ~ -320 .. +320 像素
// 但 noise *= 1.0 - pow(abs(uvNorm.y), 2.0) 会衰减
// noise = max(0.0, noise) 只保留正值

// 对于 canvas 高度 1080px:
// 中间区域(uvNorm.y ≈ 0): 噪声衰减 ≈ 1.0 → 位移范围 0..320px
// 顶部(uvNorm.y ≈ 1.0): 噪声衰减 = 1.0 - pow(1.0, 2) = 0 → 无位移
// 40% 处(uvNorm.y ≈ 0.6): 噪声衰减 = 1.0 - pow(0.6, 2) = 0.64 → 位移范围 0..204px
```

320 像素的振幅在 1080p 屏幕上占据了约 30% 的高度——这正是 Stripe 渐变"隆起"的体积感来源。

### 5.3 3 层 Wave Layer 的叠加逻辑

```
初始颜色 = baseColor (u_baseColor, 通常是背景色)

Layer 0 叠加:
  color = blendNormal(baseColor, layer0.color, pow(noise0, 4.0))
  → 颜色从 baseColor 渐变到 layer0.color

Layer 1 叠加:
  color = blendNormal(layer0_result, layer1.color, pow(noise1, 4.0))
  → 在 layer0 基础上进一步混合

Layer 2 叠加:
  color = blendNormal(layer1_result, layer2.color, pow(noise2, 4.0))
  → 在 layer1 基础上再混合
```

每层使用不同的噪声种子和频率，所以它们的丝带不会重叠——而是相互交错，创造出丰富的有机流动感。

---

## 六、本项目实现路线

### 6.1 推荐方案：基于现有代码的增量修改

**现状分析：**
- `src/composables/useStripeGradient.ts` 已包含完整的原生 WebGL 实现（~550 行），可以直接使用
- `src/components/home/HeroSection.vue` 已配置暗色背景和 canvas 叠加
- 需要的是参数调优和可能的 bug 修复

**如果用户坚持用 Three.js 路线（基于 RibbonMesh.vue）：**
需要做的修改：
1. Shader 中的噪声函数从 FBM 替换为 simplex 3D noise
2. 加入 `pow(noise, 4.)` 丝带效果
3. 加入 3 层 wave layers
4. 加入 blendNormal 混合
5. 加入 darken_top 暗角
6. 修改 attribute 命名避免与 Three.js 内置冲突

**推荐：使用已完成的原生 WebGL 方案** (`useStripeGradient.ts`)，因为它：
1. 1:1 还原了 whatamesh 的 shader 逻辑
2. 不依赖 Three.js overhead
3. 不涉及 attribute 命名冲突
4. 包含完整的 error handling
5. 支持响应式 resize

### 6.2 默认颜色方案

```javascript
// 当前配置（来自 HeroSection.vue）
colors: ['#0a0a14', '#0a0a14', '#1a56db', '#5b5af7']

// Stripe 默认色
--gradient-color-1: #1a56db   // 蓝 — 同时作为 baseColor
--gradient-color-2: #5b5af7   // 紫
--gradient-color-3: #9333ea   // 品红
--gradient-color-4: #ec4899   // 粉
```

注意：`sectionColors[0]` 既是 baseColor 又是第一层颜色。所以传入 4 个颜色时：
- `u_baseColor` = colors[0] (蓝)
- WaveLayer 0 = colors[1] (紫)
- WaveLayer 1 = colors[2] (品红)
- WaveLayer 2 = colors[3] (粉)

### 6.3 核心参数

```javascript
const CONFIG = {
  density: [0.06, 0.16],      // 网格密度 [x, y]
  noiseAmp: 320,               // 噪声振幅
  noiseSeed: 5,                // 噪声种子
  freqX: 14e-5,                // X 方向噪声频率
  freqY: 29e-5,                // Y 方向噪声频率
  noiseSpeed: 5e-6,            // 全局噪声速度
  incline: 0,                  // 平面倾斜角度 (sin/cos)
  shadow_power: 6,             // 暗角指数 (桌面端)
  darken_top: true,            // 是否启用顶部暗角
}
```

---

## 七、参考资料

| 资源 | 链接 | 说明 |
|------|------|------|
| whatamesh 源码（主 gist） | https://gist.github.com/jordienr/64bcf75f8b08641f205bd6a1a0d4ce1d | Stripe 效果的完整 JS 实现，521 行 |
| whatamesh npm | https://github.com/jordienr/whatamesh | 打包版 npm 包 |
| whatamesh 在线生成器 | https://whatamesh.vercel.app/ | 自定义颜色生成器 |
| 替代 Gist | https://gist.github.com/oaluna/3cc459a57259583464ee305f6153ba46 | 更简洁的版本 |
| Codrops 教程 | https://tympanus.net/codrops/2022/09/26/how-to-recreate-stripes-lava-lamp-gradient-with-three-js | Three.js 版本的 "Lava Lamp" 教程 |
| Stripe Globe 博客 | https://stripe.com/blog/globe | Three.js + WebGL 技术细节 |
| Stripe Connect 博客 | https://stripe.com/blog/connect-front-end-experience | 动画技术选型（Web Animations API 等） |
| Simplex Noise GLSL | https://github.com/ashima/webgl-noise | Ashima Arts 的 GLSL 噪声函数 |
| glsl-blend | https://github.com/jamieowen/glsl-blend | Jamie Owen 的混合模式函数库 |
| YouTube 教程 | https://www.youtube.com/watch?v=XrrjvmTn_4A | Stripe-inspired mesh gradient 视频教程 |
| YouTube 教程 2 | https://www.youtube.com/watch?v=5hkz7rIX8sA | 复现 Stripe hero 渐变和文字混合效果 |

---

*本文档基于对 whatamesh 完整源码的逐行分析、多个社区实现方案的交叉验证、Stripe 官方博客的技术公开信息。所有技术细节均来自可验证的公开来源。*
