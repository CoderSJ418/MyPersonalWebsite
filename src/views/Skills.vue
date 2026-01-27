<template>
  <div class="min-h-screen" style="background-color: var(--bg-primary)">
    <!-- Hero 区域 -->
    <section class="py-16 md:py-24 relative overflow-hidden">
      <div class="container mx-auto px-4">
        <div class="text-center">
          <h1
            class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            style="color: var(--text-primary)"
          >
            专业技能
          </h1>
          <p class="text-lg md:text-xl max-w-2xl mx-auto" style="color: var(--text-secondary)">
            7年前端开发经验，深耕 Vue 技术栈，熟悉现代前端工程化体系
          </p>
        </div>
      </div>
    </section>

    <!-- 技能展示 -->
    <section class="py-16 md:py-24">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <!-- 核心技能 - 大卡片展示 -->
          <div class="mb-16">
            <h2
              class="text-2xl md:text-3xl font-bold mb-8 flex items-center"
              style="color: var(--text-primary)"
            >
              <svg
                class="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style="color: var(--accent-color)"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
              核心技能
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="skill in coreSkills"
                :key="skill.id"
                class="core-skill-card group relative rounded-2xl p-6 md:p-8 border transition-all duration-500"
                style="background-color: var(--bg-surface); border-color: var(--bg-card)"
              >
                <!-- 技能图标 -->
                <div class="flex items-center justify-between mb-4">
                  <div
                    class="w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-500"
                    style="background-color: var(--accent-color); opacity: 0.1"
                  >
                    <svg
                      class="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style="color: var(--accent-color)"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      ></path>
                    </svg>
                  </div>
                  <div class="text-right">
                    <div class="text-3xl font-bold" style="color: var(--text-primary)">
                      {{ skill.level }}%
                    </div>
                    <div class="text-sm" style="color: var(--text-secondary)">熟练度</div>
                  </div>
                </div>

                <!-- 技能名称和描述 -->
                <h3
                  class="text-2xl font-bold mb-3 transition-colors duration-300"
                  style="color: var(--text-primary)"
                >
                  {{ skill.name }}
                </h3>
                <p class="mb-4 leading-relaxed" style="color: var(--text-secondary)">
                  {{ skill.description }}
                </p>

                <!-- 经验年限 -->
                <div class="flex items-center" style="color: var(--text-secondary)">
                  <svg
                    class="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style="color: var(--secondary-color)"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  {{ skill.yearsOfExperience }} 年经验
                </div>
              </div>
            </div>
          </div>

          <!-- 技能分类 - 标签云 -->
          <div class="mb-16">
            <h2
              class="text-2xl md:text-3xl font-bold mb-8 flex items-center"
              style="color: var(--text-primary)"
            >
              <svg
                class="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style="color: var(--secondary-color)"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                ></path>
              </svg>
              技能分类
            </h2>
            <div class="space-y-6">
              <div
                v-for="category in skillCategories"
                :key="category.name"
                class="rounded-xl p-6 border"
                style="background-color: var(--bg-surface); border-color: var(--bg-card)"
              >
                <h3
                  class="text-xl font-bold mb-4"
                  style="color: var(--text-primary)"
                >
                  {{ category.name }}
                </h3>
                <div class="flex flex-wrap gap-3">
                  <span
                    v-for="skill in category.skills"
                    :key="skill"
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                    style="
                      background-color: var(--bg-primary);
                      border: 1px solid var(--border-color);
                      color: var(--text-secondary);
                    "
                  >
                    {{ skill }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 技术亮点 -->
          <div>
            <h2
              class="text-2xl md:text-3xl font-bold mb-8 flex items-center"
              style="color: var(--text-primary)"
            >
              <svg
                class="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style="color: var(--accent-color)"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                ></path>
              </svg>
              技术亮点
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                v-for="highlight in techHighlights"
                :key="highlight.title"
                class="rounded-xl p-6 border"
                style="background-color: var(--bg-surface); border-color: var(--bg-card)"
              >
                <div class="flex items-center mb-4">
                  <div
                    class="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                    style="background-color: var(--accent-color); opacity: 0.1"
                  >
                    <svg
                      class="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style="color: var(--accent-color)"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold" style="color: var(--text-primary)">
                    {{ highlight.title }}
                  </h3>
                </div>
                <p class="text-sm leading-relaxed" style="color: var(--text-secondary)">
                  {{ highlight.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSkillStore } from '@/stores/useSkillStore'
import { useGSAPAnimations } from '@/composables/useGSAPAnimations'

const skillStore = useSkillStore()
const { fadeInUp, staggerIn } = useGSAPAnimations()

// 核心技能
const coreSkills = computed(() => {
  const skills = skillStore.skills || []
  return skills.filter((skill) => skill.level >= 85).slice(0, 4)
})

// 技能分类
const skillCategories = computed(() => {
  const skills = skillStore.skills || []
  const categories = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill.name)
    return acc
  }, {} as Record<string, string[]>)

  return Object.entries(categories).map(([name, skills]) => ({
    name,
    skills
  }))
})

// 技术亮点
const techHighlights = [
  {
    title: '技术栈升级',
    description: '主导过从 Vue 2/Webpack 到 Vue 3 + TypeScript + Vite 的完整升级，解决了兼容性、构建性能、团队培训等问题'
  },
  {
    title: '性能优化实践',
    description: '在多个项目中系统性地解决了首屏加载、大数据渲染、内存优化等性能问题，Lighthouse 性能评分 95+'
  },
  {
    title: '权限系统设计',
    description: '设计了灵活的 RBAC 权限系统，支持动态路由、按钮级权限、权限配置，被多个项目复用'
  }
]

onMounted(() => {
  skillStore.loadSkills()

  // 核心技能卡片动画
  const coreCards = document.querySelectorAll('.core-skill-card')
  staggerIn(coreCards, { duration: 0.6, delay: 0.3 })
})
</script>