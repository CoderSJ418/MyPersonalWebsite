<script setup lang="ts">
/**
 * ProjectDetailContent — 项目详情内容区（Reader Mode）
 *
 * 接收 ReaderView Contract 数据，不直接读取 ProjectDetail schema
 * 仅在 Reader Mode 或无 narrative 回退时渲染
 */

import type { ReaderView } from '@/types/view-contract'
import DetailSection from '@/components/common/DetailSection.vue'
import SafeImage from '@/components/common/SafeImage.vue'

interface Props {
  data: ReaderView
}

defineProps<Props>()
</script>

<template>
  <div class="pdc">
    <!-- 项目背景 -->
    <DetailSection v-if="data.background" title="项目背景">
      <p class="pdc__text">{{ data.background }}</p>
    </DetailSection>

    <!-- 项目目标 -->
    <DetailSection v-if="data.goals && data.goals.length > 0" title="项目目标">
      <ul class="pdc__list">
        <li v-for="(goal, index) in data.goals" :key="index">{{ goal }}</li>
      </ul>
    </DetailSection>

    <!-- 实现功能 -->
    <DetailSection v-if="data.features && data.features.length > 0" title="实现功能">
      <ul class="pdc__list">
        <li v-for="(feature, index) in data.features" :key="index">{{ feature }}</li>
      </ul>
    </DetailSection>

    <!-- 核心技术亮点 -->
    <DetailSection v-if="data.techHighlights" title="核心技术亮点">
      <DetailSection v-if="data.techHighlights.architecture" title="架构设计" :level="3" :divided="false">
        <p class="pdc__text">{{ data.techHighlights.architecture }}</p>
      </DetailSection>

      <DetailSection
v-if="data.techHighlights.keyImplementations && data.techHighlights.keyImplementations.length > 0"
        title="关键实现" :level="3" :divided="false">
        <ul class="pdc__list">
          <li v-for="(impl, index) in data.techHighlights.keyImplementations" :key="index">{{ impl }}</li>
        </ul>
      </DetailSection>

      <DetailSection
        v-if="data.techHighlights.performanceOptimizations && data.techHighlights.performanceOptimizations.length > 0"
        title="性能优化" :level="3" :divided="false">
        <ul class="pdc__list">
          <li v-for="(opt, index) in data.techHighlights.performanceOptimizations" :key="index">{{ opt }}</li>
        </ul>
      </DetailSection>

      <DetailSection v-if="data.techHighlights.solution" title="解决方案" :level="3" :divided="false">
        <p class="pdc__text">{{ data.techHighlights.solution }}</p>
      </DetailSection>
    </DetailSection>

    <!-- 项目成果 -->
    <DetailSection v-if="data.results" title="项目成果">
      <div v-if="data.results.performance" class="pdc__result">
        <h4 class="pdc__result-title">性能指标</h4>
        <p class="pdc__text">{{ data.results.performance }}</p>
      </div>
      <div v-if="data.results.business" class="pdc__result">
        <h4 class="pdc__result-title">业务指标</h4>
        <p class="pdc__text">{{ data.results.business }}</p>
      </div>
      <div v-if="data.results.feedback" class="pdc__result">
        <h4 class="pdc__result-title">用户反馈</h4>
        <p class="pdc__text">{{ data.results.feedback }}</p>
      </div>
      <div v-if="data.results.highlights && data.results.highlights.length > 0" class="pdc__result">
        <h4 class="pdc__result-title">项目亮点</h4>
        <ul class="pdc__list">
          <li v-for="(highlight, index) in data.results.highlights" :key="index">{{ highlight }}</li>
        </ul>
      </div>
    </DetailSection>

    <!-- 项目截图 -->
    <DetailSection v-if="data.screenshots && data.screenshots.length > 0" title="项目截图" :divided="false">
      <div class="pdc__screenshots">
        <SafeImage
v-for="(screenshot, index) in data.screenshots" :key="index" :src="screenshot"
          :alt="`${data.title} 截图 ${index + 1}`" image-class="pdc__screenshot" width="1200" height="800" />
      </div>
    </DetailSection>
  </div>
</template>

<style scoped>
/* ===== 文本 ===== */
.pdc__text {
  font-size: 1rem;
  line-height: var(--leading-relaxed);
  color: var(--us-text-secondary);
  margin: 0;
}

/* ===== 列表 ===== */
.pdc__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.pdc__list li {
  position: relative;
  padding-left: var(--us-space-6);
  margin-bottom: var(--us-space-3);
  font-size: 0.9375rem;
  line-height: var(--leading-relaxed);
  color: var(--us-text-secondary);
}

.pdc__list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.65em;
  width: 6px;
  height: 6px;
  background: var(--us-accent);
  border-radius: 50%;
}

/* ===== 结果项 ===== */
.pdc__result {
  margin-bottom: var(--us-space-6);
}

.pdc__result:last-child {
  margin-bottom: 0;
}

.pdc__result-title {
  margin: 0 0 var(--us-space-2);
  font-size: 1rem;
  font-weight: 600;
  color: var(--us-text-primary);
}

/* ===== 截图网格 ===== */
.pdc__screenshots {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--us-space-6);
}

@media (min-width: 768px) {
  .pdc__screenshots {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}

.pdc__screenshot {
  width: 100%;
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--us-border);
  transition: transform var(--us-duration-normal) var(--us-easing),
    box-shadow var(--us-duration-normal) var(--us-easing);
}

.pdc__screenshot:hover {
  transform: translateY(var(--us-lift-sm));
  box-shadow: var(--us-depth-1);
}
</style>