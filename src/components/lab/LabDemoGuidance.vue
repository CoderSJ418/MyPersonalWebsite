<template>
  <section class="space-y-4" aria-labelledby="lab-guidance-title">
    <div>
      <p class="text-sm font-semibold text-blue-600">从效果到真实界面</p>
      <h2 id="lab-guidance-title" class="mt-1 text-xl font-bold text-slate-950">
        使用场景与工程边界
      </h2>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <article class="rounded-xl border border-slate-200 bg-white p-5">
        <h3 class="font-semibold text-slate-900">适用场景</h3>
        <ul class="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
          <li v-for="item in effect.useCases" :key="item">{{ item }}</li>
        </ul>
      </article>
      <article class="rounded-xl border border-amber-200 bg-amber-50/60 p-5">
        <h3 class="font-semibold text-slate-900">不建议使用</h3>
        <ul class="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
          <li v-for="item in effect.avoidWhen" :key="item">{{ item }}</li>
        </ul>
      </article>
      <article class="rounded-xl border border-slate-200 bg-white p-5">
        <h3 class="font-semibold text-slate-900">实现要点</h3>
        <div class="mt-3 flex flex-wrap gap-2">
          <span
            v-for="item in effect.stack"
            :key="item"
            class="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
          >
            {{ item }}
          </span>
        </div>
        <ul class="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
          <li v-for="item in effect.implementationNotes" :key="item">{{ item }}</li>
        </ul>
      </article>
      <article class="rounded-xl border border-slate-200 bg-white p-5">
        <h3 class="font-semibold text-slate-900">性能与无障碍</h3>
        <ul class="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
          <li v-for="item in effect.performanceNotes" :key="item">性能：{{ item }}</li>
          <li v-for="item in effect.accessibilityNotes" :key="item">无障碍：{{ item }}</li>
        </ul>
      </article>
    </div>

    <div class="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
      <h3 class="font-semibold text-slate-900">推荐搭配</h3>
      <div class="mt-3 flex flex-wrap gap-2">
        <RouterLink
          v-for="id in effect.pairings"
          :key="id"
          :to="`/lab/${id}`"
          class="rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          {{ pairingName(id) }}
        </RouterLink>
      </div>
      <div v-if="effect.usedIn.length" class="mt-4 border-t border-slate-200 pt-4">
        <h3 class="font-semibold text-slate-900">站内真实应用</h3>
        <div class="mt-2 flex flex-wrap gap-3">
          <RouterLink
            v-for="location in effect.usedIn"
            :key="location.path"
            :to="location.path"
            class="font-medium text-blue-700 underline-offset-4 hover:underline"
          >
            {{ location.label }}
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { findLabEffect } from '@/config/labRegistry'
import type { LabEffect, LabEffectId } from '@/types/lab'

interface Props {
  effect: LabEffect
}

defineProps<Props>()

const pairingName = (id: LabEffectId) => findLabEffect(id)?.name ?? id
</script>
