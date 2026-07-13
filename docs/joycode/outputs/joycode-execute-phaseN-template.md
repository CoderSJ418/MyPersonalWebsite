# JoyCode 执行指令 — Phase {N}: {PHASE_TITLE}

## 你是谁

你是 JoyCode，施工队。海鸥已审阅过任务文件，确认内容无误。你不需要再读 MASTER.md，直接按下面的指示执行。

## 工作目录

`E:\work\AI\MyPersonalWebsite\`

## 第一步：读任务文件

读取 `docs/joycode/tasks/phase{N}.md`，里面包含完整的任务清单和代码。

## 第二步：按任务文件逐条执行

严格按照 `phase{N}.md` 中的 Task X.X 执行。每个任务后面有验证命令，完成后立刻运行。

执行顺序：
1. Task 1.1 — 创建目录和骨架文件
2. Task 1.2 — 创建注册表
3. Task 1.3 — 创建 LabEffectCard.vue
4. Task 1.4 — 创建 LabParamPanel.vue
5. Task 1.4 (路由) — 修改 src/router/index.ts
6. Task 1.5 — 修改 Header.vue
7. Task 1.6 — 更新 LabIndex.vue 为完整实现
8. Task 1.7 — 创建校验脚本 + 修改 package.json

## 第三步：运行总体验证

```bash
npm run validate:lab
```

如果脚本不存在，先运行：
```bash
npm run lint && npm run build
```

## 第四步：写入结果

将执行结果写入 `docs/joycode/outputs/phase{N}-result.md`，格式：

```markdown
## Phase {N} 结果

**状态**：✅ 成功 / ❌ 失败

**创建的文件**：
- `路径` — 说明

**修改的文件**：
- `路径` — 修改了哪部分

**验证**：
- lint: ✅ 0 errors / ❌ [错误信息]
- build: ✅ 成功 / ❌ [错误信息]
- validate:lab: ✅ 通过 / ❌ [错误信息]

**遇到的问题**：
[如果有的话]

**备注**：
[如果有的话]
```

## 铁律（违反 = 终止）

1. 严格按 `phase{N}.md` 中的代码执行，不要自作聪明修改逻辑
2. 不创建任务文件之外的文件
3. 不修改任务文件未指定的现有文件
4. 不使用 `any` 类型
5. Lab 代码不使用 `dark:` 变体
6. 不创建 `LabCodeBlock.vue`
7. `provide('labParams')` 必须用 `reactive()` 包装
8. `v-if="effect"` 必须在 `<Suspense>` 上，不在 `<component>` 上
9. `demos/` 目录 Phase 1 保持空目录，Phase 2 才填充
