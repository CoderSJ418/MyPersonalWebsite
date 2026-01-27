<template>
  <section class="py-16 md:py-24" style="background-color: #f8fafc">
    <div class="container mx-auto px-4">
      <!-- 标题区域 -->
      <div class="text-center mb-12 md:mb-16">
        <h2
          ref="titleRef"
          class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          style="color: #0f172a"
        >
          精选项目
        </h2>
        <p
          ref="subtitleRef"
          class="text-lg md:text-xl max-w-2xl mx-auto"
          style="color: #64748b"
        >
          每个项目都是一次技术挑战，每个代码都承载着对用户体验的承诺
        </p>
      </div>

      <!-- 加载状态 -->
      <div v-if="projectStore.loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300" style="border-top-color: #f97316"></div>
        <p class="mt-4" style="color: #64748b">加载项目数据中...</p>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="projectStore.error" class="text-center py-12">
        <p class="mb-4" style="color: #ef4444">{{ projectStore.error }}</p>
        <button 
          class="px-6 py-2 rounded-lg font-semibold transition-all duration-300" 
          style="background-color: #f97316; color: #ffffff"
          @click="projectStore.loadProjects()"
        >
          重试
        </button>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!hasFeaturedProjects" class="text-center py-12">
        <p style="color: #64748b">暂无精选项目</p>
      </div>

      <!-- 项目卡片网格 -->
      <div v-else ref="gridRef" class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <!-- 大卡片 - 第一个项目 -->
        <Card3D v-if="firstFeaturedProject" :max-tilt="10" :perspective="1000" :scale="1.02" :glare="true">
          <div
            class="project-card-large group relative rounded-2xl overflow-hidden cursor-pointer border transition-all duration-500"
            style="background-color: #ffffff; border-color: #e2e8f0"
            :data-index="0"
            @click="$router.push(`/projects/${firstFeaturedProject.id}`)"
          >
            <!-- 项目图片区域 -->
            <div
              class="h-64 flex items-center justify-center relative overflow-hidden"
              style="background-color: #f97316; opacity: 0.1"
            >
              <div
                class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style="background-color: #f97316; opacity: 0.05"
              ></div>
              <component
                :is="getProjectIcon(firstFeaturedProject.id)"
                class="w-24 h-24 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                style="color: #f97316"
              />
            </div>

            <!-- 项目信息 -->
            <div class="p-6 md:p-8">
              <h3
                class="text-2xl md:text-3xl font-bold mb-3 group-hover:opacity-100 transition-colors duration-300"
                style="color: #0f172a"
              >
                {{ firstFeaturedProject.title }}
              </h3>
              <p class="mb-6 line-clamp-3 leading-relaxed" style="color: #64748b">
                {{ firstFeaturedProject.description }}
              </p>
              <div class="flex flex-wrap gap-2 mb-6">
                <span
                  v-for="tag in (firstFeaturedProject.tags || []).slice(0, 4)"
                  :key="tag"
                  class="px-3 py-1.5 rounded-lg text-sm font-medium"
                  style="background-color: #06b6d4; opacity: 0.1; color: #06b6d4"
                >
                  {{ tag }}
                </span>
              </div>
              <div
                class="flex items-center font-semibold group-hover:translate-x-2 transition-transform duration-300"
                style="color: #f97316"
              >
                查看详情
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </Card3D>

        <!-- 小卡片组 - 其他项目 -->
        <div v-if="otherFeaturedProjects.length > 0" class="space-y-6">
          <Card3D
            v-for="(project, index) in otherFeaturedProjects"
            :key="project.id"
            :max-tilt="8"
            :perspective="800"
            :scale="1.03"
            :glare="true"
          >
            <div
              class="project-card-small group relative rounded-xl overflow-hidden cursor-pointer border transition-all duration-500"
              style="background-color: #ffffff; border-color: #e2e8f0"
              :data-index="index + 1"
              @click="$router.push(`/projects/${project.id}`)"
            >
              <div class="flex items-center p-5">
                <!-- 图标 -->
                <div
                  class="w-20 h-20 flex-shrink-0 rounded-lg flex items-center justify-center mr-5"
                  style="background-color: #06b6d4; opacity: 0.1"
                >
                  <component
                    :is="getProjectIcon(project.id)"
                    class="w-10 h-10 transform group-hover:scale-110 transition-transform duration-300"
                    style="color: #06b6d4"
                  />
                </div>

                <!-- 信息 -->
                <div class="flex-1 min-w-0">
                  <h3
                    class="text-xl font-bold mb-2 group-hover:opacity-100 transition-colors duration-300"
                    style="color: #0f172a"
                  >
                    {{ project.title }}
                  </h3>
                  <p class="text-sm line-clamp-2 mb-3" style="color: #64748b">
                    {{ project.description }}
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="tag in (project.tags || []).slice(0, 2)"
                      :key="tag"
                      class="px-2 py-1 rounded text-xs font-medium"
                      style="background-color: #f97316; opacity: 0.1; color: #f97316"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>

                <!-- 箭头 -->
                <div
                  class="ml-4 transform group-hover:translate-x-1 transition-transform duration-300"
                  style="color: #06b6d4"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </Card3D>
        </div>
      </div>

      <!-- CTA 按钮 -->
      <div ref="ctaRef" class="text-center mt-12 md:mt-16">
        <RouterLink
          to="/projects"
          class="inline-flex items-center px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          style="background-color: #f97316; color: #ffffff"
        >
          查看更多项目
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            ></path>
          </svg>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useProjectStore } from '@/stores/useProjectStore'
import { useGSAPAnimations } from '@/composables/useGSAPAnimations'
import Card3D from '@/components/interactive/Card3D.vue'
import { Globe, BarChart3, Microscope, ShoppingBag } from 'lucide-vue-next'

const projectStore = useProjectStore()
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)

const { fadeInUp, staggerIn } = useGSAPAnimations()

// 计算属性：是否有精选项目
const hasFeaturedProjects = computed(() => 
  projectStore.featuredProjects && projectStore.featuredProjects.length > 0
)

// 计算属性：第一个精选项目
const firstFeaturedProject = computed(() => 
  hasFeaturedProjects.value ? projectStore.featuredProjects[0] : null
)

// 计算属性：其他精选项目
const otherFeaturedProjects = computed(() => 
  hasFeaturedProjects.value && projectStore.featuredProjects 
    ? projectStore.featuredProjects.slice(1, 3) 
    : []
)

// 根据项目ID返回不同的图标组件
const getProjectIcon = (projectId: string) => {
  const icons: Record<string, any> = {
    '1': Globe,
    '2': BarChart3,
    '3': Microscope,
    '4': ShoppingBag
  }
  return icons[projectId] || Globe
}

// 动画初始化函数
const initAnimations = async () => {
  await nextTick() // 确保DOM已更新

  // 标题动画
  if (titleRef.value) {
    fadeInUp(titleRef.value, { duration: 0.8, delay: 0.1 })
  }

  if (subtitleRef.value) {
    fadeInUp(subtitleRef.value, { duration: 0.8, delay: 0.2 })
  }

  // 项目卡片动画
  if (gridRef.value) {
    const cards = gridRef.value.querySelectorAll('.project-card-large, .project-card-small')
    if (cards.length > 0) {
      staggerIn(cards, { duration: 0.6, delay: 0.3 })
    }
  }

  // CTA 按钮动画
  if (ctaRef.value) {
    const ctaButton = ctaRef.value.querySelector('a')
    if (ctaButton) {
      fadeInUp(ctaButton, { duration: 0.6, delay: 0.7 })
    }
  }
}

onMounted(async () => {
  // 加载项目数据
  await projectStore.loadProjects()
  
  // 初始化动画
  initAnimations()
})
</script>