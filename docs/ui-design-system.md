# UI 设计系统规范

**项目名称**：MyPersonalWebsite
**版本**：v2.0
**创建日期**：2026年1月22日
**状态**：已发布

---

## 📋 目录

1. [设计原则](#设计原则)
2. [调色板系统](#调色板系统)
3. [字体系统](#字体系统)
4. [间距系统](#间距系统)
5. [圆角系统](#圆角系统)
6. [阴影系统](#阴影系统)
7. [动画系统](#动画系统)
8. [组件设计规范](#组件设计规范)
9. [布局规范](#布局规范)
10. [响应式设计](#响应式设计)
11. [暗黑模式](#暗黑模式)
12. [可访问性](#可访问性)
13. [主题系统](#主题系统)

---

## 设计原则

### 核心设计哲学

**极简主义 + 专业性**
- 清晰高效的信息传达
- 统一的视觉语言
- 克制的动画效果
- 优秀的可读性

**设计原则**
1. **清晰优先**：信息层级清晰，用户一眼就能找到重点
2. **一致性**：所有组件遵循统一的设计规范
3. **可访问性**：支持键盘导航和屏幕阅读器
4. **性能优先**：流畅的交互体验，快速加载
5. **响应式**：适配所有设备尺寸

### 参考案例

- **Linear**：极简主义设计，清晰的视觉层次
- **Vercel**：专业的技术风格，克制的动画
- **Stripe**：优雅的交互设计，流畅的过渡

---

## 调色板系统

### 配色方案

本设计系统采用 **Indigo-Violet** 品牌色系，基于色彩理论构建和谐的配色方案。

#### 品牌色系（Indigo-Violet）

| Token | 颜色值 | 用途 |
|-------|--------|------|
| `--brand-50` | `#EEF2FF` | 极淡背景，装饰 |
| `--brand-100` | `#E0E7FF` | 淡背景，次级装饰 |
| `--brand-200` | `#C7D2FE` | 柔和背景，按钮悬停 |
| `--brand-300` | `#A5B4FC` | 中等背景，激活状态 |
| `--brand-400` | `#818CF8` | 较强背景，强调元素 |
| `--brand-500` | `#6366F1` | **主色**，主要按钮、链接 |
| `--brand-600` | `#4F46E5` | 深主色，按钮按下 |
| `--brand-700` | `#4338CA` | 更深主色，强调文本 |
| `--brand-800` | `#3730A3` | 深色背景，强调区域 |
| `--brand-900` | `#312E81` | 极深背景，强调区域 |

#### 中性色系（Gray）

| Token | 颜色值 | 用途 |
|-------|--------|------|
| `--gray-50` | `#F9FAFB` | 极淡背景，页面背景 |
| `--gray-100` | `#F3F4F6` | 淡背景，卡片背景 |
| `--gray-200` | `#E5E7EB` | 边框，分割线 |
| `--gray-300` | `#D1D5DB` | 禁用状态 |
| `--gray-400` | `#9CA3AF` | 占位符，次级文本 |
| `--gray-500` | `#6B7280` | 次级文本，图标 |
| `--gray-600` | `#4B5563` | 正文文本 |
| `--gray-700` | `#374151` | 主要文本 |
| `--gray-800` | `#1F2937` | 深色文本 |
| `--gray-900` | `#111827` | 极深文本，标题 |

#### 语义色系

| Token | 颜色值 | 用途 |
|-------|--------|------|
| `--success-500` | `#22C55E` | 成功状态，成功提示 |
| `--warning-500` | `#F59E0B` | 警告状态，警告提示 |
| `--error-500` | `#EF4444` | 错误状态，错误提示 |
| `--info-500` | `#3B82F6` | 信息状态，信息提示 |

### 透明度系统

使用 `rgba()` 而不是 `opacity`，避免影响子元素。

| Token | 值 | 用途 |
|-------|-----|------|
| `--opacity-subtle` | `0.04` | 极淡，背景装饰 |
| `--opacity-weak` | `0.08` | 柔和，次要元素 |
| `--opacity-medium` | `0.12` | 中等，卡片背景 |
| `--opacity-strong` | `0.16` | 强，悬停状态 |
| `--opacity-heavy` | `0.24` | 沉重，强调状态 |

### 配色使用指南

#### 主色使用
- **主要按钮**：`--brand-500`
- **主要链接**：`--brand-500`
- **强调元素**：`--brand-500`

#### 悬停状态
- **按钮悬停**：`--brand-600`
- **链接悬停**：`--brand-600`

#### 禁用状态
- **禁用按钮**：`--gray-300`
- **禁用文本**：`--gray-400`

#### 背景使用
- **页面背景**：`--gray-50`（亮色模式）/ `--gray-900`（暗黑模式）
- **卡片背景**：`--gray-100`（亮色模式）/ `--gray-800`（暗黑模式）
- **输入框背景**：`--gray-50`（亮色模式）/ `--gray-900`（暗黑模式）

#### 文本使用
- **主要文本**：`--gray-900`（亮色模式）/ `--gray-100`（暗黑模式）
- **次级文本**：`--gray-600`（亮色模式）/ `--gray-400`（暗黑模式）
- **占位符**：`--gray-400`（亮色模式）/ `--gray-500`（暗黑模式）

### 颜色对比度要求

遵循 WCAG 2.1 AA 标准：
- **正文文本**：至少 4.5:1 对比度
- **大文本**：至少 3:1 对比度
- **图标**：至少 3:1 对比度

---

## 字体系统

### 字体家族

#### 标题字体（Heading）
- **字体**：Inter
- **字重**：600（Semi-Bold）
- **用途**：页面标题、章节标题

#### 正文字体（Body）
- **字体**：Inter
- **字重**：400（Regular）
- **用途**：正文文本、描述文本

#### 代码字体（Code）
- **字体**：JetBrains Mono
- **字重**：400（Regular）
- **用途**：代码块、技术术语

### 字体大小

| Token | 值 | 用途 |
|-------|-----|------|
| `--font-size-xs` | `0.75rem` (12px) | 说明文字、标签 |
| `--font-size-sm` | `0.875rem` (14px) | 小正文、辅助文本 |
| `--font-size-base` | `1rem` (16px) | 正文文本 |
| `--font-size-lg` | `1.125rem` (18px) | 大正文、重要文本 |
| `--font-size-xl` | `1.25rem` (20px) | 小标题、卡片标题 |
| `--font-size-2xl` | `1.5rem` (24px) | 中标题、章节标题 |
| `--font-size-3xl` | `1.875rem` (30px) | 大标题、页面标题 |
| `--font-size-4xl` | `2.25rem` (36px) | 超大标题、Hero 标题 |
| `--font-size-5xl` | `3rem` (48px) | 英雄标题、主标题 |

### 字重

| Token | 值 | 用途 |
|-------|-----|------|
| `--font-weight-normal` | `400` | 正文文本 |
| `--font-weight-medium` | `500` | 次级标题 |
| `--font-weight-semibold` | `600` | 主要标题 |
| `--font-weight-bold` | `700` | 强调文本 |

### 行高

| Token | 值 | 用途 |
|-------|-----|------|
| `--line-height-tight` | `1.25` | 标题、短文本 |
| `--line-height-normal` | `1.5` | 正文文本 |
| `--line-height-relaxed` | `1.75` | 长文本、阅读文本 |

### 字体使用指南

#### 标题层级
- **H1**：`--font-size-4xl` / `--font-weight-semibold` / `--line-height-tight`
- **H2**：`--font-size-3xl` / `--font-weight-semibold` / `--line-height-tight`
- **H3**：`--font-size-2xl` / `--font-weight-semibold` / `--line-height-tight`
- **H4**：`--font-size-xl` / `--font-weight-medium` / `--line-height-normal`
- **H5**：`--font-size-lg` / `--font-weight-medium` / `--line-height-normal`
- **H6**：`--font-size-base` / `--font-weight-normal` / `--line-height-normal`

#### 文本使用
- **正文**：`--font-size-base` / `--font-weight-normal` / `--line-height-normal`
- **辅助文本**：`--font-size-sm` / `--font-weight-normal` / `--line-height-normal`
- **说明文字**：`--font-size-xs` / `--font-weight-normal` / `--line-height-normal`

#### 代码使用
- **代码块**：`--font-size-sm` / `font-family: JetBrains Mono`
- **行内代码**：`--font-size-sm` / `font-family: JetBrains Mono`

---

## 间距系统

### 8px 网格系统

所有间距基于 8px 网格，确保一致的视觉节奏。

| Token | 值 | 用途 |
|-------|-----|------|
| `--space-1` | `8px` | 极小间距，图标间距 |
| `--space-2` | `16px` | 小间距，元素间距 |
| `--space-3` | `24px` | 中间距，卡片间距 |
| `--space-4` | `32px` | 大间距，区块间距 |
| `--space-5` | `40px` | 较大间距，区块间距 |
| `--space-6` | `48px` | 更大间距，区块间距 |
| `--space-7` | `56px` | 很大间距，区块间距 |
| `--space-8` | `64px` | 极大间距，区块间距 |
| `--space-9` | `72px` | 超大间距，区块间距 |
| `--space-10` | `80px` | 超超大间距，区块间距 |
| `--space-11` | `96px` | 极端间距，区块间距 |
| `--space-12` | `112px` | 极端超大间距，区块间距 |

### 间距使用指南

#### 组件内间距
- **按钮内边距**：`--space-2`（垂直）/ `--space-3`（水平）
- **输入框内边距**：`--space-2`（垂直）/ `--space-2`（水平）
- **卡片内边距**：`--space-4`

#### 组件间距
- **按钮间距**：`--space-2`
- **表单元素间距**：`--space-3`
- **卡片间距**：`--space-4`

#### 区块间距
- **区块间距**：`--space-6` ~ `--space-8`
- **章节间距**：`--space-8` ~ `--space-10`
- **页面间距**：`--space-10` ~ `--space-12`

---

## 圆角系统

### 圆角规范

| Token | 值 | 用途 |
|-------|-----|------|
| `--radius-none` | `0px` | 无圆角，严格边框 |
| `--radius-sm` | `8px` | 小圆角，按钮、标签 |
| `--radius-md` | `12px` | 中圆角，卡片、输入框 |
| `--radius-lg` | `16px` | 大圆角，模态框 |
| `--radius-xl` | `20px` | 较大圆角，特殊卡片 |
| `--radius-2xl` | `24px` | 更大圆角，特殊元素 |
| `--radius-full` | `9999px` | 完全圆角，徽章、头像 |

### 圆角使用指南

#### 按钮
- **主按钮**：`--radius-sm`
- **次按钮**：`--radius-sm`
- **图标按钮**：`--radius-sm`

#### 输入框
- **文本输入**：`--radius-md`
- **选择框**：`--radius-md`

#### 卡片
- **项目卡片**：`--radius-md`
- **博客卡片**：`--radius-md`
- **技能卡片**：`--radius-md`

#### 其他
- **头像**：`--radius-full`
- **徽章**：`--radius-sm`
- **标签**：`--radius-sm`

---

## 阴影系统

### 阴影规范

单层阴影，清晰简洁，避免过度使用。

| Token | 值 | 用途 |
|-------|-----|------|
| `--shadow-xs` | `0 1px 2px rgba(0, 0, 0, 0.05)` | 极小阴影，细微提升 |
| `--shadow-sm` | `0 1px 3px rgba(0, 0, 0, 0.1)` | 小阴影，轻微提升 |
| `--shadow-md` | `0 4px 6px rgba(0, 0, 0, 0.1)` | 中阴影，卡片提升 |
| `--shadow-lg` | `0 10px 15px rgba(0, 0, 0, 0.1)` | 大阴影，强调提升 |
| `--shadow-xl` | `0 20px 25px rgba(0, 0, 0, 0.1)` | 更大阴影，模态框 |
| `--shadow-2xl` | `0 25px 50px rgba(0, 0, 0, 0.15)` | 极大阴影，强调元素 |

### 阴影使用指南

#### 按钮
- **默认状态**：无阴影
- **悬停状态**：`--shadow-sm`
- **按下状态**：无阴影

#### 卡片
- **默认状态**：`--shadow-sm`
- **悬停状态**：`--shadow-md`

#### 模态框
- **默认状态**：`--shadow-xl`

#### 导航栏
- **固定导航**：`--shadow-sm`

---

## 动画系统

### 动画时长

| Token | 值 | 用途 |
|-------|-----|------|
| `--duration-fast` | `150ms` | 快速动画，按钮悬停 |
| `--duration-normal` | `300ms` | 正常动画，过渡效果 |
| `--duration-slow` | `500ms` | 慢速动画，页面切换 |
| `--duration-slower` | `800ms` | 更慢动画，复杂动画 |

### 缓动函数

| Token | 值 | 用途 |
|-------|-----|------|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | 快速开始，缓慢结束 |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | 缓慢开始，缓慢结束 |

### 动画使用指南

#### 按钮动画
- **悬停**：`--duration-fast` / `--ease-out`
- **按下**：`--duration-fast` / `--ease-out`

#### 卡片动画
- **悬停**：`--duration-normal` / `--ease-out`
- **进入**：`--duration-slow` / `--ease-out`

#### 页面过渡
- **淡入**：`--duration-slow` / `--ease-out`
- **淡出**：`--duration-slow` / `--ease-out`

#### 输入框动画
- **聚焦**：`--duration-fast` / `--ease-out`

### 减少运动支持

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 组件设计规范

### 按钮

#### 主按钮（Primary Button）
- **背景色**：`--brand-500`
- **文字颜色**：白色
- **圆角**：`--radius-sm`
- **内边距**：`--space-2`（垂直）/ `--space-3`（水平）
- **字体大小**：`--font-size-base`
- **字重**：`--font-weight-medium`
- **悬停**：背景色 `--brand-600`，阴影 `--shadow-sm`
- **按下**：背景色 `--brand-700`，无阴影
- **禁用**：背景色 `--gray-300`，文字颜色 `--gray-400`

#### 次按钮（Secondary Button）
- **背景色**：透明
- **文字颜色**：`--brand-500`
- **边框**：`1px solid` `--brand-500`
- **圆角**：`--radius-sm`
- **内边距**：`--space-2`（垂直）/ `--space-3`（水平）
- **字体大小**：`--font-size-base`
- **字重**：`--font-weight-medium`
- **悬停**：背景色 `rgba(99, 102, 241, 0.08)`
- **按下**：背景色 `rgba(99, 102, 241, 0.12)`
- **禁用**：文字颜色 `--gray-400`，边框 `--gray-300`

#### 文字按钮（Text Button）
- **背景色**：透明
- **文字颜色**：`--brand-500`
- **圆角**：`--radius-sm`
- **内边距**：`--space-1`（垂直）/ `--space-2`（水平）
- **字体大小**：`--font-size-base`
- **字重**：`--font-weight-medium`
- **悬停**：文字颜色 `--brand-600`
- **按下**：文字颜色 `--brand-700`
- **禁用**：文字颜色 `--gray-400`

### 输入框

#### 文本输入（Text Input）
- **背景色**：`--gray-50`（亮色模式）/ `--gray-900`（暗黑模式）
- **文字颜色**：`--gray-900`（亮色模式）/ `--gray-100`（暗黑模式）
- **边框**：`1px solid` `--gray-200`
- **圆角**：`--radius-md`
- **内边距**：`--space-2`
- **字体大小**：`--font-size-base`
- **占位符**：`--gray-400`
- **聚焦**：边框 `--brand-500`，阴影 `0 0 0 3px rgba(99, 102, 241, 0.1)`
- **错误**：边框 `--error-500`
- **禁用**：背景色 `--gray-100`，文字颜色 `--gray-400`

### 卡片

#### 项目卡片（Project Card）
- **背景色**：`rgba(255, 255, 255, 0.04)`（暗黑模式）
- **边框**：`1px solid` `rgba(255, 255, 255, 0.08)`
- **圆角**：`--radius-md`
- **内边距**：`--space-4`
- **阴影**：`--shadow-sm`
- **悬停**：阴影 `--shadow-md`，上浮 `2px`
- **标题**：`--font-size-xl` / `--font-weight-semibold`
- **描述**：`--font-size-sm` / `--font-weight-normal` / `--line-height-normal`
- **标签**：`--font-size-xs` / `--font-weight-medium`

### 导航栏

#### 主导航栏（Main Navigation）
- **背景色**：`rgba(15, 23, 42, 0.8)`（暗黑模式）
- **边框**：`1px solid` `rgba(255, 255, 255, 0.08)`
- **高度**：`64px`
- **内边距**：`--space-2` ~ `--space-4`
- **阴影**：`--shadow-sm`
- **Logo**：`--font-size-xl` / `--font-weight-bold`
- **导航链接**：`--font-size-sm` / `--font-weight-medium`
- **当前页面**：文字颜色 `--brand-500`

---

## 布局规范

### 容器

#### 页面容器（Page Container）
- **最大宽度**：`1200px`
- **内边距**：`--space-4`（移动端）/ `--space-6`（桌面端）
- **外边距**：`0 auto`（水平居中）

#### 区块容器（Section Container）
- **内边距**：`--space-8`（垂直）
- **最大宽度**：`100%`

### 网格系统

#### 3 列网格（3-Column Grid）
- **列宽**：`1fr`
- **间距**：`--space-4`
- **断点**：桌面端（`> 1024px`）

#### 2 列网格（2-Column Grid）
- **列宽**：`1fr`
- **间距**：`--space-4`
- **断点**：平板端（`640px - 1024px`）

#### 1 列网格（1-Column Grid）
- **列宽**：`100%`
- **间距**：`0`
- **断点**：移动端（`< 640px`）

---

## 响应式设计

### 断点定义

| 断点 | 值 | 设备 |
|------|-----|------|
| `sm` | `640px` | 移动端（大屏） |
| `md` | `768px` | 平板端（小屏） |
| `lg` | `1024px` | 平板端（大屏） |
| `xl` | `1280px` | 桌面端（小屏） |
| `2xl` | `1536px` | 桌面端（大屏） |

### 响应式规则

#### 字体大小
- **移动端**：`--font-size-base`（16px）
- **平板端**：`--font-size-base`（16px）
- **桌面端**：`--font-size-base`（16px）

#### 间距
- **移动端**：`--space-2` ~ `--space-4`
- **平板端**：`--space-3` ~ `--space-6`
- **桌面端**：`--space-4` ~ `--space-8`

#### 网格
- **移动端**：1 列
- **平板端**：2 列
- **桌面端**：3 列

---

## 暗黑模式

### 配色方案

#### 亮色模式
- **背景色**：`--gray-50`（`#F9FAFB`）
- **文字颜色**：`--gray-900`（`#111827`）
- **主色**：`--brand-500`（`#6366F1`）

#### 暗黑模式
- **背景色**：`--gray-900`（`#111827`）
- **文字颜色**：`--gray-100`（`#F1F5F9`）
- **主色**：`--brand-500`（`#6366F1`）

### 切换方式

#### 自动切换
```css
@media (prefers-color-scheme: dark) {
  :root {
    /* 暗黑模式配色 */
  }
}
```

#### 手动切换
- 使用 `data-theme` 属性
- 使用 `localStorage` 持久化

---

## 可访问性

### 键盘导航

#### Tab 键导航
- 导航顺序：从上到下，从左到右
- 焦点可见：清晰的焦点样式
- 跳过导航：跳到主内容按钮

#### 快捷键
- `Esc`：关闭模态框
- `Enter`：提交表单
- `Space`：切换开关

### 屏幕阅读器支持

#### 语义化 HTML
- 使用语义化标签：`header`、`nav`、`main`、`footer`
- ARIA 标签：`aria-label`、`aria-describedby`
- Alt 文本：图片描述

#### 标题层次
- `H1`：页面标题（每页一个）
- `H2`：主要章节
- `H3-H6`：子章节

### 颜色对比度

#### 对比度要求
- **文本**：至少 4.5:1
- **大文本**：至少 3:1
- **图标**：至少 3:1

#### 色盲友好
- 不仅依赖颜色传达信息
- 使用图标和文字配合

### 字体大小

#### 最小字体
- **正文**：至少 16px
- **标题**：根据层级递增

#### 字体缩放
- 支持浏览器字体缩放
- 使用相对单位（`rem`、`em`）

---

## 主题系统

### 主题列表

#### 1. 专业极简（Professional Minimal）
- **ID**：`professional-minimal`
- **描述**：极简主义，清晰高效，统一视觉语言，克制动画
- **趋势年份**：2026
- **主色**：`#6366F1`（Indigo-500）
- **次色**：`#8B5CF6`（Violet-500）
- **强调色**：`#F59E0B`（Amber-500）
- **背景色**：`#0F172A`（Slate-900）
- **文字颜色**：`#FFFFFF`（White）
- **动画**：只在交互时使用，持续 150-300ms

#### 2. 液态玻璃（Liquid Glass）
- **ID**：`liquid-glass`
- **描述**：液态玻璃效果，动态折射，透明感强
- **趋势年份**：2026
- **主色**：`#8B5CF6`（Violet-500）
- **次色**：`#EC4899`（Pink-500）
- **强调色**：`#06B6D4`（Cyan-500）
- **背景色**：`#0F172A`（Slate-900）
- **文字颜色**：`#FFFFFF`（White）
- **动画**：持续渐变动画，呼吸效果

#### 3. 动态渐变（Dynamic Gradient）
- **ID**：`dynamic-gradient`
- **描述**：动态渐变，呼吸色彩，流动感强
- **趋势年份**：2026
- **主色**：`#EC4899`（Pink-500）
- **次色**：`#F59E0B`（Amber-500）
- **强调色**：`#10B981`（Emerald-500）
- **背景色**：`#0F172A`（Slate-900）
- **文字颜色**：`#FFFFFF`（White）
- **动画**：流动渐变动画

#### 4. 材质混搭（Material Mix）
- **ID**：`material-mix`
- **描述**：材质混搭，纹理组合，触感强
- **趋势年份**：2026
- **主色**：`#10B981`（Emerald-500）
- **次色**：`#3B82F6`（Blue-500）
- **强调色**：`#EF4444`（Red-500）
- **背景色**：`#0F172A`（Slate-900）
- **文字颜色**：`#FFFFFF`（White）
- **动画**：材质切换动画

#### 5. 复古未来风（Retro-Futurism）
- **ID**：`retro-futurism`
- **描述**：复古未来风，Y2K 美学，霓虹效果
- **趋势年份**：2026
- **主色**：`#EF4444`（Red-500）
- **次色**：`#F59E0B`（Amber-500）
- **强调色**：`#10B981`（Emerald-500）
- **背景色**：`#0F172A`（Slate-900）
- **文字颜色**：`#FFFFFF`（White）
- **动画**：霓虹闪烁动画

#### 6. 技术单色风（Tech Mono）
- **ID**：`tech-mono`
- **描述**：技术单色风，代码美学，终端风格
- **趋势年份**：2026
- **主色**：`#10B981`（Emerald-500）
- **次色**：`#3B82F6`（Blue-500）
- **强调色**：`#F59E0B`（Amber-500）
- **背景色**：`#0F172A`（Slate-900）
- **文字颜色**：`#FFFFFF`（White）
- **动画**：终端闪烁动画

#### 7. 沉浸式全屏（Immersive Full-Screen）
- **ID**：`immersive-fullscreen`
- **描述**：沉浸式全屏，100% 高度，视觉冲击
- **趋势年份**：2026
- **主色**：`#3B82F6`（Blue-500）
- **次色**：`#8B5CF6`（Violet-500）
- **强调色**：`#EC4899`（Pink-500）
- **背景色**：`#0F172A`（Slate-900）
- **文字颜色**：`#FFFFFF`（White）
- **动画**：全屏过渡动画

### 主题切换

#### 切换方式
- 使用主题切换器组件
- 使用 `data-theme` 属性
- 使用 `localStorage` 持久化

#### 默认主题
- **默认主题**：`professional-minimal`

---

## 附录

### 相关文件

- **设计令牌**：`src/assets/styles/design-tokens.css`
- **主题样式**：`src/styles/themes.css`
- **主题定义**：`src/design-system/themes/`
- **主题类型**：`src/design-system/types/theme.ts`

### 参考资源

- **Linear Design**：https://linear.app/design
- **Vercel Design**：https://vercel.com/design
- **Stripe Design**：https://stripe.com/design
- **Material Design**：https://material.io/design
- **WCAG 2.1**：https://www.w3.org/WAI/WCAG21/quickref/

### 变更记录

| 版本 | 日期 | 变更内容 | 变更人 |
|------|------|----------|--------|
| v2.0 | 2026-01-22 | 完整的 UI 设计系统规范 | iFlow CLI |
| v1.0 | 2026-01-19 | 初始版本，UX 设计文档 | Sally |

---

**UI 设计系统规范结束**