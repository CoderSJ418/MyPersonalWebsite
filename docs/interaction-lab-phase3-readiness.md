# 交互实验室 Phase 4 发布就绪报告

> 日期：2026-07-15
> 范围：PRD v0.6；Phase 0–4 实现、自动门、正式部署与生产冒烟。

## 当前权威状态（2026-07-15）

- Phase 3.5A–E 已实现：修复感知时长、重置占位和复制反馈；12 项补齐工程内容；Aurora、Magic Card、Shimmer Button、Number Ticker 作为旗舰能力真实复用。
- 首页 Hero、精选项目、联系 CTA 和项目指标均使用 Lab canonical SFC；未复制动画实现。
- Phase 4 代码切换已完成：Header 与首页次 CTA 公开 Lab，13 个 Lab URL 进入 Sitemap，合法页面恢复 `index,follow`，robots 不再排除 `/lab`。
- 用户已授权 Codex 自主代跑验收；代理执行 8/8 任务通过，P0/P1 为 0。该结果是 Owner-delegated Codex Acceptance，不冒充独立人工研究。
- 正式站点 `https://my-personal-website-eta-murex.vercel.app` 已部署当前版本；首页、Lab、12 个详情和 SPA 直链均可公开访问。
- Vercel Production 已加密配置 `VITE_GA_MEASUREMENT_ID=G-1GBKPV4YRF`；同意前、同意后、撤回与 DNT 生产冒烟通过。GA4 后台保留期、Signals 与广告设置仍需站点所有者在 Analytics 管理界面人工确认。

## Phase 0–3 历史完成项

- 全站单一亮色模式与 `#2563EB` accent；主题 Store、切换 UI、旧 Shader/whatamesh 运行时已移除。
- 冻结 12 个 Demo；JSON 元数据、类型化运行时、`defineAsyncComponent`、真实 SFC `?raw` 与动态使用方式完成。
- 12 个 Demo 均有类型化 props、兼容/降级、MIT 范围、最小宿主测试和静态预览。
- 生成 12 张代表帧与 12 张 reduced-motion WebP；manifest 记录参数、浏览器、viewport 与源码 SHA-256。
- 搜索、分类、独立技术标签筛选、空状态、参数重置、源码按需加载、复制反馈、无效 ID 与运行时恢复完成。
- 明确同意前不加载 GA4；支持拒绝、DNT、180 天过期与页脚撤回。
- 预发布锁保持：直接 URL 可访问，但无 Header/Home CTA、无 Sitemap，页面为 `noindex,nofollow`，robots 排除 `/lab`。

## 最新自动化证据

- `npm run typecheck`：通过；`npm run lint:check`：0 error、28 条既有 warning。
- `npm run test:coverage`：164/164；Statements 79.81%、Branches 70.59%、Functions 75.77%、Lines 81.14%。
- `npm run test:coverage:lab`：22/22；Statements 79.23%、Branches 79.71%、Functions 81.35%、Lines 83.10%。
- `npm run test:e2e`：25/25；除 Lab 全链路外，覆盖工程博客、真实项目案例、脱敏封面、职责边界和移动端布局。
- `npm run build && npm run validate:lab`：通过；Magic Card canonical 样式变化后已重生成预览与源码摘要，12 个冻结条目重新一致。
- 首页移动 Lighthouse 三次中位数：Performance 97、Accessibility 100、Best Practices 100、FCP 1.836s、LCP 2.286s、CLS 0、TBT 26ms。
- `/lab` 当前构建三次移动 Lighthouse 中位数：Performance 98、Accessibility 100、Best Practices 100、SEO 100、FCP 0.641s、LCP 2.317s、CLS 0、TBT 32ms、初始脚本 126.8KB。
- `npm run audit:lab-runtime`：Chromium 149、390×844、DPR 2、4× CPU；6 个时间驱动 Demo 各运行 30 秒，59.9–60fps，0 个 >200ms 长任务，0 pageerror；冷导航 353.2–446.8ms，热导航 135.7–183.8ms。
- 预览生成器现在真正固定随机种子；manifest 的 12 项均记录浏览器、viewport/DPR、默认参数、源码 SHA-256 和代表帧，强化校验器同时验证 Phase 3.5 内容字段、搭配引用与清理契约。
- Lighthouse 复核期间的高 TBT 离群值由旧 Vite 5175 进程持续占用 CPU 与 Windows 临时 Chrome profile 清理延迟共同造成；终止已验证孤儿、逐轮隔离后取得上述三次完整样本，未修改性能门槛。
- 性能诊断确认下方 GSAP 区提前实例化是原 LCP 3.10s 的根因；改为接近视口再加载后 LCP 回到 2.5s 门内。
- SPA 启动前 `#app` 为空导致正式 Lab FCP 初测 1.654s；72px 品牌启动壳将首次文字绘制提前，Vue 挂载后自动替换且未产生 CLS。

### Phase 3 历史自动化证据

- `npm run typecheck`：通过。
- `npm run lint`：0 error；29 条 warning 为已知的安全 `v-html`、可选 CTA props、格式提示与测试宿主多组件提示。
- `npm run test:coverage`：148/148 通过；Statements 81.13%、Branches 70.92%、Functions 76.74%、Lines 82.39%，四项全仓门禁均 ≥70%。
- `npm run test:e2e`：14/14 通过，其中 Lab 6 条覆盖桌面、375px、源码复制、同意门、DNT、撤回与 axe 审计。
- `npm run test:coverage:lab`：17/17 通过；Statements 81.73%、Branches 77.63%、Functions 81.25%、Lines 86.66%，四项均 ≥70%。
- `npm run build`：通过；构建 manifest 可追踪 12 个组件模块与 12 个 raw 源码模块。
- `npm run validate:lab`：通过；注册表、文件、预览、摘要、许可证与 Sitemap 排除一致。
- Lighthouse 移动端冷启动连续 3 次中位数：Performance 98、Accessibility 100、Best Practices 100；FCP 1.38s、LCP 2.13s、CLS 0、TBT 38.5ms、可交互 2.17s。
- `/lab` 首屏脚本传输量 73.9KB，低于 150KB 预算；SEO 66 为预发布 `noindex,nofollow` 的预期结果，不能通过解除发布锁换分。
- axe WCAG 2 A/AA、2.1 AA 与 2.2 AA：0 个 serious/critical 违规；审计发现并修复了 NProgress 非法 `role="bar"`。
- Lighthouse 三份原始 JSON：`C:\tmp\lighthouse-lab-phase3-final.json`、`-2.json`、`-3.json`。CLI 仅在清理 Chrome 临时目录时报告 Windows EPERM，报告本体完整。
- `npm audit --omit=dev`：0 个生产依赖漏洞；兼容升级已完成，并补齐生产代码实际使用但未声明的 `web-vitals@3.5.2`。

## T3-Proxy 补充审查与修复

- JoyCode 原始结果 4/5；Claude Code 原始结果 6/6，因复制到最小宿主后经过三轮工具链调整才成功，按“一次运行”标准修正为 5/6；合计 9/11（81.8%）。
- 该成绩仅是 AI Proxy Review，不并入真实 5 人的 28 项成绩，也不用于批准 T3 或 Phase 4。
- 已确认并修复 NumberTicker 参数变化不重新驱动预览的问题；根因为 `watchEffect` 只跟踪同步读取，而 props 只在异步 `requestAnimationFrame` 回调内读取。新增组件回归测试和浏览器级滑块联动测试。
- 已将移动端面包屑与“恢复默认值”按钮高度提升到至少 44px，并纳入 375px E2E 尺寸断言。
- 已在详情页和 PRD 中写明经验证的 Vue/Vite/TypeScript 宿主基线；Vite、Vue 插件与 TypeScript 属于宿主构建工具，不作为 Demo 运行时依赖重复声明。
- JoyCode 的首轮剪贴板失败由自动化权限配置触发，复制功能本身不列为缺陷；Claude 第二轮指出成功/失败文案仅为 `sr-only`，视觉用户无法确认操作，该 P2 呈现缺陷成立并已修复。
- NumberTicker 源码变更后已重新生成普通与 reduced-motion 预览及 SHA-256 manifest，`validate:lab` 重新通过。

### 第二轮定向复测裁定

- 用户重复粘贴的三组内容是同一份 JoyCode 与 Claude Code 报告，只计一次，不重复累计成绩。
- JoyCode：5/5，通过参数联动、44px 触控目标、无横向滚动、有/无权限复制状态、依赖说明和独立宿主原样构建；0 个新缺陷。
- Claude Code：核心联动与移动端 7 项通过；视觉复制反馈判定 FAIL，依赖标签判定 PARTIAL；独立宿主验证因环境限制为 SKIP。SKIP 不计失败，JoyCode 的独立构建证据补足该项。
- 交叉裁定接受 Claude 的视觉反馈问题为 P2，同时接受显式“运行时依赖 / 已验证宿主工具链”标签为 P2 信息架构改进；两项均已修复。
- 新增组件测试覆盖使用方式复制成功、权限失败、完整源码复制成功三种可见状态；E2E 断言反馈不再是 `sr-only`，且具有实际可阅读尺寸。

## 2026-07-15 Owner Acceptance

- 身份：站点所有者；这是个人项目人工验收，不是独立用户研究。
- 功能通过：搜索、单选分类、空结果、参数同步、使用方式/源码复制、依赖/兼容/授权、无效 ID 恢复、375px 纵横屏和源码滚动均可完成。
- P2 已确认：NumberTicker 实际约 2052ms 到达目标，但旧缓动在 1000ms 已完成约 88%，感知时长不自然；重置按钮使用条件渲染导致布局位移；整块复制反馈过重。
- 待证据：返回 Lab 后 Selection 残留与移动端展开/收起样式变化尚未被自动复现，必须先获得稳定复现或录屏。
- 正常行为：375px 下浏览器兼容性文本换为两行；横屏短视口需要纵向滚动。
- 产品价值未通过：目标用户与工程价值表达不清，效果缺少旗舰级辨识度，首页 Hero 偏淡，Demo 缺少场景、搭配、技术栈、实现和真实性能说明。
- 决定：插入 Phase 3.5；先提升质量和真实复用，不增加第 13 个 Demo。

## 历史阻塞（Phase 3 结束时）

1. PRD v0.6 Phase 3.5 尚未实现，Owner Acceptance 当前为未通过。
2. Phase 3.5 完成后必须重新执行 8 项 T3-Owner，并关闭所有 P0/P1。
3. GA4 管理后台的 2 个月保留期、Signals 与广告关闭需要站点所有者确认。

## 全仓覆盖率审批结论

- 全仓四项 70% 门禁已真实通过；未降低阈值、未缩小 `src/**/*.{ts,vue}` 分母，也未使用 ignore 注释制造覆盖率。
- 新基线覆盖 Stores、Utils、真实路由集成、动画 Composables、内容组件、隐私同意与运行时基础设施。
- 测试过程中修复了搜索历史点击崩溃、缺失 `web-vitals` 依赖、Vite 误扫描 docs 原型、固定 Header 覆盖 Lab 面包屑及 E2E 复用无 GA 测试 ID 服务器等真实缺陷；E2E 默认命令已稳定为 19/19。

## 正式生产发布证据（2026-07-15）

- Vercel Production 部署成功并绑定正式别名；首次冒烟发现缺少 SPA fallback，导致 `/lab` 与 `/projects` 直链 404。新增 `vercel.json` history rewrite 和部署契约测试后复测通过。
- 生产浏览器验证 12/12 Demo 详情直链均返回 200、渲染正确 H1，Lab 首页发现 12 个唯一详情链接，0 `pageerror`。
- Sitemap 含 Lab 首页与 12 个详情共 13 个 URL；`robots.txt` 未禁止 `/lab`；合法 Lab 页面为 `index,follow`。
- 生产审计发现 canonical 错写为 `meta` 且存在两条 description；已改为标准 canonical `link`，并在应用挂载后由 `SEOHead` 接管静态 description 兜底。复测 canonical 与 description 均唯一。
- GA4：同意前脚本数 0；同意后加载 `https://www.googletagmanager.com/gtag/js?id=G-1GBKPV4YRF`；撤回后脚本数 0 且保存 `denied`；DNT 下无提示、无 GA 脚本。生产 `dataLayer` 已端到端验证 `projects_cta_click`、`lab_cta_click`、`lab_view`、`demo_open`、`code_expand`、`code_copy` 六类事件及白名单参数。
- 首次生产事件审计发现 Hero CTA 使用普通 anchor 整页导航，导致 CTA 事件在当前会话的 `dataLayer` 中丢失。修复为先埋点再通过 Vue Router SPA 导航，并新增真实浏览器回归测试；保留 Ctrl/⌘/中键原生新页行为。
- 375×812 生产检查无横向滚动；面包屑和重置按钮均为 44px；首页同时保留 Projects 主 CTA 与 Lab 次 CTA；无效 Demo ID 有专属恢复入口。
- 正式 `/lab` Lighthouse：Performance 90、Accessibility 100、Best Practices 100、SEO 100、FCP 0.999s、LCP 1.466s、CLS 0、TBT 87.5ms；原始 JSON 位于 `C:\tmp\lighthouse-lab-production-final.json`。

## 当前结论

Phase 0–4 的仓库实现、自动门、跨视口、性能、正式部署与生产冒烟均已完成，Interaction Lab 已正式发布。尚未关闭的产品观察项是发布后累计至少 50 次真实合格 Lab 会话，以及 GA4 管理后台保留期、Signals 与广告设置的人工确认。独立五人研究继续作为未来研究债务，不得伪造为已完成。
