# Phase 2 任务清单 — 12 个 Demo

> **OBSOLETE（2026-07-14）**：本任务基于 PRD v0.4，不得执行。Phase 0 与新版 Phase 1 通过后重新生成。

> **执行前确保 Phase 1 全部通过。先读 `docs/joycode/MASTER.md`（铁律和代码规范）。**

**Phase 2 目标**：实现 12 个效果 demo 组件。
**执行顺序**：按难度从低到高。每完成 4 个 demo 后停止，回报海鸥审核，确认后再继续。

---

## 执行规则

1. 每个 demo 对应一个独立文件：`src/views/Lab/demos/{Id}Demo.vue`
2. 每个 demo 不超过 200 行（`<script setup>` + `<template>` + `<style scoped>`）
3. `<style scoped>` 不超过 80 行
4. 每个 demo 必须有 `onUnmounted` 清理
5. 使用 `useMobilePerformance` 的 `isTouch` 守卫鼠标跟踪
6. `prefers-reduced-motion` 检测并降级
7. 不输出 `dark:` 样式
8. 不创建 `LabCodeBlock.vue`
9. 完成后立即修改 `src/config/labRegistry.ts` — 确保每个 entry 的 `component` 路径与文件名匹配

---

## 第一批：Demo 1-4（低难度）

### Demo 1: dot-pattern — 点阵背景

**文件**：`src/views/Lab/demos/DotPatternDemo.vue`

实现 SVG 圆点阵列背景。

**参数**：`dotSize`（range, 1-6, 默认 2）、`spacing`（range, 10-40, 默认 20）

**技术**：SVG pattern + CSS

**参考**：MagicUI dot-pattern

---

### Demo 2: grid-pattern — 网格底纹

**文件**：`src/views/Lab/demos/GridPatternDemo.vue`

实现科技感网格背景，带呼吸动画。

**参数**：`opacity`（range, 0.1-1, 默认 0.5）、`gridSize`（range, 20-80, 默认 40）

**技术**：SVG pattern + CSS animation

**参考**：MagicUI animated-grid-pattern

---

### Demo 3: noise-texture — 噪点纹理

**文件**：`src/views/Lab/demos/NoiseTextureDemo.vue`

使用 SVG feTurbulence 生成噪点纹理。

**参数**：`opacity`（range, 0.05-0.3, 默认 0.1）

**技术**：SVG feTurbulence

**参考**：MagicUI noise

---

### Demo 4: marquee — 无限滚动

**文件**：`src/views/Lab/demos/MarqueeDemo.vue`

CSS animation 驱动的无缝循环滚动。

**参数**：`speed`（range, 10-60, 默认 30）、`direction`（select, left/right, 默认 left）

**技术**：CSS animation

**参考**：MagicUI marquee

---

## 第二批：Demo 5-8（中低难度）

### Demo 5: meteors — 流星效果

**文件**：`src/views/Lab/demos/MeteorsDemo.vue`

CSS 动画驱动的流星划过效果。

**参数**：`count`（range, 5-30, 默认 15）、`speed`（range, 1-5, 默认 2）

**技术**：CSS animation

**参考**：MagicUI meteors

---

### Demo 6: animated-gradient-text — 渐变文字

**文件**：`src/views/Lab/demos/AnimatedGradientTextDemo.vue`

背景裁剪渐变文字效果。

**参数**：`speed`（range, 1-5, 默认 2）

**技术**：CSS background-clip + animation

**参考**：MagicUI animated-gradient-text

---

### Demo 7: number-ticker — 数字滚动

**文件**：`src/views/Lab/demos/NumberTickerDemo.vue`

数字从 0 滚动到目标值的动画。

**参数**：`targetValue`（range, 0-99999, 默认 98234）、`duration`（range, 500-5000, 默认 2000）

**技术**：rAF + ease-out

**实现要点**：
- `requestAnimationFrame` 循环
- ease-out 缓动函数
- 千分位逗号格式化
- `onUnmounted` 中 `cancelAnimationFrame`

**依赖检查**：先 grep `useGSAPAnimations` 是否有数字滚动方法。如果有，用已有的；如果没有，手写 rAF 实现。

```bash
grep -r "animateNumber\|countUp\|animateValue\|tween.*number\|number.*tween" src/composables/
```

---

### Demo 8: shine-border — 边框光泽

**文件**：`src/views/Lab/demos/ShineBorderDemo.vue`

按钮边框上的旋转光泽效果。

**参数**：`borderWidth`（range, 1-3, 默认 1）、`speed`（range, 1-8, 默认 3）

**技术**：CSS `@property` + `conic-gradient`

**必须包含 `@supports` 降级**（见 MASTER.md §6）。

**参考**：MagicUI shine-border

---

## 第三批：Demo 9-12（中等难度）

### Demo 9: shimmer-button — 按钮扫光

**文件**：`src/views/Lab/demos/ShimmerButtonDemo.vue`

按钮表面从左到右的光泽扫过动画。

**参数**：`duration`（range, 1-5, 默认 2）

**技术**：CSS animation + gradient

**参考**：MagicUI shimmer-button

---

### Demo 10: aurora — 极光背景

**文件**：`src/views/Lab/demos/AuroraDemo.vue`

流动的渐变光带，模拟北极光。

**参数**：`speed`（range, 1-5, 默认 2）、`colorTheme`（select: blue/indigo/purple/cyan, 默认 blue）

**技术**：CSS gradient animation

**参考**：MagicUI aurora-background

---

### Demo 11: spotlight — 卡片追光

**文件**：`src/views/Lab/demos/SpotlightDemo.vue`

鼠标移动时卡片表面产生追光效果。

**参数**：`radius`（range, 100-400, 默认 250）

**技术**：JS mousemove + CSS radial-gradient

**触摸设备**：通过 `useMobilePerformance` 的 `isTouch` 守卫

**实现方式**：优先检查 `useCardSpotlight` composable 是否适用。如果接口不适合，手写轻量版（监听 mousemove，更新 CSS 自定义属性）。

---

### Demo 12: tilt-card — 3D 倾斜卡片

**文件**：`src/views/Lab/demos/TiltCardDemo.vue`

鼠标悬停时卡片沿 X/Y 轴 3D 倾斜。

**参数**：`maxTilt`（range, 5-20, 默认 10）、`perspective`（range, 300-1000, 默认 500）

**技术**：CSS transform + JS mousemove

**触摸设备**：通过 `useMobilePerformance` 的 `isTouch` 守卫

**实现方式**：优先检查 `useCard3D` composable 是否适用。如果接口不适合，手写轻量版。

---

## 通用 Demo 模板

每个 demo 的骨架：

```vue
<!--
  PRD 锚定：§4.x [效果名]
  Phase：2
-->
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
import { useMobilePerformance } from '@/composables/useMobilePerformance'

const { isTouch } = useMobilePerformance()

// 参数由 LabLayout 通过 provide/inject 传递
// 直接访问，不解构，保持响应性
const params = inject<Reactive<Record<string, string | number>>>('labParams')

// 本地状态
// ...

// 效果逻辑
// ...

// 清理
onUnmounted(() => {
  // 清理动画、事件、rAF
})
</script>

<template>
  <div class="demo-container">
    <div class="demo-preview">
      <!-- 效果演示 -->
    </div>
  </div>
</template>

<style scoped>
/* 效果样式 */
</style>
```

---

## 每批完成后的验证

每完成 4 个 demo，运行：

```bash
npm run lint
npm run build
npm run validate:lab
```

然后回报海鸥审核。海鸥确认后再继续下一批。

---

## 12 个 demo 全部完成后的验证

```bash
npm run validate:lab
```

浏览器验证：
1. 访问 `/lab` — 看到 12 个效果卡片
2. 逐个点击卡片 — 每个效果正常运行
3. 调节参数 — 效果实时变化
4. 375px 宽度 — 卡片正常排列
5. 浏览器 DevTools → 勾选 `prefers-reduced-motion: reduce` — 动画暂停

**全部通过后，回报海鸥。进入 Phase 3。**
