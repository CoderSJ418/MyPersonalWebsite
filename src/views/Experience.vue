<template>
  <div class="pt-16 min-h-screen bg-white dark:bg-slate-900">
    <SEOHead
      title="工作经历"
      description="我的工作经历和职业发展"
      type="profile"
      :structured-data="personStructuredData()"
    />
    <PageHero title="工作经历" subtitle="7年前端开发经验，深耕 Vue 技术栈，从企业官网到 SaaS 平台，积累了丰富的实战经验" />

    <!-- 时间轴区域 -->
    <section class="py-16 md:py-24">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <!-- 时间轴 -->
          <div class="relative">
            <!-- 垂直线 -->
            <div
              class="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-slate-300 dark:bg-slate-600"
            ></div>

            <!-- 工作经历项 -->
            <div
              v-for="(experience, index) in experienceStore.experiences"
              :key="experience.id"
              class="experience-item relative mb-12 md:mb-16"
              :data-index="index"
            >
              <!-- 时间点 -->
              <div
                class="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full border-4 z-10 bg-indigo-500 dark:bg-indigo-400 border-white dark:border-slate-900"
              ></div>

              <div class="md:grid md:grid-cols-2 md:gap-8 items-start">
                <!-- 左侧内容（移动端在上，桌面端在左） -->
                <div class="md:text-right mb-4 md:mb-0 pl-12 md:pl-0">
                  <div
                    class="inline-block px-4 py-2 rounded-full mb-3 bg-pink-500/10 border border-pink-500"
                  >
                    <span class="text-sm font-medium text-pink-600 dark:text-pink-400">
                      {{ experience.startDate }} - {{ experience.endDate }}
                    </span>
                  </div>
                  <h3 class="text-xl md:text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">
                    {{ experience.position }}
                  </h3>
                  <p class="font-medium mb-4 text-indigo-600 dark:text-indigo-400">
                    {{ experience.company }}
                  </p>
                  <p class="text-sm mb-4 text-slate-500 dark:text-slate-400">
                    <span class="inline-flex items-center">
                      <MapPin class="w-4 h-4 mr-1 text-slate-400 dark:text-slate-500" />
                      {{ experience.location }}
                    </span>
                    <span class="mx-2">•</span>
                    <span class="inline-flex items-center">
                      <Clock class="w-4 h-4 mr-1 text-slate-400 dark:text-slate-500" />
                      {{ experience.duration }}
                    </span>
                  </p>
                </div>

                <!-- 右侧内容（移动端在下，桌面端在右） -->
                <div class="pl-12 md:pl-0">
                  <p class="mb-6 leading-relaxed text-slate-500 dark:text-slate-400">
                    {{ experience.description }}
                  </p>

                  <!-- 主要职责 -->
                  <div class="mb-6">
                    <h4
                      class="font-semibold mb-3 flex items-center text-slate-900 dark:text-slate-100"
                    >
                      <CheckSquare
                        class="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400"
                      />
                      主要职责
                    </h4>
                    <ul class="space-y-2">
                      <li
                        v-for="responsibility in experience.responsibilities"
                        :key="responsibility"
                        class="text-sm flex items-start text-slate-500 dark:text-slate-400"
                      >
                        <span class="mr-2 text-pink-500 dark:text-pink-400">•</span>
                        {{ responsibility }}
                      </li>
                    </ul>
                  </div>

                  <!-- 主要成就 -->
                  <div class="mb-6">
                    <h4
                      class="font-semibold mb-3 flex items-center text-slate-900 dark:text-slate-100"
                    >
                      <Award
                        class="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400"
                      />
                      主要成就
                    </h4>
                    <div class="space-y-3">
                      <div
                        v-for="achievement in experience.achievements"
                        :key="achievement.title"
                        class="rounded-lg p-4 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      >
                        <h5 class="font-semibold mb-2 text-pink-600 dark:text-pink-400">
                          {{ achievement.title }}
                        </h5>
                        <p class="text-sm text-slate-500 dark:text-slate-400">
                          {{ achievement.description }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- 技术栈 -->
                  <div>
                    <h4
                      class="font-semibold mb-3 flex items-center text-slate-900 dark:text-slate-100"
                    >
                      <Code2
                        class="w-5 h-5 mr-2 text-indigo-500 dark:text-indigo-400"
                      />
                      技术栈
                    </h4>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="tech in experience.techStack"
                        :key="tech"
                        class="px-3 py-1 rounded-lg text-sm font-medium bg-indigo-500/10 border border-indigo-500 text-indigo-600 dark:text-indigo-400"
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
import { useExperienceStore } from '@/stores/useExperienceStore'
import { useGSAPAnimations } from '@/composables/useGSAPAnimations'
import { MapPin, Clock, CheckSquare, Code2, Award } from 'lucide-vue-next'
import PageHero from '@/components/templates/PageHero.vue'
import SEOHead from '@/components/common/SEOHead.vue'
import { personStructuredData } from '@/utils/structuredData'

const experienceStore = useExperienceStore()
const { staggerIn } = useGSAPAnimations()

onMounted(() => {
  experienceStore.loadExperiences()

  nextTick(() => {
    const items = document.querySelectorAll('.experience-item')
    if (items.length > 0) {
      staggerIn(items, { duration: 0.8, delay: 0.2 })
    }
  })
})
</script>
