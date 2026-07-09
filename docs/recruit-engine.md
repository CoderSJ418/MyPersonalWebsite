# Recruit Decision Engine v2.0 — System Operation Guide

> **状态**: PRODUCTION LOCKED | **校验版本**: 2.0.0-locked | **锁定日期**: 2026-07-01

---

## A. System Overview

Recruit Decision Engine 是 Portfolio 页面的招聘决策引擎，服务于 **90秒招聘判断** 场景。

**核心目标**: 让招聘方在极短时间内基于量化证据做出"这个人值得面试"的判断。

**架构**: Recruit Mode（决策流）+ Reader Mode（叙事流）双模式系统。
- **Recruit Mode**: 压缩信息密度，只展示决策必需的五层 IA — Identity → Evidence → Outcome → Context → Validation
- **Reader Mode**: 展开完整叙事 — Challenge → Approach → Impact → Evidence

**当前项目数**: 4（全部 Recruit Ready）

---

## B. Data Rules

所有项目数据必须通过 11 条校验规则（9 Error + 2 Warning）。

### Metrics 规范 (Layer 2: Evidence)

| 规则     | 级别    | 要求                           |
| -------- | ------- | ------------------------------ |
| R-EV-001 | Error   | 至少 2 项量化指标              |
| R-EV-002 | Error   | 每个 metric value 必须包含数字 |
| W-EV-001 | Warning | 建议不超过 4 项指标            |

**合法 value**: `1.5s`, `96`, `+35%`, `20万+`, `1.2MB`, `3个项目`
**非法 value**: `优化`, `提升`, `改善`

### Impact 规范 (Layer 3: Outcome)

| 规则     | 级别    | 要求                           |
| -------- | ------- | ------------------------------ |
| R-OC-001 | Error   | Impact 不能为空                |
| R-OC-002 | Error   | 必须含量化结果（数字/%/倍/万） |
| R-OC-003 | Error   | 禁止模糊描述                   |
| W-OC-001 | Warning | 建议不超过 60 字               |

**禁止的模糊描述**: 优化体验、提升效率、改善体验、明显提升、显著改善、大幅提高

**合法 Impact**: "首屏从3.5s降至1.5s", "覆盖100+角色权限", "询盘量增长35%"
**非法 Impact**: "运营效率明显提升", "用户体验大幅改善"

### TechStack 规范 (Layer 5: Validation)

| 规则     | 级别  | 要求               |
| -------- | ----- | ------------------ |
| R-VA-001 | Error | TechStack 不能为空 |
| R-VA-002 | Error | 每项必须有 name    |

### Identity & Description 规范

| 规则     | 级别    | 要求                 |
| -------- | ------- | -------------------- |
| R-ID-001 | Error   | Title 不能为空       |
| R-CT-001 | Error   | Description 不能为空 |
| R-NA-001 | Error   | Challenge 不能为空   |
| R-NA-002 | Warning | Approach 不能为空    |

---

## C. Add Project Flow

新增项目必须通过校验流程才能接入系统。

### Step 1: 准备 RecruitStandard 数据

```typescript
const newProject: RecruitStandard = {
  title: '项目名称',
  metrics: [
    { label: '性能', value: '1.5s' },    // value 必须含数字
    { label: '覆盖率', value: '96%' },    // 至少2项
  ],
  impact: '量化结果描述（必须含数字，≤60字）',
  description: '项目背景说明',
  techStack: [
    { name: 'Vue', version: '3.x' },
  ],
  challenge: '核心挑战',
  approach: '解决方案',
}
```

### Step 2: 运行校验

```bash
# 方式1: 构建时自动校验（推荐）
npm run build
# recruit-guard 会在 vite build 前自动运行

# 方式2: 独立校验脚本
node scripts/validate-recruit-projects.mjs
```

### Step 3: 根据结果处理

- **0 errors**: 项目通过校验，可接入
- **有 errors**: 必须修正后重新校验，构建会被阻断
- **有 warnings**: 建议修正但不阻断

### Step 4: 添加到 projects.json

将通过校验的项目数据添加到 `src/assets/data/projects.json`。

---

## D. What Is Locked

以下内容已锁定，不可修改（除非通过完整的 Recruit Standard 校验流程）。

### IA 结构锁定

| Layer      | 元素                          | 状态   |
| ---------- | ----------------------------- | ------ |
| Identity   | `h1.pn__title`                | LOCKED |
| Evidence   | `div.pn__metrics`             | LOCKED |
| Outcome    | `div.pn__story (Impact only)` | LOCKED |
| Context    | `p.pn__desc`                  | LOCKED |
| Validation | `div.pn__tech + closure line` | LOCKED |

### CSS 视觉权重锁定

| 规则                                           | 行为                              | 状态   |
| ---------------------------------------------- | --------------------------------- | ------ |
| `.pn--recruit .pn__story-item:nth-child(-n+2)` | `display:none`                    | LOCKED |
| `.pn--recruit .pn__metric-label`               | `0.6875rem/tertiary`              | LOCKED |
| `.pn--recruit .pn__desc`                       | `0.8125rem/opacity:0.75`          | LOCKED |
| `.pn--recruit .pn__tech`                       | `max-height:2rem/overflow:hidden` | LOCKED |
| `.pn--recruit::after`                          | `1px solid line`                  | LOCKED |

### 数据规范锁定

- Metrics: 2-4项，value 必须含数字 → LOCKED
- Impact: 必须含量化结果，≤60字，禁止模糊描述 → LOCKED
- TechStack: 非空，支撑结果 → LOCKED
- 校验规则版本: `2.0.0-locked` → LOCKED

### 系统状态

```
mode: PRODUCTION
iaState: LOCKED
dataState: VALIDATED
extensionState: CONTROLLED
```

---

## E. Failure Behavior

### 构建时拦截

当 `npm run build` 执行时，`recruit-guard.mjs` 会在 `vite build` 之前运行校验：

```
🔒 Recruit Decision Engine — Build Guard
────────────────────────────────────────
❌ P5: 新项目名称
  Error [R-EV-002]: Metric value 必须包含数字: "优化"
  Error [R-OC-003]: Impact 包含模糊描述: "明显提升"
────────────────────────────────────────
Projects: 5 | Errors: 2 | Warnings: 0
❌ BUILD GUARD FAILED — 存在 2 个错误，构建已阻断
```

**结果**: `exit(1)` 阻断构建，Vite 不会启动。

### 修正流程

1. 查看错误信息，定位具体规则编号
2. 参照本文档 B 节的规则要求修正数据
3. 重新运行 `npm run build` 确认通过

### IA 结构变更检测

`getIaFingerprint()` 函数可检测 IA 结构是否被意外修改。如果指纹不匹配，说明锁定结构发生了变化。

---

## File Reference

| 文件                                    | 职责                     |
| --------------------------------------- | ------------------------ |
| `src/types/recruit-standard.ts`         | 类型定义 + 11条校验规则  |
| `src/utils/validateRecruitProject.ts`   | 校验引擎 + 接入流程      |
| `src/config/recruit-engine-lock.ts`     | Lock Manifest + 系统状态 |
| `scripts/recruit-guard.mjs`             | 构建时校验 hook          |
| `scripts/validate-recruit-projects.mjs` | 独立校验脚本             |
| `src/assets/data/projects.json`         | 项目数据源               |