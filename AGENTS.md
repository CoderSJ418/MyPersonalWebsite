# MyPersonalWebsite 项目上下文

> 最后更新：2026年3月2日
> **状态：已归档** - 新项目请见 `E:\work\AI\sj-portfolio`

---

## 重要说明

**新项目已启动**：`E:\work\AI\sj-portfolio`

本文档保留作为历史参考和设计决策存档。

---

## 核心决策摘要

| 决策项 | 内容 |
|--------|------|
| 框架 | Nuxt 3（SSG/ISR 混合） |
| 样式 | Tailwind CSS + CSS Variables |
| 动画 | GSAP + ScrollTrigger |
| 评论 | Giscus（GitHub Discussions） |

---

## 设计系统

**风格**：Motion-Driven Minimalism

```css
主色：#18181B
CTA：#2563EB
背景：#FAFAFA（浅）/ #09090B（暗）
字体：JetBrains Mono（标题）+ Inter（正文）
```

---

## 需求优先级摘要

| 优先级 | 数量 | 说明 |
|--------|------|------|
| P0 | 13 项 | 核心必需 |
| P1 | 13 项 | 重要体验 |
| P2 | 6 项 | 增强功能 |

**完整需求列表**：见 `docs/requirements.md`（如需查阅）

---

## AI 边界约束

| 类型 | 规则 |
|------|------|
| 🚫 禁止 | 删除文件、安装依赖、修改 CI/CD、发布生产 |
| ⚠️ 确认 | 创建文件、修改配置、执行 Shell 命令 |
| ✅ 自主 | 创建组件、添加类型、优化性能、修复 bug |

---

## 外部文档索引

| 文档 | 用途 |
|------|------|
| 设计提示词 | 艺术级网页设计师提示词.md |
| 文章提示词 | 文章总结提示词.md |
| 完整方案 | 本文件备份 AGENTS.md.backup-20260302 |

---

## 技术决策记录

### GSAP SSR 兼容
```typescript
// 插件使用 .client.ts 后缀
// plugins/gsap.client.ts
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger)
})
```

### 暗黑模式
```typescript
// nuxt.config.ts
colorMode: {
  classSuffix: '',      // .dark 而非 .dark-mode
  preference: 'system',
  fallback: 'dark'
}
```

### 渲染策略
```typescript
routeRules: {
  '/': { prerender: true },        // SSG
  '/blog/**': { isr: true },       // ISR
  '/projects/**': { swr: 86400 }   // SWR 24h
}
```

---

## AI 时代发展战略（核心洞察）

```
AI 时代赚钱的本质：
├── 判断力 + 执行速度 = 财富
├── 代码贬值，判断力升值
└── 差异化 = AI 技术实现 × 人类真实价值

AI 能帮你：把 80 分变成 95 分
AI 帮不了：创造你没有的经历和见解
```

**完整战略**：见 `docs/learning/ai-usage-guide.md`

---

**作者**：佘杰（杰哥）
