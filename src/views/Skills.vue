<template>
  <div class="pt-16 min-h-screen bg-white dark:bg-slate-900">
    <SEOHead
      title="技能展示"
      description="7年前端开发经验，深耕 Vue 技术栈，熟悉现代前端工程化体系"
      type="profile"
      :structured-data="personStructuredData()"
    />
    <PageHero title="专业技能" subtitle="7年前端开发经验，深耕 Vue 技术栈，熟悉现代前端工程化体系" />

    <!-- 技能展示 -->
    <section class="py-16 md:py-24">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <!-- 核心技能 - 大卡片展示 -->
          <div class="mb-16">
            <h2 class="text-2xl md:text-3xl font-bold mb-8 flex items-center text-slate-900 dark:text-slate-100">
              <Zap class="w-6 h-6 mr-3 text-indigo-500 dark:text-indigo-400" />
              核心技能
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="skill in coreSkills"
                :key="skill.id"
                class="core-skill-card group relative rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 transition-all duration-500"
              >
                <!-- 技能图标 -->
                <div class="flex items-center justify-between mb-4">
                  <div
                    class="w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-500"
                    style="background-color: rgba(99, 102, 241, 0.1)"
                  >
                    <Code2
                      class="w-8 h-8 text-indigo-500 dark:text-indigo-400"
                    />
                  </div>
                  <div class="text-right">
                    <div class="text-3xl font-bold text-slate-900 dark:text-slate-100">
                      {{ skill.level }}%
                    </div>
                    <div class="text-sm text-slate-500 dark:text-slate-400">熟练度</div>
                  </div>
                </div>

                <!-- 技能名称和描述 -->
                <h3
                  class="text-2xl font-bold mb-3 text-slate-900 dark:text-slate-100 transition-colors duration-300"
                >
                  {{ skill.name }}
                </h3>
                <p class="mb-4 leading-relaxed text-slate-500 dark:text-slate-400">
                  {{ skill.description }}
                </p>

                <!-- 经验年限 -->
                <div class="flex items-center text-slate-500 dark:text-slate-400">
                  <Clock class="w-4 h-4 mr-2 text-pink-500 dark:text-pink-400" />
                  {{ skill.yearsOfExperience }} 年经验
                </div>
              </div>
            </div>
          </div>

          <!-- 技能分类 - 标签云 -->
          <div class="mb-16">
            <h2 class="text-2xl md:text-3xl font-bold mb-8 flex items-center text-slate-900 dark:text-slate-100">
              <Tag class="w-6 h-6 mr-3 text-pink-500 dark:text-pink-400" />
              技能分类
            </h2>
            <div class="space-y-6">
              <div
                v-for="category in skillCategories"
                :key="category.name"
                class="rounded-xl p-6 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              >
                <h3 class="text-xl font-bold mb-4 text-slate-900 dark:text-slate-100">
                  {{ category.name }}
                </h3>
                <div class="flex flex-wrap gap-3">
                  <span
                    v-for="skill in category.skills"
                    :key="skill"
                    class="px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 transition-all duration-300"
                  >
                    {{ skill }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 技术亮点 -->
          <div>
            <h2 class="text-2xl md:text-3xl font-bold mb-8 flex items-center text-slate-900 dark:text-slate-100">
              <Lightbulb
                class="w-6 h-6 mr-3 text-indigo-500 dark:text-indigo-400"
              />
              技术亮点
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                v-for="highlight in techHighlights"
                :key="highlight.title"
                class="rounded-xl p-6 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              >
                <div class="flex items-center mb-4">
                  <div
                    class="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                    style="background-color: rgba(99, 102, 241, 0.1)"
                  >
                    <CheckCircle2
                      class="w-6 h-6 text-indigo-500 dark:text-indigo-400"
                    />
                  </div>
                  <h3 class="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {{ highlight.title }}
                  </h3>
                </div>
                <p class="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
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
import { computed, nextTick, onMounted } from 'vue'
import { useSkillStore } from '@/stores/useSkillStore'
import { useGSAPAnimations } from '@/composables/useGSAPAnimations'
import { Zap, Code2, Clock, Tag, Lightbulb, CheckCircle2 } from 'lucide-vue-next'
import PageHero from '@/components/templates/PageHero.vue'
import SEOHead from '@/components/common/SEOHead.vue'
import { personStructuredData } from '@/utils/structuredData'

const skillStore = useSkillStore()
const { staggerIn } = useGSAPAnimations()

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

  nextTick(() => {
    const coreCards = document.querySelectorAll('.core-skill-card')
    if (coreCards.length > 0) {
      staggerIn(coreCards, { duration: 0.6, delay: 0.3 })
    }
  })
})
</script>
