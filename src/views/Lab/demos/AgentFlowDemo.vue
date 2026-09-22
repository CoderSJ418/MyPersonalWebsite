<template>
  <div class="flow-shell">
    <div class="flow-grid" aria-label="AI 工程工作流">
      <div
        v-for="(step, index) in steps"
        :key="step.label"
        class="flow-step"
        :class="{ 'flow-step--active': index === activeStep, 'flow-step--done': index < activeStep }"
      >
        <div class="flow-icon">{{ step.icon }}</div>
        <span>{{ step.label }}</span>
        <small>{{ step.detail }}</small>
      </div>
      <div class="flow-line" aria-hidden="true">
        <span :style="{ width: progressWidth }"></span>
      </div>
    </div>

    <div class="flow-evidence">
      <span class="flow-dot"></span>
      <strong>{{ evidenceTitle }}</strong>
      <small>{{ evidenceDetail }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface FlowStep {
  icon: string
  label: string
  detail: string
}

const steps: FlowStep[] = [
  { icon: '01', label: 'Requirement', detail: '理解需求' },
  { icon: '02', label: 'Inspect', detail: '读取事实源' },
  { icon: '03', label: 'Implement', detail: '最小修改' },
  { icon: '04', label: 'Browser', detail: '运行验证' },
  { icon: '05', label: 'Verified', detail: '证据交付' }
]

const activeStep = ref(0)
const prefersReducedMotion = ref(false)
let timer = 0

const progressWidth = computed(() => {
  const maxIndex = steps.length - 1
  return maxIndex <= 0 ? '0%' : String((activeStep.value / maxIndex) * 100) + '%'
})
const evidenceTitle = computed(() =>
  activeStep.value === steps.length - 1 ? 'Evidence captured' : 'Pipeline running'
)
const evidenceDetail = computed(() =>
  activeStep.value === steps.length - 1
    ? 'Typecheck · Browser · Diff · Result'
    : steps[activeStep.value]?.detail ?? ''
)

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion.value) {
    activeStep.value = steps.length - 1
    return
  }
  timer = window.setInterval(() => {
    activeStep.value = (activeStep.value + 1) % steps.length
  }, 1050)
})

onUnmounted(() => window.clearInterval(timer))
</script>

<style scoped>
.flow-shell {
  display: grid;
  min-height: 20rem;
  place-content: center;
  gap: 1.5rem;
  overflow: hidden;
  border-radius: 1rem;
  background:
    radial-gradient(circle at 50% 20%, rgb(37 99 235 / 12%), transparent 42%),
    linear-gradient(145deg, #f8fbff, #fff);
  padding: 2rem;
}
.flow-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.65rem;
}
.flow-step {
  position: relative;
  z-index: 2;
  display: grid;
  gap: 0.35rem;
  min-width: 0;
  border: 1px solid #e2e8f0;
  border-radius: 0.9rem;
  background: rgb(255 255 255 / 92%);
  padding: 0.9rem 0.65rem;
  text-align: center;
  transition:
    transform 240ms ease,
    border-color 240ms ease,
    box-shadow 240ms ease;
}
.flow-step--active {
  transform: translateY(-0.35rem);
  border-color: #2563eb;
  box-shadow: 0 16px 36px rgb(37 99 235 / 18%);
}
.flow-step--done {
  border-color: #bfdbfe;
  background: #eff6ff;
}
.flow-icon {
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #2563eb;
}
.flow-step span {
  overflow: hidden;
  font-size: 0.78rem;
  font-weight: 700;
  color: #0f172a;
  text-overflow: ellipsis;
}
.flow-step small {
  color: #94a3b8;
  font-size: 0.65rem;
}
.flow-line {
  position: absolute;
  z-index: 1;
  left: 8%;
  right: 8%;
  top: 50%;
  height: 2px;
  overflow: hidden;
  background: #dbeafe;
}
.flow-line span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #2563eb, #60a5fa);
  box-shadow: 0 0 18px rgb(37 99 235 / 55%);
  transition: width 500ms cubic-bezier(0.16, 1, 0.3, 1);
}
.flow-evidence {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  justify-self: center;
  border: 1px solid #dbeafe;
  border-radius: 999px;
  background: #fff;
  padding: 0.65rem 0.9rem;
  box-shadow: 0 10px 28px rgb(15 23 42 / 7%);
}
.flow-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 0.3rem rgb(34 197 94 / 10%);
}
.flow-evidence strong {
  font-size: 0.76rem;
  color: #0f172a;
}
.flow-evidence small {
  font-size: 0.68rem;
  color: #64748b;
}

@media (max-width: 640px) {
  .flow-shell {
    padding: 1.25rem;
  }
  .flow-grid {
    grid-template-columns: 1fr;
  }
  .flow-line {
    display: none;
  }
}
</style>
