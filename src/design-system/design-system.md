# MyPersonalWebsite 设计系统规范

**文档版本**: v2.0  
**创建日期**: 2026年1月25日  
**最后更新**: 2026年1月25日  
**设计师**: BMAD UX 专家  

---

## 📋 目录

1. [设计理念](#设计理念)
2. [设计原则](#设计原则)
3. [色彩系统](#色彩系统)
4. [排版系统](#排版系统)
5. [间距系统](#间距系统)
6. [组件规范](#组件规范)
7. [交互设计](#交互设计)
8. [响应式设计](#响应式设计)
9. [可访问性](#可访问性)
10. [性能优化](#性能优化)

---

## 🎨 设计理念

### 核心理念
```
现代简约 + 个人特色 + 用户中心
```

### 设计哲学
- **以用户为中心**: 所有设计决策基于用户需求和行为
- **功能优先**: 视觉效果服务于功能表达和信息传达
- **性能至上**: 设计不影响或提升页面性能和用户体验
- **一致性**: 建立统一的设计语言和交互模式
- **可访问性**: 确保所有用户都能无障碍使用网站

### 品牌定位
MyPersonalWebsite 是佘杰的个人技术品牌展示平台，需要体现：
- **专业性**: 技术深度和项目经验的专业展示
- **现代感**: 跟上时代设计趋势的现代化体验
- **个性化**: 突出个人特色和技术风格
- **可靠性**: 体现技术能力和项目质量

---

## 📏 设计原则

### 1. 简洁性原则
- **信息层次清晰**: 重要信息优先展示，次要信息合理隐藏
- **视觉噪音最小化**: 移除不必要的装饰元素
- **操作流程简化**: 减少用户认知负担和操作步骤

### 2. 一致性原则
- **设计语言统一**: 所有页面和组件使用相同的设计规范
- **交互模式一致**: 相同功能使用相同的交互方式
- **视觉风格统一**: 保持整体视觉风格的一致性

### 3. 可用性原则
- **用户目标明确**: 每个页面都有明确的用户目标
- **操作反馈及时**: 用户操作后立即获得视觉反馈
- **错误预防和恢复**: 防止用户犯错，提供错误恢复机制

### 4. 可访问性原则
- **WCAG AA 标准**: 完全符合无障碍设计标准
- **键盘导航**: 支持完整的键盘操作
- **屏幕阅读器**: 完美支持屏幕阅读器

### 5. 性能原则
- **快速加载**: 页面加载时间 < 2.5s
- **流畅动画**: 动画效果流畅不卡顿
- **资源优化**: 最小化资源占用

---

## 🎨 色彩系统

### 主色调系统

```css
:root {
  /* 主色调 */
  --color-primary: #6366F1;
  --color-primary-50: #EDE9FE;
  --color-primary-100: #DDD6FE;
  --color-primary-200: #C4B5FD;
  --color-primary-300: #A78BFA;
  --color-primary-400: #8B5CF6;
  --color-primary-500: #6366F1;
  --color-primary-600: #4F46E5;
  --color-primary-700: #4338CA;
  --color-primary-800: #3730A3;
  --color-primary-900: #312E81;
  
  /* 主色调变体 */
  --color-primary-light: #818CF8;
  --color-primary-dark: #4F46E5;
  --color-primary-variant: #4F46E5;
}
```

### 中性色系统

```css
:root {
  /* 浅色模式 */
  --color-surface-bg: #FFFFFF;
  --color-surface-bg-secondary: #F8FAFC;
  --color-surface-bg-tertiary: #F1F5F9;
  --color-surface-card: #FFFFFF;
  --color-surface-card-border: #E2E8F0;
  --color-surface-text: #1E293B;
  --color-surface-text-secondary: #64748B;
  --color-surface-text-tertiary: #94A3B8;
  --color-surface-border: #E2E8F0;
  --color-surface-border-secondary: #CBD5E1;
  
  /* 深色模式 */
  --color-surface-dark-bg: #0F172A;
  --color-surface-dark-bg-secondary: #1E293B;
  --color-surface-dark-bg-tertiary: #334155;
  --color-surface-dark-card: #1E293B;
  --color-surface-dark-card-border: #334155;
  --color-surface-dark-text: #F1F5F9;
  --color-surface-dark-text-secondary: #94A3B8;
  --color-surface-dark-text-tertiary: #64748B;
  --color-surface-dark-border: #334155;
  --color-surface-dark-border-secondary: #475569;
  
  /* 功能色 */
  --color-success: #10B981;
  --color-success-50: #F0FDF4;
  --color-success-100: #DCFCE7;
  --color-success-500: #10B981;
  
  --color-warning: #F59E0B;
  --color-warning-50: #FFFBEB;
  --color-warning-100: #FEF3C7;
  --color-warning-500: #F59E0B;
  
  --color-error: #EF4444;
  --color-error-50: #FEF2F2;
  --color-error-100: #FEE2E2;
  --color-error-500: #EF4444;
  
  --color-info: #3B82F6;
  --color-info-50: #EFF6FF;
  --color-info-100: #DBEAFE;
  --color-info-500: #3B82F6;
}
```

### 色彩使用规范

#### 文字颜色使用
```css
/* 文字颜色规范 */
.text-primary {
  color: var(--color-surface-text); /* 主要文字 */
}

.text-secondary {
  color: var(--color-surface-text-secondary); /* 次要文字 */
}

.text-tertiary {
  color: var(--color-surface-text-tertiary); /* 第三级文字 */
}

.text-disabled {
  color: var(--color-surface-text-tertiary); /* 禁用状态 */
}
```

#### 背景颜色使用
```css
/* 背景颜色规范 */
.bg-primary {
  background: var(--color-primary);
}

.bg-primary-light {
  background: var(--color-primary-50);
}

.bg-surface {
  background: var(--color-surface-bg);
}

.bg-surface-secondary {
  background: var(--color-surface-bg-secondary);
}

.bg-surface-card {
  background: var(--color-surface-card);
}
```

#### 边框颜色使用
```css
/* 边框颜色规范 */
.border-primary {
  border-color: var(--color-primary);
}

.border-surface {
  border-color: var(--color-surface-border);
}

.border-surface-secondary {
  border-color: var(--color-surface-border-secondary);
}
```

---

## 📝 排版系统

### 字体族

```css
:root {
  /* 主字体族 */
  --font-family-primary: 'Inter', system-ui, -apple-system, sans-serif;
  --font-family-secondary: 'Inter', system-ui, -apple-system, sans-serif;
  --font-family-mono: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', monospace;
  
  /* 字重 */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
}
```

### 字体大小系统

```css
:root {
  /* 字体大小 */
  --font-size-xs: 0.75rem;      /* 12px */
  --font-size-sm: 0.875rem;     /* 14px */
  --font-size-base: 1rem;       /* 16px */
  --font-size-lg: 1.125rem;     /* 18px */
  --font-size-xl: 1.25rem;      /* 20px */
  --font-size-2xl: 1.5rem;      /* 24px */
  --font-size-3xl: 1.875rem;    /* 30px */
  --font-size-4xl: 2.25rem;     /* 36px */
  --font-size-5xl: 3rem;        /* 48px */
  --font-size-6xl: 3.75rem;     /* 60px */
  --font-size-7xl: 4.5rem;      /* 72px */
  --font-size-8xl: 6rem;        /* 96px */
  --font-size-9xl: 8rem;        /* 128px */
}
```

### 行高系统

```css
:root {
  /* 行高 */
  --line-height-tight: 1.25;    /* 125% */
  --line-height-normal: 1.5;    /* 150% */
  --line-height-relaxed: 1.75;  /* 175% */
  --line-height-loose: 2;       /* 200% */
}
```

### 排版使用规范

#### 标题排版
```css
/* 标题规范 */
h1 {
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-surface-text);
  margin-bottom: var(--spacing-md);
}

h2 {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-surface-text);
  margin-bottom: var(--spacing-md);
}

h3 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-normal);
  color: var(--color-surface-text);
  margin-bottom: var(--spacing-sm);
}

h4 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-normal);
  color: var(--color-surface-text);
  margin-bottom: var(--spacing-sm);
}

h5 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
  color: var(--color-surface-text);
  margin-bottom: var(--spacing-xs);
}

h6 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
  color: var(--color-surface-text);
  margin-bottom: var(--spacing-xs);
}
```

#### 正文排版
```css
/* 正文规范 */
.text-body {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  color: var(--color-surface-text);
}

.text-body-sm {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
  color: var(--color-surface-text-secondary);
}

.text-body-lg {
  font-size: var(--font-size-lg);
  line-height: var(--line-height-normal);
  color: var(--color-surface-text);
}
```

#### 代码排版
```css
/* 代码规范 */
.text-code {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
  color: var(--color-surface-text);
  background: var(--color-surface-bg-secondary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
}
```

---

## 📏 间距系统

### 间距基础单位

```css
:root {
  /* 间距基础单位 (4px) */
  --spacing-1: 0.25rem;   /* 4px */
  --spacing-2: 0.5rem;    /* 8px */
  --spacing-3: 0.75rem;   /* 12px */
  --spacing-4: 1rem;      /* 16px */
  --spacing-5: 1.25rem;   /* 20px */
  --spacing-6: 1.5rem;    /* 24px */
  --spacing-8: 2rem;      /* 32px */
  --spacing-10: 2.5rem;   /* 40px */
  --spacing-12: 3rem;     /* 48px */
  --spacing-16: 4rem;     /* 64px */
  --spacing-20: 5rem;     /* 80px */
  --spacing-24: 6rem;     /* 96px */
  --spacing-32: 8rem;     /* 128px */
  --spacing-40: 10rem;    /* 160px */
  --spacing-48: 12rem;    /* 192px */
  --spacing-56: 14rem;    /* 224px */
  --spacing-64: 16rem;    /* 256px */
}
```

### 间距使用规范

#### 内边距 (Padding)
```css
/* 内边距规范 */
.p-1 { padding: var(--spacing-1); }
.p-2 { padding: var(--spacing-2); }
.p-3 { padding: var(--spacing-3); }
.p-4 { padding: var(--spacing-4); }
.p-6 { padding: var(--spacing-6); }
.p-8 { padding: var(--spacing-8); }
.p-12 { padding: var(--spacing-12); }
.p-16 { padding: var(--spacing-16); }

/* 方向性内边距 */
.p-t-4 { padding-top: var(--spacing-4); }
.p-r-4 { padding-right: var(--spacing-4); }
.p-b-4 { padding-bottom: var(--spacing-4); }
.p-l-4 { padding-left: var(--spacing-4); }

/* 多方向内边距 */
.p-x-4 { padding-left: var(--spacing-4); padding-right: var(--spacing-4); }
.p-y-4 { padding-top: var(--spacing-4); padding-bottom: var(--spacing-4); }
```

#### 外边距 (Margin)
```css
/* 外边距规范 */
.m-1 { margin: var(--spacing-1); }
.m-2 { margin: var(--spacing-2); }
.m-3 { margin: var(--spacing-3); }
.m-4 { margin: var(--spacing-4); }
.m-6 { margin: var(--spacing-6); }
.m-8 { margin: var(--spacing-8); }
.m-12 { margin: var(--spacing-12); }
.m-16 { margin: var(--spacing-16); }

/* 方向性外边距 */
.m-t-4 { margin-top: var(--spacing-4); }
.m-r-4 { margin-right: var(--spacing-4); }
.m-b-4 { margin-bottom: var(--spacing-4); }
.m-l-4 { margin-left: var(--spacing-4); }

/* 多方向外边距 */
.m-x-4 { margin-left: var(--spacing-4); margin-right: var(--spacing-4); }
.m-y-4 { margin-top: var(--spacing-4); margin-bottom: var(--spacing-4); }
```

#### 间距组合
```css
/* 常用间距组合 */
.spacing-xs { gap: var(--spacing-2); }
.spacing-sm { gap: var(--spacing-4); }
.spacing-md { gap: var(--spacing-6); }
.spacing-lg { gap: var(--spacing-8); }
.spacing-xl { gap: var(--spacing-12); }
.spacing-2xl { gap: var(--spacing-16); }
```

---

## 🎨 组件规范

### 按钮组件

#### 基础按钮
```vue
<template>
  <button 
    class="btn"
    :class="[
      `btn--${variant}`,
      `btn--${size}`,
      { 'btn--disabled': disabled, 'btn--loading': loading }
    ]"
    :disabled="disabled"
    :aria-busy="loading"
    :aria-label="loading ? '加载中...' : label"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'text'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md'
})

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  if (!props.disabled && !props.loading) {
    emit('click')
  }
}
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-6);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
  transition: all var(--transition-normal);
  cursor: pointer;
  user-select: none;
  position: relative;
  overflow: hidden;
  min-height: 40px;
  min-width: 40px;
}

/* 按钮变体 */
.btn--primary {
  background: var(--color-primary);
  color: white;
}

.btn--primary:hover:not(:disabled) {
  background: var(--color-primary-600);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.btn--primary:active:not(:disabled) {
  background: var(--color-primary-700);
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
}

.btn--secondary {
  background: var(--color-surface-bg-secondary);
  color: var(--color-surface-text);
  border: 1px solid var(--color-surface-border);
}

.btn--secondary:hover:not(:disabled) {
  background: var(--color-surface-bg-tertiary);
  border-color: var(--color-surface-border-secondary);
}

.btn--outline {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.btn--outline:hover:not(:disabled) {
  background: var(--color-primary-50);
  color: var(--color-primary-600);
}

.btn--ghost {
  background: transparent;
  color: var(--color-surface-text);
}

.btn--ghost:hover:not(:disabled) {
  background: var(--color-surface-bg-secondary);
  color: var(--color-primary);
}

.btn--text {
  background: transparent;
  color: var(--color-primary);
}

.btn--text:hover:not(:disabled) {
  background: var(--color-primary-50);
}

/* 按钮尺寸 */
.btn--sm {
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--font-size-sm);
  min-height: 32px;
  min-width: 32px;
}

.btn--lg {
  padding: var(--spacing-4) var(--spacing-8);
  font-size: var(--font-size-lg);
  min-height: 48px;
  min-width: 48px;
}

.btn--xl {
  padding: var(--spacing-5) var(--spacing-12);
  font-size: var(--font-size-xl);
  min-height: 56px;
  min-width: 56px;
}

/* 状态 */
.btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.btn--loading {
  pointer-events: none;
}

/* 微交互 */
.btn:active:not(:disabled) {
  transform: scale(0.98);
}

.btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
```

### 卡片组件

#### 基础卡片
```vue
<template>
  <article 
    class="card"
    :class="[
      `card--${variant}`,
      { 'card--interactive': interactive, 'card--hover': hover }
    ]"
    @click="handleClick"
  >
    <div v-if="$slots.header" class="card__header">
      <slot name="header"></slot>
    </div>
    
    <div v-if="$slots.image" class="card__image">
      <slot name="image"></slot>
    </div>
    
    <div class="card__content">
      <slot name="content"></slot>
    </div>
    
    <div v-if="$slots.footer" class="card__footer">
      <slot name="footer"></slot>
    </div>
  </article>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

interface Props {
  variant?: 'default' | 'primary' | 'secondary'
  interactive?: boolean
  hover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  interactive: false,
  hover: true
})

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  if (props.interactive) {
    emit('click')
  }
}
</script>

<style scoped>
.card {
  background: var(--color-surface-card);
  border: 1px solid var(--color-surface-card-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
}

.card--primary {
  border-color: var(--color-primary);
  background: var(--color-primary-50);
}

.card--secondary {
  border-color: var(--color-surface-border-secondary);
  background: var(--color-surface-bg-secondary);
}

.card--interactive {
  cursor: pointer;
}

.card:hover:not(.card--disabled) {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.card:active:not(.card--disabled) {
  transform: translateY(-2px);
}

.card__header {
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--color-surface-border);
}

.card__image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.card:hover .card__image img {
  transform: scale(1.05);
}

.card__content {
  padding: var(--spacing-6);
}

.card__footer {
  padding: var(--spacing-4);
  border-top: 1px solid var(--color-surface-border);
  background: var(--color-surface-bg-secondary);
}
</style>
```

### 输入框组件

#### 基础输入框
```vue
<template>
  <div class="input-group">
    <label v-if="label" :for="id" class="input-label">
      {{ label }}
      <span v-if="required" class="input-required">*</span>
    </label>
    
    <div class="input-wrapper">
      <input
        :id="id"
        type="text"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-describedby="helpText ? `${id}-help` : undefined"
        :aria-invalid="error ? 'true' : 'false'"
        :aria-required="required"
        class="input"
        :class="[
          `input--${size}`,
          { 'input--error': error, 'input--disabled': disabled }
        ]"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      
      <div v-if="error" class="input-error">
        <slot name="error">{{ error }}</slot>
      </div>
    </div>
    
    <div v-if="helpText" :id="`${id}-help`" class="input-help">
      {{ helpText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'

interface Props {
  modelValue: string
  id?: string
  label?: string
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  error?: string
  helpText?: string
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  size: 'md',
  required: false,
  disabled: false,
  readonly: false,
  error: '',
  helpText: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: []
  blur: []
}>()

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleFocus = () => {
  emit('focus')
}

const handleBlur = () => {
  emit('blur')
}

const inputId = computed(() => props.id || `input-${Date.now()}`)
</script>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.input-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-surface-text);
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.input-required {
  color: var(--color-error);
  font-size: var(--font-size-xs);
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.input {
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  transition: all var(--transition-normal);
  color: var(--color-surface-text);
  background: var(--color-surface-bg);
  font-family: var(--font-family-primary);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.input::placeholder {
  color: var(--color-surface-text-tertiary);
}

.input--error {
  border-color: var(--color-error);
}

.input--error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.input--disabled {
  background: var(--color-surface-bg-secondary);
  color: var(--color-surface-text-tertiary);
  cursor: not-allowed;
}

.input--disabled::placeholder {
  color: var(--color-surface-text-tertiary);
}

/* 尺寸 */
.input--sm {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--font-size-sm);
}

.input--lg {
  padding: var(--spacing-4) var(--spacing-6);
  font-size: var(--font-size-lg);
}

.input-error {
  font-size: var(--font-size-sm);
  color: var(--color-error);
  margin-top: var(--spacing-1);
}

.input-help {
  font-size: var(--font-size-sm);
  color: var(--color-surface-text-secondary);
}
</style>
```

---

## 🖱️ 交互设计

### 微交互系统

```css
:root {
  /* 过渡动画 */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 350ms ease;
  --transition-slowest: 500ms ease;
  
  /* 缓动函数 */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  
  /* 悬停效果 */
  --hover-scale: 1.02;
  --hover-translate: translateY(-2px);
  --hover-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  /* 点击反馈 */
  --press-scale: 0.98;
  --press-translate: translateY(0);
  --press-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
```

### 交互反馈

#### 按钮交互
```css
.btn {
  /* 默认状态 */
  transition: all var(--transition-normal);
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--hover-shadow);
}

.btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: var(--press-shadow);
}

.btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

#### 卡片交互
```css
.card {
  transition: all var(--transition-normal);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.card:active {
  transform: translateY(-2px);
}
```

#### 加载状态
```css
.btn--loading {
  pointer-events: none;
  opacity: 0.75;
}

.btn--loading::after {
  content: '';
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-left: var(--spacing-2);
  border: 2px solid currentColor;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

### 动画系统

#### 进入动画
```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideRight {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

#### 退出动画
```css
@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes slideDown {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(20px);
  }
}
```

---

## 📱 响应式设计

### 响应式断点

```css
:root {
  /* 响应式断点 */
  --breakpoint-xs: 320px;
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

### 响应式工具类

#### 容器响应式
```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
}

@media (min-width: 640px) {
  .container {
    padding: 0 var(--spacing-6);
  }
}

@media (min-width: 768px) {
  .container {
    padding: 0 var(--spacing-8);
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 var(--spacing-12);
  }
}
```

#### 网格系统
```css
.grid {
  display: grid;
  gap: var(--spacing-6);
}

.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
.grid-cols-6 { grid-template-columns: repeat(6, 1fr); }

@media (min-width: 640px) {
  .grid-cols-sm-2 { grid-template-columns: repeat(2, 1fr); }
  .grid-cols-sm-3 { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 768px) {
  .grid-cols-md-2 { grid-template-columns: repeat(2, 1fr); }
  .grid-cols-md-3 { grid-template-columns: repeat(3, 1fr); }
  .grid-cols-md-4 { grid-template-columns: repeat(4, 1fr); }
}

@media (min-width: 1024px) {
  .grid-cols-lg-3 { grid-template-columns: repeat(3, 1fr); }
  .grid-cols-lg-4 { grid-template-columns: repeat(4, 1fr); }
  .grid-cols-lg-6 { grid-template-columns: repeat(6, 1fr); }
}
```

#### 布局响应式
```css
.flex {
  display: flex;
}

.flex-col { flex-direction: column; }
.flex-row { flex-direction: row; }
.flex-wrap { flex-wrap: wrap; }
.flex-nowrap { flex-wrap: nowrap; }

.items-start { align-items: flex-start; }
.items-center { align-items: center; }
.items-end { align-items: flex-end; }
.items-stretch { align-items: stretch; }

.justify-start { justify-content: flex-start; }
.justify-center { justify-content: center; }
.justify-end { justify-content: flex-end; }
.justify-between { justify-content: space-between; }
.justify-around { justify-content: space-around; }

.gap-2 { gap: var(--spacing-2); }
.gap-4 { gap: var(--spacing-4); }
.gap-6 { gap: var(--spacing-6); }
.gap-8 { gap: var(--spacing-8); }

@media (max-width: 768px) {
  .flex-col-md { flex-direction: column; }
  .flex-row-md { flex-direction: row; }
  
  .items-start-md { align-items: flex-start; }
  .items-center-md { align-items: center; }
  .items-end-md { align-items: flex-end; }
}
```

---

## ♿ 可访问性

### WCAG 标准遵循

#### 颜色对比度
```css
/* WCAG AA 标准对比度要求 */
.text-primary {
  color: var(--color-surface-text); /* 4.5:1 */
}

.text-secondary {
  color: var(--color-surface-text-secondary); /* 3:1 */
}

.text-tertiary {
  color: var(--color-surface-text-tertiary); /* 4.5:1 */
}

.bg-primary {
  background: var(--color-primary); /* 4.5:1 */
}

.border-surface {
  border-color: var(--color-surface-border); /* 4.5:1 */
}
```

#### 键盘导航
```css
/* 焦点指示器 */
.btn:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* 跳转链接 */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--color-primary);
  color: white;
  padding: var(--spacing-2) var(--spacing-4);
  text-decoration: none;
  border-radius: var(--radius-sm);
  z-index: var(--z-tooltip);
}

.skip-link:focus {
  top: 6px;
}
```

#### 屏幕阅读器支持
```css
/* 屏幕阅读器专用类 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* 可访问标签 */
.accessible-label {
  position: relative;
}

.accessible-label::before {
  content: attr(aria-label);
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--color-surface-text);
  color: var(--color-surface-bg);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  white-space: nowrap;
  opacity: 0;
  transition: opacity var(--transition-fast);
  pointer-events: none;
}

.accessible-label:hover::before,
.accessible-label:focus::before {
  opacity: 1;
}
```

#### 语义化 HTML
```html
<!-- 语义化 HTML 结构 -->
<header>
  <nav role="navigation" aria-label="主导航">
    <ul>
      <li><a href="/">首页</a></li>
      <li><a href="/projects">项目</a></li>
      <li><a href="/skills">技能</a></li>
    </ul>
  </nav>
</header>

<main>
  <section aria-labelledby="hero-heading">
    <h1 id="hero-heading">我的个人网站</h1>
    <p>网站描述</p>
  </section>
  
  <section aria-labelledby="projects-heading">
    <h2 id="projects-heading">精选项目</h2>
    <article aria-label="项目卡片">
      <h3>项目标题</h3>
      <p>项目描述</p>
    </article>
  </section>
</main>

<footer>
  <p>版权信息</p>
</footer>
```

---

## ⚡ 性能优化

### 加载优化

#### 图片优化
```css
/* 图片懒加载 */
.lazy-image {
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.lazy-image.loaded {
  opacity: 1;
}

/* 预加载关键资源 */
.preload-critical {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}
```

#### 字体优化
```css
/* 字体预加载 */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/inter-regular.woff2') format('woff2');
}

/* 字体回退 */
body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
```

### 动画性能优化

#### GPU 加速
```css
/* GPU 加速动画 */
.btn {
  will-change: transform, box-shadow;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.card {
  will-change: transform, box-shadow;
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* 减少重绘 */
.btn,
.card {
  transform: translateZ(0);
  contain: layout style paint;
}
```

#### 简化动画
```css
/* 简化动画效果 */
.btn:hover {
  transition: all var(--transition-fast);
}

.card:hover {
  transition: all var(--transition-fast);
}

/* 避免复杂的动画 */
.btn--complex {
  animation: none;
}
```

### 资源优化

#### CSS 优化
```css
/* 压缩 CSS */
:root {
  --color-primary: #6366F1;
  --color-surface-bg: #FFFFFF;
  --font-size-base: 1rem;
  --spacing-4: 1rem;
}

/* 移除未使用的 CSS */
/* 使用 PurgeCSS 移除未使用的样式 */
```

#### JavaScript 优化
```javascript
// 代码分割
const loadComponent = () => import('./HeavyComponent.vue')

// 防抖处理
const debounce = (func, wait) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

// 节流处理
const throttle = (func, limit) => {
  let inThrottle
  return (...args) => {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}
```

---

## 📊 设计质量标准

### 一致性检查清单

#### 视觉一致性
- [ ] 色彩系统使用一致
- [ ] 排版系统使用一致
- [ ] 间距系统使用一致
- [ ] 圆角风格统一
- [ ] 阴影效果统一

#### 交互一致性
- [ ] 按钮交互模式一致
- [ ] 卡片交互模式一致
- [ ] 表单交互模式一致
- [ ] 动画效果一致
- [ ] 状态反馈一致

#### 可访问性一致性
- [ ] 焦点指示一致
- [ ] 键盘导航一致
- [ ] 屏幕阅读器支持一致
- [ ] 语义化 HTML 一致
- [ ] 对比度标准一致

### 性能标准

#### 加载性能
- [ ] 首屏加载时间 < 2.5s
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] FID < 100ms
- [ ] TTI < 4s

#### 交互性能
- [ ] 帧率稳定 > 60fps
- [ ] 动画流畅无卡顿
- [ ] 响应时间 < 100ms
- [ ] 滚动性能优化
- [ ] 触摸交互响应快

### 可访问性标准

#### WCAG 2.1 AA 标准
- [ ] 文本对比度 > 4.5:1
- [ ] 焦点指示明显
- [ ] 键盘导航完整
- [ ] 屏幕阅读器兼容
- [ ] 减少运动偏好

#### 操作系统兼容性
- [ ] Windows NVDA 支持
- [ ] macOS VoiceOver 支持
- [ ] iOS VoiceOver 支持
- [ ] Android TalkBack 支持
- [ ] 键盘导航完整

---

## 🎯 使用指南

### 开发者使用

#### 安装设计系统
```bash
# 复制设计系统文件到项目
cp -r src/design-system/* src/assets/styles/
```

#### 引入设计系统
```css
/* 在 main.css 中引入 */
@import './design-system/design-tokens.css';
@import './design-system/components.css';
@import './design-system/typography.css';
@import './design-system/spacing.css';
```

#### 使用组件
```vue
<template>
  <div>
    <Btn variant="primary" size="lg" @click="handleClick">
      点击我
    </Btn>
    
    <Card variant="primary">
      <template #content>
        <h3>卡片标题</h3>
        <p>卡片内容</p>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Btn from '@/components/atoms/Button.vue'
import Card from '@/components/atoms/Card.vue'
</script>
```

### 设计师使用

#### 设计规范遵循
- 严格遵循色彩系统规范
- 按照排版系统使用字体
- 使用间距系统进行布局
- 参考组件规范创建设计

#### 设计工具配置
```json
{
  "color": {
    "primary": "#6366F1",
    "primary-50": "#EDE9FE",
    "primary-500": "#6366F1"
  },
  "typography": {
    "font-family": "Inter",
    "sizes": {
      "xs": "12px",
      "sm": "14px",
      "base": "16px",
      "lg": "18px",
      "xl": "20px"
    }
  },
  "spacing": {
    "unit": "4px",
    "multipliers": [1, 2, 3, 4, 6, 8, 12, 16]
  }
}
```

---

## 📝 更新日志

### v2.0 (2026-01-25)
- ✅ 重新设计色彩系统，符合现代设计趋势
- ✅ 完善排版系统，建立完整的字体规范
- ✅ 建立标准化的间距系统
- ✅ 创建基础组件库，包括按钮、卡片、输入框
- ✅ 定义微交互和动画系统
- ✅ 完善响应式设计规范
- ✅ 建立可访问性标准和最佳实践
- ✅ 添加性能优化指南
- ✅ 建立设计质量检查清单

### v1.0 (2026-01-24)
- 📋 初始设计系统文档
- 🎨 基础色彩和排版规范
- 📏 间距和布局系统
- 🎯 组件基础规范

---

## 📞 联系方式

**设计师**: BMAD UX 专家  
**联系方式**: 通过 iFlow CLI 联系  
**文档版本**: v2.0  
**最后更新**: 2026年1月25日

---

*本设计系统文档是 MyPersonalWebsite 项目的重要组成部分，确保设计的一致性和可维护性。*