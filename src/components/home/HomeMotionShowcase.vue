<template>
  <section class="mx-auto max-w-7xl px-6 py-20 lg:px-8" aria-labelledby="motion-showcase-title">
    <div class="max-w-3xl">
      <p class="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
        Systems in Motion
      </p>
      <h2
        id="motion-showcase-title"
        class="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl"
      >
        不用抽象图标代替能力，直接让系统运行。
      </h2>
      <p class="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
        真实业务语义、AI 工程链路与 WebGL Shader 都在页面里运行；动画只负责解释状态、流程与空间关系。
      </p>
    </div>

    <div class="mt-12 grid gap-6 lg:grid-cols-2">
      <article
        class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)] lg:row-span-2"
      >
        <div class="border-b border-slate-200 px-6 py-5">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-blue-600">
                Enterprise GIS / Product
              </p>
              <h3 class="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                农业机械 App · 二期
              </h3>
              <p class="mt-2 text-sm leading-6 text-slate-600">
                地块、设备、作业轨迹、实时监控与 BottomSheet 的脱敏产品级重构。
              </p>
            </div>
            <RouterLink
              to="/projects/6"
              class="rounded-full border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              查看案例 →
            </RouterLink>
          </div>
        </div>
        <AgricultureProjectVisual />
      </article>

      <article
        class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
      >
        <div class="flex items-start justify-between gap-4 px-6 pb-2 pt-5">
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest text-blue-600">
              AI Native Engineering
            </p>
            <h3 class="mt-2 text-xl font-semibold text-slate-950">AI 工程工作流</h3>
            <p class="mt-2 text-sm leading-6 text-slate-600">
              Requirement → Inspect → Implement → Browser → Verified，不再用终端文字冒充流程。
            </p>
          </div>
          <RouterLink
            to="/lab/agent-flow"
            class="shrink-0 text-xs font-semibold text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            Open Lab ↗
          </RouterLink>
        </div>
        <div class="p-4 pt-2">
          <AgentFlowDemo />
        </div>
      </article>

      <article
        class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]"
      >
        <div class="flex items-start justify-between gap-4 px-6 pb-2 pt-5">
          <div>
            <p class="text-xs font-semibold uppercase tracking-widest text-blue-600">
              Interaction Systems
            </p>
            <h3 class="mt-2 text-xl font-semibold text-slate-950">
              Motion / Shader / Responsive Interaction
            </h3>
            <p class="mt-2 text-sm leading-6 text-slate-600">
              真实 WebGL fragment shader，鼠标改变局部曲率；移动与减少动态环境自动降级。
            </p>
          </div>
          <RouterLink
            to="/lab/shader-ribbon"
            class="shrink-0 text-xs font-semibold text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            Open Lab ↗
          </RouterLink>
        </div>
        <div class="p-4 pt-2">
          <ShaderRibbonDemo />
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import AgricultureProjectVisual from '@/components/home/AgricultureProjectVisual.vue'
import AgentFlowDemo from '@/views/Lab/demos/AgentFlowDemo.vue'
import ShaderRibbonDemo from '@/views/Lab/demos/ShaderRibbonDemo.vue'
</script>
