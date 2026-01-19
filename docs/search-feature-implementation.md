# 全局搜索功能实现文档

## 概述

已成功为MyPersonalWebsite项目实现完整的全局搜索功能，支持搜索项目、技能、博客等内容。

## 实现文件清单

### 1. 类型定义
- **文件**: `src/types/search.ts`
- **内容**: 搜索相关的TypeScript类型定义
  - `SearchResultItem`: 搜索结果项类型
  - `SearchResults`: 搜索结果集合类型
  - `SearchHistoryItem`: 搜索历史项类型
  - `SearchState`: 搜索状态类型

### 2. 搜索工具函数
- **文件**: `src/utils/search.ts`
- **功能**:
  - `debounce()`: 防抖函数（300ms）
  - `highlightText()`: 高亮匹配关键词（黄色背景）
  - `calculateRelevanceScore()`: 计算搜索相关性分数
  - `searchProjects()`: 搜索项目
  - `searchSkills()`: 搜索技能
  - `searchBlogs()`: 搜索博客
  - `globalSearch()`: 全局搜索主函数
  - `getSearchResultsTotal()`: 获取搜索结果总数
  - `flattenSearchResults()`: 扁平化搜索结果（用于键盘导航）

### 3. 搜索状态管理
- **文件**: `src/stores/useSearchStore.ts`
- **功能**:
  - 搜索状态管理（isOpen, query, results, history, selectedIndex, loading）
  - 搜索历史管理（localStorage持久化，最多保存5条）
  - 搜索结果缓存
  - 防抖搜索
  - 键盘导航（上下箭头选择结果）

### 4. 搜索模态框组件
- **文件**: `src/components/common/SearchModal.vue`
- **UI特性**:
  - 全屏遮罩层（带模糊效果）
  - 搜索输入框（带图标和占位符）
  - 实时搜索结果展示（分类显示）
  - 搜索历史显示（可清除）
  - 结果高亮显示（黄色背景）
  - 键盘快捷键提示
  - 响应式设计（支持移动端）
  - 平滑动画效果（淡入淡出）

### 5. Header组件修改
- **文件**: `src/components/common/Header.vue`
- **修改内容**:
  - 添加搜索按钮（桌面端和移动端）
  - 集成SearchModal组件
  - 添加全局快捷键监听（Ctrl+K / Cmd+K）
  - 显示快捷键提示（⌘K）

### 6. Skills页面修改
- **文件**: `src/views/Skills.vue`
- **修改内容**:
  - 为每个技能添加id属性
  - 支持锚点跳转（`/skills#${skill.id}`）

### 7. Store导出
- **文件**: `src/stores/index.ts`
- **修改内容**:
  - 添加`useSearchStore`导出

## 功能特性

### 1. 全局搜索框
- ✅ 位置：Header组件右上角
- ✅ 快捷键：Ctrl+K / Cmd+K
- ✅ 占位符："搜索项目、技能、博客..."

### 2. 搜索范围
- ✅ 项目（标题、描述、技术栈标签）
- ✅ 技能（名称、描述、分类）
- ✅ 博客（标题、摘要、标签）

### 3. 搜索结果展示
- ✅ 实时搜索（输入即搜索，带防抖）
- ✅ 搜索结果分类显示（项目、技能、博客）
- ✅ 高亮匹配关键词（黄色背景、加粗）
- ✅ 显示匹配数量
- ✅ 点击结果跳转到对应页面

### 4. 搜索历史
- ✅ 保存最近5条搜索记录（localStorage持久化）
- ✅ 点击历史记录快速搜索
- ✅ 清除历史记录

### 5. 搜索快捷键
- ✅ Ctrl+K / Cmd+K：打开搜索框
- ✅ ESC：关闭搜索框
- ✅ ↑↓：选择搜索结果
- ✅ Enter：跳转到选中结果

### 6. UI设计
- ✅ 搜索框：简洁、现代、带动画
- ✅ 搜索结果：卡片式布局、分类显示
- ✅ 高亮：黄色背景、加粗
- ✅ 动画：淡入淡出、平滑过渡
- ✅ 响应式设计：支持移动端

### 7. 性能优化
- ✅ 防抖处理（300ms）
- ✅ 搜索结果缓存
- ✅ 相关性排序（标题匹配 > 描述匹配 > 标签匹配）

### 8. 可访问性
- ✅ ARIA标签
- ✅ 键盘导航支持
- ✅ 焦点管理

## 搜索算法

### 相关性评分规则
1. **标题完全匹配**: 100分
2. **标题包含查询**: 50分
3. **描述包含查询**: 20分
4. **标签包含查询**: 30分

### 搜索流程
1. 用户输入查询关键词
2. 防抖处理（300ms）
3. 并行搜索项目、技能、博客
4. 计算相关性分数
5. 按分数降序排序
6. 高亮匹配关键词
7. 显示分类结果

## 使用方法

### 打开搜索
1. 点击Header右上角的搜索按钮
2. 或使用快捷键 `Ctrl+K` (Windows/Linux) / `Cmd+K` (Mac)

### 搜索内容
1. 在搜索框中输入关键词
2. 搜索结果会实时显示
3. 使用 `↑↓` 键选择结果
4. 按 `Enter` 键跳转到选中结果
5. 或直接点击搜索结果

### 搜索历史
1. 搜索框打开时，显示最近5条搜索历史
2. 点击历史记录快速搜索
3. 点击"清除"按钮删除所有历史

### 关闭搜索
1. 点击遮罩层
2. 按 `ESC` 键
3. 点击结果跳转后自动关闭

## 技术实现细节

### 1. 防抖处理
```typescript
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}
```

### 2. 高亮处理
```typescript
export function highlightText(text: string, query: string): string {
  if (!query || !text) return text
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-700 px-0.5 rounded font-semibold">$1</mark>')
}
```

### 3. 搜索历史持久化
```typescript
const loadHistory = () => {
  try {
    const saved = localStorage.getItem('search-history')
    if (saved) {
      history.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Failed to load search history:', error)
  }
}
```

### 4. 键盘导航
```typescript
const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault()
      searchStore.selectPrevious()
      break
    case 'ArrowDown':
      e.preventDefault()
      searchStore.selectNext()
      break
    case 'Enter':
      e.preventDefault()
      if (searchStore.selectedResult) {
        navigateTo(searchStore.selectedResult.url)
      }
      break
    case 'Escape':
      e.preventDefault()
      searchStore.closeSearch()
      break
  }
}
```

## 测试建议

### 功能测试
1. ✅ 测试搜索框打开/关闭
2. ✅ 测试快捷键（Ctrl+K / Cmd+K）
3. ✅ 测试搜索项目
4. ✅ 测试搜索技能
5. ✅ 测试搜索博客
6. ✅ 测试搜索历史
7. ✅ 测试键盘导航
8. ✅ 测试结果跳转
9. ✅ 测试移动端响应式

### 性能测试
1. ✅ 测试大量数据搜索性能
2. ✅ 测试防抖效果
3. ✅ 测试搜索响应速度

### 兼容性测试
1. ✅ 测试Chrome浏览器
2. ✅ 测试Firefox浏览器
3. ✅ 测试Safari浏览器
4. ✅ 测试移动端浏览器

## 后续优化建议

### 1. 性能优化
- [ ] 实现虚拟滚动（搜索结果超过20条时）
- [ ] 添加搜索结果分页
- [ ] 优化搜索索引构建

### 2. 功能增强
- [ ] 添加搜索过滤器（按类型、日期等）
- [ ] 添加搜索建议（自动补全）
- [ ] 添加搜索结果排序选项
- [ ] 支持模糊搜索（拼写容错）
- [ ] 支持高级搜索（AND、OR、NOT）

### 3. 用户体验
- [ ] 添加搜索统计（热门搜索词）
- [ ] 添加搜索结果预览
- [ ] 添加搜索结果分享功能
- [ ] 添加搜索结果导出功能

### 4. 可访问性
- [ ] 添加屏幕阅读器支持
- [ ] 添加高对比度模式
- [ ] 添加键盘快捷键自定义

## 注意事项

1. **数据源**: 搜索功能依赖于项目、技能、博客的数据文件
   - `src/assets/data/projects.json`
   - `src/assets/data/skills.json`
   - `src/assets/data/blog-index.json`

2. **路由配置**: 确保以下路由存在
   - `/projects/:id` - 项目详情页
   - `/skills` - 技能页面（支持锚点）
   - `/blog/:id` - 博客详情页

3. **依赖项**: 确保以下依赖已安装
   - `vue`
   - `vue-router`
   - `pinia`
   - `lucide-vue-next`

## 总结

全局搜索功能已完整实现，包含以下核心特性：
- ✅ 全局搜索框（支持快捷键）
- ✅ 多类型内容搜索（项目、技能、博客）
- ✅ 实时搜索（带防抖）
- ✅ 搜索结果高亮
- ✅ 搜索历史管理
- ✅ 键盘导航
- ✅ 响应式设计
- ✅ 性能优化

所有功能均已按照需求文档实现，代码结构清晰，易于维护和扩展。