# 页面组件文档

本文档提供了 MyPersonalWebsite 项目中所有页面级组件的使用文档。

## 概述

页面组件是构成应用主要页面的组件，包括首页、关于页、项目页、博客页等。

## 组件列表

### Home 组件

首页组件，展示个人介绍、技能、精选项目和联系方式。

**路径**: `src/views/Home.vue`

**使用示例**
```vue
<template>
  <Home />
</template>

<script setup lang="ts">
import Home from '@/views/Home.vue'
</script>
```

**子组件**
- `HeroSection` - 英雄区域
- `SkillsSection` - 技能展示
- `ProjectsSection` - 精选项目
- `ContactSection` - 联系方式

**特性**
- 响应式设计
- 滚动动画
- 暗黑模式支持
- SEO 优化

---

### About 组件

关于页面组件，展示个人简介、经历和技能。

**路径**: `src/views/About.vue`

**使用示例**
```vue
<template>
  <About />
</template>

<script setup lang="ts">
import About from '@/views/About.vue'
</script>
```

**子组件**
- `ProfileSection` - 个人资料
- `ExperienceSection` - 工作经历
- `EducationSection` - 教育背景
- `SkillsSection` - 技能详情

**特性**
- 时间线展示
- 技能可视化
- 响应式布局

---

### Projects 组件

项目展示页面组件，展示所有项目。

**路径**: `src/views/Projects.vue`

**使用示例**
```vue
<template>
  <Projects />
</template>

<script setup lang="ts">
import Projects from '@/views/Projects.vue'
</script>
```

**子组件**
- `ProjectFilter` - 项目筛选器
- `ProjectList` - 项目列表
- `ProjectCard` - 项目卡片
- `ProjectModal` - 项目详情模态框

**Props**
```typescript
interface ProjectsProps {
  // 初始筛选条件
  initialFilter?: string
  
  // 排序方式
  sortBy?: 'date' | 'name' | 'featured'
}
```

**特性**
- 项目筛选和搜索
- 响应式网格布局
- 项目详情预览
- 技术栈标签

---

### ProjectDetail 组件

项目详情页面组件，展示单个项目的详细信息。

**路径**: `src/views/ProjectDetail.vue`

**使用示例**
```vue
<template>
  <ProjectDetail :project-id="projectId" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProjectDetail from '@/views/ProjectDetail.vue'

const projectId = ref('1')
</script>
```

**Props**
```typescript
interface ProjectDetailProps {
  // 项目 ID
  projectId: string
}
```

**子组件**
- `ProjectHeader` - 项目头部
- `ProjectGallery` - 项目图片库
- `ProjectTechStack` - 技术栈
- `ProjectLinks` - 项目链接
- `RelatedProjects` - 相关项目

**特性**
- 项目图片轮播
- 技术栈展示
- 相关项目推荐
- 返回列表按钮

---

### Blog 组件

博客列表页面组件，展示所有博客文章。

**路径**: `src/views/Blog.vue`

**使用示例**
```vue
<template>
  <Blog />
</template>

<script setup lang="ts">
import Blog from '@/views/Blog.vue'
</script>
```

**子组件**
- `BlogFilter` - 文章筛选器
- `BlogList` - 文章列表
- `BlogCard` - 文章卡片
- `BlogPagination` - 分页组件

**Props**
```typescript
interface BlogProps {
  // 分类
  category?: string
  
  // 标签
  tag?: string
  
  // 每页数量
  perPage?: number
}
```

**特性**
- 文章分类和标签
- 搜索功能
- 分页导航
- 阅读时间估算

---

### BlogDetail 组件

博客详情页面组件，展示单篇文章的完整内容。

**路径**: `src/views/BlogDetail.vue`

**使用示例**
```vue
<template>
  <BlogDetail :post-id="postId" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BlogDetail from '@/views/BlogDetail.vue'

const postId = ref('1')
</script>
```

**Props**
```typescript
interface BlogDetailProps {
  // 文章 ID
  postId: string
}
```

**子组件**
- `BlogHeader` - 文章头部
- `BlogContent` - 文章内容
- `BlogMeta` - 文章元数据
- `BlogComments` - 评论区
- `RelatedPosts` - 相关文章

**特性**
- Markdown 渲染
- 代码高亮
- 目录导航
- 阅读进度条
- 字体大小调整

---

### Contact 组件

联系页面组件，展示联系方式和联系表单。

**路径**: `src/views/Contact.vue`

**使用示例**
```vue
<template>
  <Contact />
</template>

<script setup lang="ts">
import Contact from '@/views/Contact.vue'
</script>
```

**子组件**
- `ContactInfo` - 联系信息
- `ContactForm` - 联系表单
- `SocialLinks` - 社交媒体链接
- `MapSection` - 地图展示

**特性**
- 表单验证
- 社交媒体链接
- 地图集成
- 响应式布局

---

### Skills 组件

技能展示页面组件，展示所有技能和熟练度。

**路径**: `src/views/Skills.vue`

**使用示例**
```vue
<template>
  <Skills />
</template>

<script setup lang="ts">
import Skills from '@/views/Skills.vue'
</script>
```

**子组件**
- `SkillsOverview` - 技能概览
- `SkillsByCategory` - 按分类展示
- `SkillProgressBar` - 技能进度条
- `SkillsTimeline` - 技能学习时间线

**特性**
- 技能分类展示
- 熟练度可视化
- 技能搜索
- 响应式布局

---

### NotFound 组件

404 页面组件，显示页面未找到信息。

**路径**: `src/views/NotFound.vue`

**使用示例**
```vue
<template>
  <NotFound />
</template>

<script setup lang="ts">
import NotFound from '@/views/NotFound.vue'
</script>
```

**Props**
```typescript
interface NotFoundProps {
  // 错误消息
  message?: string
  
  // 返回链接
  returnLink?: string
}
```

**特性**
- 友好的错误提示
- 返回首页按钮
- 动画效果

## 最佳实践

1. **页面级组件应该专注于路由和布局**
```vue
<template>
  <div class="page">
    <PageHeader />
    <main class="page-content">
      <RouterView />
    </main>
    <PageFooter />
  </div>
</template>
```

2. **使用路由参数**
```typescript
import { useRoute } from 'vue-router'

const route = useRoute()
const projectId = route.params.id as string
```

3. **页面元数据**
```typescript
import { useHead } from '@vueuse/head'

useHead({
  title: 'My Projects',
  meta: [
    { name: 'description', content: 'My portfolio projects' }
  ]
})
```

4. **加载状态处理**
```vue
<template>
  <Loading v-if="isLoading" />
  <div v-else>
    <!-- 页面内容 -->
  </div>
</template>
```

## 相关资源

- [Vue Router](https://router.vuejs.org/)
- [Vue 3 页面组件](https://vuejs.org/guide/essentials/component-basics.html)
- [VueUse Head](https://vueuse.org/core/usehead/)