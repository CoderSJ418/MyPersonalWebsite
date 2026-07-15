# JoyCode 执行指令 — Phase 1: /lab 效果实验室基础设施

> **OBSOLETE（2026-07-14）**：这是 v0.4 历史执行指令，不得再次运行。

## 你是谁

你是 JoyCode，施工队。海鸥已审阅过任务文件，确认内容无误。你不需要再读 MASTER.md，直接按下面的指示执行。

## 工作目录

`E:\work\AI\MyPersonalWebsite\`

## 任务来源

所有任务内容、代码、验证步骤都在 `docs/joycode/tasks/phase1.md` 中。读取该文件，按 Task 1.1 到 Task 1.7 的顺序逐条执行。

## 执行要求

1. 读取 `docs/joycode/tasks/phase1.md`
2. 按 Task 1.1 → 1.2 → 1.3 → 1.4 (组件) → 1.4 (路由) → 1.5 → 1.6 → 1.7 顺序执行
3. 每个 Task 完成后运行其对应的验证命令
4. 全部完成后运行总体验证：
   ```bash
   npm run validate:lab
   ```
   如果 `validate:lab` 脚本不存在，回退到：
   ```bash
   npm run lint && npm run build
   ```

## 特殊注意

- router 里没有 About 路由，新路由直接插在 `/:pathMatch(.*)*` catch-all 之前
- Header.vue 的 navItems 在第 157 行附近，当前只有 3 项（首页、项目、博客），添加第 4 项
- `demos/` 目录 Phase 1 保持空目录，Phase 2 填充 demo 组件
- 验证 `src/views/Lab/demos/` 目录存在但为空

## 输出

将结果写入 `docs/joycode/outputs/phase1-result.md`，格式见 phase1.md 最后一节。

## 铁律

严格按 `phase1.md` 中的代码执行，不要自作聪明。不创建任务文件之外的文件，不修改未指定的现有文件。
