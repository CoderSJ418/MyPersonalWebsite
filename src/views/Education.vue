<template>
  <div class="min-h-screen bg-white dark:bg-slate-900">
    <PageHero title="教育背景" subtitle="持续学习，不断成长，为前端开发之路打下坚实基础" />

    <!-- 教育背景展示 -->
    <section class="py-16 md:py-24">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <!-- 教育卡片 -->
          <div
            v-for="(education, index) in educationStore.educations"
            :key="education.id"
            class="education-card group relative rounded-2xl p-8 md:p-12 mb-8 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 transition-all duration-500"
            :data-index="index"
          >
            <!-- 装饰背景 -->
            <div
              class="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl transition-all duration-500"
              style="background-color: rgba(236, 72, 153, 0.05)"
            ></div>

            <div class="relative z-10">
              <!-- 学校信息 -->
              <div class="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                <div>
                  <h2
                    class="text-2xl md:text-3xl font-bold mb-2 text-slate-900 dark:text-slate-100 transition-colors duration-300"
                  >
                    {{ education.school }}
                  </h2>
                  <div class="flex flex-wrap gap-3 mb-4">
                    <span
                      class="inline-flex items-center px-4 py-2 rounded-lg font-medium bg-indigo-500/10 border border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    >
                      <GraduationCap class="w-4 h-4 mr-2" />
                      {{ education.degree }}
                    </span>
                    <span
                      class="inline-flex items-center px-4 py-2 rounded-lg font-medium bg-pink-500/10 border border-pink-500 text-pink-600 dark:text-pink-400"
                    >
                      <FlaskConical class="w-4 h-4 mr-2" />
                      {{ education.major }}
                    </span>
                  </div>
                </div>
                <div class="flex flex-col items-start md:items-end mt-4 md:mt-0">
                  <div class="flex items-center mb-2 text-slate-500 dark:text-slate-400">
                    <Calendar class="w-4 h-4 mr-2 text-slate-400 dark:text-slate-500" />
                    {{ education.startDate }} - {{ education.endDate }}
                  </div>
                  <div class="flex items-center text-slate-500 dark:text-slate-400">
                    <Clock class="w-4 h-4 mr-2 text-slate-400 dark:text-slate-500" />
                    {{ education.duration }}
                  </div>
                </div>
              </div>

              <!-- 描述 -->
              <p class="mb-8 leading-relaxed text-slate-500 dark:text-slate-400">
                {{ education.description }}
              </p>

              <!-- 课程列表 -->
              <div class="mb-8">
                <h3 class="font-semibold mb-4 flex items-center text-slate-900 dark:text-slate-100">
                  <BookOpen class="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                  主要课程
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="course in education.courses"
                    :key="course"
                    class="px-3 py-1.5 rounded-lg text-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300"
                  >
                    {{ course }}
                  </span>
                </div>
              </div>

              <!-- 成就 -->
              <div class="mb-8">
                <h3 class="font-semibold mb-4 flex items-center text-slate-900 dark:text-slate-100">
                  <ShieldCheck class="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                  成就与收获
                </h3>
                <div class="space-y-3">
                  <div
                    v-for="achievement in education.achievements"
                    :key="achievement"
                    class="flex items-start text-slate-500 dark:text-slate-400"
                  >
                    <span class="mr-3 mt-1 text-pink-500 dark:text-pink-400">✓</span>
                    {{ achievement }}
                  </div>
                </div>
              </div>

              <!-- 项目经历 -->
              <div v-if="education.projects && education.projects.length > 0">
                <h3 class="font-semibold mb-4 flex items-center text-slate-900 dark:text-slate-100">
                  <Code2 class="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                  项目经历
                </h3>
                <div class="space-y-4">
                  <div
                    v-for="project in education.projects"
                    :key="project.title"
                    class="rounded-lg p-4 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    <h4 class="font-semibold mb-2 text-slate-900 dark:text-slate-100">
                      {{ project.title }}
                    </h4>
                    <p class="text-sm mb-3 text-slate-500 dark:text-slate-400">
                      {{ project.description }}
                    </p>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="tech in project.techStack"
                        :key="tech"
                        class="px-2 py-1 rounded text-xs font-medium bg-indigo-500/10 border border-indigo-500 text-indigo-600 dark:text-indigo-400"
                      >
                        {{ tech }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted } from 'vue'
import { useEducationStore } from '@/stores/useEducationStore'
import { useGSAPAnimations } from '@/composables/useGSAPAnimations'
import { GraduationCap, FlaskConical, Calendar, Clock, BookOpen, ShieldCheck, Code2 } from 'lucide-vue-next'
import PageHero from '@/components/templates/PageHero.vue'

const educationStore = useEducationStore()
const { staggerIn } = useGSAPAnimations()

onMounted(() => {
  educationStore.loadEducation()

  nextTick(() => {
    const cards = document.querySelectorAll('.education-card')
    if (cards.length > 0) {
      staggerIn(cards, { duration: 0.8, delay: 0.2 })
    }
  })
})
</script>
