<template>
  <main class="min-h-screen bg-white dark:bg-slate-900">
    <PageHero
      title="联系方式" subtitle="联系我" :badge="{ icon: '✉️', text: '取得联系' }"
      :stats="[
        { number: '24h', label: '响应时间' },
        { number: '100%', label: '项目交付' },
        { number: '7年', label: '开发经验' }
      ]"
    />

    <!-- 主要内容区 -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        <!-- 表单区域 -->
        <div class="flex flex-col gap-6">
          <div class="flex items-center gap-4 mb-2">
            <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shadow-sm">
              <Mail class="w-6 h-6" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">发送消息</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">填写下面的表单，我会尽快回复您</p>
            </div>
          </div>
          <ContactForm @submit="handleFormSubmit" />
        </div>

        <!-- 信息区域 -->
        <div class="flex flex-col gap-6">
          <!-- 联系信息 -->
          <div class="rounded-2xl p-6 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                <Info class="w-5 h-5" />
              </div>
              <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">联系方式</h3>
            </div>
            <ContactInfoDisplay :contact-info="contactInfo" />
          </div>

          <!-- 社交媒体 -->
          <div class="rounded-2xl p-6 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 text-white">
                <Users class="w-5 h-5" />
              </div>
              <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">社交媒体</h3>
            </div>
            <SocialLinks :github="contactInfo.social.github" :email="contactInfo.email" :linkedin="contactInfo.social.linkedin" :twitter="contactInfo.social.twitter" />
          </div>

          <!-- 工作时间 -->
          <div class="rounded-2xl p-6 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                <Clock class="w-5 h-5" />
              </div>
              <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">工作时间</h3>
            </div>
            <div class="flex flex-col gap-2.5">
              <div class="flex justify-between items-center px-3 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-700 transition-all duration-300 hover:bg-indigo-50 dark:hover:bg-indigo-950">
                <span class="text-sm font-medium text-slate-600 dark:text-slate-300">周一至周五</span>
                <span class="text-sm text-slate-500 dark:text-slate-400 font-medium">09:00 - 18:00</span>
              </div>
              <div class="flex justify-between items-center px-3 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-700 transition-all duration-300 hover:bg-indigo-50 dark:hover:bg-indigo-950">
                <span class="text-sm font-medium text-slate-600 dark:text-slate-300">周六</span>
                <span class="text-sm text-slate-500 dark:text-slate-400 font-medium">10:00 - 16:00</span>
              </div>
              <div class="flex justify-between items-center px-3 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-700 opacity-50">
                <span class="text-sm font-medium text-slate-600 dark:text-slate-300">周日</span>
                <span class="text-sm text-slate-500 dark:text-slate-400 font-medium">休息</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Mail, Info, Users, Clock } from 'lucide-vue-next'
import contactInfoData from '@/assets/data/contact-info.json'
import type { ContactInfo } from '@/types/project'
import ContactForm from '@/components/contact/ContactForm.vue'
import ContactInfoDisplay from '@/components/contact/ContactInfoDisplay.vue'
import SocialLinks from '@/components/common/SocialLinks.vue'

const contactInfo = computed<ContactInfo>(() => contactInfoData as ContactInfo)

onMounted(() => {
  document.title = '联系我 - 佘杰'
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>
