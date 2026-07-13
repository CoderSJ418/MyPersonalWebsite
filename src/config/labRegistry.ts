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
