<template>
  <div class="pt-20 md:pt-24 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="container mx-auto px-4 py-8 md:py-12">
      <h1
        ref="titleRef"
        class="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8 md:mb-12"
      >
        联系方式
      </h1>

      <div class="max-w-2xl mx-auto">
        <div
          ref="formRef"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 md:p-8"
        >
          <form class="space-y-4 md:space-y-6" @submit.prevent="handleSubmit">
            <div class="form-field">
              <label for="name" class="block text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium mb-2">
                姓名
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-3 min-h-[44px] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="请输入您的姓名"
              />
            </div>

            <div class="form-field">
              <label for="email" class="block text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium mb-2">
                邮箱
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-3 min-h-[44px] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="请输入您的邮箱"
              />
            </div>

            <div class="form-field">
              <label for="message" class="block text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium mb-2">
                消息
              </label>
              <textarea
                id="message"
                v-model="form.message"
                required
                rows="5"
                class="w-full px-4 py-3 min-h-[120px] border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors resize-none"
                placeholder="请输入您的消息"
              ></textarea>
            </div>

            <button
              type="submit"
              class="w-full px-6 md:px-8 py-3 md:py-4 min-h-[44px] bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold active:scale-95"
            >
              发送消息
            </button>
          </form>

          <div v-if="submitted" class="mt-4 md:mt-6 p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg animate-in">
            消息已发送成功！我会尽快回复您。
          </div>
        </div>

        <div
          ref="contactLinksRef"
          class="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
        >
          <a
            href="mailto:shejie@example.com"
            class="contact-link flex items-center justify-center p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 active:scale-95"
          >
            <Mail class="w-6 h-6 md:w-8 md:h-8 text-primary-600 dark:text-primary-400 mr-3" />
            <span class="text-sm md:text-base text-gray-700 dark:text-gray-300">shejie@example.com</span>
          </a>
          <a
            href="https://github.com/shejie"
            target="_blank"
            rel="noopener noreferrer"
            class="contact-link flex items-center justify-center p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 active:scale-95"
          >
            <Github class="w-6 h-6 md:w-8 md:h-8 text-primary-600 dark:text-primary-400 mr-3" />
            <span class="text-sm md:text-base text-gray-700 dark:text-gray-300">GitHub</span>
          </a>
          <a
            href="https://linkedin.com/in/shejie"
            target="_blank"
            rel="noopener noreferrer"
            class="contact-link flex items-center justify-center p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 active:scale-95"
          >
            <Linkedin class="w-6 h-6 md:w-8 md:h-8 text-primary-600 dark:text-primary-400 mr-3" />
            <span class="text-sm md:text-base text-gray-700 dark:text-gray-300">LinkedIn</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Mail, Github, Linkedin } from 'lucide-vue-next'
import { useGSAPAnimations } from '@/composables/useGSAPAnimations'

const form = ref({
  name: '',
  email: '',
  message: ''
})

const submitted = ref(false)

const titleRef = ref<HTMLElement | null>(null)
const formRef = ref<HTMLElement | null>(null)
const contactLinksRef = ref<HTMLElement | null>(null)

const { fadeInUp, staggerIn } = useGSAPAnimations()

const handleSubmit = () => {
  console.log('Form submitted:', form.value)
  submitted.value = true
  setTimeout(() => {
    submitted.value = false
    form.value = { name: '', email: '', message: '' }
  }, 3000)
}

onMounted(() => {
  // 标题动画
  if (titleRef.value) {
    fadeInUp(titleRef.value, { duration: 0.8 })
  }

  // 表单动画
  if (formRef.value) {
    fadeInUp(formRef.value, { duration: 0.8, delay: 0.2 })

    // 表单字段逐个出现
    const formFields = formRef.value.querySelectorAll('.form-field')
    staggerIn(formFields, { duration: 0.6, delay: 0.4 })
  }

  // 联系链接动画
  if (contactLinksRef.value) {
    const links = contactLinksRef.value.querySelectorAll('.contact-link')
    staggerIn(links, { duration: 0.6, delay: 0.6 })
  }
})
</script>