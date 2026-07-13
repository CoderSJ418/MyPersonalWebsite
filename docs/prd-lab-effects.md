# PRD — /lab 效果实验室

> 版本：v0.4 | 状态：待评审
> 决策前提：Hero 采用极简风格（纯白底 + 大标题 + CTA），所有花哨效果放到 `/lab` 专区展示
> 暗黑模式：全局单模式（亮色），无 dark mode

---

## 0. AI 约束与工作边界

> **本节为 AI 执行者（Claude Code / JoyCode / 任何编码 AI）的约束协议。违反本节任意一条，实施视为不合格。**

### 0.1 绝对禁区（触碰 = 终止实施）

以下文件和目录，**AI 不得修改、删除、移动、重命名、导入**：

| 路径 | 原因 |
|------|------|
| `src/design-system/tokens/shaderPalette.ts` | 已标记废弃，Phase 3 按 PRD 7.3 删除。AI 不得导入、不得引用、不得修改色值 |
| `docs/prd-shader-design-system.md` | 已标记 `[OBSOLETE]`，不得修改 |
| `docs/prd-effects-integration.md` | 已标记 `[OBSOLETE]`，不得修改 |
| `src/composables/useStripeGradient.ts` | 保留不扩展，AI 不得修改 |
| `src/router/index.ts` 中 `/:pathMatch(.*)*` | catch-all 路由，AI 不得移动或修改 |
| `src/utils/xss.ts` | 安全相关，AI 不得修改 |

### 0.2 禁止行为

| 行为 | 说明 |
|------|------|
| 不得创建 `<style scoped>` 超过 80 行的文件 | 超出时提取到 `src/assets/styles/lab-demo-utils.css` |
| 不得在 Lab 组件中使用 `dark:` 变体 | 全局单模式，任何 `dark:` 都是错误 |
| 不得导入 `useThemeStore` | Lab 不关心主题 |
| 不得创建 `LabCodeBlock.vue` | 复用已有 `CodeBlock.vue` |
| 不得修改非 Lab 目录的现有组件 | 除非 PRD 明确指定（如 Header.vue 的 isActiveRoute） |
| 不得硬编码 accent 色值 | 使用 Tailwind 类或设计系统 token |
| 不得在 demo 组件中使用 `any` 类型 | strict mode，用 `unknown` + 类型收窄 |
| 不得在注册表中使用中文 ID | ID 是 URL 路径段，只允许小写字母 + 连字符 |
| 不得在 demo 组件中解构 `inject('labParams')` 返回值 | 解构会断开响应性，必须直接访问属性 |
| 不得将 `v-if` 放在 `<Suspense>` 内部的 `<component>` 上 | 必须放在 `<Suspense>` 本身（见 3.6 修复说明） |

### 0.3 决策优先级

当 PRD 与 CLAUDE.md 冲突时：
1. **项目规则（project-rules.md）** 优先于 PRD
2. **PRD** 优先于 AI 自以为是的设计
3. **已有代码的现有模式** 优先于 AI 发明新模式

AI 不得"优化"超出 PRD 范围的代码。例如：AI 发现 `Header.vue` 有 580 行，不得重构为多个子组件——除非 PRD 要求。

### 0.4 实施顺序

AI 必须严格按 PRD 第 7 节 Phase 顺序执行。每个 Phase 完成后：
1. 运行该 Phase 的验收标准
2. 全部通过后，才进入下一 Phase
3. 不得跳过 Phase、合并 Phase、或"顺便做下一个 Phase 的事"

### 0.5 操作前自检清单

> **AI 每次执行 Edit / Write / WriteFile 工具之前，逐项确认。任何一项回答"否"，停止操作。**

| # | 检查项 | 说明 |
|---|--------|------|
| S1 | 这个文件在 PRD 明确要求创建/修改的范围内吗？ | Phase 1 不得创建 Phase 2 的 demos/ 文件 |
| S2 | 改的这行代码 PRD 有精确规格吗？如果有，对照规格逐字段检查 | 如 Header.vue 的 isActiveRoute 有精确 3 行替换规格 |
| S3 | 新增的 import 路径在绝对禁区列表（0.1）中吗？ | 导入 shaderPalette.ts → 终止 |
| S4 | 新增的样式是否包含 `dark:` 变体？ | Lab 中这是错误 |
| S5 | 新增的类型是否使用了 `any`？ | 这是错误 |
| S6 | 改动的文件是否超出 PRD 明确指定的范围？ | Phase 1 不得动 TechStack.vue |
| S7 | 这步操作是否在当前的 Phase 内？ | 不在 → 不做，记下来留给对应 Phase |
| S8 | 这步操作是否是 PRD 明确禁止的行为？ | 查 0.2 表格 |

**执行方式**：这不是"心里想一遍"，是**逐项读一遍**。上下文膨胀时最容易漏掉的是 S7——AI 看到一个"顺手就能做了"的优化，忘了自己还在 Phase 1。

### 0.6 过程治理体系

> **本节定义"如何保证实施不漂移"的机制。三层防御，每层有独立的阻断能力。**

#### 第一层：PRD 自验证（实施前封堵）

**目的**：在 AI 写第一行代码之前，确保 PRD 本身没有矛盾。

**机制 1：机器可读注册表 spec**

`docs/prd-lab-effects/registry-spec.ts` 是注册表的 TypeScript 源文件。PRD 第 3 节中的注册表 markdown 表格必须与此文件完全一致。AI 实施 `src/config/labRegistry.ts` 时，对着这个 spec 逐字段对比。

spec 文件的约束：
- 每个 entry 的 `id` 必须匹配 `/^[a-z]+(-[a-z]+)*$/`
- `description` 必须 ≤ 100 字符
- `component` 的 import 路径必须指向 `src/views/Lab/demos/` 下存在的文件（Phase 2 校验）
- `params` 的 `key` 在同一 entry 内不得重复
- `language` 必须是 `'vue'` | `'css'` | `'html'`

**机制 2：PRD 一致性校验脚本**

`docs/prd-lab-effects/validate-prd.ts` 检查 PRD 内部一致性：
- 文件头版本号与变更记录中的版本号一致
- 段落编号无断裂、无重复
- 绝对禁区的文件在 Lab 源码中未被引用（grep 检查）
- 旧 accent 色值（`#7B4EED` / `#F03880` / `#0052FF`）不在 Lab 相关代码中出现
- 注册表所有 `id` 在 markdown 中只出现一次（无拼写不一致）

**机制 3：Phase 测试文件（测试先行）**

每个 Phase 的测试文件在 AI 开始实施**之前**就已经存在。AI 不能"写完代码再写测试凑数"。

- `tests/unit/lab/phase1.spec.ts` — Phase 1 验证门的所有检查项
- `tests/unit/lab/phase2.spec.ts` — Phase 2 验证门
- `tests/unit/lab/phase3.spec.ts` — Phase 3 验证门

测试文件的内容：
```ts
// 示例：tests/unit/lab/phase1.spec.ts
describe('Phase 1: Lab 基础设施', () => {
  it('路由 /lab 存在且可解析', async () => { /* ... */ })
  it('路由 /lab/:id 正确传递 params', async () => { /* ... */ })
  it('无效 ID 渲染 LabNotFound', async () => { /* ... */ })
  it('Header isActiveRoute: /lab/aurora 不高亮 /lab', async () => { /* ... */ })
  it('注册表所有 entry 的 id 与 demos/ 文件名对应', async () => { /* ... */ })
  it('无 LabCodeBlock.vue 文件', async () => { /* ... */ })
  it('Lab 页面无 dark: 类输出', async () => { /* ... */ })
})
```

#### 第二层：实施过程锁死（实施中阻断）

**目的**：AI 在实施过程中漂移时，立即阻断，不等积累成大问题。

**机制 4：完成定义（Definition of Done）**

见 PRD 第 13 节。任何任务标记"完成"之前，五项全过：
1. 代码写完
2. lint 通过
3. 对应测试通过
4. build 通过
5. 变更记录已写入 PRD

五项缺一不可。AI 不得在只完成第 1 项时声称任务完成。

**机制 5：变更审计轨迹**

AI 每完成一个任务，在两个地方留痕：
- PRD 末尾变更记录表追加一行
- `tests/unit/lab/audit-trail.spec.ts` 自动检查变更记录完整性

审计测试在每次 `npm run test` 时自动运行，如果 PRD 变更记录缺少某个 Phase 的任务条目，测试失败。

**机制 6：锚定注释**

每个由 AI 创建或修改的关键文件，头部必须有 PRD 锚定注释：

```vue
<!--
  PRD 锚定：§3.14.1 LabLayout.vue 精确规格
  Phase：1
  Task：1.1
  关键约束：
  - provide('labParams') 必须用 reactive() 包装（§3.6）
  - <Suspense> 的 v-if 在 Suspense 上（§0.2 禁令 #10）
  - 不导入 useThemeStore（§0.2 禁令 #3）
  - CodeBlock 不传 version prop（§3.8）
-->
```

**规则**：没有锚定注释的文件，视为未完成。AI 创建文件时必须同时写入锚定注释。

**机制 7：上下文重置检查点**

每个 Phase 完成后，AI 必须重新读取 PRD 的以下关键章节，不得凭"记忆"继续：
- 0.1 绝对禁区
- 0.2 禁止行为
- 当前 Phase 的任务表
- 当前 Phase 的验收门

这不是"建议"，是强制步骤。上下文膨胀是渐进的——AI 不会意识到自己忘了什么，所以必须**重新读**。

#### 第三层：全量验收（实施后终检）

**目的**：即使前两层都有漏洞，第三层 catching 一切。

**机制 8：npm run validate:lab 全量检查**

一个命令跑完所有检查：

```bash
npm run validate:lab
```

执行以下检查，任何一条失败 → 实施不合格：
1. `npm run lint` → 0 errors
2. `npm run build` → 成功，产物包含所有 demo chunk
3. `npm run test -- tests/unit/lab/` → 全过
4. 注册表所有 `id` 与 `demos/` 目录文件一一对应
5. 全局搜索无 `#7B4EED` / `#F03880` / `#0052FF` 硬编码色值
6. 无 `LabCodeBlock.vue` 文件
7. Lab 目录下无 `useThemeStore` 导入
8. Lab 目录下无 `dark:` 类
9. `shaderPalette.ts` 已不存在（Phase 3 后）
10. JSON-LD 脚本在 demo 页面正确注入

**机制 9：人类审查触发点**

以下节点必须停下来等人类确认，AI 不得自动进入下一节点：

| 节点 | 触发时机 | 人类确认什么 |
|------|---------|-------------|
| T1 | Phase 1 完成 | 基础设施跑通，确认 Phase 2 开始 |
| T2 | Phase 2 每 4 个 demo 后 | 效果展示正常，确认继续 |
| T3 | Phase 2 全部 12 个完成后 | 所有 demo 可用，确认进入 Phase 3 |
| T4 | Phase 3 完成 | Hero 改造完成，确认进入 Phase 4 |
| T5 | Phase 4 全部完成后 | 全量验收通过，确认上线 |

#### 治理机制速查表

| 机制 | 层 | 阻断方式 | 防什么 |
|------|-----|---------|--------|
| registry-spec.ts | 1 | 类型检查 + 手动对比 | 注册表抄错 |
| validate-prd.ts | 1 | 脚本退出码 | PRD 自身矛盾 |
| Phase 测试文件 | 1 | 测试 pass/fail | 实现偏离规格 |
| 完成定义（DoD） | 2 | 五项全过 | AI 声称完成但实际没完成 |
| 变更审计轨迹 | 2 | 测试自动检查 | AI 跳过任务 |
| 锚定注释 | 2 | 文件头部强制 | AI 忘记约束 |
| 上下文重置检查点 | 2 | 强制重读 PRD | 上下文膨胀导致遗忘 |
| validate:lab | 3 | 脚本退出码 | 残留问题 |
| 人类审查触发点 | 3 | 等待人类确认 | AI 连续漂移累计 |

### 0.7 变更记录

AI 每完成一个任务，必须在 PRD 末尾的变更记录表追加一行：

```markdown
| 日期 | 任务 | 变更内容 | 验证 |
```

---

## 1. 需求概述

### 1.1 背景

当前项目 Hero 区域为炫技式 WebGL shader 背景，与个人作品集定位不匹配。
参考 Morphin / MagicUI / Aceternity UI，这些站的差异化优势在于**效果可独立预览**，而非 Hero 本身炫技。

### 1.2 目标

新建 `/lab` 效果实验室专区，每个效果一个独立页面，包含：
- 实时可交互演示
- 参数调节面板
- 代码片段

Hero 回归极简，全站材质对标 MagicUI 风格（干净白色卡片 + 精细边框 + 微妙阴影）。

### 1.3 非目标

- 不引入新 npm 包
- 不改变路由/数据流/Store 架构
- 不修改现有功能组件的业务逻辑
- 不引入 Framer Motion（已有 GSAP）
- 不实现暗黑模式（全局单模式）

### 1.4 遗留文件处置

| 文件 | 处置 | 原因 |
|------|------|------|
| `src/design-system/tokens/shaderPalette.ts` | **标记废弃，Phase 3 删除** | 该文件定义了紫 `#7B4EED` / 粉 `#F03880` / 蓝 `#0052FF` 的丝带色板，属于旧 Hero WebGL 丝带方案（已废弃）的产物。Lab 页面统一使用蓝 `#2563EB` 作为 accent。文件必须加 `@deprecated` 注释，所有引用者迁移到设计系统 token 后删除。不得在任何新代码中导入此文件。 |
| `src/composables/useStripeGradient.ts` | **保留但不扩展** | 当前 Hero 已不再使用 WebGL shader（已改为极简白底），此 composable 仅作为历史代码保留。Phase 3 Hero 最终确认无 shader 后可删除。 |
| `docs/prd-shader-design-system.md` | **标记过时** | 旧丝带方案的 PRD，已被本文件取代。加 `[OBSOLETE]` 标记。 |
| `docs/prd-effects-integration.md` | **标记过时** | 旧效果集成方案的 PRD，已被本文件取代。加 `[OBSOLETE]` 标记。 |
| `docs/stripe-deep-research.md` / `docs/stripe-research-report-v2.md` | **保留参考** | 技术调研文档，仍可参考 shader 原理。但色板方案已不适用。 |
| `docs/ribbon-prototype.html` / `morphin*.html` / `morphin*.json` | **移至 `docs/reference/`** | 原型文件，保留作为参考，但不应留在项目根目录。 |

### 1.5 暗黑模式政策

**全局单模式（亮色）。** 所有 Lab 页面、组件、demo 均只渲染亮色样式，不输出任何 `dark:` 变体、不检测 `prefers-color-scheme`、不读取 `useThemeStore`。

已存在的暗色模式基础设施（`useThemeStore`、`dark:` 类、`data-theme` 属性）保留不动，Lab 功能只负责"不使用它们"。

### 1.6 用户画像（User Personas）

AI 需要理解"谁在用这个页面"才能做出正确的 UX 决策。

**Persona 1：访客 / 潜在雇主**
- 特征：技术负责人或 HR，正在评估前端开发者的能力
- 目标：快速了解开发者的技术深度和审美品味
- 使用 /lab 的方式：浏览效果卡片，点击 2-3 个感兴趣的效果查看演示
- 停留时间：30-60 秒
- 关键体验：效果看起来"高级"、代码可复制、页面加载快

**Persona 2：开发者 / 同行**
- 特征：前端开发者，对技术实现感兴趣
- 目标：学习效果的实现方式，可能复制代码到自己的项目
- 使用 /lab 的方式：搜索特定效果类型（如"card"），查看代码块，调节参数理解原理
- 停留时间：2-5 分钟
- 关键体验：代码清晰、参数有意义、效果可交互

**Persona 3：维护者（你自己）**
- 特征：项目所有者，持续添加新效果
- 目标：快速添加新 demo，保持风格统一
- 使用 /lab 的方式：在 demos/ 目录新建文件，在注册表添加条目
- 关键体验：PRD 精确、模板清晰、验证自动化

### 1.7 用户故事（User Stories）

将需求从"工程视角"翻译为"用户行为"。

| ID | 作为... | 我想... | 以便... |
|----|--------|--------|---------|
| US-01 | 访客 | 在 /lab 首页看到效果卡片网格 | 快速浏览所有可用效果 |
| US-02 | 访客 | 通过搜索框按名称搜索效果 | 快速找到特定效果 |
| US-03 | 访客 | 按分类筛选效果 | 只看我感兴趣的类别 |
| US-04 | 访客 | 点击卡片进入效果演示页 | 实时交互体验 |
| US-05 | 访客 | 调节参数看到效果实时变化 | 理解参数的作用 |
| US-06 | 访客 | 复制代码片段 | 直接在我的项目中使用 |
| US-07 | 访客 | 页面加载快速 | 不等待就体验效果 |
| US-08 | 访客 | 在手机上正常使用 | 通勤时也能浏览 |
| US-09 | 维护者 | 有清晰的添加流程 | 10 分钟内添加一个新 demo |
| US-10 | 维护者 | 有自动化校验 | 不担心注册表和文件不同步 |

### 1.8 范围声明（Scope / Out of Scope）

**范围内（In Scope）**

- 20 个效果 demo 的实现和展示
- /lab 效果网格首页
- /lab/:id 效果演示页
- 搜索和分类筛选
- 参数调节面板
- 代码片段展示
- SEO（SEOHead + JSON-LD）
- 响应式布局

**范围外（Out of Scope）**

- 效果之间的横向对比功能
- 用户账号 / 收藏 / 分享功能
- 效果自定义保存（用户保存参数配置）
- 效果导入（用户上传自己的效果）
- 多语言支持（i18n）
- 评论区
- 暗黑模式
- PWA / 离线访问
- 效果 API（对外提供效果渲染服务）
- 性能监控面板（Lighthouse 分数展示给用户）
- 任何新 npm 包的引入

### 1.9 假设与约束（Assumptions & Constraints）

**假设（Assumptions）**

| # | 假设 | 如果假设不成立 | 影响 |
|---|------|--------------|------|
| A1 | 用户使用现代浏览器（Chrome 90+, Safari 14+） | 需要 polyfill 或降级 | 低 |
| A2 | 用户有稳定的网络连接（demo 组件可动态 import） | 需要静态 fallback | 低 |
| A3 | Vite 构建产物包含所有动态 import chunk | 需要验证 build 产物 | 中 |
| A4 | `useGSAPAnimations` composable 存在，且包含数字滚动方法 | 不存在或方法名不匹配则新建 `useNumberTicker` | 低 |
| A5 | `CodeBlock.vue` 不传 `version` prop 时隐藏 version pill | 需要修改 CodeBlock.vue | 低 |
| A6 | `SEOHead.vue` 支持 `type` prop 和 JSON-LD 注入 | 不支持则需要扩展 | 中 |
| A7 | 项目已有 `useMobilePerformance` composable | 不存在则手写触摸检测 | 低 |

> **注 A4**：AI 在实施前必须先用 `Grep` 确认 `useGSAPAnimations` 导出的方法名。如果找不到 `animateNumber` / `countUp` / `animateValue` 等数字滚动方法，新建 `src/composables/useNumberTicker.ts`（基于 rAF + ease-out，不引入新依赖）。

**硬约束（Constraints）**

| # | 约束 | 原因 |
|---|------|------|
| C1 | 不引入新 npm 包 | 项目规则 |
| C2 | 不修改 Store 架构 | 项目规则 |
| C3 | 全局单模式（亮色） | 用户决策 |
| C4 | 代码高亮用已有 highlight.js | 用户决策 |
| C5 | 不得修改 shaderPalette.ts | Phase 3 删除，AI 不得碰 |
| C6 | 全站 accent 统一为 `#2563EB`（蓝） | Hero / Lab / 现有组件共用同一 accent |

### 1.10 非功能需求（NFR — Non-Functional Requirements）

#### 性能 NFR

| 指标 | 目标 | 测量方式 |
|------|------|---------|
| /lab 首页 FCP | < 1.5s | Lighthouse |
| /lab 首页 bundle (gzip) | < 150KB | `npm run build` 产物分析 |
| Demo 切换耗时 | < 200ms | 浏览器 Performance API |
| Lighthouse 性能评分 | > 90 | Lighthouse CI |
| Lighthouse 可访问性 | > 90 | Lighthouse a11y |

#### 可用性 NFR

| 指标 | 目标 |
|------|------|
| 移动端断点 | 375px 宽度全部效果正常 |
| 触摸设备 | 所有 mousemove 效果降级或禁用 |
| prefers-reduced-motion | 所有动画暂停/禁用（保持首帧） |
| 键盘导航 | 所有交互元素可 Tab 聚焦 |

#### 可靠性 NFR

| 指标 | 目标 |
|------|------|
| 构建成功 | 100%（含注册表校验） |
| ESLint 错误 | 0 |
| TypeScript 错误 | 0 |
| 运行时 demo 崩溃 | 不导致整页白屏（error boundary） |

#### 浏览器支持

| 浏览器 | 最低版本 |
|--------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

#### 代码质量

| 指标 | 目标 |
|------|------|
| 单个 demo 文件 | ≤ 200 行 |
| 单个 demo scoped style | ≤ 80 行 |
| 代码重复 | CodeBlock 零重复（不得新建 LabCodeBlock） |
| TypeScript strict | 通过（noImplicitAny, strictNullChecks） |

### 1.11 依赖地图（Dependencies）

#### Lab 功能依赖的内部组件/composable

| 依赖项 | 用途 | 如果不可用 |
|--------|------|-----------|
| `CodeBlock.vue` | 代码展示 | 必须存在（已有） |
| `SEOHead.vue` | SEO meta 标签 | 必须存在（已有） |
| `useMobilePerformance` | 触摸设备检测 | 必须存在（已有） |
| `useGSAPAnimations` | number-ticker 动画 | 必须存在且含数字滚动方法；否则新建 `useNumberTicker`（见 A4） |
| `useCardSpotlight` | 可选，spotlight demo | 若接口不适合则手写轻量版 |
| `useCard3D` | 可选，tilt-card demo | 若接口不适合则手写轻量版 |
| `gsap` | 可选，text-reveal demo | Phase 4，已有依赖 |
| `RouterLink` | 面包屑/返回链接 | Vue Router，已有 |

#### Lab 功能对外部项目的依赖

| 依赖项 | 说明 |
|--------|------|
| Vue 3.4+ | `<script setup>`, `<Suspense>`, `onErrorCaptured` |
| Vue Router 4.2+ | `useRoute`, `RouterLink` |
| Pinia 2.1+ | 不直接依赖，但 app 初始化依赖 |
| Tailwind CSS 3.4+ | 所有样式 |
| GSAP 3.14+ | 可选（text-reveal, number-ticker） |

### 1.12 风险登记册（Risk Register）

| # | 风险 | 概率 | 影响 | 缓解措施 |
|---|------|------|------|---------|
| R1 | Header isActiveRoute 修复引入回归 | 中 | 高 | 修改后逐一测试每个导航链接 |
| R2 | CodeBlock.vue 在 Lab 场景样式冲突 | 中 | 中 | Lab 容器加 `lab-` 前缀 class 隔离 |
| R3 | GSAP 实例泄漏导致内存增长 | 中 | 中 | 每个 demo 完成后跑 10 次路由切换测试 |
| R4 | 动态 import chunk 在 build 产物中缺失 | 低 | 高 | build 后检查 dist/ 包含 demo chunk |
| R5 | shaderPalette.ts 被意外引用 | 低 | 高 | AI 约束 0.1 绝对禁区 + 删除前 grep 全项目 |
| R6 | 注册表与 demos/ 目录不同步 | 中 | 中 | 构建校验脚本（3.4），Phase 1 骨架阶段只校验格式，Phase 2 开始校验文件存在 |
| R7 | Canvas 粒子在低端设备卡顿 | 中 | 低 | useMobilePerformance 检测 + 粒子减半 |
| R8 | @property 在旧 Safari 不支持 | 低 | 中 | shine-border 添加 @supports 降级 |
| R9 | provide/inject 响应性断裂导致参数面板不更新 | 中 | 高 | provide 的值必须用 `reactive()` 包装；inject 后不得解构，直接访问属性 |
| R10 | CSS animation 在 mount 瞬间闪烁（reduced-motion 检测太晚） | 中 | 低 | CSS-first 防御：全局 `animation-play-state: paused` + JS 二次确认 |

### 1.13 上线标准（Go-Live Criteria）

#### 上线前必须满足

- [ ] Phase 1-3 全部完成并通过验证门
- [ ] `npm run lint` — 0 errors
- [ ] `npm run build` — 成功，产物包含所有 demo chunk
- [ ] `npm run test` — 通过
- [ ] `npm run validate:lab` — 全量检查通过
- [ ] Lighthouse 性能评分 ≥ 90（/lab 首页）
- [ ] Lighthouse 可访问性评分 ≥ 90
- [ ] 375px 移动端手动测试通过
- [ ] 搜索和筛选功能正常
- [ ] 无效 ID fallback 正常
- [ ] 导航栏 /lab 链接正常
- [ ] Header isActiveRoute 修复验证
- [ ] shaderPalette.ts 已删除
- [ ] 无 LabCodeBlock.vue 文件
- [ ] JSON-LD 结构化数据注入验证（Google Rich Results Test）
- [ ] RSS/站点地图包含 /lab 路由

#### 上线后观察（48 小时）

- [ ] 无 console error
- [ ] 核心 Web Vitals 达标（LCP < 2.5s, FID < 100ms, CLS < 0.1）

---

## 2. 效果清单

### 第一批（Phase 1，12 个效果）

| # | 效果 ID | 名称 | 分类 | 技术 | 来源 | 预估行数 | 难度 |
|---|---------|------|------|------|------|---------|------|
| 1 | aurora | Aurora 极光背景 | background | CSS gradient animation | MagicUI | 80 | 中 |
| 2 | grid-pattern | 网格底纹 | background | SVG + CSS animation | MagicUI | 30 | 低 |
| 3 | dot-pattern | 点阵背景 | background | SVG | MagicUI | 30 | 低 |
| 4 | noise-texture | 噪点纹理 | background | SVG feTurbulence | MagicUI | 20 | 低 |
| 5 | meteors | 流星效果 | background | CSS animation | MagicUI | 60 | 低 |
| 6 | spotlight | 卡片追光 | card | JS mousemove + CSS | Aceternity | 80 | 中 |
| 7 | tilt-card | 3D 倾斜卡片 | card | CSS transform + JS | Aceternity | 80 | 中 |
| 8 | magic-card | 魔法卡片 | card | CSS + JS | MagicUI | 80 | 中 |
| 9 | shine-border | 边框光泽 | button | CSS @property + conic-gradient | MagicUI | 50 | 中低 |
| 10 | shimmer-button | 按钮扫光 | button | CSS animation | MagicUI | 50 | 中低 |
| 11 | number-ticker | 数字滚动 | data | rAF + useGSAPAnimations | MagicUI | 50 | 中低 |
| 12 | marquee | 无限滚动 | layout | CSS animation | MagicUI | 40 | 低 |

### 第二批（Phase 2，8 个效果）

| # | 效果 ID | 名称 | 分类 | 技术 | 来源 | 预估行数 | 难度 |
|---|---------|------|------|------|------|---------|------|
| 13 | animated-gradient-text | 渐变文字 | text | CSS background-clip | MagicUI | 40 | 低 |
| 14 | typing-animation | 打字机效果 | text | CSS + JS | MagicUI | 50 | 中低 |
| 15 | word-rotate | 单词轮换 | text | CSS animation | MagicUI | 40 | 低 |
| 16 | particles | 粒子效果 | background | Canvas | MagicUI | 80 | 中 |
| 17 | border-beam | 边框光束 | button | CSS animation | MagicUI | 50 | 中低 |
| 18 | dock | macOS 停靠栏 | layout | CSS + JS | Aceternity | 80 | 中 |
| 19 | bento-grid | Bento 网格 | layout | CSS Grid | Aceternity | 60 | 中 |
| 20 | text-reveal | 文字揭示 | animation | GSAP ScrollTrigger | Morphin | 60 | 中 |

---

## 3. 架构设计

### 3.1 目录结构

```
src/
├── views/
│   └── Lab/
│       ├── LabIndex.vue                    ← /lab 首页（效果网格 + 搜索筛选）
│       ├── LabLayout.vue                   ← 共享布局（演示区 + 参数面板 + 代码块）
│       ├── LabNotFound.vue                 ← 无效 ID 的 fallback 页面
│       └── demos/                          ← Phase 2 开始填充
│           ├── AuroraDemo.vue
│           ├── GridPatternDemo.vue
│           ├── DotPatternDemo.vue
│           ├── NoiseTextureDemo.vue
│           ├── MeteorsDemo.vue
│           ├── SpotlightDemo.vue
│           ├── TiltCardDemo.vue
│           ├── MagicCardDemo.vue
│           ├── ShineBorderDemo.vue
│           ├── ShimmerButtonDemo.vue
│           ├── NumberTickerDemo.vue
│           └── MarqueeDemo.vue
├── config/
│   └── labRegistry.ts                      ← 效果注册表
├── components/
│   └── lab/
│       ├── LabEffectCard.vue               ← 效果网格卡片
│       ├── LabCodeBlock.vue                ← 不创建（复用 CodeBlock.vue）
│       └── LabParamPanel.vue               ← 参数调节面板
├── composables/
│   └── useLabDemo.ts                       ← Demo 页面共享逻辑
└── assets/
    └── styles/
        └── lab-demo-utils.css              ← 共享 demo utility class（按需创建）
```

### 3.2 路由

```ts
// src/router/index.ts
// 在现有 routes 数组中，About 路由之后、/:pathMatch(.*)* 之前插入：

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

**关键约束**：必须在 `/:pathMatch(.*)*` **之前**插入。路由匹配按顺序执行，先匹配 `/lab` 和 `/lab/:id`，最后才是 catch-all。

### 3.3 效果注册表

#### 接口定义

```ts
// src/config/labRegistry.ts
import type { Component } from 'vue'

export interface LabEffect {
  id: string                              // URL 路径段，如 'aurora'
  name: string                            // 显示名，如 'Aurora 极光背景'
  description: string                     // 一句话描述（≤100 字）
  category: 'background' | 'card' | 'button' | 'text' | 'animation' | 'layout' | 'data'
  tags: string[]                          // 技术标签
  component: () => Promise<{ default: Component }>  // 懒加载 demo 组件
  code: string                            // 展示用的代码片段
  language: string                        // 代码语言：'vue' | 'css' | 'html'
  params?: LabParam[]                     // 可调参数列表
}

export interface LabParam {
  key: string                             // 参数名，对应 demo 组件内的 ref
  label: string                           // 显示标签
  type: 'range' | 'color' | 'select'
  min?: number                            // range 专用
  max?: number                            // range 专用
  step?: number                           // range 专用
  defaultValue: string | number           // 默认值
  options?: { label: string; value: string }[]  // select 专用
}
```

#### 机器可读 spec（PRD 的活体锚点）

`docs/prd-lab-effects/registry-spec.ts` 是注册表的 TypeScript 源文件。`src/config/labRegistry.ts` 必须与此 spec 完全一致。AI 不得自行修改 spec——spec 的变更必须通过修改 PRD 再更新 spec。

**验证规则**：
- 每个 `id` 匹配 `/^[a-z]+(-[a-z]+)*$/`
- 每个 `description` ≤ 100 字符
- 每个 `component` import 路径指向 `src/views/Lab/demos/` 下存在的文件（Phase 2+ 校验）
- 同一 entry 内 `params[].key` 无重复
- `language` ∈ {`'vue'`, `'css'`, `'html'`}

#### Phase 1 注册表（12 个效果）

```ts
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

### 3.4 注册表路径校验

`labRegistry.ts` 中每个 `id` 必须与 `demos/` 目录下的文件名一致（去掉 `Demo.vue` 后缀）。

构建时执行校验脚本（`scripts/validateLabRegistry.ts`），比对注册表 `id` 与 `demos/` 目录实际文件。

**校验脚本分两阶段**：
- **Phase 1 骨架阶段**：只校验注册表格式（每个 entry 是否包含 `id`、`name`、`component`、`code`、`language` 五个必填字段，`description` ≤ 100 字符，`id` 只含小写字母 + 连字符）。不校验文件存在——因为 demos/ 此时是空的。
- **Phase 2 填充阶段及之后**：校验格式 + 校验 `demos/` 目录下每个注册表 ID 对应的文件存在。

该脚本在 `package.json` 的 `build` 流程中 `vite build` 之后、sitemap 生成之前执行。校验失败时 `process.exit(1)`，构建终止。

### 3.5 页面结构

#### `/lab` — 效果网格首页

```
┌──────────────────────────────────────────────┐
│  效果实验室                     [🔍 搜索] [分类▾] │
│  交互式前端效果演示 — 点击卡片实时体验              │
├──────────────────────────────────────────────┤
│  ┌────────┐ ┌────────┐ ┌────────┐            │
│  │ Aurora │ │ Grid   │ │ Dot    │            │
│  │ 极光   │ │ 网格   │ │ 点阵   │            │
│  │ 背景   │ │ 底纹   │ │ 背景   │            │
│  │ [渐变] │ │ [网格] │ │ [圆点] │            │
│  │ #bg    │ │ #bg    │ │ #bg    │            │
│  └────────┘ └────────┘ └────────┘            │
│  ┌────────┐ ┌────────┐ ┌────────┐            │
│  │ Spotlight│ │ Tilt   │ │ Shine  │            │
│  │ 追光    │ │ 3D倾斜 │ │ 光泽   │            │
│  │ [卡片] │ │ [卡片] │ │ [按钮] │            │
│  └────────┘ └────────┘ └────────┘            │
└──────────────────────────────────────────────┘
```

**首屏引导（必须）**：LabIndex 顶部必须有标题区域，包含：
- 页面标题"效果实验室"（`text-3xl font-bold`）
- 副标题"交互式前端效果演示 — 点击卡片实时体验，调节参数理解原理"
- 搜索框（带搜索图标，占满容器宽度）
- 分类筛选标签栏（`background` / `card` / `button` / `text` / `animation` / `layout` / `data`）

没有引导的空白网格会让访客困惑（Persona 1 关键体验）。

**卡片缩略图**：每个效果卡片使用效果名称 + 分类标签 + 一个渐变色彩占位块（从该效果的主色提取），不做 mini demo（性能成本太高，且卡片尺寸不足以展示效果）。

**加载态**：动态 import 的 demo 预览图在加载期间显示 skeleton 占位（灰色脉冲方块），尺寸与卡片预览区一致。

**空状态**：搜索无结果时显示"没有找到匹配的效果" + 清空搜索按钮。

#### `/lab/:id` — 效果演示页

```
┌──────────────────────────────────────────────┐
│  ← 返回效果实验室                              │
│                                              │
│  Aurora 极光背景                              │
│  流动的渐变光带，模拟极光效果                    │
│  #background #css #gradient                   │
│                                              │
│  ┌──────────────────────────────────────────┐│
│  │                                          ││
│  │         效果实时演示区                     ││
│  │     （可交互，占满容器宽度，min-h-[200px]） ││
│  │                                          ││
│  └──────────────────────────────────────────┘│
│                                              │
│  参数调节                    [重置默认值]      │
│  ┌──────────────────────────────────────────┐│
│  │ 速度  ━━━━━●━━━━━  2.0                   ││
│  │ 颜色主题  [●蓝] [●靛] [●紫] [●青]          ││
│  └──────────────────────────────────────────┘│
│                                              │
│  ┌─ 使用方式 ───────────────────────────────┐│
│  │ <template>                              ││
│  │   <AuroraBackground                      ││
│  │     speed={2}                            ││
│  │     colors={['#2563EB', '#4F46E5']}      ││
│  │   />                                     ││
│  │ </template>                              ││
│  └──────────────────────────────────────────┘│
└──────────────────────────────────────────────┘
```

**参数面板**：每个 range 类型控件必须显示当前数值（如 `2.0`）。面板右上角有"重置默认值"按钮，点击后所有参数恢复到注册表 `defaultValue`。

**复制反馈**：CodeBlock 的复制按钮点击后，除了 morph 动画外，额外显示 tooltip "已复制"，至少显示 1.5 秒。

#### `/lab/:id`（无效 ID）— 效果不存在

```
┌──────────────────────────────────────────────┐
│  ← 返回效果实验室                              │
│                                              │
│  404                                         │
│  效果 "xyz" 不存在                            │
│                                              │
│  [浏览所有效果 →]                             │
└──────────────────────────────────────────────┘
```

### 3.6 LabLayout 数据流

LabLayout 是 `/lab/:id` 的视图外壳，负责四件事：

1. **SEOHead**：作为第一个子元素渲染，title 从注册表取 `name`，description 取 `description`，language 取注册表的 `language` 字段
2. **面包屑**：`效果实验室 > {name}`，使用 `<nav aria-label="Breadcrumb">`
3. **参数双向绑定**：LabLayout 通过 `provide` 向 demo 组件传递 params 状态对象，demo 组件通过 `inject` 读写。LabParamPanel 同样通过 `inject` 读取同一对象渲染控件。
4. **错误边界**：demo 组件加载失败或运行时崩溃，展示降级 UI（见 3.13）

```
LabLayout
├── <SEOHead :title="effect.name" :description="effect.description" />
├── <nav>面包屑</nav>
├── <ErrorBoundary>
│   └── <Suspense v-if="effect">            ← v-if 在 Suspense 上，不在 component 上
│       └── <component :is="effect.component" />  ← inject('labParams') 读写参数
├── <LabParamPanel />                        ← inject('labParams') 渲染控件
└── <CodeBlock :code="effect.code" :language="effect.language" />  ← 复用 CodeBlock.vue
```

**为什么用 provide/inject 而非 props**：Demo 组件深度嵌套在演示区容器内，逐层传 props 会导致中间层组件只为透传而存在。provide/inject 是 LabLayout 和 demo 组件之间的**私有协议**，不影响其他组件。

**响应性保证（关键）**：provide 的值必须用 Vue 的 `reactive()` 包装。inject 的组件**不得解构** params 对象——解构会断开响应性。必须通过 `inject('labParams')` 直接访问属性，如 `params.speed`。

provide/inject 的 key 约定：`'labParams'`（字符串字面量），所有 demo 组件和 LabParamPanel 使用同一个 key。

**Suspense + v-if 修复说明**：Vue 3 的 `<Suspense>` 检测的是 default slot 内组件的 `setup()` 返回的 Promise。如果 `v-if` 放在 `<component>` 上，Suspense 在 `v-if` 为 false 时不会触发 fallback，在 `v-if` 变为 true 时也不会重新检测异步状态。正确做法是将 `v-if` 放在 `<Suspense>` 本身。

### 3.7 Demo 组件生命周期约定

每个 demo 组件必须实现统一的 cleanup 接口：

```ts
// 在 <script setup> 中
import { onUnmounted } from 'vue'

// 所有副作用（GSAP tween、rAF、事件监听、SVG animation）
// 必须在 onUnmounted 中清理
onUnmounted(() => {
  // 清理所有动画实例
  // 移除所有事件监听
  // 取消所有 rAF
})
```

**GSAP 特殊要求**：如果使用 `gsap.to()` / `gsap.from()`，必须在 cleanup 中调用 `.kill()` 或使用组件级 timeline 统一 kill。已有 `useStripeScrollAnimation` 等 composable 遵循此约定，demo 组件直接沿用。

**rAF 特殊要求**：如果使用 `requestAnimationFrame`，必须保存返回的 ID，在 cleanup 中调用 `cancelAnimationFrame(id)`。

**事件监听器特殊要求**：如果使用 `addEventListener`，必须保存 handler 引用，在 cleanup 中调用 `removeEventListener` 传同一个 handler 引用（匿名函数无法移除）。

### 3.8 CodeBlock 复用策略

项目已有 `src/components/blog/CodeBlock.vue`（带行号、hover 高亮、copy morph 动画、vs-light-surface global light）。

**LabCodeBlock.vue 不做新组件。** 直接在 LabLayout 中引入并使用 CodeBlock.vue，通过 props 适配 Lab 场景：

```vue
<CodeBlock
  :code="effect.code"
  :language="effect.language"
  :show-copy="true"
  :show-line-numbers="true"
/>
```

唯一差异：Lab 页不需要 `version` pill。通过不传 `version` prop 自然隐藏。

**复制反馈**：复制成功后 CodeBlock 内部显示 tooltip "已复制"，至少显示 1.5 秒。如果 CodeBlock.vue 当前没有这个反馈，AI 不得修改 CodeBlock.vue 添加——改为在 CodeBlock 外层包裹一个监听 copy 事件的 div，tooltip 由 LabLayout 控制。

**优势**：零重复代码、同一份 copy 按钮 morph 动画、同一份 global light 效果。

**约束**：AI 不得新建 `LabCodeBlock.vue`。如果发现项目中已有 `LabCodeBlock.vue`（可能是之前尝试残留），先删除再按本规范继续。

### 3.9 LabParamPanel Props 接口

```ts
// LabParamPanel.vue
interface Props {
  params: LabParam[]                              // 参数定义列表（来自注册表）
  modelValue: Record<string, string | number>     // 当前参数值 { [key]: value }
}
const emit = defineEmits<{
  'update:modelValue': [value: Record<string, string | number>]
}>()
```

Panel 内部对每个 param 渲染对应控件：
- `type: 'range'` → `<input type="range">` + 数值显示（必须显示当前值，如 `2.0`）
- `type: 'color'` → `<input type="color">`
- `type: 'select'` → `<select>` 或自定义下拉

修改时 emit `update:modelValue`。LabLayout 通过 `v-model` 绑定到 provide 的 params 对象。

Panel 右上角必须有"重置默认值"按钮，点击后 emit 一个包含所有参数默认值的对象。

### 3.10 Header isActiveRoute 修复

`Header.vue:165` 当前实现：

```ts
const isActiveRoute = (path: string) => {
  return route.path === path || (path !== '/' && route.path.startsWith(path))
}
```

**问题**：`/lab` 的 `startsWith` 检查会让 `/lab/aurora` 也高亮 `/lab` 链接。

**修复方案**：改为精确匹配前缀 + 分隔符校验：

```ts
const isActiveRoute = (path: string) => {
  if (route.path === path) return true
  if (path === '/') return false
  return route.path.startsWith(path + '/') || route.path.startsWith(path + '?')
}
```

**精确修改位置**：`Header.vue` 第 165-167 行。只改这 3 行，不动其他任何代码。

### 3.11 无效 ID Fallback

`/lab/:id` 传入的 ID 在注册表中找不到时，LabLayout 不渲染 demo 组件，改为渲染 `LabNotFound.vue`。

LabLayout 实现：

```ts
const route = useRoute()
const effect = computed(() => labRegistry.find(e => e.id === route.params.id))
```

```vue
<!-- LabLayout.vue template -->
<Suspense v-if="effect">               <!-- v-if 在 Suspense 上 -->
  <template #default>
    <component :is="effect.component" />
  </template>
  <template #fallback>
    <div class="lab-loading">加载效果中...</div>
  </template>
</Suspense>
<LabNotFound v-else :id="route.params.id as string" />
```

路由层面不添加额外 catch-all，由 LabLayout 组件内判断。原因：`/:pathMatch(.*)*` 已覆盖所有未匹配路径，Lab 专属的 404 应该在 Lab 布局内处理以保持导航栏和面包屑。

### 3.12 结构化数据规范

每个 demo 页（`/lab/:id`）需要 JSON-LD 结构化数据，通过 DOM API 注入（见项目规则 3.2）。

**注入时机**：`LabLayout.vue` 的 `onMounted` 中创建 `<script type="application/ld+json">` 并 append 到 `document.head`。`onUnmounted` 中移除。

**Schema 格式**：

```ts
// LabLayout.vue 中
const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: effect.value?.name ?? '效果演示',
  description: effect.value?.description ?? '',
  url: `https://${location.host}/lab/${route.params.id}`,
  isPartOf: {
    '@type': 'WebSite',
    name: '效果实验室',
    url: `https://${location.host}/lab`,
  },
}))

onMounted(() => {
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(structuredData.value)
  document.head.appendChild(script)

  onUnmounted(() => {
    script.remove()
  })
})
```

**约束**：`structuredData` 函数不得访问 `window` 或 `document`。URL 构造在 `onMounted` 中完成（运行时才有 `location.host`）。PRD 3.4 的注册表校验脚本也要检查每个 effect 的 `description` 不超过 100 字符。

### 3.13 错误边界与降级

#### 3.13.1 Demo 组件加载失败

动态 import 可能失败（网络问题、文件不存在）。使用 Vue 3.2+ 的 `<Suspense>` + fallback：

```vue
<Suspense v-if="effect">            <!-- v-if 在 Suspense 上，不在 component 上 -->
  <template #default>
    <component :is="effect.component" />
  </template>
  <template #fallback>
    <div class="demo-loading">加载中...</div>
  </template>
</Suspense>
```

如果 `effect.component` 的 import 抛错，Vue 会渲染 fallback。无需额外 catch — Vue 的 Suspense 内置处理。

**超时降级**：Suspense fallback 显示"加载中..."超过 5 秒后，显示"加载超时，请检查网络连接" + 重试按钮。

实现方式：在 Suspense fallback 中加一个 `setTimeout`，5 秒后切换状态显示超时 UI。

#### 3.13.2 Demo 组件运行时崩溃

如果 demo 组件内部抛出未捕获异常，**不导致整页白屏**。LabLayout 使用 `onErrorCaptured` 捕获子组件错误：

```ts
const hasError = ref(false)

onErrorCaptured((err) => {
  console.error('Demo component error:', err)
  hasError.value = true
  // 返回 false 阻止错误继续冒泡
  return false
})
```

```vue
<!-- template -->
<demo-component v-if="!hasError" />
<div v-else class="demo-error">
  <p>此效果加载失败，请尝试刷新页面</p>
</div>
```

#### 3.13.3 参数越界

用户通过 LabParamPanel 调节参数时，如果 demo 组件内部参数计算产生非法值（如负数、NaN），demo 组件必须自身做 clamp。LabParamPanel 不负责验证——它只负责渲染控件和 emit 值。

### 3.14 首个任务精确规格（Phase 1 Task 1.1-1.5）

AI 开始实施时，**第一个任务组（1.1-1.5）的精确规格如下**。

#### 3.14.1 创建的文件

**新建** `src/views/Lab/LabIndex.vue`：
```vue
<!--
  PRD 锚定：§3.14.1 LabIndex.vue 精确规格
  Phase：1
  Task：1.1
-->
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

**新建** `src/views/Lab/LabLayout.vue`：
```vue
<!--
  PRD 锚定：§3.14.1 LabLayout.vue 精确规格
  Phase：1
  Task：1.1
  关键约束：
  - provide('labParams') 必须用 reactive() 包装（§3.6）
  - <Suspense> 的 v-if 在 Suspense 上（§0.2 禁令 #10）
  - 不导入 useThemeStore（§0.2 禁令 #3）
  - CodeBlock 不传 version prop（§3.8）
-->
<script setup lang="ts">
import { computed, reactive, provide } from 'vue'
import { useRoute } from 'vue-router'
import { labRegistry } from '@/config/labRegistry'
import SEOHead from '@/components/common/SEOHead.vue'
import CodeBlock from '@/components/blog/CodeBlock.vue'
import LabNotFound from './LabNotFound.vue'

const route = useRoute()
const effect = computed(() => labRegistry.find(e => e.id === route.params.id))

// provide 必须是 reactive() 包装的对象，inject 的组件不得解构
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
    <Suspense>                          <!-- v-if 在 Suspense 上 -->
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

**新建** `src/views/Lab/LabNotFound.vue`：
```vue
<!--
  PRD 锚定：§3.14.1 LabNotFound.vue 精确规格
  Phase：1
  Task：1.1
-->
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

#### 3.14.2 修改的文件

**修改** `src/router/index.ts`：
在 routes 数组中 About 路由之后、`/:pathMatch(.*)*` 之前，插入 `/lab` 和 `/lab/:id` 两条路由（见 3.2 的代码块）。

**修改** `src/components/common/Header.vue`：
1. 第 157-161 行 `navItems` 数组，在 `{ name: '博客', path: '/blog' }` 之后添加 `{ name: '效果实验室', path: '/lab' }`
2. 第 165-167 行 `isActiveRoute` 函数，替换为精确匹配版本（见 3.10）

#### 3.14.3 不创建的文件

- **不创建** `LabCodeBlock.vue` — 复用 `CodeBlock.vue`
- **不创建** `src/assets/styles/lab-demo-utils.css` — 等有 demo 超过 80 行 scoped style 时再创建
- **不创建** `src/composables/useLabDemo.ts` — 等实际需要共享逻辑时再创建

#### 3.14.4 创建完立即执行的检查

```
1. npm run lint — 0 errors
2. npm run build — 成功
3. 浏览器访问 /lab — 看到占位页面（标题 + 描述）
4. 浏览器访问 /lab/nonexistent — 看到 404 页面
5. 浏览器访问 / — 导航栏显示"效果实验室"链接，能点击
6. 浏览器访问 /lab/aurora — 看到"效果不存在"（注册表还没填，这是预期的）
7. 浏览器访问 /lab/aurora → 点击导航栏"博客" → 确认"效果实验室"不再高亮（isActiveRoute 修复验证）
8. 浏览器 DevTools → Network → 确认无 dark mode 相关 class 切换
```

**全部通过后才进入 Phase 2。**

### 3.15 阶段间验证门

每个 Phase 完成后，必须通过以下验证才能进入下一 Phase。验证失败的 Phase 不得跳过后继续。

#### Phase 1 验证门

- [ ] `/lab` 可访问，显示标题 + 描述（骨架占位）
- [ ] `/lab/:id` 对不存在的 ID 显示 LabNotFound（非白屏）
- [ ] 导航栏 `/lab` 链接正常
- [ ] Header isActiveRoute 修复验证：`/lab/aurora` 不高亮 `/lab` 链接
- [ ] `scripts/validateLabRegistry.ts` 通过（骨架阶段，只校验格式）
- [ ] `npm run lint` 0 errors
- [ ] `npm run build` 成功
- [ ] 无 `LabCodeBlock.vue` 文件
- [ ] 无 `dark:` 类出现在 Lab 页面

#### Phase 2 验证门（每批 4 个 demo 后检查一次）

- [ ] 新 demo 页面可访问，效果运行
- [ ] 参数面板可调节，数值实时显示
- [ ] 代码块正确展示
- [ ] 移动端（375px）正常
- [ ] `prefers-reduced-motion` 降级
- [ ] `npm run lint` 0 errors
- [ ] 无新的 `<style scoped>` 超过 80 行
- [ ] `scripts/validateLabRegistry.ts` 通过（文件存在校验）

#### Phase 3 验证门

- [ ] Hero 无花哨效果
- [ ] `shaderPalette.ts` 已删除
- [ ] 全局搜索无 `#7B4EED` / `#F03880` / `#0052FF` 硬编码色值
- [ ] `npm run lint` 0 errors

### 3.16 Phase 测试文件规范

每个 Phase 对应一个测试文件，在 Phase 开始前由 PRD 定义存在。AI 不得在实施完成后"补写"测试。

**文件位置**：`tests/unit/lab/phase1.spec.ts`、`phase2.spec.ts`、`phase3.spec.ts`

**文件内容**：每个 `it()` 块对应 PRD 该 Phase 验证门中的一个检查项。测试必须是可执行的——使用 `@vue/test-utils` mount / shallowMount，或 router push，或 grep 文件系统。

**执行时机**：
- Phase 1 测试在 Phase 1 所有任务完成后、进入 Phase 2 之前执行
- Phase 2 测试在每批 4 个 demo 完成后执行
- Phase 3 测试在 Phase 3 所有任务完成后执行

**失败处理**：任何测试失败 → 返回修复，不得跳过。不得修改测试使 failing 的测试 pass——必须修代码。

**审计测试**：`tests/unit/lab/audit-trail.spec.ts` 读取 PRD 的变更记录表，确认每个 Phase 的所有任务 ID 都在变更记录中出现。如果 AI 跳过了某个任务没写变更记录，这个测试会失败。

---

## 4. Demo 实现规范

### 4.1 每个 Demo 组件必须满足

1. **自包含**：不依赖外部数据，所有状态内部管理
2. **可交互**：效果必须是活的，不是静态截图
3. **有参数**：至少 1 个可调参数（速度、颜色、大小等）
4. **有代码**：提供对应的使用代码片段（通过注册表的 `code` 字段）
5. **响应式**：移动端正常显示
6. **prefers-reduced-motion**：检测并降级为静态帧
7. **生命周期清理**：`onUnmounted` 中清理所有动画/事件/rAF（见 3.7）
8. **单模式**：不输出任何 dark mode 样式
9. **触摸设备**：鼠标跟踪 composable 通过 `isTouch` 守卫

### 4.2 prefers-reduced-motion 降级策略

**不是 `animation: none`**（会导致布局塌陷），而是双层防御：

**第一层 — CSS-first（防止 mount 瞬间闪烁）**：

```css
/* src/assets/styles/lab-demo-utils.css */
@media (prefers-reduced-motion: reduce) {
  .lab-demo-container *,
  .lab-demo-container *::before,
  .lab-demo-container *::after {
    animation-play-state: paused !important;
  }
}
```

在 LabLayout 的 demo 容器上加 `lab-demo-container` class，这样所有 demo 的 CSS animation 在 reduced-motion 下自动暂停，**不需要等 JS 执行**。

**第二层 — JS 确认（防止 JS 驱动的动画继续运行）**：

```ts
const prefersReducedMotion = ref(false)

onMounted(() => {
  // 服务端渲染安全：只在客户端读取
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})
```

具体降级行为：
- CSS animation → `animation-play-state: paused`（第一层已处理）
- CSS transition → `transition: none`（跳过过渡，直接到位）
- GSAP → `gsap.globalTimeline.pause()` 或直接不执行 tween
- Canvas / rAF → 不启动循环
- `mousemove` 交互 → 不注册监听器

### 4.3 触摸设备禁用鼠标跟踪

使用 `useCard3D`、`useCardSpotlight` 等鼠标跟踪 composable 的 demo，必须通过 `useMobilePerformance` 的 `isTouch` 守卫：

```ts
const { isTouch } = useMobilePerformance()
// 如果 isTouch，不初始化 mousemove 监听
```

### 4.4 Demo 组件模板

```vue
<!--
  PRD 锚定：§4.4 Demo 组件模板
  Phase：2
  关键约束：
  - inject('labParams') 后不解构，直接访问属性
  - onUnmounted 中清理所有副作用（§3.7）
  - 不输出 dark: 样式（§0.2 禁令）
  - 不使用 any 类型（§0.2 禁令）
-->
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
import { useMobilePerformance } from '@/composables/useMobilePerformance'

// 触摸设备检测
const { isTouch } = useMobilePerformance()

// 从 LabLayout 读取参数（直接访问，不解构，保持响应性）
const params = inject<Reactive<Record<string, string | number>>>('labParams')

// 参数状态（demo 自行管理的内部状态）
const speed = ref(2)
const colorTheme = ref('blue')

// 效果逻辑（CSS animation / GSAP / Canvas 等）
// ... effect implementation ...

// 清理（见 3.7）
onUnmounted(() => {
  // 清理所有动画、事件、rAF
})
</script>

<template>
  <div class="demo-container">
    <!-- 效果演示 -->
    <div class="demo-preview">
      <!-- effect markup -->
    </div>

    <!-- 参数面板（LabLayout 通过 provide/inject 自动注入，此处无需手动渲染） -->
  </div>
</template>
```

### 4.5 CSS 体积上限

每个 demo 的 `<style scoped>` 不超过 80 行。超出时提取共享 utility class 到 `src/assets/styles/lab-demo-utils.css`。

### 4.6 Demo 组件命名约定

- 文件名：`PascalCase + Demo.vue`，如 `AuroraDemo.vue`
- `<script setup>` 中不得有 `export default`
- Props 必须用 TypeScript 接口定义（如有需要）
- 不得在 template 中使用 `v-html`（除非内容经过 sanitizeHtml）

### 4.7 CSS 新特性降级

使用 `@property`、`backdrop-filter`、`aspect-ratio` 等较新 CSS 特性的效果，必须在同一 `<style scoped>` 块内提供 `@supports` 降级样式。例如：

```css
.shine-border {
  border: 2px solid transparent;
  background-clip: padding-box;
}

/* 降级：不支持 @property 时使用静态渐变 */
@supports not (background: paint(something)) {
  .shine-border {
    border: 2px solid #e2e8f0;
  }
}
```

---

## 5. 设计规范

### 5.1 Lab 页面材质（单模式，亮色）

**全站 accent 统一为 `#2563EB`（蓝）。** Hero、Lab、现有组件共用同一 accent。

| 元素 | 样式 |
|------|------|
| 页面背景 | `bg-white` |
| 卡片 | `bg-white border border-slate-200 rounded-xl shadow-sm` |
| 圆角 | `rounded-xl`（12px）统一 |
| 字体 | Inter（已有） |
| 主 accent | `#2563EB`（蓝，全站统一） |
| 代码块 | `bg-slate-900 text-slate-100 rounded-lg font-mono text-sm` |
| 参数面板 | `bg-slate-50 border border-slate-200 rounded-lg` |
| 预览区 | `bg-white border border-slate-100 rounded-lg min-h-[200px]` |

### 5.2 Hero 极简风格

| 元素 | 样式 / 内容 |
|------|-----------|
| 背景 | 纯白 `#FFFFFF` |
| 标题 | `text-5xl font-bold tracking-tight text-slate-900` |
| 副标题 | `text-lg text-slate-500` |
| CTA | 主按钮渐变背景（蓝 `#2563EB`）+ 次按钮 outline |
| Marquee | 技术栈无限滚动条（纯 CSS animation），硬编码技术栈列表 |
| 间距 | generous padding，大量留白 |

**Hero Marquee**：使用硬编码的技术栈列表（如 "Vue 3 · TypeScript · Tailwind CSS · GSAP · Pinia · Vite"），与 demo #12 的 marquee 是**两个独立实现**，不共享组件。Hero 的 marquee 是静态展示，demo 的 marquee 是可交互的参数化版本。

### 5.3 NumberTicker 实现方式

AI 实施前先用 `Grep` 确认 `useGSAPAnimations` 是否导出数字滚动方法。搜索模式：

```bash
# 在项目根目录执行
grep -r "animateNumber\|countUp\|animateValue\|tween.*number\|number.*tween" src/composables/
```

**情况 A**：找到匹配方法（如 `animateNumber`）→ 直接调用。

**情况 B**：`useGSAPAnimations` 存在但没有数字滚动方法 → 在 `useGSAPAnimations` 内部新增方法，不改文件结构。

**情况 C**：`useGSAPAnimations` 不存在 → 新建 `src/composables/useNumberTicker.ts`（基于 rAF + ease-out，不引入新依赖）。

实现要点：
- `requestAnimationFrame` 循环，ease-out 缓动
- 数字格式化：千分位逗号
- 组件卸载时 `cancelAnimationFrame` 清理

### 5.4 组件复用优先级

当需要实现某个效果时，按以下顺序选择技术方案：

1. **纯 Tailwind + CSS**（优先，性能最好）
2. **项目已有的 composable**（`useCard3D`、`useCardSpotlight`、`useGSAPAnimations`、`useMobilePerformance`）
3. **原生 Canvas API**（粒子类效果）
4. **SVG 内联**（图案、图标）
5. **新建 composable**（最后 resort，且必须放在 `src/composables/` 下）

不得引入新 npm 包。

### 5.5 LabIndex 首屏体验

LabIndex 顶部必须有清晰的标题区域（见 3.5 wireframe），包含：
- 页面标题"效果实验室"
- 副标题"交互式前端效果演示 — 点击卡片实时体验，调节参数理解原理"
- 搜索框（带搜索图标）
- 分类筛选标签栏

卡片 hover 时显示微妙的视觉提示（如边框颜色变深 + "查看 →" 文字），帮助用户理解卡片可点击。

---

## 6. 技术约束

### 6.1 不引入新依赖

- 纯 CSS 效果：直接用 Tailwind + `<style scoped>`（≤80 行）
- 需要 JS 的：用现有 composables
- Canvas 效果：原生 Canvas API
- 代码高亮：复用已有 `CodeBlock.vue`（内部使用 highlight.js）

### 6.2 性能

- 每个 demo 在 `onUnmounted` 中清理动画/事件监听（见 3.7）
- Canvas 粒子数量上限 100
- CSS animation 使用 `will-change` 提示浏览器
- `prefers-reduced-motion` 下降级为静态帧（见 4.2，双层防御）
- 触摸设备禁用鼠标跟踪（见 4.3）
- 动态 import demo 组件，路由级别懒加载

### 6.3 代码规范

- 每个 demo 独立文件，不超过 200 行
- 共享逻辑提取到 composables
- Demo 组件命名：`XxxDemo.vue`
- `<style scoped>` 不超过 80 行
- 严格 TypeScript（noImplicitAny, strictNullChecks）
- 不得使用 `any` 类型

### 6.4 单模式约束

- 所有 Lab 组件不输出 `dark:` 变体
- 不读取 `useThemeStore`
- 不检测 `prefers-color-scheme`
- 不使用 CSS `var(--*)` 做颜色切换
- 已有暗色模式基础设施（`useThemeStore`、`dark:` 类）保留不动

### 6.5 provide/inject 约束

- `provide` 的值必须用 `reactive()` 包装
- `inject` 的组件**不得解构**——直接访问属性（如 `params.speed`，不是 `const { speed } = params`）
- inject key 统一为字符串字面量 `'labParams'`

---

## 7. 执行计划

### Phase 1：基础设施（1-2 天）

| # | 任务 | 文件 | 说明 |
|---|------|------|------|
| 1.1 | 创建目录结构 | `src/views/Lab/` | LabIndex.vue、LabLayout.vue、LabNotFound.vue、demos/ 空目录 |
| 1.2 | 创建注册表 | `src/config/labRegistry.ts` | LabEffect + LabParam 接口 + 12 条 Phase 1 注册（含 `language` 字段） |
| 1.3 | 创建共享组件 | `LabEffectCard.vue`, `LabParamPanel.vue` | LabCodeBlock 复用 CodeBlock.vue |
| 1.4 | 添加路由 | `src/router/index.ts` | `/lab` + `/lab/:id` + meta |
| 1.5 | 更新导航 | `Header.vue` | 添加 /lab 链接 + 修复 isActiveRoute |
| 1.6 | 搜索筛选 | `LabIndex.vue` | 搜索框 + 分类筛选标签 + 首屏标题区域 |
| 1.7 | 构建校验 | `scripts/validateLabRegistry.ts` | Phase 1 只校验格式，Phase 2 起校验文件存在 |

**Phase 1 验收门**：见 3.15 节。全部通过才进入 Phase 2。

### Phase 2：第一批 12 个 Demo（3-5 天）

按难度从低到高排序：

| 顺序 | 效果 | 技术 | 预估行数 | 难度 |
|------|------|------|---------|------|
| 1 | dot-pattern | SVG + CSS | 30 | 低 |
| 2 | grid-pattern | SVG + CSS | 30 | 低 |
| 3 | noise-texture | SVG feTurbulence | 20 | 低 |
| 4 | marquee | CSS animation | 40 | 低 |
| 5 | meteors | CSS animation | 60 | 低 |
| 6 | animated-gradient-text | CSS background-clip | 40 | 低 |
| 7 | number-ticker | useGSAPAnimations / rAF | 50 | 中低 |
| 8 | shine-border | CSS @property | 50 | 中低 |
| 9 | shimmer-button | CSS animation | 50 | 中低 |
| 10 | aurora | CSS gradient animation | 80 | 中 |
| 11 | spotlight | JS mousemove + useCardSpotlight | 80 | 中 |
| 12 | tilt-card | CSS transform + useCard3D | 80 | 中 |

**Phase 2 验收门**：每完成 4 个 demo 检查一次（见 3.15）。全部 12 个完成后进入 Phase 3。

### Phase 3：Hero 改造 + 材质统一（1-2 天）

| # | 任务 | 文件 | 说明 |
|---|------|------|------|
| 3.1 | Hero 极简确认 | `HeroSection.vue` | DOM 结构：纯白背景 + 大标题（`text-5xl font-bold`）+ 副标题 + 两个 CTA 按钮（主按钮蓝渐变背景、次按钮 outline）+ Marquee 技术栈滚动条（纯 CSS animation，硬编码技术栈列表） |
| 3.2 | 材质统一 | `FeaturedProjects.vue`, `TechStack.vue` 等 | 检查卡片/按钮样式对齐 MagicUI 风格（白底 + 细边框 + 圆角 + 微阴影） |
| 3.3 | 旧色清理 | 全局搜索 | 清理硬编码的旧 accent 色 |
| 3.4 | 删除 shaderPalette.ts | `src/design-system/tokens/shaderPalette.ts` | 加 @deprecated 注释后删除，删除前 grep 全项目确认无引用 |

**Phase 3 验收门**：见 3.15 节。

### Phase 4：第二批 8 个 Demo（后续迭代）

待 Phase 1-3 完成后根据优先级决定。

---

## 8. 验收标准

### 8.1 工程验收

- [ ] `npm run lint` 通过（0 errors）
- [ ] `npm run build` 通过（含注册表校验脚本）
- [ ] `/lab` 页面可访问，显示效果网格 + 搜索筛选 + 首屏引导
- [ ] 每个 demo 页面可访问，效果正常运行
- [ ] 无效 ID 路由渲染 LabNotFound（非白屏）
- [ ] 路由 `/lab/:id` 参数正确传递
- [ ] 移动端（375px）所有 demo 正常显示
- [ ] `prefers-reduced-motion` 下 CSS animation 通过 `animation-play-state: paused` 暂停（无 mount 闪烁）
- [ ] 触摸设备鼠标跟踪 composable 被禁用
- [ ] 导航栏 `/lab` 链接正确高亮，`/lab/aurora` 不误高亮 `/lab`
- [ ] Header `isActiveRoute` 修复验证通过
- [ ] `shaderPalette.ts` 已标记废弃并删除
- [ ] 所有 Lab 组件不输出 `dark:` 变体
- [ ] `scripts/validateLabRegistry.ts` 通过
- [ ] 无 `LabCodeBlock.vue` 文件
- [ ] JSON-LD 结构化数据正确注入
- [ ] `provide('labParams')` 使用 `reactive()` 包装
- [ ] demo 组件 `inject('labParams')` 后不解构
- [ ] `<Suspense>` 的 `v-if` 在 Suspense 上而非 component 上
- [ ] LabParamPanel range 控件显示当前数值
- [ ] LabParamPanel 有"重置默认值"按钮
- [ ] 使用 `@property` 的 demo 有 `@supports` 降级

### 8.2 视觉验收

- [ ] `/lab` 首页呈现网格卡片布局，每个卡片有效果缩略图占位
- [ ] 搜索框可过滤效果名称
- [ ] 分类筛选可切换效果分类
- [ ] 点击卡片进入 demo 页，效果实时运行
- [ ] 参数面板可调节效果参数，数值实时更新
- [ ] 代码块展示使用方式（复用 CodeBlock.vue）
- [ ] 面包屑显示 `效果实验室 > {name}`
- [ ] Hero 区域干净简洁，无花哨效果
- [ ] 全站卡片材质统一（白色底 + 细边框 + 圆角）

### 8.3 UX 验收

- [ ] LabIndex 首屏有标题 + 副标题引导
- [ ] 卡片 hover 有可点击的视觉提示
- [ ] 参数面板 range 类型显示当前数值
- [ ] 参数面板有"重置默认值"按钮
- [ ] 复制代码后显示"已复制" tooltip（≥1.5s）
- [ ] 搜索无结果时显示空状态 + 清空按钮
- [ ] Demo 加载超时（>5s）显示降级提示
- [ ] 移动端面包屑正常显示（不溢出）

---

## 9. 已确认决策

1. **导航位置**：主导航栏
2. **Hero 内容**：纯白背景 + 大标题（`text-5xl font-bold`）+ 副标题 + 两个 CTA（主按钮蓝渐变 + 次按钮 outline）+ Marquee 技术栈滚动条（硬编码列表，纯 CSS）
3. **accent 色**：全站统一蓝 `#2563EB`（不换紫色）
4. **Demo 代码高亮**：复用项目已有 CodeBlock.vue（highlight.js 懒加载 core + 按需注册语言，gzip ~49KB）
5. **Lab 页纳入 SEO**：每个 demo 页渲染 `<SEOHead>` + JSON-LD 结构化数据
6. **暗黑模式**：全局单模式（亮色），Lab 不输出任何 dark 样式
7. **LabCodeBlock**：直接复用 `CodeBlock.vue`，不新建组件
8. **NumberTicker**：先 grep 确认 `useGSAPAnimations` 方法名；不存在则新建 `useNumberTicker` composable（rAF 实现）
9. **参数传递**：LabLayout → demo 组件通过 provide/inject，provide 用 `reactive()` 包装，inject 后不解构
10. **Header isActiveRoute**：修复 startsWith 误匹配 bug
11. **无效 ID**：LabLayout 内渲染 LabNotFound，路由层不做额外处理
12. **provide/inject key**：`'labParams'`（字符串字面量，所有 demo 和 Panel 统一）
13. **结构化数据注入**：通过 DOM API 在 onMounted 中注入，onUnmounted 中移除
14. **错误边界**：使用 Vue onErrorCaptured 捕获 demo 组件运行时错误
15. **Suspense + v-if**：v-if 放在 `<Suspense>` 上，不在 `<component>` 上
16. **注册表校验**：Phase 1 只校验格式，Phase 2 起校验文件存在
17. **Hero marquee vs Demo marquee**：两个独立实现，Hero 用硬编码静态列表，demo 用参数化版本
18. **注册表 `language` 字段**：每个 effect 声明代码语言（vue/css/html），LabLayout 传给 CodeBlock
19. **参数面板**：range 显示当前值 + "重置默认值"按钮
20. **卡片缩略图**：渐变色彩占位块 + 效果名称，不做 mini demo
21. **复制反馈**：tooltip "已复制" 显示 ≥1.5 秒
22. **加载超时**：>5s 显示"加载超时，请检查网络连接" + 重试按钮
23. **CSS 新特性降级**：使用 @property 等新特性的 demo 必须有 @supports fallback
24. **移动端面包屑**：小屏下简化为"← 效果实验室"，避免换行溢出
25. **过程治理**：三层防御体系（PRD 自验证 → 实施过程锁死 → 全量验收），见 0.6
26. **完成定义**：五项全过才算完成（代码 + lint + 测试 + build + 变更记录），见第 13 节
27. **文件创建白名单**：通过 .claude/settings.local.json 权限控制，Phase 1 不得创建 Phase 2 文件

---

## 10. 术语表（Glossary）

| 术语 | 定义 |
|------|------|
| Demo | 单个效果的独立 Vue 组件，位于 `demos/` 目录 |
| 注册表（Registry） | `labRegistry.ts`，所有效果的元数据列表 |
| LabLayout | /lab/:id 的视图外壳，负责 SEO、面包屑、参数传递 |
| LabIndex | /lab 首页，展示效果网格 + 搜索筛选 |
| LabEffectCard | 网格中的单个效果卡片 |
| LabParamPanel | 参数调节面板 |
| provide/inject | Vue 3 组件间通信机制，LabLayout → demo 的参数传递方式 |
| shaderPalette.ts | 旧丝带方案的色板文件，Phase 3 删除 |
| MagicUI | 参考站点，76 个 MIT 开源效果组件 |
| Aceternity UI | 参考站点，30+ MIT 开源效果组件 |
| Morphin | 参考站点（付费），shader 效果 |
| SSR | Server-Side Rendering（本项目为静态站点，无 SSR） |
| JSON-LD | 结构化数据格式，通过 `<script type="application/ld+json">` 注入 |
| NFR | Non-Functional Requirements，非功能需求 |
| DoD | Definition of Done，完成定义 |
| 锚定注释 | 文件头部的 PRD 引用注释，防止上下文膨胀导致遗忘约束 |
| 审计轨迹 | 变更记录 + 审计测试，确保每个任务都执行且可追溯 |
| validate:lab | 全量检查 npm script，覆盖 lint / build / test / 一致性检查 |

---

## 11. 附录（Appendix）

### 附录 A：参考实现链接

| 效果 | 来源 | URL |
|------|------|-----|
| aurora | MagicUI | https://magicui.design/docs/aurora-background |
| grid-pattern | MagicUI | https://magicui.design/docs/animated-grid-pattern |
| dot-pattern | MagicUI | https://magicui.design/docs/dot-pattern |
| noise-texture | MagicUI | https://magicui.design/docs/noise |
| meteors | MagicUI | https://magicui.design/docs/meteors |
| spotlight | Aceternity UI | https://ui.aceternity.com/components/spotlight |
| tilt-card | Aceternity UI | https://ui.aceternity.com/components/tilt-card |
| magic-card | MagicUI | https://magicui.design/docs/magic-card |
| shine-border | MagicUI | https://magicui.design/docs/shine-border |
| shimmer-button | MagicUI | https://magicui.design/docs/shimmer-button |
| number-ticker | MagicUI | https://magicui.design/docs/number-ticker |
| marquee | MagicUI | https://magicui.design/docs/marquee |

### 附录 B：相关文档

- `.ai/PROJECT_CONSTITUTION.md` — 项目宪法（任务分类、完成定义）
- `src/design-system/tokens/` — 设计系统 token 目录
- `src/composables/` — 现有 composable 列表
- `docs/prd-shader-design-system.md` [OBSOLETE] — 旧丝带方案
- `docs/prd-effects-integration.md` [OBSOLETE] — 旧效果集成方案
- `docs/stripe-deep-research.md` — 技术调研参考

### 附录 C：版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| v0.1 | 2026-07-13 | 初始版本 |
| v0.2 | 2026-07-13 | 暗黑模式政策、遗留文件处置、Header 修复、无效 ID fallback、CodeBlock 复用策略 |
| v0.3 | 2026-07-13 | AI 约束、任务级验收、首个任务精确规格、错误边界、结构化数据、阶段验证门、依赖地图、CSS 体积上限、Demo 命名约定 |
| v0.4 | 2026-07-13 | 用户画像、用户故事、范围声明、假设与约束、非功能需求、风险登记册、上线标准、术语表、附录、v0.4 审查修复（Suspense v-if、provide 响应性、版本号、段落编号、accent 统一、reduced-motion CSS-first 防御、参数面板 UX、marquee 身份澄清、注册表 language 字段、校验脚本分阶段、CSS 新特性降级、成功指标、首屏引导、移动端面包屑）、过程治理体系（§0.5 操作自检 + §0.6 三层防御 + §3.16 Phase 测试规范 + §13 完成定义 + 锚定注释 + 审计轨迹 + 人类审查触发点） |

---

## 12. 变更记录

| 日期 | 任务 | 变更内容 | 验证 |
|------|------|---------|------|
| 2026-07-13 | PRD 审查 | v0.1 → v0.3：新增 AI 约束、任务级验收、首个任务精确规格、错误边界、结构化数据规范、阶段验证门、依赖地图、CSS 体积上限、Demo 命名约定 | — |
| 2026-07-13 | PRD 审查 | v0.3 → v0.4：新增用户画像、用户故事、范围声明、假设与约束、非功能需求、风险登记册、上线标准、术语表、附录 | — |
| 2026-07-13 | PRD 审查 | v0.4 审查修复：①版本号改为 v0.4；②段落编号修好（两个 section 10 合并为 10+11）；③accent 色统一口径（C6 约束 + 5.1 明确）；④A4 增加 grep 验证步骤；⑤4.2 增加 CSS-first animation-play-state 防御；⑥Phase 3 加 Hero DOM 结构规格；⑦3.5 加首屏引导描述；⑧3.9 加数值显示 + 重置按钮；⑨3.5 明确卡片缩略图方案（渐变占位）；⑩3.8 加复制 tooltip 反馈；⑪3.13.1 加 5s 超时降级；⑫3.6 加 provide 必须 reactive() + inject 不得解构；⑬3.14.1 修复 Suspense v-if 位置；⑭3.4 校验脚本分两阶段；⑮5.2 明确 Hero/Demo marquee 为两个独立实现；⑯3.3 LabEffect 加 language 字段；⑰4.7 加 @supports 降级要求；⑱1.13 加 R9/R10 风险；⑲8.3 加 UX 验收节；⑳0.5 操作前自检清单；㉑0.6 过程治理体系（三层防御 + 9 条机制）；㉒3.16 Phase 测试文件规范；㉓13 完成定义；㉔锚定注释规范；㉕审计轨迹机制；㉖5 条新增决策（25-27） | — |

---

## 13. 完成定义（Definition of Done）

> **任何一个任务标记为"完成"之前，必须同时满足以下五项。五项缺一不可。AI 不得在只完成第 1 项时声称任务完成。**

| # | 标准 | 验证方式 |
|---|------|---------|
| D1 | 代码写完 | 文件存在，内容符合 PRD 规格 |
| D2 | lint 通过 | `npm run lint` → 0 errors |
| D3 | 对应测试通过 | `npm run test -- tests/unit/lab/phaseN.spec.ts` → 全过 |
| D4 | build 通过 | `npm run build` → 成功 |
| D5 | 变更记录已写入 | PRD 末尾变更记录表追加了当前任务的条目 |

**AI 报告"任务完成"时的标准话术**：
```
任务 X.X 完成。
验证：lint 0 errors ✓ | test 全过 ✓ | build 成功 ✓ | 变更记录已写入 ✓
```

**违反 DoD 的典型行为及处理**：

| 行为 | 问题 | 处理 |
|------|------|------|
| "代码写完了，先继续下一个" | 缺 D2-D5 | 拒绝，回到当前任务补完 |
| "build 报错但我觉得不影响" | D4 不通过 | 修 build，不管 AI 觉得影不影响 |
| "测试太细了先跳过" | D3 不通过 | 不得跳过测试，修代码让测试过 |
| "变更记录之后再补" | D5 缺失 | 现在补，审计测试会检查 |
| "lint 有警告不是错误" | D2 不通过 | 警告也修，0 warnings 才是目标 |

---

## 14. 工具配置建议

### 14.1 .claude/settings.local.json 权限白名单

```
Phase 1 允许操作的文件：
  Write: src/views/Lab/**/*
  Write: src/config/labRegistry.ts
  Write: src/components/lab/**/*
  Write: src/router/index.ts
  Write: src/components/common/Header.vue
  Write: src/assets/styles/lab-demo-utils.css
  Write: scripts/validateLabRegistry.ts
  Write: tests/unit/lab/**/*
  Write: docs/prd-lab-effects/registry-spec.ts
  Write: docs/prd-lab-effects/validate-prd.ts
  Edit: src/router/index.ts
  Edit: src/components/common/Header.vue

Phase 1 禁止操作的文件（deny 列表）：
  Write: src/composables/useLabDemo.ts              ← Phase 2 才需要
  Write: src/views/Lab/demos/**/*                   ← Phase 2 才需要
  Write: src/components/lab/LabCodeBlock.vue        ← 永久禁止
  Edit: src/design-system/tokens/shaderPalette.ts   ← 绝对禁区
  Edit: src/composables/useStripeGradient.ts        ← 绝对禁区
```

Phase 2 开始时更新白名单，加入 `demos/` 写入权限。

### 14.2 package.json 脚本

```json
{
  "scripts": {
    "validate:lab": "npm run validate:prd && npm run lint && npm run build && npm run test -- tests/unit/lab/ && node scripts/validateLabRegistry.ts",
    "validate:prd": "tsx docs/prd-lab-effects/validate-prd.ts"
  }
}
```

`validate:lab` 是**唯一的验收入口**——一个命令跑完所有检查，任何一项失败 → 红色输出。

### 14.3 CI 集成（可选）

如果项目有 CI pipeline，在 PR merge 前加一步：

```yaml
# .github/workflows/lab-validation.yml
- name: Validate Lab
  run: npm run validate:lab
```

确保没有人能绕过验证直接合并。
