<template>
  <div class="monitoring-dashboard p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">监控仪表板</h2>

    <!-- 性能指标 -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">性能指标</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-4 rounded-lg" :class="getPerformanceClass(performanceScore.score)">
          <div class="text-sm font-medium text-gray-600 dark:text-gray-400">性能评分</div>
          <div class="text-3xl font-bold mt-2">{{ performanceScore.score }}/100</div>
          <div class="text-sm mt-1">{{ performanceScore.grade }}</div>
        </div>

        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div class="text-sm font-medium text-gray-600 dark:text-gray-400">LCP</div>
          <div class="text-2xl font-bold mt-2">
            {{ formatMetric(metrics.LCP, 'ms') }}
          </div>
          <div class="text-xs mt-1 text-gray-500">目标: &lt; 2.5s</div>
        </div>

        <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div class="text-sm font-medium text-gray-600 dark:text-gray-400">FID</div>
          <div class="text-2xl font-bold mt-2">
            {{ formatMetric(metrics.FID, 'ms') }}
          </div>
          <div class="text-xs mt-1 text-gray-500">目标: &lt; 100ms</div>
        </div>

        <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <div class="text-sm font-medium text-gray-600 dark:text-gray-400">CLS</div>
          <div class="text-2xl font-bold mt-2">
            {{ metrics.CLS !== null ? metrics.CLS.toFixed(3) : 'N/A' }}
          </div>
          <div class="text-xs mt-1 text-gray-500">目标: &lt; 0.1</div>
        </div>

        <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div class="text-sm font-medium text-gray-600 dark:text-gray-400">FCP</div>
          <div class="text-2xl font-bold mt-2">
            {{ formatMetric(metrics.FCP, 'ms') }}
          </div>
          <div class="text-xs mt-1 text-gray-500">首次内容绘制</div>
        </div>

        <div class="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <div class="text-sm font-medium text-gray-600 dark:text-gray-400">TBT</div>
          <div class="text-2xl font-bold mt-2">
            {{ formatMetric(metrics.TBT, 'ms') }}
          </div>
          <div class="text-xs mt-1 text-gray-500">总阻塞时间</div>
        </div>
      </div>

      <!-- 性能建议 -->
      <div v-if="performanceScore.issues.length > 0" class="mt-4">
        <h4 class="text-sm font-semibold mb-2 text-red-600 dark:text-red-400">性能问题</h4>
        <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
          <li v-for="issue in performanceScore.issues" :key="issue">{{ issue }}</li>
        </ul>
      </div>

      <div v-if="performanceScore.recommendations.length > 0" class="mt-4">
        <h4 class="text-sm font-semibold mb-2 text-blue-600 dark:text-blue-400">优化建议</h4>
        <ul class="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
          <li v-for="rec in performanceScore.recommendations" :key="rec">{{ rec }}</li>
        </ul>
      </div>
    </div>

    <!-- 错误统计 -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">错误统计</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div class="text-sm font-medium text-gray-600 dark:text-gray-400">总错误数</div>
          <div class="text-3xl font-bold mt-2 text-red-600 dark:text-red-400">
            {{ errorStats.total }}
          </div>
        </div>

        <div class="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <div class="text-sm font-medium text-gray-600 dark:text-gray-400">JavaScript 错误</div>
          <div class="text-2xl font-bold mt-2">
            {{ errorStats.byType.javascript || 0 }}
          </div>
        </div>

        <div class="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
          <div class="text-sm font-medium text-gray-600 dark:text-gray-400">Promise 错误</div>
          <div class="text-2xl font-bold mt-2">
            {{ errorStats.byType.promise || 0 }}
          </div>
        </div>
      </div>

      <!-- 最近错误 -->
      <div v-if="recentErrors.length > 0" class="mt-4">
        <h4 class="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">最近错误</h4>
        <div class="space-y-2">
          <div
            v-for="error in recentErrors"
            :key="error.timestamp"
            class="p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
          >
            <div class="text-sm font-medium text-red-600 dark:text-red-400">
              {{ error.message }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              {{ new Date(error.timestamp).toLocaleString() }} - {{ error.tags?.type }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户行为统计 -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">用户行为统计</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
          <div class="text-sm font-medium text-gray-600 dark:text-gray-400">总事件数</div>
          <div class="text-3xl font-bold mt-2 text-teal-600 dark:text-teal-400">
            {{ analyticsStats.events.total }}
          </div>
        </div>

        <div class="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
          <div class="text-sm font-medium text-gray-600 dark:text-gray-400">页面浏览</div>
          <div class="text-2xl font-bold mt-2">
            {{ analyticsStats.pages.total }}
          </div>
        </div>

        <div class="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
          <div class="text-sm font-medium text-gray-600 dark:text-gray-400">平均停留时间</div>
          <div class="text-2xl font-bold mt-2">
            {{ formatDuration(analyticsStats.pages.avgDuration) }}
          </div>
        </div>
      </div>

      <!-- 事件分类 -->
      <div v-if="Object.keys(analyticsStats.events.byCategory).length > 0" class="mt-4">
        <h4 class="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">事件分类</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div
            v-for="(count, category) in analyticsStats.events.byCategory"
            :key="category"
            class="p-2 bg-gray-50 dark:bg-gray-700 rounded text-center"
          >
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ category }}</div>
            <div class="text-lg font-bold text-gray-900 dark:text-white">{{ count }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 可用性统计 -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">可用性统计</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div class="text-sm font-medium text-gray-600 dark:text-gray-400">可用性</div>
          <div class="text-3xl font-bold mt-2 text-green-600 dark:text-green-400">
            {{ uptimeReport.uptime }}%
          </div>
        </div>

        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div class="text-sm font-medium text-gray-600 dark:text-gray-400">健康检查</div>
          <div class="text-2xl font-bold mt-2">
            {{ uptimeReport.totalChecks }}
          </div>
        </div>

        <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <div class="text-sm font-medium text-gray-600 dark:text-gray-400">平均响应时间</div>
          <div class="text-2xl font-bold mt-2">{{ uptimeReport.avgResponseTime }}ms</div>
        </div>

        <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div class="text-sm font-medium text-gray-600 dark:text-gray-400">错误数</div>
          <div class="text-2xl font-bold mt-2 text-red-600 dark:text-red-400">
            {{ uptimeReport.errors }}
          </div>
        </div>
      </div>

      <!-- 健康状态 -->
      <div class="mt-4">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">当前状态:</span>
          <span
            class="px-3 py-1 rounded-full text-sm font-medium"
            :class="getHealthStatusClass(currentHealth?.status)"
          >
            {{ currentHealth?.status || 'Unknown' }}
          </span>
        </div>
      </div>
    </div>

    <!-- 刷新按钮 -->
    <div class="flex gap-2">
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        @click="refreshData"
      >
        刷新数据
      </button>
      <button
        class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        @click="exportReport"
      >
        导出报告
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { createPerformanceMonitor } from '@/utils/performance'
import { getErrorTracker } from '@/utils/errorTracking'
import { getAnalyticsTracker } from '@/utils/analytics'
import { getUptimeMonitor } from '@/utils/uptime'

// 性能指标
const metrics = ref<any>({})
const performanceScore = ref<any>({ score: 0, grade: 'N/A', issues: [], recommendations: [] })

// 错误统计
const errorStats = ref<any>({ total: 0, byType: {}, byUrl: {} })
const recentErrors = ref<any[]>([])

// 用户行为统计
const analyticsStats = ref<any>({
  events: { total: 0, byCategory: {}, byAction: {} },
  pages: { total: 0, uniquePages: 0, avgDuration: 0 }
})

// 可用性统计
const uptimeReport = ref<any>({
  uptime: 100,
  totalChecks: 0,
  avgResponseTime: 0,
  errors: 0
})
const currentHealth = ref<any>(null)

/**
 * 格式化指标
 */
function formatMetric(value: number | null, unit: string): string {
  if (value === null) return 'N/A'
  return `${value}${unit}`
}

/**
 * 格式化持续时间
 */
function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${(ms / 60000).toFixed(1)}m`
}

/**
 * 获取性能等级样式
 */
function getPerformanceClass(score: number): string {
  if (score >= 90) return 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
  if (score >= 70) return 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
  if (score >= 50) return 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
  return 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
}

/**
 * 获取健康状态样式
 */
function getHealthStatusClass(status?: string): string {
  switch (status) {
    case 'healthy':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    case 'degraded':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'unhealthy':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
  }
}

/**
 * 刷新数据
 */
async function refreshData() {
  // 刷新性能指标
  const perfMonitor = createPerformanceMonitor()
  metrics.value = perfMonitor.getMetrics()
  performanceScore.value = perfMonitor.getScore()

  // 刷新错误统计
  const errorTracker = getErrorTracker()
  errorStats.value = errorTracker.getErrorStats()
  recentErrors.value = errorTracker.getErrorBuffer().slice(-5)

  // 刷新用户行为统计
  const analytics = getAnalyticsTracker()
  analyticsStats.value = analytics.getStats()

  // 刷新可用性统计
  const uptime = getUptimeMonitor()
  uptimeReport.value = uptime.getUptimeReport()
  currentHealth.value = uptime.getCurrentHealth()
}

/**
 * 导出报告
 */
function exportReport() {
  const report = {
    timestamp: new Date().toISOString(),
    performance: {
      metrics: metrics.value,
      score: performanceScore.value
    },
    errors: {
      stats: errorStats.value,
      recent: recentErrors.value
    },
    analytics: analyticsStats.value,
    uptime: uptimeReport.value,
    health: currentHealth.value
  }

  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `monitoring-report-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  refreshData()

  // 每30秒自动刷新
  setInterval(refreshData, 30000)
})
</script>

<style scoped>
.monitoring-dashboard {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
