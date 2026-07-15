# Handover Document

> AI协作交接文档。每次会话结束前更新，确保下一个AI能快速恢复上下文。

## 当前状态

- **宪法版本**: v1.1（已冻结）
- **阶段**: P1全流程 — 作品集内容可信度与博客工程化收口
- **Sprint Goal**: 用真实项目案例替换不可验证叙事，并保持 2024–2026 每年 6 篇可校验工程博客
- **验证Feature**: 黑桃奢/蜂鸟证据化项目案例 + 工程化博客内容流水线
- **Sprint Planning**: ✅ Feature Brief 方案 A 已确认并完成本地实现

## 当前进行中任务

| 任务               | 状态     | 备注                                                  |
| ------------------ | -------- | ----------------------------------------------------- |
| C1-C4 Critical迁移 | ✅ 完成   | 宪法引用、决策日志、交接文档                          |
| Sprint Planning v1 | ⚠️ 已推翻 | Blog优先→从技术角度排序，错误                         |
| Projects案例叙事   | ✅ 本地完成 | Lab Phase 4 后恢复；黑桃奢与蜂鸟按个人贡献/团队成果分开展示 |
| Lab 初版全面审批   | ✅ 完成   | v0.5 决策已确认；v0.6 已完成实现与本地验收               |
| Lab PRD v0.6       | ✅ 已实现 | Phase 3.5、Owner Acceptance 例外、真实页面复用和 Phase 5 增长规则已落地 |
| Phase 0亮色迁移    | ✅ 完成   | 主题、旧 Shader 与 whatamesh 运行时已移除               |
| Phase 1基础设施    | ✅ 完成   | JSON 元数据、类型注册表、raw 源码、noindex 与恢复边界   |
| Phase 2固定12 Demo | ✅ 完成   | 三批门禁、24 张预览、MIT 与最小宿主测试                 |
| Phase 3预发布体验  | ✅ 代码完成 | 搜索、参数、源码复制、同意门、DNT、撤回与 E2E          |
| Phase 3技术审计    | ✅ 自动门通过 | 全仓覆盖率四项 ≥70%、E2E 19/19、生产审计 0 漏洞        |
| T3-Proxy 修复      | ✅ 完成 | NumberTicker、44px 触控、可见复制状态、依赖标签与宿主构建已复验 |
| T3 Owner Acceptance | ✅ 代理执行 8/8 | 用户授权 Codex 自主代跑；明确不等同独立用户研究 |
| Phase 3.5          | ✅ 完成 | 体验、内容、旗舰、真实应用与重新验证均完成 |
| Phase 4            | ✅ 正式发布 | 导航、首页次 CTA、Sitemap/index、六类事件、Vercel Production 与 GA4 生产冒烟完成 |
| Blog 内容重构      | ✅ 本地完成 | 删除 10 篇低价值稿，重写/新增为 2024–2026 各 6 篇，2026 旧视觉稿已去除暗色与未经证实表述 |
| Blog 工程化        | ✅ 本地完成 | Markdown 单一内容源、元数据/年度质量门、RSS/Sitemap 同源、长文按需展开、移动端导航修复 |

## 阻塞项

- 独立 5 人研究改为未来研究债务；不得宣称已经完成。
- GA4 管理后台 2 个月保留期、Signals 与广告个性化关闭仍需站点所有者人工确认；仓库和生产冒烟无法代替该后台设置证据。
- 50 次合格 Lab 会话必须来自正式发布后的真实、已同意统计且未启用 DNT 的外部会话；不得使用自动化流量补数。

## 最新自动化证据

- 当前分支：`codex/blog-content-rebuild`；博客与真实项目案例提交 `b8fd01d` 已推送，可通过 GitHub compare 创建统一内容重构 PR。
- Vercel Preview：`dpl_7zbanHXjgxXDJyxzcDtYYd7SZV7f`，状态 Ready；URL：`https://my-personal-website-h0qefvj6o-codersj418s-projects.vercel.app`。
- `npm run content:check`：18/18；2024、2025、2026 各 6 篇，旧占位文本和重复索引已清除。
- `npm run test:coverage`：164/164；Statements 79.81%、Branches 70.59%、Functions 75.77%、Lines 81.14%。
- `npm run test:e2e`：25/25；覆盖博客、真实项目封面、职责边界、Lab 全链路和移动端无横向滚动。
- `npm run build`：通过；生产 Sitemap 含 18 个博客详情 URL，RSS 含 18 个条目，均直接生成到当前 `dist`。
- `npm run validate:lab`：通过；Magic Card canonical 样式更新后的 24 张预览与 manifest 摘要已重新生成。
- `npm run audit:lab-runtime`：6 个时间驱动 Demo 在 4× CPU 下保持 59.9–60fps，0 个 >200ms 长任务，0 pageerror。
- 发布分支：`codex/interaction-lab-release`；发布提交：`bbb0d73`；生产证据提交：`cdef3eb`；人工审核入口：[GitHub PR #1](https://github.com/CoderSJ418/MyPersonalWebsite/pull/1)。
- Phase 4 发布基线 `npm run test:coverage`：157/157；Statements 79.61%、Branches 70.36%、Functions 75.37%、Lines 80.86%。
- `npm run test:coverage:lab`：22/22；Statements 79.23%、Branches 79.71%、Functions 81.35%、Lines 83.10%。
- Phase 4 发布基线 `npm run test:e2e`：20/20；新增 Hero 两类 CTA 在 SPA 导航中保留 GA 事件的浏览器回归；`npm run build` 与强化后的 `npm run validate:lab` 通过。
- 正式 `dataLayer` 已验证六类 PRD 事件及参数白名单；Hero CTA 的普通 anchor 整页导航丢事件问题已改为 Vue Router SPA 导航并重新部署。
- 生产本地冒烟：首页 + Lab 首页 + 12 详情共 14 页全部 200，0 pageerror；13 个 Lab URL 全部进入 Sitemap。
- 首页 Lighthouse 三次中位数：Performance 97、Accessibility 100、Best Practices 100、LCP 2.286s、CLS 0、TBT 26ms。
- `/lab` 当前构建 Lighthouse 三次中位数：Performance 98、Accessibility 100、Best Practices 100、SEO 100、FCP 0.641s、LCP 2.317s、CLS 0、TBT 32ms、初始脚本 126.8KB。
- 6 个时间驱动 Demo 在 390×844、DPR 2、4× CPU 下各运行 30 秒：56.3–60fps、0 个 >200ms 长任务、0 pageerror；冷/热导航均已记录。
- 真实生产域名已从 GitHub 仓库主页与线上响应交叉确认；源码、robots、Sitemap 构建基址已统一为该 Vercel URL，活跃源码不再引用旧 Gitee URL。

## 下次启动第一步

1. 在 GA4 管理后台确认数据保留期为 2 个月，并关闭 Google Signals 与广告个性化；这一步需要账号持有人人工核验。
2. 发布后累计至少 50 次合格 Lab 会话，再按 PRD 公式评估打开、展开、复制和 Projects 主路径占比。
3. 独立 5 人研究继续作为未来研究债务，不得把 Owner-delegated Codex Acceptance 改写成真实用户研究。
4. Phase 5 仅按每批最多 4 个推进；每个候选必须先证明复用场景、差异和真实消费方向。

## 重要提醒

- **暂停宪法完善**：v1.2需等验证阶段结束后再启动
- **实践优先原则**：任何新增规则必须证明能提升效率或解决已发生问题
- **Decision Framework**：所有产品/架构/规划讨论必须按Observation/Analysis/Options/Recommendation/Confidence五步输出
- **Recruiter Impact**：所有Feature排序必须考虑招聘影响力维度
- **产品目标优先**：技术优雅与产品目标冲突时，优先产品目标
- **Framework按需展开**：简单问题简单输出，复杂问题完整框架
- **挑战标准为决策风险**：低风险用户决定，中风险建议+权衡，高风险坚持反对
- **Meta Review**：Sprint复盘增加元复盘环节，评估Framework生命力
