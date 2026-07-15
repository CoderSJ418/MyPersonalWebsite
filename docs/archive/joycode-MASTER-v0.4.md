# [OBSOLETE] JoyCode 执行指南 — /lab 效果实验室

> 状态：已废止 | 废止日期：2026-07-14
> 替代文档：`docs/prd-interaction-lab.md` v0.6 与 `docs/joycode/MASTER.md`
> 仅保留历史审计记录，不得执行下方任务或约束。

---

## 1. 这是什么项目

这是一个 Vue 3 + TypeScript + Tailwind 的个人作品集网站，正在新建 `/lab` 效果实验室专区。你只需要处理 Lab 相关的文件和指定文件，不动其他模块。

**技术栈**：Vue 3.4 / TypeScript 5.3 / Tailwind CSS 3.4 / GSAP 3.14 / Pinia 2.1 / Vue Router 4.2

---

## 2. 铁律（违反任何一条，全部回滚重做）

### 2.1 绝对禁区（碰 = 终止）

以下文件**不得修改、删除、移动、重命名、导入**：

| 文件/路径 | 原因 |
|-----------|------|
| `src/design-system/tokens/shaderPalette.ts` | 已标记废弃，Phase 3 删除 |
| `docs/prd-shader-design-system.md` | 已标记 `[OBSOLETE]` |
| `docs/prd-effects-integration.md` | 已标记 `[OBSOLETE]` |
| `src/composables/useStripeGradient.ts` | 保留不扩展 |
| `src/router/index.ts` 中的 `/:pathMatch(.*)*` | catch-all 路由 |
| `src/utils/xss.ts` | 安全相关 |

### 2.2 禁止行为

| 行为 | 后果 |
|------|------|
| 在 Lab 代码中使用 `dark:` 变体 | 错误，全局单模式 |
| 导入 `useThemeStore` | 错误，Lab 不关心主题 |
| 创建 `LabCodeBlock.vue` | 错误，复用 `CodeBlock.vue` |
| 在 demo 组件中使用 `any` 类型 | 错误，strict mode |
| 解构 `inject('labParams')` 的返回值 | 错误，会断开响应性 |
| 创建超过 80 行的 `<style scoped>` | 超出的提取到 `src/assets/styles/lab-demo-utils.css` |
| 修改非 Lab 目录的现有组件 | 除非当前 Phase 的任务文件明确指定 |

### 2.3 当前 Phase 的操作范围

**当前可创建的文件**（Phase 1）：
- `src/views/Lab/**/*.vue`
- `src/config/labRegistry.ts`
- `src/components/lab/**/*.vue`
- `src/assets/styles/lab-demo-utils.css`
- `scripts/validateLabRegistry.ts`
- `tests/unit/lab/**/*.ts`
- `docs/joycode/tasks/**/*.md`

**当前禁止创建的文件**（Phase 1）：
- `src/views/Lab/demos/**/*.vue` — Phase 2 才创建
- `src/composables/useLabDemo.ts` — Phase 2 才创建

---

## 3. 代码规范

### 3.1 Vue 组件

```ts
// 所有组件使用 <script setup lang="ts">
// Props 用 TypeScript 接口定义
// Emits 用 defineEmits<T>()
// 不使用 Options API，不使用 export default
```

### 3.2 TypeScript

- strict mode：`noImplicitAny`、`strictNullChecks`
- 不能用 `any`，用 `unknown` + 类型收窄
- `interface` 用于公开 API，`type` 用于内部类型

### 3.3 样式

- 优先 Tailwind CSS utility classes
- 必须的 keyframe animation 用 `<style scoped>`（≤80 行）
- **不使用 `dark:` 变体**
- **不使用 CSS `var(--*)` 做颜色**

### 3.4 provide/inject 约束

```ts
// provide 必须用 reactive() 包装
provide('labParams', reactive<Record<string, string | number>>({}))

// inject 后不得解构，直接访问
const params = inject<Reactive<Record<string, string | number>>>('labParams')
// ✅ params.speed
// ❌ const { speed } = params
```

### 3.5 <Suspense> + v-if

`v-if` 必须放在 `<Suspense>` 上，**不在**内部的 `<component>` 上：

```vue
<!-- ✅ 正确 -->
<Suspense v-if="effect">
  <component :is="effect.component" />
</Suspense>

<!-- ❌ 错误 -->
<Suspense>
  <component :is="effect.component" v-if="effect" />
</Suspense>
```

---

## 4. 生命周期清理

每个有副作用的组件（GSAP、rAF、事件监听）必须在 `onUnmounted` 中清理：

```ts
onUnmounted(() => {
  // GSAP: timeline.kill() / tween.kill()
  // rAF: cancelAnimationFrame(id)
  // 事件: removeEventListener(handler引用，不是匿名函数)
})
```

---

## 5. 触摸设备 / prefers-reduced-motion

### 5.1 触摸设备

使用 `useMobilePerformance` 的 `isTouch` 守卫 mousemove 效果：

```ts
const { isTouch } = useMobilePerformance()
if (isTouch.value) return // 不初始化 mousemove 监听
```

### 5.2 prefers-reduced-motion

```ts
const prefersReducedMotion = ref(false)
onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})
// 如果为 true，不启动动画
```

---

## 6. 执行方式

### 6.1 读取顺序

1. 读 `docs/joycode/MASTER.md`（就是本文档）
2. 读当前 Phase 的任务文件（如 `docs/joycode/tasks/phase1.md`）
3. 按任务顺序逐个执行
4. 每完成一个任务，运行对应的验证命令
5. 把结果写入 `docs/joycode/outputs/phase1-task-X.X-result.md`

### 6.2 报告格式

每个任务完成后，回报：

```markdown
## Task X.X 结果

**状态**：✅ 成功 / ❌ 失败

**创建的文件**：
- `path/to/file1.vue` — 已创建
- `path/to/file2.ts` — 已创建

**修改的文件**：
- `path/to/existing.vue` — 修改了第 Y-Z 行

**验证**：
- lint: ✅ 0 errors / ❌ [错误信息]
- build: ✅ 成功 / ❌ [错误信息]

**遇到的问题**：
[如果有的话，描述问题和解决方案]

**备注**：
[如果有的话]
```

---

## 7. PRD 引用

完整 PRD 位于 `docs/prd-lab-effects.md`。本文件只包含执行时必需的约束，PRD 是唯一的事实来源。

---

## 8. 全局 accent 色

Lab 页面统一使用 **蓝 `#2563EB`**。不使用紫色或其他颜色。

---

# ——— 以下按 Phase 加载 ———
