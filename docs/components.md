# MyPersonalWebsite 组件库

## 📦 组件库概述

MyPersonalWebsite 的组件库基于 Vue 3 Composition API 构建，采用原子设计原则，提供可复用、可维护的组件系统。

## 🎯 组件分类

### 📋 基础组件 (Atoms)

#### 1. 按钮 (Button)
```vue
<template>
  <Button 
    variant="primary" 
    size="medium"
    @click="handleClick"
  >
    点击我
  </Button>
</template>

<script setup>
import Button from '@/components/common/Button.vue'
</script>
```

**Props:**
- `variant`: primary | secondary | text | ghost
- `size`: small | medium | large
- `disabled`: boolean
- `loading`: boolean

**Events:**
- `click`

#### 2. 输入框 (Input)
```vue
<Input 
  v-model="value"
  placeholder="请输入内容"
  @change="handleChange"
/>
```

**Props:**
- `modelValue`: string
- `placeholder`: string
- `type`: text | password | email | number
- `disabled`: boolean

**Events:**
- `update:modelValue`
- `change`

#### 3. 卡片 (Card)
```vue
<Card>
  <template #header>
    <h3>卡片标题</h3>
  </template>
  <p>卡片内容</p>
</Card>
```

**Props:**
- `elevation`: 0 | 1 | 2 | 3
- `rounded`: boolean

### 🏗️ 布局组件 (Molecules)

#### 1. 网格布局 (Grid)
```vue
<Grid>
  <GridItem :span="6">
    <div>列 1</div>
  </GridItem>
  <GridItem :span="6">
    <div>列 2</div>
  </GridItem>
</Grid>
```

**Props:**
- `gutter`: number
- `columns`: 12 | 24

#### 2. 标签页 (Tabs)
```vue
<Tabs>
  <TabItem label="标签 1">
    <div>内容 1</div>
  </TabItem>
  <TabItem label="标签 2">
    <div>内容 2</div>
  </TabItem>
</Tabs>
```

**Props:**
- `activeTab`: string
- `type`: line | card | border-card

### 🎨 业务组件 (Organisms)

#### 1. 项目卡片 (ProjectCard)
```vue
<ProjectCard
  :title="project.title"
  :description="project.description"
  :tags="project.tags"
  :image="project.image"
  @click="handleProjectClick"
/>
```

**Props:**
- `title`: string
- `description`: string
- `tags`: string[]
- `image`: string
- `href`: string

#### 2. 技能标签 (SkillTag)
```vue
<SkillTag 
  :name="skill.name"
  :level="skill.level"
  :icon="skill.icon"
/>
```

**Props:**
- `name`: string
- `level`: 1-5
- `icon`: string

#### 3. 文章卡片 (ArticleCard)
```vue
<ArticleCard
  :title="article.title"
  :excerpt="article.excerpt"
  :date="article.date"
  :author="article.author"
  :tags="article.tags"
  @click="handleArticleClick"
/>
```

**Props:**
- `title`: string
- `excerpt`: string
- `date`: string
- `author`: string
- `tags`: string[]

### 🖥️ 页面组件 (Templates)

#### 1. 首页 (Home)
```vue
<Home>
  <HeroSection />
  <FeaturedProjects />
  <TechStack />
  <CTASection />
</Home>
```

#### 2. 项目详情页 (ProjectDetail)
```vue
<ProjectDetail :project="project">
  <ProjectContent />
  <ProjectGallery />
  <ProjectLinks />
</ProjectDetail>
```

## 🎨 组件设计原则

### 1. 一致性
- 统一的视觉风格
- 一致的交互模式
- 标准化的 API 设计

### 2. 可复用性
- 高度抽象的组件设计
- 灵活的 props 配置
- 丰富的插槽支持

### 3. 可访问性
- 完整的键盘导航支持
- 语义化的 HTML 结构
- 适当的焦点管理

### 4. 性能优化
- 虚拟滚动支持
- 图片懒加载
- 代码分割优化

## 📝 组件开发规范

### 1. 文件结构
```
components/
├── common/
│   ├── Button.vue
│   ├── Input.vue
│   └── Card.vue
├── home/
│   ├── HeroSection.vue
│   └── FeaturedProjects.vue
└── projects/
    ├── ProjectCard.vue
    └── ProjectDetail.vue
```

### 2. 组件命名
- 使用 PascalCase 命名
- 包含业务含义
- 避免缩写

### 3. Props 规范
- 使用 TypeScript 接口定义
- 提供默认值
- 添加类型检查

### 4. 事件规范
- 使用 camelCase 命名
- 提供详细的事件文档
- 考虑事件参数

### 5. 插槽规范
- 使用具名插槽
- 提供默认内容
- 文档化插槽用途

## 🧪 测试规范

### 1. 单元测试
- 使用 Vitest 进行单元测试
- 覆盖核心逻辑
- 测试边界情况

### 2. 组件测试
- 使用 Vue Test Utils
- 测试交互行为
- 验证 DOM 结构

### 3. E2E 测试
- 使用 Playwright
- 测试用户流程
- 验证功能完整性

## 📊 组件统计

| 组件类型 | 数量 | 状态 |
|---------|------|------|
| 基础组件 | 15 | ✅ 完成 |
| 布局组件 | 8 | ✅ 完成 |
| 业务组件 | 25 | ✅ 完成 |
| 页面组件 | 12 | ✅ 完成 |
| 总计 | 60+ | ✅ 完成 |

## 🔧 组件更新日志

### v1.0.0 (2026-01-24)
- ✅ 建立基础组件库
- ✅ 完善组件设计规范
- ✅ 添加组件测试用例
- ✅ 建立组件文档体系
- ✅ 优化组件性能

---

**组件库维护**: 由 BMAD 开发者团队负责维护和更新