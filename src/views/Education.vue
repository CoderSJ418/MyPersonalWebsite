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
            教育背景
          </h1>
          <p class="text-lg md:text-xl max-w-2xl mx-auto" style="color: var(--text-secondary)">
            持续学习，不断成长，为前端开发之路打下坚实基础
          </p>
        </div>
      </div>
    </section>

    <!-- 教育背景展示 -->
    <section class="py-16 md:py-24">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <!-- 教育卡片 -->
          <div
            v-for="(education, index) in educationStore.educations"
            :key="education.id"
            class="education-card group relative rounded-2xl p-8 md:p-12 mb-8 border transition-all duration-500"
            style="background-color: var(--bg-surface); border-color: var(--bg-card)"
            :data-index="index"
          >
            <!-- 装饰背景 -->
            <div
              class="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl transition-all duration-500"
              style="background-color: var(--secondary-color); opacity: 0.05"
            ></div>

            <div class="relative z-10">
              <!-- 学校信息 -->
              <div class="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                <div>
                  <h2
                    class="text-2xl md:text-3xl font-bold mb-2 transition-colors duration-300"
                    style="color: var(--text-primary)"
                  >
                    {{ education.school }}
                  </h2>
                  <div class="flex flex-wrap gap-3 mb-4">
                    <span
                      class="inline-flex items-center px-4 py-2 rounded-lg font-medium"
                      style="
                        background-color: rgba(var(--accent-color), 0.1);
                        border: 1px solid var(--accent-color);
                        color: var(--accent-color);
                      "
                    >
                      <svg
                        class="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 14l9-5-9-5-9 5 9 5z"
                        ></path>
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                        ></path>
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                        ></path>
                      </svg>
                      {{ education.degree }}
                    </span>
                    <span
                      class="inline-flex items-center px-4 py-2 rounded-lg font-medium"
                      style="
                        background-color: rgba(var(--secondary-color), 0.1);
                        border: 1px solid var(--secondary-color);
                        color: var(--secondary-color);
                      "
                    >
                      <svg
                        class="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        ></path>
                      </svg>
                      {{ education.major }}
                    </span>
                  </div>
                </div>
                <div class="flex flex-col items-start md:items-end mt-4 md:mt-0">
                  <div class="flex items-center mb-2" style="color: var(--text-secondary)">
                    <svg
                      class="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style="color: var(--text-tertiary)"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                    {{ education.startDate }} - {{ education.endDate }}
                  </div>
                  <div class="flex items-center" style="color: var(--text-secondary)">
                    <svg
                      class="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style="color: var(--text-tertiary)"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    {{ education.duration }}
                  </div>
                </div>
              </div>

              <!-- 描述 -->
              <p class="mb-8 leading-relaxed" style="color: var(--text-secondary)">
                {{ education.description }}
              </p>

              <!-- 课程列表 -->
              <div class="mb-8">
                <h3 class="font-semibold mb-4 flex items-center" style="color: var(--text-primary)">
                  <svg
                    class="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style="color: var(--accent-color)"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    ></path>
                  </svg>
                  主要课程
                </h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="course in education.courses"
                    :key="course"
                    class="px-3 py-1.5 rounded-lg text-sm"
                    style="
                      background-color: var(--bg-surface);
                      border: 1px solid var(--bg-card);
                      color: var(--text-secondary);
                    "
                  >
                    {{ course }}
                  </span>
                </div>
              </div>

              <!-- 成就 -->
              <div class="mb-8">
                <h3 class="font-semibold mb-4 flex items-center" style="color: var(--text-primary)">
                  <svg
                    class="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style="color: var(--accent-color)"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    ></path>
                  </svg>
                  成就与收获
                </h3>
                <div class="space-y-3">
                  <div
                    v-for="achievement in education.achievements"
                    :key="achievement"
                    class="flex items-start"
                    style="color: var(--text-secondary)"
                  >
                    <span class="mr-3 mt-1" style="color: var(--secondary-color)">✓</span>
                    {{ achievement }}
                  </div>
                </div>
              </div>

              <!-- 项目经历 -->
              <div v-if="education.projects && education.projects.length > 0">
                <h3 class="font-semibold mb-4 flex items-center" style="color: var(--text-primary)">
                  <svg
                    class="w-5 h-5 mr-2"
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
                  项目经历
                </h3>
                <div class="space-y-4">
                  <div
                    v-for="project in education.projects"
                    :key="project.title"
                    class="rounded-lg p-4 border"
                    style="background-color: var(--bg-primary); border-color: var(--bg-card)"
                  >
                    <h4 class="font-semibold mb-2" style="color: var(--text-primary)">
                      {{ project.title }}
                    </h4>
                    <p class="text-sm mb-3" style="color: var(--text-secondary)">
                      {{ project.description }}
                    </p>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="tech in project.techStack"
                        :key="tech"
                        class="px-2 py-1 rounded text-xs font-medium"
                        style="
                          background-color: rgba(var(--accent-color), 0.1);
                          border: 1px solid var(--accent-color);
                          color: var(--accent-color);
                        "
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
import { ref, onMounted } from 'vue'
import { useEducationStore } from '@/stores/useEducationStore'
import { useGSAPAnimations } from '@/composables/useGSAPAnimations'

const educationStore = useEducationStore()
const { fadeInUp, staggerIn } = useGSAPAnimations()

onMounted(() => {
  educationStore.loadEducation()

  // 教育卡片动画
  const cards = document.querySelectorAll('.education-card')
  staggerIn(cards, { duration: 0.8, delay: 0.2 })
})
</script>
