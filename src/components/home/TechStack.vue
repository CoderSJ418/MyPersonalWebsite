<template>
  <section class="py-20 md:py-28" style="background: linear-gradient(180deg, #0F172A 0%, #1E293B 100%)">
    <div class="container mx-auto px-4">
      <!-- 标题区域 -->
      <div class="text-center mb-16 md:mb-20">
        <h2
          ref="titleRef"
          class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          style="background: linear-gradient(135deg, #F1F5F9 0%, #CBD5E1 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;"
        >
          技术栈
        </h2>
        <p
          ref="subtitleRef"
          class="text-lg md:text-xl max-w-2xl mx-auto"
          style="color: #94A3B8"
        >
          深耕 Vue 技术栈，熟悉现代前端工程化体系
        </p>
      </div>

      <!-- 技术栈网格 -->
      <div ref="gridRef" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div
          v-for="(tech, index) in techStack"
          :key="tech.name"
          class="tech-card group relative rounded-2xl p-8 border transition-all duration-500 cursor-pointer overflow-hidden"
          style="background: rgba(30, 41, 59, 0.5); border-color: rgba(51, 65, 85, 0.5); backdrop-filter: blur(10px);"
          :data-index="index"
        >
          <!-- 图标背景装饰 - 渐变光晕 -->
          <div
            class="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl group-hover:opacity-30 transition-all duration-500"
            style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%); opacity: 0;"
          ></div>

          <!-- 图标容器 -->
          <div
            class="relative z-10 flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-2xl transition-all duration-500 group-hover:scale-110"
            style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%); border: 1px solid rgba(99, 102, 241, 0.3);"
          >
            <component
              :is="tech.icon"
              class="w-10 h-10 transition-transform duration-300"
              style="color: #6366F1"
            />
          </div>

          <!-- 名称 -->
          <span
            class="relative z-10 block text-center font-semibold text-base transition-all duration-300"
            style="color: #F1F5F9"
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
          class="tech-highlight rounded-2xl p-8 border transition-all duration-500 hover:transform hover:-translate-y-2"
          style="background: rgba(30, 41, 59, 0.5); border-color: rgba(51, 65, 85, 0.5); backdrop-filter: blur(10px);"
        >
          <div class="flex items-center mb-6">
            <div
              class="w-14 h-14 rounded-xl flex items-center justify-center mr-4"
              style="background: linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(244, 114, 182, 0.15) 100%); border: 1px solid rgba(236, 72, 153, 0.3);"
            >
              <svg
                class="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style="color: #EC4899"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold" style="color: #F1F5F9">性能优化</h3>
          </div>
          <p class="text-base leading-relaxed" style="color: #94A3B8">
            系统性地解决首屏加载、大数据渲染、内存优化等性能问题，Lighthouse 性能评分 95+
          </p>
        </div>

        <div
          class="tech-highlight rounded-2xl p-8 border transition-all duration-500 hover:transform hover:-translate-y-2"
          style="background: rgba(30, 41, 59, 0.5); border-color: rgba(51, 65, 85, 0.5); backdrop-filter: blur(10px);"
        >
          <div class="flex items-center mb-6">
            <div
              class="w-14 h-14 rounded-xl flex items-center justify-center mr-4"
              style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(167, 139, 250, 0.15) 100%); border: 1px solid rgba(139, 92, 246, 0.3);"
            >
              <svg
                class="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style="color: #8B5CF6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                ></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold" style="color: #F1F5F9">工程化</h3>
          </div>
          <p class="text-base leading-relaxed" style="color: #94A3B8">
            熟悉前端工程化体系，能够搭建开发规范、CI/CD 流程、性能监控体系
          </p>
        </div>

        <div
          class="tech-highlight rounded-2xl p-8 border transition-all duration-500 hover:transform hover:-translate-y-2"
          style="background: rgba(30, 41, 59, 0.5); border-color: rgba(51, 65, 85, 0.5); backdrop-filter: blur(10px);"
        >
          <div class="flex items-center mb-6">
            <div
              class="w-14 h-14 rounded-xl flex items-center justify-center mr-4"
              style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(129, 140, 248, 0.15) 100%); border: 1px solid rgba(99, 102, 241, 0.3);"
            >
              <svg
                class="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style="color: #6366F1"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                ></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold" style="color: #F1F5F9">架构设计</h3>
          </div>
          <p class="text-base leading-relaxed" style="color: #94A3B8">
            主导过技术栈升级，设计灵活的权限系统，具备架构设计和技术选型能力
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useGSAPAnimations } from '@/composables/useGSAPAnimations'
import { Code2, Zap, Database, Layers, Palette, Smartphone } from 'lucide-vue-next'

const techStack = [
  { name: 'Vue 3', icon: Code2 },
  { name: 'Vite', icon: Zap },
  { name: 'TypeScript', icon: Database },
  { name: 'Pinia', icon: Layers },
  { name: 'Tailwind', icon: Palette },
  { name: 'uni-app', icon: Smartphone }
]

const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const highlightsRef = ref<HTMLElement | null>(null)

const { fadeInUp, staggerIn } = useGSAPAnimations()

onMounted(() => {
  // 在 DOM 更新后执行动画
  nextTick(() => {
    // 标题动画
    if (titleRef.value) {
      fadeInUp(titleRef.value, { duration: 0.8, delay: 0.1 })
    }

    if (subtitleRef.value) {
      fadeInUp(subtitleRef.value, { duration: 0.8, delay: 0.2 })
    }

    // 技术卡片动画
    if (gridRef.value) {
      const cards = gridRef.value.querySelectorAll('.tech-card')
      if (cards.length > 0) {
        staggerIn(cards, { duration: 0.6, delay: 0.3 })
      }
    }

    // 技术亮点动画
    if (highlightsRef.value) {
      const highlights = highlightsRef.value.querySelectorAll('.tech-highlight')
      if (highlights.length > 0) {
        staggerIn(highlights, { duration: 0.6, delay: 0.5 })
      }
    }
  })
})
</script>