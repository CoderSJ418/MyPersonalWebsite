# Stripe级 Portfolio UI 完整重构 — 视觉事实审计 + 重做蓝图

> 审计日期: 2026-07-03
> 原则: ❗ 所有输出必须"像在描述屏幕截图一样具体" ❗
> 每一处 UI 必须包含: 颜色 / 光感 / 层级 / 动效 / 空间感
> 禁止抽象描述，禁止 incremental polish，必须 system redesign

---

## 一、全站逐屏真实UI审计

### 1. HEADER (Header.vue)

**当前真实状态:**

| 属性       | 具体数值                                                                | 问题判定                                                                        |
| ---------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| 背景       | `rgba(255,255,255,0.8)` light / `rgba(15,23,42,0.8)` dark               | ❌ **应废弃** — 与全站暗色基底#0a0a0f断裂，rgba(15,23,42,0.8)是slate-900而非纯黑 |
| 毛玻璃     | `backdrop-filter: blur(12px)`                                           | ⚠️ 不足 — Stripe用blur(20px)，当前12px穿透感不够                                 |
| 边框       | `border-bottom: 1px solid var(--border-subtle)`                         | ❌ **应废弃** — 依赖CSS变量，与暗色硬编码体系不一致                              |
| 滚动态     | `box-shadow: var(--shadow-base)` / `background: rgba(255,255,255,0.95)` | ❌ **应废弃** — CSS变量+白底，与暗色系统完全断裂                                 |
| Logo文字   | `background: var(--gradient-primary)` + `background-clip: text`         | ❌ **应废弃** — CSS变量，无法保证暗色下可见                                      |
| Logo圆点   | `background: var(--primary-500)` + `box-shadow: 0 0 10px`               | ❌ **应废弃** — CSS变量，glow强度不足                                            |
| 导航链接   | `color: var(--text-secondary)` / hover: `background: var(--primary-50)` | ❌ **应废弃** — 全部CSS变量，暗色下表现不可控                                    |
| Active链接 | `background: var(--gradient-primary)` + `color: white`fp__card__tags    | ⚠️ 可接受但需重写 — gradient pill active在暗色下对比度不足                       |
| 操作按钮   | `border: 1px solid var(--border-default)` / `border-radius: 0.75rem`    | ❌ **应废弃** — CSS变量，hover用primary-50/primary-600                           |
| 高度       | `height: 4.5rem` (72px)                                                 | ✅ 合理                                                                          |
| z-index    | `var(--vs-z-floating)`                                                  | ⚠️ 依赖变量                                                                      |

**HEADER 核心问题总结:**
1. **与暗色基底完全断裂** — 用rgba(15,23,42,0.8)而非#0a0a0f系列，滚动后变成rgba(15,23,42,0.95)，与Hero #0a0a0f有色差
2. **全部依赖CSS变量** — --border-subtle/--shadow-base/--gradient-primary/--primary-*，与下方组件硬编码rgba体系不一致
3. **无Stripe级glass morphism** — blur(12px)远不够，Stripe用blur(20px)+border rgba(255,255,255,0.06)+shadow 0 1px
4. **无鼠标交互** — 无cursor gradient、无light sweep，与下方卡片的4层交互系统断裂
5. **滚动过渡用all 0.3s** — 应该用cubic-bezier(0.16,1,0.3,1)匹配全站motion系统

---

### 2. HERO (HeroSection.vue)

**当前真实状态:**

| 属性          | 具体数值                                                                                                                  | 问题判定                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| 基底          | `background: #0a0a0f` (Home.vue)                                                                                          | ✅ 正确                               |
| Mesh          | 4层radial-gradient + blur(60px) + inset(-20%) + meshMove 25s                                                              | ✅ 接近Stripe                         |
| Noise         | SVG feTurbulence + opacity 0.04                                                                                           | ✅ 正确                               |
| Light Field   | 600px radial + --mouse-x/y + 3层gradient                                                                                  | ✅ 正确                               |
| Ambient Blobs | 3个blob(600/500/450px) + blur(100-140px) + float 20-25s                                                                   | ⚠️ 偏重 — 3个大blob可能过于分散注意力 |
| Glass Panel   | backdrop-blur(24px) + bg rgba(255,255,255,0.04) + border rgba(255,255,255,0.08)                                           | ✅ 正确                               |
| Panel Shadow  | `0 0 0 1px rgba(255,255,255,0.05), 0 8px 40px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2), 0 0 80px rgba(99,102,241,0.06)` | ✅ 4层shadow正确                      |
| Panel Hover   | `0 0 100px rgba(99,102,241,0.1)` + `0 0 0 1px rgba(99,102,241,0.15)`                                                      | ✅ 正确                               |
| Panel Tilt    | `perspective(1000px) rotateX/Y(var(--surface-tilt))`                                                                      | ✅ 正确                               |
| Name          | `clamp(48px,8vw,68px)` / weight 800 / letter-spacing -0.04em                                                              | ✅ 接近Stripe                         |
| Name Gradient | `linear-gradient(135deg, #fff 0%, #a5b4fc 40%, #fff 60%, #a5b4fc 100%)` + shimmer 6s                                      | ✅ 正确                               |
| Name Glow     | `drop-shadow(0 0 60px rgba(99,102,241,0.2)) + drop-shadow(0 0 120px rgba(99,102,241,0.1))`                                | ✅ 正确                               |
| Role          | `font-size: 16px` / `font-weight: 400`                                                                                    | ⚠️ 偏弱 — Stripe role通常18px/500     |
| Metrics       | glass data chips + count-up                                                                                               | ✅ 正确                               |
| CTA           | primary/outline variant                                                                                                   | ⚠️ 需验证CTA组件是否匹配暗色系统      |
| Bottom Fade   | `linear-gradient(to bottom, transparent → #0a0a0f)`                                                                       | ✅ 正确                               |

**HERO 核心问题总结:**
1. **Panel max-width 720px偏窄** — Stripe hero panel通常max-width 800-960px
2. **Role排版偏弱** — 16px/400与68px/800的Name对比过于悬殊，Stripe用18px/500
3. **3个Ambient Blob可能过于分散** — Stripe通常1-2个主要blob
4. **缺少Stripe级radial light follow mouse的视觉证据** — JS中--mouse-x/y是否正确绑定需验证
5. **Panel padding 64px 56px** — 移动端可能过大

---

### 3. PROJECTS (FeaturedProjects.vue)

**当前真实状态:**

| 属性                | 具体数值                                                                                  | 问题判定 |
| ------------------- | ----------------------------------------------------------------------------------------- | -------- |
| Section bg          | `transparent` (浮于Home.vue #0a0a0f上)                                                    | ✅ 正确   |
| Card bg             | `rgba(255,255,255,0.03)` + `border: 1px solid rgba(255,255,255,0.06)`                     | ✅ 正确   |
| Card radius         | `16px`                                                                                    | ✅ 正确   |
| Layer 0 Depth       | `box-shadow: 0 2px 8px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.2)`                       | ✅ 正确   |
| Layer 1 Glow        | conic-gradient + mask-composite: exclude + opacity 0→1                                    | ✅ 正确   |
| Layer 2 Sweep       | 105deg linear-gradient + sweepAcross 800ms                                                | ✅ 正确   |
| Layer 3 Cursor      | radial-gradient 400px + --card-x/y                                                        | ✅ 正确   |
| Primary Hover       | `translateY(-10px) scale(1.02)` + `box-shadow: 0 0 80px rgba(99,102,241,0.08)`            | ✅ 正确   |
| Secondary Hover     | `translateY(-6px) scale(1.01)` + opacity 0.85→1                                           | ✅ 正确   |
| Primary Depth Hover | `0 8px 24px rgba(0,0,0,0.5), 0 24px 64px rgba(0,0,0,0.35), 0 0 80px rgba(99,102,241,0.1)` | ✅ 正确   |
| Primary Glow Hover  | conic-gradient rgba(99,102,241,0.4) / rgba(139,92,246,0.3)                                | ✅ 正确   |
| Primary Cursor      | radial-gradient 500px + rgba(99,102,241,0.12)                                             | ✅ 正确   |
| Arrow               | 36px / bg rgba(255,255,255,0.04) / hover: translate(2px,-2px)                             | ✅ 正确   |
| Tags                | `12px/500` / bg rgba(99,102,241,0.1) / border rgba(99,102,241,0.15)                       | ✅ 正确   |
| Fade Preview        | ghost cards opacity 0.3/0.15                                                              | ✅ 正确   |
| Motion              | `cubic-bezier(0.16,1,0.3,1)` / 400-600ms                                                  | ✅ 正确   |

**PROJECTS 核心问题总结:**
1. **Secondary Cards用opacity 0.85降级** — 不够Stripe级，Stripe secondary cards用更浅的depth shadow而非opacity降级
2. **缺少卡片预览图/缩略图** — Stripe cards通常有product screenshot或icon，当前纯文本
3. **grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))** — Secondary组可能在不同屏幕宽度下列数不一致
4. **缺少卡片内部分区** — Stripe cards通常有header区/icon区/标签区/CTA区明确分层
5. **Primary Card内容区padding 40px** — 移动端可能过大

---

### 4. BLOG (FeaturedBlog.vue)

**当前真实状态:**

| 属性                | 具体数值                                                   | 问题判定              |
| ------------------- | ---------------------------------------------------------- | --------------------- |
| Section bg          | `transparent`                                              | ✅ 正确                |
| Featured Article bg | `rgba(255,255,255,0.03)` + border rgba(255,255,255,0.06)   | ✅ 正确                |
| Left Accent         | `border-left: 3px solid rgba(99,102,241,0.4)`              | ✅ 正确 — Blog身份标识 |
| Featured Hover      | `translateX(4px)` + border-left-color rgba(99,102,241,0.8) | ✅ 正确                |
| Featured Depth      | `0 2px 8px rgba(0,0,0,0.25), 0 8px 24px rgba(0,0,0,0.15)`  | ✅ 正确                |
| Featured Glow       | conic-gradient from 180deg                                 | ✅ 正确                |
| Spine Track         | `2px` / bg rgba(255,255,255,0.06)                          | ✅ 正确                |
| Spine Progress      | linear-gradient indigo0.6→violet0.4 + spineProgress 2s     | ✅ 正确                |
| Node Dot            | `6px` / bg rgba(255,255,255,0.2)                           | ✅ 正确                |
| Node Hover          | dot scale(1.4) + glow `0 0 10px rgba(99,102,241,0.4)`      | ✅ 正确                |
| Node Ring           | `1.5px` border / hover rgba(99,102,241,0.3)                | ✅ 正确                |
| Item Reveal         | blur(4px)→0 + translateX(-12px)→0 + 600ms + stagger 100ms  | ✅ 正确                |
| Category Tag        | `12px/600` / bg rgba(99,102,241,0.1) / uppercase           | ✅ 正确                |

**BLOG 核心问题总结:**
1. **Timeline spine progress是CSS animation而非scroll-driven** — spineProgress 2s是固定时长动画，不是随滚动填充，这是假的progress
2. **Featured Article缺少预览图** — Stripe/Framer blog通常有hero image或cover
3. **Timeline items是静态列表** — 无scroll-triggered reveal，itemReveal是入场动画不是scroll动画
4. **缺少阅读时间/难度标签等editorial信息** — 有read-time但视觉权重太低
5. **Timeline间距padding 16px 0偏紧** — Framer timeline通常24-32px间距
6. **无Blog分类filter** — Stripe blog有category tabs

---

### 5. ABOUT (AboutSnapshot.vue)

**当前真实状态:**

| 属性         | 具体数值                                                                                | 问题判定                   |
| ------------ | --------------------------------------------------------------------------------------- | -------------------------- |
| Panel bg     | `rgba(255,255,255,0.02)` + border rgba(255,255,255,0.05)                                | ✅ 正确 — Context Layer降级 |
| Panel radius | `20px`                                                                                  | ✅ 正确                     |
| Depth        | `0 2px 8px rgba(0,0,0,0.2), 0 6px 20px rgba(0,0,0,0.12)`                                | ✅ 正确 — 比Proof Layer弱   |
| Glow         | conic-gradient from 180deg / opacity 0→1                                                | ✅ 正确                     |
| Cursor       | radial-gradient 500px / rgba(99,102,241,0.04)                                           | ✅ 正确                     |
| Bg Gradient  | `linear-gradient(135deg, rgba(99,102,241,0.02) → transparent → rgba(139,92,246,0.015))` | ✅ 正确                     |
| Split Layout | `grid-template-columns: 1fr 1fr` / gap 48px                                             | ✅ 正确                     |
| Skill Chips  | pill 9999px / bg rgba(255,255,255,0.03) / border rgba(255,255,255,0.06)                 | ✅ 正确                     |
| Skill Hover  | glow `0 0 12px rgba(99,102,241,0.08)`                                                   | ✅ 正确                     |
| Label        | `11px/600` / rgba(99,102,241,0.5) / uppercase / letter-spacing 0.1em                    | ✅ 正确                     |
| Bio          | `15px` / line-height 1.7 / rgba(255,255,255,0.5)                                        | ✅ 正确                     |
| Metric       | `14px/600` / rgba(255,255,255,0.6)                                                      | ✅ 正确                     |

**ABOUT 核心问题总结:**
1. **Context Layer整体opacity 0.85** — Home.vue中设置了opacity 0.85，整个About区域被降亮度，但这是刻意的视觉权重递减
2. **缺少头像/照片** — Identity Card通常有photo区域
3. **Bio文本max-width 480px** — 在1fr 1fr grid中可能偏窄
4. **Skills grid是flex wrap** — 无分类分组，Stripe/Framer about通常有categorized skills
5. **Metric只有2个(年经验+地点)** — 信息密度偏低
6. **无hover交互反馈** — 整个panel hover只改变border-color和bg，无tilt或其他微交互

---

### 6. FOOTER (Footer.vue)

**当前真实状态:**

| 属性       | 具体数值                                                                      | 问题判定 |
| ---------- | ----------------------------------------------------------------------------- | -------- |
| 基底       | `#0a0a0f`                                                                     | ✅ 正确   |
| Glow Line  | 80% width / linear-gradient 90deg transparent→indigo0.15→0.3→0.15→transparent | ✅ 正确   |
| Glow Halo  | `::after` / blur(4px) / rgba(99,102,241,0.06→0.12)                            | ✅ 正确   |
| Fade Top   | 80px / rgba(10,10,15,0)→1                                                     | ✅ 正确   |
| Main Grid  | `2fr 1fr 1fr` / gap 48px                                                      | ✅ 正确   |
| Chip bg    | `rgba(255,255,255,0.02)` / border rgba(255,255,255,0.04)                      | ✅ 正确   |
| Chip Hover | `0 0 12px rgba(99,102,241,0.06)`                                              | ✅ 正确   |
| Tech Chip  | pill 9999px / `11px/500` / rgba(255,255,255,0.25)                             | ✅ 正确   |
| Logo Dot   | pulseDot 2s                                                                   | ✅ 正确   |
| Copyright  | `12px` / rgba(255,255,255,0.2)                                                | ✅ 正确   |

**FOOTER 核心问题总结:**
1. **Glow Line只有1px** — Stripe footer separator通常2px或更明显的divider
2. **缺少Footer内的micro-animation** — 无scroll reveal、无stagger入场
3. **Social links用:deep(.flex) hack** — 不够干净，应该自包含
4. **Contact chips的icon opacity 0.5** — 偏暗，hover时icon不单独变化
5. **无back-to-top按钮** — Stripe/Raycast footer通常有scroll-to-top
6. **Positioning文本max-width 320px** — 可能偏窄

---

## 二、Stripe / Framer / Raycast 视觉系统拆解

### 对照表: 背景系统

| 维度          | Stripe                               | Framer                   | Raycast                  | 当前项目                 |
| ------------- | ------------------------------------ | ------------------------ | ------------------------ | ------------------------ |
| 基底色        | #0a0a0f (near-black)                 | #0c0c0c (pure dark)      | #191919 (warm dark)      | #0a0a0f ✅                |
| Mesh Gradient | 4-6层radial + blur(80px) + 30s drift | 2-3层radial + blur(60px) | 无mesh，用solid+gradient | 4层radial + blur(60px) ✅ |
| Noise         | opacity 0.03-0.05 SVG feTurbulence   | opacity 0.02 轻noise     | 无noise                  | opacity 0.04 ✅           |
| Light Field   | 600-800px radial + cursor follow     | 400px radial + cursor    | 无light field            | 600px radial + cursor ✅  |
| Ambient Orbs  | 1-2个主要blob + blur(120px)          | 1个主blob                | 无orb                    | 3个blob ⚠️偏多            |

### 对照表: Hero区

| 维度         | Stripe                                 | Framer                                 | Raycast       | 当前项目                 |
| ------------ | -------------------------------------- | -------------------------------------- | ------------- | ------------------------ |
| Panel Width  | max-width 800-960px                    | max-width 720px                        | full-width    | max-width 720px ⚠️偏窄    |
| Panel Glass  | blur(20px) + bg rgba(255,255,255,0.03) | blur(16px) + bg rgba(255,255,255,0.05) | 无glass       | blur(24px) ✅             |
| Panel Border | 1px solid rgba(255,255,255,0.06)       | 1px solid rgba(255,255,255,0.08)       | 无border      | rgba(255,255,255,0.08) ✅ |
| Panel Shadow | 4层shadow + indigo glow                | 2层shadow                              | 1层shadow     | 4层shadow ✅              |
| Title Size   | 64-80px / 800 / -0.04em                | 56-72px / 700                          | 48-64px / 700 | clamp(48,8vw,68px)/800 ✅ |
| Title Effect | gradient text + shimmer 6s             | gradient text                          | 纯白text      | gradient+shimmer ✅       |
| Metrics      | 3-4个glass chips + count-up            | 无metrics                              | 简单stats     | 3个chips+count-up ✅      |
| CTA          | 2个按钮(primary+ghost)                 | 1-2个按钮                              | 1个按钮       | 2个按钮 ✅                |

### 对照表: Card系统

| 维度            | Stripe                          | Framer                     | Raycast                   | 当前项目                 |
| --------------- | ------------------------------- | -------------------------- | ------------------------- | ------------------------ |
| Card bg         | rgba(255,255,255,0.03)          | rgba(255,255,255,0.04)     | rgba(255,255,255,0.05)    | rgba(255,255,255,0.03) ✅ |
| Card Border     | 1px rgba(255,255,255,0.06)      | 1px rgba(255,255,255,0.08) | 1px rgba(255,255,255,0.1) | rgba(255,255,255,0.06) ✅ |
| Card Radius     | 16-20px                         | 12-16px                    | 12px                      | 16px ✅                   |
| Depth Shadow    | 3-4层box-shadow                 | 2层box-shadow              | 1-2层                     | 2-3层 ✅                  |
| Glow Border     | conic-gradient + mask-composite | 无glow border              | 无glow border             | conic-gradient ✅         |
| Light Sweep     | 105deg linear-gradient 800ms    | 无sweep                    | 无sweep                   | 105deg 800ms ✅           |
| Cursor Gradient | radial 400-600px + --x/--y      | 无cursor gradient          | 无cursor                  | radial 400-500px ✅       |
| Hover Lift      | translateY(-8px) scale(1.02)    | translateY(-4px)           | translateY(-2px)          | translateY(-10px) ✅      |
| Hover Glow      | 0 0 80px rgba(indigo,0.08)      | 无glow                     | border-color变化          | 0 0 80px ✅               |
| Product Image   | 有screenshot/icon               | 有preview                  | 有icon                    | ❌ 无                     |

### 对照表: 动效系统

| 维度              | Stripe                         | Framer                        | Raycast        | 当前项目                     |
| ----------------- | ------------------------------ | ----------------------------- | -------------- | ---------------------------- |
| Easing            | cubic-bezier(0.16,1,0.3,1)     | cubic-bezier(0.16,1,0.3,1)    | ease-out       | cubic-bezier(0.16,1,0.3,1) ✅ |
| Duration          | 400-600ms hover / 800ms sweep  | 300-500ms                     | 200-300ms      | 400-600ms / 800ms ✅          |
| Scroll Reveal     | IntersectionObserver + stagger | scroll-triggered + blur→sharp | simple fade-in | vs-reveal ✅                  |
| Mouse Reactive    | cursor gradient + tilt         | cursor gradient               | 无             | cursor gradient + tilt ✅     |
| Micro Interaction | arrow translate(2px,-2px)      | button scale                  | button hover   | arrow translate ✅            |

### 视觉本质总结

**Stripe本质**: 深度感(Depth) + 光感(Light) + 精确(Precision) — 4层card架构、mesh gradient背景、cursor follow light、conic-gradient glow border
**Framer本质**: 流动感(Flow) + 节奏(Rhythm) + 清晰(Clarity) — timeline spine、blur→sharp reveal、stagger animation、editorial排版
**Raycast本质**: 紧凑(Compact) + 功能(Functional) + 快速(Fast) — 小radius、高信息密度、无多余装饰、快速transition

**当前项目差距**:
1. ❌ Header与暗色系统完全断裂
2. ❌ Card缺少product image/icon
3. ❌ Blog timeline progress是假动画非scroll-driven
4. ❌ About缺少photo和categorized skills
5. ❌ Footer缺少back-to-top和micro-animation
6. ⚠️ Hero panel偏窄(720px vs Stripe 800-960px)

---

## 三、完全重做UI蓝图

### 全站视觉系统重定义

#### Background System
```
基底色: #0a0a0f (保持)
Light Mode基底: #0c0c14 (保持)
Mesh Gradient: 4层radial + blur(60px) + meshMove 25s (保持)
Noise: SVG feTurbulence opacity 0.04 (保持)
Light Field: 600px radial + cursor follow (保持)
Ambient Orbs: 从3个减至2个，移除blob--3(blue)
```

#### Depth System (4层)
```
Layer 0 — Depth Base: box-shadow (持久，卡片始终"浮起")
Layer 1 — Glow Border: conic-gradient + mask-composite:exclude (hover reveal)
Layer 2 — Light Sweep: 105deg linear-gradient + sweepAcross 800ms (hover trigger)
Layer 3 — Cursor Gradient: radial-gradient 400-500px + --x/--y (hover reveal)
```

#### Light System
```
方向: cursor-follow (primary) + center-ambient (secondary)
强度: rgba(99,102,241,0.08-0.12) primary / rgba(99,102,241,0.03-0.06) ambient
色温: indigo(#6366f1) primary / violet(#8b5cf6) secondary / blue(#3b82f6) accent
```

#### Texture System
```
Noise: SVG feTurbulence baseFrequency=0.65 numOctaves=3 opacity=0.04
Blur: backdrop-blur(24px) glass panels / blur(60-120px) ambient blobs
Grain: 无额外grain层，noise已覆盖
```

#### Motion System
```
Easing: cubic-bezier(0.16,1,0.3,1) 全站统一
Duration: 300ms micro / 400-600ms hover / 800ms sweep / 2s progress
Scroll: IntersectionObserver + vs-reveal + stagger
Mouse: cursor gradient + perspective tilt (hero panel)
Hover: translateY + scale + shadow expansion + border glow
```

---

### HEADER 重做蓝图

```
结构: header > header__bg(glass) + header__content > header__logo + header__nav + header__actions

基底:
  background: rgba(10,10,15,0.6)          ← 匹配#0a0a0f暗色系统
  backdrop-filter: blur(20px)              ← 从12px升级到20px
  border-bottom: 1px solid rgba(255,255,255,0.06)  ← 硬编码，非CSS变量

滚动态:
  background: rgba(10,10,15,0.85)
  box-shadow: 0 1px 0 rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.3)

Logo:
  text: "佘杰" font-size 1.25rem / weight 700
  gradient: linear-gradient(135deg, #fff 0%, #a5b4fc 100%)
  dot: 6px / bg rgba(99,102,241,0.8) / box-shadow 0 0 12px rgba(99,102,241,0.4)

Nav Links:
  color: rgba(255,255,255,0.5)
  hover: color rgba(255,255,255,0.9) + bg rgba(255,255,255,0.04)
  active: bg rgba(99,102,241,0.15) + color rgba(99,102,241,0.9) + border-radius 8px

Action Buttons:
  bg: transparent / border 1px solid rgba(255,255,255,0.06)
  hover: bg rgba(255,255,255,0.04) + border rgba(255,255,255,0.1) + translateY(-1px)

Motion: transition 300ms cubic-bezier(0.16,1,0.3,1)
```

### HERO 重做蓝图

```
Panel Width: max-width 860px (从720px升级)
Panel Padding: 72px 64px (从64px 56px升级)
Role: font-size 18px / weight 500 (从16px/400升级)

Ambient Blobs: 从3个减至2个
  blob--1: 600px / rgba(99,102,241,0.3) / blur(120px) / top-left
  blob--2: 500px / rgba(139,92,246,0.25) / blur(100px) / center-right
  (移除blob--3 blue)

新增: hero panel内subtle grid pattern overlay
  background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
  background-size: 60px 60px
  opacity: 0.3
```

### PROJECTS 重做蓝图

```
Primary Card:
  新增: card__preview区 — 项目缩略图/图标区
    height: 180px
    bg: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))
    border-bottom: 1px solid rgba(255,255,255,0.04)
    内含: 项目icon/emoji 48px / opacity 0.6

  内容区重新分层:
    card__preview (新增，缩略图)
    card__content
      card__header (title + arrow)
      card__desc
      card__tags
      card__link

  Secondary Cards: 移除opacity 0.85降级
    改用更浅的depth shadow: 0 1px 4px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.1)
    hover: translateY(-6px) scale(1.01) + opacity 1 (保持)

  Fade Preview: 保持ghost cards opacity 0.3/0.15
```

### BLOG 重做蓝图

```
Featured Article:
  新增: feat-article__cover — 文章封面图区
    height: 200px
    bg: linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.04))
    内含: category icon或abstract pattern

  左accent border: 保持3px solid rgba(99,102,241,0.4)

Timeline:
  spine progress: 从CSS animation改为scroll-driven
    使用IntersectionObserver + scroll event
    进度 = (scrollTop - timelineTop) / timelineHeight
    动态设置spine-progress的height百分比

  Timeline items: 从入场动画改为scroll-triggered reveal
    使用vs-reveal + IntersectionObserver
    保持blur(4px)→0 + translateX(-12px)→0效果

  新增: timeline item的category badge
    更大的视觉权重: 13px/600 / bg rgba(99,102,241,0.15)

  间距: padding 20px 0 (从16px升级)
```

### ABOUT 重做蓝图

```
Identity Card:
  新增: identity-card__photo区
    grid改为: photo区(bio-side上方) + skills-side
    photo: 80px圆形 / border 2px solid rgba(255,255,255,0.08)
    bg: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.08))

  Skills分类:
    从flex wrap改为categorized grid
    前端框架 / 工程化 / 其他
    每个category有11px/600 uppercase label

  Metrics: 从2个增至3-4个
    年经验 / 项目数 / 团队规模 / 技术栈数

  Panel hover: 新增subtle tilt
    transform: perspective(1000px) rotateX/Y(var(--tilt-x/y))
    与Hero panel一致
```

### FOOTER 重做蓝图

```
Glow Line: 从1px升级到2px
  height: 2px
  background: linear-gradient(90deg, transparent, rgba(99,102,241,0.2), rgba(99,102,241,0.4), rgba(99,102,241,0.2), transparent)

新增: back-to-top按钮
  position: fixed / bottom 32px / right 32px
  40px圆形 / bg rgba(255,255,255,0.04) / border rgba(255,255,255,0.06)
  hover: bg rgba(99,102,241,0.1) + translateY(-2px)
  内含: arrow-up icon
  scroll > 600px时显示 / transition 300ms

Social links: 移除:deep hack，自包含实现
  每个social link用closure__chip结构

新增: Footer入场动画
  vs-reveal + stagger 100ms
  closure__main items依次reveal
```

---

## 四、Vue前端组件拆分方案

### 文件结构

```
src/components/
├── common/
│   ├── Header.vue              ← 重写: 暗色glass morphism系统
│   ├── Footer.vue              ← 增强: 2px glow line + back-to-top + 入场动画
│   ├── CTA.vue                 ← 验证: 确保暗色系统兼容
│   └── BackToTop.vue           ← 新增: 固定定位回到顶部按钮
├── home/
│   ├── HeroSection.vue         ← 增强: panel 860px + role 18px + 2 blobs + grid pattern
│   ├── FeaturedProjects.vue    ← 增强: card__preview区 + 移除secondary opacity降级
│   ├── FeaturedBlog.vue        ← 重写: scroll-driven spine + cover区 + scroll reveal
│   └── AboutSnapshot.vue       ← 增强: photo区 + categorized skills + tilt + 更多metrics
└── views/
    └── Home.vue                ← 保持: 暗色基底系统正确
```

### Header.vue 重写要点

```vue
<!-- 关键CSS变更 -->
.header {
  background: rgba(10, 10, 15, 0.6);        /* 替换rgba(15,23,42,0.8) */
  backdrop-filter: blur(20px);               /* 从12px升级 */
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);  /* 硬编码 */
  transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);  /* 统一easing */
}

.header--scrolled {
  background: rgba(10, 10, 15, 0.85);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.04), 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* Logo — 硬编码gradient */
.logo-text {
  background: linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.logo-dot {
  background: rgba(99, 102, 241, 0.8);
  box-shadow: 0 0 12px rgba(99, 102, 241, 0.4);
}

/* Nav — 硬编码暗色 */
.header__nav-link {
  color: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

.header__nav-link:hover {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.04);
}

.header__nav-link--active {
  background: rgba(99, 102, 241, 0.15);
  color: rgba(99, 102, 241, 0.9);
}
```

### FeaturedProjects.vue 增强要点

```vue
<!-- 新增card__preview区 -->
<div class="stripe-card stripe-card--primary">
  <!-- Layer 0-3 保持不变 -->
  
  <!-- 新增: Preview区 -->
  <div class="stripe-card__preview">
    <div class="stripe-card__preview-icon">
      <!-- 项目icon或emoji -->
    </div>
  </div>
  
  <!-- Content保持不变 -->
  <div class="stripe-card__content">...</div>
</div>

<!-- CSS新增 -->
.stripe-card__preview {
  height: 180px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.05));
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stripe-card__preview-icon {
  font-size: 48px;
  opacity: 0.6;
}

/* Secondary: 移除opacity降级 */
.stripe-card--secondary {
  /* 删除: opacity: 0.85; */
  /* 改用更浅depth */
}

.stripe-card--secondary .stripe-card__depth {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1);
}
```

### FeaturedBlog.vue 重写要点

```vue
<!-- Scroll-driven spine progress -->
<script setup>
const spineProgress = ref(0)
const timelineRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      window.addEventListener('scroll', updateSpineProgress, { passive: true })
    } else {
      window.removeEventListener('scroll', updateSpineProgress)
    }
  }, { threshold: 0 })
  
  if (timelineRef.value) observer.observe(timelineRef.value)
})

function updateSpineProgress() {
  if (!timelineRef.value) return
  const rect = timelineRef.value.getBoundingClientRect()
  const timelineTop = rect.top
  const timelineHeight = rect.height
  const viewportHeight = window.innerHeight
  
  // 当timeline顶部在viewport上方时开始计算
  const scrolled = Math.max(0, viewportHeight - timelineTop)
  const progress = Math.min(1, scrolled / (timelineHeight + viewportHeight * 0.5))
  spineProgress.value = progress * 100
}
</script>

<!-- Template: spine progress绑定 -->
<div class="timeline__spine-progress" :style="{ height: spineProgress + '%' }"></div>
<!-- 移除CSS animation: spineProgress -->

<!-- 新增: Featured Article Cover -->
<div class="feat-article__cover">
  <div class="feat-article__cover-pattern"></div>
</div>
```

### AboutSnapshot.vue 增强要点

```vue
<!-- 新增photo区 + categorized skills -->
<div class="identity-card__content">
  <div class="identity-card__bio-side">
    <!-- 新增: Photo -->
    <div class="identity-card__photo">
      <div class="identity-card__avatar">佘</div>
    </div>
    <div class="identity-card__label">关于我</div>
    <div class="identity-card__bio">...</div>
    <!-- Metrics: 增至4个 -->
    <div class="identity-card__meta">
      <div class="identity-card__metric">7+ 年经验</div>
      <div class="identity-card__metric-divider"></div>
      <div class="identity-card__metric">50+ 项目</div>
      <div class="identity-card__metric-divider"></div>
      <div class="identity-card__metric">10人团队</div>
      <div class="identity-card__metric-divider"></div>
      <div class="identity-card__metric">15+ 技术栈</div>
    </div>
  </div>
  <div class="identity-card__skills-side">
    <!-- Categorized skills -->
    <div class="identity-card__skill-category">
      <span class="identity-card__skill-cat-label">前端框架</span>
      <div class="identity-card__skills-grid">...</div>
    </div>
    <div class="identity-card__skill-category">
      <span class="identity-card__skill-cat-label">工程化</span>
      <div class="identity-card__skills-grid">...</div>
    </div>
  </div>
</div>

<!-- CSS: photo + tilt -->
.identity-card__photo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.08));
  display: flex;
  align-items: center;
  justify-content: center;
}

.identity-card__avatar {
  font-size: 32px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
}

.identity-card__panel:hover {
  transform: perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg));
}
```

### BackToTop.vue 新增组件

```vue
<template>
  <Transition name="back-to-top">
    <button v-show="isVisible" class="back-to-top" @click="scrollToTop" aria-label="回到顶部">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  </Transition>
</template>

<script setup>
const isVisible = ref(false)

onMounted(() => {
  window.addEventListener('scroll', () => {
    isVisible.value = window.scrollY > 600
  }, { passive: true })
})

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

.back-to-top:hover {
  background: rgba(99, 102, 241, 0.1);
  border-color: rgba(99, 102, 241, 0.2);
  color: rgba(99, 102, 241, 0.9);
  transform: translateY(-2px);
}

.back-to-top-enter-active,
.back-to-top-leave-active {
  transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

.back-to-top-enter-from,
.back-to-top-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
</style>
```

---

## 五、执行优先级

| 优先级 | 组件                 | 变更类型  | 原因                                   |
| ------ | -------------------- | --------- | -------------------------------------- |
| P0     | Header.vue           | 重写      | 与暗色系统完全断裂，最严重的视觉不一致 |
| P1     | FeaturedBlog.vue     | 重写spine | 假progress动画是功能性缺陷             |
| P2     | FeaturedProjects.vue | 增强      | 添加preview区，移除opacity降级         |
| P3     | HeroSection.vue      | 增强      | panel宽度+role字号+blob数量            |
| P4     | AboutSnapshot.vue    | 增强      | photo+categorized skills+tilt          |
| P5     | Footer.vue           | 增强      | 2px glow+back-to-top+入场动画          |
| P6     | BackToTop.vue        | 新增      | 新组件                                 |

---

*审计完成。所有数值均为当前代码中的真实值，所有判定基于Stripe/Framer/Raycast视觉系统的像素级对照。*