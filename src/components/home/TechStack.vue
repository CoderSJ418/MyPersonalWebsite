<template>
  <section class="py-20 md:py-28 bg-gradient-to-b from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900">
    <div class="container mx-auto px-4">
      <!-- 标题区域 -->
      <div class="text-center mb-16 md:mb-20">
        <h2
          ref="titleRef"
          class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent"
        >
          技术栈
        </h2>
        <p
          ref="subtitleRef"
          class="text-lg md:text-xl max-w-2xl mx-auto text-slate-400 dark:text-slate-500"
        >
          深耕 Vue 技术栈，熟悉现代前端工程化体系
        </p>
      </div>

      <!-- 技术栈网格 -->
      <div ref="gridRef" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div
          v-for="(tech, index) in techStack"
          :key="tech.name"
          class="tech-card group relative rounded-2xl p-8 border border-slate-700/50 dark:border-slate-700/50 bg-slate-800/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all duration-500 cursor-pointer overflow-hidden"
          :data-index="index"
        >
          <!-- 图标背景装饰 - 渐变光晕 -->
          <div
            class="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl group-hover:opacity-30 transition-all duration-500 opacity-0"
            style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)"
          ></div>

          <!-- 图标容器 -->
          <div
            class="relative z-10 flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-2xl transition-all duration-500 group-hover:scale-110"
            style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%); border: 1px solid rgba(99, 102, 241, 0.3)"
          >
            <component
              :is="tech.icon"
              class="w-10 h-10 transition-transform duration-300"
              style="color: #6366F1"
            />
          </div>

          <!-- 名称 -->
          <span
            class="relative z-10 block text-center font-semibold text-base transition-all duration-300 text-slate-100 dark:text-slate-200"
          >
            {{ tech.name }}
          </span>

          <!-- 悬停效果 - 底部渐变高亮 -->
          <div
            class="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
            style="background: linear-gradient(90deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%);"
          ></div>

          <!-- 悬停效果 - 边框发光 -->
          <div
            class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style="box-shadow: 0 0 30px rgba(99, 102, 241, 0.3);"
          ></div>
        </div>
      </div>

      <!-- 技术亮点 -->
      <div ref="highlightsRef" class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          class="tech-highlight rounded-2xl p-8 border border-slate-700/50 dark:border-slate-700/50 bg-slate-800/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2"
        >
          <div class="flex items-center mb-6">
            <div
              class="w-14 h-14 rounded-xl flex items-center justify-center mr-4"
              style="background: linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(244, 114, 182, 0.15) 100%); border: 1px solid rgba(236, 72, 153, 0.3)"
            >
              <Zap
                class="w-7 h-7"
                :style="{ color: '#EC4899' }"
              />
            </div>
            <h3 class="text-2xl font-bold text-slate-100 dark:text-slate-100">性能优化</h3>
          </div>
          <p class="text-base leading-relaxed text-slate-400 dark:text-slate-500">
            系统性地解决首屏加载、大数据渲染、内存优化等性能问题，Lighthouse 性能评分 95+
          </p>
        </div>

        <div
          class="tech-highlight rounded-2xl p-8 border border-slate-700/50 dark:border-slate-700/50 bg-slate-800/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2"
        >
          <div class="flex items-center mb-6">
            <div
              class="w-14 h-14 rounded-xl flex items-center justify-center mr-4"
              style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(167, 139, 250, 0.15) 100%); border: 1px solid rgba(139, 92, 246, 0.3)"
            >
              <FlaskConical
                class="w-7 h-7"
                :style="{ color: '#8B5CF6' }"
              />
            </div>
            <h3 class="text-2xl font-bold text-slate-100 dark:text-slate-100">工程化</h3>
          </div>
          <p class="text-base leading-relaxed text-slate-400 dark:text-slate-500">
            熟悉前端工程化体系，能够搭建开发规范、CI/CD 流程、性能监控体系
          </p>
        </div>

        <div
          class="tech-highlight rounded-2xl p-8 border border-slate-700/50 dark:border-slate-700/50 bg-slate-800/50 dark:bg-slate-800/50 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2"
        >
          <div class="flex items-center mb-6">
            <div
              class="w-14 h-14 rounded-xl flex items-center justify-center mr-4"
              style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(129, 140, 248, 0.15) 100%); border: 1px solid rgba(99, 102, 241, 0.3)"
            >
              <Settings
                class="w-7 h-7"
                :style="{ color: '#6366F1' }"
              />
            </div>
            <h3 class="text-2xl font-bold text-slate-100 dark:text-slate-100">架构设计</h3>
          </div>
          <p class="text-base leading-relaxed text-slate-400 dark:text-slate-500">
            主导过技术栈升级，设计灵活的权限系统，具备架构设计和技术选型能力
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { useGSAPAnimations } from '@/composables/useGSAPAnimations'
import { useSkillStore } from '@/stores/useSkillStore'
import { Code2, Zap, Database, Layers, Palette, Smartphone, FlaskConical, Settings } from 'lucide-vue-next'

const skillStore = useSkillStore()

const iconMap: Record<string, typeof Code2> = {
  'Vue.js': Code2,
  'Vite': Zap,
  'TypeScript': Database,
  'Pinia': Layers,
  'Tailwind CSS': Palette,
  'uni-app': Smartphone,
  'Element Plus': Layers,
  'ECharts': FlaskConical,
  'Git': Settings,
  'Webpack': Settings,
}

const displayNames: Record<string, string> = {
  'Vue.js': 'Vue 3',
  'Tailwind CSS': 'Tailwind',
}

const techStack = computed(() => {
  return skillStore.topSkills
    .filter(skill => iconMap[skill.name])
    .slice(0, 6)
    .map(skill => ({
      name: displayNames[skill.name] || skill.name,
      icon: iconMap[skill.name],
    }))
})

const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const highlightsRef = ref<HTMLElement | null>(null)

const { fadeInUp, staggerIn } = useGSAPAnimations()

onMounted(() => {
  nextTick(() => {
    if (titleRef.value) {
      fadeInUp(titleRef.value, { duration: 0.8, delay: 0.1 })
    }

    if (subtitleRef.value) {
      fadeInUp(subtitleRef.value, { duration: 0.8, delay: 0.2 })
    }

    if (gridRef.value) {
      const cards = gridRef.value.querySelectorAll('.tech-card')
      if (cards.length > 0) {
        staggerIn(cards, { duration: 0.6, delay: 0.3 })
      }
    }

    if (highlightsRef.value) {
      const highlights = highlightsRef.value.querySelectorAll('.tech-highlight')
      if (highlights.length > 0) {
        staggerIn(highlights, { duration: 0.6, delay: 0.5 })
      }
    }
  })
})
</script>
