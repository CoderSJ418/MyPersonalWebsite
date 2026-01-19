<template>
  <div class="pt-24 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="container mx-auto px-4 py-12">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">加载中...</p>
      </div>

      <!-- 项目内容 -->
      <div v-else-if="project" class="max-w-4xl mx-auto">
        <button
          class="mb-8 flex items-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          @click="$router.back()"
        >
          <ArrowLeft class="w-5 h-5 mr-2" />
          返回
        </button>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div class="h-64 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <span class="text-8xl">🚀</span>
          </div>

          <div class="p-8">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {{ project.title }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              {{ project.description }}
            </p>

            <div class="flex flex-wrap gap-2 mb-8">
              <span
                v-for="tag in project.tags"
                :key="tag"
                class="px-4 py-2 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full"
              >
                {{ tag }}
              </span>
            </div>

            <div class="flex gap-4 mb-8">
              <a
                v-if="project.link"
                :href="project.link"
                target="_blank"
                rel="noopener noreferrer"
                class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                查看项目
              </a>
              <a
                v-if="project.github"
                :href="project.github"
                target="_blank"
                rel="noopener noreferrer"
                class="px-6 py-3 border-2 border-primary-600 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors"
              >
                GitHub
              </a>
            </div>

            <div class="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">项目详情</h2>
              <p class="text-gray-600 dark:text-gray-400">
                这是一个基于 {{ project.tags.join('、') }} 的项目。
                项目展示了前端开发的技术能力和工程化水平。
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 未找到项目 -->
      <div v-else class="text-center py-20">
        <div class="text-6xl mb-4">😕</div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">项目未找到</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-8">抱歉，找不到 ID 为 "{{ projectId }}" 的项目</p>
        <button
          class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          @click="$router.push('/projects')"
        >
          查看所有项目
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/useProjectStore'
import { ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const projectStore = useProjectStore()
const isLoading = ref(true)
const projectId = computed(() => route.params.id as string)

const project = computed(() => {
  const id = projectId.value
  console.log('查找项目 ID:', id)
  console.log('可用项目列表:', projectStore.projects.map(p => ({ id: p.id, title: p.title })))
  return projectStore.getProjectById(id)
})

const loadProjectData = async () => {
  isLoading.value = true
  await projectStore.loadProjects()
  isLoading.value = false
}

onMounted(async () => {
  await loadProjectData()
})

watch(() => route.params.id, async () => {
  await loadProjectData()
})
</script>