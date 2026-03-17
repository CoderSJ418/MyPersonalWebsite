# Git 提交策略研究报告

> 研究日期：2026年3月1日
> 研究目标：为 Vue 3 个人项目的大型变更集制定最优 Git 提交策略

---

## 一、当前项目状态分析

### 1.1 变更统计

| 类型 | 数量 | 说明 |
|------|------|------|
| 删除文件 | 150+ | 临时报告文档、过时测试、重复设计系统文件 |
| 修改文件 | 80+ | 源代码、配置文件、组件文件 |
| 新增文件 | 26 | 记忆配置文档、截图资源、安全工具 |
| 领先远程 | 9 commits | 已提交但未推送的本地提交 |

### 1.2 变更类型分类

```
变更分类
├── 项目清理（删除）
│   ├── BMAD 临时报告文档（~50个）
│   ├── 过时的测试文件（~40个）
│   ├── 重复的设计系统文件（~30个）
│   ├── 废弃的脚本和配置（~20个）
│   └── 其他临时文件（~10个）
│
├── 源代码优化（修改）
│   ├── Vue 组件（~40个）
│   ├── TypeScript 工具（~20个）
│   ├── Store 状态管理（~10个）
│   └── 配置文件（~10个）
│
├── 新增内容
│   ├── 记忆配置文档（~10个）
│   ├── 截图资源（~7个）
│   ├── XSS 安全工具（~2个）
│   └── 其他配置（~7个）
│
└── 已提交（9 commits）
    └── 性能优化、bug修复、功能实现
```

---

## 二、Conventional Commits 规范深度解析

### 2.1 类型定义与边界

| 类型 | 用途 | 版本影响 | 示例 |
|------|------|----------|------|
| `feat` | 新功能/新能力 | MINOR | 添加暗黑模式、新增搜索功能 |
| `fix` | 修复 bug | PATCH | 修复登录失败、解决内存泄漏 |
| `refactor` | 代码重构（行为不变） | 无 | 提取公共方法、优化代码结构 |
| `perf` | 性能优化（行为不变） | PATCH | 优化加载速度、减少包体积 |
| `style` | 代码格式（不影响逻辑） | 无 | 修改缩进、统一引号风格 |
| `docs` | 文档更新 | 无 | 更新 README、添加 API 文档 |
| `test` | 测试相关 | 无 | 添加单元测试、修复测试用例 |
| `chore` | 构建/工具/依赖变更 | 无 | 更新依赖、修改 CI 配置 |
| `ci` | CI 配置变更 | 无 | 修改 GitHub Actions 工作流 |
| `build` | 构建系统变更 | 无 | 修改 Vite 配置、更新打包脚本 |
| `revert` | 回滚之前的提交 | - | 回滚某次有问题的提交 |

### 2.2 类型判断决策树

```
变更是否改变用户可见行为？
├── 是
│   ├── 添加了新能力？ → feat
│   └── 修复了错误行为？ → fix
│
└── 否
    ├── 是否改变性能？ → perf
    ├── 是否改变代码结构？ → refactor
    ├── 是否改变代码格式？ → style
    ├── 是否仅文档变更？ → docs
    ├── 是否仅测试变更？ → test
    ├── 是否 CI 配置？ → ci
    ├── 是否构建配置？ → build
    └── 其他杂项 → chore
```

### 2.3 Breaking Changes 处理

**格式：**
```
feat!: 重新设计 API 接口

BREAKING CHANGE: API 响应格式已变更
- 旧: { data: {...} }
- 新: { result: {...} }
```

**触发规则：**
- 类型后加 `!` 或
- Footer 中包含 `BREAKING CHANGE:`
- 自动触发 MAJOR 版本升级

### 2.4 Scope 最佳实践

**格式：** `type(scope): subject`

**常见 scope：**
- `ui` - UI 组件相关
- `api` - API 相关
- `deps` - 依赖更新
- `ci` - CI/CD 相关
- `docs` - 文档相关
- `perf` - 性能相关
- `security` - 安全相关

**示例：**
```
feat(ui): 添加像素风格按钮组件
fix(api): 修复请求超时处理
docs(readme): 更新安装说明
chore(deps): 更新 Vue 到 3.4.15
```

---

## 三、原子提交原则深度解析

### 3.1 核心定义

> **原子提交** = 专注于单一任务、目标或逻辑变更的提交，它是不可分割的——如果再细分就不再有意义。

**判断标准：**
- 如果需要用 "and" 连接多个动词描述提交，那它很可能不是原子提交
- 能否独立回滚而不影响其他功能？
- 能否独立理解而不需要其他上下文？

### 3.2 原子提交的六大好处

| 好处 | 说明 |
|------|------|
| **更易代码审查** | 小提交更易理解，减少审查疲劳 |
| **更易回滚** | 精准回滚问题提交，不影响其他功能 |
| **更易调试** | `git bisect` 快速定位问题提交 |
| **更清晰的历史** | 提交历史像"故事"一样可读 |
| **更易合并** | 减少冲突范围，冲突更易解决 |
| **更好的协作** | 团队可并行工作，减少互相干扰 |

### 3.3 非原子提交 vs 原子提交对比

**❌ 非原子提交：**
```
commit abc123
    Add user authentication, fix login bug, update README, and refactor database
```
问题：4 个不同变更混在一起

**✅ 原子提交：**
```
commit a1b2c3 - feat: add user authentication feature
commit d4e5f6 - fix: resolve login redirect bug
commit g7h8i9 - docs: update README with API docs
commit j1k2l3 - refactor: improve database connection pooling
```

---

## 四、大型变更集处理策略

### 4.1 核心问题：分批还是一次？

**研究结果：对于个人项目，推荐分批提交，但策略不同于团队项目。**

#### 分批提交的优点
1. **历史清晰**：每个提交有明确的意图
2. **回滚友好**：可以精准回滚某个类型的变更
3. **审查友好**：即使自己审查也更方便
4. **问题定位**：出问题可以快速定位是哪类变更导致的

#### 单次大提交的优点
1. **简单快速**：适合快速迭代
2. **减少历史噪音**：避免过多微小提交
3. **原子性保证**：整个变更集一起测试验证

### 4.2 个人项目的最佳实践

**推荐策略：按逻辑分 3-5 批提交**

```
提交批次规划
├── 第 1 批：项目清理（chore）
│   └── 删除临时文件、过时文档、废弃代码
│
├── 第 2 批：安全修复（fix）
│   └── XSS 防护、依赖更新
│
├── 第 3 批：代码优化（refactor）
│   └── 组件优化、工具函数重构
│
├── 第 4 批：新功能（feat）
│   └── 新组件、新页面、新功能
│
└── 第 5 批：文档更新（docs）
    └── 记忆配置、项目文档
```

### 4.3 提交粒度权衡

| 粒度 | 适用场景 | 风险 |
|------|----------|------|
| **极细（每文件1提交）** | 公共库、开源项目 | 历史碎片化，难以阅读 |
| **适中（按逻辑分组）** | ✅ 推荐：个人项目 | 平衡可读性和管理成本 |
| **极粗（单次大提交）** | 快速原型、个人实验 | 难以定位问题，回滚风险高 |

---

## 五、针对当前项目的具体方案

### 5.1 推荐方案：4 批提交

基于当前项目的变更分析，推荐以下分批方案：

#### 第 1 批：项目清理（优先级：高）

```bash
# 范围：删除所有临时报告文档和废弃文件
git add -u  # 添加所有删除和修改

# 但排除源代码修改，只保留删除
git reset HEAD src/
git reset HEAD docs/INDEX.md
git reset HEAD index.html
git reset HEAD package*.json
git reset HEAD *.config.*
git reset HEAD .eslintrc.cjs
git reset HEAD .iflow/
git reset HEAD .github/

# 提交
git commit -m "chore: 清理项目临时文件和废弃文档

删除内容：
- BMAD 分析报告和实施计划文档（~15个）
- 性能优化报告和监控报告（~10个）
- 像素组件验证和完成报告（~5个）
- 过时的测试文件和配置（~40个）
- 重复的设计系统文件（~30个）
- 废弃的脚本和配置文件（~20个）
- 临时输出文件和构建产物（~10个）

目的：保持项目结构清晰，减少维护负担"
```

#### 第 2 批：源代码优化（优先级：高）

```bash
# 暂存源代码修改
git add src/

# 提交
git commit -m "refactor: 优化源代码结构和组件实现

主要变更：
- 优化 Vue 组件结构和样式
- 重构 TypeScript 工具函数
- 改进 Pinia Store 实现
- 优化 API 接口和类型定义
- 改进 composables 组合式函数

目的：提升代码质量和可维护性"
```

#### 第 3 批：安全修复和配置（优先级：高）

```bash
# 暂存配置文件和安全相关修改
git add src/utils/xss.ts
git add tests/unit/utils/xss.spec.ts
git add .eslintrc.cjs
git add .github/workflows/ci.yml
git add .iflow/
git add index.html
git add package*.json
git add vite.config.ts
git add vitest.config.ts
git add tsconfig.app.json
git add tailwind.config.js

# 提交
git commit -m "fix(security): 添加 XSS 防护并优化项目配置

安全修复：
- 新增 XSS 过滤工具函数
- 添加 XSS 防护单元测试
- 更新 CSP 配置

配置优化：
- 更新 ESLint 配置
- 优化 CI/CD 工作流
- 更新依赖版本
- 优化构建配置

目的：增强项目安全性，优化开发体验"
```

#### 第 4 批：文档和资源（优先级：中）

```bash
# 暂存文档和资源
git add docs/
git add *.png
git add AGENTS.md
git add AI_GUIDE.md

# 提交
git commit -m "docs: 更新项目文档和记忆配置

新增文档：
- IFLOW 记忆架构和最佳实践文档
- 前端开发者记忆最佳实践
- 长期维护策略
- MCP 使用指南

新增资源：
- 项目截图（首页、关于、博客、项目页）
- 暗黑模式截图

更新文档：
- 项目 AGENTS.md 全局记忆
- AI_GUIDE.md 开发指南
- docs/INDEX.md 文档索引

目的：完善项目文档体系，支持 AI 辅助开发"
```

### 5.2 提交信息模板汇总

```bash
# 第 1 批
git commit -m "chore: 清理项目临时文件和废弃文档"
# 详细说明见上文

# 第 2 批
git commit -m "refactor: 优化源代码结构和组件实现"
# 详细说明见上文

# 第 3 批
git commit -m "fix(security): 添加 XSS 防护并优化项目配置"
# 详细说明见上文

# 第 4 批
git commit -m "docs: 更新项目文档和记忆配置"
# 详细说明见上文
```

### 5.3 提交后操作

```bash
# 1. 验证提交历史
git log --oneline -20

# 2. 推送到远程（先查看差异）
git log origin/main..HEAD --oneline

# 3. 安全推送
git push origin main
# 或如果有冲突风险
git push --force-with-lease origin main
```

---

## 六、特殊情况处理

### 6.1 如果需要回滚

```bash
# 回滚最近的提交（保留更改）
git reset --soft HEAD~1

# 回滚最近的提交（丢弃更改）
git reset --hard HEAD~1

# 回滚到特定提交
git reset --soft <commit-hash>
```

### 6.2 如果需要拆分已暂存的更改

```bash
# 取消所有暂存
git reset HEAD

# 交互式添加
git add -p <file>

# 或按目录添加
git add src/components/
git commit -m "refactor(components): 优化组件结构"

git add src/utils/
git commit -m "refactor(utils): 优化工具函数"
```

### 6.3 如果需要修改历史

```bash
# 交互式变基最近 4 个提交
git rebase -i HEAD~4

# 在编辑器中：
# - pick → edit：修改提交
# - pick → squash：合并提交
# - pick → drop：删除提交
```

---

## 七、研究结论

### 7.1 核心建议

| 场景 | 建议 |
|------|------|
| 个人项目、大量删除 | 分 3-5 批提交，按变更类型分组 |
| 团队项目、功能开发 | 原子提交，每个功能点一个提交 |
| 紧急修复 | 单次提交，但保持描述清晰 |
| 大型重构 | 按模块/目录分批提交 |

### 7.2 当前项目最优策略

**推荐：4 批提交方案**

1. `chore: 清理项目临时文件和废弃文档` - 清理历史包袱
2. `refactor: 优化源代码结构和组件实现` - 提升代码质量
3. `fix(security): 添加 XSS 防护并优化项目配置` - 安全优先
4. `docs: 更新项目文档和记忆配置` - 完善文档

### 7.3 关键原则

1. **一个提交一个目的** - 不要混入无关变更
2. **清晰的提交信息** - 描述做了什么、为什么做
3. **可回滚** - 每个提交都应能安全回滚
4. **可验证** - 每个提交后项目应能正常构建
5. **增量推进** - 先清理，再优化，最后完善

---

## 八、参考资料

1. [Conventional Commits 规范](https://www.conventionalcommits.org/)
2. [Atomic Git Commits - Aleksandr Hovhannisyan](https://www.aleksandrhovhannisyan.com/blog/atomic-git-commits/)
3. [How atomic Git commits dramatically increased my productivity](https://dev.to/samuelfaure/how-atomic-git-commits-dramatically-increased-my-productivity-and-will-increase-yours-too-4a84)
4. [Git Splitting Commits - AlgoMaster](https://algomaster.io/learn/git/splitting-commits)
5. [My git Workflow for Refactoring - Kyle Shevlin](https://kyleshevlin.com/my-git-workflow-for-refactoring/)
6. [feat/fix/refactor 区别 - Medium](https://medium.com/@noriller/docs-conventional-commits-feat-fix-refactor-which-is-which-531614fcb65a)

---

*报告生成时间：2026年3月1日*
