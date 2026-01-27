<template>
  <form class="contact-form" @submit.prevent="handleSubmit">
    <div class="contact-form__field">
      <label for="name" class="contact-form__label">姓名 *</label>
      <input
        id="name"
        v-model="formData.name"
        type="text"
        class="contact-form__input"
        :class="{ 'contact-form__input--error': errors.name }"
        placeholder="您的姓名"
        required
      />
      <span v-if="errors.name" class="contact-form__error">{{ errors.name }}</span>
    </div>

    <div class="contact-form__field">
      <label for="email" class="contact-form__label">邮箱 *</label>
      <input
        id="email"
        v-model="formData.email"
        type="email"
        class="contact-form__input"
        :class="{ 'contact-form__input--error': errors.email }"
        placeholder="your@email.com"
        required
      />
      <span v-if="errors.email" class="contact-form__error">{{ errors.email }}</span>
    </div>

    <div class="contact-form__field">
      <label for="subject" class="contact-form__label">主题 *</label>
      <input
        id="subject"
        v-model="formData.subject"
        type="text"
        class="contact-form__input"
        :class="{ 'contact-form__input--error': errors.subject }"
        placeholder="消息主题"
        required
      />
      <span v-if="errors.subject" class="contact-form__error">{{ errors.subject }}</span>
    </div>

    <div class="contact-form__field">
      <label for="message" class="contact-form__label">消息 *</label>
      <textarea
        id="message"
        v-model="formData.message"
        class="contact-form__textarea"
        :class="{ 'contact-form__textarea--error': errors.message }"
        placeholder="请输入您的消息..."
        rows="6"
        required
      />
      <span v-if="errors.message" class="contact-form__error">{{ errors.message }}</span>
    </div>

    <button
      type="submit"
      class="contact-form__submit"
      :disabled="isSubmitting"
      :class="{ 'contact-form__submit--loading': isSubmitting }"
    >
      <span v-if="!isSubmitting">发送消息</span>
      <span v-else>发送中...</span>
    </button>

    <div v-if="submitSuccess" class="contact-form__success">✓ 消息已发送，我会尽快回复您！</div>

    <div v-if="submitError" class="contact-form__error-message">✗ 发送失败，请稍后重试</div>
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

  // Reset errors
  errors.name = ''
  errors.email = ''
  errors.subject = ''
  errors.message = ''

  // Validate name
  if (!formData.name.trim()) {
    errors.name = '请输入您的姓名'
    isValid = false
  } else if (formData.name.trim().length < 2) {
    errors.name = '姓名至少需要 2 个字符'
    isValid = false
  }

  // Validate email
  if (!formData.email.trim()) {
    errors.email = '请输入您的邮箱'
    isValid = false
  } else if (!validateEmail(formData.email)) {
    errors.email = '请输入有效的邮箱地址'
    isValid = false
  }

  // Validate subject
  if (!formData.subject.trim()) {
    errors.subject = '请输入消息主题'
    isValid = false
  } else if (formData.subject.trim().length < 3) {
    errors.subject = '主题至少需要 3 个字符'
    isValid = false
  }

  // Validate message
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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Emit the form data
    emit('submit', { ...formData })

    // Reset form
    formData.name = ''
    formData.email = ''
    formData.subject = ''
    formData.message = ''

    submitSuccess.value = true

    // Hide success message after 5 seconds
    setTimeout(() => {
      submitSuccess.value = false
    }, 5000)
  } catch (error) {
    submitError.value = true
    setTimeout(() => {
      submitError.value = false
    }, 5000)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.contact-form__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-form__label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.contact-form__input,
.contact-form__textarea {
  padding: 12px 16px;
  border: 2px solid var(--border-default);
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--surface-1);
  color: var(--text-primary);
}

.contact-form__input:focus,
.contact-form__textarea:focus {
  outline: none;
  border-color: var(--primary-500);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
}

.contact-form__input--error,
.contact-form__textarea--error {
  border-color: var(--error-500);
}

.contact-form__input--error:focus,
.contact-form__textarea--error:focus {
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
}

.contact-form__textarea {
  resize: vertical;
  min-height: 120px;
}

.contact-form__error {
  font-size: 12px;
  color: var(--error-500);
}

.contact-form__submit {
  padding: 14px 28px;
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  align-self: flex-start;
}

.contact-form__submit:hover:not(:disabled) {
  background: var(--primary-600);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
}

.contact-form__submit:active:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.contact-form__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.contact-form__submit--loading {
  pointer-events: none;
}

.contact-form__success {
  padding: 12px 16px;
  background: var(--success-500);
  color: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  animation: slideIn 0.3s ease;
  box-shadow: var(--shadow-md);
}

.contact-form__error-message {
  padding: 12px 16px;
  background: var(--error-500);
  color: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  animation: slideIn 0.3s ease;
  box-shadow: var(--shadow-md);
}

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

@media (max-width: 768px) {
  .contact-form {
    gap: 20px;
  }

  .contact-form__submit {
    width: 100%;
  }
}
</style>
