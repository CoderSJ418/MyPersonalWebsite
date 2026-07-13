# Phase 1 任务清单

> **执行前确保已读完 `docs/joycode/MASTER.md`（铁律和代码规范）。**

**Phase 1 目标**：搭建 /lab 效果实验室的基础设施——目录结构、注册表、共享组件、路由、导航、搜索筛选、构建校验。
**Phase 1 不包含**：任何 demo 组件（`demos/` 目录在 Phase 2 填充）。

**验证总入口**：`npm run validate:lab`

---

## Task 1.1 — 创建目录结构和骨架文件

### 创建目录

```bash
mkdir -p src/views/Lab/demos
```

### 创建 src/views/Lab/LabIndex.vue

精确内容：

```vue
<script setup lang="ts">
// Phase 1 skeleton — 具体内容 Phase 2 实现
</script>

<template>
  <div class="lab-index">
    <h1>效果实验室</h1>
    <p>交互式前端效果演示 — 点击卡片实时体验，调节参数理解原理</p>
  </div>
</template>
```

### 创建 src/views/Lab/LabLayout.vue

精确内容：

```vue
<script setup lang="ts">
import { computed, reactive, provide } from 'vue'
import { useRoute } from 'vue-router'
import { labRegistry } from '@/config/labRegistry'
import SEOHead from '@/components/common/SEOHead.vue'
import CodeBlock from '@/components/blog/CodeBlock.vue'
import LabNotFound from './LabNotFound.vue'

const route = useRoute()
const effect = computed(() => labRegistry.find(e => e.id === route.params.id))

const labParams = reactive<Record<string, string | number>>({})
provide('labParams', labParams)
</script>

<template>
  <SEOHead
    v-if="effect"
    :title="effect.name"
    :description="effect.description"
    type="webpage"
  />
  <div v-if="effect" class="lab-layout">
    <nav aria-label="Breadcrumb" class="lab-breadcrumb">
      <RouterLink to="/lab">效果实验室</RouterLink>
      <span class="lab-breadcrumb-sep">/</span>
      <span>{{ effect.name }}</span>
    </nav>
    <Suspense>
      <template #default>
        <component :is="effect.component" />
      </template>
      <template #fallback>
        <div class="lab-loading">加载效果中...</div>
      </template>
    </Suspense>
    <LabParamPanel v-if="effect.params?.length" :params="effect.params" v-model:modelValue="labParams" />
    <CodeBlock :code="effect.code" :language="effect.language" :show-copy="true" :show-line-numbers="true" />
  </div>
  <LabNotFound v-else :id="route.params.id as string" />
</template>
```

**注意**：
- `v-if="effect"` 在 `<Suspense>` 上，不在 `<component>` 上
- `provide('labParams')` 使用 `reactive()` 包装
- `CodeBlock` 不传 `version` prop

### 创建 src/views/Lab/LabNotFound.vue

精确内容：

```vue
<script setup lang="ts">
import { useRoute } from 'vue-router'
import SEOHead from '@/components/common/SEOHead.vue'

const route = useRoute()
</script>

<template>
  <SEOHead title="效果不存在" description="该效果未找到" type="webpage" />
  <div class="lab-not-found">
    <h1>404</h1>
    <p>效果 "{{ route.params.id }}" 不存在</p>
    <RouterLink to="/lab">浏览所有效果 →</RouterLink>
  </div>
</template>
```

### 验证

```bash
npm run lint
npm run build
ls -la src/views/Lab/
ls -la src/views/Lab/demos/
```

---

## Task 1.2 — 创建效果注册表 src/config/labRegistry.ts

创建文件 `src/config/labRegistry.ts`：

```ts
import type { Component } from 'vue'

export interface LabEffect {
  id: string
  name: string
  description: string
  category: 'background' | 'card' | 'button' | 'text' | 'animation' | 'layout' | 'data'
  tags: string[]
  component: () => Promise<{ default: Component }>
  code: string
  language: string
  params?: LabParam[]
}

export interface LabParam {
  key: string
  label: string
  type: 'range' | 'color' | 'select'
  min?: number
  max?: number
  step?: number
  defaultValue: string | number
  options?: { label: string; value: string }[]
}

export const labRegistry: LabEffect[] = [
  {
    id: 'aurora',
    name: 'Aurora 极光背景',
    description: '流动的渐变光带，模拟北极光效果',
    category: 'background',
    tags: ['CSS', 'gradient', 'animation'],
    component: () => import('@/views/Lab/demos/AuroraDemo.vue'),
    code: `<template>\n  <div class="aurora-bg">\n    <div class="aurora-ribbon" />\n    <div class="aurora-ribbon" />\n    <div class="aurora-ribbon" />\n  </div>\n</template>`,
    language: 'vue',
    params: [
      { key: 'speed', label: '速度', type: 'range', min: 1, max: 5, step: 0.5, defaultValue: 2 },
      { key: 'colorTheme', label: '颜色主题', type: 'select', defaultValue: 'blue',
        options: [
          { label: '蓝', value: 'blue' },
          { label: '靛', value: 'indigo' },
          { label: '紫', value: 'purple' },
          { label: '青', value: 'cyan' },
        ] },
    ],
  },
  {
    id: 'grid-pattern',
    name: '网格底纹',
    description: '科技感网格背景，带呼吸动画',
    category: 'background',
    tags: ['SVG', 'CSS', 'pattern'],
    component: () => import('@/views/Lab/demos/GridPatternDemo.vue'),
    code: `<div class="grid-pattern-bg" />`,
    language: 'html',
    params: [
      { key: 'opacity', label: '透明度', type: 'range', min: 0.1, max: 1, step: 0.1, defaultValue: 0.5 },
      { key: 'gridSize', label: '网格大小', type: 'range', min: 20, max: 80, step: 5, defaultValue: 40 },
    ],
  },
  {
    id: 'dot-pattern',
    name: '点阵背景',
    description: '圆点阵列背景图案',
    category: 'background',
    tags: ['SVG', 'pattern'],
    component: () => import('@/views/Lab/demos/DotPatternDemo.vue'),
    code: `<div class="dot-pattern-bg" />`,
    language: 'html',
    params: [
      { key: 'dotSize', label: '点大小', type: 'range', min: 1, max: 6, step: 0.5, defaultValue: 2 },
      { key: 'spacing', label: '间距', type: 'range', min: 10, max: 40, step: 2, defaultValue: 20 },
    ],
  },
  {
    id: 'noise-texture',
    name: '噪点纹理',
    description: 'SVG feTurbulence 生成的噪点纹理',
    category: 'background',
    tags: ['SVG', 'feTurbulence'],
    component: () => import('@/views/Lab/demos/NoiseTextureDemo.vue'),
    code: `<svg class="noise-bg">\n  <filter id="noise">\n    <feTurbulence baseFrequency="0.65" />\n  </filter>\n  <rect width="100%" height="100%" filter="url(#noise)" />\n</svg>`,
    language: 'html',
    params: [
      { key: 'opacity', label: '透明度', type: 'range', min: 0.05, max: 0.3, step: 0.01, defaultValue: 0.1 },
    ],
  },
  {
    id: 'meteors',
    name: '流星效果',
    description: 'CSS 动画驱动的流星划过效果',
    category: 'background',
    tags: ['CSS', 'animation'],
    component: () => import('@/views/Lab/demos/MeteorsDemo.vue'),
    code: `<div class="meteors-bg">\n  <div class="meteor" />\n</div>`,
    language: 'html',
    params: [
      { key: 'count', label: '数量', type: 'range', min: 5, max: 30, step: 1, defaultValue: 15 },
      { key: 'speed', label: '速度', type: 'range', min: 1, max: 5, step: 0.5, defaultValue: 2 },
    ],
  },
  {
    id: 'spotlight',
    name: '卡片追光',
    description: '鼠标移动时卡片表面产生追光效果',
    category: 'card',
    tags: ['JS', 'mousemove', 'CSS'],
    component: () => import('@/views/Lab/demos/SpotlightDemo.vue'),
    code: `<div class="spotlight-card" @mousemove="handleMouseMove">\n  <div class="spotlight" />\n</div>`,
    language: 'vue',
    params: [
      { key: 'radius', label: '光斑半径', type: 'range', min: 100, max: 400, step: 10, defaultValue: 250 },
    ],
  },
  {
    id: 'tilt-card',
    name: '3D 倾斜卡片',
    description: '鼠标悬停时卡片沿 X/Y 轴 3D 倾斜',
    category: 'card',
    tags: ['CSS', 'transform', 'JS'],
    component: () => import('@/views/Lab/demos/TiltCardDemo.vue'),
    code: `<div class="tilt-card" @mousemove="handleTilt">\n  <div class="tilt-inner">\n    Content\n  </div>\n</div>`,
    language: 'vue',
    params: [
      { key: 'maxTilt', label: '最大倾斜角度', type: 'range', min: 5, max: 20, step: 1, defaultValue: 10 },
      { key: 'perspective', label: '透视距离', type: 'range', min: 300, max: 1000, step: 50, defaultValue: 500 },
    ],
  },
  {
    id: 'magic-card',
    name: '魔法卡片',
    description: '边框渐变 + 3D 光泽跟随鼠标',
    category: 'card',
    tags: ['CSS', 'gradient', 'JS'],
    component: () => import('@/views/Lab/demos/MagicCardDemo.vue'),
    code: `<div class="magic-card">\n  <div class="magic-border" />\n</div>`,
    language: 'vue',
    params: [
      { key: 'borderWidth', label: '边框宽度', type: 'range', min: 1, max: 3, step: 0.5, defaultValue: 1 },
    ],
  },
  {
    id: 'shine-border',
    name: '边框光泽',
    description: '按钮边框上的旋转光泽效果',
    category: 'button',
    tags: ['CSS', '@property', 'conic-gradient'],
    component: () => import('@/views/Lab/demos/ShineBorderDemo.vue'),
    code: `<button class="shine-border-btn">\n  Hover me\n</button>`,
    language: 'html',
    params: [
      { key: 'borderWidth', label: '边框宽度', type: 'range', min: 1, max: 3, step: 0.5, defaultValue: 1 },
      { key: 'speed', label: '旋转速度', type: 'range', min: 1, max: 8, step: 0.5, defaultValue: 3 },
    ],
  },
  {
    id: 'shimmer-button',
    name: '按钮扫光',
    description: '按钮表面从左到右的光泽扫过动画',
    category: 'button',
    tags: ['CSS', 'animation', 'gradient'],
    component: () => import('@/views/Lab/demos/ShimmerButtonDemo.vue'),
    code: `<button class="shimmer-btn">\n  <span class="shimmer" />\n  Click me\n</button>`,
    language: 'html',
    params: [
      { key: 'duration', label: '动画时长', type: 'range', min: 1, max: 5, step: 0.5, defaultValue: 2 },
    ],
  },
  {
    id: 'number-ticker',
    name: '数字滚动',
    description: '数字从 0 滚动到目标值的动画效果',
    category: 'data',
    tags: ['rAF', 'animation', 'numbers'],
    component: () => import('@/views/Lab/demos/NumberTickerDemo.vue'),
    code: `<NumberTicker :value={98234} />`,
    language: 'vue',
    params: [
      { key: 'targetValue', label: '目标值', type: 'range', min: 0, max: 99999, step: 1, defaultValue: 98234 },
      { key: 'duration', label: '动画时长(ms)', type: 'range', min: 500, max: 5000, step: 100, defaultValue: 2000 },
    ],
  },
  {
    id: 'marquee',
    name: '无限滚动',
    description: '内容无缝循环滚动的跑马灯效果',
    category: 'layout',
    tags: ['CSS', 'animation'],
    component: () => import('@/views/Lab/demos/MarqueeDemo.vue'),
    code: `<div class="marquee">\n  <div class="marquee-content">\n    Item 1 · Item 2 · Item 3\n  </div>\n</div>`,
    language: 'html',
    params: [
      { key: 'speed', label: '滚动速度', type: 'range', min: 10, max: 60, step: 5, defaultValue: 30 },
      { key: 'direction', label: '方向', type: 'select', defaultValue: 'left',
        options: [
          { label: '向左', value: 'left' },
          { label: '向右', value: 'right' },
        ] },
    ],
  },
]
```

### 验证

```bash
npm run lint
npx tsc --noEmit
npm run build
```

---

## Task 1.3 — 创建共享组件 LabEffectCard.vue

创建文件 `src/components/lab/LabEffectCard.vue`：

```vue
<script setup lang="ts">
import type { LabEffect } from '@/config/labRegistry'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Props {
  effect: LabEffect
}
defineProps<Props>()

const goToEffect = () => {
  router.push(`/lab/${props.effect.id}`)
}

const categoryLabels: Record<string, string> = {
  background: '背景',
  card: '卡片',
  button: '按钮',
  text: '文字',
  animation: '动画',
  layout: '布局',
  data: '数据',
}

// 从效果 tag 提取主色作为缩略图背景
const accentColor = '#2563EB'
</script>

<template>
  <div class="lab-effect-card" @click="goToEffect" tabindex="0" role="link"
       @keydown.enter="goToEffect" @keydown.space.prevent="goToEffect">
    <div class="lab-effect-card-preview" :style="{ background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}30)` }">
      <span class="lab-effect-card-icon">&#x2B1B;</span>
    </div>
    <div class="lab-effect-card-body">
      <h3 class="lab-effect-card-title">{{ effect.name }}</h3>
      <p class="lab-effect-card-desc">{{ effect.description }}</p>
      <div class="lab-effect-card-tags">
        <span class="lab-effect-card-category">{{ categoryLabels[effect.category] }}</span>
        <span v-for="tag in effect.tags.slice(0, 3)" :key="tag" class="lab-effect-card-tag">{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lab-effect-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.lab-effect-card:hover {
  border-color: #2563EB;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
}
.lab-effect-card-preview {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lab-effect-card-icon {
  font-size: 32px;
  opacity: 0.3;
}
.lab-effect-card-body {
  padding: 16px;
}
.lab-effect-card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px;
}
.lab-effect-card-desc {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 12px;
  line-height: 1.5;
}
.lab-effect-card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.lab-effect-card-category {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: #2563EB;
  color: white;
  font-weight: 500;
}
.lab-effect-card-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: #f1f5f9;
  color: #64748b;
}
</style>
```

### 验证

```bash
npm run lint
```

---

## Task 1.4 — 创建共享组件 LabParamPanel.vue

创建文件 `src/components/lab/LabParamPanel.vue`：

```vue
<script setup lang="ts">
import type { LabParam } from '@/config/labRegistry'

interface Props {
  params: LabParam[]
  modelValue: Record<string, string | number>
}
const emit = defineEmits<{
  'update:modelValue': [value: Record<string, string | number>]
}>()

const updateParam = (key: string, value: string | number) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

const resetToDefaults = () => {
  const defaults: Record<string, string | number> = {}
  props.params.forEach(p => {
    defaults[p.key] = p.defaultValue
  })
  emit('update:modelValue', defaults)
}

const hasDefaults = (): boolean => {
  return props.params.some(p => props.modelValue[p.key] !== p.defaultValue)
}
</script>

<template>
  <div class="lab-param-panel">
    <div class="lab-param-panel-header">
      <h3 class="lab-param-panel-title">参数调节</h3>
      <button v-if="hasDefaults()" class="lab-param-reset" @click="resetToDefaults" type="button">
        重置默认值
      </button>
    </div>
    <div class="lab-param-panel-body">
      <div v-for="param in params" :key="param.key" class="lab-param-row">
        <label class="lab-param-label">{{ param.label }}</label>
        <div class="lab-param-control">
          <input
            v-if="param.type === 'range'"
            type="range"
            :min="param.min"
            :max="param.max"
            :step="param.step"
            :value="modelValue[param.key] ?? param.defaultValue"
            @input="updateParam(param.key, ($event.target as HTMLInputElement).valueAsNumber)"
            class="lab-param-range"
          />
          <input
            v-else-if="param.type === 'color'"
            type="color"
            :value="(modelValue[param.key] ?? param.defaultValue) as string"
            @input="updateParam(param.key, ($event.target as HTMLInputElement).value)"
            class="lab-param-color"
          />
          <select
            v-else-if="param.type === 'select'"
            :value="modelValue[param.key] ?? param.defaultValue"
            @change="updateParam(param.key, ($event.target as HTMLSelectElement).value)"
            class="lab-param-select"
          >
            <option v-for="opt in param.options" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
          <span class="lab-param-value">{{ modelValue[param.key] ?? param.defaultValue }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lab-param-panel {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  margin-top: 24px;
}
.lab-param-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.lab-param-panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}
.lab-param-reset {
  font-size: 13px;
  color: #2563EB;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}
.lab-param-reset:hover {
  background: #eff6ff;
}
.lab-param-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 0;
}
.lab-param-label {
  font-size: 14px;
  color: #475569;
  min-width: 80px;
}
.lab-param-control {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}
.lab-param-range {
  flex: 1;
  height: 4px;
  accent-color: #2563EB;
}
.lab-param-value {
  font-size: 14px;
  color: #2563EB;
  font-weight: 500;
  min-width: 40px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.lab-param-color {
  width: 40px;
  height: 28px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  cursor: pointer;
  padding: 2px;
}
.lab-param-select {
  padding: 4px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  color: #1e293b;
  background: white;
  cursor: pointer;
}
</style>
```

### 验证

```bash
npm run lint
```

---

## Task 1.4 — 添加路由（修改 src/router/index.ts）

在 routes 数组中，About 路由之后、`/:pathMatch(.*)*` 之前，插入以下两条路由：

```ts
{
  path: '/lab',
  name: 'Lab',
  component: () => import('@/views/Lab/LabIndex.vue'),
  meta: {
    title: '效果实验室',
    description: '交互式前端效果演示 — Aurora、Spotlight、Marquee 等 20+ 效果'
  }
},
{
  path: '/lab/:id',
  name: 'LabDemo',
  component: () => import('@/views/Lab/LabLayout.vue'),
  props: true,
  meta: {
    title: '效果演示',
    description: '交互式前端效果演示'
  }
}
```

**精确插入位置**：在 `/:pathMatch(.*)*` 之前。只插入这两条，不动其他路由。

### 验证

```bash
npm run lint
npm run build
```

---

## Task 1.5 — 更新导航栏（修改 src/components/common/Header.vue）

### 修改 1：添加 /lab 导航链接

在第 157-161 行的 `navItems` 数组中，在 `{ name: '博客', path: '/blog' }` 之后添加：

```ts
{ name: '效果实验室', path: '/lab' },
```

### 修改 2：修复 isActiveRoute

替换第 165-167 行的 `isActiveRoute` 函数：

```ts
const isActiveRoute = (path: string) => {
  if (route.path === path) return true
  if (path === '/') return false
  return route.path.startsWith(path + '/') || route.path.startsWith(path + '?')
}
```

**只改这 5 行，不动其他任何代码。**

### 验证

```bash
npm run lint
npm run build
```

浏览器验证：
1. 访问 `/` — 导航栏显示"效果实验室"链接
2. 访问 `/lab` — "效果实验室"高亮
3. 访问 `/lab/aurora` — "效果实验室"高亮，其他链接不高亮
4. 访问 `/blog` — "效果实验室"不高亮

---

## Task 1.6 — 实现搜索筛选（修改 src/views/Lab/LabIndex.vue）

将 LabIndex.vue 替换为完整实现：

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { labRegistry } from '@/config/labRegistry'
import LabEffectCard from '@/components/lab/LabEffectCard.vue'

const searchQuery = ref('')
const selectedCategory = ref<string | null>(null)

const categories = ['background', 'card', 'button', 'text', 'animation', 'layout', 'data']

const categoryLabels: Record<string, string> = {
  background: '背景',
  card: '卡片',
  button: '按钮',
  text: '文字',
  animation: '动画',
  layout: '布局',
  data: '数据',
}

const filteredEffects = computed(() => {
  return labRegistry.filter(effect => {
    const matchesSearch = !searchQuery.value ||
      effect.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      effect.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      effect.tags.some(t => t.toLowerCase().includes(searchQuery.value.toLowerCase()))

    const matchesCategory = !selectedCategory.value || effect.category === selectedCategory.value

    return matchesSearch && matchesCategory
  })
})

const clearSearch = () => {
  searchQuery.value = ''
  selectedCategory.value = null
}
</script>

<template>
  <div class="lab-index">
    <div class="lab-index-header">
      <h1 class="lab-index-title">效果实验室</h1>
      <p class="lab-index-subtitle">交互式前端效果演示 — 点击卡片实时体验，调节参数理解原理</p>
      <div class="lab-index-search">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索效果..."
          class="lab-search-input"
        />
        <button v-if="searchQuery" class="lab-search-clear" @click="clearSearch" type="button">
          ✕
        </button>
      </div>
      <div class="lab-index-categories">
        <button
          v-for="cat in categories"
          :key="cat"
          class="lab-category-btn"
          :class="{ active: selectedCategory === cat }"
          @click="selectedCategory = selectedCategory === cat ? null : cat"
        >
          {{ categoryLabels[cat] }}
        </button>
      </div>
    </div>

    <div v-if="filteredEffects.length" class="lab-index-grid">
      <LabEffectCard v-for="effect in filteredEffects" :key="effect.id" :effect="effect" />
    </div>

    <div v-else class="lab-index-empty">
      <p>没有找到匹配的效果</p>
      <button class="lab-empty-clear" @click="clearSearch" type="button">清空搜索</button>
    </div>
  </div>
</template>

<style scoped>
.lab-index {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px;
}
.lab-index-header {
  margin-bottom: 32px;
}
.lab-index-title {
  font-size: 30px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px;
}
.lab-index-subtitle {
  font-size: 16px;
  color: #64748b;
  margin: 0 0 24px;
}
.lab-index-search {
  position: relative;
  margin-bottom: 16px;
}
.lab-search-input {
  width: 100%;
  max-width: 400px;
  padding: 10px 36px 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #1e293b;
  outline: none;
  box-sizing: border-box;
}
.lab-search-input:focus {
  border-color: #2563EB;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
.lab-search-clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
}
.lab-index-categories {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.lab-category-btn {
  padding: 6px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  color: #64748b;
  background: white;
  cursor: pointer;
  transition: all 0.15s;
}
.lab-category-btn:hover {
  border-color: #2563EB;
  color: #2563EB;
}
.lab-category-btn.active {
  background: #2563EB;
  color: white;
  border-color: #2563EB;
}
.lab-index-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
.lab-index-empty {
  text-align: center;
  padding: 60px 24px;
  color: #94a3b8;
}
.lab-index-empty p {
  font-size: 16px;
  margin: 0 0 16px;
}
.lab-empty-clear {
  padding: 8px 20px;
  border: 1px solid #2563EB;
  border-radius: 6px;
  color: #2563EB;
  background: white;
  cursor: pointer;
  font-size: 14px;
}
.lab-empty-clear:hover {
  background: #eff6ff;
}
</style>
```

### 验证

```bash
npm run lint
npm run build
```

浏览器验证：
1. `/lab` — 看到标题、搜索框、分类标签、12 个卡片
2. 搜索框输入"流星" — 只显示流星效果卡片
3. 点击"背景"分类 — 只显示 background 分类的效果
4. 搜索无结果 — 看到"没有找到匹配的效果" + 清空按钮

---

## Task 1.7 — 创建构建校验脚本

创建文件 `scripts/validateLabRegistry.ts`：

```ts
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Phase 1 模式：只校验格式
const PHASE1_MODE = process.argv.includes('--phase1')

interface LabEffect {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  component: () => Promise<{ default: unknown }>
  code: string
  language: string
  params?: { key: string; type: string; defaultValue: string | number }[]
}

function validateRegistry(registry: LabEffect[]): string[] {
  const errors: string[] = []

  registry.forEach((effect, index) => {
    const prefix = `[${index}] ${effect.id || 'unnamed'}`

    // id 格式
    if (!effect.id || !/^[a-z]+(-[a-z]+)*$/.test(effect.id)) {
      errors.push(`${prefix}: id 必须是小写字母+连字符`)
    }

    // description 长度
    if (!effect.description || effect.description.length > 100) {
      errors.push(`${prefix}: description 必须 ≤ 100 字符（当前 ${effect.description?.length || 0}）`)
    }

    // language
    const validLanguages = ['vue', 'css', 'html']
    if (!validLanguages.includes(effect.language)) {
      errors.push(`${prefix}: language 必须是 vue/css/html 之一`)
    }

    // params key 唯一性
    if (effect.params) {
      const keys = effect.params.map(p => p.key)
      const uniqueKeys = new Set(keys)
      if (keys.length !== uniqueKeys.size) {
        errors.push(`${prefix}: params key 有重复`)
      }
    }

    // Phase 2+ 校验：文件存在
    if (!PHASE1_MODE) {
      const demoPath = path.join(__dirname, '..', 'src', 'views', 'Lab', 'demos', `${effect.id}Demo.vue`)
      if (!fs.existsSync(demoPath)) {
        errors.push(`${prefix}: 对应的 demo 文件不存在 — ${demoPath}`)
      }
    }
  })

  return errors
}

// 动态导入注册表（通过构建时注入或直接读取源码）
const registryPath = path.join(__dirname, '..', 'src', 'config', 'labRegistry.ts')
const registryContent = fs.readFileSync(registryPath, 'utf-8')

// 简单校验：检查文件包含必要字段
const hasInterface = registryContent.includes('export interface LabEffect')
const hasRegistry = registryContent.includes('export const labRegistry')
const hasIds = (registryContent.match(/id: '/g) || []).length

if (!hasInterface) errors.push('缺少 LabEffect 接口定义')
if (!hasRegistry) errors.push('缺少 labRegistry 导出')
if (hasIds < 12) errors.push(`注册表 entry 数量不足：期望 12，实际 ${hasIds}`)

// 检查旧 accent 色值（Lab 中不应出现）
const legacyColors = ['#7B4EED', '#F03880', '#0052FF']
const labFiles = ['src/views/Lab/', 'src/components/lab/', 'src/config/labRegistry.ts']
labFiles.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir)
  if (fs.existsSync(fullPath)) {
    const files = fs.readdirSync(fullPath, { recursive: true }) as string[]
    files.forEach(file => {
      const content = fs.readFileSync(path.join(fullPath, file), 'utf-8')
      legacyColors.forEach(color => {
        if (content.includes(color)) {
          errors.push(`${dir}${file}: 包含已废弃的 accent 色 ${color}`)
        }
      })
    })
  }
})

// 检查是否创建了 LabCodeBlock.vue（禁止）
const codeblockPath = path.join(__dirname, '..', 'src', 'components', 'lab', 'LabCodeBlock.vue')
if (fs.existsSync(codeblockPath)) {
  errors.push('发现 LabCodeBlock.vue — 应复用 CodeBlock.vue，此文件必须删除')
}

if (errors.length > 0) {
  console.error('❌ 注册表校验失败：')
  errors.forEach(e => console.error(`  - ${e}`))
  process.exit(1)
} else {
  console.log('✅ 注册表校验通过')
  process.exit(0)
}
```

### 修改 package.json

在 `scripts` 中添加：

```json
"validate:lab": "npm run lint && npm run build && npm run test -- tests/unit/lab/ && node scripts/validateLabRegistry.ts"
```

### 验证

```bash
npm run validate:lab
```

---

## 完成检查清单

Phase 1 完成后，逐项确认：

- [ ] `src/views/Lab/LabIndex.vue` 存在且内容正确
- [ ] `src/views/Lab/LabLayout.vue` 存在且内容正确
- [ ] `src/views/Lab/LabNotFound.vue` 存在且内容正确
- [ ] `src/views/Lab/demos/` 目录存在（空）
- [ ] `src/config/labRegistry.ts` 存在且包含 12 个 entry
- [ ] `src/components/lab/LabEffectCard.vue` 存在
- [ ] `src/components/lab/LabParamPanel.vue` 存在
- [ ] 路由 `/lab` 和 `/lab/:id` 已添加
- [ ] Header.vue 已添加 `/lab` 导航链接
- [ ] Header.vue isActiveRoute 已修复
- [ ] `scripts/validateLabRegistry.ts` 存在
- [ ] `npm run validate:lab` 全部通过
- [ ] 浏览器访问 `/lab` 能看到标题 + 搜索框 + 分类标签 + 12 个卡片
- [ ] 浏览器访问 `/lab/nonexistent` 看到 404
- [ ] 浏览器访问 `/lab/aurora` 看到"效果不存在"（注册表已存在，应看到 demo 加载区域）
- [ ] 导航栏 `/lab` 链接可点击、高亮正常

**全部通过后，回报海鸥审核。海鸥确认后再进入 Phase 2。**
