<template>
  <form class="flex flex-col gap-6" @submit.prevent="handleSubmit">
    <div class="flex flex-col gap-2">
      <label for="name" class="text-sm font-medium text-slate-700 dark:text-slate-300">姓名 *</label>
      <input
        id="name"
        v-model="formData.name"
        type="text"
        class="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 transition-all duration-200 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 placeholder:text-slate-400 dark:placeholder:text-slate-500"
        :class="{ 'border-red-500 dark:border-red-400': errors.name }"
        placeholder="您的姓名"
        required
      />
      <span v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</span>
    </div>

    <div class="flex flex-col gap-2">
      <label for="email" class="text-sm font-medium text-slate-700 dark:text-slate-300">邮箱 *</label>
      <input
        id="email"
        v-model="formData.email"
        type="email"
        class="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 transition-all duration-200 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 placeholder:text-slate-400 dark:placeholder:text-slate-500"
        :class="{ 'border-red-500 dark:border-red-400': errors.email }"
        placeholder="your@email.com"
        required
      />
      <span v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</span>
    </div>

    <div class="flex flex-col gap-2">
      <label for="subject" class="text-sm font-medium text-slate-700 dark:text-slate-300">主题 *</label>
      <input
        id="subject"
        v-model="formData.subject"
        type="text"
        class="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 transition-all duration-200 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 placeholder:text-slate-400 dark:placeholder:text-slate-500"
        :class="{ 'border-red-500 dark:border-red-400': errors.subject }"
        placeholder="消息主题"
        required
      />
      <span v-if="errors.subject" class="text-xs text-red-500">{{ errors.subject }}</span>
    </div>

    <div class="flex flex-col gap-2">
      <label for="message" class="text-sm font-medium text-slate-700 dark:text-slate-300">消息 *</label>
      <textarea
        id="message"
        v-model="formData.message"
        class="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 transition-all duration-200 focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-y min-h-[120px]"
        :class="{ 'border-red-500 dark:border-red-400': errors.message }"
        placeholder="请输入您的消息..."
        rows="6"
        required
      />
      <span v-if="errors.message" class="text-xs text-red-500">{{ errors.message }}</span>
    </div>

    <button
      type="submit"
      class="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 dark:bg-indigo-500 text-white font-semibold rounded-lg transition-all duration-200 hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
      :disabled="isSubmitting"
    >
      <span v-if="!isSubmitting">发送消息</span>
      <span v-else>发送中...</span>
    </button>

    <div v-if="submitSuccess" class="px-4 py-3 bg-emerald-500 text-white rounded-lg text-sm font-medium animate-slideIn shadow-md">
      ✓ 消息已发送，我会尽快回复您！
    </div>

    <div v-if="submitError" class="px-4 py-3 bg-red-500 text-white rounded-lg text-sm font-medium animate-slideIn shadow-md">
      ✗ 发送失败，请稍后重试
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { ContactFormData } from '@/types/project'

interface Emits {
  submit: [data: ContactFormData]
}

const emit = defineEmits<Emits>()

const formData = reactive<ContactFormData>({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const errors = reactive<Partial<Record<keyof ContactFormData, string>>>({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref(false)

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateForm = (): boolean => {
  let isValid = true

  errors.name = ''
  errors.email = ''
  errors.subject = ''
  errors.message = ''

  if (!formData.name.trim()) {
    errors.name = '请输入您的姓名'
    isValid = false
  } else if (formData.name.trim().length < 2) {
    errors.name = '姓名至少需要 2 个字符'
    isValid = false
  }

  if (!formData.email.trim()) {
    errors.email = '请输入您的邮箱'
    isValid = false
  } else if (!validateEmail(formData.email)) {
    errors.email = '请输入有效的邮箱地址'
    isValid = false
  }

  if (!formData.subject.trim()) {
    errors.subject = '请输入消息主题'
    isValid = false
  } else if (formData.subject.trim().length < 3) {
    errors.subject = '主题至少需要 3 个字符'
    isValid = false
  }

  if (!formData.message.trim()) {
    errors.message = '请输入消息内容'
    isValid = false
  } else if (formData.message.trim().length < 10) {
    errors.message = '消息内容至少需要 10 个字符'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  submitSuccess.value = false
  submitError.value = false

  try {
    // TODO: Replace with Formspree endpoint
    // const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // })
    // if (!response.ok) throw new Error('Submit failed')

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    emit('submit', { ...formData })

    formData.name = ''
    formData.email = ''
    formData.subject = ''
    formData.message = ''

    submitSuccess.value = true

    setTimeout(() => {
      submitSuccess.value = false
    }, 5000)
  } catch {
    submitError.value = true
    setTimeout(() => {
      submitError.value = false
    }, 5000)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style>
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideIn {
  animation: slideIn 0.3s ease;
}
</style>
