# Stores API 参考

本文档提供了 MyPersonalWebsite 项目中所有 Pinia Store 的详细 API 参考。

## 概述

本项目使用 Pinia 作为状态管理库，将应用状态组织为多个独立的 Store，每个 Store 负责管理特定的业务逻辑。

## 可用的 Stores

### useAppStore

应用全局状态 Store，管理主题、语言、加载状态等全局配置。

**导入**
```typescript
import { useAppStore } from '@/stores/useAppStore'
```

**使用示例**
```typescript
const appStore = useAppStore()

// 访问状态
console.log(appStore.isDarkMode)
console.log(appStore.isLoading)

// 调用操作
appStore.toggleTheme()
appStore.setLoading(true)
appStore.setLanguage('zh-CN')
```

**State**
```typescript
interface AppState {
  // 主题
  isDarkMode: boolean
  
  // 语言
  language: string
  
  // 加载状态
  isLoading: boolean
  
  // 错误信息
  error: string | null
  
  // 通知消息
  notifications: Notification[]
}
```

**Getters**
```typescript
interface AppGetters {
  // 当前主题类名
  themeClass: string
  
  // 是否有错误
  hasError: boolean
  
  // 未读通知数量
  unreadNotificationCount: number
}
```

**Actions**
```typescript
interface AppActions {
  // 切换主题
  toggleTheme(): void
  
  // 设置主题
  setTheme(isDark: boolean): void
  
  // 设置语言
  setLanguage(lang: string): void
  
  // 设置加载状态
  setLoading(loading: boolean): void
  
  // 设置错误
  setError(error: string | null): void
  
  // 添加通知
  addNotification(notification: Notification): void
  
  // 移除通知
  removeNotification(id: string): void
  
  // 清除所有通知
  clearNotifications(): void
}
```

---

### useProjectStore

项目状态 Store，管理项目数据的获取、缓存和搜索。

**导入**
```typescript
import { useProjectStore } from '@/stores/useProjectStore'
```

**使用示例**
```typescript
const projectStore = useProjectStore()

// 获取所有项目
await projectStore.fetchProjects()

// 获取单个项目
const project = projectStore.getProjectById('1')

// 搜索项目
const results = projectStore.searchProjects('Vue')
```

**State**
```typescript
interface ProjectState {
  // 项目列表
  projects: Project[]
  
  // 当前项目
  currentProject: Project | null
  
  // 加载状态
  isLoading: boolean
  
  // 错误信息
  error: string | null
  
  // 缓存时间
  lastFetchTime: number | null
}
```

**Getters**
```typescript
interface ProjectGetters {
  // 精选项目
  featuredProjects: Project[]
  
  // 项目数量
  projectCount: number
  
  // 按技术栈分组
  projectsByTech: Record<string, Project[]>
  
  // 是否已缓存
  isCached: boolean
}
```

**Actions**
```typescript
interface ProjectActions {
  // 获取所有项目
  fetchProjects(): Promise<void>
  
  // 获取单个项目
  fetchProjectById(id: string): Promise<Project>
  
  // 获取精选项目
  fetchFeaturedProjects(): Promise<void>
  
  // 搜索项目
  searchProjects(query: string): Project[]
  
  // 按技术栈过滤
  filterByTech(tech: string): Project[]
  
  // 设置当前项目
  setCurrentProject(project: Project): void
  
  // 清除缓存
  clearCache(): void
}
```

---

### useBlogStore

博客状态 Store，管理文章数据的获取、分类和搜索。

**导入**
```typescript
import { useBlogStore } from '@/stores/useBlogStore'
```

**使用示例**
```typescript
const blogStore = useBlogStore()

// 获取所有文章
await blogStore.fetchPosts()

// 获取单篇文章
const post = await blogStore.fetchPostById('1')

// 按分类获取
const posts = await blogStore.fetchPostsByCategory('Vue')
```

**State**
```typescript
interface BlogState {
  // 文章列表
  posts: BlogPost[]
  
  // 当前文章
  currentPost: BlogPost | null
  
  // 分类列表
  categories: Category[]
  
  // 加载状态
  isLoading: boolean
  
  // 错误信息
  error: string | null
}
```

**Getters**
```typescript
interface BlogGetters {
  // 最新文章
  latestPosts: BlogPost[]
  
  // 热门文章
  popularPosts: BlogPost[]
  
  // 文章数量
  postCount: number
  
  // 按年份分组
  postsByYear: Record<number, BlogPost[]>
}
```

**Actions**
```typescript
interface BlogActions {
  // 获取所有文章
  fetchPosts(): Promise<void>
  
  // 获取单篇文章
  fetchPostById(id: string): Promise<BlogPost>
  
  // 按分类获取
  fetchPostsByCategory(category: string): Promise<BlogPost[]>
  
  // 搜索文章
  searchPosts(query: string): BlogPost[]
  
  // 按标签搜索
  searchByTag(tag: string): BlogPost[]
  
  // 设置当前文章
  setCurrentPost(post: BlogPost): void
}
```

---

### useSkillStore

技能状态 Store，管理技能数据的展示和分类。

**导入**
```typescript
import { useSkillStore } from '@/stores/useSkillStore'
```

**使用示例**
```typescript
const skillStore = useSkillStore()

// 获取所有技能
await skillStore.fetchSkills()

// 按分类获取
const frontendSkills = skillStore.getSkillsByCategory('frontend')

// 获取技能熟练度
const proficiency = skillStore.getSkillProficiency('Vue')
```

**State**
```typescript
interface SkillState {
  // 技能列表
  skills: Skill[]
  
  // 分类列表
  categories: string[]
  
  // 加载状态
  isLoading: boolean
}
```

**Getters**
```typescript
interface SkillGetters {
  // 按分类分组
  skillsByCategory: Record<string, Skill[]>
  
  // 技能数量
  skillCount: number
  
  // 精通技能
  expertSkills: Skill[]
  
  // 熟练技能
  proficientSkills: Skill[]
}
```

**Actions**
```typescript
interface SkillActions {
  // 获取所有技能
  fetchSkills(): Promise<void>
  
  // 按分类获取
  getSkillsByCategory(category: string): Skill[]
  
  // 获取技能熟练度
  getSkillProficiency(skillName: string): number
  
  // 搜索技能
  searchSkills(query: string): Skill[]
}
```

---

### useSearchStore

搜索状态 Store，管理全局搜索功能。

**导入**
```typescript
import { useSearchStore } from '@/stores/useSearchStore'
```

**使用示例**
```typescript
const searchStore = useSearchStore()

// 执行搜索
await searchStore.search('Vue')

// 获取搜索结果
const results = searchStore.results

// 清除搜索
searchStore.clearSearch()
```

**State**
```typescript
interface SearchState {
  // 搜索查询
  query: string
  
  // 搜索结果
  results: SearchResult[]
  
  // 搜索历史
  history: string[]
  
  // 加载状态
  isLoading: boolean
  
  // 搜索类型
  searchType: 'all' | 'projects' | 'blog' | 'skills'
}
```

**Actions**
```typescript
interface SearchActions {
  // 执行搜索
  search(query: string): Promise<void>
  
  // 设置搜索类型
  setSearchType(type: 'all' | 'projects' | 'blog' | 'skills'): void
  
  // 添加到历史
  addToHistory(query: string): void
  
  // 清除历史
  clearHistory(): void
  
  // 清除搜索
  clearSearch(): void
}
```

## Store 持久化

所有 Store 都使用 `pinia-plugin-persistedstate` 进行持久化，配置如下：

```typescript
export const useAppStore = defineStore('app', {
  state: () => ({ ... }),
  persist: {
    key: 'my-personal-website-app',
    storage: localStorage,
    paths: ['isDarkMode', 'language']
  }
})
```

## 最佳实践

1. **在组件中使用 Store**
```typescript
import { useAppStore } from '@/stores/useAppStore'

export default {
  setup() {
    const appStore = useAppStore()
    return { appStore }
  }
}
```

2. **在组件外使用 Store**
```typescript
import { useAppStore } from '@/stores/useAppStore'

const appStore = useAppStore()
appStore.toggleTheme()
```

3. **TypeScript 支持**
```typescript
interface AppState {
  isDarkMode: boolean
  // ...
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({ ... })
})
```

## 相关资源

- [Pinia 官方文档](https://pinia.vuejs.org/)
- [Pinia 持久化插件](https://prazdevs.github.io/pinia-plugin-persistedstate/)
- [Vue 3 状态管理](https://vuejs.org/guide/scaling-up/state-management.html)