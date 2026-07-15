# JoyCode 执行入口 — 交互实验室 v0.5

> 状态：暂停实施，等待 PRD v0.5 最终审批。

## 唯一事实来源

交互实验室的唯一有效产品需求是：

- `docs/prd-interaction-lab.md`
- `docs/adr/004-single-light-visual-mode.md`
- `.claude/rules/project-rules.md`

`docs/archive/` 中的 PRD、旧 MASTER 和旧 Phase 任务仅用于历史审计，不得作为实现输入。

## 当前阶段

- 当前 P1：交互实验室。
- Projects 案例叙事：暂停。
- 当前节点：PRD v0.5 待最终审批。
- 下一实施阶段：Phase 0 全站单一亮色迁移。

## 执行锁

在用户最终批准 v0.5 且新的 Phase 0 Task List 写入前：

- 不得继续新增或修改 Lab Demo。
- 不得执行 `docs/joycode/tasks/` 下基于 v0.4 的旧任务。
- 不得继续扩展暗色模式、旧 Shader 或 `whatamesh` 方案。
- 不得把现有实现状态视为 PRD 已完成。

审批通过后，应从 v0.5 重新生成 Phase 0 任务文件，而不是修补旧 Phase 文件。
