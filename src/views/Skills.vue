<template>
  <div class="min-h-screen" style="background-color: var(--bg-primary)">
    <PageHero title="专业技能" subtitle="7年前端开发经验，深耕 Vue 技术栈，熟悉现代前端工程化体系" />

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
              <Zap class="w-6 h-6 mr-3" :style="{ color: 'var(--color-primary)' }" />
              核心技能
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="skill in coreSkills"
                :key="skill.id"
                class="core-skill-card group relative rounded-2xl p-6 md:p-8 border transition-all duration-500"
                style="background-color: var(--bg-secondary); border-color: var(--border-color)"
              >
                <!-- 技能图标 -->
                <div class="flex items-center justify-between mb-4">
                  <div
                    class="w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-500"
                    style="background-color: rgba(99, 102, 241, 0.1)"
                  >
                    <Code2
                      class="w-8 h-8"
                      :style="{ color: 'var(--color-primary)' }"
                    />
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
                  <Clock class="w-4 h-4 mr-2" :style="{ color: 'var(--color-accent)' }" />
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
              <Tag class="w-6 h-6 mr-3" :style="{ color: 'var(--color-accent)' }" />
              技能分类
            </h2>
            <div class="space-y-6">
              <div
                v-for="category in skillCategories"
                :key="category.name"
                class="rounded-xl p-6 border"
                style="background-color: var(--bg-secondary); border-color: var(--border-color)"
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
              <Lightbulb
                class="w-6 h-6 mr-3"
                :style="{ color: 'var(--color-primary)' }"
              />
              技术亮点
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                v-for="highlight in techHighlights"
                :key="highlight.title"
                class="rounded-xl p-6 border"
                style="background-color: var(--bg-secondary); border-color: var(--border-color)"
              >
                <div class="flex items-center mb-4">
                  <div
                    class="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                    style="background-color: rgba(99, 102, 241, 0.1)"
                  >
                    <CheckCircle2
                      class="w-6 h-6"
                      :style="{ color: 'var(--color-primary)' }"
                    />
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
import { computed, nextTick, onMounted } from 'vue'
import { useSkillStore } from '@/stores/useSkillStore'
import { useGSAPAnimations } from '@/composables/useGSAPAnimations'
import { Zap, Code2, Clock, Tag, Lightbulb, CheckCircle2 } from 'lucide-vue-next'
import PageHero from '@/components/templates/PageHero.vue'

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

  // 在 DOM 更新后执行动画
  nextTick(() => {
    // 核心技能卡片动画
    const coreCards = document.querySelectorAll('.core-skill-card')
    if (coreCards.length > 0) {
      staggerIn(coreCards, { duration: 0.6, delay: 0.3 })
    }
  })
})
</script>
