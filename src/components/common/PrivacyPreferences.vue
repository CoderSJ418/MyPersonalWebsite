<template>
  <aside
    v-if="analyticsConsent === 'unknown'"
    class="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-5 shadow-2xl"
    aria-labelledby="analytics-consent-title"
  >
    <h2 id="analytics-consent-title" class="font-semibold text-slate-950">
      是否允许匿名使用统计？
    </h2>
    <p class="mt-2 text-sm leading-6 text-slate-600">
      仅在明确同意后加载 GA4，用于了解 Lab 访问、源码展开与复制；不发送搜索内容、参数值或代码。
    </p>
    <div class="mt-4 flex flex-wrap gap-3">
      <button type="button" class="primary-action" @click="grantAnalyticsConsent">允许统计</button>
      <button type="button" class="secondary-action" @click="denyAnalyticsConsent">拒绝</button>
      <button type="button" class="text-action" @click="openAnalyticsPreferences">了解详情</button>
    </div>
  </aside>

  <div
    v-if="analyticsPreferencesOpen"
    class="fixed inset-0 z-[110] grid place-items-center bg-slate-950/30 p-4"
  >
    <section
      ref="dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-title"
      tabindex="-1"
      class="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-6 shadow-2xl"
    >
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-sm font-semibold text-blue-600">当前状态：{{ statusLabel }}</p>
          <h2 id="privacy-title" class="mt-1 text-2xl font-bold text-slate-950">统计与隐私偏好</h2>
        </div>
        <button
          type="button"
          class="secondary-action"
          aria-label="关闭统计偏好"
          @click="closeAnalyticsPreferences"
        >
          关闭
        </button>
      </div>
      <div class="mt-5 space-y-4 text-sm leading-6 text-slate-600">
        <p>用途：评估交互实验室是否帮助访问者找到并复制可运行源码。</p>
        <p>
          事件：Lab 浏览、Demo 打开、源码展开/复制及首页 CTA 点击；仅允许来源、效果 ID、分类、
          复制目标与固定位置枚举，不包含搜索原文、参数值、代码、URL 或 user_id。
        </p>
        <p>
          本地选择最多保存 180 天；GA4 事件保留期应在管理后台固定为 2 个月，并关闭 Google Signals
          与广告个性化。
        </p>
        <p>启用 Do Not Track 时统计始终停用。撤回后停止后续事件，并清除本站可控的 GA 标识。</p>
        <a
          class="font-medium text-blue-600 underline"
          href="https://policies.google.com/technologies/partner-sites"
          target="_blank"
          rel="noopener noreferrer"
          >Google 合作伙伴网站数据说明</a
        >
      </div>
      <div class="mt-6 flex flex-wrap gap-3">
        <button
          v-if="analyticsConsent !== 'dnt'"
          type="button"
          class="primary-action"
          @click="grantAnalyticsConsent"
        >
          允许统计
        </button>
        <button
          v-if="analyticsConsent !== 'dnt'"
          type="button"
          class="secondary-action"
          @click="denyAnalyticsConsent"
        >
          拒绝或撤回
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

import {
  analyticsConsent,
  analyticsPreferencesOpen,
  closeAnalyticsPreferences,
  denyAnalyticsConsent,
  grantAnalyticsConsent,
  openAnalyticsPreferences
} from '@/services/privacyAnalytics'

const dialog = ref<HTMLElement | null>(null)
const statusLabel = computed(
  () =>
    ({
      unknown: '尚未选择',
      granted: '已允许',
      denied: '已拒绝',
      dnt: 'Do Not Track 已启用'
    })[analyticsConsent.value]
)

watch(analyticsPreferencesOpen, async (open) => {
  if (open) {
    await nextTick()
    dialog.value?.focus()
  }
})
</script>

<style scoped>
.primary-action {
  @apply min-h-11 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2;
}
.secondary-action {
  @apply min-h-11 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600;
}
.text-action {
  @apply min-h-11 px-2 py-2 text-sm font-semibold text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600;
}
</style>
