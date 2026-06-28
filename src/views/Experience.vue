<template>
  <div class="min-h-screen" style="background-color: var(--bg-primary)">
    <PageHero title="工作经历" subtitle="7年前端开发经验，深耕 Vue 技术栈，从企业官网到 SaaS 平台，积累了丰富的实战经验" />

    <!-- 时间轴区域 -->
    <section class="py-16 md:py-24">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <!-- 时间轴 -->
          <div class="relative">
            <!-- 垂直线 -->
            <div
              class="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5"
              style="background-color: var(--border-color)"
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
                class="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full border-4 z-10"
                style="background-color: var(--color-primary); border-color: var(--bg-primary)"
              ></div>

              <div class="md:grid md:grid-cols-2 md:gap-8 items-start">
                <!-- 左侧内容（移动端在上，桌面端在左） -->
                <div class="md:text-right mb-4 md:mb-0 pl-12 md:pl-0">
                  <div
                    class="inline-block px-4 py-2 rounded-full mb-3"
                    style="
                      background-color: rgba(236, 72, 153, 0.1);
                      border: 1px solid var(--color-accent);
                    "
                  >
                    <span class="text-sm font-medium" style="color: var(--color-accent)">
                      {{ experience.startDate }} - {{ experience.endDate }}
                    </span>
                  </div>
                  <h3 class="text-xl md:text-2xl font-bold mb-2" style="color: var(--text-primary)">
                    {{ experience.position }}
                  </h3>
                  <p class="font-medium mb-4" style="color: var(--color-primary)">
                    {{ experience.company }}
                  </p>
                  <p class="text-sm mb-4" style="color: var(--text-secondary)">
                    <span class="inline-flex items-center">
                      <svg
                        class="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style="color: var(--text-tertiary)"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        ></path>
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                      {{ experience.location }}
                    </span>
                    <span class="mx-2">•</span>
                    <span class="inline-flex items-center">
                      <svg
                        class="w-4 h-4 mr-1"
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
                      {{ experience.duration }}
                    </span>
                  </p>
                </div>

                <!-- 右侧内容（移动端在下，桌面端在右） -->
                <div class="pl-12 md:pl-0">
                  <p class="mb-6 leading-relaxed" style="color: var(--text-secondary)">
                    {{ experience.description }}
                  </p>

                  <!-- 主要职责 -->
                  <div class="mb-6">
                    <h4
                      class="font-semibold mb-3 flex items-center"
                      style="color: var(--text-primary)"
                    >
                      <svg
                        class="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style="color: var(--color-primary)"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        ></path>
                      </svg>
                      主要职责
                    </h4>
                    <ul class="space-y-2">
                      <li
                        v-for="responsibility in experience.responsibilities"
                        :key="responsibility"
                        class="text-sm flex items-start"
                        style="color: var(--text-secondary)"
                      >
                        <span class="mr-2" style="color: var(--color-accent)">•</span>
                        {{ responsibility }}
                      </li>
                    </ul>
                  </div>

                  <!-- 主要成就 -->
                  <div class="mb-6">
                    <h4
                      class="font-semibold mb-3 flex items-center"
                      style="color: var(--text-primary)"
                    >
                      <svg
                        class="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style="color: var(--color-primary)"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                        ></path>
                      </svg>
                      主要成就
                    </h4>
                    <div class="space-y-3">
                      <div
                        v-for="achievement in experience.achievements"
                        :key="achievement.title"
                        class="rounded-lg p-4 border"
                        style="background-color: var(--bg-secondary); border-color: var(--border-color)"
                      >
                        <h5 class="font-semibold mb-2" style="color: var(--color-accent)">
                          {{ achievement.title }}
                        </h5>
                        <p class="text-sm" style="color: var(--text-secondary)">
                          {{ achievement.description }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- 技术栈 -->
                  <div>
                    <h4
                      class="font-semibold mb-3 flex items-center"
                      style="color: var(--text-primary)"
                    >
                      <svg
                        class="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style="color: var(--color-primary)"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        ></path>
                      </svg>
                      技术栈
                    </h4>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="tech in experience.techStack"
                        :key="tech"
                        class="px-3 py-1 rounded-lg text-sm font-medium"
                        style="
                          background-color: rgba(99, 102, 241, 0.1);
                          border: 1px solid var(--color-primary);
                          color: var(--color-primary);
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
import { nextTick, onMounted } from 'vue'
import { useExperienceStore } from '@/stores/useExperienceStore'
import { useGSAPAnimations } from '@/composables/useGSAPAnimations'
import PageHero from '@/components/templates/PageHero.vue'

const experienceStore = useExperienceStore()
const { staggerIn } = useGSAPAnimations()

onMounted(() => {
  experienceStore.loadExperiences()

  // 在 DOM 更新后执行动画
  nextTick(() => {
    // 工作经历项动画
    const items = document.querySelectorAll('.experience-item')
    if (items.length > 0) {
      staggerIn(items, { duration: 0.8, delay: 0.2 })
    }
  })
})
</script>