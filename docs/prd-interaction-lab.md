# PRD — 交互实验室

> 版本：v0.6.1
> 状态：Phase 0–4 已完成并正式发布；进入发布后真实会话观察
> 日期：2026-07-15
> 取代：`docs/archive/prd-lab-effects-v0.4.md`
> 审批：2026-07-15 用户授权 Codex 持续实现、代跑验收并发布；正式生产冒烟已通过

## 1. 产品摘要

交互实验室是 AI Native Developer Portfolio 中集中展示前端交互、视觉实现、性能意识和工程质量的公开专区。它服务两类同等重要的用户：希望在 30–60 秒内判断候选人能力的招聘经理，以及希望理解并复用实现的前端开发者。

首发 MVP 仍为 12 个效果，但 v0.6 不再把“数量完成”视为产品完成。Phase 3.5 先修复体验缺陷、补齐使用场景与工程说明，并把精选效果应用到真实作品集页面；只有站点所有者确认“定位清楚、效果有说服力、内容可复用”后才能进入 Phase 4。

### 1.1 当前优先级

- 任务级别：P1。
- Lab Phase 0–4 已完成并发布，发布后观察继续作为运营任务。
- Projects 案例叙事已解除暂停，可作为独立 P1 推进，不改变 Lab 的冻结 ID 与发布门。
- 实施前置：Phase 0 完成全站单一亮色迁移。
- 当前阶段：Phase 4 正式发布已完成；等待真实流量累计至少 50 次合格 Lab 会话后评估指标。

### 1.2 产品目标

1. 让招聘经理快速看见 UI、交互、性能和工程能力，而非只看静态页面。
2. 让开发者能够调节参数、理解使用方式并复制真实可运行源码。
3. 建立可持续增加 Demo 的注册、预览、测试和发布流程。
4. 保持首页作品集为核心转化路径，交互实验室作为技术能力入口。
5. 让至少一组 Lab 效果在 Hero、Projects、CTA 或项目指标中真实落地，证明效果不是孤立玩具。
6. 让用户无需阅读源码即可理解每个 Demo 的适用场景、搭配方式、技术实现和性能边界。

### 1.3 Out of Scope / 非目标

- 不引入用户账号、收藏、评论、参数保存或用户上传。
- 不提供后端效果渲染 API。
- 不引入新的动画或 UI 依赖。
- Phase 3.5 不增加第 13 个 Demo；后续按每批最多 4 个进入 Phase 5 Backlog。
- 不支持暗色模式或主题切换。
- 不复制付费或非开源站点的代码。
- 不以同时堆叠多个动画制造“高级感”；真实页面必须受动画预算约束。

### 1.4 Phase 3.5 Problem Statement

2026-07-15 的站点所有者验收确认搜索、筛选、参数、复制、源码、移动端和错误恢复均可完成，但未形成足够强的产品说服力：目标用户不够清楚，效果被理解为普通 CSS 展示，首页 Hero 与整体视觉偏淡，Demo 缺少适用场景、搭配建议、技术要点和真实性能边界。另有数字动画感知时长、重置按钮布局位移和复制反馈过重等 P2 体验问题。

因此当前问题不是“再做多少个效果”，而是现有能力没有在真实作品集中形成可感知、可解释、可复用的证据链。若直接公开或扩充数量，会放大内容浅、视觉弱和维护面增长的问题。

### 1.5 Phase 3.5 Solution

1. 修复已确认的 P2 体验问题，并对未复现问题保留证据门，不做猜测式全局修复。
2. 扩展结构化元数据，为每个 Demo 提供适用场景、搭配建议、实现要点、技术栈、性能与无障碍说明。
3. 选择现有 Demo 作为旗舰效果，在 Hero、Projects、CTA 与项目指标中真实复用；Lab 与作品集页面共享同一份效果实现。
4. 建立首屏动画预算、触摸降级和 reduced-motion 规则，以组合与层级提升表现，不靠动画数量堆叠。
5. 用站点所有者验收作为个人项目发布门，JoyCode/Claude 作为补充代理证据；保留未来独立五人研究债务并明确不宣称其已发生。

### 1.6 Phase 3.5 User Stories

1. 作为招聘经理，我希望 10 秒内理解 Lab 展示的是可复用交互与工程质量，从而准确判断候选人的能力范围。
2. 作为招聘经理，我希望在首页第一屏看到克制但有辨识度的动态视觉，从而形成比普通模板站更强的第一印象。
3. 作为招聘经理，我希望在真实项目卡片和指标中看到 Lab 能力被使用，从而确认这些效果不是孤立 Demo。
4. 作为前端开发者，我希望知道效果适合什么场景，从而判断是否值得采用。
5. 作为前端开发者，我希望看到效果的搭配建议和不适用情况，从而避免错误组合。
6. 作为前端开发者，我希望看到技术栈、实现要点和性能边界，从而估算接入成本。
7. 作为前端开发者，我希望调参时动画从当前状态平滑过渡，从而理解参数变化而不是看到跳回起点。
8. 作为移动端用户，我希望条件按钮出现或消失时页面不跳动，从而稳定操作参数。
9. 作为复制源码的用户，我希望按钮就地确认成功或失败且不推动内容，从而明确操作结果。
10. 作为 reduced-motion 用户，我希望真实页面与 Lab 都提供稳定静态表现，从而不被动画阻碍。
11. 作为站点所有者，我希望新增效果按小批次扩展并必须有复用价值，从而长期沉淀自己的效果库。
12. 作为维护者，我希望 Lab 与真实页面共享同一效果实现，从而避免两份动画逻辑漂移。
13. 作为维护者，我希望每个效果都有结构化说明和可验证边界，从而让后续 AI 能安全扩展内容。
14. 作为站点所有者，我希望个人项目验证例外被如实记录，从而可以发布但不制造虚假用户研究。

## 2. 已确认产品决策

| 决策 | 结论 |
|---|---|
| 全站主题 | 单一亮色，完整移除暗色模式基础设施 |
| 主视觉 | 白色界面 + `#2563EB` 品牌蓝 |
| 专区名称 | 交互实验室；路由保持 `/lab` |
| 当前 P1 | Lab 发布完成；Projects 可恢复独立迭代 |
| MVP 数量 | 12 个固定效果 |
| 用户优先级 | 招聘经理与前端开发者同等重要 |
| 代码展示 | 动态使用方式 + 展开后的完整真实源码 |
| 源码来源 | 实际运行的 Demo 文件通过 Vite `?raw` 读取 |
| 授权 | 首发源码统一 MIT；仅原创、clean-room 或 MIT 兼容实现 |
| 导航高亮 | `/lab/:id` 保持“交互实验室”高亮 |
| 首页入口 | Projects 主 CTA + Lab 次 CTA |
| 卡片预览 | 预生成并纳入版本控制的静态预览图，不运行 mini Demo |
| 不兼容浏览器 | 静态首帧或简化效果 + 兼容性说明 |
| 发布 | 未公开预发布 → 正式公开两阶段 |
| 数据 | 用户明确同意后才加载 GA4，尊重 Do Not Track |
| Phase 3.5 策略 | 旗舰质量与真实页面复用优先，不增加第 13 个 Demo |
| 真实页面应用 | Hero、Projects、CTA、项目指标按动画预算选择性复用现有效果 |
| 详情内容 | 每个 Demo 必须说明场景、搭配、实现、技术栈、性能与无障碍 |
| 个人项目验证 | 1 名站点所有者验收 + T3-Proxy 补充；不得宣称为五人研究 |
| 后续扩展 | Phase 5 每批最多 4 个，必须证明复用价值并重新过门禁 |

## 3. 用户与核心场景

### 3.1 招聘经理 / 技术负责人

- 在首页看到“探索交互实验室”次 CTA。
- 在首页 Hero 与项目卡片中先看到效果的真实应用，再进入 Lab 查看实现。
- 在 Lab 首页用预览图和能力说明快速判断视觉与技术范围。
- 打开 2–3 个 Demo，看到效果、性能降级和工程说明。
- 可继续前往 Projects 或 Contact，不被 Lab 截断核心转化路径。

### 3.2 前端开发者

- 按名称、分类或标签定位效果。
- 调节参数并立即看到预览和“使用方式”同步变化。
- 展开并复制与实际运行一致的完整 Vue SFC 源码。
- 查看适用场景、搭配建议、技术栈、性能、兼容性、许可证和使用限制。

### 3.3 维护者

- 新增一个自包含 Demo、注册元数据和预览图。
- 为每个 Demo 维护结构化使用说明，不把内容硬编码在页面组件中。
- 通过统一验证确保路由、源码、预览和测试一一对应。
- 不在注册表重复维护完整源码字符串。

## 4. MVP 范围

### 4.1 首发 12 个效果

| ID | 名称 | 分类 | 主要技术 |
|---|---|---|---|
| `aurora` | Aurora 极光背景 | background | CSS gradient animation |
| `grid-pattern` | 网格底纹 | background | SVG + CSS |
| `dot-pattern` | 点阵背景 | background | SVG |
| `noise-texture` | 噪点纹理 | background | SVG `feTurbulence` |
| `meteors` | 流星效果 | background | CSS animation |
| `spotlight` | 卡片追光 | card | Pointer + CSS |
| `tilt-card` | 3D 倾斜卡片 | card | CSS transform + pointer |
| `magic-card` | 魔法卡片 | card | Gradient + pointer |
| `shine-border` | 边框光泽 | button | CSS conic-gradient |
| `shimmer-button` | 按钮扫光 | button | CSS animation |
| `number-ticker` | 数字滚动 | data | `requestAnimationFrame` |
| `marquee` | 无限滚动 | layout | CSS animation |

`animated-gradient-text` 不属于 MVP。其现有未完成实现和注册项在文档批准后的实现阶段移除，并记录到 Phase 5 Backlog。

### 4.2 MVP 外

打字机、单词轮换、粒子、边框光束、Dock、Bento Grid、文字揭示、渐变文字等效果只进入 Backlog，不进入首发数量、主导航文案或 SEO 描述。

## 5. 信息架构与体验

### 5.1 `/lab` 首页

- `SEOHead` 是 View 的第一个子元素。
- 页面标题使用“交互实验室”。
- 首屏文案必须直接表达“可调参数、可复用 Vue 源码、真实页面应用和工程边界”，不能只写“探索效果”。
- 提供搜索、分类和标签筛选。
- 卡片展示统一尺寸、预生成并纳入版本控制的静态预览图、名称、分类和技术标签。
- 卡片不运行实时 Demo。
- 搜索无结果时提供清空操作。
- 预发布阶段设置 `noindex`，且不进入主导航和 Sitemap。

### 5.2 `/lab/:id` 详情页

按以下顺序渐进披露：

1. 标题、能力摘要、分类和技术标签。
2. 实时 Demo 预览与参数面板。
3. “适用场景”和“不建议使用”边界。
4. “搭配建议”和站内真实应用入口。
5. 实现要点、技术栈、性能与无障碍说明。
6. 随参数变化的简短“使用方式”。
7. 默认折叠的完整 Vue SFC 源码。
8. 运行环境、依赖、兼容/降级、来源和 MIT 授权。

访问详情页时，主导航“交互实验室”保持高亮。无效 ID 渲染 Lab 专属 Not Found，并提供返回 Lab 首页的链接。

### 5.3 首页入口

- 主 CTA：查看作品集 → `/projects`。
- 次 CTA：探索交互实验室 → `/lab`。
- 两个 CTA 分别记录匿名点击事件，不以牺牲 Projects 转化换取 Lab 指标。
- Hero 只使用一组主动态视觉；辅助网格或噪点保持静态，确保标题和 CTA 对比度。
- Projects 卡片在桌面端最多启用一种 Pointer 效果，触屏与 reduced-motion 环境使用静态样式。
- 主 CTA 可使用一次性或低频扫光，不与边框旋转同时叠加；项目指标进入视口后才运行数字动画。

## 6. Implementation Decisions / 架构约束

### 6.1 View 保持为布局外壳

`LabIndex.vue` 与 `LabLayout.vue` 只负责：

1. 首个子元素渲染 `SEOHead`。
2. 组合对应业务组件。
3. 在 `onMounted` 中滚动到页面顶部。

搜索、筛选、参数状态、异步错误和结构化数据组装不得直接放在 View 中。

### 6.2 数据与类型

- 内容元数据存放在 `src/assets/data/lab-effects.json`。
- 公开类型存放在 `src/types/lab.ts`。
- `src/config/labRegistry.ts` 只组合元数据、异步组件 loader、源码 raw import 和动态使用方式生成器。
- `language` 使用字面量联合类型，不得使用无约束 `string`。
- 注册表、Demo 文件和预览资产严格保持 12 项一一对应。
- 每条元数据除现有字段外，必须包含 `useCases`、`avoidWhen`、`pairings`、`stack`、`implementationNotes`、`performanceNotes`、`accessibilityNotes` 和 `usedIn`。
- `pairings` 只能引用已注册 Demo ID；`usedIn` 只记录真实存在的站内页面或组件，不写计划中的虚假应用。
- `id` 是稳定公开标识；正式发布后不得重命名。确需变更时必须保留重定向并升级 PRD 版本。

### 6.3 Demo 与源码单一事实来源

每个 Demo 是自包含 Vue SFC。注册表使用两种 import 指向同一文件：

```ts
component: defineAsyncComponent(() => import('@/views/Lab/demos/AuroraDemo.vue'))
source: () => import('@/views/Lab/demos/AuroraDemo.vue?raw')
```

完整源码来自 `?raw`，不得在注册表手写第二份源码。动态“使用方式”由纯函数根据当前参数生成，不修改完整源码文本。

被真实页面采用的旗舰效果仍保持一个 canonical SFC：Lab 和作品集页面消费同一实现，通过类型化 props、slot 或内容数据适配场景；不得复制 CSS、关键帧、Pointer 或 rAF 逻辑形成第二份实现。源码展示继续读取该 canonical SFC。

#### 可运行边界

“完整可运行源码”定义为：复制到支持 Vue 3 SFC 与 TypeScript 的宿主项目后，按照同页依赖说明即可运行。它不承诺脱离 Vue 或零配置运行；Tailwind CSS 不作为未声明的默认前提。

- 验收基线为 Vue 3.4、Vite 5、`@vitejs/plugin-vue` 5 与 TypeScript 5；Vite、Vue 插件和 TypeScript 属于宿主构建工具，不计入组件运行时依赖。
- 详情页必须用“运行时依赖”和“已验证宿主工具链”两个显式标签区分组件依赖与宿主构建环境。
- Demo 的核心效果只能依赖 Vue、浏览器原生 API、组件内样式，以及注册表明确声明的既有依赖；若使用 Tailwind CSS，必须在同页依赖和接入步骤中显式声明。
- Demo 不得依赖 Lab 私有组件、字符串注入上下文、项目 Store 或未展示的全局副作用。
- 若使用共享 composable 或设计 Token，详情页必须同时显示依赖路径、用途和最小接入步骤。
- 每个条目提供 `dependencies` 清单；无额外依赖时显式记录 `[]`。
- “复制完整源码”复制实际 SFC；“复制使用方式”只复制当前参数下的调用示例。
- 复制按钮必须保持稳定尺寸，并在按钮内短暂显示“✓ 已复制”或“复制失败”；完整说明通过 `aria-live` 通告。不得插入整块提示导致内容位移，也不得只提供 `sr-only` 文案。
- 验收测试必须把源码放入最小测试宿主中 mount，证明声明的依赖足以运行。

### 6.4 参数状态

- 参数默认值由注册元数据初始化。
- `LabDemoPage` 持有参数状态，数据通过类型化 props 向 Demo 和参数面板传递，事件向上更新。
- 任一参数变化必须驱动预览重新计算或重新启动动画；使用异步动画回调时，响应式依赖必须在同步阶段读取，并用组件级回归测试覆盖参数更新。
- NumberTicker 改值时从当前显示值过渡到新目标，不跳回 0；缓动在 50% 时长附近达到约 50% 路程，实际结束时间相对配置值容差为 ±100ms。
- “恢复默认值”始终保留布局占位；无改动时不可见、不可聚焦且不被辅助技术误报，不能通过 `v-if` 导致参数区跳动。
- 不使用字符串 `provide/inject` 作为默认方案。
- 切换 `id` 时必须重置参数、加载状态、错误状态和超时计时器。
- 参数面板负责按元数据限制范围；Demo 仍需对输入做 clamp 和类型收窄。

### 6.5 异步加载与错误边界

- 异步组件使用 `defineAsyncComponent`，明确 loading、timeout、error 和 retry 行为。
- `Suspense` 只负责加载态，不得被描述为 import rejection 的错误处理器。
- 运行时错误由业务组件的错误边界捕获，不能导致整页白屏。
- 所有定时器、rAF、Pointer/Resize 监听和 GSAP 实例必须在卸载时清理。
- 不得调用 `gsap.globalTimeline.pause()`；每个 Demo 只控制自己的动画实例。

### 6.6 SEO

- View 使用现有 `SEOHead`，`type="website"`。
- JSON-LD 由 `src/utils/structuredData.ts` 中的纯函数生成，通过 `structuredData` prop 交给 `SEOHead` 注入。
- 生成器不访问 `window` 或 `document`，URL 由调用方传入。
- Sitemap 生成器从 Lab 元数据读取正式发布的 12 个路径。
- 预发布阶段所有 Lab 页面输出 `robots=noindex,nofollow`，并在 `robots.txt` 临时禁止 `/lab`；正式发布时同时移除两处限制。
- `SEOHead` 若缺少 robots 能力，Phase 1 必须扩展其类型化 prop；不得由 View 直接操作 `<head>`。

### 6.7 单一亮色设计

- 全站只保留亮色视觉模式，主 accent 为 `#2563EB`。
- 新代码不增加 `dark:`、主题切换分支、`prefers-color-scheme` 或主题 Store 依赖。
- 颜色、间距、阴影和圆角通过 Tailwind 配置或设计 Token 使用，不在组件散落硬编码。
- Phase 0 结束前，既有暗色代码视为受控迁移遗留；不得新增或扩展。

### 6.8 可维护性与变更控制

- Phase 3.5 的 12 个 ID 与公开路由继续冻结；v0.6 只提升深度、复用和真实页面表现。
- 新增、删除或替换 Demo、改变授权策略、重新引入主题或改变公开发布流程，必须升级 PRD 版本并重新审批。
- 参数、兼容性、依赖和授权由结构化元数据驱动；页面不得维护平行常量表。
- 共享逻辑只有在至少两个 Demo 产生真实重复后才提取，避免预先抽象。
- 每个 Demo 应能独立删除，不要求修改其他 Demo；注册表和 Sitemap 校验负责暴露删除后的残留引用。

## 7. 预览、兼容性与授权

### 7.1 静态预览

- 使用现有 Playwright 在固定 viewport、固定参数和确定性时间点生成 WebP 预览。
- 预览资产纳入版本控制，构建不实时启动浏览器生成图片。
- CI 校验 12 个正式条目均存在预览资产。
- 预览图提供描述效果本身的替代文本。
- 预览 manifest 记录 Demo ID、生成参数和源码摘要；源码摘要变化但预览未更新时 CI 失败。
- 动画类 Demo 必须定义代表帧时间或测试钩子；不得因 reduced-motion 第一帧为空而生成无信息预览。
- 生成脚本固定浏览器版本、viewport、device scale factor、字体加载和随机种子；同输入应得到稳定输出。
- reduced-motion 另有独立截图，验证降级状态，不替代卡片代表图。

### 7.2 浏览器与降级

目标浏览器：Chrome 90+、Firefox 88+、Safari 14+、Edge 90+。

能力不足时保留页面、源码和说明，预览区显示静态首帧或简化实现。不得隐藏条目，也不得用与目标能力无关的 `@supports` 条件冒充检测。

### 7.3 授权

- Lab Demo 源码目录需要明确的 MIT 授权文本和适用范围；不得默认重许可整个仓库的其他内容。
- 每个 Demo 记录 `sourceUrl`、`license`、`implementationOrigin`。
- `implementationOrigin` 只允许 `original`、`clean-room`、`mit-adaptation`。
- 付费或非开源来源只能记录为视觉参考，不得移植或重新授权其代码。
- `original` 的 `sourceUrl` 为 `null`；`clean-room` 记录视觉参考 URL；`mit-adaptation` 记录原仓库、具体文件、版本/commit 和原许可证。
- 每个 `mit-adaptation` 在源码头部保留要求的版权与许可证声明，并在详情页显示归属信息。
- 完整源码引用的可复制共享依赖必须纳入同一 MIT 适用范围；无法授权的内部依赖必须在 Demo 中替换或内联为可授权实现。
- 无法提供来源证据或许可证文本的实现不得进入注册表正式状态。

## 8. Analytics 与隐私

### 8.1 同意策略

- 未明确同意、拒绝或启用 Do Not Track 时，不加载 GA4。
- 只有配置 `VITE_GA_MEASUREMENT_ID` 且用户同意后才初始化。
- 不设置 `user_id`，不发送参数值、代码内容、搜索原文或自定义个人信息；网络元数据按 Google Analytics 数据政策处理。
- 隐私选择本身不发送事件。
- 同意结果保存在本地，保存期最长 180 天；超期后重新询问。
- 页脚持续提供“统计偏好”入口，用户可以撤回同意；撤回后立即停止后续事件并清除本项目可控的 GA 本地标识。
- GA4 事件数据保留期配置为 2 个月，关闭 Google Signals 和广告个性化。
- 隐私说明必须列出用途、事件、允许参数、Google 数据处理链接、保存期和撤回方式。

### 8.2 事件

| 事件 | 含义 | 允许参数 |
|---|---|---|
| `lab_view` | 正式 Lab 首页浏览 | `source` |
| `demo_open` | 打开 Demo | `effect_id`, `category` |
| `code_expand` | 展开完整源码 | `effect_id` |
| `code_copy` | 复制使用方式或源码 | `effect_id`, `copy_target` |
| `lab_cta_click` | 首页 Lab 次 CTA | `placement` |
| `projects_cta_click` | 首页 Projects 主 CTA | `placement` |

事件参数使用封闭枚举：`source` 仅允许 `home_cta | nav | direct | internal_link`，`placement` 仅允许 `home_hero | header | lab_page`，`copy_target` 仅允许 `usage | full_source`。不得把 URL、搜索文本或自由输入作为事件参数。

### 8.3 成功阈值

正式发布累计至少 50 次 Lab 会话后评估：

- Demo 打开率 ≥ 40%：发生至少一次 `demo_open` 的合格 Lab 会话数 ÷ 合格 Lab 会话数。
- 完整代码展开率 ≥ 20%：发生至少一次 `code_expand` 的合格 Lab 会话数 ÷ 发生至少一次 `demo_open` 的合格 Lab 会话数。
- 代码复制率 ≥ 8%：发生至少一次 `code_copy` 的合格 Lab 会话数 ÷ 发生至少一次 `demo_open` 的合格 Lab 会话数。
- Projects CTA 点击占比 ≥ 60%：`projects_cta_click` 独立转化数 ÷ 两类首页 CTA 独立转化总数，作为作品集主路径保护指标。
- Owner Acceptance 的 8 项任务全部完成，0 个开放 P0/P1，且站点所有者明确确认定位、视觉说服力和复用价值达到发布标准。

“合格会话”仅指用户已同意统计、未启用 DNT、排除开发/预发布环境与维护者内部流量的正式发布会话。同一会话同一事件多次触发只计一次转化。评估窗口为正式发布后 30 天；不足 50 次合格 Lab 会话时延长窗口，不提前下结论。

本项目当前无法招募独立参与者，用户已明确批准个人项目验证例外：发布门由 1 名站点所有者执行 8 项人工任务，JoyCode 与 Claude Code 仅提供 T3-Proxy 补充证据。报告必须分别标注 Owner Acceptance 与 AI Proxy Review，禁止声称完成五人研究。原 2 名招聘/管理 + 3 名前端开发者的 28 项协议保留为未来研究债务，不阻断本次个人项目发布，但其结果也不得被伪造或推断。

## 9. 非功能需求

### 9.1 性能

- `/lab` 首页 Lighthouse Performance ≥ 90。
- `/lab` 首页 FCP < 1.5s，LCP < 2.5s，CLS < 0.1，INP ≤ 200ms。
- Lab 首页初始 gzip JavaScript 预算 < 150KB，不包含按需 Demo chunk。
- Demo cold load 与 warm navigation 分别记录；不得用缓存结果冒充冷加载指标。
- Pointer 动画在触摸设备禁用或降级，Canvas 根据设备能力限制工作量。
- 首页首屏同时运行的连续动画不超过 1 组；同一可视区域不同时叠加 Tilt、Spotlight、Shimmer 与边框旋转。
- 真实页面效果不得使现有 Lighthouse Performance 低于 90、LCP 超过 2.5s 或产生新增 CLS。

测量协议：Lighthouse 使用移动端模式、模拟 Slow 4G 与 4× CPU slowdown，清空缓存后连续运行 3 次并取中位数。Core Web Vitals 使用正式环境数据；实验室数据不足时以 Lighthouse 门禁为准。每个动画 Demo 在目标移动端环境持续运行 30 秒，不得出现超过 200ms 的主线程长任务，交互期间帧率目标为 55fps 以上。

### 9.2 Accessibility

- 目标为 WCAG 2.2 AA；Lighthouse 分数只作为辅助指标。
- 所有控件具有可访问名称、可见焦点、键盘操作和正确的 label/control 关联。
- 状态不只通过颜色表达；复制结果使用 `aria-live`。
- `prefers-reduced-motion` 下保留稳定静态首帧，不启动 JS 动画循环。

### 9.3 可靠性

- 无效 ID、异步加载失败、运行时错误和超时均有可恢复 UI。
- Demo 切换 10 次不得遗留计时器、监听器、rAF 或 GSAP 实例。
- 预览、注册表、源码和路由之间不存在孤儿条目。

### 9.4 风险登记册

| ID | 风险 | 概率/影响 | 缓解与触发条件 |
|---|---|---|---|
| R1 | 全站亮色迁移造成对比度或组件状态回归 | 中/高 | Phase 0 逐页视觉与 WCAG 回归；关键页面失败则不得进入 Phase 1 |
| R2 | 删除主题与 Shader 基础设施时仍有隐藏引用 | 中/高 | 删除前静态搜索、类型检查和 build；发现引用即回退到影响分析 |
| R3 | “完整源码”依赖未声明，复制后无法运行 | 中/高 | 每个 Demo 最小宿主 mount；失败则该 Demo 不计入 MVP |
| R4 | 第三方实现许可证不兼容 MIT | 低/高 | 来源审计与 `implementationOrigin` 校验；无法证明兼容则替换为 clean-room 实现 |
| R5 | GA4 同意率低导致样本偏差 | 高/中 | 指标只描述合格会话，不外推到全部访客；独立五人定性研究保留为未来债务 |
| R6 | 12 张预览与真实 Demo 漂移 | 中/中 | 预览脚本记录源码摘要；源码变化但预览未更新时 CI 失败 |
| R7 | 12 个 Demo 拉高首屏包体或运行负载 | 中/高 | 首页只加载元数据和静态图；Demo 按路由拆包，超预算阻断发布 |
| R8 | 预发布页面被搜索引擎索引 | 低/中 | `noindex`、不进 Sitemap、无公开入口；发现索引即暂停正式发布 |
| R9 | Projects 主路径被 Lab CTA 稀释 | 中/中 | Projects 保持主 CTA；正式数据中 Projects CTA 点击占比低于 60% 时调整层级 |
| R10 | 用增加数量掩盖现有效果深度不足 | 高/高 | Phase 3.5 冻结 12 项；先完成旗舰升级、内容深度和真实页面复用 |
| R11 | 首页动画堆叠导致“炫技感”、可读性或性能回归 | 中/高 | 每个区域只设一个主效果，执行动画预算、对比度、Lighthouse 与 reduced-motion 门 |
| R12 | 个人项目验证被误写成真实用户研究 | 中/高 | 报告固定标注 Owner Acceptance 与 AI Proxy；五人研究保留为未来债务 |
| R13 | Lab 与真实页面出现两份效果实现 | 中/高 | 旗舰效果使用 canonical SFC，测试两类消费者并阻止复制动画逻辑 |

## 10. 实施阶段

### Phase 0：单一亮色迁移

1. 更新治理规则和 ADR。
2. 固定亮色 Token 与 `#2563EB` accent。
3. 移除主题切换 UI、主题 Store/状态、持久化偏好和 `dark:` 分支。
4. 清除 `<html>` 上遗留的主题 class/data 属性，并处理旧本地偏好。
5. 将 Hero 改为极简亮色并保留 Projects 主 CTA；预发布阶段不增加 Lab 次 CTA。
6. 移除 `useStripeGradient`、`shaderPalette` 和无引用的 Shader 逻辑。
7. 确认无其他引用后移除 `whatamesh`。
8. 完成全站亮色视觉、响应式和可访问性回归。

Phase 0 通过前不得继续新增 Lab 样式或 Demo。

### Phase 1：Lab 基础设施

1. 将 View 收敛为布局外壳。
2. 建立 JSON 元数据、公开类型和组合注册表。
3. 修正父级导航高亮语义。
4. 实现类型化参数状态与路由切换重置。
5. 实现异步 loading/error/timeout/retry。
6. 实现纯结构化数据和动态 Sitemap 数据源。
7. 创建非修复型验证脚本，不依赖未声明的 `tsx`。

### Phase 2：12 个 Demo

按每批 4 个推进。每个 Demo 必须同时完成实际组件、raw 源码、动态使用方式、参数测试、降级、MIT 来源记录和静态预览。

### Phase 3：体验与预发布

1. 完成搜索、筛选、卡片预览和空状态。
2. 完成代码折叠、视觉与辅助技术均可感知的复制反馈，以及参数联动。
3. 完成 GA4 同意门与匿名事件。
4. 以直接 URL、`noindex`、无导航入口方式执行自动门、T3-Proxy 与站点所有者验收。
5. 修复阻断问题并重新执行全量门禁。

2026-07-15 Owner Acceptance 的功能链路通过，但产品价值未通过，因而进入 Phase 3.5，不得直接公开。

### Phase 3.5：产品说服力与真实复用

1. P3.5A 体验修复：NumberTicker 愥知时长、重置按钮占位、就地复制反馈；文字 Selection 与移动端展开态先复现后修复。
2. P3.5B 内容深度：扩展元数据并在详情页展示场景、禁用边界、搭配、实现、技术栈、性能、无障碍和站内应用。
3. P3.5C 旗舰升级：从现有 12 个中选择能代表背景、卡片、CTA 与数据的效果，提升完成度但不新增数量。
4. P3.5D 真实应用：Hero、Projects、CTA 和项目指标只按动画预算复用合适效果；Lab 与真实页面共享 canonical SFC。
5. P3.5E 重新验证：自动门、桌面/移动/横屏/reduced-motion、T3-Proxy 定向复核和 8 项 Owner Acceptance。

Phase 3.5 期间继续保持直接 URL、`noindex`、无导航、无首页 Lab CTA 和无 Sitemap。

### Phase 4：正式发布

1. 仅在 T3-Owner 批准后加入主导航和首页次 CTA。
2. 加入 Sitemap 并解除 `noindex`。
3. 开启正式指标观察，累计至少 50 次会话后评估。

### Phase 5：效果库增长（正式发布后）

1. 每批最多增加 4 个效果；优先文本、导航/布局、数据可视化和高频微交互。
2. 每个候选项必须说明可复用场景、与现有库的差异和至少一个真实消费方向。
3. 不因数量目标加入重复、低辨识度或只在鼠标环境可用的效果。
4. 每批独立执行来源、许可证、性能、移动端、reduced-motion、最小宿主和 Owner Acceptance。

### 发布状态切换

预发布与正式发布通过一次性代码变更切换，不建立永久环境功能开关：预发布保留可直接访问路由和 `noindex`，但不加入导航、首页 Lab CTA 或 Sitemap；T3-Owner 通过后，Phase 4 一次性加入公开入口与 Sitemap、移除 `noindex`。正式发布稳定后删除预发布专用分支。

### 阶段验证门与人工确认

| 节点 | 进入条件 | 必须验证 | 人工确认 |
|---|---|---|---|
| T0：Phase 0 完成 | 治理规则与亮色任务完成 | 全站类型、build、关键页面视觉/WCAG、无主题/Shader遗留引用 | 确认亮色视觉与 Hero，不得提前公开 Lab CTA |
| T1：Phase 1 完成 | 基础设施实现完成 | 路由、参数重置、错误恢复、SEO/noindex、Sitemap排除、一致性脚本 | 确认架构与预发布入口 |
| T2A/T2B/T2C | 每批 4 个 Demo 完成 | 每项源码最小宿主、参数、降级、预览、许可证、移动端 | 每批确认后才进入下一批 |
| T3：功能预发布完成 | 12 个 Demo 与基础体验完成 | 全量自动门、T3-Proxy、Owner Acceptance 记录 | 若产品价值未通过则进入 Phase 3.5 |
| T3.5：说服力升级完成 | P3.5A–P3.5E 完成 | 自动门、跨视口、reduced-motion、8/8 Owner Acceptance、0 个开放 P0/P1 | 站点所有者批准 Phase 4 |
| T4：正式发布 | T3.5 已批准且 GA4 后台已确认 | 导航、首页 CTA、Sitemap、index、GA 同意门和生产冒烟 | 确认发布完成并进入指标观察 |

任何阶段门失败都回到对应 Phase 修复；不得通过修改验收标准、隐藏失败条目或扩大例外继续推进。

## 11. Testing Decisions / 验证门禁

验收命令必须是非交互、可重复且不会修改源码的检查：

1. `vue-tsc --noEmit`。
2. ESLint check-only，不能使用带 `--fix` 的脚本充当 CI 门禁。
3. `vitest run --coverage`，覆盖率遵循仓库 70% 阈值。
4. `npm run build`，确保完整执行 Vite 构建和 Sitemap 后处理。
5. 断言构建清单可追踪 12 个正式 Demo 动态模块，并包含 12 个 Lab Sitemap URL 和全部预览资产；不得依赖具体 chunk 文件名。
6. Lab 注册表一致性校验。
7. Playwright 路由、键盘、复制、同意门和移动端测试。
8. Playwright 验证 Hero、Projects、CTA、指标与 Lab 共享效果的外部行为，不断言内部类名或动画实现细节。
9. Lighthouse 与 1440×900、375×812 纵向/横向、reduced-motion 手工视觉验收。
10. T3-Owner 8 项任务与定性问题全部记录；T3-Proxy 结果单列。

Phase 测试必须在对应实现开始前定义。验证脚本应使用项目已有 Node 能力或 `.mjs`，不得依赖未声明的全局工具。

## 12. Definition of Done

任务只有同时满足以下条件才能完成：

- 实现与当前 Phase 规格一致。
- TypeScript、check-only lint、相关测试、覆盖率和 build 通过。
- Accessibility、reduced-motion、触摸和错误降级通过。
- 注册表、实际文件、源码 raw import、预览和许可证一一对应。
- 旗舰效果在 Lab 与真实页面使用同一 canonical SFC，且满足动画预算与静态降级。
- PRD、Decision Log、HANDOVER 和必要架构文档已同步。
- 站点所有者已明确确认定位清楚、视觉有说服力、Demo 内容具有复用价值。

## 13. 文档与遗留处置

- `prd-lab-effects-v0.4.md`、`prd-shader-design-system-v0.1.md`、`prd-effects-integration-v0.1.md` 归档到 `docs/archive/`。
- 归档文档必须标记 `OBSOLETE` 并链接本 PRD。
- 研究报告和原型只作为历史参考，不作为实现规格。
- v0.6 是交互实验室唯一有效的产品需求来源。

## 14. 变更记录

| 版本 | 日期 | 说明 |
|---|---|---|
| v0.6.1 | 2026-07-15 | 状态对齐：Phase 4 已正式发布，解除 Projects 案例叙事暂停；不改变 12 个 Demo、发布门与 Phase 5 批次规则 |
| v0.6 | 2026-07-15 | 根据站点所有者验收新增 Phase 3.5：先修体验、补内容深度、升级旗舰效果并在真实页面复用；建立个人项目 Owner Acceptance 例外与发布后 Phase 5 小批量增长规则 |
| v0.5.3 | 2026-07-14 | 根据第二轮 T3-Proxy 裁定，要求复制成功/失败同时提供视觉与辅助技术反馈，并将运行时依赖和宿主工具链改为显式标签；代理结果仍不替代真实 T3 |
| v0.5.2 | 2026-07-14 | 纳入 T3-Proxy 审查边界、已验证宿主工具链基线和异步参数联动回归要求；保持真实 5 人 T3 与 Phase 4 阻塞 |
| v0.5.1 | 2026-07-14 | 补齐源码可运行边界、风险登记、T0–T4 阶段门、Analytics 公式与隐私撤回、确定性预览、性能测量协议、SEO 预发布锁和完整 build/Sitemap 门禁；纯文档复审通过 |
| v0.5 | 2026-07-14 | 根据全面审批重建单一事实来源：单一亮色、Lab 优先、12 Demo MVP、双用户、真实源码、MIT、静态预览、两阶段发布、同意后 GA4、平衡档成功阈值 |

## 15. Further Notes

- NumberTicker 配置 2000ms 的浏览器测量结果约为：250ms 显示 16,048；500ms 显示 29,275；1000ms 显示 43,914；1537ms 显示 49,332；2052ms 到达 50,000。计时器基本准确，但旧 ease-out 在半程已完成约 88%，证实感知问题。
- 站点所有者报告从 Lab Not Found 返回后文字仍保持选择；2026-07-15 的两次 Chromium 自动复现均正常清空 Selection。该项必须以可重复证据或录屏为前提，不增加全局路由副作用。
- 375px 下浏览器兼容性说明换为两行属于预期响应式排版；不得为了单行显示缩小字号或引入横向滚动。
- 2026-07-15 Owner Acceptance 当前裁定为“功能链路通过、产品价值未通过”；完成 Phase 3.5 后必须重新执行，旧结果不能直接批准发布。
- 2026-07-15 用户随后授权 Codex 自主代跑剩余验收；Phase 3.5 代理执行 8/8 通过并完成 Phase 4 本地代码切换。该记录是 Owner-delegated Codex Acceptance，不是独立用户研究。
- Phase 4 本地生产冒烟已覆盖首页、Lab 首页与 12 个详情；正式 Measurement ID 和 GA4 管理后台设置仍属于仓库外发布条件，未取得证据前不得声称已开始 50 会话观察。
- 2026-07-15 发布前只读核验曾确认正式站点仍为旧部署：首页返回 200，但 `/lab` 返回 404、线上 Sitemap 不含 Lab、首页 HTML 未发现 GA Measurement ID。该历史状态已被同日后续 Vercel Production 部署、SPA fallback 修复和正式生产冒烟取代，不能再作为当前状态引用。
- 2026-07-15 发布后生产事件审计发现 Hero 两个内部 CTA 使用普通 anchor 整页导航，导致 `projects_cta_click` 与 `lab_cta_click` 无法在同一 `dataLayer` 会话中保留。修复为埋点后通过 Vue Router SPA 跳转，正式环境已逐项验证六类事件与参数白名单。
- 2026-07-15 最终逐项审计补齐独立标签筛选、View 挂载滚顶、异步失败恢复、Lab 卡片 SafeImage、固定 Header 遮挡和 10 次 SPA 切换回归；强化校验器覆盖 Phase 3.5 元数据与动画清理契约。
- 6 个时间驱动 Demo 在移动视口、DPR 2、4× CPU 下各运行 30 秒，56.3–60fps、0 个 >200ms 长任务、0 pageerror；当前 `/lab` 三次 Lighthouse 中位 LCP 为 2.317s，满足 2.5s 门。
- 2026-07-15 发布后内容分支复核发现首页核心 Projects 与下方延迟区存在异步布局竞态：项目 chunk 较慢时观察点会短暂进入预取范围。Projects 改为首轮稳定布局后，1.6 秒延迟注入不再误触发，原用例 10/10 与全量 E2E 25/25 通过；首页三次移动 Lighthouse 中位 Performance 97、LCP 2.242s、CLS 0。
- Windows `core.autocrlf=true` 曾使干净 CLI 部署把语义相同的 CRLF `blog-meta.json` 误判为过期；内容门禁现统一换行后比较，Windows 干净 `vercel build` 与 Vercel Linux 无缓存构建均通过，未改为构建期自动修复。
- 2026-07-15 内容与真实项目案例已重新发布至正式域名。首页、Projects、项目 4/5、Blog、Lab、Aurora 与 Lab Not Found 共 8 条生产路由全部 200，双视口无横向滚动且 0 pageerror；GA4 同意前不加载、同意后使用 `G-1GBKPV4YRF`、撤回后移除，自动化网络请求已拦截且不计入真实会话。生产 Sitemap 为 39 条（Lab 13、博客详情 18），RSS 为 18 条。
