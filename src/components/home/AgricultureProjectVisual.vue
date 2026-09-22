<template>
  <div class="agri-shell" aria-label="农业机械 App 脱敏界面重构预览">
    <div class="agri-topbar">
      <div>
        <span>FIELD OPERATIONS</span>
        <strong>实时作业监控</strong>
      </div>
      <div class="agri-status"><i></i> Working · Auto</div>
    </div>

    <div class="agri-map">
      <svg viewBox="0 0 640 360" role="img" aria-label="地块、设备与作业轨迹示意">
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#bfdbfe" stroke-width="1" />
          </pattern>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <rect width="640" height="360" fill="#f8fbff" />
        <rect width="640" height="360" fill="url(#grid)" opacity=".48" />
        <path d="M65 72 L238 48 L302 132 L258 252 L92 270 L42 176 Z" fill="#dbeafe" stroke="#60a5fa" stroke-width="2" />
        <path d="M338 58 L548 82 L602 176 L548 286 L356 270 L312 164 Z" fill="#eff6ff" stroke="#93c5fd" stroke-width="2" />
        <path
          class="agri-route"
          d="M92 214 C142 128 210 105 266 145 C326 188 382 245 458 216 C511 196 536 144 560 117"
          fill="none"
          stroke="#2563eb"
          stroke-width="5"
          stroke-linecap="round"
          stroke-dasharray="12 10"
          filter="url(#softGlow)"
        />
        <circle cx="266" cy="145" r="18" fill="#fff" stroke="#2563eb" stroke-width="3" />
        <circle class="agri-pulse" cx="266" cy="145" r="8" fill="#2563eb" />
        <circle cx="458" cy="216" r="8" fill="#60a5fa" />
        <circle cx="560" cy="117" r="8" fill="#60a5fa" />
      </svg>

      <div class="agri-toolbar" aria-hidden="true">
        <span>⌖</span><span>▱</span><span>⛶</span>
      </div>

      <div class="agri-device">
        <span>SELECTED DEVICE</span>
        <strong>Machine · Demo</strong>
        <small>GPS online · route synced</small>
      </div>
    </div>

    <div class="agri-sheet">
      <div class="agri-handle"></div>
      <div class="agri-sheet-head">
        <div>
          <span>实时监控</span>
          <strong>当前任务 · 演示态</strong>
        </div>
        <span class="agri-badge">已启动</span>
      </div>
      <div class="agri-metrics">
        <div><span>网络状态</span><strong>Online</strong></div>
        <div><span>轨迹</span><strong>同步中</strong></div>
        <div><span>控制模式</span><strong>Auto</strong></div>
      </div>
      <div class="agri-progress"><span></span></div>
    </div>

    <div class="agri-note">Sanitized product reconstruction · 数据为演示态</div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped src="./AgricultureProjectVisual.css"></style>
